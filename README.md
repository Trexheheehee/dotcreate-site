# dotcreate v4

Premium, editorial rebuild of the dotcreate studio site. Vite + vanilla JS, Lenis. Hero is an inline SVG icon (no WebGL).

- `npm i && npm run dev` (port 5173), `npm run build` to `dist/`.
- v3 is untouched at `/workspace/dotcreate-v3/` as a backup.

## Hero icon (v6, replaces the 3D skeleton)
- `src/icon.js`: the dotcreate skull mask drawn as a glossy lime icon in a living Deep Blue flame. Hand built SVG, no dependencies.
  - `markup()` is inlined into `index.html` at build time by the plugin in `vite.config.js`, so the icon paints with the HTML (no poster, works without JS).
  - `animate()` morphs the flame (13 point closed Catmull-Rom path), floats the skull with squash and stretch, drifts the sheen, blinks and glints the eyes, releases droplets off the tip, adds cursor parallax, hover bounce, click poke and drag with spring return.
  - Cost: about 0.2 ms of script per frame. Loop pauses when the hero is off screen; prefers-reduced-motion gets a still frame.
  - The wide silhouette glow is a separate blurred SVG layer that is never redrawn, only moved by CSS.
- Exports for motion work: `/workspace/dotcreate-icon/` (icon.svg, icon-animated.html, icon-1080.png, icon-loop-6s.mp4/.gif). Re-export with `node /workspace/dotcreate-icon/_work/export.mjs`.
- Three.js removed. 3D files backed up in `_backup-v6-3d/` (src, models, posters, old config); older skeleton history below.

## 3D skeleton (retired, v5)
- Source: "Human Skeleton" by Grab3D, https://grab3d.com/models/anatomy/human-skeleton/ (full 13.2 MB, 416K triangle GLB).
- License: CC0 1.0 Universal (public domain dedication, https://grab3d.com/license/). No attribution required; credited in the footer anyway.
- Pipeline (Blender 4.2 LTS headless, scripts in `/workspace/skel-v5/`): split head/neck from the body and decimate separately so the skull keeps its detail, Cycles bake of albedo luminance, ambient occlusion and cavity into vertex colour (COLOR_0 R/G/B), then gltf-transform `meshopt` with quantised positions, normals and colours.
  - `public/models/skeleton.glb`: 159.8K triangles, 1.20 MB (desktop).
  - `public/models/skeleton-lite.glb`: 71.6K triangles, 640 KB (phones / touch).
  - `public/models/drip.glb`: 69.0K triangles, 297 KB (both tiers). Thin gold aviators with beveled wire frame, bridge and temples, gradient mirror lenses; cigarette with filter, paper, char and ember; double curb chain of real modelled links; the dotcreate mark (`public/mark.svg`) as a beveled gold pendant with lime enamel, plus a small `$` charm. All modelled in Blender by dotcreate, nothing third party. No coat: a blocky one looked worse than none.
- Rendering (`src/skeleton.js`): ivory bone MeshStandardMaterial (roughness about 0.5) patched via onBeforeCompile to read the baked AO and cavity, add low frequency albedo, roughness and bump variation, and a lime / deep blue rim. Warm key, cool fill, coloured rims, small procedural studio environment for the gold and lens reflections. Ember is an emissive tip plus a star glint sprite and a soft smoke ribbon shader.
- Post (`src/post.js`): one composite pass (ACES, slight chromatic aberration, film grain, faint scanline and halftone, vignette) plus a two level bloom at 1/4 and 1/8 resolution. Phones get a lighter mix and no halftone; reduced motion freezes grain; bloom and DPR drop automatically if the frame rate falls.
- Perf rules: three is a separate chunk imported after `load` + idle; DPR capped; render loop pauses when the hero is off screen or the tab is hidden; prefers-reduced-motion renders still frames only; poster image (`hero-poster.webp`, `hero-poster-m.webp`) is shown first and stays if WebGL is missing.
- Motion: idle sway, cursor parallax (desktop), drag to spin with inertia (horizontal drag, `touch-action: pan-y` keeps vertical swipes scrolling), scroll pulls the camera back from bust to full figure.
- Backups: v4 files in `_backup-v4-skeleton/`, v4.1 procedural outfit (`drip.js`) in `_backup-v41-skeleton/`.

## Numbers
All figures come from `metrics.json` (public X metrics fetched 15 Nov 2026 via the X API tools). One post per film: client films count the client's own launch post (the post Pranav quoted or whose video he embedded), his reposts of those films are listed in `not_counted_duplicates` and left out. Total: 1,027,222 views, 4,702 likes, 2,221 bookmarks across 18 posts (10 client or creator launch posts, 863,857 views; 8 of Pranav's own posts, 163,365 views, including the a16z concept). Whop: no film post found, nothing counted. Excluded as before: the self-reported "9M+ impressions" post.

## Fonts
Geist and Geist Mono (SIL OFL), self-hosted in `public/fonts`. On Apple devices the stack uses SF Pro Display first, matching the SF UI Display brand font.

## Copy rules kept
No em or en dashes, a16z labelled "Concept / spec ad", Cartesia credited to @Thru_18, clients in the fixed order with real SVGs only for Grok, Lightspeed and Whop, CTA to @dotcreateX and @pranav_ae.
