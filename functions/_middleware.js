/**
 * Cloudflare Pages middleware — HTTP 410 Gone for permanently retired pages.
 *
 * These 19 URLs were removed in the 17 Aug 2026 consolidation (disposition doc:
 * zero clicks, <100 impressions over 12 months, no referring links, kill-verdict).
 * A static _redirects file cannot emit 410, so this middleware owns the gone-list;
 * these paths must NOT appear in public/_redirects (410 wins, no conflicts).
 *
 * Note: `astro preview` does not execute Pages Functions — verified instead by
 * scripts/test-middleware.mjs (node unit run against mock requests).
 */

export const GONE_PATHS = new Set([
  '/seo/ai-and-seo/ai-and-indexing/',
  '/seo/ai-and-seo/ethical-seo/',
  '/seo/ai-and-seo/future-proof-seo/',
  '/seo/content-seo/content-distribution/',
  '/seo/content-seo/performance-metrics/',
  '/seo/content-seo/seo-blog-writing/',
  '/seo/learn/how-seo-works/',
  '/seo/learn/seo-strategy-for-beginners/',
  '/seo/learn/seo-vs-sem-vs-ppc/',
  '/seo/learn/what-are-search-engine-algorithms/',
  '/seo/learn/why-seo-matters/',
  '/seo/link-building/guest-posting/',
  '/seo/link-building/tiered-link-building-how-to-safely-build-authority-in-2025/',
  '/seo/seo-frameworks/conversion-framework/',
  '/seo/seo-frameworks/seo-audit-template/',
  '/seo/technical-seo/core-web-vitals/',
  '/seo/technical-seo/crawl-budget/',
  '/seo/technical-seo/google-algorithm-updates/',
  '/seo/technical-seo/schema-markup-guide/',
]);

/** True for a gone path in either slash variant. */
export function isGone(pathname) {
  return GONE_PATHS.has(pathname.endsWith('/') ? pathname : pathname + '/');
}

const GONE_BODY = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>410 — Page removed | Kasra Dash</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#151515;color:#fff;font-family:'Albert Sans',system-ui,-apple-system,sans-serif;text-align:center;padding:24px}
  .card{max-width:34rem}
  h1{font-size:2rem;margin:0 0 .75rem}
  p{color:#cccccc;line-height:1.6;margin:0 0 1.5rem}
  a{display:inline-block;padding:.7rem 1.6rem;border-radius:50px;background:linear-gradient(93.77deg,#845CFE 13.53%,#4A4EF8 88.57%);color:#fff;font-weight:700;text-decoration:none}
</style>
</head>
<body>
<div class="card">
<h1>This page has been removed</h1>
<p>It was retired for good as part of a site clean-up, so there is nothing to redirect you to. The SEO guides that remain are the ones worth your time.</p>
<a href="/seo/">Browse the SEO guides</a>
</div>
</body>
</html>`;

export function goneResponse() {
  return new Response(GONE_BODY, {
    status: 410,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

export async function onRequest(context) {
  const { pathname } = new URL(context.request.url);
  if (isGone(pathname)) return goneResponse();
  return context.next();
}
