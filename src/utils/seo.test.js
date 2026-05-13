import { applyPageSeo, createCanonicalUrl } from './seo';
import { BASE_URL, pageSeo } from '../data/siteContent';

describe('seo utilities', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.title = '';
  });

  test('creates canonical URLs without duplicate slashes', () => {
    expect(createCanonicalUrl(BASE_URL, '/')).toBe('https://kalyakin.github.io/');
    expect(createCanonicalUrl(BASE_URL, '/en/about')).toBe('https://kalyakin.github.io/en/about');
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
    expect(document.querySelector('link[rel="canonical"]').getAttribute('href')).toBe('https://kalyakin.github.io/');
    expect(document.querySelector('link[rel="alternate"][hreflang="en"]').getAttribute('href')).toBe('https://kalyakin.github.io/en');
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
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe(pageSeo.en.about.title);
  });
});
