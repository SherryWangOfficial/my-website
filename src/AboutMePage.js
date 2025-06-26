import React, { useRef, useEffect, useState } from 'react';
import ScrollReveal from './ScrollReveal';
import Lenis from '@studio-freight/lenis';
import TopNavBar from './TopNavBar';
import FuzzyText from './Fuzzy';
import ShinyText from './ShinyText';
import './AboutMePage.css';
import { useTranslation } from 'react-i18next';

const AboutMePage = () => {
  const { t, i18n } = useTranslation();

  const lenisRef = useRef(null);

  const [petals, setPetals] = useState([]);

  const handleAnimationEnd = (id) => {
  setPetals((prev) => prev.filter((petal) => petal.id !== id));
  };

useEffect(() => {
  let interval;

  const spawnPetal = () => {
    const id = Date.now();
    const endX = Math.random() * -100 + 'vw';
    const startX = Math.random() * -10 + 'vw';
    const z = Math.random() < 0.5 ? -5 : 5;

    setPetals((prev) => [
      ...prev,
      {
        id,
        top: `0%`,
        left: '110%',
        delay: `${Math.random() * 2}s`,
        duration: `${15 + Math.random() * 10}s`,
        width: `${Math.random() * 30 + 20}px`,
        opacity: `${0.5 + Math.random() * 0.5}`,
        startX,
        endX,
        z,
      },
    ]);
  };

  const startSpawning = () => {
    if (!interval) {
      interval = setInterval(spawnPetal, 1000);
    }
  };

  const stopSpawning = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      stopSpawning();
    } else {
      startSpawning();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  startSpawning(); // start initially

  return () => {
    stopSpawning();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, []);


  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 0,
      easing: (t) => t,
      smooth: true,
    });

    function raf(time) {
      lenisRef.current.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenisRef.current.destroy();
    };
  }, []);

  return (
    <>

      <TopNavBar />

<select
  onChange={(e) => i18n.changeLanguage(e.target.value)}
  value={i18n.language}
  style={{
    padding: '6px 12px',
    fontSize: '1rem',
    borderRadius: '4px',
    backgroundColor: 'white',
    color: 'black',
    border: '1px solid #333',
    appearance: 'auto', // reset styling
    WebkitAppearance: 'auto',
    MozAppearance: 'auto',
  }}
>
  <option value="en">English</option>
  <option value="es">Español</option>
  <option value="zh">中文</option>
</select>


      {/* Petals container moved here for fixed position and no scrolling */}
      <div className="petal-container-f">
        {petals.map((petal) => (
          <img
            key={petal.id}
            src={`${process.env.PUBLIC_URL}/images/petal.png`}
            alt="petal"
            className="petal"
            style={{
              top: petal.top,
              left: petal.left,
              animationDelay: petal.delay,
              animationDuration: petal.duration,
              width: petal.width,
              opacity: petal.opacity,
              '--startX': petal.startX,
              '--endX': petal.endX,
              zIndex: 2,
              filter: 'blur(2px) saturate(100%) brightness(1)',
            }}
            onAnimationEnd={() => handleAnimationEnd(petal.id)}
          />
        ))}
      </div>

      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'rgb(227, 221, 228)',
          fontFamily: 'Garamond, serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem 1rem 2rem',
          transform: 'translate(0, -50px) rotate(0deg)',
        }}
      >
        {/* Profile + Sunburst */}
        <div
          style={{
            position: 'relative',
            marginBottom: '0rem',
          }}
        >
          {/* Profile Image */}
          <img
            src={`${process.env.PUBLIC_URL}/images/SW.png`}
            alt="Sherry"
            style={{
              width: '50vw',
              height: 'auto',
              position: 'relative',
              transformOrigin: 'center center',
              transform: 'translate(0, 50px) rotate(0deg)',
              opacity: 1,
              zIndex: 2,
              filter: 'drop-shadow(-25px 0px 5px rgba(62, 62, 62, 0.4))',
            }}
          />

          <img
            src={`${process.env.PUBLIC_URL}/images/SW2.png`}
            alt="Sherry2"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              transform: 'translate(-45%, 60px) scaleX(-1)',
              opacity: 1,
              zIndex: 0,
              filter: 'blur(15px) saturate(0%) brightness(1)',
            }}
          />

          <img
            src={`${process.env.PUBLIC_URL}/images/SW3.png`}
            alt="Sherry3"
            style={{
              width: '300%',
              height: '320%',
              position: 'absolute',
              transform: 'translate(-85%, 0px) scaleX(1)',
              opacity: 1,
              zIndex: 1,
              filter: 'blur(15px) saturate(1000%) brightness(5.5)',
            }}
          />

          {/* Overlay Text */}
          <div
            id="overlay"
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translate(-50%, 50px)',
              color: 'black',
              fontSize: 'clamp(4rem, 10vw, 6.75rem)',
              fontWeight: 'bold',
              zIndex: 3,
              whiteSpace: 'nowrap',
              letterSpacing: '0.1em',
            }}
          >
            {t("whoAmI")}
          </div>

          {/* Overlay Text */}
          <div
            id="overlay2"
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translate(-50%, 210px)',
              fontSize: 'clamp(0rem, 1vw, 2rem)',
              zIndex: 3,
              whiteSpace: 'nowrap',
              letterSpacing: '0.1em',
            }}
          >
            <ShinyText
              text={t("artistQuote")}
              disabled={false}
              speed={5}
              className="custom-class"
            />
          </div>
        </div>

        {/* About Me Text Block */}
        <div
          style={{
            backgroundColor: 'rgba(232,243,254,1)',
            padding: '15rem 0rem 0rem',
            textAlign: 'left',
            borderRadius: '0px',
            overflow: 'none',
            width: '100%',
            zIndex: 2,
            color: '#222',
            lineHeight: '1',
            overflowX: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={5}
            blurStrength={10}
            scrub={5}
          >
            {t("aboutMeText")}
          </ScrollReveal>
      
          <div className="footer-stack">
          <img
            src={`${process.env.PUBLIC_URL}/images/Left_Hand.png`}
            alt="Left Hand"
            className="footer-hand left-hand"
          />
          <img
            style={{
              filter: 'blur(0.5px) brightness(0.95)'
            }}
            src={`${process.env.PUBLIC_URL}/images/The_Book.png`}
            alt="Book"
            className="footer-book"
          />
          <img
            src={`${process.env.PUBLIC_URL}/images/Right_Hand.png`}
            alt="Right Hand"
            className="footer-hand right-hand"
          />
        </div>


        </div>
      </div>

    </>
  );
};

export default AboutMePage;
