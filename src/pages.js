/* Prerendered service, audience and guide pages. Copy is answer-first and factual: no invented numbers, timelines or quotes. */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { SITE, abs, studioUrl } from './site.js';
import { films, workPath, monthYear } from './films.js';
import { esc, iconHead, socialHead, navHTML, footHTML, clockScript, guideLinks } from './layout.js';

export const DEFINITION = 'dotcreate is a launch film studio that makes launch videos for AI, SaaS and web3 startups.';
export const UPDATED = '2026-11-18';

const byId = Object.fromEntries(films.map((f) => [f.id, f]));

/* proof rows: films on the site, plus the HackerRank post from metrics.json */
const extraProof = {
  hackerrank: {
    name: 'HackerRank', sub: 'Film on the official @hackerrank post', viewsLabel: '5.2K',
    url: 'https://x.com/hackerrank/status/2062403304702022117', page: '',
  },
};
const proofRow = (id) => {
  const f = byId[id];
  if (f) {
    return {
      name: f.ledgerName || f.name,
      sub: f.isConcept ? 'Concept / spec ad, not client work' : f.ledgerSub,
      viewsLabel: f.viewsLabel, url: f.url, page: workPath(f), date: monthYear(f.created_at),
    };
  }
  return extraProof[id];
};

const proofTable = (ids, caption) => `<div class="table-wrap pg-proof">
  <table class="ledger">
    <caption class="sr">${esc(caption)}</caption>
    <thead><tr><th scope="col">Film</th><th scope="col" class="num">Views on X</th><th scope="col" class="num"><span class="sr">Source</span></th></tr></thead>
    <tbody>${ids.map(proofRow).map((r) => `<tr><th scope="row">${r.page ? `<a href="${r.page}">${esc(r.name)}</a>` : esc(r.name)}<span>${esc(r.sub)}</span></th><td class="num views">${esc(r.viewsLabel)}</td><td class="num src"><a href="${esc(r.url)}" target="_blank" rel="noopener" aria-label="${esc(r.name)} post on X">↗</a></td></tr>`).join('')}</tbody>
  </table>
</div>
<p class="pg-note">Views are from the official post on X, where the film was published. Quote posts and reposts are not counted. Full list on the <a href="/#numbers">numbers table</a>.</p>`;

