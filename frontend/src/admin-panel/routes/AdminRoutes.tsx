// ─── Super Admin Panel Route Definitions ──────────────────────────────────────
// All routes prefixed with /admin

import React from 'react';
import { Route } from 'react-router-dom';
import { AdminProtectedRoute } from './AdminProtectedRoute';
import { AdminLayout } from '../layouts/AdminLayout/AdminLayout';

import { AdminLoginPage } from '../pages/Login/AdminLoginPage';
import { AdminDashboardPage } from '../pages/Dashboard/AdminDashboardPage';
import { AdminAgenciesPage } from '../pages/Agencies/AdminAgenciesPage';
import { AdminAgencyDetailsPage } from '../pages/AgencyDetails/AdminAgencyDetailsPage';
import { AdminVerificationPendingPage } from '../pages/VerificationPending/AdminVerificationPendingPage';
import { AdminUsersPage } from '../pages/Users/AdminUsersPage';
import { AdminPackagesPage } from '../pages/Packages/AdminPackagesPage';
import { AdminBookingsPage } from '../pages/Bookings/AdminBookingsPage';
import { AdminPaymentsPage } from '../pages/Payments/AdminPaymentsPage';
import { AdminFinancePage } from '../pages/Finance/AdminFinancePage';
import { AdminTripsPage } from '../pages/Trips/AdminTripsPage';
import { AdminReviewsPage } from '../pages/Reviews/AdminReviewsPage';
import { AdminCommunityPage } from '../pages/Community/AdminCommunityPage';
import { AdminSupportPage } from '../pages/Support/AdminSupportPage';
import { AdminNotificationsPage } from '../pages/Notifications/AdminNotificationsPage';
import { AdminReportsPage } from '../pages/Reports/AdminReportsPage';
import { AdminCMSPage } from '../pages/CMS/AdminCMSPage';
import { AdminRolesPage } from '../pages/Roles/AdminRolesPage';
import { AdminAuditLogsPage } from '../pages/AuditLogs/AdminAuditLogsPage';
import { AdminSettingsPage } from '../pages/Settings/AdminSettingsPage';
import { AdminProfilePage } from '../pages/Profile/AdminProfilePage';
import { AdminNotFoundPage } from '../pages/NotFound/AdminNotFoundPage';

/**
 * Returns all Super Admin Panel route elements to be embedded inside <Routes>.
 * Usage in App.tsx:
 *   <>
 *     {AdminRoutes()}
 *   </>
 */
export const AdminRoutes = () => (
  <>
    {/* Public Admin Routes */}
    <Route path="/admin/login" element={<AdminLoginPage />} />

    {/* Protected Admin Routes embedded in AdminLayout */}
    <Route element={<AdminProtectedRoute />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/super-admin" element={<AdminDashboardPage />} />
        <Route path="/super-admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/super-admin/help" element={<AdminSupportPage />} />
        <Route path="/admin/agencies" element={<AdminAgenciesPage />} />
        <Route path="/admin/agencies/:agencyId" element={<AdminAgencyDetailsPage />} />
        <Route path="/admin/verification-pending" element={<AdminVerificationPendingPage />} />
        <Route path="/super-admin/agency-requests" element={<AdminVerificationPendingPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/super-admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/packages" element={<AdminPackagesPage />} />
        <Route path="/super-admin/packages" element={<AdminPackagesPage />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        <Route path="/super-admin/bookings" element={<AdminBookingsPage />} />
        <Route path="/admin/payments" element={<AdminPaymentsPage />} />
        <Route path="/super-admin/payments" element={<AdminPaymentsPage />} />
        <Route path="/admin/finance" element={<AdminFinancePage />} />
        <Route path="/super-admin/finance" element={<AdminFinancePage />} />
        <Route path="/admin/trips" element={<AdminTripsPage />} />
        <Route path="/super-admin/trips" element={<AdminTripsPage />} />
        <Route path="/admin/reviews" element={<AdminReviewsPage />} />
        <Route path="/super-admin/reviews" element={<AdminReviewsPage />} />
        <Route path="/admin/community" element={<AdminCommunityPage />} />
        <Route path="/super-admin/community" element={<AdminCommunityPage />} />
        <Route path="/admin/support" element={<AdminSupportPage />} />
        <Route path="/super-admin/support" element={<AdminSupportPage />} />
        <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
        <Route path="/super-admin/notifications" element={<AdminNotificationsPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/super-admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/cms" element={<AdminCMSPage />} />
        <Route path="/super-admin/cms" element={<AdminCMSPage />} />
        <Route path="/admin/roles" element={<AdminRolesPage />} />
        <Route path="/super-admin/roles" element={<AdminRolesPage />} />
        <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="/super-admin/audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/super-admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
        <Route path="/super-admin/profile" element={<AdminProfilePage />} />
      </Route>
    </Route>

    {/* Fallback 404 for Admin Panel */}
    <Route path="/admin/*" element={<AdminNotFoundPage />} />
    <Route path="/super-admin/*" element={<AdminNotFoundPage />} />
  </>
);
