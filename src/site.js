/**
 * Canonical site origin and brand constants.
 * Swap SITE_ORIGIN (and nothing else) when a custom domain is connected.
 * Production domain: dotcreate.in (www redirects to the apex).
 */
export const SITE_ORIGIN = 'https://dotcreate.in';

export const INDEXNOW_KEY = '5822dfd0774626fd360989d44f631c9c';

export const SITE = {
  origin: SITE_ORIGIN,
  name: 'dotcreate',
  tagline: 'Launch videos for AI, SaaS and web3 startups.',
  title: 'dotcreate · Launch videos for AI, SaaS and web3 startups',
  definition: 'dotcreate is a launch film studio that makes launch videos for AI, SaaS and web3 startups.',
  description: 'dotcreate is a launch film studio making launch videos, product videos and ad creatives for AI, SaaS and web3 startups. Films for Grok Imagine and more.',
  ogTitle: 'dotcreate · Generic is dead.',
  ogDescription: 'Launch videos, product videos and ad creatives for AI, SaaS and web3 startups.',
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