const steps = (items) => `<ol class="pg-steps">${items.map(([h, p], i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><div><h3>${esc(h)}</h3><p>${p}</p></div></li>`).join('')}</ol>`;

const clientsLine = 'Public clients include Grok Imagine, Lightspeed, Whop, HackerRank, Cartesia, cyber•Fund, Propr, Wondercraft, Blueprint and Huddle01.';
const dm = `<a href="${studioUrl()}" target="_blank" rel="noopener">DM @${SITE.studioHandle} on X</a>`;
const L = (href, text) => `<a href="${href}">${esc(text)}</a>`;

export const pages = [
  {
    path: '/services/launch-videos',
    label: ['Services', 'Launch videos'],
    title: 'Launch Videos for AI, SaaS and Web3 Startups · dotcreate',
    desc: 'dotcreate makes launch videos for AI, SaaS and web3 startups. Concept, script, motion and sound in house. Films for Grok Imagine and Wondercraft.',
    h1: 'Launch videos for startups.',
    lead: `${DEFINITION} We write, design and cut the film that goes out with your announcement, shaped around one idea people can repeat.`,
    service: { name: 'Launch videos', type: 'Launch video production', desc: 'Launch films for startup product announcements: concept, script, storyboards, motion design and sound design, plus cuts for feeds.' },
    sections: [
      { q: 'What is a launch video?', a: 'A launch video is the short film that goes out with a product announcement. It shows what is new, who it is for and why it matters, in the first seconds of someone\'s attention. On X, the launch video often is the announcement.' },
      { q: 'What does dotcreate make for a launch?', a: 'The whole film, in house: concept, script, storyboards, motion design and sound design. One idea carries the film, so people can repeat it after one watch. From the same film we cut shorter versions for feeds and paid social.' },
      { q: 'Who are dotcreate launch videos for?', a: `Founders of AI, SaaS and web3 startups announcing a product, a major feature or a new market, and the venture firms that back them. ${clientsLine}` },
      { q: 'How does a launch video project with dotcreate work?', a: 'You tell us what you are shipping and when it goes live. Then we take it from idea to final film, and the person who pitches the idea is the person who makes it.', extra: steps([
        ['Brief', `${dm} with what you are shipping and the launch date.`],
        ['Concept and script', 'We find the one idea the film is built on and write it before anything is designed.'],
        ['Boards', 'Key frames and the shape of the film, agreed before motion starts.'],
        ['Motion and sound', 'Design, animation and sound design, all in house.'],
        ['Launch cuts', 'The master film plus shorter cuts for the places you post.'],
      ]) },
      { q: 'How long does a launch video take, and what does it cost?', a: `It depends on length, style and how much of the product the film has to show, so we do not publish fixed prices or timelines. Put your launch date in the first message and we will tell you what fits. ${dm} to start.` },
      { q: 'Which launch videos has dotcreate made?', a: 'A few public launch films, with the view count on the official post for each.', extra: proofTable(['wondercraft', 'grok', 'propr', 'blueprint', 'eloscape', 'lightspeed'], 'Public launch films by dotcreate') },
    ],
    related: ['/services/product-videos', '/ai-startups', '/web3-startups', '/launch-video-guide'],
  },
  {
    path: '/services/product-videos',
    label: ['Services', 'Product videos'],
    title: 'Product and Feature Videos for Startups · dotcreate',
    desc: 'Product videos, feature videos and retainer work for AI, SaaS and web3 startups. UI motion, 3D and explainers, made by launch film studio dotcreate.',
    h1: 'Product videos, release after release.',
    lead: 'dotcreate makes product videos, feature videos and ongoing retainer work for startups, so every release after launch day still looks like the brand.',
    service: { name: 'Product videos', type: 'Product and feature video production', desc: 'Product motion, feature videos, explainers and retainer video work for startups: UI motion, 3D and short cuts for feeds.' },
    sections: [
      { q: 'What is a product video?', a: 'A product video shows one part of a product working: a feature, a flow or an interface. Product motion brings the UI to life, so the product explains itself without a voiceover doing the heavy lifting.' },
      { q: 'What is a video retainer?', a: 'A retainer is an ongoing arrangement where dotcreate makes videos for a team release after release: feature videos, product updates and short ad cuts. Much of this work ships under NDA. It is counted in the studio\'s figures of 60+ videos shipped and 40+ brands, but it is not shown in public.' },
      { q: 'What formats does dotcreate make?', a: 'UI motion, 3D, explainers, paid social cuts and platform formats. Each one is built from the product itself, not from a template.' },
      { q: 'Which product and feature work is public?', a: 'Most retainer work is under NDA. Public films include the Wondercraft Video launch, the HackerRank film and studio work for Cartesia, credit @Thru_18.', extra: proofTable(['wondercraft', 'hackerrank', 'cartesia'], 'Public product and feature films') },
      { q: 'How do you start a product video retainer?', a: `${dm}. Tell us what you are shipping over the next few releases and we will shape a plan around it.` },
    ],
    related: ['/services/launch-videos', '/ai-startups', '/launch-video-guide'],
  },
  {
    path: '/ai-startups',
    label: ['Industries', 'AI startups'],
    title: 'Launch Videos for AI Startups · dotcreate',
    desc: 'dotcreate makes launch videos for AI startups, including the Grok Imagine launch film, 324.9K views on the official @imagine post, and Wondercraft Video.',
    h1: 'Launch videos for AI startups.',
    lead: 'dotcreate makes launch videos and product films for AI startups. Public work includes the Grok Imagine launch film, with 324.9K views on the official @imagine post.',
    service: { name: 'Launch videos for AI startups', type: 'Launch video production', desc: 'Launch films and product videos for AI startups, models and tools.', audience: 'AI startups' },
    sections: [
      { q: 'Who makes launch videos for AI startups?', a: `dotcreate does. ${DEFINITION} Public AI work includes films for Grok Imagine, Wondercraft, Blueprint, Cartesia and HackerRank.` },
      { q: 'Why do AI launches need a different kind of film?', a: 'Many AI products look like a text box until someone sees what comes out of them. A good AI launch video shows the output, the speed and the one thing the product does that others do not, in the first seconds. Glowing particles and stock neural nets say nothing about your model. Generic is dead.' },
      { q: 'What has dotcreate made for AI teams?', a: 'Launch films and studio work for AI products, with views from the official post on X.', extra: proofTable(['wondercraft', 'grok', 'blueprint', 'hackerrank', 'cartesia'], 'Public films for AI startups') },
      { q: 'How do I start a launch video for my AI startup?', a: `${dm} with what you are shipping and the launch date. See ${L('/services/launch-videos', 'launch videos')} for how a project runs.` },
    ],
    related: ['/services/launch-videos', '/services/product-videos', '/web3-startups', '/launch-video-guide'],
  },
  {
    path: '/web3-startups',
    label: ['Industries', 'Web3 startups'],
    title: 'Launch Videos for Web3 and Crypto Startups · dotcreate',
    desc: 'dotcreate makes launch videos and brand films for web3 and crypto startups. Public work includes cyber•Fund, 367.5K views on the official post, and Propr.',
    h1: 'Launch videos for web3 and crypto.',
    lead: 'dotcreate makes launch videos and brand films for web3 and crypto startups, and for the funds behind them. Public work includes a brand film for cyber•Fund, with 367.5K views on the official post.',
    service: { name: 'Launch videos for web3 and crypto startups', type: 'Launch video production', desc: 'Launch films and brand films for web3 and crypto startups, protocols and funds.', audience: 'Web3 and crypto startups' },
    sections: [
      { q: 'Who makes launch videos for crypto and web3 startups?', a: `dotcreate does. ${DEFINITION} Public web3 work includes a brand film for cyber•Fund and the US launch film for Propr, the perps prop firm built on Hyperliquid.` },
      { q: 'What makes a good crypto launch video?', a: 'Crypto audiences have seen every spinning coin. The film has to make one idea clear: what the product lets people do, and why now. Then it has to hold up when it is quoted, clipped and reposted across the timeline.' },
      { q: 'What has dotcreate made for web3 and venture teams?', a: 'Brand films, launch films and series intros, with views from the official post on X.', extra: proofTable(['cyberfund', 'propr', 'lightspeed'], 'Public films for web3 and venture teams') },
      { q: 'How do I start a launch video for my web3 project?', a: `${dm} with what you are shipping and the launch date. See ${L('/launch-video-guide', 'the launch video guide')} for how we approach it.` },
    ],
    related: ['/services/launch-videos', '/ai-startups', '/launch-video-guide'],
  },
  {
    path: '/launch-video-guide',
    label: ['Guide', 'Launch videos'],
    title: 'How to Make a Startup Launch Video · dotcreate',
    desc: 'How to make a startup launch video: find one idea, write the script, board it, build motion and sound, then cut and post it from the official account.',
    h1: 'How to make a startup launch video.',
    lead: 'Start from one idea, not a template. Write the script before you design anything, board it, build the motion and sound around that idea, then cut versions for every place you post. This is how dotcreate makes launch films for AI, SaaS and web3 startups.',
    article: true,
    sections: [
      { q: 'What should a startup launch video say?', a: 'One idea. What is new, who it is for and why it matters now. If a viewer cannot repeat the idea after one watch, the film is trying to say too much.' },
      { q: 'How long should a launch video be?', a: 'Long enough to land the one idea and no longer. On X the first seconds decide whether anyone watches the rest, so the opening has to work with the sound off.' },
      { q: 'What are the steps to make a launch video?', a: 'Six steps, in this order. Skipping ahead to motion before the script is right is the quickest way to end up with a generic launch film.', extra: steps([
        ['Find the one idea', 'The single thing people should remember. Everything in the film serves it.'],
        ['Write the script', 'Words and beats first. The script is cheap to change; finished motion is not.'],
        ['Storyboard', 'Key frames and pacing, agreed before animation starts.'],
        ['Design and motion', 'Build the look from the product and the brand, not from a preset.'],
        ['Sound', 'Sound design and music shaped to the cut, so the film works with sound on and still reads with it off.'],
        ['Cut and post', 'A master film plus shorter cuts for feeds and ads, then a launch post from the official account.'],
      ]) },
      { q: 'How should you post a launch video on X?', a: 'Upload the film natively from the company account rather than posting a link. Put the announcement in the first line. Ask founders and the team to quote the official post instead of uploading copies, so the views collect on one post. That is also how dotcreate counts views: one official post per film.' },
      { q: 'Should you hire a studio or make the launch video in house?', a: `In house works for small updates if you have a motion designer with time to spare. For a launch, a studio brings concept, script, design, motion and sound under one roof, and a fresh point of view on the product. dotcreate is small on purpose, so the person who pitches the idea is the person who makes it. See ${L('/services/launch-videos', 'launch videos')}.` },
      { q: 'What do good startup launch videos look like?', a: 'A few public examples by dotcreate, with views from the official post on X.', extra: proofTable(['wondercraft', 'cyberfund', 'grok', 'propr', 'blueprint'], 'Example startup launch videos') },
    ],
    related: ['/services/launch-videos', '/services/product-videos', '/ai-startups', '/web3-startups'],
  },
];

const strip = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const linkLabel = (href) => (guideLinks.find((l) => l.href === href) || { label: href }).label;

function pageJsonLd(pg) {
  const orgId = abs('/#organization');
  const url = abs(pg.path);
  const graph = [
    {
      '@type': 'BreadcrumbList',
      '@id': url + '#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') },
        { '@type': 'ListItem', position: 2, name: pg.h1.replace(/\.$/, ''), item: url },
      ],
    },
    {
      '@type': pg.article ? ['WebPage', 'Article'] : 'WebPage',
      '@id': url + '#webpage',
      url,
      name: pg.title,
      headline: pg.h1.replace(/\.$/, ''),
      description: pg.desc,
      inLanguage: 'en',
      isPartOf: { '@id': abs('/#website') },
      about: { '@id': orgId },
      publisher: { '@id': orgId },
      ...(pg.article ? { author: { '@id': orgId } } : {}),
      breadcrumb: { '@id': url + '#breadcrumb' },
      dateModified: UPDATED,
      ...(pg.article ? { datePublished: UPDATED } : {}),
      primaryImageOfPage: abs(SITE.ogImage),
    },
    {
      '@type': 'FAQPage',
      '@id': url + '#faq',
      mainEntity: pg.sections.map((s) => ({
        '@type': 'Question',
        name: s.q,
        acceptedAnswer: { '@type': 'Answer', text: strip(s.a) },
      })),
    },
  ];
  if (pg.service) {
    graph.push({
      '@type': 'Service',
      '@id': url + '#service',
      name: pg.service.name,
      serviceType: pg.service.type,
      description: pg.service.desc,
      url,
      provider: { '@id': orgId },
      areaServed: { '@type': 'Place', name: 'Worldwide' },
      ...(pg.service.audience ? { audience: { '@type': 'BusinessAudience', name: pg.service.audience } } : {}),
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

export function pageHTML(pg, cssHref) {
  const url = abs(pg.path);
  const body = pg.sections.map((s, i) => `<section class="pg-sec" aria-labelledby="q${i + 1}">
    <h2 id="q${i + 1}">${esc(s.q)}</h2>
    <div class="pg-body"><p class="ans">${s.a}</p>${s.extra || ''}</div>
  </section>`).join('\n  ');
  const related = pg.related.map((h) => `<a class="btn btn-ghost" href="${h}">${esc(linkLabel(h))}</a>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(pg.title)}</title>
