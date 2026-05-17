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

const normalizePath = (pathname = '/') => pathname.replace(/\/$/, '') || '/';

const routePathToPageKey = Object.values(routePaths).reduce((routesByPath, localeRoutes) => {
  Object.entries(localeRoutes).forEach(([pageKey, path]) => {
    routesByPath[path] = pageKey;
  });
  return routesByPath;
}, {});

export const getPageKeyFromPath = (pathname = '/') => {
  const cleanPath = normalizePath(pathname);
  return routePathToPageKey[cleanPath] || 'home';
};

export const getLocalizedPath = (pageKey, locale) => {
  const localeRoutes = routePaths[locale];
  if (!localeRoutes) {
    return routePaths.ru.home;
  }
  return localeRoutes[pageKey] || localeRoutes.home;
};

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
    title: 'Stranger This',
    url: 'https://stranger-this-kalyakin.vercel.app/',
    preview: '/stranger-this-preview.png',
    alt: 'Stranger This browser game preview',
    description: {
      ru: 'Браузерная ретро-игра в атмосфере темной комнаты 80-х с CRT-экраном, монстрами и мобильным управлением.',
      en: 'A browser retro game in a dark 80s room with a CRT screen, monsters, and mobile controls.',
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
      title: 'The Final Fate - браузерная ретро-игра в комнате 80-х',
      description: 'Атмосферная стартовая сцена с CRT-компьютером и встроенной HTML5-игрой The Final Fate внутри экрана старого ПК.',
    },
    about: {
      title: 'Обо мне - Viktor Kalyakin',
      description: 'Навыки, услуги и подход Виктора Калякина: сайты-визитки, лендинги, Python-автоматизация, парсинг и комплексное SEO.',
    },
    portfolio: {
      title: 'Портфолио - Viktor Kalyakin',
      description: 'Портфолио Виктора Калякина: Rodina, Geometriya, Kalyakin Desktop, WorkerWP Store и другие веб-проекты.',
    },
    privacy: {
      title: 'Политика конфиденциальности - Viktor Kalyakin',
      description: 'Политика конфиденциальности сайта Виктора Калякина, использование аналитики и обработка технических данных.',
    },
  },
  en: {
    home: {
      title: 'Viktor Kalyakin - web development, Python and comprehensive SEO',
      description: 'Viktor Kalyakin: web development, Python automation, React, Node.js, comprehensive SEO, scraping, and web integrations.',
    },
    about: {
      title: 'About - Viktor Kalyakin',
      description: 'Skills, services, and working approach: business-card websites, landing pages, Python automation, scraping, and comprehensive SEO.',
    },
    portfolio: {
      title: 'Portfolio - Viktor Kalyakin',
      description: 'Viktor Kalyakin portfolio: Rodina, Geometriya, Kalyakin Desktop, WorkerWP Store, and other web projects.',
    },
    privacy: {
      title: 'Privacy Policy - Viktor Kalyakin',
      description: 'Privacy policy for Viktor Kalyakin website, analytics usage, and technical data processing.',
    },
  },
};
