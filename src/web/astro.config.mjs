import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://maque-bit.github.io',
  base: '/AntigravityProjects/',
  outDir: './dist',
  integrations: [tailwind()],
});