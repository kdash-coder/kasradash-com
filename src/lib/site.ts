export const SITE_NAME = 'Kasra Dash';
export const SITE_URL = 'https://kasradash.com';

export interface Hub {
  url: string;
  name: string;
  blurb: string;
}

export const HUBS: Hub[] = [
  { url: '/seo/learn/', name: 'Learn SEO', blurb: 'SEO fundamentals, from how search engines work to your first strategy.' },
  { url: '/seo/technical-seo/', name: 'Technical SEO', blurb: 'Crawling, indexing, Core Web Vitals and site health.' },
  { url: '/seo/link-building/', name: 'Link Building', blurb: 'Earn authority with backlink strategies that do not risk penalties.' },
  { url: '/seo/content-seo/', name: 'Content SEO', blurb: 'Search intent, topical authority and content that ranks.' },
  { url: '/seo/ai-and-seo/', name: 'AI & SEO', blurb: 'AI Overviews, AI search engines and automation workflows.' },
  { url: '/seo/seo-frameworks/', name: 'SEO Frameworks', blurb: 'Templates and systems to run SEO like an operator.' },
];

export const NAV = [
  { label: 'About Kasra Dash', href: '/about-kasra-dash/' },
  { label: 'The New Search', href: 'https://www.skool.com/the-new-search/about?utm_source=kasradash.com&utm_medium=site&utm_campaign=header-nav' },
];

export const SOCIALS = [
  { label: 'YouTube', href: 'https://www.youtube.com/@kasradash' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kasra-dash' },
  { label: 'X (Twitter)', href: 'https://x.com/Kasra_Dash' },
  { label: 'Instagram', href: 'https://www.instagram.com/kasra_d_' },
  { label: 'Facebook', href: 'https://www.facebook.com/Kasra.Dash1' },
];

export function pathWithSlash(p: string): string {
  return p.endsWith('/') ? p : p + '/';
}
