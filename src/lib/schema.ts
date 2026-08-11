/**
 * Sitewide JSON-LD entity graph — single source of truth.
 *
 * Every page emits exactly ONE <script type="application/ld+json"> (via Seo.astro)
 * containing a single @graph: Person (#person) + WebSite (#website) + the page's
 * WebPage node + any page-specific nodes (Article, BreadcrumbList, …).
 *
 * Rules this module enforces (entity blueprint, reports PLAN.md §C):
 * - ONE #person definition, @type Person only (never Person+Organization).
 * - Article/BlogPosting author is ALWAYS { '@id': PERSON_ID } — no second author id.
 * - No FAQPage anywhere (deprecated for commercial sites Aug 2023).
 * - No kgmid URLs in sameAs (the live site's three claims are unverified).
 * - No TikTok in sameAs (ownership unconfirmed).
 * - All sameAs URLs verified live 2026-08-11 (brain audit, q3-asset-inventory.md).
 */

import { SITE_URL, SITE_NAME } from './site';

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

// Self-hosted image contract with Q5 (they port the files; keep these exact paths):
//   /images/kasra-dash.jpg      — Kasra portrait (replaces expiring fbcdn/gstatic URLs)
//   /images/Frame-106.png       — The Masterminders logo (already in public/images/)
//   /images/Group-89.png        — site logo mark (already in public/images/)
export const PERSON_IMAGE = `${SITE_URL}/images/kasra-dash.jpg`;

/** Canonical positioning phrase (PLAN.md §D — ratified by Kasra 11 Aug 2026). Verbatim, everywhere. */
export const CANONICAL_PHRASE = 'Kasra Dash is an entrepreneur and SEO consultant based in Manchester, UK.';

/** Canonical phrase + notable-for extension — meta description / Person.description. */
export const CANONICAL_DESCRIPTION =
  'Kasra Dash is an entrepreneur and SEO consultant based in Manchester, UK, known for recovering websites from Google algorithm updates. He is the founder of The Masterminders conference, creator of mySEO, and co-author of three SEO books.';

const MANCHESTER_ADDRESS = {
  '@type': 'PostalAddress',
  addressLocality: 'Manchester',
  addressCountry: 'United Kingdom',
};

// Verified sameAs superset (all loaded live 2026-08-11 — q3-asset-inventory.md).
// Deliberately excluded: TikTok @kasradash (ownership unconfirmed), all google.com/search?kgmid=
// self-claims (three conflicting ids, none verified), eeat-seo.com (domain dead).
const PERSON_SAME_AS = [
  'https://www.linkedin.com/in/kasra-dash/', // https + canonical slug (live site's entry was malformed)
  'https://x.com/Kasra_Dash',
  'https://www.instagram.com/kasra_d_/',
  'https://www.facebook.com/Kasra.Dash1',
  'https://www.youtube.com/@kasradash',
  'https://www.imdb.com/name/nm15224956/',
  'https://www.crunchbase.com/person/kasra-dash',
  'https://muckrack.com/kasra-dash',
  'https://www.goodreads.com/author/show/53003680.Kasra_Dash',
  'https://www.amazon.co.uk/stores/Kasra-Dash/author/B0DM9HTLRL',
  'https://www.amazon.com/stores/Kasra-Dash/author/B0DM9HTLRL',
  'https://brightonseo.com/people/kasra-dash',
  'https://www.udemy.com/user/kasra-dash/',
  'https://surferseo.com/author/kasra-dash/',
  'https://grokipedia.com/page/Kasra_Dash',
  'https://themasterminders.com/',
  'https://myseo.app/',
];

// Founder/worksFor org nodes — sameAs sets copied from the live site's hand-built schema
// (crawl 2026-08-11). TODO: append Companies House filing URLs to each sameAs once Kasra
// confirms the registered company numbers (P0 open item — unconfirmed, do not guess).
const ORG_MASTERMINDERS = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#org-the-masterminders`,
  name: 'The Masterminders',
  url: 'https://themasterminders.com/',
  foundingDate: '2023',
  founder: { '@id': PERSON_ID },
  logo: `${SITE_URL}/images/Frame-106.png`,
  description:
    'The Masterminders is a premium conference in Manchester that brings together business owners and SEO professionals for high-level networking and knowledge sharing.',
  sameAs: [
    'https://themasterminders.com/',
    'https://www.facebook.com/p/The-Masterminders-61558441434573/',
    'https://www.instagram.com/themasterminders/',
    'https://www.youtube.com/@TheMasterminders',
    'https://www.linkedin.com/company/the-masterminders/',
  ],
};

