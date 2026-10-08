import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeMode, EffectiveTheme } from './designTokens';

export type { ThemeMode, EffectiveTheme };

export interface ThemeContextType {
  theme: ThemeMode;
  effectiveTheme: EffectiveTheme;
  isDark: boolean;
  setTheme: (theme: ThemeMode | string) => void;
  toggleTheme: () => void;
  syncFromProfile: (profileTheme?: string | null) => void;
}

const GLOBAL_THEME_STORAGE_KEY = 'apnatrip_theme_mode';
const LEGACY_STORAGE_KEYS = ['website-theme', 'agency-theme', 'super-admin-theme'];

export const normalizeThemeMode = (mode?: string | null): ThemeMode => {
  if (!mode) return 'System';
  const lower = mode.toLowerCase();
  if (lower === 'dark') return 'Dark';
  if (lower === 'light') return 'Light';
  return 'System';
};

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'System';
  try {
    const saved = localStorage.getItem(GLOBAL_THEME_STORAGE_KEY);
    if (saved) return normalizeThemeMode(saved);

    // Fallback to legacy keys if present
    for (const key of LEGACY_STORAGE_KEYS) {
      const legacyVal = localStorage.getItem(key);
      if (legacyVal) return normalizeThemeMode(legacyVal);
    }
  } catch {
    // Storage access restricted/disabled
  }
  return 'System';
};

const resolveEffectiveTheme = (mode: ThemeMode): EffectiveTheme => {
  if (mode === 'Dark') return 'Dark';
  if (mode === 'Light') return 'Light';
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light';
  }
  return 'Light';
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>(() => resolveEffectiveTheme(getInitialTheme()));

  // Apply theme to DOM (document.documentElement and body)
  const applyDomTheme = useCallback((effective: EffectiveTheme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const isDark = effective === 'Dark';

    if (isDark) {
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
  }, []);

  // Update effective theme whenever theme or system preference changes
  useEffect(() => {
    const resolved = resolveEffectiveTheme(theme);
    setEffectiveTheme(resolved);
    applyDomTheme(resolved);

    // Also sync all legacy keys for backwards compatibility
    try {
      localStorage.setItem(GLOBAL_THEME_STORAGE_KEY, theme);
      for (const k of LEGACY_STORAGE_KEYS) {
        localStorage.setItem(k, theme);
      }
    } catch {
      // ignore
    }
  }, [theme, applyDomTheme]);

  // System OS theme media query listener
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (theme === 'System') {
        const resolved: EffectiveTheme = e.matches ? 'Dark' : 'Light';
        setEffectiveTheme(resolved);
        applyDomTheme(resolved);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    } else {
      mediaQuery.addListener(handleSystemChange);
      return () => mediaQuery.removeListener(handleSystemChange);
    }
  }, [theme, applyDomTheme]);

  const setTheme = useCallback((newMode: ThemeMode | string) => {
    const normalized = normalizeThemeMode(newMode);
    setThemeState(normalized);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const resolved = resolveEffectiveTheme(current);
      return resolved === 'Dark' ? 'Light' : 'Dark';
    });
  }, []);

  const syncFromProfile = useCallback((profileTheme?: string | null) => {
    if (profileTheme) {
      const normalized = normalizeThemeMode(profileTheme);
      setThemeState(normalized);
    }
  }, []);

  const value = useMemo<ThemeContextType>(
    () => ({
      theme,
      effectiveTheme,
      isDark: effectiveTheme === 'Dark',
      setTheme,
      toggleTheme,
      syncFromProfile,
    }),
    [theme, effectiveTheme, setTheme, toggleTheme, syncFromProfile]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Primary Unified Theme Hook
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// ── Backward-compatible Aliases ──────────────────────────────────────────────
export const useSuperAdminTheme = useTheme;
export const useAgencyTheme = useTheme;
export const useWebsiteTheme = useTheme;
export const useAdminTheme = useTheme;
