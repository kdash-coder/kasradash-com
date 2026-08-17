# Consolidated-build parity QA v2

**Date:** 2026-08-17  
**Current verdict:** **PASS after focused re-check** — the two initial failures were closed by the legacy enumeration and hub-ToC fixes documented at the end of this report.  
**Original Git state tested:** `c61b38042b873f30b7e0468a0a6acdf82ac0e58d`  
**Surface tested:** existing `dist` through the already-running previews on `localhost:4321` / `localhost:4323`; no rebuild or server restart was performed.

Sources used:

- `q1-pages.tsv` for the 112-URL crawl universe
- `disposition-2026-08-17.md`, corrected totals section
- `q7-schema-findings.md`, ADDENDUM 2
- current `dist`, `public/_redirects`, and `functions/_middleware.js`

## 1. Universe closure — FAIL

### Original 112 crawl URLs — PASS

An independent classifier compared each exact URL in `q1-pages.tsv` with the built routes in `dist`, exact redirect sources in `public/_redirects`, and both slash variants of `GONE_PATHS`.

| Disposition | Count |
| --- | ---: |
| Built | 39 |
| Redirected | 54 |
| Gone | 19 |
| **Total** | **112** |

Result: **0 unaccounted and 0 multiply dispositioned**. Across the complete current surfaces there are also zero exact-path overlaps between built pages, redirect sources, and gone paths.

### Claimed 25-path legacy GSC tail — FAIL (not independently reproducible)

The supplied reports assert **25 unique legacy GSC paths**, but neither report enumerates the exact 25-path inventory. The implementation's section headed `Legacy GSC tail` contains **44 redirect rules** which collapse to **23 slash-normalized path families** (21 paired slash variants plus the two standalone slashless routes `/seo` and `/seo/link-building`).

Every implemented legacy source is redirected and none conflicts with a built or gone exact path. However, without an enumerated 25-path source inventory—and with only 23 normalized path families in the implementation—the requested 25/25 closed-universe proof cannot be reproduced. This is a fail-closed evidence gap, not proof that two live URLs are necessarily missing.

## 2. Redirect targets — PASS

Parsed all **155** rules:

- 152 internal rules; 3 external rules
- 22 distinct internal targets, all present as built pages in `dist`
- 0 dead internal targets
- 0 redirect chains (no target is also an exact redirect source)
- 0 duplicate redirect sources

