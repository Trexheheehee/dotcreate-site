import { defineConfig } from 'vite';
import { markup, glowMarkup } from './src/icon.js';
import { aeoPlugin } from './src/aeo.js';

// the hero icon is inlined at build time, so it paints with the HTML and needs no poster or JS to show
const heroIcon = () => ({ name: 'hero-icon', transformIndexHtml: (html) => html.replace('<!--HERO_ICON-->', glowMarkup({ cls: 'dc-glowlayer' }) + markup({ id: 'dc', cls: 'dc-icon', glow: 'layer' })) });

export default defineConfig({
  plugins: [heroIcon(), aeoPlugin()],
  build: { target: 'es2020', assetsInlineLimit: 0 },
});
