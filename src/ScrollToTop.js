import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Try multiple times, in case page content loads slowly
    const scrollTop = () => window.scrollTo(0, 0);

    scrollTop(); // initial attempt

    // Try again after a short delay
    const id = setTimeout(scrollTop, 100);

    return () => clearTimeout(id);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
