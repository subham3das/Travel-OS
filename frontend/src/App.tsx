import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

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
  return (
    <ThemeProvider>
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
  </ThemeProvider>
  );
};

export default App;
