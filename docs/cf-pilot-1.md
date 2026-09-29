# Issue #1: Cloudflare cf staging gate

Standard: https://github.com/sibukixxx/techvit-platform/issues/21 . Initial evaluation version: `cf@1.0.0-beta.5` (pin, not proof of staging support). Keep the existing Wrangler commands as fallback.

Run `pnpm cf:pilot:verify` (read-only source invariant preflight). It **does not** deploy, run integration tests, authenticate with Cloudflare or prove parity. Inspect pinned `cf --help`, `cf cli search`, and `cf migrate --help` before running the beta migration in a separate test environment. Review the full generated config diff; never commit secrets or assume unsupported features are retained.

Astro Cloudflare SSR Worker, not a static upload. Run pnpm typecheck/test/build. Preserve adapter entrypoint, global_fetch_strictly_public, ASSETS, observability and Wrangler types during beta. Compare SSR route, static file, 404, sitemap, mobile generator and per-route cache on isolated preview. No release until runtime parity and rollback ID are recorded.

Gate: record baseline main SHA, local checks, staging identity, cf/old Wrangler command matrix, route/binding/secret parity, HTTP responses, rollback release ID, and production approval. Do not mutate production from a feature branch or automate remote D1/route/DNS changes. No remote cf deployment executed by this PR.
