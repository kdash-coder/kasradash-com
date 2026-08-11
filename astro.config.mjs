// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { makeSitemapFilter } from './src/lib/noindex.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://kasradash.com',
  trailingSlash: 'ignore',
  // Pages with `noindex: true` frontmatter stay out of the sitemap (see src/lib/noindex.mjs).
  integrations: [sitemap({ filter: makeSitemapFilter() })],
  vite: {
    plugins: [tailwindcss()],
  },
});