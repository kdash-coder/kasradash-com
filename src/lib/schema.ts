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

// performerIn — ten strongest verified guest appearances. Curation: q3-asset-inventory.md
// §3.2 (the three whose episode pages cite kasradash.com, plus Craig Campbell 2019,
// Unscripted SEO, Rhino Rank, DDD Ep 1, the oEmbed-verified WOSCon interview), plus the
// two URL-backed episodes carried over from the LIVE site's performerIn (SirLinksalot,
// Market Movers — both independently verified via the Apple API in q3; both URLs
// re-checked 2026-08-11: HTTP 200 with "Kasra Dash" present in the served HTML).
// Episode urls come from the live schema or q3 verification only — never guessed.
const GUEST_APPEARANCES = [
  {
    '@type': 'PodcastEpisode',
    name: 'Getting Started in SEO with Kasra Dash',
    datePublished: '2019-11-19',
    url: "https://music.amazon.co.uk/podcasts/1f41a9c5-aa99-4b00-ac37-137e24be977c/episodes/85894405-f40a-4838-8571-84949e026983/craig-campbell's-digital-marketing-podcast-getting-started-in-seo-with-kasra-dash",
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
    name: 'SEO Evolution, Fitness, and Entrepreneurial Balance',
    datePublished: '2025-05-30',
    url: 'https://sirlinksalot.co/kasra-dash-seo-evolution-entrepreneurial-balance/',
    partOfSeries: { '@type': 'PodcastSeries', name: 'SirLinksalot Digital Marketing Podcast' },
  },
  {
    '@type': 'PodcastEpisode',
    name: 'The Truth About Local SEO',
    datePublished: '2025-09-01',
    url: 'https://www.rhinorank.io/blog/the-truth-about-local-seo-with-kasra-dash/',
    sameAs: ['https://open.spotify.com/episode/3RFc0olg8KNoYd1gME225f'],
    partOfSeries: { '@type': 'PodcastSeries', name: 'The Rhino Rank Podcast' },
  },
  {
    '@type': 'PodcastEpisode',
    name: 'Why Lazy SEO Is Dead and Brands Win',
    datePublished: '2025-09-09',
    url: 'https://podcasts.apple.com/us/podcast/kasra-dash-on-why-lazy-seo-is-dead-and-brands-win/id1700893670?i=1000725692126',
    partOfSeries: { '@type': 'PodcastSeries', name: 'Revenue Optimization with StatsDrone' },
  },
  {
    '@type': 'PodcastEpisode',
    name: "Parasite Conferences, Rank-and-Rent Power — Inside Kasra Dash's Playbook",
    datePublished: '2025-10-02',
    url: 'https://www.marketmoverspod.com/e/parasite-conferences-rank-and-rent-power-and-big-link-plays-inside-kasra-dash-s-playbook/',
    partOfSeries: { '@type': 'PodcastSeries', name: 'Market Movers' },
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
 * alumniOf Edinburgh Napier, Companies House URLs, person-level kgmid links, TikTok.
 * PodcastSeries lives ONLY on /podcast/ (podcastSeriesNode); Person links books via author refs.
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
    // Entity blueprint §C: the person references his three Book @ids sitewide;
    // the full Book nodes live on their own /books/* pages.
    author: personAuthorRefs(),
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

/* ------------------------------------------------------------------ */
/* Trust pages (kd/trust-pages) — books, podcast, partnership orgs.    */
/* Every URL/ASIN/ISBN/date below verified 2026-08-11                  */
/* (q3-asset-inventory.md §1-2 + Goodreads work page loaded live).     */
/* ------------------------------------------------------------------ */

export interface BookFormat {
  label: string;
  asin: string;
}

export interface BookDef {
  slug: string;
  /** Exact Amazon title. */
  name: string;
  subtitle: string;
  datePublished: string;
  isbn?: string;
  /** Byline order as printed on Amazon. */
  authorNames: string[];
  formats: BookFormat[];
  /** Primary ASIN for the dp/ links (the format q3 verified on both marketplaces). */
  primaryAsin: string;
  goodreads?: string;
  /** Extra verified sameAs URLs (book site, kgmid — playbook only). */
  extraSameAs?: string[];
}

export const BOOKS: BookDef[] = [
  {
    slug: 'the-complete-local-seo-playbook',
    name: 'The Complete Local SEO Playbook 2025',
    subtitle:
      'Proven Strategies for Boosting Your Rankings, Optimising Your Google Business Profile, and Link Building',
    datePublished: '2024-11-15',
    isbn: '9798345497913',
    authorNames: ['Mike Martin', 'James Dooley', 'Kasra Dash'],
    formats: [
      { label: 'Paperback', asin: 'B0DM55R5W4' },
      { label: 'Kindle', asin: 'B0DM2HFYK6' },
    ],
    primaryAsin: 'B0DM55R5W4',
    goodreads: 'https://www.goodreads.com/book/show/221235522-the-complete-local-seo-playbook-2025',
    extraSameAs: [
      'https://thecompletelocalseoplaybook.com/',
      // The ONE verified book KGMID (from James Dooley's live schema) — this book only.
      'https://www.google.com/search?kgmid=/g/11lw0t0wcl',
    ],
  },
  {
    slug: 'advanced-seo-tips',
    name: 'Advanced SEO Tips 2025: The Future of Search',
    subtitle: 'Myths Busted, SEO Strategies Revealed',
    datePublished: '2025-04-13',
    authorNames: ['James Dooley', 'Kasra Dash', 'Karl Hudson', 'Andrew Halliday', 'Koray Gübür'],
    formats: [
      { label: 'Kindle', asin: 'B0F4QXZXHQ' },
      { label: 'Hardcover', asin: 'B0DW88LPJG' },
      { label: 'Paperback', asin: 'B0DW8KY9HQ' },
    ],
    primaryAsin: 'B0F4QXZXHQ',
  },
  {
    slug: 'igaming-seo',
    name: 'iGaming SEO',
    subtitle: 'The Truth About Advanced SEO for Online Gambling: Casinos, Slots, Bingo & Sports Betting',
    datePublished: '2025-04-11',
    authorNames: ['James Dooley', 'Karl Hudson', 'Kasra Dash', 'Koray Gübür'],
    formats: [
      { label: 'Kindle', asin: 'B0D91ZSFMP' },
      { label: 'Hardcover', asin: 'B0F1JW8F8R' },
      { label: 'Paperback', asin: 'B0F1FXDNP6' },
    ],
    primaryAsin: 'B0D91ZSFMP',
  },
];

export function bookId(slug: string) {
  return `${SITE_URL}/books/${slug}/#book`;
}

export function bookUrl(book: BookDef) {
  return `${SITE_URL}/books/${book.slug}/`;
}

export function amazonUk(book: BookDef) {
  return `https://www.amazon.co.uk/dp/${book.primaryAsin}`;
}

export function amazonUs(book: BookDef) {
  return `https://www.amazon.com/dp/${book.primaryAsin}`;
}

/** Co-author Person nodes: James Dooley keeps his verified url (the reciprocal
 * co-author triangle — his schema already credits Kasra); everyone else is name-only. */
function bookAuthor(name: string): object {
  if (name === 'Kasra Dash') return { '@id': PERSON_ID };
  if (name === 'James Dooley') return { '@type': 'Person', name: 'James Dooley', url: 'https://jamesdooley.com/' };
  return { '@type': 'Person', name };
}

/** Full Book node — emitted ONLY on that book's page. */
export function bookNode(book: BookDef) {
  return {
    '@type': 'Book',
    '@id': bookId(book.slug),
    name: book.name,
    alternateName: `${book.name}: ${book.subtitle}`,
    url: bookUrl(book),
    author: book.authorNames.map(bookAuthor),
    datePublished: book.datePublished,
    inLanguage: 'en-GB',
    bookFormat: 'https://schema.org/Paperback',
    ...(book.isbn ? { isbn: book.isbn } : {}),
    workExample: book.formats.map((f) => ({
      '@type': 'Book',
      bookFormat: f.label === 'Kindle' ? 'https://schema.org/EBook' : `https://schema.org/${f.label}`,
      url: `https://www.amazon.co.uk/dp/${f.asin}`,
    })),
    sameAs: [
      amazonUk(book),
      amazonUs(book),
      ...(book.goodreads ? [book.goodreads] : []),
      ...(book.extraSameAs ?? []),
    ],
    mainEntityOfPage: { '@id': webPageId(bookUrl(book)) },
  };
}

/** ItemList for the /books/ hub. */
export function booksItemListNode() {
  return {
    '@type': 'ItemList',
    '@id': `${SITE_URL}/books/#booklist`,
    itemListElement: BOOKS.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@id': bookId(b.slug) },
      name: b.name,
      url: bookUrl(b),
    })),
  };
}

