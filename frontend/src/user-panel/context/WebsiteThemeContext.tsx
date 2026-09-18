import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type WebsiteThemeMode = 'Light' | 'Dark' | 'System' | 'light' | 'dark' | 'system';

interface WebsiteThemeContextType {
  theme: 'Light' | 'Dark' | 'System';
  setTheme: (theme: WebsiteThemeMode) => void;
  effectiveTheme: 'Light' | 'Dark';
  isDark: boolean;
}

const WebsiteThemeContext = createContext<WebsiteThemeContextType | undefined>(undefined);

export const WEBSITE_THEME_STORAGE_KEY = 'website-theme';

const normalizeTheme = (mode?: string | null): 'Light' | 'Dark' | 'System' => {
  if (!mode) return 'Light';
  const lower = mode.toLowerCase();
  if (lower === 'dark') return 'Dark';
  if (lower === 'light') return 'Light';
  return 'System';
};

const getInitialWebsiteTheme = (): 'Light' | 'Dark' | 'System' => {
  try {
    const saved = localStorage.getItem(WEBSITE_THEME_STORAGE_KEY);
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

export const WebsiteThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'Light' | 'Dark' | 'System'>(getInitialWebsiteTheme);
  const [effectiveTheme, setEffectiveTheme] = useState<'Light' | 'Dark'>(() => {
    const initial = getInitialWebsiteTheme();
    return resolveEffectiveTheme(initial);
  });

  const applyTheme = useCallback((mode: 'Light' | 'Dark' | 'System') => {
    const resolved = resolveEffectiveTheme(mode);
    setEffectiveTheme(resolved);

    try {
      localStorage.setItem(WEBSITE_THEME_STORAGE_KEY, mode);
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
    (newTheme: WebsiteThemeMode) => {
      const normalized = normalizeTheme(newTheme);
      setThemeState(normalized);
      applyTheme(normalized);
    },
    [applyTheme]
  );

  return (
    <WebsiteThemeContext.Provider
      value={{
        theme,
        setTheme,
        effectiveTheme,
        isDark: effectiveTheme === 'Dark',
      }}
    >
      <div
        id="website-root"
        data-panel="website"
        data-theme={effectiveTheme.toLowerCase()}
        className={`website-root min-h-screen w-full select-none ${
          effectiveTheme === 'Dark' ? 'dark' : ''
        }`}
        style={{
          colorScheme: effectiveTheme === 'Dark' ? 'dark' : 'light',
        }}
      >
        {children}
      </div>
    </WebsiteThemeContext.Provider>
  );
};

export const useWebsiteTheme = () => {
  const context = useContext(WebsiteThemeContext);
  if (!context) {
    throw new Error('useWebsiteTheme must be used within a WebsiteThemeProvider');
  }
  return context;
};

// Default export alias for User panel components
export const useTheme = useWebsiteTheme;
