# Q6 Content Refresh — Findings & Route-Parity Proof (11 Aug 2026)

Branch `kd/content-refresh` (merged with main post entity-schema). Build: **112 pages, green**.
Mission: make the July port an exact, current mirror of the live site's 112-URL inventory
(fresh raw-HTML crawl of 11 Aug at `~/.codus/scratch/kasradash-audit/`).

## 1. Content refreshed (re-ported 1:1 from the fresh crawl)

| page | live lastmod | new size | note |
| --- | --- | --- | --- |
| /seo/content-seo/topical-authority/ | 03 Aug | 3,500 w | full restructure on live (1 H2 + H3/H4 sections, tables, FAQ pairs) |
| /seo/link-building/ (hub) | 02 Aug | 5,499 w | "ultimate guide" rebuild, 5 tables, H3-based sections |
| /quick-reads/best-seo-experts/ | 04 Aug | 3,729 w | new top-10 format; H1 changed on live and synced; no inline headshots on live anymore |
| /seo/learn/seo-fundamentals/ | 15 Jul | 3,772 w | full restructure (checklist, FAQ H2s, author section) |

Verification: converter-vs-file word ratio = **1.000** and heading sets identical for all four.

- /uncategorized/best-ai-seo-skool-groups-2026/ (lastmod 13 Jul): body proven **already identical**
  to live (word-for-word, heading-for-heading) — the 13 Jul lastmod was the slug/category move
  itself. File moved to `quick-reads/`, url now `/quick-reads/best-ai-seo-skool-groups-2026/`.

## 2. Fidelity restorations across the KEEP set

- **11 pages**: heading text restored to live punctuation/casing (July port had swapped live
  dashes for commas in H2s, e.g. "The Short Answer - SEO Takes 3 to 12 Months").
- **16 frontmatter fields** synced byte-faithful to live (titles/H1s/descriptions).
- **Artefact sweep** (all 106 md): fixed the `C**anonical` broken-bold (the one true instance,
  present on live but ordered fixed), 2 NBSPs, 15 space-before-punctuation cases, 0 double-encoded
  entities, 0 empty links, 0 unbalanced bold. The `X → verb → Y` arrow chains are **deliberate
  live authoring** (semantic triples, present in the live HTML of 98/105 pages) and were kept.

## 3. Method note — audit-data correction (matters for future audits)

`pages.json` word counts / the naive main-region parse are **corrupted for ~30 pages** by stray
`</a>` close tags in the live WP markup (they desync depth tracking, truncating the measured main
region). First-pass numbers suggested 27 pages had "invented" sections; a stack-safe re-extraction
proved those sections exist on live and the July port was faithful. True drift was only the 4
pages above. Corpus ratio distribution after refresh: min 0.944 / median 0.991 / max 1.004.

## 4. Structural deltas vs July port

- NEW `/quick-reads/thank-you/` — ported from live; `noindex: true` (frontmatter contract with
  Q7 **proven in build**: robots meta noindex present, page excluded from sitemap). Mirrored
  `checklist.pdf` (19 MB) to `public/files/`; decoded the Cloudflare-obfuscated email to
  `me@kasradash.com`; excluded from related-guide rotation.
- NEW `/category/quick-reads/` — listing page (live title "Quick Reads Archives - Kasra Dash",
  H1 "Quick Reads"), lists the 3 quick-reads in live (datePublished desc) order. Live has no meta
  description; a short one was written (flagged for Kasra).
- NEW `public/_redirects` (Cloudflare Pages): old uncategorized slug → quick-reads (301, both
  slash forms) and `/category/uncategorized/` → `/category/quick-reads/` (301).
- Schema: `noindex` / `datePublished` / `dateModified` optionals added; **all 106 articles
  stamped** with live WP `article:published_time` / `modified_time`.

## 5. Route parity — integrated build (kd/content-refresh + main)

live: 112 → **built: 111, redirect: 1, MISSING: 0**; surplus routes: 0; expected-new
`/privacy-policy/` built; sitemap: 111 URLs (112 − noindexed thank-you).

