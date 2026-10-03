# Puppy Starter Guide

<!-- ecosystem-expansion:v1 -->
## Expansion contract

This repository is one capability owner in the TechVit ecosystem. New ideas should extend the existing graph before creating another silo.

**Canonical responsibility:** pet/puppy media / validation vertical

When new work appears:

1. **Extend here** when the new behavior belongs to this repository's canonical responsibility.
2. **Integrate, don't copy** when another repository owns the concept. Exchange versioned API/artifact/event references; do not share databases or import another product's internals.
3. **Promote reusable capability only after real reuse appears.** Keep the first vertical slice close to its product; extract a common core when there are at least two real consumers or a deliberate public/private boundary.
4. **Create a new repository only** for a distinct product/vertical with its own lifecycle, deployment/security boundary, or OSS/commercial boundary. Its README must declare upstream/downstream owners from day one.
5. **Experiments may end without losing the asset.** Move validated rules, contracts, fixtures, and learnings into the canonical owner, then freeze/archive the duplicate implementation.

**Route new work:** 新しい記事・offer experimentは同じmedia funnelへ追加し、共通distribution/productionはAffiliateMediaOSへ寄せる。

Cross-cutting owners: TechVit Admin = company operations; TechVit Platform = shared cloud/bootstrap/identity; Insight = research semantics; techvit-insight = managed research; Relayboard = work execution; AI Allowance Guard = privileged-action authority; EC Hub = commerce; AffiliateMediaOS/VideoForge = content production; ja-company-* = company-data/outreach producers; public/product sites = acquisition surfaces.

If ownership is unclear, implement the smallest vertical slice in the nearest existing owner first. Extract only when actual reuse proves the boundary.
<!-- /ecosystem-expansion:v1 -->

Practical guides, checklists and tools for first-time puppy owners. Content site built with
Astro, deployed to Cloudflare Workers.

**Live:** https://puppy-starter-guide.takada1583.workers.dev

## Overview

Puppy Starter Guide targets first-time puppy owners searching for practical help (feeding,
potty training, sleep, daily routines) discovered mostly via Pinterest. The MVP validates
whether that traffic converts to outbound/affiliate clicks before investing in more content.
See the project brief for full context and phased roadmap.

## Architecture

- **Astro 7** (static output) + TypeScript (strict)
- **Tailwind CSS v4** (via `@tailwindcss/vite`) + `@tailwindcss/typography` for article prose
- **React** only where interactivity is needed (the schedule generator tool)
- **Content Collections** (`src/content.config.ts`) for guide articles in `src/content/guides/`
- **Cloudflare Workers** via `@astrojs/cloudflare`, deployed with Wrangler (static assets +
  Worker entrypoint, not Pages)
- **Vitest** for pure-logic unit tests (currently: the schedule generator)

## Development

```sh
pnpm install
pnpm dev              # http://localhost:4321
```

## Build

```sh
pnpm build            # outputs to ./dist
pnpm preview          # preview the production build locally
```

## Quality checks

```sh
pnpm typecheck        # astro check (TypeScript + Astro template diagnostics)
pnpm test             # vitest unit tests
pnpm build            # must succeed with 0 errors
```

## Deploy

Deploys to Cloudflare Workers via Wrangler. Requires `wrangler login` once per machine (or a
`CLOUDFLARE_API_TOKEN` in CI).

```sh
pnpm build
pnpm exec wrangler deploy
```

`wrangler.jsonc` defines the Worker name, static asset binding, and observability settings.
`astro.config.mjs`'s `site` field must match the deployed URL (used for canonical URLs and the
sitemap).

## Content Writing — Adding a New Article

1. Create `src/content/guides/<slug>.md` (the filename becomes the URL slug under `/guides/`).
2. Fill in frontmatter (see any existing guide for the full shape): `title`, `description`,
   `publishedAt`, `updatedAt`, `category`, `tags`, `author`, `affiliate`, `draft`, and
   optionally `featuredImage` / `pinterestImage` / `pinterestTitle` / `pinterestDescription`.
3. Write the body in Markdown. Set `affiliate: true` if the article contains affiliate links —
   this automatically renders the disclosure banner near the top of the page.
4. Link to at least one other guide or the schedule generator tool (internal linking / topic
   clusters — see the project brief, §17).
5. `draft: true` excludes the article from `/guides/`, the homepage, and the sitemap without
   deleting the file.

## Adding an Affiliate Link

Never hardcode affiliate URLs in article Markdown. Add the offer to
`src/lib/affiliate.ts`:

```ts
export const affiliateLinks = {
  myNewOffer: {
    url: 'https://partner.example.com/offer',
    provider: 'partner-name',
    campaign: 'campaign-name',
  },
};
```

Then reference it with `buildAffiliateUrl('myNewOffer', 'unique-tracking-id')` — for example via
the `<AffiliateCta />` component (`src/components/affiliate/AffiliateCta.astro`), which also
tags the link with `data-affiliate-link` for analytics and opens it with `rel="sponsored"`.

## Adding a Pinterest Pin

1. Export the pin image at 1000×1500px and save it to `public/pinterest/`.
2. Reference it from the article's frontmatter via `pinterestImage`.
3. Aim for at least 3 pin variants per article (different hooks/titles pointing at the same
   URL with different `utm_content` values — see §18/§23 of the project brief).

## Analytics

`src/lib/analytics.ts` exposes `trackEvent()` for `page_view`, `article_view`, `tool_start`,
`tool_complete`, and `affiliate_click` events, pushed to `window.dataLayer` for Cloudflare Web
Analytics. Affiliate link clicks should always fire `affiliate_click` with `article_slug`,
`affiliate_provider`, `product`, `position`, and `source`.

## Environment Variables

None required for the current MVP (no database, no external APIs). Cloudflare bindings
(`SESSION` KV, `IMAGES`) are provisioned automatically by the Cloudflare adapter and configured
in `wrangler.jsonc`.

## Known follow-ups (not yet implemented)

- GitHub Actions CI (lint/typecheck/build gate on PRs)
- Playwright E2E smoke tests
- Real Pinterest pin assets and Cloudflare Web Analytics snippet wiring
- Custom domain (currently on the `*.workers.dev` subdomain)
