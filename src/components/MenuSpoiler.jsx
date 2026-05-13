import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { menuLinks } from '../data/siteContent';

const MenuSpoiler = ({ locale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const labels = {
    ru: { open: 'Открыть меню', close: 'Закрыть меню' },
    en: { open: 'Open menu', close: 'Close menu' },
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        ref={buttonRef}
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
      <nav
        id="site-menu"
        className={`context-menu ${isOpen ? 'open' : ''}`}
        aria-label="Site navigation"
        aria-hidden={!isOpen}
      >
        <div className="menu-content">
          {menuLinks[locale].map((link) => (
            link.internal ? (
              <Link key={link.label} to={link.href} tabIndex={isOpen ? 0 : -1} onClick={closeMenu}>
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={isOpen ? 0 : -1}
                onClick={closeMenu}
              >
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
