/**
 * JSON-LD entity-graph validator. Run AFTER `npm run build`:
 *
 *   node scripts/validate-schema.mjs
 *
 * Asserts, for every HTML page in dist/:
 *  1. every <script type="application/ld+json"> parses as valid JSON;
 *  2. exactly one ld+json script per page (the single @graph);
 *  3. exactly ONE definition of https://kasradash.com/#person, typed Person only
 *     (references by bare @id are fine anywhere);
 *  4. exactly one definition of #website;
 *  5. no @id is DEFINED twice in one page's graph (the live site's collision class);
 *  6. zero FAQPage nodes (deprecated Aug 2023);
 *  7. every author/publisher on Article-like nodes is an @id ref to #person;
 *  8. no forbidden URLs anywhere in the JSON-LD: kgmid self-claims, TikTok,
 *     fbcdn/gstatic hotlinks, http:// (non-https);
 *  9. robots/noindex coherence: any page carrying <meta name="robots" content="noindex…">
 *     must be absent from the generated sitemap.
 *
 * Exits 1 with a failure list if anything is violated; prints a summary otherwise.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = 'https://kasradash.com';
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const DIST = fileURLToPath(new URL('../dist', import.meta.url));

const failures = [];
const fail = (page, msg) => failures.push(`${page}: ${msg}`);

function htmlFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) htmlFiles(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Recursively collect every object node; classify @id usages as definition vs reference. */
function collectNodes(value, nodes = []) {
  if (Array.isArray(value)) {
    for (const v of value) collectNodes(v, nodes);
  } else if (value && typeof value === 'object') {
    nodes.push(value);
    for (const v of Object.values(value)) collectNodes(v, nodes);
  }
  return nodes;
}

const isDefinition = (node) => Object.keys(node).some((k) => k !== '@id');
const typesOf = (node) => (Array.isArray(node['@type']) ? node['@type'] : node['@type'] ? [node['@type']] : []);

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

const pages = htmlFiles(DIST);
if (pages.length === 0) {
  console.error('No HTML pages found in dist/.');
  process.exit(1);
}

// Sitemap URL set (for the noindex coherence check).
const sitemapUrls = new Set();
for (const f of readdirSync(DIST)) {
  if (/^sitemap.*\.xml$/.test(f)) {
    const xml = readFileSync(join(DIST, f), 'utf8');
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) sitemapUrls.add(m[1].trim());
  }
}

const FORBIDDEN_URL_PATTERNS = [
  [/kgmid=/i, 'kgmid self-claim URL'],
  [/tiktok\.com/i, 'TikTok URL (ownership unconfirmed)'],
  [/fbcdn\.net/i, 'expiring fbcdn image URL'],
  [/gstatic\.com/i, 'Google-cache gstatic image URL'],
  [/"http:\/\//, 'non-https URL'],
];

let personDefsTotal = 0;
let articleAuthorsChecked = 0;

for (const file of pages) {
  const page = relative(DIST, file);
  const html = readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);

  if (scripts.length !== 1) {
    fail(page, `expected exactly 1 ld+json script, found ${scripts.length}`);
    if (scripts.length === 0) continue;
  }

  const graphs = [];
  for (const raw of scripts) {
    try {
      graphs.push(JSON.parse(raw));
    } catch (e) {
      fail(page, `invalid JSON in ld+json: ${e.message}`);
    }
  }

  const nodes = collectNodes(graphs);

  // FAQPage ban.
  for (const node of nodes) {
    if (typesOf(node).includes('FAQPage')) fail(page, 'FAQPage node present (deprecated Aug 2023)');
  }

  // @id definition bookkeeping.
  const defCounts = new Map();
  for (const node of nodes) {
    if (typeof node['@id'] === 'string' && isDefinition(node)) {
      defCounts.set(node['@id'], (defCounts.get(node['@id']) ?? 0) + 1);
    }
  }
  for (const [id, count] of defCounts) {
    if (count > 1) fail(page, `@id defined ${count}x: ${id}`);
  }

  // Exactly one #person definition, typed Person ONLY.
  const personDefs = nodes.filter((n) => n['@id'] === PERSON_ID && isDefinition(n));
  if (personDefs.length !== 1) {
    fail(page, `expected exactly 1 #person definition, found ${personDefs.length}`);
  } else {
    personDefsTotal += 1;
    const types = typesOf(personDefs[0]);
    if (types.length !== 1 || types[0] !== 'Person') {
      fail(page, `#person @type must be exactly "Person", got ${JSON.stringify(types)}`);
    }
  }

  // Exactly one #website definition.
  const websiteDefs = nodes.filter((n) => n['@id'] === WEBSITE_ID && isDefinition(n));
  if (websiteDefs.length !== 1) fail(page, `expected exactly 1 #website definition, found ${websiteDefs.length}`);

  // author/publisher on creative-work nodes → #person by @id ref.
  for (const node of nodes) {
    const types = typesOf(node);
    const isCreative = types.some((t) => ['Article', 'BlogPosting', 'WebSite'].includes(t));
    if (!isCreative) continue;
    for (const key of ['author', 'publisher']) {
      if (!(key in node)) continue;
      // Press articles in subjectOf legitimately carry their own publisher Organization.
      if (key === 'publisher' && !('author' in node) && types.includes('Article')) continue;
      const vals = Array.isArray(node[key]) ? node[key] : [node[key]];
      for (const v of vals) {
        if (!(v && typeof v === 'object' && v['@id'] === PERSON_ID && Object.keys(v).length === 1)) {
          fail(page, `${types.join(',')}.${key} must be {"@id": "${PERSON_ID}"}, got ${JSON.stringify(v)}`);
        } else if (key === 'author') {
          articleAuthorsChecked += 1;
        }
      }
    }
  }

  // Forbidden URLs.
  for (const raw of scripts) {
    for (const [pattern, label] of FORBIDDEN_URL_PATTERNS) {
      if (pattern.test(raw)) fail(page, `forbidden URL in JSON-LD: ${label}`);
    }
  }

  // noindex ↔ sitemap coherence.
  const noindexed = /<meta name="robots" content="noindex[^"]*"/.test(html);
  if (noindexed) {
    const path = '/' + page.replace(/index\.html$/, '').replace(/\.html$/, '/');
    const url = new URL(path, SITE_URL).href;
    if (sitemapUrls.has(url)) fail(page, `noindexed page present in sitemap: ${url}`);
  }
}

console.log(`Checked ${pages.length} pages, ${sitemapUrls.size} sitemap URLs.`);
console.log(`#person definitions: ${personDefsTotal}/${pages.length} pages (1 each), Article author refs verified: ${articleAuthorsChecked}.`);
if (failures.length > 0) {
  console.error(`\nFAILED — ${failures.length} problem(s):`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
console.log('Schema validation clean: one #person per page, zero FAQPage, all authors → #person, no forbidden URLs.');
