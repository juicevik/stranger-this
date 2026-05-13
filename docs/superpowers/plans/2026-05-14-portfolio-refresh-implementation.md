# Portfolio Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the existing portfolio site into a polished bilingual business-card portfolio with subtle liquid glass styling, separate About/Portfolio/Privacy pages, comprehensive SEO positioning, and fixed technical SEO files.

**Architecture:** Keep Create React App and React Router. Move localized copy, routes, SEO metadata, menu labels, and portfolio project data into a shared content module; render pages from that data; use a small SEO utility to update document metadata for SPA routes. Keep the homepage one-screen only and put detailed SEO/service content on the separate About page.

**Tech Stack:** React 18, React Router 6, Create React App/react-scripts, CSS modules via existing global CSS files, Jest + React Testing Library, static assets in `public/`.

---

## File Structure

- Create `src/data/siteContent.js`: one source of truth for localized routes, homepage copy, menu links, About content, privacy content, portfolio projects, and page SEO metadata.
- Create `src/data/siteContent.test.js`: verifies the content contract, including English/Russian routes, WorkerWP Store, Python, and comprehensive SEO wording.
- Create `src/utils/seo.js`: DOM helper for title, meta description, Open Graph/Twitter tags, canonical, and hreflang alternates.
- Create `src/utils/seo.test.js`: jsdom tests for metadata insertion/update behavior.
- Create `src/components/Home.jsx`: one-screen homepage component, no content blocks below the hero.
- Create `src/components/MenuSpoiler.jsx`: extracted menu button and side panel, localized by route.
- Create `src/components/About.jsx`: separate localized About page with skills, services, and contact CTA.
- Modify `src/components/PrivacyPolicy.jsx`: localize privacy content for Russian and English routes.
- Modify `src/components/Portfolio.jsx`: use shared portfolio data, remove duplicates, add WorkerWP Store, improve loop controls, add localized card text, and fix WebGL cleanup/fallback.
- Modify `src/App.js`: wire routes, locale detection, shared layout, SEO updates, and page components.
- Modify `src/styles/App.css`: subtle liquid glass homepage/menu/about/privacy styling, mobile and reduced-motion improvements.
- Modify `src/styles/Portfolio.css`: glass carousel cards and controls, mobile-safe layout.
- Modify `public/index.html`: static SEO fallback metadata, language, Open Graph/Twitter image URLs, and manifest cleanup if needed.
- Modify `public/robots.txt`: valid crawl rules and sitemap URL.
- Modify `public/sitemap.xml`: all Russian and English public routes with correct URLs.
- Add `public/workerwp-store-preview.jpg`: screenshot preview for WorkerWP Store if it is not already present.
- Modify or create `.gitignore`: ignore generated local artifacts such as `node_modules/`, `build/`, `.superpowers/`, and `.DS_Store`.

---

## Task 1: Git Hygiene And Generated Artifacts

**Files:**
- Create or modify: `.gitignore`
- Verify only: `.DS_Store`, `.superpowers/`, `build/`, `node_modules/`

- [ ] **Step 1: Inspect current untracked generated files**

Run:

```bash
git status --short
```

Expected: generated local files may appear as untracked, including `.DS_Store`, `.superpowers/`, `build/`, and `node_modules/`.

- [ ] **Step 2: Add ignore rules**

Create or update `.gitignore` with this content while preserving any existing project-specific entries:

```gitignore
# dependencies
/node_modules/

# production build
/build/

# local Codex/Superpowers artifacts
/.superpowers/

# macOS
.DS_Store

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

- [ ] **Step 3: Verify generated files are ignored**

Run:

```bash
git status --short
```

Expected: `.DS_Store`, `.superpowers/`, `build/`, and `node_modules/` no longer appear as untracked. Only `.gitignore` should appear for this task.

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore generated local artifacts"
```

---

## Task 2: Localized Content Contract

**Files:**
- Create: `src/data/siteContent.js`
- Create: `src/data/siteContent.test.js`

- [ ] **Step 1: Write the failing content contract tests**

Create `src/data/siteContent.test.js`:

```javascript
import {
  CONTACT_URL,
  BASE_URL,
  getLocaleFromPath,
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

  test('homepage copy includes Python and comprehensive SEO', () => {
    expect(localizedContent.ru.home.description).toContain('Python');
    expect(localizedContent.ru.home.description).toContain('комплексное SEO');
    expect(localizedContent.en.home.description).toContain('Python');
    expect(localizedContent.en.home.description).toContain('comprehensive SEO');
  });

  test('portfolio contains each project once including WorkerWP Store', () => {
    const titles = portfolioProjects.map((project) => project.title);
    expect(titles).toEqual(['Rodina', 'Geometriya', 'Kalyakin Desktop', 'WorkerWP Store']);
    expect(new Set(titles).size).toBe(titles.length);
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
```

- [ ] **Step 2: Run the content tests to verify they fail**

Run:

```bash
npm test -- --watchAll=false src/data/siteContent.test.js
```

Expected: FAIL because `src/data/siteContent.js` does not exist.

- [ ] **Step 3: Implement shared localized content**

Create `src/data/siteContent.js`:

