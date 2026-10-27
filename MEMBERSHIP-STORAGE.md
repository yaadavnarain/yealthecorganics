# Membership reservation storage

Only the membership form currently uses the dedicated `yealth-forms` Neon project
and `yealth_forms` database. Existing platform/class databases and Tally remain
separate. Additional forms require explicit validation, a distinct `form_type`,
and a separate narrowly granted submission function/role; this endpoint never
accepts arbitrary form types from a browser.

Vercel project `yealthecorganics` uses server-only `MEMBERSHIP_DATABASE_URL` with
the SQL-created `membership_ingest` role and `RESERVATION_STORAGE_MODE=neon`.
Never use a console-created administrative Neon role in this connection. Never
commit connection strings or put them in `NEXT_PUBLIC_` variables.

The role has schema usage and execute access to two functions only. It cannot
select records, insert directly, administer roles, or create databases. Schema
setup is in `lib/reservations/schema.sql`; create the limited role privately first.
Records are viewable/exportable only through the authenticated Neon owner console
or an authorized private database client. There is no public read/export API.

Submissions are atomically deduplicated by normalized email within the membership
form type. A retry of the same request key/payload returns the same outcome;
changed content with a previously saved key is rejected. Later submissions with
the same email retain the initial reservation rather than overwrite its data.

The API validates names, international phones, address bounds and an exact ranking
of all ten perks. It rejects cross-site/unapproved-host requests, bounds JSON
size, checks a signed expiring challenge, delay and honeypot, and enforces durable
15-minute per-client (40) and membership-wide (1000) request limits. Only keyed
client-IP digests, not raw IP addresses, enter rate buckets; expired buckets are
removed. Limits include challenges. These controls reduce abuse; they are not a
CAPTCHA or guarantee against sophisticated distributed bots.

Database failures fail closed with no successful reservation claim. The form
retains unsaved entries in React memory only and supports retry. Existing local
synthetic-only SQLite mode remains available outside Vercel for safe development.

No payments, marketing subscription, notifications, guaranteed activation, public
records dashboard, Tally migration, or new legal terms are introduced here.
