import { writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { SITE, SITE_ORIGIN, INDEXNOW_KEY, abs, studioUrl } from './site.js';
import { films, faqs, publicClients, ledgerFilms, monthYear, isoDate, fmt, workPath } from './films.js';

const esc = (s) => String(s)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

export function ledgerHTML() {
  return ledgerFilms().map((f) => {
    const name = f.ledgerName || f.name;
    const href = workPath(f);
    return `<tr><th scope="row"><a href="${esc(href)}">${esc(name)}</a><span>${esc(f.ledgerSub)}</span></th><td class="hide-s">${esc(monthYear(f.created_at))}</td><td class="num views">${fmt(f.impressions)}</td><td class="num src"><a href="${esc(f.url)}" target="_blank" rel="noopener" aria-label="${esc(name)} post on X">↗</a></td></tr>`;
  }).join('');
}

export function jsonLd() {
  const orgId = abs('/#organization');
  const websiteId = abs('/#website');

  const org = {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': orgId,
    name: SITE.name,
    url: abs('/'),
    logo: abs('/mark.svg'),
    image: abs(SITE.ogImage),
    description: SITE.description,
    sameAs: [studioUrl()],
    areaServed: 'Worldwide',
    serviceType: ['Launch films', 'Ad creatives', 'Product motion'],
    knowsAbout: ['Launch films', 'Motion design', 'AI startup marketing', 'Web3 marketing', 'Product motion'],
  };

  const website = {
    '@type': 'WebSite',
    '@id': websiteId,
    name: SITE.name,
    url: abs('/'),
    description: SITE.description,
    publisher: { '@id': orgId },
    inLanguage: 'en',
  };

  const videos = films.map((f) => ({
    '@type': 'VideoObject',
    '@id': abs(workPath(f) + '#video'),
    name: f.isConcept ? `${f.name} concept / spec ad` : `${f.name} ${f.type.toLowerCase()}`,
    description: f.summary,
    thumbnailUrl: abs(f.poster),
    contentUrl: abs(f.video),
    uploadDate: isoDate(f.created_at),
    url: abs(workPath(f)),
    publisher: { '@id': orgId },
    creator: { '@id': orgId },
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'ViewAction' },
      userInteractionCount: f.impressions,
    },
    isFamilyFriendly: true,
  }));

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [org, website, ...videos],
  };
  return JSON.stringify(graph);
}

export function aeoHead() {
  const url = abs('/');
  const image = abs(SITE.ogImage);
  return [
    `<link rel="canonical" href="${url}">`,
    `<link rel="alternate" type="text/plain" title="LLM index" href="${abs('/llms.txt')}">`,
    `<link rel="describedby" href="${abs('/llms.txt')}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(SITE.name)}">`,
    `<meta property="og:locale" content="en_US">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${esc(SITE.ogTitle)}">`,
    `<meta property="og:description" content="${esc(SITE.ogDescription)}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:image:width" content="${SITE.ogWidth}">`,
    `<meta property="og:image:height" content="${SITE.ogHeight}">`,
    `<meta property="og:image:alt" content="dotcreate, generic is dead.">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:site" content="@${SITE.studioHandle}">`,
    `<meta name="twitter:creator" content="@${SITE.studioHandle}">`,
    `<meta name="twitter:title" content="${esc(SITE.ogTitle)}">`,
    `<meta name="twitter:description" content="${esc(SITE.ogDescription)}">`,
    `<meta name="twitter:image" content="${image}">`,
    `<script type="application/ld+json">${jsonLd()}</script>`,
  ].join('\n');
}

export function robotsTxt() {
  const agents = [
    'OAI-SearchBot',
    'GPTBot',
    'ChatGPT-User',
    'PerplexityBot',
    'Claude-SearchBot',
    'ClaudeBot',
    'Google-Extended',
    'Googlebot',
    'Bingbot',
    'Applebot',
  ];
  const blocks = agents.map((a) => `User-agent: ${a}\nAllow: /`).join('\n\n');
  return `${blocks}\n\nUser-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`;
}

