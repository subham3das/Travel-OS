import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminApiClient } from '../services/adminApiClient';

export type SuperAdminThemeMode = 'Light' | 'Dark' | 'System' | 'light' | 'dark' | 'system';

interface SuperAdminThemeContextType {
  theme: 'Light' | 'Dark' | 'System';
  setTheme: (theme: SuperAdminThemeMode, persist?: boolean) => void;
  effectiveTheme: 'Light' | 'Dark';
  isDark: boolean;
  syncFromAdminProfile: (adminTheme: SuperAdminThemeMode) => void;
}

const SuperAdminThemeContext = createContext<SuperAdminThemeContextType | undefined>(undefined);

export const SUPER_ADMIN_THEME_STORAGE_KEY = 'super-admin-theme';

const normalizeTheme = (mode?: string | null): 'Light' | 'Dark' | 'System' => {
  if (!mode) return 'System';
  const lower = mode.toLowerCase();
  if (lower === 'dark') return 'Dark';
  if (lower === 'light') return 'Light';
  return 'System';
};

const getInitialSuperAdminTheme = (): 'Light' | 'Dark' | 'System' => {
  try {
    const saved = localStorage.getItem(SUPER_ADMIN_THEME_STORAGE_KEY);
    return normalizeTheme(saved);
  } catch {
    return 'System';
  }
};

const resolveEffectiveTheme = (mode: 'Light' | 'Dark' | 'System'): 'Light' | 'Dark' => {
  if (mode === 'Dark') return 'Dark';
  if (mode === 'Light') return 'Light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light';
};

export const SuperAdminThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'Light' | 'Dark' | 'System'>(getInitialSuperAdminTheme);
  const [effectiveTheme, setEffectiveTheme] = useState<'Light' | 'Dark'>(() => {
    const initial = getInitialSuperAdminTheme();
    return resolveEffectiveTheme(initial);
  });

  // Apply theme changes to storage and state (NO global html/body mutation)
  const applyTheme = useCallback((mode: 'Light' | 'Dark' | 'System') => {
    const resolved = resolveEffectiveTheme(mode);
    setEffectiveTheme(resolved);

    try {
      localStorage.setItem(SUPER_ADMIN_THEME_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, []);

  // System theme change listener (prefers-color-scheme)
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

  // Set theme method (updates state, local storage and syncs to backend if authenticated)
  const setTheme = useCallback(
    (newTheme: SuperAdminThemeMode, persist: boolean = true) => {
      const normalized = normalizeTheme(newTheme);
      setThemeState(normalized);
      applyTheme(normalized);

      if (persist && adminApiClient.getAccessToken()) {
        adminApiClient
          .patch('/admin/profile/preferences', { theme: normalized })
          .catch((err) => {
            console.warn('Failed to persist super admin theme preference to backend:', err);
          });
      }
    },
    [applyTheme]
  );

  // Sync theme when administrator profile is retrieved from backend
  const syncFromAdminProfile = useCallback(
    (adminTheme: SuperAdminThemeMode) => {
      const normalized = normalizeTheme(adminTheme);
      if (normalized && normalized !== theme) {
        setThemeState(normalized);
        applyTheme(normalized);
      }
    },
    [theme, applyTheme]
  );

  return (
    <SuperAdminThemeContext.Provider
      value={{
        theme,
        setTheme,
        effectiveTheme,
        isDark: effectiveTheme === 'Dark',
        syncFromAdminProfile,
      }}
    >
      <div
        id="super-admin-root"
        data-panel="super-admin"
        data-theme={effectiveTheme.toLowerCase()}
        className={`super-admin-root min-h-screen w-full select-none ${
          effectiveTheme === 'Dark' ? 'dark' : ''
        }`}
        style={{
          colorScheme: effectiveTheme === 'Dark' ? 'dark' : 'light',
        }}
      >
        {children}
      </div>
    </SuperAdminThemeContext.Provider>
  );
};

export const useSuperAdminTheme = () => {
  const context = useContext(SuperAdminThemeContext);
  if (!context) {
    throw new Error('useSuperAdminTheme must be used within a SuperAdminThemeProvider');
  }
  return context;
};

// Default export alias for seamless admin component consumption
export const useTheme = useSuperAdminTheme;