| live URL | integrated build |
| --- | --- |
| / | built |
| /about-kasra-dash/ | built |
| /category/quick-reads/ | built |
| /category/uncategorized/ | redirect 301 -> /category/quick-reads/ |
| /contact/ | built |
| /free-ai-seo-sheet/ | built |
| /learn/what-are-keywords/ | built |
| /quick-reads/best-ai-seo-skool-groups-2026/ | built |
| /quick-reads/best-seo-conferences/ | built |
| /quick-reads/best-seo-experts/ | built |
| /quick-reads/thank-you/ | built |
| /seo/ | built |
| /seo/ai-and-seo/ | built |
| /seo/ai-and-seo/ai-and-indexing/ | built |
| /seo/ai-and-seo/ai-content-creation/ | built |
| /seo/ai-and-seo/ai-content-detection/ | built |
| /seo/ai-and-seo/ai-keyword-research/ | built |
| /seo/ai-and-seo/ai-overviews-optimisation/ | built |
| /seo/ai-and-seo/ai-quality-rater-guidelines/ | built |
| /seo/ai-and-seo/ai-search-engines/ | built |
| /seo/ai-and-seo/ai-search-intent/ | built |
| /seo/ai-and-seo/ai-seo-automation/ | built |
| /seo/ai-and-seo/ai-seo-tools/ | built |
| /seo/ai-and-seo/ai-topical-maps/ | built |
| /seo/ai-and-seo/ethical-seo/ | built |
| /seo/ai-and-seo/future-proof-seo/ | built |
| /seo/ai-and-seo/google-mum/ | built |
| /seo/ai-and-seo/prompt-engineering/ | built |
| /seo/ai-and-seo/rankbrain-vs-bert-vs-mum/ | built |
| /seo/content-seo/ | built |
| /seo/content-seo/ai-content-production/ | built |
| /seo/content-seo/ai-overviews/ | built |
| /seo/content-seo/content-audits/ | built |
| /seo/content-seo/content-briefs/ | built |
| /seo/content-seo/content-calendar/ | built |
| /seo/content-seo/content-distribution/ | built |
| /seo/content-seo/content-frameworks/ | built |
| /seo/content-seo/content-gap-analysis/ | built |
| /seo/content-seo/content-pruning/ | built |
| /seo/content-seo/e-e-a-t/ | built |
| /seo/content-seo/entity-optimisation/ | built |
| /seo/content-seo/internal-linking/ | built |
| /seo/content-seo/optimise-old-content/ | built |
| /seo/content-seo/performance-metrics/ | built |
| /seo/content-seo/search-intent/ | built |
| /seo/content-seo/semantic-seo/ | built |
| /seo/content-seo/seo-blog-writing/ | built |
| /seo/content-seo/topical-authority/ | built |
| /seo/learn/ | built |
| /seo/learn/how-long-does-seo-take/ | built |
| /seo/learn/how-search-engines-work/ | built |
| /seo/learn/how-seo-works/ | built |
| /seo/learn/seo-fundamentals/ | built |
| /seo/learn/seo-glossary/ | built |
| /seo/learn/seo-ranking-factors/ | built |
| /seo/learn/seo-strategy-for-beginners/ | built |
| /seo/learn/seo-vs-sem-vs-ppc/ | built |
| /seo/learn/the-3-pillars-of-seo/ | built |
| /seo/learn/what-are-search-engine-algorithms/ | built |
| /seo/learn/what-is-google-indexing/ | built |
| /seo/learn/why-seo-matters/ | built |
| /seo/link-building/ | built |
| /seo/link-building/anchor-text-optimisation/ | built |
| /seo/link-building/backlink-analysis/ | built |
| /seo/link-building/broken-link-building/ | built |
| /seo/link-building/ecommerce-links/ | built |
| /seo/link-building/edu-backlinks/ | built |
| /seo/link-building/free-backlinks/ | built |
| /seo/link-building/guest-posting/ | built |
| /seo/link-building/link-building-lessons/ | built |
| /seo/link-building/link-velocity/ | built |
| /seo/link-building/measure-roi/ | built |
| /seo/link-building/podcast-links/ | built |
| /seo/link-building/strategies/ | built |
| /seo/link-building/testimonial-links/ | built |
| /seo/link-building/tiered-link-building-how-to-safely-build-authority-in-2025/ | built |
| /seo/link-building/wikipedia-backlinks/ | built |
| /seo/seo-frameworks/ | built |
| /seo/seo-frameworks/ai-workflow-templates/ | built |
| /seo/seo-frameworks/backlink-outreach-template/ | built |
| /seo/seo-frameworks/content-audit-template/ | built |
| /seo/seo-frameworks/content-brief-template/ | built |
| /seo/seo-frameworks/content-calendar-template/ | built |
| /seo/seo-frameworks/conversion-framework/ | built |
| /seo/seo-frameworks/ctr-optimisation-framework/ | built |
| /seo/seo-frameworks/eeat-framework/ | built |
| /seo/seo-frameworks/internal-linking-framework/ | built |
| /seo/seo-frameworks/keyword-research-template/ | built |
| /seo/seo-frameworks/seo-audit-template/ | built |
| /seo/seo-frameworks/seo-checklist/ | built |
| /seo/seo-frameworks/seo-reporting-dashboard/ | built |
| /seo/seo-frameworks/technical-seo-framework/ | built |
| /seo/seo-frameworks/topical-map-framework/ | built |
| /seo/technical-seo/ | built |
| /seo/technical-seo/audit/ | built |
| /seo/technical-seo/canonical-tags/ | built |
| /seo/technical-seo/common-mistakes/ | built |
| /seo/technical-seo/core-web-vitals/ | built |
| /seo/technical-seo/crawl-budget/ | built |
| /seo/technical-seo/fix-indexing-issues/ | built |
| /seo/technical-seo/google-algorithm-updates/ | built |
| /seo/technical-seo/google-crawling-and-indexing/ | built |
| /seo/technical-seo/google-penalty-recovery/ | built |
| /seo/technical-seo/google-sandbox/ | built |
| /seo/technical-seo/http-status-codes-for-seo/ | built |
| /seo/technical-seo/javascript-seo/ | built |
| /seo/technical-seo/mobile-first-indexing/ | built |
| /seo/technical-seo/schema-markup-guide/ | built |
| /seo/technical-seo/website-speed-seo | built |
| /seo/technical-seo/xml-sitemaps-robots-txt/ | built |
| /seo/tools/best-seo-tools-recommended-by-experts/ | built |
| /social-media-backlinks/ | built |

