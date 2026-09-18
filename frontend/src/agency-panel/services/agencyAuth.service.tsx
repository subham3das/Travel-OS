// ─── Agency Auth Context & Service ───────────────────────────────────────────
// Isolated Agency authentication provider and state management for ApnaTrip Partner Portal

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AgencyUser, Agency, AgencyAuthState } from '../types/agency';
import { agencyApiClient, AGENCY_AUTH_STORAGE_KEYS, AgencyApiResponse } from './agencyApiClient';

interface AgencyAuthContextType extends AgencyAuthState {
  loginAgency: (user: AgencyUser, agency: Agency, token: string, refreshToken?: string) => void;
  logoutAgency: () => void;
  refreshAgencyProfile: () => Promise<void>;
}

const AgencyAuthContext = createContext<AgencyAuthContextType | undefined>(undefined);

const loadFromStorage = (): AgencyAuthState => {
  try {
    const raw = localStorage.getItem(AGENCY_AUTH_STORAGE_KEYS.AUTH_STATE);
    const token = localStorage.getItem(AGENCY_AUTH_STORAGE_KEYS.ACCESS_TOKEN);

    if (raw && token) {
      const parsed = JSON.parse(raw);
      agencyApiClient.setTokens({ accessToken: token });
      return {
        isAuthenticated: true,
        agencyUser: parsed.agencyUser || null,
        agency: parsed.agency || null,
        token: token,
      };
    }
  } catch {
    // ignore
  }
  return { isAuthenticated: false, agencyUser: null, agency: null, token: null };
};

export const AgencyAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AgencyAuthState>(loadFromStorage);

  const loginAgency = useCallback((user: AgencyUser, agency: Agency, token: string, refreshToken?: string) => {
    const next: AgencyAuthState = {
      isAuthenticated: true,
      agencyUser: user,
      agency,
      token,
    };
    setState(next);
    localStorage.setItem(AGENCY_AUTH_STORAGE_KEYS.AUTH_STATE, JSON.stringify(next));
    agencyApiClient.setTokens({ accessToken: token, refreshToken });
  }, []);

  const logoutAgency = useCallback(() => {
    setState({ isAuthenticated: false, agencyUser: null, agency: null, token: null });
    agencyApiClient.clearTokens();
    localStorage.removeItem(AGENCY_AUTH_STORAGE_KEYS.AUTH_STATE);
    localStorage.removeItem(AGENCY_AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AGENCY_AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  }, []);

  const refreshAgencyProfile = useCallback(async () => {
    const currentToken = agencyApiClient.getAccessToken();
    if (!currentToken) return;

    try {
      const res = await agencyApiClient.get<{ agency: Agency }>('/agencies/auth/me', {
        requiresAuth: true,
      });

      if (res.data && res.data.agency) {
        const updatedAgency = res.data.agency;
        setState((prev) => {
          const next = { ...prev, agency: updatedAgency, isAuthenticated: true };
          localStorage.setItem(AGENCY_AUTH_STORAGE_KEYS.AUTH_STATE, JSON.stringify(next));
          return next;
        });
      }
    } catch (e: any) {
      console.warn('Agency profile refresh check:', e.message);
      if (e.status === 401 || e.status === 403) {
        logoutAgency();
      }
    }
  }, [logoutAgency]);

  // Hook into 401 unauthorized notifications
  useEffect(() => {
    agencyApiClient.setOnUnauthorized(() => {
      logoutAgency();
    });
  }, [logoutAgency]);

  // Validate session on boot if token exists
  useEffect(() => {
    const token = agencyApiClient.getAccessToken();
    if (token) {
      refreshAgencyProfile();
    }
  }, [refreshAgencyProfile]);

  return (
    <AgencyAuthContext.Provider value={{ ...state, loginAgency, logoutAgency, refreshAgencyProfile }}>
      {children}
    </AgencyAuthContext.Provider>
  );
};

export const useAgencyAuthContext = (): AgencyAuthContextType => {
  const ctx = useContext(AgencyAuthContext);
  if (!ctx) {
    throw new Error('useAgencyAuthContext must be used inside AgencyAuthProvider');
  }
  return ctx;
};

export const agencyAuthService = {
  forgotPassword: async (email: string): Promise<AgencyApiResponse<null>> => {
    return agencyApiClient.post<null>(
      '/agencies/auth/forgot-password',
      { email },
      { requiresAuth: false }
    );
  },

  resetPassword: async (data: {
    token: string;
    password: string;
    confirmPassword?: string;
  }): Promise<AgencyApiResponse<null>> => {
    return agencyApiClient.post<null>(
      '/agencies/auth/reset-password',
      data,
      { requiresAuth: false }
    );
  },
};
