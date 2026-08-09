// ─── Super Admin Route Protection ─────────────────────────────────────────────

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

/**
 * Protects all authenticated Super Admin Panel routes.
 * If no valid admin session -> redirect to /admin/login.
 */
export const AdminProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