- EXPECTED-NEW: /privacy-policy/ — built (added by entity plan (not in live 112))
- EXTRA-REDIRECT: /category/uncategorized -> /category/quick-reads/ (301) — old slug, not in live 112
- EXTRA-REDIRECT: /uncategorized/best-ai-seo-skool-groups-2026 -> /quick-reads/best-ai-seo-skool-groups-2026/ (301) — old slug, not in live 112
- EXTRA-REDIRECT: /uncategorized/best-ai-seo-skool-groups-2026/ -> /quick-reads/best-ai-seo-skool-groups-2026/ (301) — old slug, not in live 112

- live URLs: 112; MISSING: 0
- thank-you robots noindex meta: YES
- thank-you excluded from sitemap: YES
- sitemap URL count: 111

## 6. Residuals & curation notes for Kasra

1. **Em-dash vs comma in body copy (KEEP pages):** the July port systematically replaced live
   em-dashes with commas inside paragraphs. Word-count/heading criteria pass (within tolerance),
   so per the drift rules these ~65 pages were left as-is. A full-fidelity re-port would restore
   live punctuation but drop the July port's added internal links. Decision deferred to curation.
2. Live typos kept verbatim (mirror doctrine): "SEO Content Calander" (thank-you), the
   sitemap/robots line ending "…tells it where not to" (rhetorical, live), empty first header row
   in several live tables, ASCII tree diagrams preserved.
3. `/seo/technical-seo/website-speed-seo` (live sitemap has no trailing slash): served by the same
   built directory; fine on CF Pages.
4. topical-authority now has a single H2 with H3 sections (live structure): the article ToC
   currently lists depth-2 only, so it shows one entry — Q5/Q7 may want depth-3 in the ToC for
   such pages.
5. schema-markup-guide's JSON-LD samples are correctly fenced; built page emits no FAQPage
   (ADDENDUM rule 2 holds — verified in dist).
6. best-seo-experts: the 27 local headshot PNGs from the July version are now unreferenced (live
   dropped them in the 04 Aug rebuild); left in `public/images/` pending curation.
