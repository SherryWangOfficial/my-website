import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TopNavBar.css'; // assuming your css is here

const TopNavBar = () => {
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Announcements', path: '/announcement' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
  ];

  const location = useLocation();

  return (
    <nav className="top-nav">
      <div className="top-nav-inner">
        {navItems.map(({ label, path }) => (
          <Link
            key={label}
            to={path}
            className={location.pathname === path ? 'active' : ''}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default TopNavBar;
