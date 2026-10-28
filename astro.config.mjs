import { defineConfig } from 'astro/config';
import { siteConfig } from './config/site.mjs';

// Адрес Pages передаёт workflow; для основного домена достаточно BASE_PATH=/.
// https://docs.astro.build/en/guides/deploy/github/
export default defineConfig({
  output: 'static',
  site: siteConfig.site,
  base: siteConfig.base,
  trailingSlash: 'always',
});
