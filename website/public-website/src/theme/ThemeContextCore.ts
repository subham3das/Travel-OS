import { createContext } from 'react';
import type { ThemeMode, EffectiveTheme } from './designTokens';

export interface ThemeContextType {
  theme: ThemeMode;
  effectiveTheme: EffectiveTheme;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
