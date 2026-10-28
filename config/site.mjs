// Индексация включается только явным SEO_MODE=live и только для основного домена.
const mode = process.env.SEO_MODE || 'demo';
if (!['demo', 'live'].includes(mode)) throw new Error('SEO_MODE: допустимы только demo и live');
const site = new URL(process.env.SITE_URL || 'http://localhost:4321');
if (!['http:', 'https:'].includes(site.protocol) || site.pathname !== '/' || site.search || site.hash || site.username || site.password) {
  throw new Error('SITE_URL должен содержать только origin сайта');
}
const base = `${(process.env.BASE_PATH || '/').replace(/\/+$/, '')}/`;
if (!base.startsWith('/') || base.includes('//') || /[?#]|\.\./.test(base)) throw new Error('Некорректный BASE_PATH');
if (mode === 'live' && (site.href !== 'https://juliadubitskaya.ru/' || base !== '/')) {
  throw new Error('SEO_MODE=live требует SITE_URL=https://juliadubitskaya.ru и BASE_PATH=/');
}
export const siteConfig = { mode, live: mode === 'live', site: site.href, base };
