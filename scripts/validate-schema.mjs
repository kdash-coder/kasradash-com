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
  [/company-information\.service\.gov\.uk/i, 'Companies House URL (numbers unconfirmed)'],
];

// The ONE verified book KGMID — allowed ONLY on the playbook page (trust-pages brief).
const PLAYBOOK_PAGE = 'books/the-complete-local-seo-playbook/index.html';
const PLAYBOOK_KGMID = 'https://www.google.com/search?kgmid=/g/11lw0t0wcl';

// Expected Book nodes (trust pages): page → { id, isbn?, authors in byline order }.
const EXPECTED_BOOKS = {
  'books/the-complete-local-seo-playbook/index.html': {
    id: `${SITE_URL}/books/the-complete-local-seo-playbook/#book`,
    isbn: '9798345497913',
    authors: ['Mike Martin', 'James Dooley', 'Kasra Dash'],
  },
  'books/advanced-seo-tips/index.html': {
    id: `${SITE_URL}/books/advanced-seo-tips/#book`,
    authors: ['James Dooley', 'Kasra Dash', 'Karl Hudson', 'Andrew Halliday', 'Koray Gübür'],
  },
  'books/igaming-seo/index.html': {
    id: `${SITE_URL}/books/igaming-seo/#book`,
    authors: ['James Dooley', 'Karl Hudson', 'Kasra Dash', 'Koray Gübür'],
  },
};
// Dooley-parity edition counts: workExample entries must equal the verified format count.
const EXPECTED_WORK_EXAMPLES = {
  [`${SITE_URL}/books/the-complete-local-seo-playbook/#book`]: 2,
  [`${SITE_URL}/books/advanced-seo-tips/#book`]: 3,
  [`${SITE_URL}/books/igaming-seo/#book`]: 3,
};
const BOOK_IDS = Object.values(EXPECTED_BOOKS).map((b) => b.id);
const BOOKS_HUB_PAGE = 'books/index.html';
const PODCAST_PAGE = 'podcast/index.html';

/** Dooley-parity Book shape: genre, copyrightYear, about-Things with Wikipedia
 * sameAs, and per-edition workExample identifiers. */
function checkBookShape(page, def, failFn) {
  const expected = EXPECTED_WORK_EXAMPLES[def['@id']];
  const examples = Array.isArray(def.workExample) ? def.workExample : [];
  if (examples.length !== expected) {
    failFn(page, `Book ${def['@id']} workExample count ${examples.length}, expected ${expected}`);
  }
  for (const ex of examples) {
    const ids = Array.isArray(ex.identifier) ? ex.identifier : [];
    if (!ids.some((i) => i && i['@type'] === 'PropertyValue' && /^B0[A-Z0-9]{8}$/.test(i.value ?? ''))) {
      failFn(page, `Book edition without an ASIN identifier on ${def['@id']}`);
    }
  }
  const topics = Array.isArray(def.about) ? def.about : [];
  if (!topics.some((t) => typeof t?.sameAs === 'string' && t.sameAs.startsWith('https://en.wikipedia.org/wiki/'))) {
    failFn(page, `Book ${def['@id']} about-Things missing a Wikipedia sameAs`);
  }
  if (!Array.isArray(def.genre) || def.genre.length === 0) failFn(page, `Book ${def['@id']} missing genre`);
  if (!def.copyrightYear) failFn(page, `Book ${def['@id']} missing copyrightYear`);
  if (!def.disambiguatingDescription) failFn(page, `Book ${def['@id']} missing disambiguatingDescription`);
}

