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
    // Local preview only: lets `astro preview` answer for the video-recording hostname.
    preview: { allowedHosts: ['new.kasradash.test'] },
  },
});