/* Shared head, nav and footer for the prerendered subpages (work pages, service pages, guide, 404). */
import { SITE, abs, studioUrl } from './site.js';

export const esc = (s) => String(s)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const MARK = '<svg class="brand-mark" viewBox="0 0 100 108" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M4 3H96V72L77 80V94Q50 101 23 94V80L4 72ZM17 51V60H43ZM83 51 57 60H83ZM23 98Q50 105 77 98V105H23Z"/></svg>';

/* the guide and service pages, linked quietly from the footer Studio column and the services section */
export const guideLinks = [
  { href: '/services/launch-videos', label: 'Launch videos' },
  { href: '/services/product-videos', label: 'Product videos' },
  { href: '/ai-startups', label: 'AI startups' },
  { href: '/web3-startups', label: 'Web3 startups' },
  { href: '/launch-video-guide', label: 'Launch video guide' },
];

/* icons, manifest, hreflang and theme colour, shared by every page */
export function iconHead(url) {
  return [
    '<meta name="theme-color" content="#0A0A0A">',
    '<meta name="color-scheme" content="dark">',
    '<link rel="icon" href="/favicon.ico" sizes="32x32">',
    '<link rel="icon" href="/mark.svg" type="image/svg+xml">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
    '<link rel="manifest" href="/site.webmanifest">',
    url ? `<link rel="alternate" hreflang="en" href="${url}">` : '',
    url ? `<link rel="alternate" hreflang="x-default" href="${url}">` : '',
  ].filter(Boolean).join('\n');
}

export function socialHead({ url, title, desc, image, imageAlt, type = 'website', width, height }) {
  return [
    `<link rel="canonical" href="${url}">`,
    `<link rel="alternate" type="text/plain" title="LLM index" href="${abs('/llms.txt')}">`,
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:site_name" content="${esc(SITE.name)}">`,
    '<meta property="og:locale" content="en_US">',
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:image" content="${image}">`,
    width ? `<meta property="og:image:width" content="${width}">` : '',
    height ? `<meta property="og:image:height" content="${height}">` : '',
    `<meta property="og:image:alt" content="${esc(imageAlt || title)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:site" content="@${SITE.studioHandle}">`,
    `<meta name="twitter:creator" content="@${SITE.studioHandle}">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(desc)}">`,
    `<meta name="twitter:image" content="${image}">`,
    `<meta name="twitter:image:alt" content="${esc(imageAlt || title)}">`,
  ].filter(Boolean).join('\n');
}

export function navHTML() {
  return `<header class="nav">
  <a class="brand" href="/" aria-label="dotcreate, back to home">
    ${MARK}
    <span class="brand-word"><span>Dot</span><span>Create</span></span>
  </a>
  <nav class="nav-links" aria-label="Primary">
    <a href="/#work">Work</a>
    <a href="/#numbers">Numbers</a>
    <a href="/#studio">Studio</a>
    <a class="btn btn-sm btn-light" href="${studioUrl()}" target="_blank" rel="noopener">Start a film</a>
  </nav>
</header>`;
}

/* same footer as the homepage; `home` switches the in-page anchors */
export function footHTML({ home = false } = {}) {
  const p = home ? '' : '/';
  const extra = guideLinks.map((l) => `<a href="${l.href}">${esc(l.label)}</a>`).join('');
  return `<footer class="foot">
  <div class="wrap foot-grid">
    <div class="foot-brand">
      ${MARK}
      <p>Launch videos, product videos and ad creatives for AI, SaaS and web3 startups.</p>
    </div>
    <div class="foot-col"><h3>Studio</h3><a href="${p}#work">Work</a><a href="${p}#numbers">Numbers</a><a href="${p}#studio">Services</a>${extra}</div>
    <div class="foot-col"><h3>Connect</h3><a href="${studioUrl()}" target="_blank" rel="noopener">X, @${SITE.studioHandle}</a></div>
    <div class="foot-col"><h3>Local time</h3><p><span data-clock>India</span> IST</p></div>
  </div>
  <div class="wrap foot-base">
    <p>© 2026 ${esc(SITE.name)}. Generic is dead.</p>
    <p>Mark and hero icon drawn by dotcreate.</p>
  </div>
  <div class="foot-word" aria-hidden="true">dotcreate</div>
</footer>`;
}

/* tiny clock script so the footer time works on static pages without the main bundle */
export const clockScript = `<script>(()=>{const e=document.querySelector('[data-clock]');if(!e)return;const f=()=>{e.textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit'}).format(new Date())};f();setInterval(f,30000)})()</script>`;