```javascript
export const BASE_URL = 'https://kalyakin.github.io';
export const CONTACT_URL = 'tg://resolve?domain=kalyakinviktor';
export const VK_URL = 'https://vk.com/1kalyakin';

export const routePaths = {
  ru: {
    home: '/',
    about: '/about',
    portfolio: '/portfolio',
    privacy: '/privacy-policy',
  },
  en: {
    home: '/en',
    about: '/en/about',
    portfolio: '/en/portfolio',
    privacy: '/en/privacy-policy',
  },
};

export const getLocaleFromPath = (pathname = '/') => (
  pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ru'
);

export const getPageKeyFromPath = (pathname = '/') => {
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  const routes = {
    '/': 'home',
    '/about': 'about',
    '/portfolio': 'portfolio',
    '/privacy-policy': 'privacy',
    '/en': 'home',
    '/en/about': 'about',
    '/en/portfolio': 'portfolio',
    '/en/privacy-policy': 'privacy',
  };
  return routes[cleanPath] || 'home';
};

export const getLocalizedPath = (pageKey, locale) => routePaths[locale][pageKey] || routePaths[locale].home;

export const menuLinks = {
  ru: [
    { label: 'Главная', href: routePaths.ru.home, internal: true },
    { label: 'Обо мне', href: routePaths.ru.about, internal: true },
    { label: 'Мои работы', href: routePaths.ru.portfolio, internal: true },
    { label: 'Связаться', href: CONTACT_URL, external: true },
    { label: 'English', href: routePaths.en.home, internal: true },
    { label: 'Политика конфиденциальности', href: routePaths.ru.privacy, internal: true },
  ],
  en: [
    { label: 'Home', href: routePaths.en.home, internal: true },
    { label: 'About', href: routePaths.en.about, internal: true },
    { label: 'Portfolio', href: routePaths.en.portfolio, internal: true },
    { label: 'Contact', href: CONTACT_URL, external: true },
    { label: 'Русский', href: routePaths.ru.home, internal: true },
    { label: 'Privacy Policy', href: routePaths.en.privacy, internal: true },
  ],
};

export const localizedContent = {
  ru: {
    home: {
      name: 'VIKTOR KALYAKIN',
      role: 'WEBMASTER',
      description: 'Веб-разработчик, Python-разработчик и специалист по автоматизации. React, Node.js, Python, HTML/CSS, комплексное SEO, парсинг и веб-интеграции.',
      contactLabel: 'Связаться',
      portfolioLabel: 'Портфолио',
    },
    about: {
      title: 'Обо мне',
      intro: 'Я разрабатываю быстрые и аккуратные сайты-визитки, лендинги, портфолио и небольшие веб-инструменты, совмещая frontend-разработку, Python-автоматизацию и комплексное SEO.',
      skillsTitle: 'Навыки',
      skills: ['Python', 'React', 'Node.js', 'HTML/CSS', 'комплексное SEO', 'парсинг', 'автоматизация', 'веб-интеграции', 'WordPress'],
      servicesTitle: 'Услуги',
      services: [
        'Комплексное SEO: аудит, техническая оптимизация, внутренняя on-page оптимизация и сопровождение.',
        'Сайты-визитки, портфолио, лендинги и страницы каталогов.',
        'Python-скрипты для автоматизации, парсинга и обработки данных.',
        'Подготовка сайта к публикации: адаптивность, базовая производительность, метаданные и индексация.',
      ],
      approachTitle: 'Подход',
      approach: 'Работаю практично: сначала структура и смысл, затем чистая верстка, адаптивность, скорость загрузки и SEO-состояние проекта.',
      contactLabel: 'Обсудить проект',
    },
    portfolio: {
      title: 'мои работы',
      openLabel: 'Открыть проект',
      previousLabel: 'Предыдущий проект',
      nextLabel: 'Следующий проект',
      fallback: 'Анимация фона недоступна, но портфолио работает.',
    },
    privacy: {
      title: 'Политика конфиденциальности',
      updated: 'Дата обновления: 2026-05-14',
      contact: 'Если у вас есть вопросы по обработке данных, свяжитесь со мной: kalyakin@vk.com',
    },
  },
  en: {
    home: {
      name: 'VIKTOR KALYAKIN',
      role: 'WEBMASTER',
      description: 'Web developer, Python developer, and automation specialist. React, Node.js, Python, HTML/CSS, comprehensive SEO, scraping, and web integrations.',
      contactLabel: 'Contact',
      portfolioLabel: 'Portfolio',
    },
    about: {
      title: 'About',
      intro: 'I build fast, practical portfolio sites, landing pages, business-card websites, and small web tools by combining frontend development, Python automation, and comprehensive SEO.',
      skillsTitle: 'Skills',
      skills: ['Python', 'React', 'Node.js', 'HTML/CSS', 'comprehensive SEO', 'scraping', 'automation', 'web integrations', 'WordPress'],
      servicesTitle: 'Services',
      services: [
        'Comprehensive SEO: audits, technical optimization, on-page optimization, and ongoing maintenance.',
        'Business-card websites, portfolio sites, landing pages, and catalog/store pages.',
        'Python scripts for automation, scraping, and data processing.',
        'Publishing readiness: responsive layout, baseline performance, metadata, and indexability.',
      ],
      approachTitle: 'Approach',
      approach: 'I work pragmatically: structure and message first, then clean responsive layout, loading speed, and long-term SEO health.',
      contactLabel: 'Discuss a project',
    },
    portfolio: {
      title: 'portfolio',
      openLabel: 'Open project',
      previousLabel: 'Previous project',
      nextLabel: 'Next project',
      fallback: 'Background animation is unavailable, but the portfolio still works.',
    },
    privacy: {
      title: 'Privacy Policy',
      updated: 'Updated: 2026-05-14',
      contact: 'If you have questions about data processing, contact me: kalyakin@vk.com',
    },
  },
};

export const portfolioProjects = [
  {
    title: 'Rodina',
    url: 'https://rodina.vercel.app/',
    preview: '/rodina-preview.jpg',
    alt: 'Rodina project preview',
    description: {
      ru: 'Веб-проект с адаптивной подачей и визуальным акцентом.',
      en: 'A responsive web project with a strong visual presentation.',
    },
  },
  {
    title: 'Geometriya',
    url: 'https://geometriya.vercel.app/',
    preview: '/geometriya-preview.jpg',
    alt: 'Geometriya project preview',
    description: {
      ru: 'Сайт с геометричной визуальной системой и чистой структурой.',
      en: 'A website with a geometric visual system and clean structure.',
    },
  },
  {
    title: 'Kalyakin Desktop',
    url: 'https://kalyakin-desktop.vercel.app/',
    preview: '/kalyakin-desktop-preview.jpg',
    alt: 'Kalyakin Desktop project preview',
    description: {
      ru: 'Интерактивная desktop-inspired страница с экспериментальным интерфейсом.',
      en: 'An interactive desktop-inspired page with an experimental interface.',
    },
  },
  {
    title: 'WorkerWP Store',
    url: 'https://workerwp-store.vercel.app',
    preview: '/workerwp-store-preview.jpg',
    alt: 'WorkerWP Store project preview',
    description: {
      ru: 'Витрина/магазин с фокусом на структуру, карточки и конверсионную подачу.',
      en: 'A storefront project focused on structure, product cards, and conversion-oriented presentation.',
    },
  },
];

export const pageSeo = {
  ru: {
    home: {
      title: 'Viktor Kalyakin — веб-разработка, Python и комплексное SEO',
      description: 'Виктор Калякин: веб-разработка, Python-автоматизация, React, Node.js, комплексное SEO, парсинг и веб-интеграции.',
    },
    about: {
      title: 'Обо мне — Viktor Kalyakin',
      description: 'Навыки, услуги и подход Виктора Калякина: сайты-визитки, лендинги, Python-автоматизация, парсинг и комплексное SEO.',
    },
    portfolio: {
      title: 'Портфолио — Viktor Kalyakin',
      description: 'Портфолио Виктора Калякина: Rodina, Geometriya, Kalyakin Desktop, WorkerWP Store и другие веб-проекты.',
    },
    privacy: {
      title: 'Политика конфиденциальности — Viktor Kalyakin',
      description: 'Политика конфиденциальности сайта Виктора Калякина, использование аналитики и обработка технических данных.',
    },
  },
  en: {
    home: {
      title: 'Viktor Kalyakin — web development, Python and comprehensive SEO',
      description: 'Viktor Kalyakin: web development, Python automation, React, Node.js, comprehensive SEO, scraping, and web integrations.',
    },
    about: {
      title: 'About — Viktor Kalyakin',
      description: 'Skills, services, and working approach: business-card websites, landing pages, Python automation, scraping, and comprehensive SEO.',
    },
    portfolio: {
      title: 'Portfolio — Viktor Kalyakin',
      description: 'Viktor Kalyakin portfolio: Rodina, Geometriya, Kalyakin Desktop, WorkerWP Store, and other web projects.',
    },
    privacy: {
      title: 'Privacy Policy — Viktor Kalyakin',
      description: 'Privacy policy for Viktor Kalyakin website, analytics usage, and technical data processing.',
    },
  },
};
```

