import React, { useRef, useEffect, useState } from 'react';
import ScrollReveal from './ScrollReveal';
import Lenis from '@studio-freight/lenis';
import TopNavBar from './TopNavBar';
import FuzzyText from './Fuzzy';
import ShinyText from './ShinyText';
import './AboutMePage.css';

const AboutMePage = () => {
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

      {/* Petals container moved here for fixed position and no scrolling */}
      <div className="petal-container-f">
        {petals.map((petal) => (
          <img
            key={petal.id}
            src="/images/Petal.png"
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
              zIndex: 5,
              filter: 'blur(2px) saturate(100%) brightness(1)',
            }}
            onAnimationEnd={() => handleAnimationEnd(petal.id)}
          />
        ))}
      </div>

      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'rgba(230,231,227,1)',
          fontFamily: 'Garamond, serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12rem 1rem 2rem',
        }}
      >
        {/* Profile + Sunburst */}
        <div
          style={{
            position: 'relative',
            width: 250,
            height: 250,
            marginBottom: '4rem',
          }}
        >
          {/* Profile Image */}
          <img
            src="/images/SW.png"
            alt="Sherry"
            style={{
              width: '275%',
              height: '275%',
              position: 'relative',
              transform: 'translate(-30%, -25%) rotate(10deg)',
              opacity: 1,
              zIndex: 2,
              filter: 'drop-shadow(-25px 0px 5px rgba(160, 160, 160, 0.8))',
            }}
          />

          <img
            src="/images/SW2.png"
            alt="Sherry2"
            style={{
              width: '400%',
              height: '400%',
              position: 'absolute',
              transform: 'translate(-10%, -125%) scaleX(-1)',
              opacity: 1,
              zIndex: 0,
              filter: 'blur(15px) saturate(00%) brightness(1)',
            }}
          />

          <img
            src="/images/SW3.png"
            alt="Sherry3"
            style={{
              width: '500%',
              height: '320%',
              position: 'absolute',
              transform: 'translate(-75%, -125%) scaleX(1)',
              opacity: 1,
              zIndex: 1,
              filter: 'blur(15px) saturate(1000%) brightness(5.5)',
            }}
          />

          {/* SWFront - Hair Layer 1 */}
          <div
            style={{
              position: 'absolute',
              transform: 'translate(-30%, -125%) rotate(10deg)',
              width: '275%',
              height: '275%',
              zIndex: 2,
            }}
          >
            <img
              src="/images/SWFront.png"
              alt="SherryFront"
              className="hair-anim-front"
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* SWside - Hair Layer 2 */}
          <div
            style={{
              position: 'absolute',
              transform: 'translate(-30%, -125%) rotate(10deg)',
              width: '275%',
              height: '275%',
              zIndex: 3,
            }}
          >
            <img
              src="/images/SWSide.png"
              alt="SherrySide"
              className="hair-anim-side"
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Overlay Text */}
          <div
            id="overlay"
            style={{
              position: 'absolute',
              top: '180%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'black',
              fontSize: 108,
              fontWeight: 'bold',
              zIndex: 3,
              whiteSpace: 'nowrap',
              letterSpacing: '0.1em',
            }}
          >
            Who Am I?
          </div>

          {/* Overlay Text */}
          <div
            id="overlay2"
            style={{
              position: 'absolute',
              top: '220%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 16,
              zIndex: 3,
              whiteSpace: 'nowrap',
              letterSpacing: '0.1em',
            }}
          >
            <ShinyText
              text={
                '"Art is the heartbeat of life, turning moments into meaning and emotions into eternity."'
              }
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
            padding: '15rem 0rem',
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
            Hello I’m Sherry Wang — a book sculpture artist from Vineland, NJ,
            where I’ve lived for more than 20 years. For over 5 years, I’ve
            transformed discarded books into art by cutting, folding, and
            twisting their pages into new shapes and meanings.
          </ScrollReveal>

          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={5}
            blurStrength={10}
            scrub={5}
          >
            My work reimagines the book as both medium and message, celebrating
            the written word while challenging our perceptions of it. I also
            offer custom sculptures tailored to your ideas. Reach out through
            the contact page to connect or commission a piece.
          </ScrollReveal>
        </div>
      </div>
    </>
  );
};

export default AboutMePage;
