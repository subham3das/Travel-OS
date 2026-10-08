// ─── Partner Account Route Protection ───────────────────────────────────────────
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAgencyAuthContext } from '../services/agencyAuth.service';

/**
 * Protects partner onboarding routes (e.g. /agency/partner/select-business, /agency/onboarding/business, etc.)
 * Requires:
 * - Partner is authenticated
 * - Valid JWT token exists
 * - Partner user profile exists
 *
 * If not authenticated, redirects directly to /agency/signup.
 */
export const PartnerAuthProtectedRoute: React.FC = () => {
  const { isAuthenticated, token, agencyUser } = useAgencyAuthContext();

  if (!isAuthenticated || !token || !agencyUser) {
    return <Navigate to="/agency/signup" replace />;
  }

  return <Outlet />;
};

export default PartnerAuthProtectedRoute;
