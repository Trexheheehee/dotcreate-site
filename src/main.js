import './style.css';
import Lenis from 'lenis';
import { animate } from './icon.js';

const root = document.documentElement;
root.classList.add('js');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = matchMedia('(max-width: 760px)').matches;
const coarse = matchMedia('(pointer: coarse)').matches;

/* split headline lines for the masked reveal */
document.querySelectorAll('[data-split] .line').forEach((l) => { l.innerHTML = `<span>${l.innerHTML}</span>`; });
requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('ready')));

/* smooth scroll */
let lenis = null;
if (!reduced && !coarse) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href'); const el = id === '#top' ? 0 : document.querySelector(id);
    if (el === null) return; e.preventDefault(); lenis.scrollTo(el, { offset: id === '#top' ? 0 : -24 });
  }));
}

/* nav: hide on scroll down, show on scroll up */
const nav = document.querySelector('[data-nav]');
let lastY = scrollY;
addEventListener('scroll', () => {
  const y = scrollY; nav.classList.toggle('hide', y > lastY && y > 300); lastY = y;
}, { passive: true });

/* reveal */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

/* preview loops: load + play only while in view */
const vio = new IntersectionObserver((es) => es.forEach((e) => {
  const v = e.target;
  if (e.isIntersecting) { if (!v.src) v.src = v.dataset.src; if (!reduced) v.play().catch(() => {}); }
  else v.pause();
}), { rootMargin: '120px 0px' });
document.querySelectorAll('video[data-src]').forEach((v) => vio.observe(v));

/* player */
const films = {
  grok: ['Grok Imagine', 'Launch film'], lightspeed: ['Lightspeed Venture Partners', 'Series intro, Lightwork'],
  a16z: ['a16z', 'Concept / spec ad. Not client work.'], cyberfund: ['cyber•Fund', 'Brand film'], propr: ['Propr', 'Launch film'],
  blueprint: ['Blueprint', 'Launch film'], cartesia: ['Cartesia', 'Studio work. Credit @Thru_18.'], eloscape: ['Eloscape', 'Launch film'], wondercraft: ['Wondercraft', 'Wondercraft Video launch film'], reel: ['The dotcreate reel', ''],
};
const dlg = document.querySelector('[data-player]');
const pv = dlg.querySelector('[data-player-video]');
document.querySelectorAll('[data-film]').forEach((b) => b.addEventListener('click', () => {
  const k = b.dataset.film; const [t, c] = films[k];
  dlg.querySelector('[data-player-title]').textContent = t;
  dlg.querySelector('[data-player-credit]').textContent = c;
  pv.poster = `/assets/${k}.jpg`; pv.src = `/assets/${k}.mp4`;
  dlg.showModal(); lenis?.stop(); pv.play().catch(() => {});
}));
dlg.querySelector('[data-close]').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener('close', () => { pv.pause(); pv.removeAttribute('src'); pv.load(); lenis?.start(); });

/* receipts table is prerendered into the HTML so crawlers can read it without JS */

/* count up hero stats once */
const fmt = (n) => n.toLocaleString('en-US');
const counters = document.querySelectorAll('[data-count]');
if (!reduced) {
  counters.forEach((el) => {
    const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '';
    const t0 = performance.now() + 500, dur = 1600;
    const tick = (now) => {
      const k = Math.min(1, Math.max(0, (now - t0) / dur)); const e = 1 - Math.pow(1 - k, 4); const v = to * e;
      el.textContent = (el.dataset.sep !== undefined ? fmt(Math.round(v)) : v.toFixed(dec)) + suf;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* IST clock */
const clock = document.querySelector('[data-clock]');
const setClock = () => { clock.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }); };
setClock(); setInterval(setClock, 30000);

/* hero icon: inline SVG (already painted), animated only while the hero is on screen */
const hero = document.querySelector('[data-hero]');
const iconWrap = document.querySelector('[data-icon]');
const iconSvg = iconWrap.querySelector('.dc-icon');
const icon = animate(iconSvg, { reduced, host: iconWrap });
iconSvg.setAttribute('tabindex', reduced ? '-1' : '0');
if (!reduced) {
  new IntersectionObserver(([e]) => (e.isIntersecting ? icon.start() : icon.stop()), { threshold: 0 }).observe(hero);
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false; const r = hero.getBoundingClientRect(); const p = Math.min(1, Math.max(0, -r.top / (r.height * 0.75)));
      iconWrap.style.transform = `translate3d(0, ${(p * -60).toFixed(1)}px, 0) scale(${(1 - p * 0.14).toFixed(4)})`;
      iconWrap.style.opacity = (1 - p * 1.05).toFixed(3);
    });
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
}
