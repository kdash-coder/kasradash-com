---
title: "Is WordPress Dying for SEO? Why I Think It Is"
description: "Is WordPress dying for SEO? WordPress vulnerabilities rose from 1,382 in 2021 to 11,334 in 2025 and its market share is falling. Here is what to do about it."
h1: "Is WordPress Dying for SEO? Why I Think It Is"
url: "/seo/technical-seo/is-wordpress-dying/"
silo: "/seo/technical-seo/"
siloName: "Technical SEO"
kind: "article"
datePublished: "2026-10-18T21:00:00+00:00"
dateModified: "2026-10-18T21:00:00+00:00"
ogImage: "/images/kasradash.com_.png"
---

**WordPress is dying as the default choice for SEO**, and the numbers back it up: reported WordPress vulnerabilities went from 1,382 in 2021 to 11,334 in 2025, and its share of the web has dropped from 43.6% to 39.6% in under two years. [Kasra Dash](https://kasradash.com/) ran this site on WordPress before rebuilding it as a static Astro site on Cloudflare, so this is a decision I have already made with my own rankings on the line. By the end you will know whether your site should stay on WordPress, and what to do this month if it does.

## Is WordPress dying?

**WordPress is not dead, but it is in decline as an SEO platform.** It still powers roughly four in ten websites. What has changed is the cost of running it safely, the speed at which plugin flaws are being found, and the fact that AI now makes a fast static site cheaper to build than a well-maintained WordPress install. Those three things together are why I think it is dying for SEO.

## The security numbers are exploding

**Reported WordPress vulnerabilities rose more than eightfold between 2021 and 2025.** These are Patchstack's figures for WordPress core, plugins and themes combined.

| Year | Reported vulnerabilities |
|---|---|
| 2021 | 1,382 |
| 2022 | 4,528 |
| 2023 | 5,948 |
| 2024 | 7,966 |
| 2025 | 11,334 |
| 2026 (to 18 October) | 10,295 |

Put the last two rows side by side. **2026 has already logged 10,295 disclosed vulnerabilities with ten weeks of the year left**, against 31,158 for the whole of 2021 to 2025 combined. Patchstack's [State of WordPress Security in 2026](https://patchstack.com/whitepaper/state-of-wordpress-security-in-2026/) report puts the 2025 jump at 42% on the year before.

These are disclosures, not confirmed hacks. A reported flaw in a plugin you do not run does nothing to you. But the trend matters, because every one of those disclosures is a patch someone has to apply, on a site that someone has to keep checking.

### The flaws that hit millions of sites

**The biggest WordPress security flaws of the last three years sat in plugins that SEOs install by default.** A few from the period:

- **tagDiv Composer (2023):** a stored cross-site scripting flaw that was actively targeted in attacks.
- **LiteSpeed Cache (2024):** privilege escalation and cross-site scripting in one of the most popular caching plugins, the kind you install for Core Web Vitals.
- **Really Simple Security (2024):** a critical authentication bypass in a plugin people install to make their site more secure.
- **SureTriggers / OttoKit (2025):** an authorisation bypass with exploitation attempts recorded.

Look at that list from an SEO's point of view. A caching plugin and a security plugin are on it. The tools WordPress users add to fix WordPress are themselves the attack surface.

## Why a hacked WordPress site is an SEO problem

**A hacked WordPress site loses rankings because Google treats injected spam as your content.** The common pattern is thousands of hidden spam pages, cloaked redirects, or casino and pharma links injected into existing posts, often visible only to Googlebot.

When that happens, three things follow:

1. **Search results can show a "This site may be hacked" warning**, which collapses click-through rate overnight.
2. **Google can issue a manual action for hacked content**, visible in Search Console under Security and Manual Actions.
3. **The clean-up takes longer than the hack.** You remove the pages, request a review, and wait for Google to recrawl and trust the site again.

Google documents the process in its [Search Central security guidance](https://developers.google.com/search/docs/monitor-debug/security). I have seen sites recover fully and sites that never got back to where they were. Either way, you lose weeks you did not need to lose. Because recovery depends on Google recrawling and re-evaluating the site, the sites with the least crawl attention take the longest to come back.

## AI changes the speed, not the definition of a hack

**AI speeds up both sides: flaws get found faster, and attackers target them faster.** Automated code review can surface weaknesses in plugin code that went unnoticed for years. The same automation lets attackers research and scan for vulnerable sites at scale. Defenders get faster too, and patches ship sooner.

I would not claim AI caused the rise in disclosures. Rising disclosure counts alone do not prove more successful hacks. What AI does change is the window. **The time between a plugin flaw being published and bots probing for it is shrinking**, and a WordPress site that gets updated once a month is now exposed for most of that month.

## WordPress is losing market share

**WordPress fell from 43.6% of all websites in January 2025 to 39.6% by 18 October 2026**, according to [W3Techs](https://w3techs.com/technologies/history_overview/content_management/all/y). That is the biggest fall in its history. It grew from 23.3% in 2015 to that peak, and in 21 months it has slipped back to where it was in January 2021.

Market share is not a ranking factor. Google does not care what CMS you use. But the share figure tells you where builders are going, and they are going to hosted platforms like Shopify and Wix, and to static and headless setups built with frameworks like Astro and Next.js.

## Why I moved kasradash.com off WordPress

**I rebuilt kasradash.com as a static Astro site on Cloudflare because the maintenance cost of WordPress no longer bought me anything.** Every page on this site is a plain HTML file served from Cloudflare's edge. There is no database to inject into, no admin login to brute force, and no plugin to patch on a Tuesday night.

Here is how the two setups compare for an SEO site:

| | WordPress | Static site (Astro on Cloudflare) |
|---|---|---|
| Attack surface | Core, plugins, themes, database, admin login | Static files only |
| Patching | Ongoing, often weekly | Framework updates when you choose |
| Speed out of the box | Depends on theme, plugins and caching | Fast by default, HTML served from the edge |
| SEO features | Plugins (titles, schema, sitemaps) | Built into the templates once |
| Editing | Visual editor, non-technical friendly | Markdown files, or AI-assisted edits |
| Hosting cost | Managed WordPress hosting | Free or near-free on Cloudflare |

The honest trade-off is editing. WordPress lets anyone log in and publish. A static site means editing files. Two years ago that was a deal-breaker for most business owners. Now, with Claude or another AI coding tool, I describe the change and the file gets edited, built and deployed. That is how this article was published.

**AI removed the main reason to stay on WordPress, which was that it was the easiest way for a non-developer to run a website.**

## What I see go wrong on WordPress sites

**Most WordPress SEO problems I audit are plugin problems, not content problems.** The patterns that come up again and again:

- **Plugin stacking.** An SEO plugin, a schema plugin, a redirect plugin, a caching plugin, a page builder and a security plugin, each loading its own scripts. Six plugins, six attack surfaces, six update cycles.
- **Abandoned plugins left active.** A plugin that has not been updated in two years is still running on the site because nobody remembers what it does.
- **Page builders bloating every page.** Elementor alone runs on 31.6% of WordPress sites according to W3Techs, and builder markup is one of the most common reasons a WordPress page fails Core Web Vitals.
- **No one owns updates.** The agency built it, the client was meant to update it, and neither did.

If you recognise your site in that list, run it through a proper [SEO checklist](/seo/seo-frameworks/seo-checklist/) before you do anything else.

## Should you leave WordPress?

**Leave WordPress if your site is mostly content and nobody is responsible for patching it.** Stay, for now, if you rely on a plugin ecosystem you cannot rebuild, such as WooCommerce with complex integrations, or a team of non-technical editors publishing daily.

If you stay, do these four things this month:

1. **Delete every plugin you are not actively using.** Deactivated is not enough. Delete it.
2. **Turn on automatic updates for plugins and core**, and check Search Console's Security Issues report once a week.
3. **Put the site behind Cloudflare** or a similar firewall that blocks known exploit patterns before they reach WordPress.
4. **Replace the page builder on your money pages** with lightweight templates, starting with the pages that bring in the most organic traffic.

If you leave, treat it like any migration. Keep every URL identical or 301 redirect it, carry over titles, meta descriptions and schema, and compare indexed pages in Search Console before and after. Your rankings come from your content, your links and your entity, which is why the [SEO ranking factors](/seo/learn/seo-ranking-factors/) do not change when your CMS does. The [technical SEO guide](/seo/technical-seo/) covers the crawl and indexing checks to run after launch.

## Frequently Asked Questions About WordPress and SEO

### Is WordPress bad for SEO?

WordPress is not bad for SEO in itself. Google does not rank sites higher or lower because of the CMS. The problem is everything around it: plugin bloat that slows pages down, and security flaws that can get a site hacked and filled with spam, which does hurt rankings.

### Will Google penalise my WordPress site?

Google will not penalise a site for running WordPress. Google can issue a manual action if a WordPress site is hacked and serving spam, and that is the real risk. Keep plugins updated, remove the ones you do not use, and check Search Console's Security Issues report regularly.

### What is the best alternative to WordPress for SEO?

For content sites, a static site built with a framework like Astro and hosted on Cloudflare is the strongest alternative. Pages are fast by default and there is no database or login to attack. For online shops, a hosted platform like Shopify removes most of the maintenance burden.

### Will I lose rankings if I move off WordPress?

You will not lose rankings if the migration keeps every URL, title, meta description, internal link and piece of content intact. Most ranking drops after a migration come from changed URLs without redirects, or content that was trimmed in the move. Map every URL before you switch.

### Is WordPress still worth learning in 2026?

WordPress still powers around four in ten websites, so client work on it will exist for years. For your own sites, I would put that time into learning to build and deploy static sites with AI, because that skill gets cheaper and faster every month.

## Final Thoughts

**WordPress is dying for SEO because the cost of keeping it safe keeps rising while the cost of the alternative keeps falling.** Disclosed vulnerabilities went from 1,382 to 11,334 in four years, and 2026 is on track to beat that. A static site gives you speed and security by default, and AI has made it something a non-developer can run. If you are staying on WordPress, clean up your plugins this week. If you want to see how I build and test sites like this one, subscribe to the [Kasra Dash YouTube channel](https://www.youtube.com/@kasradash).
