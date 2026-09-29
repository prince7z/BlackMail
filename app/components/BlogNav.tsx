'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface BlogNavProps {
  /** Show "← All Posts" back link to /blog, or "← Home" back to / */
  backHref?: string;
  backLabel?: string;
}

export default function BlogNav({ backHref = '/', backLabel = 'Home' }: BlogNavProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  /* Sync with existing app theme from localStorage */
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initial = saved ?? 'dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return (
    <nav className="blog-topbar">
      {/* Logo */}
      <Link href="/" className="blog-topbar-logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
        BlackMail
      </Link>

      {/* Right side */}
      <div className="blog-topbar-actions">
        <Link href={backHref} className="blog-back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7M19 12H5"/>
          </svg>
          {backLabel}
        </Link>

        {/* Theme toggle — hidden until mounted to avoid flash */}
        <button
          id="blog-theme-toggle"
          className="blog-theme-btn"
          onClick={toggleTheme}
          aria-label="Toggle light/dark mode"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{ opacity: mounted ? 1 : 0 }}
        >
          {theme === 'dark' ? (
            /* Sun icon */
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2m-7.07-14.07 1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
            </svg>
          ) : (
            /* Moon icon */
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}
