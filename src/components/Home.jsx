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
