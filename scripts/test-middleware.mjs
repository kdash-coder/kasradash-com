/**
 * Unit run for functions/_middleware.js (Cloudflare Pages runtime is not
 * available locally — `astro preview` never executes Pages Functions).
 *
 *   node scripts/test-middleware.mjs
 *
 * Asserts: every gone path returns 410 in BOTH slash variants with the branded
 * body; non-gone paths pass through to next(); the gone-list has exactly 19
 * entries; and no gone path appears in public/_redirects.
 */

import { readFileSync } from 'node:fs';
import { onRequest, GONE_PATHS } from '../functions/_middleware.js';

const ORIGIN = 'https://kasradash.com';
let failures = 0;
const check = (ok, msg) => {
  if (!ok) failures += 1;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`);
};

const run = (path) =>
  onRequest({
    request: new Request(ORIGIN + path),
    next: () => new Response('passed-through', { status: 200 }),
  });

check(GONE_PATHS.size === 19, `gone-list has 19 entries (got ${GONE_PATHS.size})`);

for (const path of GONE_PATHS) {
  for (const variant of [path, path.slice(0, -1)]) {
    const res = await run(variant);
    const body = await res.text();
    check(res.status === 410 && body.includes('This page has been removed'), `410 ${variant}`);
  }
}

for (const path of ['/', '/seo/', '/seo/link-building/', '/about-kasra-dash/']) {
  const res = await run(path);
  check(res.status === 200 && (await res.text()) === 'passed-through', `pass-through ${path}`);
}

const redirects = readFileSync(new URL('../public/_redirects', import.meta.url), 'utf8');
for (const path of GONE_PATHS) {
  const clash = redirects
    .split('\n')
    .some((l) => !l.trim().startsWith('#') && (l.split(/\s+/)[0] === path || l.split(/\s+/)[0] === path.slice(0, -1)));
  check(!clash, `not in _redirects: ${path}`);
}

console.log(failures === 0 ? '\nMiddleware unit run clean.' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
