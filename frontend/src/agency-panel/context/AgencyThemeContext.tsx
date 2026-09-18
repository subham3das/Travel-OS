import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type AgencyThemeMode = 'Light' | 'Dark' | 'System' | 'light' | 'dark' | 'system';

interface AgencyThemeContextType {
  theme: 'Light' | 'Dark' | 'System';
  setTheme: (theme: AgencyThemeMode) => void;
  effectiveTheme: 'Light' | 'Dark';
  isDark: boolean;
}

const AgencyThemeContext = createContext<AgencyThemeContextType | undefined>(undefined);

export const AGENCY_THEME_STORAGE_KEY = 'agency-theme';

const normalizeTheme = (mode?: string | null): 'Light' | 'Dark' | 'System' => {
  if (!mode) return 'Light'; // Default agency panel theme is Light
  const lower = mode.toLowerCase();
  if (lower === 'dark') return 'Dark';
  if (lower === 'light') return 'Light';
  return 'Light';
};

const getInitialAgencyTheme = (): 'Light' | 'Dark' | 'System' => {
  try {
    const saved = localStorage.getItem(AGENCY_THEME_STORAGE_KEY);
    return normalizeTheme(saved);
  } catch {
    return 'Light';
  }
};

const resolveEffectiveTheme = (mode: 'Light' | 'Dark' | 'System'): 'Light' | 'Dark' => {
  if (mode === 'Dark') return 'Dark';
  if (mode === 'Light') return 'Light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light';
};

export const AgencyThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'Light' | 'Dark' | 'System'>(getInitialAgencyTheme);
  const [effectiveTheme, setEffectiveTheme] = useState<'Light' | 'Dark'>(() => {
    const initial = getInitialAgencyTheme();
    return resolveEffectiveTheme(initial);
  });

  const applyTheme = useCallback((mode: 'Light' | 'Dark' | 'System') => {
    const resolved = resolveEffectiveTheme(mode);
    setEffectiveTheme(resolved);

    try {
      localStorage.setItem(AGENCY_THEME_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === 'System') {
        const resolved = e.matches ? 'Dark' : 'Light';
        setEffectiveTheme(resolved);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
      return () => mediaQuery.removeListener(handleSystemThemeChange);
    }
  }, [theme]);

  const setTheme = useCallback(
    (newTheme: AgencyThemeMode) => {
      const normalized = normalizeTheme(newTheme);
      setThemeState(normalized);
      applyTheme(normalized);
    },
    [applyTheme]
  );

  return (
    <AgencyThemeContext.Provider
      value={{
        theme,
        setTheme,
        effectiveTheme,
        isDark: effectiveTheme === 'Dark',
      }}
    >
      <div
        id="agency-root"
        data-panel="agency"
        data-theme={effectiveTheme.toLowerCase()}
        className={`agency-root min-h-screen w-full select-none ${
          effectiveTheme === 'Dark' ? 'dark' : ''
        }`}
        style={{
          colorScheme: effectiveTheme === 'Dark' ? 'dark' : 'light',
        }}
      >
        {children}
      </div>
    </AgencyThemeContext.Provider>
  );
};

export const useAgencyTheme = () => {
  const context = useContext(AgencyThemeContext);
  if (!context) {
    throw new Error('useAgencyTheme must be used within an AgencyThemeProvider');
  }
  return context;
};
