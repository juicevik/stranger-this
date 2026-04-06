// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './styles/App.css';
import PrivacyPolicy from './components/PrivacyPolicy';
import Portfolio from './components/Portfolio';
import { Analytics } from "@vercel/analytics/react";

const BackgroundAnimation = () => {
  const location = useLocation();
  // Не отображаем фоновые эффекты на странице /portfolio
  if (location.pathname === '/portfolio') {
    return null;
  }

  return (
    <div className="background-effects">
      <div className="floating-container">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>
    </div>
  );
};

const ContactButton = () => (
  <a href="tg://resolve?domain=kalyakinviktor" target="_blank" rel="noopener noreferrer">
    <button className="contact-button">CONTACT</button>
  </a>
);

const Header = () => (
  <div className="header">
    <h1>VIKTOR KALYAKIN</h1>
    <h2>WEBMASTER</h2>
    <p>Full-Stack Developer & Automation Engineer
Python, Node.js, React, Web Scraping, Automation, HTML, CSS.</p>
  </div>
);

const MenuSpoiler = () => {
  const [isMenuSpoilerOpen, setIsMenuSpoilerOpen] = useState(false);

  const toggleMenuSpoiler = () => {
    setIsMenuSpoilerOpen(!isMenuSpoilerOpen);
  };

  return (
    <>
      <button
        className="spoiler-btn"
        onClick={toggleMenuSpoiler}
        style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1001 }}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className={`context-menu ${isMenuSpoilerOpen ? 'open' : ''}`}>
        <div className="menu-content">
          <a href="/">Главная</a>
          <a href="https://vk.com/1kalyakin">Я в VK</a>
          <a href="/portfolio">Мои Работы</a>
          <a href="tg://resolve?domain=kalyakinviktor">Связаться</a>
          <a href="https://kalyakin.github.io">Обо мне</a>
          <a href="/privacy-policy">Политика конфиденциальности</a>
        </div>
      </div>
    </>
  );
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setMenuOpen(true), 500);
  }, []);

  return (
    <Router>
      <div className="app">
        <BackgroundAnimation />
        <MenuSpoiler />
        <Routes>
          <Route
            path="/"
            element={
              <div className={`content ${menuOpen ? 'menu-open' : ''}`} style={{ paddingBottom: '60px' }}>
                <Header />
                <ContactButton />
              </div>
            }
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <h5 className="copyright">© 2026 VIKTOR KALYAKIN. All rights reserved</h5>
        <Analytics />
      </div>
    </Router>
  );
}

export default App;