let personDefsTotal = 0;
let articleAuthorsChecked = 0;
let bookDefsTotal = 0;
let podcastDefsTotal = 0;

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

  // VideoObject completeness — Rich Results flags thumbnailUrl as critical; description,
  // embed/content URL and a timezone'd uploadDate as warnings. Enforce all of them.
  for (const node of nodes) {
    if (!typesOf(node).includes('VideoObject')) continue;
    const thumbs = Array.isArray(node.thumbnailUrl) ? node.thumbnailUrl : node.thumbnailUrl ? [node.thumbnailUrl] : [];
    if (thumbs.length === 0) fail(page, 'VideoObject missing thumbnailUrl');
    if (!node.description) fail(page, 'VideoObject missing description');
    if (!node.embedUrl && !node.contentUrl) fail(page, 'VideoObject missing embedUrl/contentUrl');
    if (!/T.*(Z|[+-]\d{2}:\d{2})$/.test(String(node.uploadDate || ''))) fail(page, 'VideoObject uploadDate lacks a time zone');
  }

  // Forbidden URLs. The single verified playbook KGMID is allowed only where that
  // Book node is defined: the playbook page and the /books/ hub (inline Book defs).
  for (const raw of scripts) {
    for (const [pattern, label] of FORBIDDEN_URL_PATTERNS) {
      if (!pattern.test(raw)) continue;
      if (label.startsWith('kgmid') && (page === PLAYBOOK_PAGE || page === 'books/index.html')) {
        const stripped = raw.split(PLAYBOOK_KGMID).join('');
        if (!/kgmid=/i.test(stripped)) continue; // only the one allowed id present
      }
      fail(page, `forbidden URL in JSON-LD: ${label}`);
    }
  }

  // ---- Trust pages: Book node invariants ----
  // Books are defined on their own page AND on the /books/ hub (jamesdooley.com
  // parity: his hub defines every Book inline) — nowhere else.
  const bookDefs = nodes.filter((n) => typesOf(n).includes('Book') && isDefinition(n) && typeof n['@id'] === 'string' && BOOK_IDS.includes(n['@id']));
  const expectedBook = EXPECTED_BOOKS[page];
  if (expectedBook) {
    const def = bookDefs.find((n) => n['@id'] === expectedBook.id);
    if (!def) {
      fail(page, `missing Book definition ${expectedBook.id}`);
    } else {
      bookDefsTotal += 1;
      const authors = (Array.isArray(def.author) ? def.author : [def.author]).map((a) =>
        a && a['@id'] === PERSON_ID ? 'Kasra Dash' : a?.name
      );
      if (JSON.stringify(authors) !== JSON.stringify(expectedBook.authors)) {
        fail(page, `Book authors mismatch: got ${JSON.stringify(authors)}, expected ${JSON.stringify(expectedBook.authors)}`);
      }
      if (!authors.includes('Kasra Dash')) fail(page, 'Book must credit #person as an author');
      if (expectedBook.isbn && def.isbn !== expectedBook.isbn) {
        fail(page, `Book isbn mismatch: got ${JSON.stringify(def.isbn)}, expected ${expectedBook.isbn}`);
      }
      checkBookShape(page, def, fail);
      // AboutPage wrapper: the page node is an AboutPage whose about AND mainEntity → the Book.
      const wrapper = nodes.find((n) => n['@id'] === `${SITE_URL}/${page.replace('index.html', '')}#webpage` && isDefinition(n));
      if (!wrapper || !typesOf(wrapper).includes('AboutPage')) {
        fail(page, 'book page node must be typed AboutPage');
      } else {
        for (const key of ['about', 'mainEntity']) {
          if (wrapper[key]?.['@id'] !== expectedBook.id) fail(page, `AboutPage.${key} must reference ${expectedBook.id}`);
        }
      }
    }
    if (bookDefs.length !== 1) fail(page, `expected exactly 1 Book definition on a book page, found ${bookDefs.length}`);
  } else if (page === BOOKS_HUB_PAGE) {
    if (bookDefs.length !== BOOK_IDS.length) {
      fail(page, `books hub must define all ${BOOK_IDS.length} Book nodes, found ${bookDefs.length}`);
    }
    for (const def of bookDefs) checkBookShape(page, def, fail);
    const itemList = nodes.find((n) => typesOf(n).includes('ItemList') && isDefinition(n));
    if (!itemList) {
      fail(page, 'books hub missing ItemList');
    } else {
      const items = Array.isArray(itemList.itemListElement) ? itemList.itemListElement : [];
      if (Number(itemList.numberOfItems) !== BOOK_IDS.length || items.length !== BOOK_IDS.length) {
        fail(page, `books hub ItemList must carry numberOfItems ${BOOK_IDS.length} with ${BOOK_IDS.length} elements`);
      }
      const order = items.map((i) => i?.item?.['@id']);
      if (JSON.stringify(order) !== JSON.stringify(BOOK_IDS)) fail(page, 'books hub ItemList ordering mismatch');
    }
  } else if (bookDefs.length > 0) {
    fail(page, `Book node defined outside its own page/hub: ${bookDefs.map((n) => n['@id']).join(', ')}`);
  }

  // #person.author must reference exactly the three Book @ids (every page).
  if (personDefs.length === 1) {
    const refs = (Array.isArray(personDefs[0].author) ? personDefs[0].author : []).map((a) => a && a['@id']);
    if (JSON.stringify(refs) !== JSON.stringify(BOOK_IDS)) {
      fail(page, `#person.author must reference the 3 Book @ids, got ${JSON.stringify(refs)}`);
    }
  }

  // ---- Trust pages: PodcastSeries only on /podcast/, YouTube-only sameAs ----
  const podcastDefs = nodes.filter(
    (n) => (typesOf(n).includes('PodcastSeries') || typesOf(n).includes('CreativeWorkSeries')) && isDefinition(n) && 'sameAs' in n
  );
  if (page === PODCAST_PAGE) {
    if (podcastDefs.length !== 1) {
      fail(page, `expected exactly 1 PodcastSeries definition on /podcast/, found ${podcastDefs.length}`);
    } else {
      podcastDefsTotal += 1;
      const series = podcastDefs[0];
      if (!(series.author && series.author['@id'] === PERSON_ID)) fail(page, 'PodcastSeries.author must be {"@id": #person}');
      const sameAs = Array.isArray(series.sameAs) ? series.sameAs : [];
      for (const u of sameAs) {
        if (!/^https:\/\/www\.youtube\.com\//.test(u)) fail(page, `PodcastSeries sameAs must be YouTube-only, got ${u}`);
      }
      const raw = JSON.stringify(series);
      if (/open\.spotify\.com|podcasts\.apple\.com/i.test(raw)) fail(page, 'PodcastSeries must not claim Spotify/Apple (show is not there)');
    }
  } else if (podcastDefs.length > 0) {
    fail(page, 'PodcastSeries defined outside /podcast/');
  }

  // noindex ↔ sitemap coherence.
  const noindexed = /<meta name="robots" content="noindex[^"]*"/.test(html);
  if (noindexed) {
    const path = '/' + page.replace(/index\.html$/, '').replace(/\.html$/, '/');
    const url = new URL(path, SITE_URL).href;
    if (sitemapUrls.has(url)) fail(page, `noindexed page present in sitemap: ${url}`);
  }
}

if (bookDefsTotal !== Object.keys(EXPECTED_BOOKS).length) {
  fail('(site)', `expected ${Object.keys(EXPECTED_BOOKS).length} Book definitions sitewide, found ${bookDefsTotal}`);
}
if (podcastDefsTotal !== 1) {
  fail('(site)', `expected exactly 1 PodcastSeries definition sitewide, found ${podcastDefsTotal}`);
}

console.log(`Checked ${pages.length} pages, ${sitemapUrls.size} sitemap URLs.`);
console.log(`#person definitions: ${personDefsTotal}/${pages.length} pages (1 each), Article author refs verified: ${articleAuthorsChecked}.`);
console.log(`Book definitions: ${bookDefsTotal}/3 pages + hub (Dooley-parity shape enforced; playbook kgmid allowed on its page + hub only), PodcastSeries: ${podcastDefsTotal}/1 (YouTube-only sameAs).`);
if (failures.length > 0) {
  console.error(`\nFAILED — ${failures.length} problem(s):`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}

console.log('Schema validation clean: one #person per page, zero FAQPage, all authors → #person, no forbidden URLs.');
