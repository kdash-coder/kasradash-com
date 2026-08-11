/**
 * Noindex wiring, sitemap side. Q6 owns content.config.ts and adds the optional
 * `noindex` frontmatter flag; this module scans the RAW article frontmatter for
 * `noindex: true` so astro.config.mjs can exclude those URLs from the sitemap.
 * (The on-page <meta name="robots" content="noindex,follow"> half is wired through
 * Seo.astro via the layouts.)
 *
 * Plain .mjs with no dependencies so astro.config.mjs can import it directly.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Non-content pages to keep out of the sitemap, as site-relative paths. */
const STATIC_NOINDEX_PATHS = [];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

function frontmatterOf(file) {
  const text = readFileSync(file, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : '';
}

/** Normalise to a bare path with leading + trailing slash: "/quick-reads/thank-you/". */
function normalisePath(value) {
  let p = value.trim().replace(/^['"]|['"]$/g, '');
  try {
    p = new URL(p, 'https://kasradash.com').pathname;
  } catch {
    /* keep as-is */
  }
  if (!p.startsWith('/')) p = '/' + p;
  if (!p.endsWith('/')) p += '/';
  return p;
}

/** All site-relative paths that must stay out of the sitemap. */
export function getNoindexPaths(contentDir = fileURLToPath(new URL('../content/articles', import.meta.url))) {
  const paths = [...STATIC_NOINDEX_PATHS];
  let files = [];
  try {
    files = walk(contentDir);
  } catch {
    return paths.map(normalisePath);
  }
  for (const file of files) {
    const fm = frontmatterOf(file);
    if (!/^noindex:\s*true\s*$/m.test(fm)) continue;
    const url = fm.match(/^url:\s*(.+)$/m);
    if (url) paths.push(url[1]);
  }
  return paths.map(normalisePath);
}

/** Sitemap filter factory for @astrojs/sitemap: keep a page only if it is not noindexed. */
export function makeSitemapFilter() {
  const noindexPaths = new Set(getNoindexPaths());
  return (page) => {
    let path;
    try {
      path = new URL(page).pathname;
    } catch {
      path = page;
    }
    if (!path.endsWith('/')) path += '/';
    return !noindexPaths.has(path);
  };
}
