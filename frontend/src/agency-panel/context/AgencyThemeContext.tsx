import React from 'react';
import { useTheme, ThemeMode, EffectiveTheme } from '../../theme/ThemeContext';

export type AgencyThemeMode = ThemeMode | 'light' | 'dark' | 'system';
export const AGENCY_THEME_STORAGE_KEY = 'apnatrip_theme_mode';

export const AgencyThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { effectiveTheme } = useTheme();
  return (
    <div
      id="agency-root"
      data-panel="agency"
      data-theme={effectiveTheme.toLowerCase()}
      className={`agency-root min-h-screen w-full transition-colors duration-200 ${
        effectiveTheme === 'Dark' ? 'dark' : ''
      }`}
    >
      {children}
    </div>
  );
};

export const useAgencyTheme = () => {
  const { theme, setTheme, effectiveTheme, isDark, toggleTheme } = useTheme();
  return {
    theme,
    setTheme,
    effectiveTheme,
    isDark,
    toggleTheme,
  };
};

export { useTheme };
