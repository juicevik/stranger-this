import {
  CONTACT_URL,
  BASE_URL,
  getLocalizedPath,
  getLocaleFromPath,
  getPageKeyFromPath,
  localizedContent,
  pageSeo,
  portfolioProjects,
  routePaths,
} from './siteContent';

describe('siteContent', () => {
  test('defines production constants', () => {
    expect(BASE_URL).toBe('https://kalyakin.github.io');
    expect(CONTACT_URL).toBe('tg://resolve?domain=kalyakinviktor');
  });

  test('detects route locale from path', () => {
    expect(getLocaleFromPath('/')).toBe('ru');
    expect(getLocaleFromPath('/about')).toBe('ru');
    expect(getLocaleFromPath('/en')).toBe('en');
    expect(getLocaleFromPath('/en/portfolio')).toBe('en');
  });

  test('keeps route model as separate pages', () => {
    expect(routePaths.ru.home).toBe('/');
    expect(routePaths.ru.about).toBe('/about');
    expect(routePaths.ru.portfolio).toBe('/portfolio');
    expect(routePaths.ru.privacy).toBe('/privacy-policy');
    expect(routePaths.en.home).toBe('/en');
    expect(routePaths.en.about).toBe('/en/about');
    expect(routePaths.en.portfolio).toBe('/en/portfolio');
    expect(routePaths.en.privacy).toBe('/en/privacy-policy');
  });

  test('detects page key from localized route paths', () => {
    expect(getPageKeyFromPath('/portfolio/')).toBe('portfolio');
    expect(getPageKeyFromPath('/en/about')).toBe('about');
    expect(getPageKeyFromPath('/missing')).toBe('home');
  });

  test('returns localized paths with safe fallbacks', () => {
    expect(getLocalizedPath('portfolio', 'en')).toBe('/en/portfolio');
    expect(getLocalizedPath('missing', 'en')).toBe('/en');
    expect(getLocalizedPath('portfolio', 'unknown')).toBe('/');
    expect(getLocalizedPath('portfolio')).toBe('/');
  });

  test('homepage copy includes Python and comprehensive SEO', () => {
    expect(localizedContent.ru.home.description).toContain('Python');
    expect(localizedContent.ru.home.description).toContain('комплексное SEO');
    expect(localizedContent.en.home.description).toContain('Python');
    expect(localizedContent.en.home.description).toContain('comprehensive SEO');
  });

  test('portfolio contains each project once including WorkerWP Store', () => {
    const titles = portfolioProjects.map((project) => project.title);
    expect(titles).toEqual(['Rodina', 'Geometriya', 'Kalyakin Desktop', 'Stranger Things', 'WorkerWP Store']);
    expect(new Set(titles).size).toBe(titles.length);
    expect(portfolioProjects.find((project) => project.title === 'Stranger Things')).toMatchObject({
      url: 'https://stranger-this-kalyakin.vercel.app/',
      preview: '/stranger-this-preview.png',
      description: {
        ru: expect.stringContaining('Браузерная ретро-аркада'),
      },
    });
    expect(portfolioProjects.find((project) => project.title === 'WorkerWP Store')).toMatchObject({
      url: 'https://workerwp-store.vercel.app',
      preview: '/workerwp-store-preview.jpg',
    });
  });

  test('every page has localized SEO metadata', () => {
    for (const locale of ['ru', 'en']) {
      for (const page of ['home', 'about', 'portfolio', 'privacy']) {
        expect(pageSeo[locale][page].title).toBeTruthy();
        expect(pageSeo[locale][page].description.length).toBeGreaterThan(60);
      }
    }
  });
});
