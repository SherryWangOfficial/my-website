import React from 'react';
import { SiGmail, SiInstagram } from 'react-icons/si';
import TopNavBar from './TopNavBar';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <>
      <TopNavBar />

      <div
        style={{
          paddingTop: '4rem',
          padding: '6rem',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#ffffff',
          minHeight: '100vh',
          color: '#333',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          {t('contactPage.title')}
        </h1>
        <p style={{ fontSize: '1.125rem', marginBottom: '2rem', lineHeight: '1.6' }}>
          {t('contactPage.intro')}
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            fontSize: '1.125rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <SiGmail color="#D44638" size={32} />
            <a
              href={`mailto:${t('contactPage.email')}`}
              style={{
                textDecoration: 'none',
                color: '#D44638',
                fontWeight: 'bold',
              }}
            >
              {t('contactPage.email')}
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <SiInstagram color="#C13584" size={32} />
            <a
              href="https://www.instagram.com/crafty_sherry/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                color: '#C13584',
                fontWeight: 'bold',
              }}
            >
              {t('contactPage.instagram')}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
