import React from 'react';
import { localizedContent } from '../data/siteContent';

const policyText = {
  ru: [
    {
      title: '1. Общие положения',
      body: 'Настоящая Политика конфиденциальности регулирует порядок обработки и защиты технических данных посетителей сайта VIKTOR KALYAKIN.',
    },
    {
      title: '2. Сбор и обработка данных',
      body: 'Мы используем Яндекс Метрика с функцией Вебвизор и Vercel Analytics для анализа посещаемости, улучшения удобства и качества работы сайта. Вебвизор может выполнять запись поведения посетителей на страницах, включая движения курсора, клики, прокрутку и ввод в формы, если такие действия доступны сервису. Аналитические сервисы также могут обрабатывать технические данные: IP-адрес в анонимизированной форме, тип устройства и браузера, посещенные страницы и источник перехода.',
    },
    {
      title: '3. Использование cookies',
      body: 'На сайте могут использоваться cookies, которые помогают запоминать настройки пользователя и собирать обезличенную статистику. Вы можете отключить cookies в настройках браузера.',
    },
    {
      title: '4. Передача данных третьим лицам',
      body: 'Мы не продаем и не передаем персональные данные третьим лицам, кроме случаев, предусмотренных законом или необходимых для работы аналитических сервисов.',
    },
    {
      title: '5. Отказ от сбора данных',
      body: 'Если вы не хотите, чтобы ваш визит учитывался в Яндекс Метрике, отключите cookies в браузере или используйте официальное расширение Яндекса для блокировки передачи данных.',
    },
  ],
  en: [
    {
      title: '1. General provisions',
      body: 'This Privacy Policy explains how technical data from visitors to the VIKTOR KALYAKIN website is processed and protected.',
    },
    {
      title: '2. Data collection and processing',
      body: 'We use Yandex Metrika with Webvisor and Vercel Analytics to analyze visits, improve usability, and maintain the quality of the website. Webvisor may perform session replay and behavior recording on pages, including cursor movements, clicks, scrolling, and form input when those actions are available to the service. Analytics services may also process technical data: anonymized IP address, device and browser type, visited pages, and referral source.',
    },
    {
      title: '3. Cookies',
      body: 'The website may use cookies to remember user preferences and collect anonymized statistics. You can disable cookies in your browser settings.',
    },
    {
      title: '4. Sharing data with third parties',
      body: 'We do not sell or transfer personal data to third parties except where required by law or necessary for the operation of analytics services.',
    },
    {
      title: '5. Opting out',
      body: 'If you do not want your visit to be counted in analytics, disable cookies in your browser or use the official Yandex browser extension that blocks data transfer.',
    },
  ],
};

const PrivacyPolicy = ({ locale = 'ru' }) => {
  const safeLocale = localizedContent[locale] ? locale : 'ru';
  const privacy = localizedContent[safeLocale].privacy;

  return (
    <main className="page-shell privacy-policy">
      <section className="glass-page-panel">
        <h1>{privacy.title}</h1>
        <p>{privacy.updated}</p>
        {policyText[safeLocale].map((section) => (
          <p key={section.title}>
            <strong>{section.title}</strong>
            <br />
            {section.body}
          </p>
        ))}
        <p>
          <strong>{safeLocale === 'ru' ? '6. Контакты' : '6. Contacts'}</strong>
          <br />
          {privacy.contact}
        </p>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
