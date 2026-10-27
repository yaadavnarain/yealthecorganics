import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { MEMBERSHIP_PERKS, GREEN_PERKS } from "../lib/membership-perks.mjs";
import { validateReservation, movePerk, PERK_IDS } from "../lib/reservations/validation.mjs";
import { createReservationHandler } from "../lib/reservations/handler.mjs";
import { createLocalTestStore } from "../lib/reservations/local-store.mjs";
import { isReservationRoot } from "../lib/reservations/routing.mjs";

const valid = () => ({ firstName: "Test", lastName: "Person", email: "TEST@example.com", phone: "+230 5000 0000", address: "TEST synthetic street, Mauritius", ranking: [...PERK_IDS], rankingConfirmed: true });
const localUrl = "http://127.0.0.1:3100/api/membership-reservations";

test("only the exact future form hostname root is rewritten; main site and other paths stay unchanged", () => {
  const local = new URL("http://localhost:3100/");
  assert.equal(isReservationRoot(local, "membership.yealth.mu"), true);
  assert.equal(isReservationRoot(local, "yealth.mu"), false);
  assert.equal(isReservationRoot(local, "membership.yealth.mu.evil.example"), false);
  assert.equal(isReservationRoot(new URL("https://membership.yealth.mu/api/membership-reservations"), null), false);
  assert.equal(isReservationRoot(new URL("https://membership.yealth.mu/"), null), true);
});

test("normalizes contact values; supports names with accents and apostrophes", () => {
  const result = validateReservation({ ...valid(), firstName: " Élise ", lastName: "O’Connor" });
  assert.equal(result.ok, true);
  assert.equal(result.value.email, "test@example.com");
  assert.equal(result.value.phone, "+23050000000");
  assert.equal(result.value.firstName, "Élise");
});

test("rejects invalid contacts, oversized fields and markup without reflecting values", () => {
  for (const patch of [{ firstName: "<script>" }, { lastName: "x".repeat(81) }, { email: "a@b" }, { phone: "++15555555" }, { address: "short" }, { address: "a".repeat(501) }]) {
    const result = validateReservation({ ...valid(), ...patch });
    assert.equal(result.ok, false);
    assert.ok(!JSON.stringify(result.errors).includes("<script>"));
  }
});

test("accepts local and international phone formats without a fixed country code", () => {
  for (const [phone, normalized] of [["5000 0000", "50000000"], ["+1 (202) 555-0100", "+12025550100"], ["+44 20 7946 0100", "+442079460100"]]) {
    const result = validateReservation({ ...valid(), phone });
    assert.equal(result.ok, true);
    assert.equal(result.value.phone, normalized);
  }
  for (const phone of ["", "123456", "+1234567890123456", "phone number", "++12025550100", "1".repeat(41)]) {
    assert.equal(validateReservation({ ...valid(), phone }).ok, false);
  }
});

test("requires an exact permutation of ten perks and affirmative ranking confirmation", () => {
  for (const ranking of [[], PERK_IDS.slice(0, 9), [...PERK_IDS.slice(0, 9), PERK_IDS[0]], [...PERK_IDS.slice(0, 9), "other"]]) {
    assert.equal(validateReservation({ ...valid(), ranking }).ok, false);
  }
  assert.equal(validateReservation({ ...valid(), rankingConfirmed: false }).ok, false);
  assert.equal(validateReservation({ ...valid(), ranking: [...PERK_IDS].reverse() }).ok, true);
});

test("keyboard/touch move operations preserve every perk exactly once and respect boundaries", () => {
  const reordered = movePerk(PERK_IDS, "ugc", -1);
  assert.equal(reordered[0], "ugc");
  assert.deepEqual([...reordered].sort(), [...PERK_IDS].sort());
  assert.deepEqual(movePerk(PERK_IDS, PERK_IDS[0], -1), PERK_IDS);
  assert.deepEqual(movePerk(PERK_IDS, PERK_IDS[9], 1), PERK_IDS);
  assert.deepEqual(movePerk(PERK_IDS, "missing", 1), PERK_IDS);
  assert.deepEqual(movePerk(PERK_IDS, PERK_IDS[0], 100), PERK_IDS);
  assert.equal(MEMBERSHIP_PERKS.length, 10);
  assert.deepEqual([...GREEN_PERKS].sort(), ["discounted-groceries", "nutritious-food", "partner-deals"]);
});

