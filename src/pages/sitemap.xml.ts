import { publicCatalog } from '../data/catalog';
import { absoluteHref, isLive } from '../utils/seo';

export function GET() {
  const paths: `/${string}`[] = isLive
    ? ['/', '/uslugi/', '/aktsii/', ...publicCatalog.map((direction) => `/uslugi/${direction.slug}/` as const)]
    : [];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${absoluteHref(path)}</loc></url>`).join('')}</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
