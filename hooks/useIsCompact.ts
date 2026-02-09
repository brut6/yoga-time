import { useState, useEffect } from 'react';

export const useIsCompact = () => {
  const [isCompact, setIsCompact] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const isSmall = window.innerWidth < 420;
      const hasQuery = new URLSearchParams(window.location.search).get('compact') === '1';
      return isSmall || hasQuery;
    }
    return false;
  });

  useEffect(() => {
    const handleCheck = () => {
      const isSmall = window.innerWidth < 420;
      const hasQuery = new URLSearchParams(window.location.search).get('compact') === '1';
      setIsCompact(isSmall || hasQuery);
    };

    window.addEventListener('resize', handleCheck);
    return () => window.removeEventListener('resize', handleCheck);
  }, []);

  return isCompact;
};