<meta name="description" content="${esc(pg.desc)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
${iconHead(url)}
<link rel="preload" href="/fonts/Geist-Variable.woff2" as="font" type="font/woff2" crossorigin>
${socialHead({ url, title: pg.title, desc: pg.desc, image: abs(SITE.ogImage), imageAlt: 'dotcreate, generic is dead.', width: SITE.ogWidth, height: SITE.ogHeight, type: pg.article ? 'article' : 'website' })}
<link rel="stylesheet" crossorigin href="${esc(cssHref)}">
<script type="application/ld+json">${pageJsonLd(pg)}</script>
</head>
<body class="ready film-body">
<a class="skip" href="#main">Skip to content</a>
${navHTML()}
<main id="main" class="pg wrap">
  <header class="pg-head">
    <nav class="label" aria-label="Breadcrumb"><a href="/">dotcreate</a><span class="idx">/</span><span>${esc(pg.label[0])}</span><span class="idx">/</span><span>${esc(pg.label[1])}</span></nav>
    <h1 class="pg-title">${esc(pg.h1)}</h1>
    <p class="lead">${esc(pg.lead)}</p>
    <div class="actions"><a class="btn btn-lime" href="${studioUrl()}" target="_blank" rel="noopener">DM @${SITE.studioHandle} <span class="arr" aria-hidden="true">↗</span></a><a class="btn btn-ghost" href="/#work">See the work</a></div>
  </header>
  ${body}
  <aside class="pg-related" aria-label="Related pages">
    <p class="label">Related</p>
    <div class="actions">${related}</div>
  </aside>
