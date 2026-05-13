import { applyPageSeo, createCanonicalUrl } from './seo';
import { BASE_URL, pageSeo } from '../data/siteContent';

describe('seo utilities', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.title = '';
    document.documentElement.lang = '';
  });

  test('creates canonical URLs without duplicate slashes', () => {
    expect(createCanonicalUrl(BASE_URL, '/')).toBe('https://kalyakin.github.io/');
    expect(createCanonicalUrl(BASE_URL, '/en/about')).toBe('https://kalyakin.github.io/en/about');
    expect(createCanonicalUrl(BASE_URL, '/en/about/')).toBe('https://kalyakin.github.io/en/about');
  });

  test('applies localized page metadata', () => {
    applyPageSeo({
      locale: 'ru',
      pageKey: 'home',
      pathname: '/',
      seo: pageSeo.ru.home,
    });

    expect(document.documentElement.lang).toBe('ru');
    expect(document.title).toBe(pageSeo.ru.home.title);
    expect(document.querySelector('meta[name="description"]').getAttribute('content')).toBe(pageSeo.ru.home.description);
    expect(document.querySelector('meta[property="og:title"]').getAttribute('content')).toBe(pageSeo.ru.home.title);
    expect(document.querySelector('meta[property="og:image"]').getAttribute('content')).toBe('https://kalyakin.github.io/logo513.png');
    expect(document.querySelector('meta[property="og:url"]').getAttribute('content')).toBe('https://kalyakin.github.io/');
    expect(document.querySelector('meta[name="twitter:title"]').getAttribute('content')).toBe(pageSeo.ru.home.title);
    expect(document.querySelector('meta[name="twitter:description"]').getAttribute('content')).toBe(pageSeo.ru.home.description);
    expect(document.querySelector('meta[name="twitter:image"]').getAttribute('content')).toBe('https://kalyakin.github.io/logo513.png');
    expect(document.querySelector('link[rel="canonical"]').getAttribute('href')).toBe('https://kalyakin.github.io/');
    expect(document.querySelector('link[rel="alternate"][hreflang="ru"]').getAttribute('href')).toBe('https://kalyakin.github.io/');
    expect(document.querySelector('link[rel="alternate"][hreflang="en"]').getAttribute('href')).toBe('https://kalyakin.github.io/en');
    expect(document.querySelector('link[rel="alternate"][hreflang="x-default"]').getAttribute('href')).toBe('https://kalyakin.github.io/');
  });

  test('updates existing tags instead of duplicating them', () => {
    applyPageSeo({
      locale: 'ru',
      pageKey: 'home',
      pathname: '/',
      seo: pageSeo.ru.home,
    });
    applyPageSeo({
      locale: 'en',
      pageKey: 'about',
      pathname: '/en/about',
      seo: pageSeo.en.about,
    });

    expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(document.querySelectorAll('meta[property="og:title"]')).toHaveLength(1);
    expect(document.querySelectorAll('meta[property="og:description"]')).toHaveLength(1);
    expect(document.querySelectorAll('meta[property="og:image"]')).toHaveLength(1);
    expect(document.querySelectorAll('meta[property="og:url"]')).toHaveLength(1);
    expect(document.querySelectorAll('meta[property="og:type"]')).toHaveLength(1);
    expect(document.querySelectorAll('meta[name="twitter:card"]')).toHaveLength(1);
    expect(document.querySelectorAll('meta[name="twitter:title"]')).toHaveLength(1);
    expect(document.querySelectorAll('meta[name="twitter:description"]')).toHaveLength(1);
    expect(document.querySelectorAll('meta[name="twitter:image"]')).toHaveLength(1);
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.querySelectorAll('link[rel="alternate"][hreflang="ru"]')).toHaveLength(1);
    expect(document.querySelectorAll('link[rel="alternate"][hreflang="en"]')).toHaveLength(1);
    expect(document.querySelectorAll('link[rel="alternate"][hreflang="x-default"]')).toHaveLength(1);
    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe(pageSeo.en.about.title);
  });
});