- [ ] **Step 4: Run content tests**

Run:

```bash
npm test -- --watchAll=false src/data/siteContent.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/siteContent.js src/data/siteContent.test.js
git commit -m "feat: add localized site content"
```

---

## Task 3: Route-Aware SEO Utilities

**Files:**
- Create: `src/utils/seo.js`
- Create: `src/utils/seo.test.js`

- [ ] **Step 1: Write failing SEO utility tests**

Create `src/utils/seo.test.js`:

```javascript
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
```

- [ ] **Step 2: Run SEO tests to verify they fail**

Run:

```bash
npm test -- --watchAll=false src/utils/seo.test.js
```

Expected: FAIL because `src/utils/seo.js` does not exist.

- [ ] **Step 3: Implement SEO utility**

Create `src/utils/seo.js`:

```javascript
import { BASE_URL, getLocalizedPath } from '../data/siteContent';

const OG_IMAGE = `${BASE_URL}/logo513.png`;

export const createCanonicalUrl = (baseUrl, pathname) => {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  return `${baseUrl}${normalizedPath}`;
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
```

- [ ] **Step 4: Run SEO tests**

Run:

```bash
npm test -- --watchAll=false src/utils/seo.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/seo.js src/utils/seo.test.js
git commit -m "feat: add route aware seo helpers"
```

---

## Task 4: App Routing, Menu, Home, And About Pages

**Files:**
- Create: `src/components/Home.jsx`
- Create: `src/components/MenuSpoiler.jsx`
- Create: `src/components/About.jsx`
- Create: `src/App.test.js`
- Modify: `src/App.js`

- [ ] **Step 1: Write route and content tests**

Create `src/App.test.js`:

