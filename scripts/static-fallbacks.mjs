// GH-Pages fallback layer: static meta-refresh pages for _redirects sources and
// noindex tombstones for the middleware gone-list. Native CF artifacts stay canonical.
import fs from 'node:fs'; import path from 'node:path';
const dist = 'dist'; const site = 'https://kasradash.com';
const norm = (p) => p.replace(/\/+$/, '') || '/';
const outFor = (src) => path.join(dist, norm(src) === '/' ? '' : norm(src).slice(1), 'index.html');
let r = 0, g = 0, skipped = [];
for (const line of fs.readFileSync('public/_redirects', 'utf8').split('\n')) {
  const s = line.trim(); if (!s || s.startsWith('#')) continue;
  const [src, target] = s.split(/\s+/); if (!src?.startsWith('/')) continue;
  if (/\.[a-z0-9]+$/i.test(norm(src)) && !norm(src).endsWith('.xml')) { skipped.push(src); continue; }
  if (norm(src).endsWith('.xml')) { // sitemap alias: serve a copy
    fs.copyFileSync(path.join(dist, 'sitemap-index.xml'), path.join(dist, norm(src).slice(1))); r++; continue;
  }
  const out = outFor(src); if (fs.existsSync(out)) continue;
  const abs = target.startsWith('http') ? target : site + target;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Redirecting</title><link rel="canonical" href="${abs}"><meta http-equiv="refresh" content="0;url=${target.startsWith('http') ? target : abs}"><meta name="robots" content="noindex"></head><body><p>This page has moved. <a href="${target.startsWith('http') ? target : abs}">Continue</a>.</p></body></html>\n`); r++;
}
const mw = fs.readFileSync('functions/_middleware.js', 'utf8');
const gone = [...new Set([...mw.matchAll(/['"](\/[a-z0-9/-]+?)['"]/g)].map(m => norm(m[1])).filter(p => p.split('/').length > 2))];
for (const p of gone) {
  const out = outFor(p); if (fs.existsSync(out)) continue;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>410 — page removed</title><meta name="robots" content="noindex"></head><body><h1>This page has been permanently removed.</h1><p><a href="${site}/">kasradash.com</a></p></body></html>\n`); g++;
}
console.log(`fallbacks: ${r} redirect pages, ${g} gone tombstones, skipped: ${skipped.join(',') || 'none'}`);
