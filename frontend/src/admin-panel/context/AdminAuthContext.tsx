// ─── Super Admin Auth Context ──────────────────────────────────────────────────
// Production authentication context for Super Admin Panel with MongoDB synchronization.

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Admin, AdminAuthState } from '../types/admin';
import { adminApiClient, ADMIN_AUTH_STORAGE_KEYS } from '../services/adminApiClient';
import { getAdminMeService, logoutAdminService } from '../services/adminAuth.service';

interface AdminAuthContextType extends AdminAuthState {
  loginAdmin: (admin: Admin, token: string, refreshToken?: string) => void;
  logoutAdmin: () => Promise<void>;
  updateAdmin: (partial: Partial<Admin>) => void;
  refreshAdmin: () => Promise<void>;
}

const loadInitialState = (): AdminAuthState => {
  try {
    const raw = localStorage.getItem(ADMIN_AUTH_STORAGE_KEYS.ADMIN_AUTH_STATE);
    const token = adminApiClient.getAccessToken();
    if (raw && token) {
      const parsed = JSON.parse(raw);
      return {
        isAuthenticated: true,
        isLoading: false,
        admin: parsed.admin || null,
        token: token,
        refreshToken: adminApiClient.getRefreshToken(),
        sessionStartedAt: parsed.sessionStartedAt || new Date().toISOString(),
      };
    }
  } catch {
    // ignore
  }

  return {
    isAuthenticated: false,
    isLoading: !!adminApiClient.getAccessToken(),
    admin: null,
    token: null,
    refreshToken: null,
    sessionStartedAt: null,
  };
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AdminAuthState>(loadInitialState);

  const logoutAdmin = useCallback(async () => {
    try {
      await logoutAdminService();
    } catch {
      // ignore
    }
    adminApiClient.clearTokens();
    setState({
      isAuthenticated: false,
      isLoading: false,
      admin: null,
      token: null,
      refreshToken: null,
      sessionStartedAt: null,
    });
  }, []);

  // Listen to unauthorized global events from adminApiClient
  useEffect(() => {
    adminApiClient.setOnUnauthorized(() => {
      logoutAdmin();
    });
  }, [logoutAdmin]);

  // Synchronize authenticated admin from MongoDB on initial mount or page refresh
  const refreshAdmin = useCallback(async () => {
    const token = adminApiClient.getAccessToken() || adminApiClient.getRefreshToken();
    if (!token) {
      setState((prev) => ({ ...prev, isAuthenticated: false, isLoading: false, admin: null }));
      return;
    }

    try {
      const liveAdmin = await getAdminMeService();
      if (liveAdmin && liveAdmin.isActive) {
        setState({
          isAuthenticated: true,
          isLoading: false,
          admin: liveAdmin,
          token: adminApiClient.getAccessToken(),
          refreshToken: adminApiClient.getRefreshToken(),
          sessionStartedAt: new Date().toISOString(),
        });
        localStorage.setItem(
          ADMIN_AUTH_STORAGE_KEYS.ADMIN_AUTH_STATE,
          JSON.stringify({ admin: liveAdmin, sessionStartedAt: new Date().toISOString() })
        );
        if (liveAdmin.preferences?.theme) {
          const theme = liveAdmin.preferences.theme;
          localStorage.setItem('super-admin-theme', theme);
        }
      } else {
        await logoutAdmin();
      }
    } catch {
      await logoutAdmin();
    }
  }, [logoutAdmin]);

  useEffect(() => {
    refreshAdmin();
  }, [refreshAdmin]);

  const loginAdmin = useCallback((admin: Admin, token: string, refreshToken?: string) => {
    const sessionStartedAt = new Date().toISOString();
    const next: AdminAuthState = {
      isAuthenticated: true,
      isLoading: false,
      admin,
      token,
      refreshToken: refreshToken || null,
      sessionStartedAt,
    };
    setState(next);
    try {
      localStorage.setItem(
        ADMIN_AUTH_STORAGE_KEYS.ADMIN_AUTH_STATE,
        JSON.stringify({ admin, sessionStartedAt })
      );
      adminApiClient.setTokens({ accessToken: token, refreshToken });
      if (admin.preferences?.theme) {
        const theme = admin.preferences.theme;
        localStorage.setItem('super-admin-theme', theme);
      }
    } catch {
      // ignore
    }
  }, []);

  const updateAdmin = useCallback((partial: Partial<Admin>) => {
    setState((prev) => {
      if (!prev.admin) return prev;
      const updatedAdmin = { ...prev.admin, ...partial };
      const next = { ...prev, admin: updatedAdmin };
      try {
        localStorage.setItem(
          ADMIN_AUTH_STORAGE_KEYS.ADMIN_AUTH_STATE,
          JSON.stringify({ admin: updatedAdmin, sessionStartedAt: prev.sessionStartedAt })
        );
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        ...state,
        loginAdmin,
        logoutAdmin,
        updateAdmin,
        refreshAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuthContext = (): AdminAuthContextType => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuthContext must be used inside AdminAuthProvider');
  }
  return ctx;
};

export const useAdminAuth = useAdminAuthContext;

