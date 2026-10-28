import { absoluteHref, isLive } from '../utils/seo';

// Разрешаем чтение HTML, чтобы поисковые роботы увидели noindex демоверсии.
// На GitHub Pages robots.txt подпапки не управляет origin; защита — meta на каждой странице.
export function GET() {
  return new Response(`User-agent: *\nAllow: /\n${isLive ? `Sitemap: ${absoluteHref('/sitemap.xml')}\n` : ''}`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
