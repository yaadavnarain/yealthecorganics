# Agribusiness reservation storage

The new `/api/agribusiness-reservations` endpoint stores contact details and one numeric `contribution` choice (1500, 3000 or 4500), never membership rankings. The contribution is stated potential only, not a payment instruction or binding commitment.

Reuse the existing dedicated `yealth-forms` database and server-only `MEMBERSHIP_DATABASE_URL`. Add the reviewed migration `lib/reservations/agribusiness-schema.sql` only after approval for the two additional execute grants to the existing restricted `membership_ingest` role. No new credentials, table read permission, direct insert permission or unrelated database access is needed. No membership function is replaced.

Records and idempotency receipts use separate `agribusiness-reservation` form types. Transactions serialize duplicate request/contact writes. Repeat contacts retain their initial record; changed request-key retries return 409. Separate durable rate buckets enforce 40 requests per client and 1000 globally per 15 minutes; only keyed digests are stored. The API exposes no records read endpoint. GET creates a signed, time-limited challenge only. Same-origin/HTTPS checks, minimum delay, honeypot and an 8KB limit apply. Errors retain client entries and never claim success on storage failure.

The exact `agribusiness.yealth.mu` hostname root rewrites to `/agribusiness/reserve`; the homepage, membership host and existing paths retain their current behavior. Vercel assignment and the verified CNAME record must be configured before enabling the public benefits-page links. Never commit connection strings or submitted records.
