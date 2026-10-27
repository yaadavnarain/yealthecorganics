import { neon } from "@neondatabase/serverless";
import { createHash } from "node:crypto";

export function createAgribusinessStore(connectionString) {
  const connection = new URL(connectionString);
  if (!connection.hostname.endsWith(".neon.tech") || connection.username !== "membership_ingest" || connection.pathname !== "/yealth_forms") {
    throw new Error("Use the dedicated restricted forms connection.");
  }
  const query = () => neon(connectionString, { fetchOptions: { cache: "no-store", signal: AbortSignal.timeout(10000) } });
  const digest = (value) => createHash("sha256").update(value).digest("hex");
  return {
    async allow(key) {
      const sql = query();
      const rows = await sql`SELECT forms.agribusiness_rate_limit(${key}) AS allowed`;
      return rows[0]?.allowed === true;
    },
    async save(value, requestKey) {
      const sql = query();
      const payload = JSON.stringify(value);
      try {
        const rows = await sql`SELECT forms.save_agribusiness(${requestKey}::uuid, ${digest(payload)}, ${digest(value.email)}, ${payload}::jsonb) AS id`;
        return { id: rows[0].id };
      } catch (error) {
        if (error.code === "P0001" && error.message === "IDEMPOTENCY_CONFLICT") {
          const conflict = new Error("The request changed after saving.");
          conflict.code = "IDEMPOTENCY_CONFLICT";
          throw conflict;
        }
        throw new Error("Reservation storage failed.");
      }
    },
  };
}
