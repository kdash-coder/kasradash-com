/*
 * Free resources (lead magnets). One entry = one opt-in page at /free/<slug>/.
 *
 * To add a new opt-in: copy an entry, change the slug and content, build.
 * The page shows the first `freeItems` items, locks the rest behind <EmailGate />,
 * and posts the lead to the universal GoHighLevel webhook with
 * source "free-<slug>" and tag "src:free-<slug>". The welcome email links back to
 * the page with ?sub=1, which opens it unlocked.
 *
 * Only real, checked data goes in here: these pages are what people get when
 * they comment a keyword on a reel.
 */

export interface ResourceItem {
  name: string;
  /** Ahrefs Domain Rating, if it applies. */
  dr?: number;
  pricing?: string;
  url: string;
  note?: string;
}

export interface ResourceGroup {
  name: string;
  blurb?: string;
  items: ResourceItem[];
}

export interface FreeResource {
  slug: string;
  /** <title> */
  title: string;
  description: string;
  h1: string;
  /** Short line under the H1. */
  intro: string;
  /** The comment keyword on the reel, shown as a small confirmation. */
  keyword?: string;
  /** What they are signing up to get: first line of the welcome email. */
  assetName: string;
  /** Plural noun for the items ("directories", "templates"). */
  noun: string;
  /** How many items are visible before the email gate. */
  freeItems: number;
  /** Steps shown above the list. */
  howTo: string[];
  gatePoints: string[];
  /** Where the data came from, shown under the list. */
  sourceNote: string;
  datePublished: string;
  groups: ResourceGroup[];
}

