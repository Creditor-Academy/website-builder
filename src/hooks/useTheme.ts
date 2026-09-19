import { useState, useEffect } from 'react';

const STORAGE_KEY = 'buildora-theme';

function applyTheme(theme: 'dark' | 'light') {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

function getInitialTheme(): 'dark' | 'light' {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      // Apply immediately before first paint to avoid flash
      applyTheme(saved);
      return saved;
    }
  } catch {}
  // Default to light if nothing saved
  applyTheme('light');
  return 'light';
}

export function useTheme() {
  const [theme, setThemeState] = useState<'dark' | 'light'>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  const setTheme = (next: 'dark' | 'light') => {
    setThemeState(next);
  };

  const isDark = theme === 'dark';

  return { theme, setTheme, isDark };
}
