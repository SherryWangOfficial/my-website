import React, { useState } from 'react';
import TopNavBar from './TopNavBar';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // Build FAQ items dynamically from translation
  const faqItems = [1, 2, 3, 4].map((id) => {
    const question = t(`faqPage.items.${id}.question`);
    // For item 4, answer has parts + link, else plain string
    let answer;
    if (id === 4) {
      answer = (
        <>
          {t('faqPage.items.4.answerPart1')}{' '}
          <Link to="/book-art" style={{ color: '#0077cc', textDecoration: 'underline' }}>
            {t('faqPage.items.4.answerLinkText')}
          </Link>
          {t('faqPage.items.4.answerPart2')}
        </>
      );
    } else {
      answer = t(`faqPage.items.${id}.answer`);
    }
    return { id, question, answer };
  });

  return (
    <>
      <TopNavBar />
      <div
        style={{
          padding: '6rem',
          maxWidth: '800px',
          margin: '0 auto',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#ffffff',
          minHeight: '100vh',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
          {t('faqPage.title')}
        </h1>

        {faqItems.map(({ id, question, answer }) => (
          <div
            key={id}
            style={{
              borderBottom: '1px solid #ccc',
              padding: '1rem 0',
              marginBottom: '1rem',
            }}
          >
            <div
              onClick={() => toggleFAQ(id)}
              style={{
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1.125rem',
                color: '#333',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              {question}
              <span style={{ color: '#888', fontSize: '1rem' }}>
                {openId === id ? t('faqPage.collapse') : t('faqPage.expand')}
              </span>
            </div>

            {openId === id && (
              <div style={{ marginTop: '0.75rem', fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
                {answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default FAQ;
