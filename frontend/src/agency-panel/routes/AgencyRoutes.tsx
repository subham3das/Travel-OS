// ─── Agency Panel Route Definitions ──────────────────────────────────────────
// All routes prefixed with /agency

import React from 'react';
import { Route } from 'react-router-dom';
import { AgencyProtectedRoute } from './AgencyProtectedRoute';

import { AgencyLoginPage } from '../pages/auth/AgencyLoginPage';
import { AgencySignupPage } from '../pages/auth/AgencySignupPage';
import { AgencyOnboardingPage } from '../pages/onboarding/AgencyOnboardingPage';
import { AgencyBusinessOnboardingPage } from '../pages/onboarding/AgencyBusinessOnboardingPage';
import { AgencyProfileOnboardingPage } from '../pages/onboarding/AgencyProfileOnboardingPage';
import { AgencyVerificationOnboardingPage } from '../pages/onboarding/AgencyVerificationOnboardingPage';
import { AgencyBankOnboardingPage } from '../pages/onboarding/AgencyBankOnboardingPage';
import { AgencyReviewOnboardingPage } from '../pages/onboarding/AgencyReviewOnboardingPage';
import { AgencySubmittedOnboardingPage } from '../pages/onboarding/AgencySubmittedOnboardingPage';
import { AgencyPendingVerificationPage } from '../pages/onboarding/AgencyPendingVerificationPage';
import { AgencyRejectedPage } from '../pages/onboarding/AgencyRejectedPage';
import { AgencyDashboardPage } from '../pages/dashboard/AgencyDashboardPage';
import { AgencyTripsPage } from '../pages/trips/AgencyTripsPage';
import { AgencyTripDetailPage } from '../pages/trips/AgencyTripDetailPage';
import { AgencyManageTeamPage } from '../pages/trips/AgencyManageTeamPage';
import { AgencyManageVehiclePage } from '../pages/trips/AgencyManageVehiclePage';
import { AgencyTripTravelersPage } from '../pages/trips/AgencyTripTravelersPage';
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

/**
 * Returns all Agency Panel route elements to be embedded inside <Routes>.
 */
export const AgencyRoutes = () => (
  <>
    {/* Public Agency Routes */}
    <Route path="/agency" element={<AgencyOnboardingPage />} />
    <Route path="/agency/onboarding" element={<AgencyOnboardingPage />} />
    <Route path="/agency/onboarding/business" element={<AgencyBusinessOnboardingPage />} />
    <Route path="/agency/onboarding/profile" element={<AgencyProfileOnboardingPage />} />
    <Route path="/agency/onboarding/verification" element={<AgencyVerificationOnboardingPage />} />
    <Route path="/agency/onboarding/bank" element={<AgencyBankOnboardingPage />} />
    <Route path="/agency/onboarding/review" element={<AgencyReviewOnboardingPage />} />
    <Route path="/agency/onboarding/submitted" element={<AgencySubmittedOnboardingPage />} />
    <Route path="/agency/verification-pending" element={<AgencyPendingVerificationPage />} />
    <Route path="/agency/application-rejected" element={<AgencyRejectedPage />} />
    <Route path="/agency/login" element={<AgencyLoginPage />} />
    <Route path="/agency/signup" element={<AgencySignupPage />} />

    {/* Protected Agency Routes */}
    <Route element={<AgencyProtectedRoute />}>
      <Route path="/agency/dashboard" element={<AgencyDashboardPage />} />
      <Route path="/agency/packages" element={<AgencyPackagesPage />} />
      <Route path="/agency/packages/create" element={<PackageCreatePage />} />
      <Route path="/agency/packages/:packageId" element={<AgencyPackageDetailsPage />} />
      <Route path="/agency/packages/:packageId/edit" element={<AgencyEditPackagePage />} />

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

      <Route path="/agency/trips" element={<AgencyTripsPage />} />
      <Route path="/agency/trips/:tripId" element={<AgencyTripDetailPage />} />
      <Route path="/agency/trips/:tripId/team" element={<AgencyManageTeamPage />} />
      <Route path="/agency/trips/:tripId/vehicle" element={<AgencyManageVehiclePage />} />
      <Route path="/agency/trips/:tripId/travelers" element={<AgencyTripTravelersPage />} />
      <Route path="/agency/team" element={<AgencyManageTeamPage />} />
    </Route>
  </>
);
