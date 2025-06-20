import React, { useState } from 'react';
import TopNavBar from './TopNavBar';
import { Link } from 'react-router-dom';

const faqItems = [
  {
    id: 1,
    question: 'What is book art?',
    answer:
      'Book art is the creative transformation of books into visual sculptures or installations. It involves folding, cutting, and reshaping the pages and covers to create intricate designs and meaningful forms.',
  },
  {
    id: 2,
    question: 'What inspires your book sculptures?',
    answer:
      'I draw inspiration from nature, mythology, and personal memories. I love incorporating organic shapes like flowers, wings, and waves, blending delicate craftsmanship with storytelling.',
  },
  {
    id: 3,
    question: 'How do you choose which books to use?',
    answer:
      'I often look for older or donated books that are no longer readable but still hold emotional or visual value. Each piece is carefully selected to match the concept of the sculpture.',
  },
  {
    id: 4,
    question: 'Can I buy your book art?',
    answer: (
      <>
        Yes! You can explore and purchase available pieces directly from the{' '}
        <Link to="/book-art" style={{ color: '#0077cc', textDecoration: 'underline' }}>
          Book Art store
        </Link>
        .
      </>
    ),
  },
];

const FAQ = () => {
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
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
          backgroundColor: '#ffffff',
          minHeight: '100vh',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Frequently Asked Questions</h1>

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
                {openId === id ? '▲' : '▼'}
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
