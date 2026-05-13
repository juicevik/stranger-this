import React from 'react';
import { CONTACT_URL, localizedContent } from '../data/siteContent';

const About = ({ locale }) => {
  const content = localizedContent[locale].about;
  const intro = content.intro
    .replace('комплексное SEO', 'SEO-продвижение')
    .replace('comprehensive SEO', 'SEO strategy');

  return (
    <main className="page-shell about-page">
      <section className="glass-page-panel">
        <p className="page-kicker">{locale === 'ru' ? 'Визитка и услуги' : 'Profile and services'}</p>
        <h1>{content.title}</h1>
        <p className="lead-text">{intro}</p>
      </section>

      <section className="glass-page-grid" aria-label={content.skillsTitle}>
        <div className="glass-card">
          <h2>{content.skillsTitle}</h2>
          <ul className="tag-list">
            {content.skills.map((skill) => (
              <li key={skill}>{skill.replace('комплексное SEO', 'SEO').replace('comprehensive SEO', 'SEO')}</li>
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
