// Issue #1: read-only migration boundary preflight. No network or deploy.
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';
const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const checks = [
  [
    "wrangler.jsonc",
    [
      "@astrojs/cloudflare/entrypoints/server",
      "global_fetch_strictly_public",
      "ASSETS"
    ]
  ],
  [
    "astro.config.mjs",
    [
      "adapter: cloudflare()"
    ]
  ],
  [
    "package.json",
    [
      "wrangler types"
    ]
  ]
];
for (const [path, tokens] of checks) {
  const content = read(path);
  for (const token of tokens) assert.ok(content.includes(token), path + ' missing: ' + token);
}
console.log("puppy_starter_guide migration boundary preflight PASS; cloud deployment/parity NOT tested");
