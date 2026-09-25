// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { makeSitemapFilter } from './src/lib/noindex.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://kasradash.com',
  trailingSlash: 'ignore',
  // Moved 25 Sep 2026 when the SEO News silo was created (GitHub Pages: emitted as a meta-refresh page).
  redirects: {
    '/seo/technical-seo/google-spam-update-september-2026/': '/seo/news/google-spam-update-september-2026/',
  },
  // Pages with `noindex: true` frontmatter stay out of the sitemap (see src/lib/noindex.mjs).
  integrations: [sitemap({ filter: makeSitemapFilter() })],
  vite: {
    plugins: [tailwindcss()],
    // Local preview only: lets `astro preview` answer for the video-recording hostname.
    preview: { allowedHosts: ['new.kasradash.test'] },
  },
});