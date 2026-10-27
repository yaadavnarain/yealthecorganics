# Membership preview

This branch adds the benefits page at `/membership` and the native reservation
form at `/membership/reserve`. Both benefits-page CTAs use the relative form
route, so preview visitors never go to an unconfigured custom domain. Tally is
preserved and no existing responses are migrated or deleted.

## What works locally

- Shared approved ten-perk copy, explicit ranking confirmation, keyboard and
  touch Move up/Move down buttons, announced priority and focus after a move.
- Client and server field validation, fixed-size JSON input, same-origin checks,
  signed time-limited challenge with minimum delay, honeypot and process-wide
  attempt budget. These measures are test-preview controls, not a claim of
  distributed production spam protection.
- Transactional synthetic-only SQLite storage using Node's built-in driver.
  Unique normalized contact digest prevents a second record for the same email.
  A receipt key makes retries idempotent; reusing that key for a changed payload
  returns a conflict. Duplicate contacts are not overwritten or disclosed.
- Failure preserves client entries; success explicitly says no real reservation
  was made. Responses do not reflect contact details. No email or payment is sent.
- Form data is held in component memory, never browser local storage. Local
  database files stay outside the repository and web root. No public data-read
  or export endpoint is provided. Existing legal pages remain unchanged.
- Existing main horizontal logo and favicon; dedicated branded social images.

## Local configuration

Storage defaults to disabled. For a local synthetic test, set server-process
variables `RESERVATION_STORAGE_MODE=local-test` and `RESERVATION_TEST_DIR` to an
absolute private temporary directory outside this repository. The current
review server uses the laptop's temporary directory, in
`yealth-membership-preview-2026-10-26`.

Use a made-up email ending in example.com, example.net or example.org, and begin
the made-up address with TEST. The server enforces these rules and the preview
attestation. Public hostnames and Vercel deployments fail closed even if those
local-test variables are copied there. Do not collect real reservations yet.
Node 24 is used locally. A production adapter and runtime must be agreed before
release; local filesystem storage is not a durable Vercel database.

`npm test` covers malformed/oversized input, contacts, exact ranking permutation,
normalization, cross-origin writes, local host normalization, public-host refusal,
challenge tampering/expiry/delay, honeypot, synthetic-only enforcement, throttling,
save failure, atomic deduplication, idempotency conflict and persistence on reopen.

The normal build is `npm run build`. Windows application control on this laptop
blocks the native SWC module. Local verification uses the official matching
WASM compiler, installed without changing package.json/lockfile, and webpack.
No OS protections were changed. This local workaround is not committed as a
deployment dependency.

## Live release requirements (not performed)

1. Approve and implement durable server-only storage, retention, backup, contact
   deduplication and idempotency in a shared transaction. No website database or
   admin authentication exists in the inspected repository. The adapter boundary
   is `store.save(value, requestKey)`; production integration remains absent.
2. Approve an authenticated administrator/export flow and audit/access controls.
   Do not expose an unauthenticated JSON or CSV download. Confirm distributed
   throttling and a stable shared challenge mechanism for multiple server workers.
3. Approve the final field-purpose/privacy wording and membership/perk terms.
   Existing privacy text omits address/ranking and still names cloud.mu hosting.
   Review analytics/session-recording behavior before any real personal data.
   The preview form carries masking attributes but that is not legal clearance.
4. Resolve the remote-branch/Vercel Preview approval blocker, deploy and test the
   exact feature commit on Preview first. Do not merge to main or use `--prod`
   without the separate release approval.
5. After domain approval, add `membership.yealth.mu` to the verified existing
   Vercel project `yealthecorganics`. Use the exact DNS target Vercel supplies;
   no target has been invented or assigned in this branch.
6. In the Cloud.mu DNS zone, add only the `membership` CNAME to that supplied
   target and any specifically requested verification record. Public DNS reads
   on 26 October 2026 found nameservers ns1/ns2/ns3.cloud.mu and NXDOMAIN for
   membership.yealth.mu. Do not change apex, mail, MX, SPF/DKIM/DMARC or nameservers.
7. Host-specific proxy code rewrites only the root of membership.yealth.mu to
   `/membership/reserve`. Preview and the main host retain their existing paths.
   Once domain, TLS, storage and privacy checks pass, approve changing the two
   CTAs to the final HTTPS subdomain and removing preview-only gates/noindex.

The custom-host proxy and local API must be rechecked against the chosen live
adapter before release. This branch does not connect a production database,
grant permissions, add a domain, change DNS or replace Tally data.
