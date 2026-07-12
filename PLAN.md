# Kasra Dash Website Rebuild Plan

## Stack
Astro 5 (static output) + Tailwind CSS v4, deployed to Cloudflare Pages. No CMS, no database.

## Page inventory (from live sitemaps, 109 pages, slugs preserved exactly)
- **Core pages (4, custom layouts):** `/` (home), `/about-kasra-dash/`, `/contact/`, `/free-ai-seo-sheet/`
- **Pillar:** `/seo/`
- **Hub pages (6):** `/seo/learn/`, `/seo/technical-seo/`, `/seo/link-building/`, `/seo/content-seo/`, `/seo/ai-and-seo/`, `/seo/seo-frameworks/`
- **Article pages (~94):** all children of the hubs above, plus `/learn/what-are-keywords/`, `/social-media-backlinks/`, `/seo/tools/best-seo-tools-recommended-by-experts/`, `/quick-reads/best-seo-experts/`, `/quick-reads/best-seo-conferences/`, `/uncategorized/best-ai-seo-skool-groups-2026/`
- Odd slugs kept as-is: `/seo/technical-seo/website-speed-seo` (no trailing slash in old sitemap), `/learn/what-are-keywords/` (outside /seo/)

## Design system
**Palette (kept from current site):**
- Primary purple `#845CFE`, primary indigo `#4A4EF8` (brand gradient 93deg purple→indigo)
- Deep purple `#291469` (dark sections / footer)
- Ink `#1A1A1A` (text), muted `#5B5971`
- Light lavender `#D0DFFC` / `#F4F1FE` (tints, section backgrounds)
- White surfaces, subtle purple-tinted borders

**Fonts:** Bricolage Grotesque (display/headings, characterful) + Plus Jakarta Sans (body, kept from current brand). Both Google Fonts, self-hostable.

**Spacing rhythm:** 4px base scale, sections at 80/112px desktop, 56/72px mobile, max content width 1200px, article measure ~720px.

## Layouts
- **BaseLayout:** header (logo, nav with dropdowns for the 6 hubs, Work With Me CTA), footer (4-column: brand, SEO topics, frameworks, company + socials), SEO head component.
- **ArticleLayout:** 3-column on desktop — sticky "On this page" jump links left, article centre, sidebar right (author card, related guides, CTA to contact/free sheet). Collapses cleanly on mobile.
- **HubLayout:** hub intro content + card grid of child guides + cross-links to sibling hubs.
- **Home:** asymmetric hero (copy left, stat/photo right) with brand gradient accents, featured-in strip, services grid (2x3 with real copy), case studies (3 cards with metric callouts), "where businesses go wrong vs what top performers do" split section, testimonials, FAQ accordion, newsletter + contact CTA. One primary action per screen: "Work With Me".

## What stays / what changes
**Stays:** all URLs, page titles, H1s, meta descriptions (improved where thin), all article content (tightened, not stripped), colour scheme, ToC + sidebar pattern on articles, FAQ schema.
**Changes:** WordPress/Elementor → static Astro (much faster), new typography, internal linking rebuilt site-wide (hub↔spoke + contextual cross-links on every page), proper OG tags + JSON-LD on every page, generated sitemap.xml + robots.txt.

## SEO protection
- Slugs byte-identical to old sitemap. Titles and H1s preserved. One H1 per page.
- Meta descriptions kept or improved; OG + Twitter tags sitewide; Person/Organization + Article + FAQPage + BreadcrumbList JSON-LD.
- sitemap.xml generated at build; robots.txt pointing at it.
- Internal linking: every article links up to its hub, sideways to 3-6 related guides in-copy, hubs link down to all children.

## Deploy (after approval only)
`npm run build` → GitHub repo → Cloudflare Pages (build: `npm run build`, output: `dist`).
