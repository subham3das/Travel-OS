// ─── Agency Panel Route Protection ───────────────────────────────────────────

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAgencyAuthContext } from '../services/agencyAuth.service';
import { AgencyVerificationStatus } from '../types/agency';

/**
 * Protects all authenticated Agency Panel routes (e.g. /agency/dashboard, /agency/bookings).
 * An agency MUST be authenticated AND have AgencyVerificationStatus.APPROVED / ACTIVE
 * to access protected dashboard features.
 * Also enforces mandatory password creation before accessing protected dashboard.
 */
export const AgencyProtectedRoute: React.FC = () => {
  const { isAuthenticated, agency, token } = useAgencyAuthContext();

  // If not authenticated or token missing, immediately redirect to login
  if (!isAuthenticated || !agency || !token) {
    return <Navigate to="/agency/login" replace />;
  }

  const rawStatus = String(agency.verificationStatus || '');
  const onboardingStatus = String(agency.onboardingStatus || '');

  if (rawStatus === 'REJECTED' || onboardingStatus === 'REJECTED') {
    return <Navigate to="/agency/application-rejected" replace />;
  }

  // Mandatory first login password change enforcement if set
  if (agency.passwordChanged === false) {
    return <Navigate to="/agency/create-new-password" replace />;
  }

  // Partner is authenticated - permit dashboard view to render contextual onboarding state machine
  return <Outlet />;
};

export default AgencyProtectedRoute;
