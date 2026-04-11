import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'bv-theme';

/** @typedef {'dark' | 'light'} ThemeMode */

const ThemeContext = createContext({
  /** @type {ThemeMode} */
  theme: 'dark',
  /** @param {ThemeMode} mode */
  setTheme: () => {},
  toggleTheme: () => {},
});

function readStoredTheme() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* ignore */
  }
  return null;
}

function getSystemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => readStoredTheme() ?? getSystemTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    root.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#141414' : '#ffffff');
    }
  }, [theme]);

  const setTheme = (mode) => {
    setThemeState(mode === 'light' ? 'light' : 'dark');
  };

  const toggleTheme = () => {
    setThemeState((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
