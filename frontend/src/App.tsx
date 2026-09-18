import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// ── Agency Panel ────────────────────────────────────────────────────────────
import { AgencyAuthProvider } from './agency-panel/services/agencyAuth.service';
import { AgencyRoutes } from './agency-panel/routes/AgencyRoutes';
import { ToastProvider, PermissionProvider } from './agency-panel/providers';

// ── User Panel ─────────────────────────────────────────────────────────────
import { UserRoutes } from './user-panel/routes/UserRoutes';
import { ToastProvider as UserToastProvider } from './user-panel/context/ToastContext';

// ── Super Admin Panel ────────────────────────────────────────────────────────
import { AdminAuthProvider } from './admin-panel/context/AdminAuthContext';
import { AdminRoutes } from './admin-panel/routes/AdminRoutes';

export const App: React.FC = () => {
  useEffect(() => {
    // Purge any stale legacy global dark class or attributes on document elements
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-theme');
    document.body.classList.remove('dark');
    document.body.removeAttribute('data-theme');
  }, []);

  return (
    <AuthProvider>
      <UserToastProvider>
        <AgencyAuthProvider>
          <PermissionProvider>
            <ToastProvider>
              <AdminAuthProvider>
                <BrowserRouter>
                  <Routes>
                    {/* ── Agency Panel Routes (/agency/...) ─────────────────────── */}
                    {AgencyRoutes()}

                    {/* ── Super Admin Panel Routes (/admin/...) ─────────────────── */}
                    {AdminRoutes()}

                    {/* ── User Panel Routes (/, /home, /trips, etc.) ──────────────── */}
                    {UserRoutes()}

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </BrowserRouter>
              </AdminAuthProvider>
            </ToastProvider>
          </PermissionProvider>
        </AgencyAuthProvider>
      </UserToastProvider>
    </AuthProvider>
  );
};

export default App;
