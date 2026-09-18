// ─── Theme Context Bridge ────────────────────────────────────────────────────────
// NOTICE: Each panel now uses its own isolated theme provider:
// - Super Admin: SuperAdminThemeProvider (super-admin-theme)
// - Agency Panel: AgencyThemeProvider (agency-theme)
// - Customer Website: WebsiteThemeProvider (website-theme)
// ────────────────────────────────────────────────────────────────────────────────

export type ThemeMode = 'Light' | 'Dark' | 'System' | 'light' | 'dark' | 'system';

export {
  SuperAdminThemeProvider,
  useSuperAdminTheme,
  useTheme as useAdminTheme,
} from '../admin-panel/context/SuperAdminThemeContext';

export {
  AgencyThemeProvider,
  useAgencyTheme,
} from '../agency-panel/context/AgencyThemeContext';

export {
  WebsiteThemeProvider,
  useWebsiteTheme,
  useTheme,
} from '../user-panel/context/WebsiteThemeContext';
