import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://maque-bit.github.io',
  base: process.env.GH_PAGES_BASE || '/',
  outDir: './dist',
});
