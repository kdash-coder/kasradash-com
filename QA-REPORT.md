# Independent QA Report — merged kasradash.com rebuild

Date: 11 August 2026  
QA target: `main` at `3e14634d046daccf446674e38aad1a384bf0ee93`  
Preview checked: existing read-only server at `http://localhost:4321` (not rebuilt or restarted)  
Overall verdict: **FAIL** — two internal links in built content resolve to 404 pages. All other scripted core checks passed; visual QA was skipped because the quadrant browser did not mount.

## Verdict table

| # | Check | Verdict | Severity | Evidence summary |
|---|---|---|---|---|
| 1 | Route parity | PASS | — | Reproduced from the 112 URL keys in `kasradash-audit/data/pages.json`: 111 are built HTML routes and 1 is covered by `_redirects`; 0 missing. `dist/` has 112 HTML pages because `/privacy-policy/` is an expected new route. |
| 2 | Sitemap truth | PASS | — | `dist/sitemap-0.xml` contains exactly 111 unique page `<loc>` entries. Thank-you is absent; privacy is present. The validator's “112 sitemap URLs” message counts the sitemap-index child URL as a page URL; details below. |
| 3 | Link integrity | **FAIL** | **Medium** | Parsed 7,182 `<a href>` values and 342 `src` values across all 112 built HTML pages. Two internal relative links resolve to paths that return 404; all asset `src` values resolved. |
| 4 | Schema | PASS | — | `node scripts/validate-schema.mjs` exited 0. Manual JSON parsing on 5 required pages confirmed one JSON-LD graph and one `#person`, correct AboutPage/ContactPage types, article author reference, and zero FAQPage. |
| 5 | Fidelity spot-check | PASS | — | Random 8-page sample: 8/8 titles exact, 8/8 H1s exact, 3/8 first content paragraphs exact, 5/8 differing only by the documented live em-dash → built comma corpus delta. |
| 6 | Redirects file | PASS | — | 4 active Cloudflare redirect rules, all valid `source destination 301`; the file also contains 3 comment lines. No redirect source is also a built page. |
| 7 | Head/meta | PASS | — | Thank-you is `noindex,follow`; home title is exact; 5/5 sampled canonicals self-reference; no stray text in the home `<title>`. |
| 8 | Visual | SKIPPED | Info | `browser_navigate(http://localhost:4321/)` returned success, but the immediately following screenshot returned “No browser instance for this quadrant yet.” Per the assignment, no retry loop was attempted. |

## 1. Route parity

Independent inputs:

- Live inventory: 112 URL keys from `/Users/kasra/.codus/scratch/kasradash-audit/data/pages.json`.
- Built inventory: every `dist/**/*.html`, mapped from `.../index.html` to its public route.
- Redirect inventory: non-comment rules in `public/_redirects`, normalising slash/no-slash source variants.

Result:

- 112 live URLs checked.
- 111 live URLs are built pages.
- `/category/uncategorized/` is the one redirect-only live URL and maps to `/category/quick-reads/` with 301.
- 0 live URLs are missing.
- 112 HTML pages exist in `dist/`.
- The only built route outside the 112-URL live inventory is the expected `/privacy-policy/`.

The live no-trailing-slash URL `/seo/technical-seo/website-speed-seo` maps to the built directory route `/seo/technical-seo/website-speed-seo/`; no content route is missing.

## 2. Sitemap truth and count discrepancy

Exact counts:

- `dist/sitemap-0.xml`: **111 page `<loc>` entries, 111 unique**.
- `dist/sitemap-index.xml`: **1 child-sitemap `<loc>`**, `https://kasradash.com/sitemap-0.xml`.
- Union of both files: **112 unique `<loc>` strings**, but one is the sitemap file itself, not a page.

Required membership:

- `https://kasradash.com/quick-reads/thank-you/`: absent — correct because it is noindexed.
- `https://kasradash.com/privacy-policy/`: present — correct.
- All 111 indexable built page routes: present exactly once.
- No extra page URL relative to the indexable built-route set.

Literal deltas against the 112 live inventory:

- Sitemap-only: `https://kasradash.com/privacy-policy/` (expected new page) and the canonical slash form `https://kasradash.com/seo/technical-seo/website-speed-seo/`.
- Live-only: `https://kasradash.com/quick-reads/thank-you/` (intentionally noindexed), `https://kasradash.com/category/uncategorized/` (redirect-only), and the literal no-slash form `https://kasradash.com/seo/technical-seo/website-speed-seo` (represented canonically with a slash).

Why the validator says 112: `scripts/validate-schema.mjs` reads every root file matching `^sitemap.*\\.xml$` and adds every `<loc>` to one set. That includes the `<loc>` in `sitemap-index.xml`, so its summary conflates 111 page URLs with 1 child-sitemap URL. Its noindex membership assertion remains effective because it checks exact page URLs against that set.

## 3. Broken internal links

