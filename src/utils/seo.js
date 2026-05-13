import { BASE_URL, getLocalizedPath } from '../data/siteContent';

const OG_IMAGE = `${BASE_URL}/logo513.png`;

export const createCanonicalUrl = (baseUrl, pathname) => {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  const path = pathname || '/';
  const normalizedPath = path === '/' ? '/' : `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`;

  return `${cleanBaseUrl}${normalizedPath}`;
};

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  return element;
};

const upsertLink = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  return element;
};

export const applyPageSeo = ({ locale, pageKey, pathname, seo }) => {
  const canonicalUrl = createCanonicalUrl(BASE_URL, pathname);

  document.documentElement.lang = locale;
  document.title = seo.title;

  upsertMeta('meta[name="description"]', { name: 'description', content: seo.description });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description });
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: OG_IMAGE });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title });
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description });
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: OG_IMAGE });

  upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });
  upsertLink('link[rel="alternate"][hreflang="ru"]', {
    rel: 'alternate',
    hreflang: 'ru',
    href: createCanonicalUrl(BASE_URL, getLocalizedPath(pageKey, 'ru')),
  });
  upsertLink('link[rel="alternate"][hreflang="en"]', {
    rel: 'alternate',
    hreflang: 'en',
    href: createCanonicalUrl(BASE_URL, getLocalizedPath(pageKey, 'en')),
  });
  upsertLink('link[rel="alternate"][hreflang="x-default"]', {
    rel: 'alternate',
    hreflang: 'x-default',
    href: createCanonicalUrl(BASE_URL, getLocalizedPath(pageKey, 'ru')),
  });
};
