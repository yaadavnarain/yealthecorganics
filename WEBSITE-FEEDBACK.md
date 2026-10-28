# Website Copy Feedback

The additive `/website-feedback` page is served at the root of
`websitefeedback1.yealth.mu` through an exact-host rewrite. Existing pages and
reservation forms keep their current behavior.

The approved eight questions collect no name, phone or email. Five written fields
accept Unicode and Creole text. Answers are stored as text, never rendered as HTML.
No anonymity promise is made.

## Storage and access

Apply `lib/feedback/schema.sql` as the existing forms owner, first on an isolated
test branch. Feedback uses `forms.website_feedback` and its own rate-limit buckets.
It does not use reservation tables, CRM synchronization, or email delivery.

After specific permission approval, grant the existing `membership_ingest` role
EXECUTE only on `forms.website_feedback_rate_limit(text)` and
`forms.save_website_feedback(uuid,text,jsonb)`. No new credential, record-reading
access, or direct table writes are needed. The API reuses the protected server-only
forms connection, verifies its host/database/role, and fails closed when unavailable.
Never place that connection in client code or source control.

## Validation and retries

Client, API and database validate required questions and enum choices. The API
requires an approved HTTPS host, same-origin JSON, a signed short-lived challenge,
minimum completion delay, empty spam trap and bounded request size. Persistent
limits use keyed network-address digests rather than raw addresses (40 requests per
15 minutes per digest, 1,000 globally). GET challenges count toward the limits.

Each request has a UUID. Retrying the same answer payload returns the same receipt;
reusing its UUID with changed answers is rejected. The UI disables duplicate clicks
and retains answers and the UUID after uncertain network failures. Editing answers
starts a new request. There is no public response-list endpoint.

## Verification

Run `npm test` and the project build, then test mobile/desktop layout, all required
answers, Creole input, a synthetic submission and private owner readback, duplicate
retry and changed-payload rejection, restricted role privileges, exact subdomain
routing, HTTPS and unchanged reservation pages. Keep synthetic fixtures visibly
prefixed TEST. Publish through a draft PR before production release.
