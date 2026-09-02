// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://puppy-starter-guide.takada1583.workers.dev',

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare(),
  integrations: [react(), sitemap()]
});