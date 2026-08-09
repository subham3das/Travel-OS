// ─── Super Admin Auth Context ──────────────────────────────────────────────────
// Completely isolated authentication context for Super Admin Panel.

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Admin, AdminAuthState } from '../types/admin';

interface AdminAuthContextType extends AdminAuthState {
  loginAdmin: (admin: Admin, token: string, refreshToken?: string) => void;
  logoutAdmin: () => void;
}

const STORAGE_KEY = 'apnatrip_admin_auth';

const loadFromStorage = (): AdminAuthState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { isAuthenticated: false, admin: null, token: null, refreshToken: null, sessionStartedAt: null };
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AdminAuthState>(loadFromStorage);

  const loginAdmin = useCallback((admin: Admin, token: string, refreshToken?: string) => {
    const sessionStartedAt = new Date().toISOString();
    const next: AdminAuthState = {
      isAuthenticated: true,
      admin,
      token,
      refreshToken: refreshToken || null,
      sessionStartedAt,
    };
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const logoutAdmin = useCallback(() => {
    setState({ isAuthenticated: false, admin: null, token: null, refreshToken: null, sessionStartedAt: null });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AdminAuthContext.Provider value={{ ...state, loginAdmin, logoutAdmin }}>
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
