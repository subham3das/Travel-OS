import { useContext } from 'react';
import { ThemeContext } from './ThemeContextCore';
import type { ThemeContextType } from './ThemeContextCore';

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
