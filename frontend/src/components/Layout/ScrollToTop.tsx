import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component handles scrolling to top when navigation occurs
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when the pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop; 