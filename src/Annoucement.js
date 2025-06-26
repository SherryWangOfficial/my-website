import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopNavBar from './TopNavBar';
import { useTranslation } from 'react-i18next';

const Announcement = () => {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // announcement data driven from translation keys
  const announcements = [
    {
      id: 2,
      date: t('announcementPage.announcement2.date'),
      title: t('announcementPage.announcement2.title'),
      content: (
        <>
          {t('announcementPage.announcement2.contentPart1')}{' '}
          <Link to="/book-art" style={{ color: '#0077cc', textDecoration: 'underline' }}>
            {t('announcementPage.announcement2.contentLinkText')}
          </Link>
          {t('announcementPage.announcement2.contentPart2')}
        </>
      ),
    },
    {
      id: 1,
      date: t('announcementPage.announcement3.date'),
      title: t('announcementPage.announcement3.title'),
      content: t('announcementPage.announcement3.content'),
    },
  ];

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
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
          {t('announcementPage.title')}
        </h1>

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
                {expandedId === id ? t('announcementPage.hideDetails') : t('announcementPage.showDetails')}
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
