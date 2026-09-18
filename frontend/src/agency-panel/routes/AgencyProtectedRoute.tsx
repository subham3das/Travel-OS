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
  const isApproved =
    rawStatus === 'APPROVED' ||
    rawStatus === 'VERIFIED' ||
    agency.verificationStatus === AgencyVerificationStatus.APPROVED ||
    agency.status === 'ACTIVE';

  if (isApproved) {
    // Mandatory first login password change enforcement
    if (agency.passwordChanged === false) {
      return <Navigate to="/agency/create-new-password" replace />;
    }
    return <Outlet />;
  }

  if (rawStatus === 'PENDING' || agency.verificationStatus === AgencyVerificationStatus.PENDING) {
    return <Navigate to="/agency/onboarding" replace />;
  }

  if (rawStatus === 'REJECTED' || agency.verificationStatus === AgencyVerificationStatus.REJECTED) {
    return <Navigate to="/agency/application-rejected" replace />;
  }

  return <Navigate to="/agency/verification-pending" replace />;
};

export default AgencyProtectedRoute;
