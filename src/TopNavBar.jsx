import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TopNavBar.css'; 
import { useTranslation } from 'react-i18next';

const TopNavBar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  // Use translation keys here instead of fixed labels
  const navItems = [
    { labelKey: 'nav.home', path: '/' },
    { labelKey: 'nav.about', path: '/about' },
    { labelKey: 'nav.announcements', path: '/announcement' },
    { labelKey: 'nav.gallery', path: '/gallery' },
    { labelKey: 'nav.faq', path: '/faq' },
    { labelKey: 'nav.contact', path: '/contact' },
  ];

  return (
    <nav className="top-nav">
      <div className="top-nav-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="nav-links" style={{ display: 'flex', gap: '1rem' }}>
          {navItems.map(({ labelKey, path }) => (
            <Link
              key={labelKey}
              to={path}
              className={location.pathname === path ? 'active' : ''}
            >
              {t(labelKey)}
            </Link>
          ))}
        </div>

        <select
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          value={i18n.language}
          style={{
            padding: '6px 10px',
            fontSize: '1rem',
            borderRadius: '4px',
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid #ccc',
          }}
        >
          <option value="en">EN</option>
          <option value="es">ES</option>
          <option value="zh">中</option>
        </select>
      </div>
    </nav>
  );
};

export default TopNavBar;
