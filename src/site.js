/**
 * Canonical site origin and brand constants.
 * Swap SITE_ORIGIN (and nothing else) when a custom domain is connected.
 * Example: export const SITE_ORIGIN = 'https://dotcreate.com';
 */
export const SITE_ORIGIN = 'https://dotcreate.vercel.app';

export const INDEXNOW_KEY = '5822dfd0774626fd360989d44f631c9c';

export const SITE = {
  origin: SITE_ORIGIN,
  name: 'dotcreate',
  tagline: 'Launch films for startups. Generic is dead.',
  description: 'dotcreate is an independent studio making launch films and ad creatives for tech, AI and web3 startups. Films for Grok Imagine, Lightspeed and more.',
  ogTitle: 'dotcreate · Generic is dead.',
  ogDescription: 'Launch films and ad creatives for tech, AI and web3 startups.',
  ogImage: '/assets/og.jpg',
  ogWidth: 1200,
  ogHeight: 750,
  studioHandle: 'dotcreateX',
  hero: {
    viewsLabel: '3M',
    brandsLabel: '40+',
    videosLabel: '60+',
    grokViewsLabel: '324.9K',
  },
};

export const studioUrl = () => `https://x.com/${SITE.studioHandle}`;
export const abs = (path = '/') => {
  if (!path) return SITE_ORIGIN + '/';
  if (path.startsWith('http')) return path;
  return SITE_ORIGIN + (path.startsWith('/') ? path : '/' + path);
};
