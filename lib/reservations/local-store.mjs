import { mkdir, chmod } from "node:fs/promises";
import { join, resolve, relative, isAbsolute } from "node:path";
import { randomUUID, createHash } from "node:crypto";

/**
 * Synthetic-preview adapter only. No public read/export endpoint exists.
 * A live adapter must provide atomic idempotency and contact deduplication too.
 */
export async function createLocalTestStore(directory, repositoryRoot) {
  const dir = resolve(directory);
  const withinRepository = relative(resolve(repositoryRoot), dir);
  if (!isAbsolute(directory) || !withinRepository.startsWith("..") || withinRepository === "") {
    throw new Error("Preview storage must be outside the repository.");
  }
  await mkdir(dir, { recursive: true, mode: 0o700 });
  const { DatabaseSync } = await import("node:sqlite");
  const file = join(dir, "synthetic-reservations.sqlite");
  const db = new DatabaseSync(file);
  await chmod(file, 0o600);
  db.exec(`PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY, contact_hash TEXT UNIQUE NOT NULL,
      payload TEXT NOT NULL, created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS receipts (
      request_key TEXT PRIMARY KEY, payload_hash TEXT NOT NULL,
      reservation_id TEXT NOT NULL REFERENCES reservations(id)
    );`);
  const digest = (value) => createHash("sha256").update(value).digest("hex");
  return {
    async save(value, requestKey) {
      const payload = JSON.stringify(value);
      const payloadHash = digest(payload);
      db.exec("BEGIN IMMEDIATE");
      try {
        const receipt = db.prepare("SELECT * FROM receipts WHERE request_key = ?").get(requestKey);
        if (receipt) {
          if (receipt.payload_hash !== payloadHash) {
            const conflict = new Error("Use a new request key after changing the form.");
            conflict.code = "IDEMPOTENCY_CONFLICT";
            throw conflict;
          }
          db.exec("COMMIT");
          return { id: receipt.reservation_id };
        }
        const contactHash = digest(value.email);
        const existing = db.prepare("SELECT id FROM reservations WHERE contact_hash = ?").get(contactHash);
        const id = existing ? existing.id : randomUUID();
        if (!existing) db.prepare("INSERT INTO reservations VALUES (?, ?, ?, ?)").run(id, contactHash, payload, new Date().toISOString());
        db.prepare("INSERT INTO receipts VALUES (?, ?, ?)").run(requestKey, payloadHash, id);
        db.exec("COMMIT");
        return { id };
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
    },
    close() { db.close(); },
  };
}
