/* dotcreate hero icon: the skull mask, glossy, floating in a living Deep Blue flame.
   Hand built SVG. No dependencies. markup() is also used at build time and by the asset exporter. */

const TAU = Math.PI * 2;
const W = TAU / 6; // every periodic motion is a multiple of this, so the idle loop repeats every 6s

/* flame silhouette, hand placed, clockwise from the tip. [x, y, wobble amp, freq mult, phase] */
const FLAME = [
  [224, 56, 13, 2, 0.0],
  [266, 150, 7, 3, 1.1],
  [330, 188, 7, 2, 2.8],
  [422, 200, 8, 2, 2.3],
  [486, 288, 7, 3, 0.6],
  [500, 424, 6, 2, 3.9],
  [464, 556, 7, 3, 2.0],
  [342, 614, 6, 2, 4.6],
  [196, 602, 7, 3, 5.2],
  [118, 508, 7, 2, 1.7],
  [106, 364, 7, 3, 3.1],
  [136, 250, 8, 2, 4.2],
  [188, 168, 7, 3, 0.4],
];
const FC = [306, 400]; // flame centre

function catmull(pts) {
  const n = pts.length; let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const t = i === 0 || i === n - 1 ? 0.22 : 0.17; // tighter into the tip so it reads as a flame, softer elsewhere
    const c1x = p1[0] + (p2[0] - p0[0]) * t, c1y = p1[1] + (p2[1] - p0[1]) * t;
    const c2x = p2[0] - (p3[0] - p1[0]) * t, c2y = p2[1] - (p3[1] - p1[1]) * t;
    d += `C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}

/* flame points at time t; s scales toward the centre (used for the inner sheen), lift moves the tip */
function flamePts(t, s = 1, dx = 0, dy = 0, energy = 0) {
  const breathe = 1 + Math.sin(t * W * 2) * 0.012;
  return FLAME.map(([x, y, a, f, ph], i) => {
    const amp = a * (1 + energy);
    let px = x + Math.sin(t * W * f + ph) * amp;
    let py = y + Math.cos(t * W * f + ph * 1.3) * amp * 0.8;
    if (i === 0) { px += Math.sin(t * W) * 10; py += Math.sin(t * W * 2 + 1) * 8; } // the tip sways
    px = FC[0] + (px - FC[0]) * breathe * s + dx; py = FC[1] + (py - FC[1]) * breathe * s + dy;
    return [px, py];
  });
}
export function flamePath(t, energy = 0) { return catmull(flamePts(t, 1, 0, 0, energy)); }
function innerPath(t, energy = 0) { return catmull(flamePts(t, 0.9, -6, -12, energy)); }
function tipAt(t) { return flamePts(t)[0]; }

/* skull, in logo units (the mark is 100 x 108), rounded into an icon */
const SK = {
  body: 'M4 17Q4 3 18 3H82Q96 3 96 17V65Q96 71.5 90.4 74.1L83 77.3Q77 80 77 86.5V89.6Q77 94.4 72.4 95.6Q50 101 27.6 95.6Q23 94.4 23 89.6V86.5Q23 80 17 77.3L9.6 74.1Q4 71.5 4 65Z',
  eyeL: 'M14.5 48.5L45 61.5H14.5Z',
  eyeR: 'M85.5 48.5L55 61.5H85.5Z',
  chin: 'M27 101.2Q50 106.8 73 101.2Q77 100.2 77 104.2V106.4Q77 110.5 73 110.5H27Q23 110.5 23 106.4V104.2Q23 100.2 27 101.2Z',
  sheen: 'M12 20Q12 9 24 9H76Q88 9 88 20Q88 27 80 27.5Q50 30 20 27.5Q12 27 12 20Z',
};
const SKX = 158.5, SKY = 244, SKS = 2.95; // placement inside the flame
const ANCHOR = [SKX + 50 * SKS, SKY + 108 * SKS]; // squash from the chin

export function markup({ t = 0, id = 'dc', cls = '', title = '', glow = 'filter' } = {}) {
  const u = (n) => `${id}-${n}`;
  return `<svg class="${cls}" xmlns="http://www.w3.org/2000/svg" viewBox="40 -40 520 700" role="img" ${title ? `aria-label="${title}"` : 'aria-hidden="true"'} overflow="visible">
<defs>
  <radialGradient id="${u('glow')}" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(306 380) scale(330 360)">
    <stop offset="0" stop-color="#0400FF" stop-opacity=".62"/><stop offset=".45" stop-color="#0400FF" stop-opacity=".26"/><stop offset=".75" stop-color="#0400FF" stop-opacity=".08"/><stop offset="1" stop-color="#0400FF" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="${u('fl')}" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(300 400) scale(250 300)">
    <stop offset="0" stop-color="#0300C8"/><stop offset=".5" stop-color="#0400FF"/><stop offset=".82" stop-color="#1630FF"/><stop offset="1" stop-color="#3D6BFF"/>
  </radialGradient>
  <linearGradient id="${u('flin')}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#9FB6FF" stop-opacity=".55"/><stop offset=".35" stop-color="#5A7BFF" stop-opacity=".12"/><stop offset="1" stop-color="#0400FF" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="${u('rim')}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#C9D6FF"/><stop offset=".5" stop-color="#6E8DFF"/><stop offset="1" stop-color="#2A4BFF"/>
  </linearGradient>
  <radialGradient id="${u('bounce')}" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(300 420) scale(190 200)">
    <stop offset="0" stop-color="#C0FF00" stop-opacity=".32"/><stop offset=".55" stop-color="#7DFF6A" stop-opacity=".08"/><stop offset="1" stop-color="#00E0FF" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="${u('shadow')}" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#000060" stop-opacity=".75"/><stop offset="1" stop-color="#000060" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="${u('side')}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#7EA300"/><stop offset=".6" stop-color="#4C6600"/><stop offset="1" stop-color="#2E3F00"/>
  </linearGradient>
  <linearGradient id="${u('face')}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#F2FFB3"/><stop offset=".14" stop-color="#DBFF4D"/><stop offset=".42" stop-color="#C0FF00"/><stop offset=".74" stop-color="#ACE300"/><stop offset="1" stop-color="#8CBC00"/>
  </linearGradient>
  <linearGradient id="${u('shade')}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#FFFFFF" stop-opacity=".16"/><stop offset=".3" stop-color="#FFFFFF" stop-opacity="0"/><stop offset=".72" stop-color="#2E4A00" stop-opacity="0"/><stop offset="1" stop-color="#2E4A00" stop-opacity=".42"/>
  </linearGradient>
  <linearGradient id="${u('edge')}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset=".25" stop-color="#FFFFFF" stop-opacity=".25"/><stop offset=".6" stop-color="#FFFFFF" stop-opacity="0"/><stop offset=".92" stop-color="#E9FF8C" stop-opacity="0"/><stop offset="1" stop-color="#E9FF8C" stop-opacity=".5"/>
  </linearGradient>
  <linearGradient id="${u('diag')}" x1="0" y1="0" x2="1" y2="1">
    <stop offset=".45" stop-color="#2E4A00" stop-opacity="0"/><stop offset="1" stop-color="#2E4A00" stop-opacity=".26"/>
  </linearGradient>
  <linearGradient id="${u('sheen')}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFFFFF" stop-opacity=".9"/><stop offset=".55" stop-color="#FFFFFF" stop-opacity=".32"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="${u('sock')}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0B0F00"/><stop offset=".55" stop-color="#18200A"/><stop offset="1" stop-color="#1B2A66"/>
  </linearGradient>
  <linearGradient id="${u('chin')}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#E4FF73"/><stop offset=".35" stop-color="#C0FF00"/><stop offset="1" stop-color="#8DBD00"/>
  </linearGradient>
  <filter id="${u('blur')}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="26"/></filter>
  <clipPath id="${u('clipF')}"><path class="dc-flame-clip" d="${flamePath(t)}"/></clipPath>
  <clipPath id="${u('clipS')}"><path d="${SK.body}"/></clipPath>
</defs>
<g class="dc-glow"><ellipse cx="306" cy="380" rx="330" ry="360" fill="url(#${u('glow')})"/>${glow === 'filter' ? `<path d="${flamePath(t)}" fill="#2440FF" opacity=".55" filter="url(#${u('blur')})"/>` : ''}</g>
<g class="dc-flame">
  <path class="dc-flame-o" d="${flamePath(t)}" fill="none" stroke="#3358FF" stroke-width="24" stroke-linejoin="round" opacity="0.11"/>
  <path class="dc-flame-o" d="${flamePath(t)}" fill="none" stroke="#3D66FF" stroke-width="14" stroke-linejoin="round" opacity="0.16"/>
  <path class="dc-flame-o" d="${flamePath(t)}" fill="none" stroke="#5A82FF" stroke-width="6" stroke-linejoin="round" opacity="0.28"/>
  <path class="dc-flame-path" d="${flamePath(t)}" fill="url(#${u('fl')})"/>
  <g clip-path="url(#${u('clipF')})">
    <path class="dc-flame-o" d="${flamePath(t)}" fill="none" stroke="#4F7BFF" stroke-width="64" opacity="0.05"/>
    <path class="dc-flame-o" d="${flamePath(t)}" fill="none" stroke="#5C86FF" stroke-width="48" opacity="0.06"/>
    <path class="dc-flame-o" d="${flamePath(t)}" fill="none" stroke="#6E92FF" stroke-width="34" opacity="0.08"/>
    <path class="dc-flame-o" d="${flamePath(t)}" fill="none" stroke="#86A5FF" stroke-width="22" opacity="0.11"/>
    <path class="dc-flame-o" d="${flamePath(t)}" fill="none" stroke="#A3BBFF" stroke-width="12" opacity="0.16"/>
    <path class="dc-flame-o" d="${flamePath(t)}" fill="none" stroke="#C9D6FF" stroke-width="5" opacity="0.3"/>
    <ellipse class="dc-bounce" cx="300" cy="420" rx="190" ry="200" fill="url(#${u('bounce')})"/>
    <path class="dc-flame-in" d="${innerPath(t)}" fill="none" stroke="url(#${u('flin')})" stroke-width="16"/>
    <path class="dc-flame-in2" d="${innerPath(t)}" fill="url(#${u('flin')})" opacity=".35"/>
  </g>
  <path class="dc-flame-rim" d="${flamePath(t)}" fill="none" stroke="url(#${u('rim')})" stroke-width="2.4" opacity=".75"/>
  <g class="dc-drops"><circle class="dc-drop0" cx="${tipAt(t)[0] + 18}" cy="${tipAt(t)[1] - 34}" r="8" fill="#3D6BFF"/><circle cx="${tipAt(t)[0] + 16.5}" cy="${tipAt(t)[1] - 36}" r="2.4" fill="#C9D6FF" class="dc-drop0h"/>
    <circle class="dc-d" r="0" fill="#3D6BFF"/><circle class="dc-d" r="0" fill="#3D6BFF"/><circle class="dc-d" r="0" fill="#3D6BFF"/>
  </g>
</g>
<ellipse class="dc-cast" cx="${ANCHOR[0] + 8}" cy="${ANCHOR[1] + 14}" rx="150" ry="24" fill="url(#${u('shadow')})"/>
<g class="dc-skull">
 <g transform="translate(${SKX} ${SKY}) scale(${SKS})">
  <g class="dc-chin">
    <path d="${SK.chin}" transform="translate(2.4 3)" fill="url(#${u('side')})"/>
    <path d="${SK.chin}" fill="url(#${u('chin')})"/>
    <path d="M38.5 104.2V108.6M50 105.1V109M61.5 104.2V108.6" stroke="#5A7A00" stroke-width="1.4" stroke-linecap="round" opacity=".55"/>
    <path d="M39.6 104.8V108.2M51.1 105.6V108.6M62.6 104.8V108.2" stroke="#F4FFC2" stroke-width=".7" stroke-linecap="round" opacity=".45"/>
    <path d="M28 102.1Q50 107.4 72 102.1" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" opacity=".7"/>
  </g>
  <path d="${SK.body}" transform="translate(3.4 4.6)" fill="url(#${u('side')})"/>
  <path d="${SK.body}" fill="url(#${u('face')})"/>
  <g clip-path="url(#${u('clipS')})">
    <rect x="0" y="0" width="100" height="100" fill="url(#${u('shade')})"/>
        <rect x="0" y="0" width="100" height="100" fill="url(#${u('diag')})"/>
    
    <g class="dc-sheen"><path d="${SK.sheen}" fill="url(#${u('sheen')})"/></g>
  </g>
  <path d="${SK.body}" fill="none" stroke="url(#${u('edge')})" stroke-width="1.3"/>
  <ellipse class="dc-spec" cx="15" cy="15" rx="4.2" ry="2.6" transform="rotate(-38 15 15)" fill="#FFFFFF" opacity=".95"/>
  <g class="dc-eyes">
    <g class="dc-eye dc-eyeL">
      <path d="M14 50.4L43 63" stroke="#5E7F00" stroke-width="2.6" stroke-linecap="round" opacity=".45"/>
      <path d="${SK.eyeL}" fill="url(#${u('sock')})" stroke="url(#${u('sock')})" stroke-width="3.2" stroke-linejoin="round"/>
      <path d="M18 63.4H41" stroke="#F6FFC8" stroke-width="1.1" stroke-linecap="round" opacity=".6"/>
      
      <g class="dc-glint" transform="translate(20.5 57.6)"><path d="M0 -3.2L.7 -.7 3.2 0 .7 .7 0 3.2 -.7 .7 -3.2 0 -.7 -.7Z" fill="#FFFFFF"/></g>
    </g>
    <g class="dc-eye dc-eyeR">
      <path d="M86 50.4L57 63" stroke="#5E7F00" stroke-width="2.6" stroke-linecap="round" opacity=".45"/>
      <path d="${SK.eyeR}" fill="url(#${u('sock')})" stroke="url(#${u('sock')})" stroke-width="3.2" stroke-linejoin="round"/>
      <path d="M59 63.4H82" stroke="#F6FFC8" stroke-width="1.1" stroke-linecap="round" opacity=".6"/>
      
      <g class="dc-glint" transform="translate(79.5 57.6)"><path d="M0 -3.2L.7 -.7 3.2 0 .7 .7 0 3.2 -.7 .7 -3.2 0 -.7 -.7Z" fill="#FFFFFF"/></g>
    </g>
  </g>
 </g>
</g>
</svg>`;
}

/* ---------- motion ---------- */
const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const ease = (k) => 1 - Math.pow(1 - k, 3);

/* blink: pure function of time. loop mode blinks at 2.2s and 4.9s (double). site mode jitters per cycle */
function blinkAt(t, loop) {
  const P = loop ? 6 : 5.2; const c = Math.floor(t / P); const lt = t - c * P;
  const at = loop ? [2.2, 4.9, 5.12] : [1.4 + hash(c) * 2.4, 4.3 + hash(c + 9) * 0.5, ...(hash(c + 3) > 0.55 ? [4.52 + hash(c + 9) * 0.5] : [])];
  let s = 1;
  for (const b of at) { const d = lt - b; if (d > 0 && d < 0.17) s = Math.min(s, d < 0.06 ? 1 - d / 0.06 * 0.9 : 0.1 + (d - 0.06) / 0.11 * 0.9); }
  return s;
}
function glintAt(t, loop) {
  const P = loop ? 6 : 4.4; const c = Math.floor(t / P); const lt = t - c * P;
  const at = loop ? 0.9 : 0.6 + hash(c + 21) * 2.6; const which = loop ? 1 : (hash(c + 5) > 0.5 ? 1 : 0);
  const d = lt - at; const s = d > 0 && d < 0.7 ? Math.sin((d / 0.7) * Math.PI) : 0;
  return [which === 0 ? s : 0, which === 1 ? s : 0];
}
/* droplets rising off the tip */
function dropAt(i, t, loop) {
  const P = 6, start = [0.4, 2.5, 4.3][i], life = 1.7; const c = Math.floor((t - start) / P); const d = t - start - c * P;
  if (d > life) return null; const k = d / life;
  const j = loop ? 0.5 : hash(c * 3 + i);
  const tip = tipAt(t - d * 0.6);
  return { x: tip[0] + (j - 0.5) * 30 + Math.sin(k * 3 + i) * 8 + 10, y: tip[1] - 14 - ease(k) * (90 + j * 40), r: (5 + j * 3.5) * (1 - k * 0.6) * Math.min(1, d / 0.25), o: k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85 };
}

export function animate(svg, { reduced = false, loop = false, interactive = true, host = svg } = {}) {
  const q = (s) => svg.querySelector(s), qa = (s) => [...svg.querySelectorAll(s)];
  const fl = qa('.dc-flame-path,.dc-flame-rim,.dc-flame-clip,.dc-flame-o'), inner = qa('.dc-flame-in,.dc-flame-in2');
  const flameG = q('.dc-flame'), glowG = q('.dc-glow'), skull = q('.dc-skull'), chin = q('.dc-chin'), sheen = q('.dc-sheen');
  const spec = q('.dc-spec'), eyes = qa('.dc-eye'), glints = qa('.dc-glint'), drops = qa('.dc-d'), cast = q('.dc-cast'), bounce = q('.dc-bounce');
  const d0 = q('.dc-drop0'), d0h = q('.dc-drop0h');

  // springs and pointer state
  const st = { px: 0, py: 0, tx: 0, ty: 0, sq: 0, sqv: 0, rot: 0, rv: 0, ox: 0, ov: 0, oy: 0, oyv: 0, jaw: 0, jv: 0, energy: 0, drag: null };
  let running = false, raf = 0, last = 0, clock = 0;

  function frame(t, dt) {
    // springs
    const k = 170, c = 11;
    const spring = (x, v, target = 0, kk = k, cc = c) => { v += (-(x - target) * kk - v * cc) * dt; return [x + v * dt, v]; };
    if (!st.drag) { [st.ox, st.ov] = spring(st.ox, st.ov); [st.oy, st.oyv] = spring(st.oy, st.oyv); [st.rot, st.rv] = spring(st.rot, st.rv, 0, 120, 7); }
    [st.sq, st.sqv] = spring(st.sq, st.sqv, 0, 260, 9);
    [st.jaw, st.jv] = spring(st.jaw, st.jv, 0, 300, 10);
    st.energy *= Math.pow(0.2, dt);
    st.px += (st.tx - st.px) * Math.min(1, dt * 4); st.py += (st.ty - st.py) * Math.min(1, dt * 4);

    const en = st.energy;
    const dF = flamePath(t, en), dI = innerPath(t, en);
    fl.forEach((p) => p.setAttribute('d', dF)); inner.forEach((p) => p.setAttribute('d', dI));
    flameG.setAttribute('transform', `translate(${(st.px * 10).toFixed(2)} ${(st.py * 8).toFixed(2)})`);
    glowG.setAttribute('transform', `translate(${(st.px * 4).toFixed(2)} ${(st.py * 4).toFixed(2)})`);
    bounce.setAttribute('transform', `translate(${(st.px * 22 + st.ox * 0.6).toFixed(2)} ${(st.py * 18 + Math.sin(t * W) * -10).toFixed(2)})`);

    // idle float with squash and stretch
    const bob = Math.sin(t * W); const vel = Math.cos(t * W);
    const y = -bob * 11 + st.py * 22 + st.oy, x = Math.sin(t * W * 2 + 0.5) * 2.5 + st.px * 26 + st.ox;
    const stretch = vel * 0.012 + st.sq;
    const sx = 1 - stretch * 0.9, sy = 1 + stretch;
    const r = Math.sin(t * W + 1.2) * 1.6 + st.px * 4 + st.rot;
    skull.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${r.toFixed(2)} ${ANCHOR[0]} ${ANCHOR[1] - 140}) translate(${ANCHOR[0]} ${ANCHOR[1]}) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(${-ANCHOR[0]} ${-ANCHOR[1]})`);
    chin.setAttribute('transform', `translate(0 ${(Math.max(0, Math.sin(t * W * 2)) * 0.6 + st.jaw).toFixed(2)})`);
    const lift = 1 - (bob + 1) * 0.5; // shadow tightens as the skull rises
    cast.setAttribute('transform', `translate(${(x * 0.5).toFixed(2)} 0) translate(${ANCHOR[0] + 8} ${ANCHOR[1] + 14}) scale(${(0.86 + lift * 0.14).toFixed(3)}) translate(${-(ANCHOR[0] + 8)} ${-(ANCHOR[1] + 14)})`);
    cast.setAttribute('opacity', (0.6 + lift * 0.4).toFixed(3));

    // sheen drifts against the parallax
    sheen.setAttribute('transform', `translate(${(Math.sin(t * W) * 2.2 - st.px * 3).toFixed(2)} ${(-st.py * 1.2).toFixed(2)})`);
    sheen.setAttribute('opacity', (0.86 + Math.sin(t * W * 2) * 0.12).toFixed(3));
    spec.setAttribute('opacity', (0.8 + Math.sin(t * W * 3) * 0.2).toFixed(3));

    // blink and glint
    const b = blinkAt(t, loop);
    eyes.forEach((e) => e.setAttribute('transform', b < 1 ? `translate(0 61.5) scale(1 ${b.toFixed(3)}) translate(0 -61.5)` : ''));
    const g = glintAt(t, loop);
    glints.forEach((el, i) => { const cx = i ? 79.5 : 20.5; el.setAttribute('transform', `translate(${cx} 57.6) rotate(${(g[i] * 45).toFixed(1)}) scale(${(g[i] * 1.25).toFixed(3)})`); });

    // droplets
    const tip = tipAt(t);
    const hx = tip[0] + 18 + Math.sin(t * W * 2) * 3, hy = tip[1] - 34 + Math.sin(t * W * 3) * 4;
    d0.setAttribute('cx', hx.toFixed(1)); d0.setAttribute('cy', hy.toFixed(1));
    d0h.setAttribute('cx', (hx - 2.2).toFixed(1)); d0h.setAttribute('cy', (hy - 2.6).toFixed(1));
    drops.forEach((el, i) => { const d = dropAt(i, t, loop); if (!d) { el.setAttribute('r', 0); return; } el.setAttribute('cx', d.x.toFixed(1)); el.setAttribute('cy', d.y.toFixed(1)); el.setAttribute('r', Math.max(0, d.r).toFixed(2)); el.setAttribute('opacity', clamp(d.o, 0, 1).toFixed(3)); });
  }

  function tick(now) {
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016); last = now; clock += dt;
    frame(window.__dcT ?? clock, dt);
    raf = requestAnimationFrame(tick);
  }
  const api = {
    start() { if (running || reduced) return; running = true; last = 0; raf = requestAnimationFrame(tick); },
    stop() { running = false; cancelAnimationFrame(raf); },
    render(t) { frame(t, 1 / 30); }, // deterministic frame for export
    poke(power = 1) { st.sqv -= 3.2 * power; st.oyv -= 260 * power; st.rv += (Math.random() - 0.5) * 220 * power; st.jv += 40 * power; st.energy = Math.min(1.2, st.energy + 0.8 * power); },
  };
  if (reduced) { frame(0, 0); return api; }

  if (interactive) {
    const rectOf = () => host.getBoundingClientRect();
    const fine = matchMedia('(pointer: fine)').matches;
    if (fine) addEventListener('pointermove', (e) => {
      const r = rectOf(); st.tx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width * 0.8), -1, 1); st.ty = clamp((e.clientY - (r.top + r.height / 2)) / (r.height * 0.8), -1, 1);
    }, { passive: true });
    let hoverT = 0;
    svg.addEventListener('pointerenter', () => { const n = performance.now(); if (fine && n - hoverT > 1200) { hoverT = n; api.poke(0.35); } });
    svg.addEventListener('pointerdown', (e) => {
      st.drag = { x: e.clientX, y: e.clientY, ox: st.ox, oy: st.oy, moved: 0 };
      svg.setPointerCapture?.(e.pointerId); host.classList.add('grabbing'); st.sqv += 1.2;
    });
    svg.addEventListener('pointermove', (e) => {
      const d = st.drag; if (!d) return; const dx = e.clientX - d.x, dy = e.clientY - d.y; d.moved = Math.max(d.moved, Math.hypot(dx, dy));
      const s = 520 / svg.getBoundingClientRect().width; // px to svg units
      st.ox = clamp(d.ox + dx * s * 0.4, -60, 60); st.oy = clamp(d.oy + dy * s * 0.4, -50, 50);
      st.rot = clamp(dx * s * 0.08, -16, 16); st.energy = Math.min(1, st.energy + 0.02);
    });
    const up = () => { const d = st.drag; if (!d) return; st.drag = null; host.classList.remove('grabbing'); if (d.moved < 6) api.poke(1); else { st.jv += 30; st.energy = Math.min(1.2, st.energy + 0.5); } };
    svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
    svg.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); api.poke(1); } });
  }
  frame(0, 0);
  return api;
}

/* the soft silhouette glow, as its own static layer: blurred once, then only moved by CSS transforms */
export function glowMarkup({ id = 'dcg', cls = '' } = {}) {
  return `<svg class="${cls}" xmlns="http://www.w3.org/2000/svg" viewBox="40 -40 520 700" aria-hidden="true" overflow="visible"><defs><filter id="${id}-b" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="26"/></filter></defs><path d="${flamePath(0)}" fill="#2440FF" opacity=".78" filter="url(#${id}-b)"/></svg>`;
}
