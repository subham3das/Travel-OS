/**
 * ── ApnaTrip Unified Design Token System ──────────────────────────────────
 * Single source of truth for the entire ApnaTrip platform ecosystem.
 */

export const BRAND_COLORS = {
  // Primary (Royal Blue)
  primary: {
    DEFAULT: '#2563EB',
    hover: '#1D4ED8',
    light: '#60A5FA',
    subtle: 'rgba(37, 99, 235, 0.08)',
    subtleBorder: 'rgba(37, 99, 235, 0.2)',
  },
  // Accent (Teal)
  accent: {
    DEFAULT: '#06B6D4',
    light: '#67E8F9',
    subtle: 'rgba(6, 182, 212, 0.08)',
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
  // Status
  status: {
    success: {
      DEFAULT: '#22C55E',
      subtle: 'rgba(34, 197, 94, 0.1)',
      border: 'rgba(34, 197, 94, 0.25)',
      text: '#16A34A',
    },
    warning: {
      DEFAULT: '#F59E0B',
      subtle: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.25)',
      text: '#D97706',
    },
    error: {
      DEFAULT: '#EF4444',
      subtle: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.25)',
      text: '#DC2626',
    },
    info: {
      DEFAULT: '#2563EB',
      subtle: 'rgba(37, 99, 235, 0.1)',
      border: 'rgba(37, 99, 235, 0.25)',
      text: '#2563EB',
    },
  },
} as const;

export const TYPOGRAPHY = {
  fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
} as const;

export type ThemeMode = 'Light' | 'Dark' | 'System';
export type EffectiveTheme = 'Light' | 'Dark';