export const FREE_RESOURCES: FreeResource[] = [
  {
    slug: 'business-directories',
    title: '50 Free Business Directories to List Your Business On',
    description:
      '50 free business directories, sorted by Domain Rating: maps, review sites, UK and US local directories, and listings for software and agencies, with the link to submit each one.',
    h1: '50 free directories to list your business on',
    intro:
      'Every one is another page with your business name on it. All 50 are free to submit; some offer paid upgrades you do not need.',
    keyword: 'LIST',
    assetName: '50 free business directories, with the link to submit each one',
    noun: 'directories',
    freeItems: 10,
    howTo: [
      'Use the exact same business name, address and phone number on every listing.',
      'Start with the "Everyone" group, then your country, then your industry.',
      'Write one short description of what you do and reuse it everywhere.',
    ],
    gatePoints: [
      'All 50 directories, sorted by Domain Rating',
      'The direct link to submit your business on each one',
      'Split into global, UK, US, and software and agencies',
    ],
    sourceNote:
      'Picked from the Rank OS directory index (671 vetted directories). DR is Ahrefs Domain Rating. Checked November 2026.',
    datePublished: '2026-11-20T09:00:00+00:00',
    groups: [
    {
      name: "Everyone",
      blurb: "Start here. Maps, data platforms and general directories any business can use.",
      items: [
      { name: "Facebook Business Page", dr: 100, pricing: "Free", url: "https://www.facebook.com/pages/create" },
      { name: "Google Business Profile", dr: 99, pricing: "Free", url: "https://business.google.com/" },
      { name: "Apple Business Connect", dr: 97, pricing: "Free", url: "https://businessconnect.apple.com/" },
      { name: "Trustpilot", dr: 94, pricing: "Free to submit (paid options)", url: "https://business.trustpilot.com/" },
      { name: "Foursquare", dr: 91, pricing: "Free to submit", url: "https://business.foursquare.com/" },
      { name: "MapQuest", dr: 91, pricing: "Free", url: "https://www.mapquest.com/" },
      { name: "Bing Places", dr: 81, pricing: "Free", url: "https://www.bingplaces.com/" },
      { name: "Hotfrog", dr: 81, pricing: "Free", url: "https://hotfrog.com" },
      { name: "Brownbook", dr: 79, pricing: "Free", url: "https://www.brownbook.net/add-business" },
      { name: "Kompass", dr: 77, pricing: "Free to submit (paid options)", url: "https://www.kompass.com/en/add-your-business/" },
      { name: "Cybo", dr: 76, pricing: "Free to submit", url: "https://www.cybo.com/add" },
      { name: "CallUpContact", dr: 76, pricing: "Free", url: "https://callupcontact.com" },
      { name: "Find Us Here", dr: 75, pricing: "Free to submit", url: "https://www.find-us-here.com/" },
      { name: "iGlobal", dr: 73, pricing: "Free to submit", url: "https://www.iglobal.co/register" },
      { name: "Infobel", dr: 73, pricing: "Free to submit (paid options)", url: "https://www.infobel.com/en/world/AddCompany" },
      { name: "Curlie", dr: 70, pricing: "Free to submit", url: "https://curlie.org/docs/en/add.html" },
      { name: "Europages", dr: 67, pricing: "Free to submit (paid options)", url: "https://www.europages.com/en/form/free" },
      { name: "YouBiz", dr: 66, pricing: "Free to submit (paid options)", url: "https://www.youbiz.com/advertise" },
      { name: "Lacartes", dr: 64, pricing: "Free", url: "https://lacartes.com" },
      { name: "LocalStar", dr: 62, pricing: "Free to submit", url: "https://www.localstar.org/add-listings" },
      ],
    },
    {
      name: "UK",
      blurb: "For businesses in the UK.",
      items: [
      { name: "The Trade Finder", dr: 85, pricing: "Free", url: "https://thetradefinder.co.uk/front/add-listing" },
      { name: "MyBuilder (trades)", dr: 83, pricing: "Free to submit (paid options)", url: "https://www.mybuilder.com/tradesmen/signup" },
      { name: "FreeIndex", dr: 81, pricing: "Free", url: "https://www.freeindex.co.uk/" },
      { name: "Three Best Rated UK", dr: 80, pricing: "Free", url: "https://threebestrated.co.uk/submit-business?reason=new" },
      { name: "Gumtree (business ads)", dr: 78, pricing: "Free to submit (paid options)", url: "https://www.gumtree.com/postad" },
      { name: "Cylex UK", dr: 75, pricing: "Free to submit (paid options)", url: "https://www.cylex-uk.co.uk/register-company" },
      { name: "The Dots (creative)", dr: 75, pricing: "Free to submit", url: "https://the-dots.com/account/create" },
      { name: "Tupalo", dr: 72, pricing: "Free", url: "https://tupalo.com/" },
      { name: "Hotfrog UK", dr: 63, pricing: "Free", url: "https://www.hotfrog.co.uk/" },
      { name: "MisterWhat", dr: 62, pricing: "Free to submit", url: "https://www.misterwhat.co.uk/" },
      ],
    },
    {
      name: "US",
      blurb: "For businesses in the US.",
      items: [
      { name: "Yellow Pages", dr: 90, pricing: "Free to submit", url: "https://www.yellowpages.com/" },
      { name: "Superpages", dr: 85, pricing: "Free to submit (paid options)", url: "https://www.superpages.com/" },
      { name: "Alignable", dr: 84, pricing: "Free to submit (paid options)", url: "https://www.alignable.com/businesses/new" },
      { name: "ChamberofCommerce.com", dr: 84, pricing: "Free to submit (paid options)", url: "https://www.chamberofcommerce.com/claim" },
      { name: "MerchantCircle", dr: 84, pricing: "Free to submit (paid options)", url: "https://www.merchantcircle.com/signup" },
      { name: "Sitejabber", dr: 82, pricing: "Free to submit (paid options)", url: "https://www.sitejabber.com/" },
      { name: "Citysearch", dr: 80, pricing: "Free to submit", url: "https://www.citysearch.com/" },
      { name: "EZlocal", dr: 80, pricing: "Free to submit (paid options)", url: "https://ezlocal.com/add-business" },
      { name: "ShowMeLocal", dr: 78, pricing: "Free to submit (paid options)", url: "https://www.showmelocal.com/" },
      { name: "DexKnows", dr: 78, pricing: "Free to submit (paid options)", url: "https://www.dexknows.com/" },
      { name: "2FindLocal", dr: 76, pricing: "Free", url: "https://2findlocal.com" },
      ],
    },
    {
      name: "Software and agencies",
      blurb: "For software products, startups, and marketing or design agencies.",
      items: [
      { name: "Crunchbase", dr: 91, pricing: "Free to submit", url: "https://www.crunchbase.com/add-new" },
      { name: "G2", dr: 91, pricing: "Free to submit (paid options)", url: "https://www.g2.com/products/new" },
      { name: "Capterra", dr: 91, pricing: "Free to submit (paid options)", url: "https://www.capterra.com/vendors/sign-up" },
      { name: "Product Hunt", dr: 91, pricing: "Free to submit", url: "https://www.producthunt.com/posts/new" },
      { name: "DesignRush (agencies)", dr: 90, pricing: "Free to submit", url: "https://www.designrush.com/agency/get-listed" },
      { name: "GoodFirms (agencies)", dr: 86, pricing: "Free to submit", url: "https://www.goodfirms.co/get-listed" },
      { name: "Sortlist (agencies)", dr: 80, pricing: "Free to submit (paid options)", url: "https://www.sortlist.com/agency-signup" },
      { name: "AlternativeTo", dr: 80, pricing: "Free to submit", url: "https://alternativeto.net/manage-item/" },
      { name: "SaaSHub", dr: 79, pricing: "Free to submit", url: "https://www.saashub.com/submit" },
      ],
    },
    ],
  },
];

export const getResource = (slug: string) => FREE_RESOURCES.find((r) => r.slug === slug);
