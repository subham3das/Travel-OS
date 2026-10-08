import React from 'react';
import { useTheme, ThemeMode, EffectiveTheme } from '../../theme/ThemeContext';

export type WebsiteThemeMode = ThemeMode | 'light' | 'dark' | 'system';
export const WEBSITE_THEME_STORAGE_KEY = 'apnatrip_theme_mode';

export const WebsiteThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { effectiveTheme } = useTheme();
  return (
    <div
      id="website-root"
      data-panel="website"
      data-theme={effectiveTheme.toLowerCase()}
      className={`website-root min-h-screen w-full transition-colors duration-200 ${
        effectiveTheme === 'Dark' ? 'dark' : ''
      }`}
    >
      {children}
    </div>
  );
};

export const useWebsiteTheme = () => {
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
