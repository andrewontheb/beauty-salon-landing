// BASE_URL учитывает base и trailingSlash из astro.config.mjs.
export const siteHref = (path: `/${string}`) => `${import.meta.env.BASE_URL}${path.slice(1)}`;