```javascript
import { render, screen } from '@testing-library/react';
import App from './App';

const renderAt = (path) => {
  window.history.pushState({}, '', path);
  return render(<App />);
};

describe('App routing', () => {
  test('renders Russian homepage without extra section blocks', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { name: /VIKTOR KALYAKIN/i })).toBeInTheDocument();
    expect(screen.getByText(/комплексное SEO/i)).toBeInTheDocument();
    expect(screen.getByText(/Python/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /открыть меню/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Услуги/i })).not.toBeInTheDocument();
  });

  test('renders English homepage', () => {
    renderAt('/en');
    expect(screen.getByText(/comprehensive SEO/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contact/i })).toBeInTheDocument();
  });

  test('renders Russian about page as a separate page', () => {
    renderAt('/about');
    expect(screen.getByRole('heading', { name: 'Обо мне' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Услуги' })).toBeInTheDocument();
    expect(screen.getByText(/Комплексное SEO/i)).toBeInTheDocument();
  });

  test('renders English about page as a separate page', () => {
    renderAt('/en/about');
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument();
    expect(screen.getByText(/Comprehensive SEO/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run route tests to verify they fail**

Run:

```bash
npm test -- --watchAll=false src/App.test.js
```

Expected: FAIL because `/about`, `/en`, and localized components are not implemented yet.

- [ ] **Step 3: Create `Home.jsx`**

Create `src/components/Home.jsx`:

```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_URL, localizedContent, routePaths } from '../data/siteContent';

const Home = ({ locale, isVisible }) => {
  const content = localizedContent[locale].home;
  const portfolioPath = routePaths[locale].portfolio;

  return (
    <main className={`content home-content ${isVisible ? 'menu-open' : ''}`}>
      <section className="header" aria-label={locale === 'ru' ? 'Главная визитка' : 'Homepage business card'}>
        <h1>{content.name}</h1>
        <h2>{content.role}</h2>
        <p>{content.description}</p>
      </section>
      <div className="home-actions" aria-label={locale === 'ru' ? 'Основные действия' : 'Primary actions'}>
        <a className="contact-button" href={CONTACT_URL} target="_blank" rel="noopener noreferrer">
          {content.contactLabel}
        </a>
        <Link className="secondary-button" to={portfolioPath}>
          {content.portfolioLabel}
        </Link>
      </div>
    </main>
  );
};

export default Home;
```

- [ ] **Step 4: Create `MenuSpoiler.jsx`**

Create `src/components/MenuSpoiler.jsx`:

```javascript
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { menuLinks } from '../data/siteContent';