/** Person.author → the three Book @ids (entity blueprint §C). */
export function personAuthorRefs() {
  return BOOKS.map((b) => ({ '@id': bookId(b.slug) }));
}

/** The Business Dash With Kasra — a YouTube interview series (no Spotify/Apple
 * presence; YouTube URLs only). Emitted ONLY on /podcast/. */
export const PODCAST_PLAYLIST = 'https://www.youtube.com/playlist?list=PL542wQmQgo070aOOyJJIJTkykp6K_M3M-';

/** The 18 contributor names from the live homepage schema (crawl 2026-08-11). */
export const PODCAST_GUESTS = [
  'Kyle Roof',
  'Lily Ray',
  'Koray Tuğberk Gübür',
  'Patrick Stox',
  'Craig Campbell',
  'Joe Davies',
  'Julian Goldie',
  'Fery Kaszoni',
  'Karl Hudson',
  'Ryan Stewart',
  'Lara Acosta',
  'Robert Niechciał',
  'Gareth Hoyle',
  'Gareth Bull',
  'Jason Hennessey',
  'Gary Wilson',
  'Alex Drew',
  'Niels Zee',
];

export function podcastSeriesNode() {
  const canonical = `${SITE_URL}/podcast/`;
  return {
    '@type': 'PodcastSeries',
    '@id': `${canonical}#series`,
    name: 'The Business Dash With Kasra',
    description:
      'The Business Dash With Kasra is a YouTube interview series in which Kasra Dash interviews SEOs, business owners and entrepreneurs.',
    url: canonical,
    mainEntityOfPage: { '@id': webPageId(canonical) },
    author: { '@id': PERSON_ID },
    inLanguage: 'en-GB',
    contributor: PODCAST_GUESTS.map((name) => ({ '@type': 'Person', name })),
    sameAs: [PODCAST_PLAYLIST, 'https://www.youtube.com/@kasradash'],
  };
}

/** Partnership orgs — url + sameAs ONLY (no Companies House: numbers unconfirmed).
 * Role wording on-page comes verbatim from each org's own site. */
export function partnershipOrgNodes() {
  return [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#org-searcharoo`,
      name: 'Searcharoo',
      url: 'https://searcharoo.com/',
      sameAs: ['https://searcharoo.com/about-kasra-dash/'],
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#org-fatrank`,
      name: 'FatRank',
      url: 'https://www.fatrank.com/',
      sameAs: ['https://www.fatrank.com/'],
    },
  ];
}
