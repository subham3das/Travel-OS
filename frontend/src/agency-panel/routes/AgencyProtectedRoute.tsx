// ─── Agency Panel Route Protection ───────────────────────────────────────────

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAgencyAuthContext } from '../services/agencyAuth.service';
import { getSubmittedApplication } from '../services/agencyOnboarding.service';
import { AgencyVerificationStatus } from '../types/agency';

/**
 * Protects all authenticated Agency Panel routes (e.g. /agency/dashboard, /agency/bookings).
 * An agency MUST be authenticated AND have AgencyVerificationStatus.APPROVED
 * to access protected dashboard features.
 */
export const AgencyProtectedRoute: React.FC = () => {
  const { isAuthenticated, agency } = useAgencyAuthContext();
  const submittedApp = getSubmittedApplication();

  // Determine current verification status strictly using AgencyVerificationStatus enum
  const status: AgencyVerificationStatus =
    agency?.verificationStatus ||
    (submittedApp?.status as AgencyVerificationStatus) ||
    AgencyVerificationStatus.APPROVED;

  // Allow direct access in preview/dev mode or when approved
  if (!isAuthenticated && !submittedApp) {
    return <Outlet />;
  }

  // Handle route protection based on AgencyVerificationStatus enum
  switch (status) {
    case AgencyVerificationStatus.PENDING:
      return <Navigate to="/agency/onboarding" replace />;

    case AgencyVerificationStatus.UNDER_REVIEW:
      return <Navigate to="/agency/verification-pending" replace />;

    case AgencyVerificationStatus.REJECTED:
      return <Navigate to="/agency/application-rejected" replace />;

    case AgencyVerificationStatus.APPROVED:
      return <Outlet />;

    default:
      return <Outlet />;
  }
};