const ORG_MYSEO = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#org-myseo`,
  name: 'mySEO',
  url: 'https://myseo.app/',
  foundingDate: '2025',
  founder: { '@id': PERSON_ID },
  description:
    'mySEO is an invite-only community app for SEO professionals, creating an exclusive network where vetted experts collaborate and share strategies.',
  sameAs: [
    'https://myseo.app/',
    'https://www.facebook.com/profile.php?id=61580369738138',
    'https://www.instagram.com/myseoapp/',
  ],
};

// subjectOf — the six verified press/reference articles about Kasra (URLs loaded live
// 2026-08-11; MEN + The Sun from reports PLAN.md, remainder from q3-asset-inventory.md §3.1).
const PRESS_ARTICLES = [
  {
    '@type': 'Article',
    headline: "'I'm a millionaire at 26 – I learned everything I know on YouTube'",
    url: 'https://www.manchestereveningnews.co.uk/news/greater-manchester-news/im-millionaire-26--learned-28767260',
    datePublished: '2024-03-11',
    publisher: { '@type': 'Organization', name: 'Manchester Evening News' },
  },
  {
    '@type': 'Article',
    headline: 'Self-made millionaire at 26 who learned everything on YouTube',
    url: 'https://www.thesun.co.uk/money/26455805/millionaire-learned-everything-youtube/',
    datePublished: '2024-03-07',
    publisher: { '@type': 'Organization', name: 'The Sun' },
  },
  {
    '@type': 'Article',
    headline: 'How a 26-year-old Millionaire built his Fortune',
    url: 'https://www.desiblitz.com/content/how-a-26-year-old-millionaire-built-his-fortune',
    datePublished: '2024-03-11',
    publisher: { '@type': 'Organization', name: 'DESIblitz' },
  },
  {
    '@type': 'Article',
    headline: 'How did this self-made millionaire achieve tremendous success in digital marketing?',
    url: 'https://marketrealist.com/how-did-this-self-made-millionaire-achieve-tremendous-success-in-digital-marketing/',
    datePublished: '2024-06-16',
    publisher: { '@type': 'Organization', name: 'Market Realist' },
  },
  {
    '@type': 'Article',
    headline: 'Kasra Dash: TaxBite opens new firm in Manchester',
    url: 'https://www.businesscheshire.co.uk/2023/03/23/kasra-dash-taxbite-opens-new-firm-in-manchester/',
    datePublished: '2023-03-23',
    publisher: { '@type': 'Organization', name: 'Business Cheshire' },
  },
  {
    '@type': 'Article',
    headline: 'Kasra Dash',
    url: 'https://grokipedia.com/page/Kasra_Dash',
    publisher: { '@type': 'Organization', name: 'Grokipedia' },
  },
];

// performerIn — eight strongest verified guest appearances (q3-asset-inventory.md §3.2:
// the three whose episode pages cite kasradash.com, plus Craig Campbell 2019, Unscripted SEO,
// Rhino Rank and DDD Ep 1, plus the oEmbed-verified WOSCon interview). url only where a
// public episode/profile URL was verified — never guessed.
const GUEST_APPEARANCES = [
  {
    '@type': 'PodcastEpisode',
    name: 'Getting Started in SEO with Kasra Dash',
    datePublished: '2019-11-19',
    partOfSeries: { '@type': 'PodcastSeries', name: "Craig Campbell's Digital Marketing Podcast" },
  },
  {
    '@type': 'PodcastEpisode',
    name: 'Recovering from the Google Update Storm',
    datePublished: '2023-09-28',
    url: 'https://unscriptedseo.com/kasra-dash/',
    partOfSeries: { '@type': 'PodcastSeries', name: 'The Unscripted SEO Interview Podcast' },
  },
  {
    '@type': 'PodcastEpisode',
    name: "Google doesn't ignore bad links!",
    datePublished: '2023-10-17',
    partOfSeries: { '@type': 'PodcastSeries', name: 'Forte Growth' },
  },
  {
    '@type': 'PodcastEpisode',
    name: 'DDD Podcast Ep 1 — James Dooley & Kasra Dash',
    datePublished: '2024-05-22',
    partOfSeries: { '@type': 'PodcastSeries', name: 'Fatrank Podcast' },
  },
  {
    '@type': 'PodcastEpisode',
    name: '#52 The Secrets of Link Building & SEO',
    datePublished: '2024-08-09',
    partOfSeries: { '@type': 'PodcastSeries', name: 'Marketing Quacks Podcast' },
  },
  {
    '@type': 'PodcastEpisode',
    name: 'The Truth About Local SEO',
    datePublished: '2025-09-01',
    url: 'https://open.spotify.com/episode/3RFc0olg8KNoYd1gME225f',
    partOfSeries: { '@type': 'PodcastSeries', name: 'The Rhino Rank Podcast' },
  },
  {
    '@type': 'PodcastEpisode',
    name: 'Why Lazy SEO Is Dead and Brands Win',
    datePublished: '2025-09-09',
    partOfSeries: { '@type': 'PodcastSeries', name: 'Revenue Optimization with StatsDrone' },
  },
  {
    '@type': 'VideoObject',
    name: 'WOSCon 2024 Live Interview — Kasra Dash',
    url: 'https://www.youtube.com/watch?v=FfkRa228qs8',
    uploadDate: '2024-10-01',
  },
];

