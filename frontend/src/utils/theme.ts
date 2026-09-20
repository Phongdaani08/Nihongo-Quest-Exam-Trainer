import { useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';

const THEME_KEY = 'nihongo_theme';

export const getStoredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return 'light'; // Default is Light Mode
};

export const applyTheme = (theme: ThemeMode) => {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  window.dispatchEvent(new CustomEvent('nihongo-theme-change', { detail: theme }));
};

export const toggleTheme = (): ThemeMode => {
  const current = getStoredTheme();
  const next: ThemeMode = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  return next;
};

export const useTheme = (): [ThemeMode, () => void] => {
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme());

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeMode>;
      if (customEvent.detail) {
        setTheme(customEvent.detail);
      } else {
        setTheme(getStoredTheme());
      }
    };

    window.addEventListener('nihongo-theme-change', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);
    return () => {
      window.removeEventListener('nihongo-theme-change', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  const handleToggle = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  return [theme, handleToggle];
};
