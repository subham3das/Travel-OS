// ─── Super Admin Auth Context ──────────────────────────────────────────────────
// Completely isolated authentication context for Super Admin Panel.

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Admin, AdminAuthState } from '../types/admin';

interface AdminAuthContextType extends AdminAuthState {
  loginAdmin: (admin: Admin, token: string, refreshToken?: string) => void;
  logoutAdmin: () => void;
  updateAdmin: (partial: Partial<Admin>) => void;
}

const STORAGE_KEY = 'apnatrip_admin_auth';

const loadFromStorage = (): AdminAuthState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {
    isAuthenticated: true,
    admin: {
      id: 'ADM-0001',
      name: 'Super Admin',
      email: 'admin@travelos.com',
      role: 'SUPER_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      lastLogin: new Date().toISOString(),
      isActive: true,
    },
    token: 'mock-super-admin-token-xyz',
    refreshToken: 'mock-refresh-token',
    sessionStartedAt: new Date().toISOString(),
  };
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

  const updateAdmin = useCallback((partial: Partial<Admin>) => {
    setState((prev) => {
      if (!prev.admin) return prev;
      const updatedAdmin = { ...prev.admin, ...partial };
      const next = { ...prev, admin: updatedAdmin };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <AdminAuthContext.Provider value={{ ...state, loginAdmin, logoutAdmin, updateAdmin }}>
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
