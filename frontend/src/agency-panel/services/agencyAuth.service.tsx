// ─── Agency Auth Context ─────────────────────────────────────────────────────
// Future: replaces with real JWT/session management.
// For now: persists agencyUser to localStorage.

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AgencyUser, Agency, AgencyAuthState } from '../types/agency';

interface AgencyAuthContextType extends AgencyAuthState {
  loginAgency: (user: AgencyUser, agency: Agency, token: string) => void;
  logoutAgency: () => void;
}

const AgencyAuthContext = createContext<AgencyAuthContextType | undefined>(undefined);

const STORAGE_KEY = 'apnatrip_agency_auth';

const loadFromStorage = (): AgencyAuthState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { isAuthenticated: false, agencyUser: null, agency: null, token: null };
};

export const AgencyAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AgencyAuthState>(loadFromStorage);

  const loginAgency = useCallback((user: AgencyUser, agency: Agency, token: string) => {
    const next: AgencyAuthState = { isAuthenticated: true, agencyUser: user, agency, token };
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const logoutAgency = useCallback(() => {
    setState({ isAuthenticated: false, agencyUser: null, agency: null, token: null });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AgencyAuthContext.Provider value={{ ...state, loginAgency, logoutAgency }}>
      {children}
    </AgencyAuthContext.Provider>
  );
};

export const useAgencyAuthContext = (): AgencyAuthContextType => {
  const ctx = useContext(AgencyAuthContext);
  if (!ctx) throw new Error('useAgencyAuthContext must be used inside AgencyAuthProvider');
  return ctx;
};
