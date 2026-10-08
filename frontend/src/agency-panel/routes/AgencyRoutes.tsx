// ─── Agency Panel Route Definitions ──────────────────────────────────────────
// All routes prefixed with /agency
// Wrapped inside isolated AgencyThemeProvider

import React from 'react';
import { Route, Outlet, Navigate } from 'react-router-dom';
import { AgencyProtectedRoute } from './AgencyProtectedRoute';
import { PartnerAuthProtectedRoute } from './PartnerAuthProtectedRoute';
import { AgencyThemeProvider } from '../context/AgencyThemeContext';
import { ActiveBusinessProvider } from '../context/ActiveBusinessContext';

import { AgencyCarRentalActivatePage } from '../pages/car-rental/AgencyCarRentalActivatePage';
import { AgencyCarRentalPendingPage } from '../pages/car-rental/AgencyCarRentalPendingPage';
import { AgencyCarRentalDashboardPage } from '../pages/car-rental/AgencyCarRentalDashboardPage';
import { AgencyCarRentalCarsPage } from '../pages/car-rental/AgencyCarRentalCarsPage';
import { AgencyCarRentalBookingsPage } from '../pages/car-rental/AgencyCarRentalBookingsPage';
import { AgencyCarRentalCalendarPage } from '../pages/car-rental/AgencyCarRentalCalendarPage';
import { AgencyCarRentalDriversPage } from '../pages/car-rental/AgencyCarRentalDriversPage';
import { AgencyCarRentalAnalyticsPage } from '../pages/car-rental/AgencyCarRentalAnalyticsPage';
import { AgencyCarRentalSettingsPage } from '../pages/car-rental/AgencyCarRentalSettingsPage';
import { AgencyCarRentalFleetOverviewPage } from '../pages/car-rental/AgencyCarRentalFleetOverviewPage';
import { AgencyCarRentalCustomersPage } from '../pages/car-rental/AgencyCarRentalCustomersPage';
import { AgencyCarRentalReviewsPage } from '../pages/car-rental/AgencyCarRentalReviewsPage';
import { AgencyCarRentalMessagesPage } from '../pages/car-rental/AgencyCarRentalMessagesPage';
import { AgencyCarRentalNotificationsPage } from '../pages/car-rental/AgencyCarRentalNotificationsPage';

import { AgencyLoginPage } from '../pages/auth/AgencyLoginPage';
import { AgencySignupPage } from '../pages/auth/AgencySignupPage';

import { AgencyForgotPasswordPage } from '../pages/auth/AgencyForgotPasswordPage';
import { AgencyResetPasswordPage } from '../pages/auth/AgencyResetPasswordPage';

import { PartnerLandingPage } from '../pages/onboarding/PartnerLandingPage';
import { PartnerTypeSelectionPage } from '../pages/onboarding/PartnerTypeSelectionPage';
import { PartnerSubscriptionPage } from '../pages/onboarding/PartnerSubscriptionPage';
import { CarRentalOnboardingPage } from '../pages/onboarding/CarRentalOnboardingPage';
import { AgencyBusinessOnboardingPage } from '../pages/onboarding/AgencyBusinessOnboardingPage';
import { AgencyProfileOnboardingPage } from '../pages/onboarding/AgencyProfileOnboardingPage';
import { AgencyVerificationOnboardingPage } from '../pages/onboarding/AgencyVerificationOnboardingPage';
import { AgencyBankOnboardingPage } from '../pages/onboarding/AgencyBankOnboardingPage';
import { AgencyReviewOnboardingPage } from '../pages/onboarding/AgencyReviewOnboardingPage';
import { AgencySubmittedOnboardingPage } from '../pages/onboarding/AgencySubmittedOnboardingPage';
import { AgencyPendingVerificationPage } from '../pages/onboarding/AgencyPendingVerificationPage';
import { AgencyRejectedPage } from '../pages/onboarding/AgencyRejectedPage';
import { AgencyDashboardPage } from '../pages/dashboard/AgencyDashboardPage';
import { AgencyPackagesPage } from '../pages/packages/AgencyPackagesPage';
import { AgencyPackageDetailsPage } from '../pages/packages/AgencyPackageDetailsPage';
import { AgencyEditPackagePage } from '../pages/packages/AgencyEditPackagePage';
import { PackageCreatePage } from '../pages/PackageCreate/PackageCreatePage';
import { AgencyBookingsPage } from '../pages/bookings/AgencyBookingsPage';
import { AgencyNotificationsPage } from '../pages/notifications/AgencyNotificationsPage';
import { AgencyAnalyticsPage } from '../pages/analytics/AgencyAnalyticsPage';
import { AgencyFinancePage } from '../pages/finance/AgencyFinancePage';
import { AgencyCustomerCRMPage } from '../pages/customers/AgencyCustomerCRMPage';
import { AgencyCustomerProfilePage } from '../pages/customers/AgencyCustomerProfilePage';
import { AgencyCustomerInboxPage } from '../pages/inbox/AgencyCustomerInboxPage';

