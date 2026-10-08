/**
 * ── ApnaTrip Unified Design Token System ──────────────────────────────────
 * Single source of truth for the entire ApnaTrip platform ecosystem.
 * Covers: User Panel, Agency Panel, Admin Panel, Landing Website, Auth Pages.
 */

export const BRAND_COLORS = {
  // Primary (Royal Blue)
  primary: {
    DEFAULT: '#2563EB',
    hover: '#1D4ED8',
    light: '#60A5FA',
    subtle: 'rgba(37, 99, 235, 0.1)',
    subtleBorder: 'rgba(37, 99, 235, 0.2)',
  },
  // Accent (Teal)
  accent: {
    DEFAULT: '#06B6D4',
    light: '#67E8F9',
    subtle: 'rgba(6, 182, 212, 0.1)',
    subtleBorder: 'rgba(6, 182, 212, 0.2)',
  },
  // Neutral Scale
  neutral: {
    navy: '#0F172A',
    gray900: '#111827',
    gray700: '#374151',
    gray500: '#6B7280',
    gray300: '#D1D5DB',
    gray100: '#F3F4F6',
    background: '#F8FAFC',
    white: '#FFFFFF',
  },
  // Status Invariants
  status: {
    success: {
      DEFAULT: '#22C55E',
      subtle: 'rgba(34, 197, 94, 0.1)',
      border: 'rgba(34, 197, 94, 0.25)',
      text: '#16A34A',
      darkText: '#4ADE80',
    },
    warning: {
      DEFAULT: '#F59E0B',
      subtle: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.25)',
      text: '#D97706',
      darkText: '#FBBF24',
    },
    error: {
      DEFAULT: '#EF4444',
      subtle: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.25)',
      text: '#DC2626',
      darkText: '#F87171',
    },
    info: {
      DEFAULT: '#2563EB',
      subtle: 'rgba(37, 99, 235, 0.1)',
      border: 'rgba(37, 99, 235, 0.25)',
      text: '#2563EB',
      darkText: '#60A5FA',
    },
  },
} as const;

export const TYPOGRAPHY = {
  fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  scale: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
} as const;

export const SHADOWS = {
  cardLight: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
  cardDark: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
  dropdownLight: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
  dropdownDark: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
} as const;

export type ThemeMode = 'Light' | 'Dark' | 'System';
export type EffectiveTheme = 'Light' | 'Dark';

export interface ThemeColors {
  appBg: string;
  appBgSecondary: string;
  cardBg: string;
  cardBorder: string;
  borderSubtle: string;
  borderStrong: string;
  surfaceHover: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  brandPrimary: string;
  brandPrimaryHover: string;
  brandPrimaryLight: string;
  brandAccent: string;
  brandAccentLight: string;
}

export const THEME_PALETTES: Record<EffectiveTheme, ThemeColors> = {
  Light: {
    appBg: BRAND_COLORS.neutral.background, // #F8FAFC
    appBgSecondary: BRAND_COLORS.neutral.gray100, // #F3F4F6
    cardBg: BRAND_COLORS.neutral.white, // #FFFFFF
    cardBorder: '#E2E8F0',
    borderSubtle: '#F1F5F9',
    borderStrong: '#CBD5E1',
    surfaceHover: '#F8FAFC',
    textPrimary: BRAND_COLORS.neutral.navy, // #0F172A
    textSecondary: BRAND_COLORS.neutral.gray700, // #374151
    textMuted: BRAND_COLORS.neutral.gray500, // #6B7280
    brandPrimary: BRAND_COLORS.primary.DEFAULT, // #2563EB
    brandPrimaryHover: BRAND_COLORS.primary.hover, // #1D4ED8
    brandPrimaryLight: BRAND_COLORS.primary.light, // #60A5FA
    brandAccent: BRAND_COLORS.accent.DEFAULT, // #06B6D4
    brandAccentLight: BRAND_COLORS.accent.light, // #67E8F9
  },
  Dark: {
    appBg: BRAND_COLORS.neutral.navy, // #0F172A
    appBgSecondary: BRAND_COLORS.neutral.gray900, // #111827
    cardBg: '#1E293B', // Premium Card Slate
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    borderSubtle: 'rgba(255, 255, 255, 0.05)',
    borderStrong: 'rgba(255, 255, 255, 0.15)',
    surfaceHover: '#334155',
    textPrimary: BRAND_COLORS.neutral.white, // #FFFFFF
    textSecondary: BRAND_COLORS.neutral.gray300, // #D1D5DB
    textMuted: '#94A3B8',
    brandPrimary: BRAND_COLORS.primary.DEFAULT, // #2563EB
    brandPrimaryHover: BRAND_COLORS.primary.hover, // #1D4ED8
    brandPrimaryLight: BRAND_COLORS.primary.light, // #60A5FA
    brandAccent: BRAND_COLORS.accent.DEFAULT, // #06B6D4
    brandAccentLight: BRAND_COLORS.accent.light, // #67E8F9
  },
};
