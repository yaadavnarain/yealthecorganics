import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { validateReservation, isSyntheticReservation } from "./validation.mjs";

const MAX_BODY = 8192;
const TOKEN_AGE = 30 * 60 * 1000;

export function createReservationHandler({ store, now = () => Date.now(), minimumDelayMs = 2000, requestLimit = 40,
  mode = "local-test", signingSecret = /** @type {string | Buffer | undefined} */ (undefined), allowedHosts = /** @type {string[]} */ ([]) }) {
  if (mode !== "local-test" && (mode !== "live" || !signingSecret || !allowedHosts.length || !store.allow)) throw new Error("Incomplete live configuration.");
  const secret = signingSecret || randomBytes(32);
  let windowStart = now();
  let attempts = 0;
  const sign = (text) => createHmac("sha256", secret).update(text).digest("hex");
  const reply = (status, body, extra = {}) => Response.json(body, {
    status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...extra },
  });
  return async function handle(request) {
    const url = new URL(request.url);
    // Next can normalize its internal URL to localhost while the browser uses
    // 127.0.0.1. Compare Origin to the actual Host and require both to be local.
    let external;
    try { external = new URL(`${url.protocol}//${request.headers.get("host") || url.host}`); }
    catch { return reply(400, { message: "Invalid request host." }); }
    const origin = request.headers.get("origin");
    if (origin && origin !== external.origin || request.headers.get("sec-fetch-site") === "cross-site") {
      return reply(403, { message: "Open the form on this website and try again." });
    }
    // Local-only adapter: never accept real contacts on a public preview host.
    if (mode === "local-test" && ![url.hostname, external.hostname].every((host) => ["localhost", "127.0.0.1", "[::1]"].includes(host))) {
      return reply(503, { message: "Live reservation storage is not connected. No details were saved." });
    }
    if (mode === "live" && (external.protocol !== "https:" || !allowedHosts.includes(external.hostname))) {
      return reply(403, { message: "Open the form on this website and try again." });
    }
    if (now() - windowStart > 15 * 60 * 1000) { windowStart = now(); attempts = 0; }
    if (mode === "local-test" && ++attempts > requestLimit) return reply(429, { message: "Too many attempts. Please try again later." }, { "Retry-After": "900" });
    if (mode === "live") {
      // Vercel supplies this header. Persist only a keyed digest, never raw IPs.
      const client = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      try {
        if (!await store.allow(sign(`membership-rate:${client}`))) return reply(429, { message: "Too many attempts. Please try again later." }, { "Retry-After": "900" });
      } catch { return reply(503, { message: "Reservation storage is unavailable. No details were saved." }); }
    }
    if (request.method === "GET") {
      const value = `${randomUUID()}.${now()}`;
      return reply(200, { token: `${value}.${sign(value)}`, mode });
    }
    if (request.method !== "POST") return reply(405, { message: "Method not allowed." }, { Allow: "GET, POST" });
    if (!request.headers.get("content-type")?.startsWith("application/json")) return reply(415, { message: "Send this form as JSON." });
    const length = Number(request.headers.get("content-length") || 0);
    if (length > MAX_BODY) return reply(413, { message: "The form is too large." });
    let body;
    try {
      const reader = request.body?.getReader();
      if (!reader) return reply(400, { message: "The form is empty." });
      const chunks = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BODY) { await reader.cancel(); return reply(413, { message: "The form is too large." }); }
        chunks.push(Buffer.from(value));
      }
      body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch { return reply(400, { message: "The form could not be read. Please try again." }); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return reply(400, { message: "Check the form and try again." });
    if (typeof body.website !== "string" || body.website.length) return reply(400, { message: "The form could not be accepted." });
    const parts = typeof body.token === "string" ? body.token.split(".") : [];
    const text = parts.slice(0, 2).join(".");
    const signature = parts[2] || "";
    const age = now() - Number(parts[1]);
    if (parts.length !== 3 || !/^[a-f0-9]{64}$/.test(signature) || !Number.isFinite(age) ||
        age < minimumDelayMs || age > TOKEN_AGE || !timingSafeEqual(Buffer.from(signature), Buffer.from(sign(text)))) {
      return reply(400, { message: "Please refresh the form and allow a moment before submitting." });
    }
    const validation = validateReservation(body);
    if (!validation.ok) return reply(422, { message: "Please check the highlighted fields.", errors: validation.errors });
    if (mode === "local-test" && (body.syntheticOnly !== true || !isSyntheticReservation(validation.value))) {
      return reply(422, { message: "Preview accepts made-up details only: use an example.com email and start the address with TEST." });
    }
    const requestKey = body.requestKey;
    if (typeof requestKey !== "string" || !/^[a-f0-9-]{36}$/i.test(requestKey)) return reply(400, { message: "Refresh the form and try again." });
    try {
      await store.save(validation.value, requestKey);
      // Same response for new contacts and deduplicated retries.
      return reply(201, { mode, message: mode === "live" ? "Your membership reservation has been received." : "Test details saved locally. No real reservation was made." });
    } catch (error) {
      if (error.code === "IDEMPOTENCY_CONFLICT") return reply(409, { message: "The form changed after an earlier attempt. Refresh before trying again." });
      return reply(503, { message: "Could not save your details. They remain in the form; please try again." });
    }
  };
}