import { AgencyProfilePage } from '../pages/profile/AgencyProfilePage';
import { BusinessInfoPage } from '../pages/profile/BusinessInfoPage';
import { ContactInfoPage } from '../pages/profile/ContactInfoPage';
import { VerificationPage } from '../pages/profile/VerificationPage';
import { BusinessHoursPage } from '../pages/profile/BusinessHoursPage';
import { SocialMediaPage } from '../pages/profile/SocialMediaPage';
import { BankDetailsPage } from '../pages/profile/BankDetailsPage';
import { DocumentsPage } from '../pages/profile/DocumentsPage';
import { AgencySettingsPage } from '../pages/profile/AgencySettingsPage';
import { AgencyPaymentSetupPage } from '../pages/settings/AgencyPaymentSetupPage';
import { useAgencyAuthContext } from '../services/agencyAuth.service';

/**
 * Isolated Agency Theme Wrapper
 */
const AgencyThemeWrapper: React.FC = () => (
  <AgencyThemeProvider>
    <ActiveBusinessProvider>
      <Outlet />
    </ActiveBusinessProvider>
  </AgencyThemeProvider>
);

/**
 * Redirects legacy /agency/verify-phone visits based on login status
 */
const VerifyPhoneRedirect: React.FC = () => {
  const { isAuthenticated } = useAgencyAuthContext();
  return <Navigate to={isAuthenticated ? '/agency/partner/select-business' : '/agency/signup'} replace />;
};

/**
 * Returns all Agency Panel route elements wrapped in isolated AgencyThemeProvider.
 */