</main>
${footHTML()}
${clockScript}
</body>
</html>
`;
}

export function notFoundHTML(cssHref) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Page not found · dotcreate</title>
<meta name="description" content="This page does not exist. dotcreate makes launch videos for AI, SaaS and web3 startups.">
<meta name="robots" content="noindex">
${iconHead('')}
<link rel="stylesheet" crossorigin href="${esc(cssHref)}">
</head>
<body class="ready film-body">
${navHTML()}
<main id="main" class="pg wrap">
  <header class="pg-head">
    <p class="label"><span class="idx">404</span>Not found</p>
    <h1 class="pg-title">This page is generic. <span class="tone">It does not exist.</span></h1>
    <p class="lead">${esc(DEFINITION)} Try one of these instead.</p>
    <div class="actions"><a class="btn btn-lime" href="/">Home</a><a class="btn btn-ghost" href="/#work">Work</a>${guideLinks.map((l) => `<a class="btn btn-ghost" href="${l.href}">${esc(l.label)}</a>`).join('')}</div>
  </header>
</main>
${footHTML()}
${clockScript}
</body>
</html>
`;
}

export function writeStaticPages(distDir, cssHref) {
  for (const pg of pages) {
    const dir = join(distDir, pg.path);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), pageHTML(pg, cssHref));
  }
  writeFileSync(join(distDir, '404.html'), notFoundHTML(cssHref));
}
