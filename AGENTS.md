# Puppy Starter Guide

Astro + Cloudflare content site. Keep the site static-first and the package/tooling boundary small.

## Commands
- `pnpm install`
- `pnpm dev`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm generate-types` — refresh Wrangler types when bindings change

## Shared rules
- Use pnpm as declared by `package.json`; do not add npm/yarn lockfiles.
- Keep content claims clearly separated from generated/site mechanics.
- Wrangler binding/type changes must keep generated types in sync.
- Do not deploy or mutate remote Cloudflare resources unless explicitly requested.

## Change-dependent checks
- Content/component changes: `pnpm typecheck && pnpm test && pnpm build`.
- Wrangler/binding changes: also `pnpm generate-types` and re-run typecheck.

## Done
- Applicable local checks pass.
- Cloudflare types are current when bindings changed.
- No remote mutation was used as a completion check.
