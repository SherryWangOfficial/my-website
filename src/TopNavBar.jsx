import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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
    <nav style={{
      width: '100%',
      backgroundColor: '#fff',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'center',
      borderBottom: '1px solid #ddd',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
    }}>
      <div style={{
        display: 'flex',
        gap: '2rem',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        fontSize: '14px',
        letterSpacing: '1px',
        color: '#666',
        fontWeight: '500',
        textTransform: 'uppercase',
      }}>
        {navItems.map(({ label, path }) => (
          <Link
            key={label}
            to={path}
            style={{
              textDecoration: 'none',
              color: location.pathname === path ? '#000' : '#666',
              transition: 'color 0.2s ease-in-out',
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#000'}
            onMouseOut={(e) => e.currentTarget.style.color = location.pathname === path ? '#000' : '#666'}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default TopNavBar;
