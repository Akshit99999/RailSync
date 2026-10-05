'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Determine initial theme
    const urlTheme = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('theme') : null;
    const stored = (urlTheme === 'light' || urlTheme === 'dark') ? urlTheme : localStorage.getItem('railsync_theme');
    if (stored === 'light' || stored === 'dark') {
      setThemeState(stored);
      applyTheme(stored);
    } else {
      // Default to dark mode (Yellow & Black)
      setThemeState('dark');
      applyTheme('dark');
    }
    setMounted(true);
  }, []);

  const applyTheme = (t) => {
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
  };

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('railsync_theme', newTheme);
    } catch (e) {}
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
