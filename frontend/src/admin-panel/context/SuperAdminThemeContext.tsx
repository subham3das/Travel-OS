import React from 'react';
import { useTheme, ThemeMode, EffectiveTheme } from '../../theme/ThemeContext';

export type SuperAdminThemeMode = ThemeMode | 'light' | 'dark' | 'system';
export const SUPER_ADMIN_THEME_STORAGE_KEY = 'apnatrip_theme_mode';

export const SuperAdminThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { effectiveTheme } = useTheme();
  return (
    <div
      id="super-admin-root"
      data-panel="super-admin"
      data-theme={effectiveTheme.toLowerCase()}
      className={`super-admin-root min-h-screen w-full transition-colors duration-200 ${
        effectiveTheme === 'Dark' ? 'dark' : ''
      }`}
    >
      {children}
    </div>
  );
};

export const useSuperAdminTheme = () => {
  const { theme, setTheme, effectiveTheme, isDark, toggleTheme, syncFromProfile } = useTheme();
  return {
    theme,
    setTheme: (mode: SuperAdminThemeMode) => setTheme(mode),
    effectiveTheme,
    isDark,
    toggleTheme,
    syncFromAdminProfile: (adminTheme: SuperAdminThemeMode) => syncFromProfile(adminTheme),
  };
};

export { useTheme };
