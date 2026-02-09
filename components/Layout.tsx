
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigationType } from 'react-router-dom';
import { useSafeTranslation } from '../hooks';

// Zen UI Icons: Refined stroke width
const Icons = {
  Home: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9z" />
    </svg>
  ),
  Retreats: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a14.5 14.5 0 0 0 0 18" />
    </svg>
  ),
  Instructors: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
    </svg>
  ),
  Breathing: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 8a4 4 0 0 0-4 4" />
    </svg>
  ),
  Profile: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  ),
  Organizer: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  ),
  Admin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
};

const ScrollManager = () => {
  const { pathname, search } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    const key = `yt_scroll:${pathname}${search}`;
    const mainEl = document.querySelector('.app-main');

    const getScroll = () => {
      if (window.scrollY > 0) return window.scrollY;
      return mainEl?.scrollTop || 0;
    };

    const setScroll = (y: number) => {
      window.scrollTo(0, y);
      if (mainEl) mainEl.scrollTop = y;
    };

    if (navType === 'POP') {
      const saved = sessionStorage.getItem(key);
      if (saved) {
        const y = parseInt(saved, 10);
        if (!isNaN(y)) {
          setTimeout(() => setScroll(y), 0);
        }
      }
    } else {
      setScroll(0);
    }

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          sessionStorage.setItem(key, getScroll().toString());
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    if (mainEl) mainEl.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (mainEl) mainEl.removeEventListener('scroll', onScroll);
    };
  }, [pathname, search, navType]);

  return null;
};

export const Layout = () => {
  const { tsafe } = useSafeTranslation();
  const [role, setRole] = useState('student');
  const [isNavVisible, setIsNavVisible] = useState(true);

  useEffect(() => {
    const savedRole = localStorage.getItem('yt_user_role') || 'student';
    setRole(savedRole);
    const handleRoleChange = () => {
      const newRole = localStorage.getItem('yt_user_role') || 'student';
      setRole(newRole);
    };
    window.addEventListener('roleChange', handleRoleChange);
    
    // Listen for nav toggle events from overlays like Smart Match
    const handleNavToggle = (e: CustomEvent) => {
      setIsNavVisible(e.detail);
    };
    window.addEventListener('yt-toggle-nav' as any, handleNavToggle);

    return () => {
      window.removeEventListener('roleChange', handleRoleChange);
      window.removeEventListener('yt-toggle-nav' as any, handleNavToggle);
    };
  }, []);

  // Safe Area Contract: Measure Nav Height
  useLayoutEffect(() => {
    const updateNavHeight = () => {
      const nav = document.querySelector('[data-bottom-nav="true"]');
      if (nav && isNavVisible) {
        const h = nav.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--bottom-nav-height', `${h}px`);
      } else {
        // If nav is hidden, we might want 0 padding, or keep it to prevent jumpiness
        if (!isNavVisible) document.documentElement.style.setProperty('--bottom-nav-height', '0px');
      }
    };
    
    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);
    
    const navEl = document.querySelector('[data-bottom-nav="true"]');
    let observer: ResizeObserver | null = null;
    if (navEl) {
      observer = new ResizeObserver(updateNavHeight);
      observer.observe(navEl);
    }

    return () => {
      window.removeEventListener('resize', updateNavHeight);
      observer?.disconnect();
    };
  }, [role, isNavVisible]);

  return (
    <div className="yt-app">
      <ScrollManager />
      <div className="ambient-bg" />

      <header className="yt-header">
        <div className="yt-brand">{tsafe('common.brandName', 'YOGA TIME')}</div>
      </header>

      {/* Safe Area Contract: Main content respects bottom nav */}
      <main className="app-main" style={{ flex: 1, width: '100%', paddingBottom: 'var(--bottom-nav-height)' }}>
        <Outlet />
      </main>

      <nav 
        className="yt-tabbar" 
        data-bottom-nav="true"
        style={{ 
          display: isNavVisible ? 'flex' : 'none',
          transform: isNavVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' 
        }}
      >
        <NavLink to="/" className={({ isActive }) => `yt-tab ${isActive ? 'active' : ''}`}>
          <Icons.Home />
          <span>{tsafe('nav.home', 'Home')}</span>
        </NavLink>
        <NavLink to="/retreats" className={({ isActive }) => `yt-tab ${isActive ? 'active' : ''}`}>
          <Icons.Retreats />
          <span>{tsafe('nav.retreats', 'Retreats')}</span>
        </NavLink>
        <NavLink to="/breathing" className={({ isActive }) => `yt-tab ${isActive ? 'active' : ''}`}>
          <Icons.Breathing />
          <span>{tsafe('nav.breath', 'Breath')}</span>
        </NavLink>
        <NavLink to="/instructors" className={({ isActive }) => `yt-tab ${isActive ? 'active' : ''}`}>
          <Icons.Instructors />
          <span>{tsafe('nav.teachers', 'Mentors')}</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `yt-tab ${isActive ? 'active' : ''}`}>
          <Icons.Profile />
          <span>{tsafe('nav.profile', 'Profile')}</span>
        </NavLink>
        
        {role === 'organizer' && (
          <NavLink to="/organizer" className={({ isActive }) => `yt-tab ${isActive ? 'active' : ''}`}>
            <Icons.Organizer />
            <span>{tsafe('nav.organizer', 'Organizer')}</span>
          </NavLink>
        )}

        {role === 'instructor' && (
          <NavLink to="/instructor-dashboard" className={({ isActive }) => `yt-tab ${isActive ? 'active' : ''}`}>
            <Icons.Dashboard />
            <span>{tsafe('nav.dashboard', 'Dashboard')}</span>
          </NavLink>
        )}

        {role === 'admin' && (
          <NavLink to="/admin" className={({ isActive }) => `yt-tab ${isActive ? 'active' : ''}`}>
            <Icons.Admin />
            <span>{tsafe('nav.admin', 'Admin')}</span>
          </NavLink>
        )}
      </nav>
    </div>
  );
};
