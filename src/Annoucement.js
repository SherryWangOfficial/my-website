import React, { useState } from 'react';
import TopNavBar from './TopNavBar';

const announcements = [
  {
    id: 1,
    date: 'June 10, 2025',
    title: 'New Book Art Series Released!',
    content: `We’re excited to unveil a brand new series of book sculptures inspired by nature and folklore. Visit the Book Art section to explore the latest creations.`,
  },
  {
    id: 2,
    date: 'May 28, 2025',
    title: 'Website Update Complete',
    content: `The website has received a major visual and performance overhaul. We’ve added smoother navigation, better image quality, and a new About Me section.`,
  },
  {
    id: 3,
    date: 'May 10, 2025',
    title: 'Exhibition at Vineland Arts Center',
    content: `Don’t miss the upcoming showcase at the Vineland Arts Center starting May 20th. Sherry’s latest sculptures will be on display with a live demonstration.`,
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
