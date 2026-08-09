import { useAgencyAuthContext } from '../services/agencyAuth.service';

/**
 * Convenience hook — use inside any Agency Panel component.
 * Provides: isAuthenticated, agencyUser, agency, loginAgency, logoutAgency.
 */
export const useAgencyAuth = () => {
  return useAgencyAuthContext();
};
