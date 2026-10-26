import { defineConfig } from 'astro/config';

// Адрес Pages передаёт workflow; для основного домена достаточно BASE_PATH=/.
// https://docs.astro.build/en/guides/deploy/github/
export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL,
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
});
