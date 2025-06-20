import React, { useEffect } from 'react';
import TopNavBar from './TopNavBar';

const instagramPosts = [
  'https://www.instagram.com/p/DJKguHDyF5R/',
  'https://www.instagram.com/reel/DJE-y6axVSL/',
  'https://www.instagram.com/p/DIJc8HUMk4h/',
];

const Gallery = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <TopNavBar />
      <div style={{ paddingTop: '6rem', padding: '2rem' }}>
        <h1 style={{ textAlign: 'center' }}></h1>
        <p style={{ textAlign: 'center' }}>
          
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            justifyItems: 'center',
          }}
        >
          {instagramPosts.map((url, index) => (
            <div
              key={index}
              style={{ width: '350px' }} // slightly bigger width
              dangerouslySetInnerHTML={{
                __html: `
                  <blockquote 
                    class="instagram-media" 
                    data-instgrm-captioned 
                    data-instgrm-permalink="${url}" 
                    data-instgrm-version="14" 
                    style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px rgba(0,0,0,0.5),0 1px 10px rgba(0,0,0,0.15); margin: 1px auto; max-width:100%; min-width:320px; padding:0; width:100%;">
                  </blockquote>
                `,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Gallery;