The two distinct Skool targets were loaded in agent Chrome and both reported `PerformanceNavigationTiming.responseStatus === 200`, rendered the title **The New Search**, and reached `document.readyState === complete`. (`curl` received Skool's bot-layer 403, so the real browser result was used.)

## 3. 410 middleware — PASS

`node scripts/test-middleware.mjs` exited 0:

- gone-list size exactly 19
- all 19 paths × slash and slashless variants returned 410 with the branded body
- `/`, `/seo/`, `/seo/link-building/`, and `/about-kasra-dash/` passed through with 200
- all 19 gone paths were absent from `_redirects`

## 4. Fold fidelity spot-check — FAIL

The three pages rendered without an error overlay in the existing build. Agent Chrome was used for visual evidence because the embedded screenshot surface repeatedly returned `No browser instance` after successful navigation.

| Hub | Rendered main words | Tables | Duplicate exact paragraphs | Horizontal overflow | ToC links |
| --- | ---: | ---: | ---: | --- | ---: |
| `/seo/learn/` | 3,568 | 3 | 0 | none (`scrollWidth === clientWidth`) | **0** |
| `/seo/technical-seo/` | 1,792 | 5 | 0 | none (`scrollWidth === clientWidth`) | **0** |
| `/seo/link-building/` | 6,288 | 8 | 0 | none (`scrollWidth === clientWidth`) | **0** |

All table measurements were 672 px inside a 768 px reading well, and visual captures showed coherent typography and intact tables. Required absorbed artefacts are present:

- technical SEO: **Core Elements of Technical SEO** table, including XML sitemaps/robots.txt and canonical tags
- link building: strategy comparison table with ROI potential
- link building: full outreach email template plus campaign tracker table
- link building: ROI formula, worked 200% example, traffic-value formula, and projected-ROI formula

The check fails because the ToC requirement is not met: all three routes use `HubLayout`, which does not render `TocScrollSpy` or any `.toc-link`/fragment jump links. Runtime DOM inspection found **0 ToC links on every hub**, so there is nothing to exercise. The observed Learn and technical rendered word counts are also below 4,000 if “4–6.6k words” was intended as a final-page range rather than a description of source material folded.

## 5. Four GSC reprieves — PASS

All four routes are built and have inbound links from other built pages:

| Reprieve | Distinct inbound built pages |
| --- | ---: |
| `/seo/seo-frameworks/topical-map-framework/` | 10 |
| `/seo/seo-frameworks/seo-checklist/` | 7 |
| `/seo/ai-and-seo/ai-quality-rater-guidelines/` | 5 |
| `/seo/learn/seo-ranking-factors/` | 4 |

## 6. Sitemap — PASS

Independent comparison of `dist/sitemap-0.xml` with all built HTML routes:

- 49 built pages
- 48 sitemap URLs
- `/quick-reads/thank-you/` is built and absent from the sitemap
- every other built page is present
- 0 sitemap URLs lack a built page
- 0 removed URLs from the original 112 appear in the sitemap

## 7. Schema validator and FAQPage — PASS

`node scripts/validate-schema.mjs` exited 0 after checking all 49 built pages:

- exactly one `#person` definition per page
- all 29 Article author references point to `#person`
- 3/3 Book definitions and 1/1 PodcastSeries definition validated
- no forbidden schema URLs
- **zero emitted `FAQPage` nodes**

The literal string `FAQPage` remains only in source comments and article prose; the rendered JSON-LD validator found no `FAQPage` type.

## Commands / methods

- Node read-only classifiers over `q1-pages.tsv`, `dist/**/*.html`, `_redirects`, and `GONE_PATHS`
- `node scripts/test-middleware.mjs`
- `node scripts/validate-schema.mjs`
- DOM inspection and screenshots in agent Chrome against `http://localhost:4321`
- browser-observed navigation status for both external Skool targets
- direct sitemap-to-dist and inbound-link comparisons

The vendored Impeccable source scan exited 0. Its URL mode could not run because this checkout does not include Puppeteer, so that result was not used as evidence for any verdict above.

---

## Focused re-check after fixes — PASS

**Re-check Git state:** `f788973736a8fef9283fce44af4bcbdda7969473`  
**Final verdict:** **PASS** — both initial failing axes now meet the focused acceptance criteria. This section supersedes the initial FAIL verdicts in checks 1 and 4 while retaining their evidence as the audit history.

No rebuild or preview-server restart was performed. Verification used the current `dist`, the existing server on `localhost:4323`, and the source GSC export at `/Users/kasra/Downloads/https___kasradash.com_-Performance-on-Search-2026-08-17/Pages.csv`.

### A. Legacy GSC closure — PASS

The closure was rebuilt from the CSV rather than copied from the amended disposition report:

- the CSV contains 148 data rows; exact comparison with the 112-path `q1-pages.tsv` inventory yields **39 outside rows**
- **14** are `#elementor-toc__heading-anchor-*` fragment rows; their four base-page families are accounted for as built or redirected
- **25** are real paths and every exact path is present in `_redirects`
- two of those exact redirect sources are slashless canonical aliases (`/seo` → `/seo/` and `/seo/link-building` → `/seo/link-building/`); their targets are built pages
- grouped by the amended report's semantics, this is **14 fragment rows + 23 legacy redirect families + 2 slashless aliases of built pages = 39**
- exact-surface classification has 0 unaccounted and 0 multiply dispositioned rows; no row intersects the gone-list

The amended enumeration therefore closes. For precision, the deployed exact-path behavior is 25 redirects; “23 redirected + 2 built” is a family-level description because the two slashless URLs themselves 301 to the built slash-canonical pages.

### B. Consolidated hub ToCs — PASS

The current `dist` and browser-rendered DOM agree:

| Hub | ToC links | Missing targets | Target level | Representative click result |
| --- | ---: | ---: | --- | --- |
| `/seo/learn/` | 19 | 0 | all H2 | `#about-the-author` landed at ~200 px below the sticky header; link became `.active` |
| `/seo/technical-seo/` | 8 | 0 | all H2 | summary anchor landed at ~200 px; link became `.active` |
| `/seo/link-building/` | 8 | 0 | all H2 | summary anchor landed at ~200 px; link became `.active` |

Each representative click used the actual visible `.toc-link`, changed `location.hash`, scrolled the matching target into view, and activated the scroll-spy class. All three pages had `scrollWidth === clientWidth` at the tested desktop viewport.

Link Building now has exactly **8 body H2 groups**, 43 subordinate H3s, **0 duplicate-title H2**, and every ToC entry targets an H2. It no longer relies on the H3 fallback.

Sensitivity check: a temporary in-page ToC link targeting `#qa-missing-control` was correctly reported as missing, then removed; no source or built file was changed.

The vendored Impeccable source scan exited 0 on the re-check state. URL mode still could not run because Puppeteer is absent, so it was not used for the PASS verdict.
