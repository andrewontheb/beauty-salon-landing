import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import config from '../astro.config.mjs';
import { siteConfig } from '../config/site.mjs';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const base = `${(config.base || '/').replace(/\/+$/, '')}/`;
const localPath = pathname => {
  assert(pathname.startsWith(base), `Ссылка вне base ${base}: ${pathname}`);
  return `/${pathname.slice(base.length)}`;
};
const catalog = JSON.parse(await readFile(resolve(root, 'src/data/catalog.json'), 'utf8'));
const publicDirections = catalog.filter(d => d.status === 'source').map(d => ({
  ...d, groups: d.groups.map(g => ({...g, services: g.services.filter(s =>
    s.status === 'source' && s.variants.every(v => v.price.kind !== 'unspecified'))})).filter(g => g.services.length),
})).filter(d => d.groups.length);
const allowed = new Map(publicDirections.flatMap(d => d.groups.flatMap(g => g.services.map(s =>
  [`${d.id}/${g.id}/${s.id}`, s]))));
const prices = new Map([...allowed].flatMap(([path, service]) => service.variants.map(v => [`${path}/${v.id}`, v])));
const promotions = JSON.parse(await readFile(resolve(root, 'src/data/promotions.json'), 'utf8')).filter(p => p.publish);
// Исключение только для явно разрешённых предложений, не для произвольных скрытых цен.
const promotionPrices = new Map(promotions.map(p => {
  const [d, g, s, v] = p.priceRef.split('/');
  const direction = catalog.find(item => item.id === d);
  const service = direction?.groups.find(item => item.id === g)?.services.find(item => item.id === s);
  const variant = service?.variants.find(item => item.id === v);
  assert(direction?.status === 'source' && service && !['conflict', 'paused'].includes(service.status) && variant && variant.price.kind !== 'unspecified');
  return [p.priceRef, variant];
}));
const files = await readdir(dist, { recursive: true });
const pages = new Map();
const matches = (html, re) => [...html.matchAll(re)].map(m => m[1]);
const clean = text => text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const money = price => {
  const n = value => new Intl.NumberFormat('ru-RU').format(value);
  if (price.kind === 'fixed') return `${n(price.amount)} ₽`;
  if (price.kind === 'from') return `от ${n(price.amount)} ₽`;
  assert.equal(price.kind, 'range');
  return `${n(price.min)}–${n(price.max)} ₽`;
};