export function sitemapXml() {
  const today = '2026-11-17';
  const urls = [
    { loc: abs('/'), lastmod: today, changefreq: 'weekly', priority: '1.0' },
    ...films.map((f) => ({
      loc: abs(workPath(f)),
      lastmod: isoDate(f.created_at),
      changefreq: 'monthly',
      priority: '0.8',
    })),
  ];
  const body = urls.map((u) => `  <url>\n    <loc>${esc(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function llmsTxt() {
  const filmLines = ledgerFilms().map((f) => {
    const note = f.isConcept ? ' Concept / spec ad, not client work.' : '';
    const credit = f.credit ? ` Credit ${f.credit}.` : '';
    return `- [${f.ledgerName || f.name}](${abs(workPath(f))}): ${f.short}, ${f.viewsLabel} views on the official ${f.account} post.${note}${credit}`;
  }).join('\n');
  return `# ${SITE.name}

> ${SITE.description}

${SITE.name} is an independent launch film studio. The studio is small on purpose, so the person who pitches the idea is the person who makes it.

Headline figures, including work under NDA: ${SITE.hero.viewsLabel} views across launch films, films for ${SITE.hero.brandsLabel} brands, and ${SITE.hero.videosLabel} videos shipped (launches, feature films and retainer work). The Grok Imagine launch film has ${SITE.hero.grokViewsLabel} views on the official @imagine post.

Public clients listed on the site: ${publicClients.join(', ')}.

## Films

${filmLines}

## Pages

- [Home](${abs('/')}): studio, work, numbers and services
- [Full text](${abs('/llms-full.txt')}): longer plain-text summary

## FAQ

${faqs.map((item) => `Q: ${item.q}\nA: ${item.a}`).join('\n\n')}

## Contact

- X, studio: ${studioUrl()}
`;
}

export function llmsFullTxt() {
  const filmBlocks = ledgerFilms().map((f) => {
    const extra = [
      f.isConcept ? 'This is a concept / spec ad, not client work.' : '',
      f.credit ? `Credit ${f.credit}.` : '',
    ].filter(Boolean).join(' ');
    return `### ${f.ledgerName || f.name}
Type: ${f.type}
Posted: ${monthYear(f.created_at)}
Views on the official ${f.account} post: ${fmt(f.impressions)} (${f.viewsLabel})
Source: ${f.url}
Page: ${abs(workPath(f))}
${f.summary}${extra ? ' ' + extra : ''}`;
  }).join('\n\n');

  const faqBlocks = faqs.map((item) => `Q: ${item.q}\nA: ${item.a}`).join('\n\n');

  return `# ${SITE.name}

${SITE.description}

${SITE.name} is an independent launch film studio. The studio makes launch films, ad creatives and product motion for tech, AI and web3 startups. It is small on purpose, so the person who pitches the idea is the person who makes it.

Canonical URL: ${abs('/')}
X, studio: ${studioUrl()}

## Headline figures

These are the studio's stated figures, including work under NDA:
- ${SITE.hero.viewsLabel} views across launch films
- ${SITE.hero.grokViewsLabel} views on the Grok Imagine launch film, from the official @imagine post
- ${SITE.hero.brandsLabel} brands, including work under NDA
- ${SITE.hero.videosLabel} videos shipped, including launches, feature films and retainer work

## Public clients

${publicClients.join(', ')}

## Services

1. Launch films. The film that goes out with an announcement. Concept, script, boards, motion and sound, shaped around one idea people can repeat.
2. Ad creatives. Short cuts built for feeds. Made to hold attention in the first second and still look like the brand.
3. Product motion. Interfaces and features brought to life, so the product explains itself.

## Selected work, official X view counts

One launch post per film. Client films count the post on the client's own account. Quote posts and reposts are left out.

${filmBlocks}

## FAQ

${faqBlocks}

## Contact

DM @${SITE.studioHandle} on X. Tell the studio what you are shipping and when it goes live.
`;
}

function workJsonLd(film) {
  const orgId = abs('/#organization');
  const page = abs(workPath(film));
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') },
          { '@type': 'ListItem', position: 2, name: 'Work', item: abs('/#work') },
          { '@type': 'ListItem', position: 3, name: film.name, item: page },
        ],
      },
      {
        '@type': 'VideoObject',
        '@id': page + '#video',
        name: film.isConcept ? `${film.name} concept / spec ad` : `${film.name} ${film.type.toLowerCase()}`,
        description: film.summary,
        thumbnailUrl: abs(film.poster),
        contentUrl: abs(film.video),
        uploadDate: isoDate(film.created_at),
        url: page,
        publisher: { '@id': orgId },
        creator: { '@id': orgId },
        interactionStatistic: {
          '@type': 'InteractionCounter',
          interactionType: { '@type': 'ViewAction' },
          userInteractionCount: film.impressions,
        },
      },
    ],
  });
}

export function workPageHTML(film, cssHref) {
  const page = abs(workPath(film));
  const title = `${film.name} · ${SITE.name}`;
  const desc = `${film.summary} ${film.viewsLabel} views on the official ${film.account} post.`;
  const credit = film.credit
    ? ` Credit <a href="${esc(film.creditUrl)}" target="_blank" rel="noopener">${esc(film.credit)}</a>.`
    : '';
  const concept = film.isConcept ? ' This is a concept / spec ad, not client work.' : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#0A0A0A">
<link rel="icon" href="/mark.svg" type="image/svg+xml">
<link rel="canonical" href="${page}">
<link rel="alternate" type="text/plain" title="LLM index" href="${abs('/llms.txt')}">
<meta property="og:type" content="video.other">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:locale" content="en_US">
<meta property="og:url" content="${page}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${abs(film.poster)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@${SITE.studioHandle}">
<meta name="twitter:creator" content="@${SITE.studioHandle}">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${abs(film.poster)}">
<link rel="stylesheet" crossorigin href="${esc(cssHref)}">
<script type="application/ld+json">${workJsonLd(film)}</script>
</head>
<body class="ready film-body">
<a class="skip" href="#film">Skip to film</a>
<header class="nav">
  <a class="brand" href="/" aria-label="dotcreate, back to home">
    <svg class="brand-mark" viewBox="0 0 100 108" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M4 3H96V72L77 80V94Q50 101 23 94V80L4 72ZM17 51V60H43ZM83 51 57 60H83ZM23 98Q50 105 77 98V105H23Z"/></svg>
    <span class="brand-word"><span>Dot</span><span>Create</span></span>
  </a>
  <nav class="nav-links" aria-label="Primary">
    <a href="/#work">Work</a>
    <a href="/#numbers">Numbers</a>
    <a href="/#studio">Studio</a>
    <a class="btn btn-sm btn-light" href="${studioUrl()}" target="_blank" rel="noopener">Start a film</a>
  </nav>
</header>
<main id="film" class="film-page wrap">
  <p class="label"><a href="/#work">Work</a><span class="idx">/</span>${esc(film.name)}</p>
  <h1 class="h2">${esc(film.name)}</h1>
  <p class="lead">${esc(film.summary)}${concept}${credit ? '' : ''}</p>
  ${credit ? `<p class="muted">Credit <a href="${esc(film.creditUrl)}" target="_blank" rel="noopener">${esc(film.credit)}</a>.</p>` : ''}
  <dl class="kv film-kv">
    <div><dt>Client</dt><dd>${esc(film.client)}</dd></div>
    <div><dt>Type</dt><dd>${esc(film.type)}</dd></div>
    <div><dt>Released</dt><dd>${esc(monthYear(film.created_at))}</dd></div>
    <div><dt>Views on X</dt><dd><a href="${esc(film.url)}" target="_blank" rel="noopener">${esc(film.viewsLabel)} ↗</a></dd></div>
  </dl>
  <div class="film-media">
    <video controls playsinline preload="metadata" poster="${esc(film.poster)}" src="${esc(film.video)}" title="${esc(film.name)}"></video>
  </div>
  <p class="muted">Views are taken from the official ${esc(film.account)} post. Quote posts and reposts are not counted.</p>
  <p class="actions"><a class="btn btn-ghost" href="/#work">Back to work</a><a class="btn btn-lime" href="${studioUrl()}" target="_blank" rel="noopener">DM @${SITE.studioHandle} <span class="arr" aria-hidden="true">↗</span></a></p>
</main>
<footer class="foot">
  <div class="wrap foot-base">
    <p>© 2026 ${esc(SITE.name)}. Generic is dead.</p>
    <p><a href="/">Home</a></p>
  </div>
</footer>
</body>
</html>
`;
}

export function aeoPlugin() {
  let outDir = 'dist';
  return {
    name: 'aeo',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    transformIndexHtml(html) {
      return html
        .replace('<!--AEO_HEAD-->', aeoHead())
        .replace('<!--LEDGER_ROWS-->', ledgerHTML());
    },
    generateBundle() {
      const emitText = (fileName, source) => this.emitFile({ type: 'asset', fileName, source });
      emitText('robots.txt', robotsTxt());
      emitText('sitemap.xml', sitemapXml());
      emitText('llms.txt', llmsTxt());
      emitText('llms-full.txt', llmsFullTxt());
      emitText(`${INDEXNOW_KEY}.txt`, INDEXNOW_KEY);
    },
    closeBundle() {
      const dist = resolve(outDir);
      const assets = readdirSync(join(dist, 'assets'));
      const css = assets.find((f) => f.endsWith('.css'));
      if (!css) throw new Error('aeo: built CSS not found in dist/assets');
      writeWorkPages(dist, '/assets/' + css);
    },
  };
}

export function writeWorkPages(distDir, cssHref) {
  for (const film of films) {
    const dir = join(distDir, 'work', film.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), workPageHTML(film, cssHref));
  }
}

export { SITE_ORIGIN, INDEXNOW_KEY };