async function fixture(options = {}) {
  let clock = 100000;
  const saves = [];
  const handler = createReservationHandler({ store: { async save(value, key) { saves.push({ value, key }); return { id: "test-id" }; } }, now: () => clock, ...options });
  const challenge = await handler(new Request(localUrl));
  const { token } = await challenge.json();
  clock += 3000;
  const payload = { ...valid(), token, requestKey: randomUUID(), website: "", syntheticOnly: true };
  const post = (patch = {}, headers = {}, url = localUrl) => handler(new Request(url, { method: "POST", headers: { "content-type": "application/json", origin: "http://127.0.0.1:3100", ...headers }, body: JSON.stringify({ ...payload, ...patch }) }));
  return { handler, post, payload, saves, advance(ms) { clock += ms; } };
}

test("accepts synthetic local submission, returns no contact data and no cacheable response", async () => {
  const f = await fixture();
  const response = await f.post({ phone: "+1 (202) 555-0100" });
  assert.equal(response.status, 201);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const body = await response.json();
  assert.equal(body.mode, "local-test");
  assert.ok(!JSON.stringify(body).includes("example.com"));
  assert.equal(f.saves.length, 1);
  assert.equal(f.saves[0].value.phone, "+12025550100");
});

test("rejects cross-site writes and never enables local storage on a public hostname", async () => {
  const f = await fixture();
  assert.equal((await f.post({}, { origin: "https://unrelated.example" })).status, 403);
  assert.equal((await f.post({}, { "sec-fetch-site": "cross-site" })).status, 403);
  assert.equal((await f.handler(new Request("https://membership.yealth.mu/api/membership-reservations"))).status, 503);
  assert.equal(f.saves.length, 0);
});

test("accepts Next's internal localhost normalization only when browser Host and Origin match", async () => {
  const f = await fixture();
  const response = await f.handler(new Request(localUrl.replace("127.0.0.1", "localhost"), {
    method: "POST", headers: { "content-type": "application/json", host: "127.0.0.1:3100", origin: "http://127.0.0.1:3100" },
    body: JSON.stringify(f.payload),
  }));
  assert.equal(response.status, 201);
  assert.equal((await f.post({}, { host: "evil.example", origin: "http://evil.example" })).status, 503);
});

test("requires signed, unexpired challenge, time delay, empty honeypot and synthetic-only values", async () => {
  const f = await fixture();
  for (const patch of [{ token: "bad" }, { token: "a.b.c" }, { website: "spam" }, { syntheticOnly: false }, { email: "person@actual-domain.mu" }, { address: "A real-looking residential address" }]) {
    assert.ok((await f.post(patch)).status >= 400);
  }
  f.advance(31 * 60 * 1000);
  assert.equal((await f.post()).status, 400);
  const fast = await fixture({ minimumDelayMs: 10000 });
  assert.equal((await fast.post()).status, 400);
  assert.equal(f.saves.length, 0);
});

test("rejects malformed/oversized JSON, wrong content type, unsupported methods and invalid rankings", async () => {
  const f = await fixture();
  assert.equal((await f.post({}, { "content-type": "text/plain" })).status, 415);
  assert.equal((await f.post({ address: "x".repeat(9000) })).status, 413);
  assert.equal((await f.handler(new Request(localUrl, { method: "POST", headers: { "content-type": "application/json" }, body: "{" }))).status, 400);
  assert.equal((await f.handler(new Request(localUrl, { method: "PUT" }))).status, 405);
  assert.equal((await f.post({ ranking: ["ugc"] })).status, 422);
  assert.equal(f.saves.length, 0);
});

test("rate limits include challenge requests and return retry guidance", async () => {
  const f = await fixture({ requestLimit: 2 });
  assert.equal((await f.post()).status, 201);
  const response = await f.post();
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "900");
});