| Source page | Raw href | Browser-resolved path | Evidence |
|---|---|---|---|
| `/seo/content-seo/entity-optimisation/` | `seo/technical-seo/schema-markup-guide/` | `/seo/content-seo/entity-optimisation/seo/technical-seo/schema-markup-guide/` | No built route/file/redirect; preview returned HTTP 404. Source: `src/content/articles/seo/content-seo/entity-optimisation.md:128`. |
| `/seo/content-seo/` | `seo/content-seo/semantic-seo/` | `/seo/content-seo/seo/content-seo/semantic-seo/` | No built route/file/redirect; preview returned HTTP 404. Source: `src/content/articles/seo/content-seo.md:278`. |

Both are missing a leading `/`. All 342 asset `src` values resolved to files in `dist/`; no other internal `href` failed route/file/redirect resolution.

## 4. Schema evidence

Command:

```text
node scripts/validate-schema.mjs
```

Outcome: exit 0; 112 pages checked; 112/112 pages had exactly one `#person`; 99 Article author references verified; zero FAQPage; no forbidden schema URLs. The command's sitemap summary is misleading for the reason documented above.

Manual spot parse:

| Page | JSON-LD scripts | `#person` definitions | Required type / author | FAQPage |
|---|---:|---:|---|---:|
| `/` | 1 | 1 | WebPage | 0 |
| `/about-kasra-dash/` | 1 | 1 | AboutPage | 0 |
| `/contact/` | 1 | 1 | ContactPage | 0 |
| `/seo/content-seo/topical-authority/` | 1 | 1 | Article author is exactly `{ "@id": "https://kasradash.com/#person" }` | 0 |
| `/privacy-policy/` | 1 | 1 | WebPage | 0 |

## 5. Fidelity sample

The sample was selected randomly from live routes, excluding the redirect-only category URL. Live HTML was fetched directly from `https://kasradash.com`; title, H1, and the first WordPress content paragraph were compared with the matching built article body.

| Route | Title | H1 | First content paragraph |
|---|---|---|---|
| `/seo/seo-frameworks/seo-audit-template/` | Exact | Exact | Accepted known delta: `—` → `,` |
| `/seo/learn/how-search-engines-work/` | Exact | Exact | Exact |
| `/seo/technical-seo/schema-markup-guide/` | Exact | Exact | Exact |
| `/seo/content-seo/e-e-a-t/` | Exact | Exact | Accepted known delta: `—` → `,` |
| `/seo/ai-and-seo/ai-and-indexing/` | Exact | Exact | Accepted known delta: `—` → `,` |
| `/seo/ai-and-seo/ethical-seo/` | Exact | Exact | Accepted known delta: `—` → `,` |
| `/quick-reads/best-ai-seo-skool-groups-2026/` | Exact | Exact | Exact |
| `/seo/ai-and-seo/google-mum/` | Exact | Exact | Accepted known delta: two `—` characters → commas |

No unaccepted title, H1, or first-paragraph differences were found.

## 6. Redirects

`public/_redirects` has 4 active rules (plus 3 comment lines):

```text
/uncategorized/best-ai-seo-skool-groups-2026/ /quick-reads/best-ai-seo-skool-groups-2026/ 301
/uncategorized/best-ai-seo-skool-groups-2026 /quick-reads/best-ai-seo-skool-groups-2026/ 301
/category/uncategorized/ /category/quick-reads/ 301
/category/uncategorized /category/quick-reads/ 301
```

All four rules have exactly three Cloudflare fields, use path sources/destinations, and use a valid 301 status. None of the four source variants is also a built HTML route.

## 7. Head/meta

- `/quick-reads/thank-you/`: `<meta name="robots" content="noindex,follow">`.
- `/`: title is exactly `Kasra Dash — Entrepreneur and SEO Consultant in Manchester`.
- Self-referencing canonicals passed on `/`, `/about-kasra-dash/`, `/contact/`, `/seo/content-seo/topical-authority/`, and `/privacy-policy/`.
- The home document has a single exact `<title>` and no widget text appended to it.

## Security-oriented static-surface review

The generated static surface has no forms, iframes, `javascript:` links, or inline event-handler attributes, and the schema validator found no forbidden or insecure schema URL. No active injection or mixed-content subresource surface was found in the inspected output.

Residual advisory: four ordinary outbound anchors across two pages use `http://` rather than HTTPS (`spp.co`, `PatrickRiceCo.com`, and two `Takaoto.pro` links). These are navigational links, not loaded subresources, so they do not create in-page mixed content; they do permit an avoidable plaintext downgrade when clicked. This is outside the two internal-link failures and may reflect live-content fidelity.

## Reproduction notes

Core commands/checks used:

```text
node scripts/validate-schema.mjs
find dist -type f -name '*.html'
curl -sS https://kasradash.com/<sample-route>/
curl -sS -o /dev/null -w '%{http_code}' http://localhost:4321/<resolved-link>/
git rev-parse HEAD
git status --short
```

The independent parser additionally enumerated built routes, parsed both sitemap XML files, parsed `_redirects`, extracted every quoted internal `href` and `src`, parsed JSON-LD on the five specified pages, checked required head metadata, and compared the eight live/built content samples. No build, `dist/` write, server restart, commit, or source fix was performed.
