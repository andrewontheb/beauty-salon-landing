import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import config from '../astro.config.mjs';

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
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.match(html, /name="description" content="[^"]{30,}"/);
  assert.doesNotMatch(html, /<script\b|<form\b/);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title, `Title: ${route}`);
  assert(![...pages.values()].some(p => p.title === title), `Повтор title: ${title}`);
  const services = matches(html, /data-service="([^"]+)"/g);
  assert.equal(new Set(services).size, services.length, `Повтор услуги: ${route}`);
  for (const path of services) assert(allowed.has(path), `Запрещённая услуга: ${path}`);
  for (const match of html.matchAll(/data-price-ref="([^"]+)"[^>]*>(.*?)<\/div>/gs)) {
    const [,ref,fragment] = match;
    const variant = prices.get(ref);
    assert(variant, `Запрещённая цена: ${ref}`);
    const amounts = variant.price.kind === 'range' ? [variant.price.min, variant.price.max] : [variant.price.amount];
    assert(amounts.every(n => n > 0), `Нулевая цена: ${ref}`);
    const dd = clean(fragment.match(/<dd>(.*?)<\/dd>/s)?.[1] || '');
    assert(dd.startsWith(clean(money(variant.price))), `Цена отличается от каталога: ${ref}`);
    if (variant.unit) assert(dd.includes(variant.unit), `Потеряна единица: ${ref}`);
  }
  pages.set(route, {html, ids: new Set(ids), title, services});
}
assert.equal(pages.size, publicDirections.length + 3, 'Ожидаются главная, каталог, направления и 404');
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
    if (/\.(css|svg|webp|png)$/.test(pathname)) { await access(resolve(dist, `.${pathname}`)); continue; }
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
}
assert.match(await readFile(resolve(dist, 'robots.txt'), 'utf8'), /Disallow: \/\s*$/);
const inventory = await readFile(resolve(root, 'docs/content-inventory.md'), 'utf8');
for (const match of inventory.matchAll(/^\| `\/[^`]*` \| `([^`]+)`/gm)) {
  const target = new URL(match[1], 'http://local');
  const page = pages.get(target.pathname);
  assert(page, `Нет маршрута из карты переноса: ${match[1]}`);
  if (target.hash) assert(page.ids.has(target.hash.slice(1)), `Нет якоря из карты переноса: ${match[1]}`);
}
console.log(`Проверено с base=${base}: ${pages.size} страниц, ${allowed.size} разрешённых услуг, ${prices.size} вариантов цен, ${links} внутренних ссылок. Ошибок нет.`);
