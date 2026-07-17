import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('theme');
      return (saved === 'dark' || saved === 'light') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  const isDark = theme === 'dark';

  return { theme, setTheme, isDark };
}
