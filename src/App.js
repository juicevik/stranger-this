import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import './styles/App.css';
import About from './components/About';
import Home from './components/Home';
import MenuSpoiler from './components/MenuSpoiler';
import Portfolio from './components/Portfolio';
import PrivacyPolicy from './components/PrivacyPolicy';
import RoomScene from './components/RoomScene';
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
  const isGameRoute = location.pathname === '/';

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
    <div className={`app app-${isGameRoute ? 'game' : pageKey}`}>
      {!isGameRoute && <BackgroundAnimation />}
      {!isGameRoute && <MenuSpoiler locale={locale} />}
      <Routes>
        <Route path="/" element={<RoomScene />} />
        <Route path="/about" element={<About locale="ru" />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy locale="ru" />} />
        <Route path="/portfolio" element={<Portfolio locale="ru" />} />
        <Route path="/en" element={<Home locale="en" isVisible={isHomeVisible} />} />
        <Route path="/en/about" element={<About locale="en" />} />
        <Route path="/en/privacy-policy" element={<PrivacyPolicy locale="en" />} />
        <Route path="/en/portfolio" element={<Portfolio locale="en" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isGameRoute && <div className="copyright">© 2026 VIKTOR KALYAKIN. All rights reserved</div>}
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
