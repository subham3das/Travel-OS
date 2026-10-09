// ─── Agency Panel Route Protection ───────────────────────────────────────────

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAgencyAuthContext } from '../services/agencyAuth.service';
import { agencyApiClient } from '../services/agencyApiClient';

/**
 * Protects all authenticated Agency Panel routes (e.g. /agency/dashboard, /agency/bookings).
 * An agency MUST be authenticated AND have approvalStatus/onboardingStatus = APPROVED / ACTIVE
 * to access protected dashboard features.
 * Pending agencies are routed to /agency/verification-pending.
 * Rejected agencies are routed to /agency/application-rejected.
 * Never redirects to user routes.
 */
export const AgencyProtectedRoute: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, agency, agencyUser, token } = useAgencyAuthContext();

  const currentRoute = location.pathname;
  const userRole = agencyUser?.role || 'AGENCY';
  const partnerType = agency?.businessTypes?.[0] || agency?.activeBusiness || 'agency';
  const rawStatus = String(agency?.verificationStatus || '');
  const approvalStatus = agency?.verificationStatus || agency?.approvalStatus || 'PENDING';
  const onboardingStatus = String(agency?.onboardingStatus || '');
  const refreshToken = agencyApiClient.getRefreshToken() || localStorage.getItem('agencyRefreshToken') || '';
  const sessionType = 'AGENCY_PARTNER_SESSION';

  // Trace diagnostic information
  console.log('[AgencyGuard] Route Evaluation:', {
    currentRoute,
    userRole,
    partnerType,
    approvalStatus,
    onboardingStatus,
    hasAccessToken: !!token,
    hasRefreshToken: !!refreshToken,
    sessionType,
    isAuthenticated,
  });

  // 1. Unauthenticated or missing token -> Agency Login only
  if (!isAuthenticated || !agency || !token) {
    console.warn('[AgencyGuard] Unauthenticated agency. Redirecting to /agency/login (from', currentRoute, ')');
    return <Navigate to="/agency/login" state={{ from: location }} replace />;
  }

  // 2. Rejected status -> Application Rejected page
  if (rawStatus === 'REJECTED' || onboardingStatus === 'REJECTED' || agency.status === 'REJECTED') {
    console.warn('[AgencyGuard] Agency application is REJECTED. Redirecting to /agency/application-rejected');
    return <Navigate to="/agency/application-rejected" replace />;
  }

  // 3. Payment Pending -> Onboarding Payment
  if (onboardingStatus === 'PAYMENT_PENDING') {
    console.warn('[AgencyGuard] Payment pending. Redirecting to /agency/onboarding/payment');
    return <Navigate to="/agency/onboarding/payment" replace />;
  }

  // 4. Pending Verification / Under Review -> Verification Pending page
  const isApproved =
    onboardingStatus === 'APPROVED' ||
    rawStatus === 'APPROVED' ||
    rawStatus === 'VERIFIED' ||
    agency.status === 'ACTIVE' ||
    agency.approvalStatus === 'APPROVED';

  if (!isApproved) {
    console.warn('[AgencyGuard] Agency approval pending. Redirecting to /agency/verification-pending');
    return <Navigate to="/agency/verification-pending" replace />;
  }

  // 5. Approved Agency -> Grant Dashboard Access
  console.log('[AgencyGuard] Agency verified and APPROVED. Access granted to:', currentRoute);
  return <Outlet />;
};

export default AgencyProtectedRoute;
