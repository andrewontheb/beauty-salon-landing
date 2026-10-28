import { siteConfig } from '../../config/site.mjs';
import { siteHref } from './urls';

export const isLive = siteConfig.live;
export const absoluteHref = (path: `/${string}`) => new URL(siteHref(path), siteConfig.site).href;