export const AgencyRoutes = () => (
  <Route element={<AgencyThemeWrapper />}>
    {/* Public Agency Auth & Redirects */}
    <Route path="/agency" element={<PartnerLandingPage />} />
    <Route path="/agency/onboarding" element={<Navigate to="/agency" replace />} />
    <Route path="/agency/signup" element={<AgencySignupPage initialStep="CREATE_ACCOUNT" />} />
    <Route path="/agency/verify-email" element={<AgencySignupPage initialStep="VERIFY_EMAIL" />} />
    <Route path="/agency/verify-phone" element={<VerifyPhoneRedirect />} />
    <Route path="/agency/login" element={<AgencyLoginPage />} />
    <Route path="/agency/forgot-password" element={<AgencyForgotPasswordPage />} />
    <Route path="/agency/reset-password" element={<AgencyResetPasswordPage />} />

    <Route path="/agency/verification-pending" element={<AgencyPendingVerificationPage />} />
    <Route path="/agency/application-rejected" element={<AgencyRejectedPage />} />

    {/* Protected Partner Onboarding Routes (Requires authenticated PartnerUser) */}
    <Route element={<PartnerAuthProtectedRoute />}>
      <Route path="/agency/partner/select-business" element={<PartnerTypeSelectionPage />} />
      <Route path="/partner/select-business" element={<PartnerTypeSelectionPage />} />
      <Route path="/partner/select-type" element={<PartnerTypeSelectionPage />} />
      <Route path="/partner" element={<PartnerTypeSelectionPage />} />
      <Route path="/agency/onboarding/select-type" element={<PartnerTypeSelectionPage />} />
      <Route path="/agency/onboarding/business" element={<AgencyBusinessOnboardingPage />} />
      <Route path="/partner/agency/onboarding" element={<AgencyBusinessOnboardingPage />} />
      <Route path="/agency/onboarding/car-rental" element={<CarRentalOnboardingPage />} />
      <Route path="/partner/car-rental/onboarding" element={<CarRentalOnboardingPage />} />
      <Route path="/agency/car-rental/onboarding" element={<CarRentalOnboardingPage />} />
      <Route path="/agency/onboarding/payment" element={<PartnerSubscriptionPage />} />
      <Route path="/agency/subscription" element={<PartnerSubscriptionPage />} />
      <Route path="/partner/subscription" element={<PartnerSubscriptionPage />} />
      <Route path="/agency/onboarding/profile" element={<AgencyProfileOnboardingPage />} />
      <Route path="/agency/onboarding/verification" element={<AgencyVerificationOnboardingPage />} />
      <Route path="/agency/onboarding/bank" element={<AgencyBankOnboardingPage />} />
      <Route path="/agency/onboarding/review" element={<AgencyReviewOnboardingPage />} />
    </Route>

    {/* Public Onboarding Status Pages (accessible by both PartnerUser and Agency JWT) */}
    <Route path="/agency/onboarding/submitted" element={<AgencySubmittedOnboardingPage />} />

    {/* Protected Agency Routes */}
    <Route element={<AgencyProtectedRoute />}>
      <Route path="/agency/dashboard" element={<AgencyDashboardPage />} />
      <Route path="/agency/packages" element={<AgencyPackagesPage />} />
      <Route path="/agency/packages/create" element={<PackageCreatePage />} />
      <Route path="/agency/packages/:packageId" element={<AgencyPackageDetailsPage />} />
      <Route path="/agency/packages/:packageId/edit" element={<AgencyEditPackagePage />} />

      {/* Redirect old Trips routes to Bookings operational center */}
      <Route path="/agency/trips/*" element={<Navigate to="/agency/bookings" replace />} />
      <Route path="/agency/trips" element={<Navigate to="/agency/bookings" replace />} />

      <Route path="/agency/bookings" element={<AgencyBookingsPage />} />
      <Route path="/agency/notifications" element={<AgencyNotificationsPage />} />
      <Route path="/agency/analytics" element={<AgencyAnalyticsPage />} />
      <Route path="/agency/finance" element={<AgencyFinancePage />} />
      <Route path="/agency/customers" element={<AgencyCustomerCRMPage />} />
      <Route path="/agency/customers/:customerId" element={<AgencyCustomerProfilePage />} />
      <Route path="/agency/messages" element={<AgencyCustomerInboxPage />} />

      <Route path="/agency/profile" element={<AgencyProfilePage />} />
      <Route path="/agency/profile/business" element={<BusinessInfoPage />} />
      <Route path="/agency/profile/contact" element={<ContactInfoPage />} />
      <Route path="/agency/profile/verification" element={<VerificationPage />} />
      <Route path="/agency/profile/business-hours" element={<BusinessHoursPage />} />
      <Route path="/agency/profile/social-media" element={<SocialMediaPage />} />
      <Route path="/agency/profile/bank" element={<BankDetailsPage />} />
      <Route path="/agency/profile/documents" element={<DocumentsPage />} />
      <Route path="/agency/profile/settings" element={<AgencySettingsPage />} />
      <Route path="/agency/profile/payment" element={<AgencyPaymentSetupPage />} />
      <Route path="/agency/settings/payment" element={<AgencyPaymentSetupPage />} />
      <Route path="/agency/settings" element={<AgencyPaymentSetupPage />} />

      {/* Car Rental Operations & Vertical Routes */}
      <Route path="/agency/car-rental/activate" element={<AgencyCarRentalActivatePage />} />
      <Route path="/agency/car-rental/pending" element={<AgencyCarRentalPendingPage />} />
      <Route path="/agency/car-rental/dashboard" element={<AgencyCarRentalDashboardPage />} />
      <Route path="/agency/car-rental/cars" element={<AgencyCarRentalCarsPage />} />
      <Route path="/agency/car-rental/fleet-overview" element={<AgencyCarRentalFleetOverviewPage />} />
      <Route path="/agency/car-rental/bookings" element={<AgencyCarRentalBookingsPage />} />
      <Route path="/agency/car-rental/calendar" element={<AgencyCarRentalCalendarPage />} />
      <Route path="/agency/car-rental/drivers" element={<AgencyCarRentalDriversPage />} />
      <Route path="/agency/car-rental/customers" element={<AgencyCarRentalCustomersPage />} />
      <Route path="/agency/car-rental/reviews" element={<AgencyCarRentalReviewsPage />} />
      <Route path="/agency/car-rental/analytics" element={<AgencyCarRentalAnalyticsPage />} />
      <Route path="/agency/car-rental/settings" element={<AgencyCarRentalSettingsPage />} />
      <Route path="/agency/car-rental/messages" element={<AgencyCarRentalMessagesPage />} />
      <Route path="/agency/car-rental/notifications" element={<AgencyCarRentalNotificationsPage />} />
    </Route>
  </Route>
);

export default AgencyRoutes;
