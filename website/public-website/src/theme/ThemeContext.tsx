import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { ThemeMode, EffectiveTheme } from './designTokens';
import { ThemeContext } from './ThemeContextCore';

const GLOBAL_THEME_STORAGE_KEY = 'apnatrip_theme_mode';

function normalizeThemeMode(mode?: string | null): ThemeMode {
  if (!mode) return 'Light';
  const lower = mode.toLowerCase();
  if (lower === 'dark') return 'Dark';
  if (lower === 'system') return 'System';
  return 'Light';
}

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'Light';
  try {
    const saved = localStorage.getItem(GLOBAL_THEME_STORAGE_KEY);
    if (saved) return normalizeThemeMode(saved);
  } catch {
    // Storage restricted
  }
  return 'Light';
}

function resolveEffectiveTheme(mode: ThemeMode, systemDark: boolean): EffectiveTheme {
  if (mode === 'Dark') return 'Dark';
  if (mode === 'Light') return 'Light';
  return systemDark ? 'Dark' : 'Light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);
  const [systemDark, setSystemDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Track system OS preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = (e: MediaQueryListEvent) => {
      setSystemDark(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Derive effective theme without setState cascade
  const effectiveTheme = useMemo(() => resolveEffectiveTheme(theme, systemDark), [theme, systemDark]);

  // Synchronize DOM classes and attributes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const isDarkTheme = effectiveTheme === 'Dark';

    if (isDarkTheme) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
      document.body.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
      document.body.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }

    try {
      localStorage.setItem(GLOBAL_THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme, effectiveTheme]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'Dark' ? 'Light' : 'Dark'));
  }, []);

  const isDark = effectiveTheme === 'Dark';

  const value = useMemo(
    () => ({ theme, effectiveTheme, isDark, setTheme, toggleTheme }),
    [theme, effectiveTheme, isDark, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;