for (const file of files.filter(file => file.endsWith('.html'))) {
  const html = await readFile(resolve(dist, file), 'utf8');
  const route = file === 'index.html' ? '/' : file.endsWith('/index.html') ? `/${dirname(file)}/` : `/${file}`;
  const ids = matches(html, /\bid="([^"]+)"/g);
  assert.equal(new Set(ids).size, ids.length, `Дубли ID: ${route}`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `H1: ${route}`);
  assert.match(html, /<html lang="ru">/);
  const robots = siteConfig.live && route !== '/404.html' ? 'index, follow' : 'noindex, nofollow';
  assert(html.includes(`name="robots" content="${robots}"`), `Индексация: ${route}`);
  assert.match(html, /name="description" content="[^"]{30,}"/);
  assert.doesNotMatch(html, /<form\b/);
  const scripts = [...html.matchAll(/<script\b([^>]*)>(.*?)<\/script>/gs)];
  for (const [, attrs, body] of scripts) {
    if (attrs.includes('type="application/ld+json"')) { JSON.parse(body); continue; }
    assert(route === '/' && attrs.includes('type="module"') && !/\bsrc=/.test(attrs), `Неожиданный клиентский скрипт: ${route}`);
    assert(body.includes('salon-gallery'), 'Разрешён только скрипт галереи');
  }
  const canonical = new URL(`${base}${route.slice(1)}`, config.site).href;
  assert.equal(html.match(/rel="canonical" href="([^"]+)"/)?.[1], canonical, `Canonical: ${route}`);
  for (const property of ['type', 'locale', 'site_name', 'title', 'description', 'url', 'image', 'image:alt', 'image:width', 'image:height']) {
    assert(html.includes(`property="og:${property}" content="`), `Нет og:${property}: ${route}`);
  }
  assert.equal(html.match(/property="og:url" content="([^"]+)"/)?.[1], canonical);
  const social = new URL(html.match(/property="og:image" content="([^"]+)"/)?.[1]);
  assert.equal(social.origin, new URL(config.site).origin);
  await access(resolve(dist, `.${localPath(social.pathname)}`));
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  const structured = scripts.find(([, attrs]) => attrs.includes('application/ld+json'));
  if (route === '/404.html') assert(!structured, 'На 404 не нужна разметка салона');
  else {
    const data = JSON.parse(structured?.[2] || 'null');
    assert.equal(data?.['@context'], 'https://schema.org');
    const salon = data['@graph'].find(item => item['@type'] === 'BeautySalon');
    assert.equal(salon?.telephone, '+74956891716');
    assert.equal(salon?.openingHours, 'Mo-Su 09:00-21:00');
    assert.equal(salon?.address.addressLocality, 'Москва');
    assert(!salon?.aggregateRating && !salon?.review, 'Неподтверждённые отзывы');
    await access(resolve(dist, `.${localPath(new URL(salon.image).pathname)}`));
    if (route !== '/') {
      const crumbs = data['@graph'].find(item => item['@type'] === 'BreadcrumbList')?.itemListElement;
      assert(crumbs?.length >= 2, `Нет хлебных крошек: ${route}`);
      assert.equal(crumbs.at(-1).item, canonical);
      assert(crumbs.every((item, i) => item.position === i + 1 && item.name));
    }
  }
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title, `Title: ${route}`);
  assert(![...pages.values()].some(p => p.title === title), `Повтор title: ${title}`);
  const services = matches(html, /data-service="([^"]+)"/g);
  assert.equal(new Set(services).size, services.length, `Повтор услуги: ${route}`);
  for (const path of services) assert(allowed.has(path), `Запрещённая услуга: ${path}`);
  for (const match of html.matchAll(/data-price-ref="([^"]+)"[^>]*>(.*?)<\/div>/gs)) {
    const [,ref,fragment] = match;
    const variant = (route === '/aktsii/' ? promotionPrices : prices).get(ref);
    assert(variant, `Запрещённая цена: ${ref}`);
    const amounts = variant.price.kind === 'range' ? [variant.price.min, variant.price.max] : [variant.price.amount];
    assert(amounts.every(n => n > 0), `Нулевая цена: ${ref}`);
    const dd = clean(fragment.match(/<dd>(.*?)<\/dd>/s)?.[1] || '');
    assert(dd.startsWith(clean(money(variant.price))), `Цена отличается от каталога: ${ref}`);
    if (variant.unit) assert(dd.includes(variant.unit), `Потеряна единица: ${ref}`);
  }
  const description = html.match(/name="description" content="([^"]+)"/)?.[1];
  assert(![...pages.values()].some(p => p.description === description), `Повтор description: ${route}`);
  pages.set(route, {html, ids: new Set(ids), title, description, services});
}
assert.equal(pages.size, publicDirections.length + 4, 'Ожидаются главная, каталог, акции, направления и 404');
const offers = pages.get('/aktsii/');
assert.deepEqual(matches(offers.html, /data-promotion="([^"]+)"/g).sort(), promotions.map(p => p.id).sort());
assert.deepEqual(matches(offers.html, /data-price-ref="([^"]+)"/g).sort(), promotions.map(p => p.priceRef).sort());
for (const p of promotions) {
  assert(offers.html.includes(p.duration), `Нет длительности акции: ${p.id}`);
  if (p.publicNote) assert(offers.html.includes(p.publicNote), `Нет условия акции: ${p.id}`);
}
for (const direction of publicDirections) {
  const page = pages.get(`/uslugi/${direction.slug}/`);
  assert(page, `Нет направления: ${direction.id}`);
  const expected = direction.groups.flatMap(g => g.services.map(s => `${direction.id}/${g.id}/${s.id}`));
  assert.deepEqual([...page.services].sort(), expected.sort(), `Неполный прайс: ${direction.id}`);
  assert.equal(matches(page.html, /data-price-ref="([^"]+)"/g).length,
    direction.groups.flatMap(g => g.services).reduce((n,s) => n + s.variants.length,0));
}
let links = 0;
for (const [route, page] of pages) {
  let calls = 0;
  for (const href of matches(page.html, /\bhref="([^"]+)"/g)) {
    if (href.startsWith('tel:')) { assert.equal(href, 'tel:+74956891716'); calls++; continue; }
    const target = new URL(href.replaceAll('&amp;', '&'), `http://local${base}${route.slice(1)}`);
    if (target.origin !== 'http://local') continue;
    const pathname = localPath(target.pathname);
    if (/\.(css|svg|webp|png|jpg|xml)$/.test(pathname)) { await access(resolve(dist, `.${pathname}`)); continue; }
    const destination = pages.get(pathname);
    assert(destination, `Нет маршрута: ${route} → ${target.pathname}`);
    if (target.hash) assert(destination.ids.has(decodeURIComponent(target.hash.slice(1))), `Нет якоря: ${route} → ${href}`);
    links++;
  }
  assert(calls > 0, `Нет ссылки звонка: ${route}`);
  for (const src of matches(page.html, /<img[^>]*\bsrc="([^"]+)"/g)) {
    assert(src.startsWith('/'), `Нелокальное фото: ${src}`);
    await access(resolve(dist, `.${localPath(src)}`));
  }
  for (const tag of matches(page.html, /(<img\b[^>]*>)/g)) {
    assert(/\balt(?:=|\s|>)/.test(tag), `Нет alt: ${route}`);
    assert(/\bwidth="\d+"/.test(tag) && /\bheight="\d+"/.test(tag), `Нет размеров: ${route}`);
    const srcset = tag.match(/\bsrcset="([^"]+)"/)?.[1];
    for (const candidate of srcset?.split(',') || []) {
      await access(resolve(dist, `.${localPath(candidate.trim().split(/\s+/)[0])}`));
    }
  }
}
const robots = await readFile(resolve(dist, 'robots.txt'), 'utf8');
assert.match(robots, /Allow: \/\n/);
const sitemap = await readFile(resolve(dist, 'sitemap.xml'), 'utf8');
const sitemapUrls = matches(sitemap, /<loc>(.*?)<\/loc>/g);
const expectedUrls = siteConfig.live ? [...pages.keys()].filter(route => route !== '/404.html').map(route => new URL(`${base}${route.slice(1)}`, config.site).href) : [];
assert.deepEqual(sitemapUrls.sort(), expectedUrls.sort(), 'Sitemap должен содержать только индексируемые страницы');
assert.equal(robots.includes('Sitemap:'), siteConfig.live, 'Sitemap не анонсируется для demo');
if (siteConfig.live) assert(robots.includes(new URL(`${base}sitemap.xml`, config.site).href));
const inventory = await readFile(resolve(root, 'docs/content-inventory.md'), 'utf8');
for (const match of inventory.matchAll(/^\| `\/[^`]*` \| `([^`]+)`/gm)) {
  const target = new URL(match[1], 'http://local');
  const page = pages.get(target.pathname);
  assert(page, `Нет маршрута из карты переноса: ${match[1]}`);
  if (target.hash) assert(page.ids.has(target.hash.slice(1)), `Нет якоря из карты переноса: ${match[1]}`);
}
console.log(`Проверено ${siteConfig.mode} с base=${base}: ${pages.size} страниц, ${allowed.size} услуг, ${prices.size} вариантов цен, ${promotions.length} предложений, ${links} внутренних ссылок, canonical/OG/JSON-LD/robots/sitemap и изображения. Ошибок нет.`);