/**
 * The ONE Person node. Emitted on every page.
 * Deliberately omitted (unverified — P0 open items, do not add until confirmed):
 * awards (live field holds non-awards), Course (stale 2023), birthPlace/nationality wording,
 * alumniOf Edinburgh Napier, Companies House URLs, kgmid links, TikTok, PodcastSeries
 * (no /podcast/ page exists in this phase).
 */
export function personNode() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE_NAME,
    alternateName: ['Kasra D', 'Kasra D.'],
    givenName: 'Kasra',
    familyName: 'Dash',
    birthDate: '1997-11-10',
    email: 'me@kasradash.com',
    url: `${SITE_URL}/`,
    image: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#personimage`,
      url: PERSON_IMAGE,
      contentUrl: PERSON_IMAGE,
      caption: 'Kasra Dash, entrepreneur and SEO consultant, in Manchester',
      inLanguage: 'en-GB',
    },
    jobTitle: 'Entrepreneur and SEO Consultant',
    description: CANONICAL_DESCRIPTION,
    disambiguatingDescription:
      'Kasra Dash is an entrepreneur and SEO consultant based in Manchester, UK, known for recovering websites from Google algorithm updates.',
    address: MANCHESTER_ADDRESS,
    homeLocation: {
      '@type': 'Place',
      name: 'Manchester, United Kingdom',
      address: MANCHESTER_ADDRESS,
    },
    hasOccupation: [
      { '@type': 'Occupation', name: 'Entrepreneur' },
      { '@type': 'Occupation', name: 'SEO Consultant' },
      { '@type': 'Occupation', name: 'Conference Organizer' },
    ],
    knowsAbout: [
      'SEO',
      'Digital Marketing',
      'Entrepreneurship',
      'Local SEO',
      'Link Building',
      'Google Business Profile',
      'Algorithm Updates',
      'SEO Recovery',
      'Rank and Rent',
      'Technical SEO',
    ],
    additionalType: [
      'https://en.wikipedia.org/wiki/Entrepreneur',
      'https://en.wikipedia.org/wiki/Digital_marketing',
    ],
    founder: [ORG_MASTERMINDERS, ORG_MYSEO],
    worksFor: [{ '@id': ORG_MASTERMINDERS['@id'] }, { '@id': ORG_MYSEO['@id'] }],
    subjectOf: PRESS_ARTICLES,
    performerIn: GUEST_APPEARANCES,
    sameAs: PERSON_SAME_AS,
  };
}

/** The ONE WebSite node. Emitted on every page. */
export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    description: CANONICAL_PHRASE,
    publisher: { '@id': PERSON_ID },
    inLanguage: 'en-GB',
  };
}

export type PageType = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage';

export function webPageId(canonical: string) {
  return `${canonical}#webpage`;
}

export function breadcrumbId(canonical: string) {
  return `${canonical}#breadcrumb`;
}

export interface Crumb {
  label: string;
  href: string;
}

export interface WebPageOpts {
  canonical: string;
  title: string;
  description: string;
  pageType?: PageType;
  datePublished?: string;
  dateModified?: string;
  hasBreadcrumb?: boolean;
  /** Extra properties merged onto the WebPage node (e.g. mainEntity, about, hasPart). */
  extras?: Record<string, unknown>;
}

export function webPageNode({ canonical, title, description, pageType = 'WebPage', datePublished, dateModified, hasBreadcrumb = false, extras = {} }: WebPageOpts) {
  return {
    '@type': pageType,
    '@id': webPageId(canonical),
    url: canonical,
    name: title,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: 'en-GB',
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(hasBreadcrumb ? { breadcrumb: { '@id': breadcrumbId(canonical) } } : {}),
    ...extras,
  };
}

export function breadcrumbNode(canonical: string, crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId(canonical),
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: new URL(c.href, SITE_URL).href,
    })),
  };
}

export interface ArticleOpts {
  canonical: string;
  headline: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}

/** Article node for content pages. author/publisher are ALWAYS @id refs to #person. */
export function articleNode({ canonical, headline, description, image, datePublished, dateModified }: ArticleOpts) {
  return {
    '@type': 'Article',
    '@id': `${canonical}#article`,
    headline,
    description,
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    mainEntityOfPage: { '@id': webPageId(canonical) },
    image: image ? new URL(image, SITE_URL).href : `${SITE_URL}/images/Group-89.png`,
    inLanguage: 'en-GB',
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  };
}

/** Wrap nodes into the page's single JSON-LD payload. */
export function buildGraph(nodes: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}
