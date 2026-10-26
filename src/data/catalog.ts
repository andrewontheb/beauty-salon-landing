import { siteHref } from '../utils/urls';
import { z } from 'zod';
import catalogData from './catalog.json';
import sourcePages from './source-pages.json';
import promotionData from './promotions.json';

const id = z.string().regex(/^[a-z0-9-]+$/);
const priceSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('fixed'), amount: z.number().int().nonnegative() }),
  z.object({ kind: z.literal('from'), amount: z.number().int().nonnegative() }),
  z.object({ kind: z.literal('range'), min: z.number().int().nonnegative(), max: z.number().int().nonnegative() })
    .refine((p) => p.max >= p.min, 'Верхняя цена меньше нижней'),
  z.object({ kind: z.literal('unspecified') }),
]);
const status = z.enum(['source', 'conflict', 'paused', 'needs-confirmation']);
const serviceSchema = z.object({
  id, title: z.string().min(1), status, note: z.string().optional(),
  description: z.string().optional(), publicNote: z.string().optional(),
  variants: z.array(z.object({
    id, label: z.string(), price: priceSchema, source: id, unit: z.string().optional(),
  })).min(1),
});
const catalogSchema = z.array(z.object({
  id, title: z.string().min(1), status, slug: id, summary: z.string(), description: z.string(),
  metaDescription: z.string(), sources: z.array(id).min(1),
  groups: z.array(z.object({ id, title: z.string().min(1), description: z.string().optional(), publicNote: z.string().optional(), services: z.array(serviceSchema).min(1) })).min(1),
})).min(1);

export type Price = z.infer<typeof priceSchema>;
export type Service = z.infer<typeof serviceSchema>;
export const catalog = catalogSchema.parse(catalogData);

function unique(ids: string[], scope: string) {
  if (new Set(ids).size !== ids.length) throw new Error(`Повторяющиеся ID: ${scope}`);
}
const sources = new Set(sourcePages.map((page) => page.id));
unique(catalog.map((d) => d.id), 'направления');
for (const direction of catalog) {
  unique(direction.groups.map((g) => g.id), direction.id);
  for (const group of direction.groups) {
    unique(group.services.map((s) => s.id), `${direction.id}/${group.id}`);
    for (const service of group.services) {
      unique(service.variants.map((v) => v.id), service.id);
      for (const variant of service.variants) {
        if (!sources.has(variant.source)) throw new Error(`Неизвестный источник: ${variant.source}`);
      }
    }
  }
}

export const promotions = z.array(z.object({
  id, title: z.string().min(1), duration: z.string().min(1), source: id,
  status: z.literal('needs-confirmation'), terms: z.string().min(1), priceRef: z.string().min(1),
})).parse(promotionData);
const priceIds = new Set(catalog.flatMap((d) => d.groups.flatMap((g) =>
  g.services.flatMap((s) => s.variants.map((v) => `${d.id}/${g.id}/${s.id}/${v.id}`)))));
unique(promotions.map((p) => p.id), 'акции');
for (const promotion of promotions) {
  if (!priceIds.has(promotion.priceRef) || !sources.has(promotion.source)) {
    throw new Error(`Неизвестная цена или источник акции: ${promotion.id}`);
  }
}

const rubles = new Intl.NumberFormat('ru-RU');
export function formatPrice(price: Price): string {
  switch (price.kind) {
    case 'fixed': return `${rubles.format(price.amount)} ₽`;
    case 'from': return `от ${rubles.format(price.amount)} ₽`;
    case 'range': return `${rubles.format(price.min)}–${rubles.format(price.max)} ₽`;
    case 'unspecified': return 'Цена не указана';
  }
}

// Единственное правило публикации для всех страниц и выборок.
export const publicCatalog = catalog.filter((direction) => direction.status === 'source')
  .map((direction) => ({
    ...direction,
    groups: direction.groups.map((group) => ({
      ...group,
      services: group.services.filter((service) => service.status === 'source'
        && service.variants.every((variant) => variant.price.kind !== 'unspecified')),
    })).filter((group) => group.services.length > 0),
  })).filter((direction) => direction.groups.length > 0);
unique(publicCatalog.map((direction) => direction.slug), 'маршруты');
for (const direction of publicCatalog) {
  if (!direction.summary || !direction.description || !direction.metaDescription
    || !direction.sources.every((source) => sources.has(source))) {
    throw new Error(`Нет описания или источника направления: ${direction.id}`);
  }
}
export type PublicDirection = (typeof publicCatalog)[number];
export const directionHref = (direction: Pick<PublicDirection, 'slug'>) => siteHref(`/uslugi/${direction.slug}/`);

// Главная хранит ссылки на услуги, а не независимые копии их цен.
export const priceSamples = [
  ['hair', 'women', 'women-cut'],
  ['face', 'cleansing', 'manual'],
  ['pedicure', 'aesthetic', 'machine'],
].map(([directionId, groupId, serviceId]) => {
  const direction = publicCatalog.find((direction) => direction.id === directionId);
  const service = direction?.groups.find((group) => group.id === groupId)?.services.find((service) => service.id === serviceId);
  if (!direction || !service) throw new Error(`Недоступный образец прайса: ${directionId}/${serviceId}`);
  return { direction, groupId, service };
});