const MenuSpoiler = ({ locale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const labels = {
    ru: { open: 'Открыть меню', close: 'Закрыть меню' },
    en: { open: 'Open menu', close: 'Close menu' },
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        className={`spoiler-btn ${isOpen ? 'active' : ''}`}
        type="button"
        aria-label={isOpen ? labels[locale].close : labels[locale].open}
        aria-expanded={isOpen}
        aria-controls="site-menu"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>
      <nav id="site-menu" className={`context-menu ${isOpen ? 'open' : ''}`} aria-label="Site navigation">
        <div className="menu-content">
          {menuLinks[locale].map((link) => (
            link.internal ? (
              <Link key={link.label} to={link.href} onClick={closeMenu}>
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                {link.label}
              </a>
            )
          ))}
        </div>
      </nav>
    </>
  );
};

export default MenuSpoiler;
```

- [ ] **Step 5: Create `About.jsx`**

Create `src/components/About.jsx`:

```javascript
import React from 'react';
import { CONTACT_URL, localizedContent } from '../data/siteContent';

const About = ({ locale }) => {
  const content = localizedContent[locale].about;

  return (
    <main className="page-shell about-page">
      <section className="glass-page-panel">
        <p className="page-kicker">{locale === 'ru' ? 'Визитка и услуги' : 'Profile and services'}</p>
        <h1>{content.title}</h1>
        <p className="lead-text">{content.intro}</p>
      </section>

      <section className="glass-page-grid" aria-label={content.skillsTitle}>
        <div className="glass-card">
          <h2>{content.skillsTitle}</h2>
          <ul className="tag-list">
            {content.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>

        <div className="glass-card">
          <h2>{content.servicesTitle}</h2>
          <ul className="service-list">
            {content.services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="glass-page-panel">
        <h2>{content.approachTitle}</h2>
        <p>{content.approach}</p>
        <a className="contact-button inline-cta" href={CONTACT_URL} target="_blank" rel="noopener noreferrer">
          {content.contactLabel}
        </a>
      </section>
    </main>
  );
};

export default About;
```

- [ ] **Step 6: Modify `App.js`**

Replace `src/App.js` with:

```javascript
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './styles/App.css';
import About from './components/About';
import Home from './components/Home';
import MenuSpoiler from './components/MenuSpoiler';
import Portfolio from './components/Portfolio';
import PrivacyPolicy from './components/PrivacyPolicy';
import { getLocaleFromPath, getPageKeyFromPath, pageSeo } from './data/siteContent';
import { applyPageSeo } from './utils/seo';

const BackgroundAnimation = () => {
  const location = useLocation();
  const isPortfolio = location.pathname === '/portfolio' || location.pathname === '/en/portfolio';

  if (isPortfolio) {
    return null;
  }

  return (
    <div className="background-effects" aria-hidden="true">
      <div className="floating-container">
        <div className="floating-element" />
        <div className="floating-element" />
        <div className="floating-element" />
        <div className="glass-light" />
      </div>
    </div>
  );
};

const AppShell = () => {
  const location = useLocation();
  const [isHomeVisible, setIsHomeVisible] = useState(false);
  const locale = getLocaleFromPath(location.pathname);
  const pageKey = getPageKeyFromPath(location.pathname);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsHomeVisible(true), 300);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    applyPageSeo({
      locale,
      pageKey,
      pathname: location.pathname,
      seo: pageSeo[locale][pageKey],
    });
  }, [locale, location.pathname, pageKey]);

  return (
    <div className={`app app-${pageKey}`}>
      <BackgroundAnimation />
      <MenuSpoiler locale={locale} />
      <Routes>
        <Route path="/" element={<Home locale="ru" isVisible={isHomeVisible} />} />
        <Route path="/about" element={<About locale="ru" />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy locale="ru" />} />
        <Route path="/portfolio" element={<Portfolio locale="ru" />} />
        <Route path="/en" element={<Home locale="en" isVisible={isHomeVisible} />} />
        <Route path="/en/about" element={<About locale="en" />} />
        <Route path="/en/privacy-policy" element={<PrivacyPolicy locale="en" />} />
        <Route path="/en/portfolio" element={<Portfolio locale="en" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <h5 className="copyright">© 2026 VIKTOR KALYAKIN. All rights reserved</h5>
      <Analytics />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
```

- [ ] **Step 7: Run route tests**

Run:

```bash
npm test -- --watchAll=false src/App.test.js
```

Expected: PASS.

- [ ] **Step 8: Run all unit tests created so far**

Run:

```bash
npm test -- --watchAll=false
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/App.js src/App.test.js src/components/Home.jsx src/components/MenuSpoiler.jsx src/components/About.jsx
git commit -m "feat: add bilingual routes and about page"
```

---

## Task 5: Localized Privacy Policy

**Files:**
- Modify: `src/components/PrivacyPolicy.jsx`
- Create: `src/components/PrivacyPolicy.test.jsx`

- [ ] **Step 1: Write failing privacy policy tests**

Create `src/components/PrivacyPolicy.test.jsx`:

```javascript
import { render, screen } from '@testing-library/react';
import PrivacyPolicy from './PrivacyPolicy';

describe('PrivacyPolicy', () => {
  test('renders Russian privacy policy', () => {
    render(<PrivacyPolicy locale="ru" />);
    expect(screen.getByRole('heading', { name: 'Политика конфиденциальности' })).toBeInTheDocument();
    expect(screen.getByText(/Яндекс Метрика/i)).toBeInTheDocument();
    expect(screen.getByText(/Vercel Analytics/i)).toBeInTheDocument();
  });

  test('renders English privacy policy', () => {
    render(<PrivacyPolicy locale="en" />);
    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument();
    expect(screen.getByText(/Yandex Metrika/i)).toBeInTheDocument();
    expect(screen.getByText(/Vercel Analytics/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run privacy tests to verify they fail**

Run:

```bash
npm test -- --watchAll=false src/components/PrivacyPolicy.test.jsx
```

Expected: FAIL because the component does not accept `locale` or render English text.

- [ ] **Step 3: Implement localized privacy policy**

Replace `src/components/PrivacyPolicy.jsx` with:

```javascript
import React from 'react';
import { localizedContent } from '../data/siteContent';

const policyText = {
  ru: [
    {
      title: '1. Общие положения',
      body: 'Настоящая политика описывает, как сайт VIKTOR KALYAKIN обрабатывает технические данные посетителей сайта.',
    },
    {
      title: '2. Аналитика',
      body: 'На сайте могут использоваться Яндекс Метрика и Vercel Analytics для анализа посещаемости, источников переходов, устройств, браузеров и качества работы страниц.',
    },
    {
      title: '3. Cookies',
      body: 'Сайт может использовать cookies и аналогичные технологии аналитики. Пользователь может ограничить cookies в настройках браузера.',
    },
    {
      title: '4. Передача данных',
      body: 'Данные не продаются третьим лицам. Технические данные могут обрабатываться сервисами аналитики в рамках их пользовательских соглашений.',
    },
  ],
  en: [
    {
      title: '1. General',
      body: 'This policy explains how the VIKTOR KALYAKIN website processes technical visitor data.',
    },
    {
      title: '2. Analytics',
      body: 'The website may use Yandex Metrika and Vercel Analytics to understand traffic, referral sources, devices, browsers, and page quality.',
    },
    {
      title: '3. Cookies',
      body: 'The website may use cookies and similar analytics technologies. Visitors can restrict cookies in their browser settings.',
    },
    {
      title: '4. Data sharing',
      body: 'Data is not sold to third parties. Technical data may be processed by analytics services under their own terms.',
    },
  ],
};

const PrivacyPolicy = ({ locale = 'ru' }) => {
  const content = localizedContent[locale].privacy;

  return (
    <main className="page-shell privacy-policy">
      <section className="glass-page-panel">
        <h1>{content.title}</h1>
        <p>{content.updated}</p>
        {policyText[locale].map((section) => (
          <section key={section.title} className="policy-section">
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        <p>{content.contact}</p>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
```

- [ ] **Step 4: Run privacy tests**

Run:

```bash
npm test -- --watchAll=false src/components/PrivacyPolicy.test.jsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/PrivacyPolicy.jsx src/components/PrivacyPolicy.test.jsx
git commit -m "feat: localize privacy policy"
```

---

## Task 6: Portfolio Data, Carousel, WebGL Fallback, And WorkerWP Preview

**Files:**
- Modify: `src/components/Portfolio.jsx`
- Create: `src/components/Portfolio.test.jsx`
- Add: `public/workerwp-store-preview.jpg`

- [ ] **Step 1: Capture WorkerWP Store preview if missing**

If `public/workerwp-store-preview.jpg` does not exist, run the local browser/screenshot workflow against `https://workerwp-store.vercel.app` and save a 16:9 JPG preview to:

```text
public/workerwp-store-preview.jpg
```

Expected: preview image exists and is visually representative of the live site.

- [ ] **Step 2: Write failing portfolio tests**

Create `src/components/Portfolio.test.jsx`:

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Portfolio from './Portfolio';

HTMLCanvasElement.prototype.getContext = jest.fn(() => null);

describe('Portfolio', () => {
  test('renders localized project cards without duplicates', () => {
    render(<Portfolio locale="ru" />);
    expect(screen.getByRole('heading', { name: 'мои работы' })).toBeInTheDocument();
    expect(screen.getAllByText('WorkerWP Store')).toHaveLength(1);
    expect(screen.getByText(/Витрина\/магазин/i)).toBeInTheDocument();
  });

  test('renders English labels', () => {
    render(<Portfolio locale="en" />);
    expect(screen.getByRole('heading', { name: 'portfolio' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous project' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next project' })).toBeInTheDocument();
  });

  test('carousel loops backward and forward', async () => {
    const user = userEvent.setup();
    render(<Portfolio locale="en" />);
    await user.click(screen.getByRole('button', { name: 'Previous project' }));
    expect(screen.getByText('WorkerWP Store')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next project' }));
    expect(screen.getByText('Rodina')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run portfolio tests to verify they fail**

Run:

```bash
npm test -- --watchAll=false src/components/Portfolio.test.jsx
```

Expected: FAIL because current Portfolio has duplicate projects, no locale prop, no descriptions, no accessible button labels, and no fallback.

- [ ] **Step 4: Refactor `Portfolio.jsx`**

Implement these specific changes in `src/components/Portfolio.jsx`:

```javascript
// At the top, add:
import { localizedContent, portfolioProjects } from '../data/siteContent';

// In Renderer constructor, guard WebGL2:
this.gl = canvas.getContext('webgl2');
if (!this.gl) {
  throw new Error('WebGL2 is not available');
}

// Change component signature:
const Portfolio = ({ locale = 'ru' }) => {
  const content = localizedContent[locale].portfolio;
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hasCanvasFallback, setHasCanvasFallback] = useState(false);

  const scrollCarousel = (direction) => {
    setCurrentIndex((prevIndex) => {
      const totalItems = portfolioProjects.length;
      return direction === 'next'
        ? (prevIndex + 1) % totalItems
        : (prevIndex - 1 + totalItems) % totalItems;
    });
  };

  const getVisibleSites = () => {
    if (isMobile) {
      return [{ ...portfolioProjects[currentIndex], position: 0 }];
    }

    return [-1, 0, 1].map((position) => {
      const index = (currentIndex + position + portfolioProjects.length) % portfolioProjects.length;
      return { ...portfolioProjects[index], position };
    });
  };
```

Also replace `window.onresize = resize` with listener-based cleanup:

```javascript
window.addEventListener('resize', resize);
resize();

const loop = (now) => {
  renderer.render(now);
  animationFrameRef.current = requestAnimationFrame(loop);
};
animationFrameRef.current = requestAnimationFrame(loop);

return () => {
  window.removeEventListener('resize', resize);
  if (animationFrameRef.current) {
    cancelAnimationFrame(animationFrameRef.current);
  }
};
```

Render cards with titles/descriptions:

```javascript
{getVisibleSites().map((site) => (
  <article
    key={`${site.title}-${site.position}`}
    className={`portfolio-card ${site.position === 0 ? 'center' : ''}`}
  >
    <a href={site.url} target="_blank" rel="noopener noreferrer" className="portfolio-card-link">
      <img src={site.preview} alt={site.alt} className="portfolio-preview fade-in" />
      <div className="portfolio-card-body">
        <h2>{site.title}</h2>
        <p>{site.description[locale]}</p>
        <span>{content.openLabel}</span>
      </div>
    </a>
  </article>
))}
```

Use accessible glass arrow buttons:

```javascript
<button
  className="carousel-arrow carousel-arrow-left"
  type="button"
  aria-label={content.previousLabel}
  onClick={() => scrollCarousel('prev')}
>
  <span aria-hidden="true">‹</span>
</button>
```

and:

```javascript
<button
  className="carousel-arrow carousel-arrow-right"
  type="button"
  aria-label={content.nextLabel}
  onClick={() => scrollCarousel('next')}
>
  <span aria-hidden="true">›</span>
</button>
```

When WebGL2 is unavailable, set fallback:

```javascript
try {
  const renderer = new Renderer(canvas, dpr);
  // existing setup...
} catch (error) {
  setHasCanvasFallback(true);
}
```

Render fallback text:

```javascript
{hasCanvasFallback && <p className="portfolio-fallback">{content.fallback}</p>}
```

- [ ] **Step 5: Run portfolio tests**

Run:

```bash
npm test -- --watchAll=false src/components/Portfolio.test.jsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/Portfolio.jsx src/components/Portfolio.test.jsx public/workerwp-store-preview.jpg
git commit -m "feat: refresh portfolio carousel"
```

---

## Task 7: Liquid Glass Styling And Mobile/Reduced Motion Polish

**Files:**
- Modify: `src/styles/App.css`
- Modify: `src/styles/Portfolio.css`

- [ ] **Step 1: Add app/page glass styles**

Update `src/styles/App.css` with these changes:

```css
:root {
  --cyan: #00bfff;
  --cyan-soft: rgba(0, 191, 255, 0.26);
  --text: #ffffff;
  --muted: #aeb8c2;
  --glass-bg: rgba(8, 14, 20, 0.62);
  --glass-border: rgba(255, 255, 255, 0.16);
  --glass-highlight: rgba(255, 255, 255, 0.24);
}

.app {
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}

.app-home {
  overflow: hidden;
}

.home-content {
  padding: 20px 20px 70px;
}

.home-actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.contact-button,
.secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 28px;
  border: 1px solid rgba(0, 191, 255, 0.46);
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,.04));
  color: var(--text);
  text-decoration: none;
  box-shadow: inset 0 1px 0 var(--glass-highlight), 0 18px 50px rgba(0, 191, 255, 0.12);
  backdrop-filter: blur(18px);
}

.secondary-button {
  color: var(--cyan);
}

.spoiler-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 18px;
  backdrop-filter: blur(18px);
}

.context-menu {
  background: rgba(0, 0, 0, 0.68);
  border-left: 1px solid var(--glass-border);
  box-shadow: -28px 0 80px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(24px);
}

.page-shell {
  position: relative;
  z-index: 2;
  width: min(1060px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 110px 0 82px;
}

.glass-page-panel,
.glass-card {
  border: 1px solid var(--glass-border);
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(255,255,255,.13), rgba(255,255,255,.045));
  box-shadow: inset 0 1px 0 var(--glass-highlight), 0 24px 80px rgba(0,0,0,.35);
  backdrop-filter: blur(22px);
}

.glass-page-panel {
  padding: clamp(24px, 5vw, 52px);
}

.glass-page-grid {
  display: grid;
  grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr);
  gap: 18px;
  margin: 18px 0;
}

.glass-card {
  padding: clamp(20px, 4vw, 34px);
}

.tag-list,
.service-list {
  padding-left: 0;
  list-style: none;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-list li {
  border: 1px solid rgba(0, 191, 255, .28);
  border-radius: 999px;
  padding: 8px 12px;
  color: #d9f7ff;
  background: rgba(0, 191, 255, .08);
}

.service-list li {
  margin: 0 0 12px;
  color: var(--muted);
}

.page-kicker {
  color: var(--cyan);
  text-transform: uppercase;
  letter-spacing: 0;
}

.lead-text {
  max-width: 760px;
  color: var(--muted);
  line-height: 1.7;
}

.policy-section h2 {
  font-size: 1.1rem;
  margin-top: 24px;
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid #7ee6ff;
  outline-offset: 4px;
}

@media (max-width: 760px) {
  .glass-page-grid {
    grid-template-columns: 1fr;
  }

  .page-shell {
    width: min(100% - 24px, 680px);
    padding-top: 92px;
  }

  .context-menu {
    width: min(100vw, 330px);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

Do not keep duplicate conflicting rules for `.contact-button`, `.spoiler-btn`, `.context-menu`, or `.app`; merge or remove older rules that conflict.

- [ ] **Step 2: Add portfolio glass styles**

Update `src/styles/Portfolio.css` with these class changes:

```css
.portfolio-card {
  width: 300px;
  min-height: 300px;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 22px;
  overflow: hidden;
  background: linear-gradient(145deg, rgba(255,255,255,.14), rgba(255,255,255,.045));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.24), 0 24px 70px rgba(0,0,0,.38);
  backdrop-filter: blur(20px);
  transition: transform .25s ease, border-color .25s ease, opacity .25s ease;
}

.portfolio-card.center {
  width: 390px;
  transform: translateY(-8px);
  border-color: rgba(0, 191, 255, .42);
}

.portfolio-card-link {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  color: inherit;
  text-decoration: none;
}

.portfolio-preview {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  background: #05080c;
}

.portfolio-card-body {
  padding: 16px;
  text-align: left;
}

.portfolio-card-body h2 {
  margin: 0 0 8px;
  color: #fff;
  font-size: 1.05rem;
}

.portfolio-card-body p {
  margin: 0 0 12px;
  color: rgba(255,255,255,.72);
  line-height: 1.5;
}

.portfolio-card-body span {
  color: #7ee6ff;
  font-weight: 700;
}

.carousel-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 50%;
  background: rgba(6, 12, 18, .62);
  color: #dff9ff;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.24), 0 14px 40px rgba(0,191,255,.16);
  backdrop-filter: blur(18px);
}

.carousel-arrow span {
  font-size: 2rem;
  line-height: 1;
  transform: translateY(-1px);
}

.portfolio-fallback {
  color: rgba(255,255,255,.72);
  font-size: .9rem;
}

@media screen and (max-width: 900px) {
  .carousel-wrapper {
    width: min(78vw, 390px);
  }

  .portfolio-card,
  .portfolio-card.center {
    width: min(78vw, 390px);
    transform: none;
  }
}
```

Remove old `.iframe-wrapper` styling or keep it unused only if no JSX references remain.

- [ ] **Step 3: Run tests and build**

Run:

```bash
npm test -- --watchAll=false
npm run build
```

Expected: tests PASS and production build compiles successfully.

- [ ] **Step 4: Commit**

```bash
git add src/styles/App.css src/styles/Portfolio.css
git commit -m "style: apply subtle liquid glass refresh"
```

---

## Task 8: Static SEO Files

**Files:**
- Modify: `public/index.html`
- Modify: `public/robots.txt`
- Modify: `public/sitemap.xml`

- [ ] **Step 1: Update `public/index.html` static fallback metadata**

In `public/index.html`, set:

```html
<html lang="ru">
```

Replace the default description and social metadata with:

```html
<meta
  name="description"
  content="Viktor Kalyakin: веб-разработка, Python-автоматизация, React, Node.js, комплексное SEO, парсинг и веб-интеграции."
/>
<link rel="canonical" href="https://kalyakin.github.io/" />
<link rel="alternate" hreflang="ru" href="https://kalyakin.github.io/" />
<link rel="alternate" hreflang="en" href="https://kalyakin.github.io/en" />
<link rel="alternate" hreflang="x-default" href="https://kalyakin.github.io/" />
<title>Viktor Kalyakin — веб-разработка, Python и комплексное SEO</title>
<meta property="og:title" content="Viktor Kalyakin — веб-разработка, Python и комплексное SEO" />
<meta property="og:description" content="Веб-разработка, Python-автоматизация, React, Node.js, комплексное SEO, парсинг и веб-интеграции." />
<meta property="og:image" content="https://kalyakin.github.io/logo513.png" />
<meta property="og:url" content="https://kalyakin.github.io/" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Viktor Kalyakin — веб-разработка, Python и комплексное SEO" />
<meta name="twitter:description" content="Веб-разработка, Python-автоматизация, React, Node.js, комплексное SEO, парсинг и веб-интеграции." />
<meta name="twitter:image" content="https://kalyakin.github.io/logo513.png" />
```

Keep the existing Yandex Metrika snippet unless the user later asks to remove analytics.

- [ ] **Step 2: Replace `robots.txt`**

Replace `public/robots.txt` with:

```txt
User-agent: *
Allow: /

Sitemap: https://kalyakin.github.io/sitemap.xml
```

- [ ] **Step 3: Replace `sitemap.xml`**

Replace `public/sitemap.xml` with:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://kalyakin.github.io/</loc>
    <lastmod>2026-05-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://kalyakin.github.io/about</loc>
    <lastmod>2026-05-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://kalyakin.github.io/portfolio</loc>
    <lastmod>2026-05-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://kalyakin.github.io/privacy-policy</loc>
    <lastmod>2026-05-14</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://kalyakin.github.io/en</loc>
    <lastmod>2026-05-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://kalyakin.github.io/en/about</loc>
    <lastmod>2026-05-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://kalyakin.github.io/en/portfolio</loc>
    <lastmod>2026-05-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://kalyakin.github.io/en/privacy-policy</loc>
    <lastmod>2026-05-14</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

- [ ] **Step 4: Validate static files by build**

Run:

```bash
npm run build
```

Expected: build succeeds and copies updated `robots.txt` and `sitemap.xml` into `build/`.

- [ ] **Step 5: Commit**

```bash
git add public/index.html public/robots.txt public/sitemap.xml
git commit -m "fix: update static seo metadata"
```

---

## Task 9: Browser Verification And Final Audit

**Files:**
- Modify if needed: files touched by earlier tasks after browser findings.

- [ ] **Step 1: Run full test and build suite**

Run:

```bash
npm test -- --watchAll=false
npm run build
npm audit --json
```

Expected:

- Tests PASS.
- Build succeeds.
- `npm audit --json` still reports CRA/react-scripts dependency warnings unless a safe non-breaking fix was identified; record the count in final notes.

- [ ] **Step 2: Start local dev server**

Run:

```bash
npm start
```

Expected: React dev server starts, usually at `http://localhost:3000`. Keep the session running for browser checks.

- [ ] **Step 3: Verify routes in browser**

Open each route:

```text
http://localhost:3000/
http://localhost:3000/about
http://localhost:3000/portfolio
http://localhost:3000/privacy-policy
http://localhost:3000/en
http://localhost:3000/en/about
http://localhost:3000/en/portfolio
http://localhost:3000/en/privacy-policy
```

Expected:

- Homepage is still one-screen only.
- Menu opens and links to separate pages.
- Russian and English content render on all pages.
- Portfolio has four unique projects and WorkerWP Store.
- Carousel loops both directions.
- Mobile width has no text overlap at 320px.
- Focus states are visible.
- No blank WebGL/canvas failure blocks the portfolio.

- [ ] **Step 4: Fix browser findings if any**

If a route fails, make the smallest scoped fix in the relevant file and rerun:

```bash
npm test -- --watchAll=false
npm run build
```

Expected: PASS.

- [ ] **Step 5: Commit verification fixes**

Only if Step 4 changed files:

```bash
git add src public
git commit -m "fix: address portfolio refresh verification findings"
```

- [ ] **Step 6: Final status check**

Run:

```bash
git status --short
git log --oneline -5
```

Expected: working tree is clean except intentionally ignored local generated files.

---

## Self-Review

Spec coverage:

- Homepage remains one-screen with updated copy: Task 4 and Task 7.
- Separate About page: Task 4.
- Full English routes: Task 2 and Task 4.
- Menu remains and links to separate pages: Task 4 and Task 7.
- Portfolio adds WorkerWP Store and removes duplicates: Task 2 and Task 6.
- Looping carousel and better arrows: Task 6 and Task 7.
- Subtle liquid glass styling: Task 7.
- Privacy policy localization: Task 5.
- Static SEO metadata, robots, sitemap, hreflang/canonical: Task 3 and Task 8.
- Mobile/accessibility/reduced motion: Task 4, Task 6, Task 7, Task 9.
- WebGL fallback: Task 6.
- Build/audit verification: Task 9.

Red-flag scan:

- No red-flag filler tokens or open-ended generic error-handling instructions remain.
- Every file creation task includes concrete code.
- Every verification task includes commands and expected outcomes.

Type consistency:

- Locale keys are consistently `ru` and `en`.
- Page keys are consistently `home`, `about`, `portfolio`, and `privacy`.
- Shared content exports are consistently imported from `src/data/siteContent.js`.
- SEO helper signature is consistently `applyPageSeo({ locale, pageKey, pathname, seo })`.
