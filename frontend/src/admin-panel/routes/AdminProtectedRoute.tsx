// ─── Super Admin Route Protection ─────────────────────────────────────────────

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

/**
 * Protects all authenticated Super Admin Panel routes.
 * If validating session -> render admin loading state.
 * If no valid admin session -> redirect to /admin/login.
 */
export const AdminProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[#583BE8]/20 border-t-[#583BE8] rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-400">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