test("storage failures return truthful failure, never a successful reservation", async () => {
  const f = await fixture({ store: { async save() { throw new Error("private database location"); } } });
  const response = await f.post();
  assert.equal(response.status, 503);
  assert.ok(!(await response.text()).includes("private database location"));
});

test("local durable adapter deduplicates retries and contacts, detects changed idempotency payloads, survives reopen", async () => {
  const directory = await mkdtemp(join(tmpdir(), "yealth-reservation-test-"));
  let store;
  try {
    store = await createLocalTestStore(directory, process.cwd());
    const value = validateReservation(valid()).value;
    const first = await store.save(value, "key-a");
    assert.deepEqual(await store.save(value, "key-a"), first);
    assert.deepEqual(await store.save({ ...value, firstName: "Different" }, "key-b"), first);
    await assert.rejects(store.save({ ...value, phone: "+23055555555" }, "key-a"), { code: "IDEMPOTENCY_CONFLICT" });
    store.close();
    store = await createLocalTestStore(directory, process.cwd());
    assert.deepEqual(await store.save(value, "key-a"), first);
    await assert.rejects(createLocalTestStore(process.cwd(), process.cwd()));
    await assert.rejects(createLocalTestStore(join(process.cwd(), "public", "data"), process.cwd()));
  } finally {
    store?.close();
    // directory is the verified, randomly-created test-only temp directory.
    assert.ok(directory.startsWith(join(tmpdir(), "yealth-reservation-test-")));
    await rm(directory, { recursive: true, force: true });
  }
});

test("live challenges survive separate server instances and accept valid real-format contacts", async () => {
  let time = 100000;
  const saved = [];
  const options = { mode: "live", signingSecret: "synthetic-test-secret-not-for-deployment", allowedHosts: ["membership.yealth.mu"], now: () => time,
    store: { async allow() { return true; }, async save(value) { saved.push(value); } } };
  const first = createReservationHandler(options);
  const second = createReservationHandler(options);
  const endpoint = "https://membership.yealth.mu/api/membership-reservations";
  const challenge = await first(new Request(endpoint));
  const { token, mode } = await challenge.json();
  assert.equal(mode, "live");
  time += 3000;
  const response = await second(new Request(endpoint, { method: "POST", headers: { origin: "https://membership.yealth.mu", "content-type": "application/json" },
    body: JSON.stringify({ ...valid(), email: "synthetic-fixture@yealth.invalid", address: "Synthetic integration fixture address", token, website: "", requestKey: randomUUID() }) }));
  assert.equal(response.status, 201);
  assert.equal((await response.json()).mode, "live");
  assert.equal(saved.length, 1);
});

test("live mode rejects unapproved hosts, cross-site writes and insecure URLs", async () => {
  const handler = createReservationHandler({ mode: "live", signingSecret: "test-secret", allowedHosts: ["membership.yealth.mu"], store: { async allow() { return true; } } });
  for (const url of ["https://evil.example/api/membership-reservations", "http://membership.yealth.mu/api/membership-reservations"]) {
    assert.equal((await handler(new Request(url))).status, 403);
  }
  assert.equal((await handler(new Request("https://membership.yealth.mu/api/membership-reservations", { headers: { origin: "https://evil.example" } }))).status, 403);
  assert.throws(() => createReservationHandler({ mode: "live", store: {} }));
});

test("live mode uses persistent rate limits without retaining raw IPs and fails closed on storage errors", async () => {
  let key;
  const options = { mode: "live", signingSecret: "test-secret", allowedHosts: ["membership.yealth.mu"], store: { async allow(value) { key=value; return false; } } };
  const request = () => new Request("https://membership.yealth.mu/api/membership-reservations", { headers: { "x-vercel-forwarded-for": "192.0.2.1" } });
  assert.equal((await createReservationHandler(options)(request())).status, 429);
  assert.match(key, /^[a-f0-9]{64}$/);
  assert.ok(!key.includes("192.0.2.1"));
  options.store.allow = async () => { throw new Error("private configuration"); };
  const response = await createReservationHandler(options)(request());
  assert.equal(response.status, 503);
  assert.ok(!(await response.text()).includes("private configuration"));
});
