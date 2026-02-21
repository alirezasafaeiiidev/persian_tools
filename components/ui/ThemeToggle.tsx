'use client';

import { useEffect, useState } from 'react';
import { IconMoon, IconSun } from '@/shared/ui/icons';

const THEME_KEY = 'persiantoolbox.theme';
type ThemeMode = 'light' | 'dark';

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset['theme'] = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // localStorage can be blocked in strict privacy modes.
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    const currentTheme = document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light';
    setTheme(currentTheme);
  }, []);

  const handleToggle = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    setTheme(nextTheme);
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? 'تغییر به تم روشن' : 'تغییر به تم تاریک'}
      title={isDark ? 'تغییر به تم روشن' : 'تغییر به تم تاریک'}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--surface-1)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)] transition-all duration-[var(--motion-fast)] hover:bg-[var(--surface-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
    >
      {isDark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
      <span className="hidden sm:inline">{isDark ? 'روشن' : 'تاریک'}</span>
    </button>
  );
}
