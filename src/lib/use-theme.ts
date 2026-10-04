import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

// The page's theme, shared with the inline script in theme-script.ts, which sets the class on
// <html> before first paint. `theme` is "light" until the page has hydrated, then the real value.
export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const read = () =>
      setThemeState(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    root.classList.toggle('dark', next === 'dark');
    root.classList.toggle('light', next === 'light');
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // A private window may refuse storage; the theme still switches for this visit.
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
  }, [setTheme]);

  return { theme, setTheme, toggle };
};
