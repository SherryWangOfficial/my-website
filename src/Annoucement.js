import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopNavBar from './TopNavBar';

const announcements = [
  {
    id: 3,
    date: 'June 24, 2025',
    title: 'New Book "Lavender"',
    content: (
            <>
        {' '}
        <Link to="/book-art" style={{ color: '#0077cc', textDecoration: 'underline' }}>
          Book Art Store
        </Link>
        .
      </>
    )
  },
  {
    id: 2,
    date: 'June 24, 2025',
    title: 'New Book Art Store',
    content: (
      <>
        I'm excited to unveil a brand new section of my page! With so many books in my collection,
        I wanted to make it easier for everyone to browse and find the ones they’re most interested in—
        right here online. Check out the{' '}
        <Link to="/book-art" style={{ color: '#0077cc', textDecoration: 'underline' }}>
          Book Art Store
        </Link>
        .
      </>
    ),
  },
  {
    id: 1,
    date: 'June 20, 2025',
    title: 'Website Complete',
    content: `My website has offically been launched!`,
  },
];

const Announcement = () => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <>
      <TopNavBar />

    <div
      style={{
        padding: '6rem',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#fdfdfd',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Announcements</h1>

      {announcements.map(({ id, date, title, content }) => (
        <div
          key={id}
          style={{
            borderBottom: '1px solid #ccc',
            paddingBottom: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div
            onClick={() => toggleExpand(id)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            <span style={{ fontSize: '0.875rem', color: '#888' }}>{date}</span>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{title}</h2>
            <span style={{ color: '#0077cc', fontSize: '0.875rem' }}>
              {expandedId === id ? 'Hide details ▲' : 'Show details ▼'}
            </span>
          </div>

          {expandedId === id && (
            <p style={{ marginTop: '1rem', lineHeight: '1.5', color: '#333' }}>
              {content}
            </p>
          )}
        </div>
      ))}
    </div>
    </>
  );
};

export default Announcement;
