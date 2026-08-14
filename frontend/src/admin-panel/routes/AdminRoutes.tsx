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
import { AdminSettingsPage } from '../pages/Settings/AdminSettingsPage';
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
        <Route path="/admin/agencies" element={<AdminAgenciesPage />} />
        <Route path="/admin/agencies/:agencyId" element={<AdminAgencyDetailsPage />} />
        <Route path="/admin/verification-pending" element={<AdminVerificationPendingPage />} />
        <Route path="/super-admin/agency-requests" element={<AdminVerificationPendingPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/super-admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/packages" element={<AdminPackagesPage />} />
        <Route path="/super-admin/packages" element={<AdminPackagesPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
      </Route>
    </Route>

    {/* Fallback 404 for Admin Panel */}
    <Route path="/admin/*" element={<AdminNotFoundPage />} />
  </>
);
