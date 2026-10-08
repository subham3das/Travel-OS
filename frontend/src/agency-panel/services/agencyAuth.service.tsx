// ─── Agency Auth Context & Service ───────────────────────────────────────────
// Isolated Agency authentication provider and state management for ApnaTrip Partner Portal

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AgencyUser, Agency, AgencyAuthState } from '../types/agency';
import { agencyApiClient, AGENCY_AUTH_STORAGE_KEYS, AgencyApiResponse } from './agencyApiClient';

interface AgencyAuthContextType extends AgencyAuthState {
  businesses?: any[];
  loginAgency: (user: AgencyUser, agency: Agency | null, token: string, refreshToken?: string, businesses?: any[]) => void;
  logoutAgency: () => void;
  refreshAgencyProfile: () => Promise<void>;
  setActiveAgency: (agency: Agency) => void;
}

const AgencyAuthContext = createContext<AgencyAuthContextType | undefined>(undefined);

const loadFromStorage = (): AgencyAuthState & { businesses?: any[] } => {
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
        businesses: parsed.businesses || [],
        token: token,
      };
    }
  } catch {
    // ignore
  }
  return { isAuthenticated: false, agencyUser: null, agency: null, businesses: [], token: null };
};

export const AgencyAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AgencyAuthState & { businesses?: any[] }>(loadFromStorage);

  const loginAgency = useCallback(
    (user: AgencyUser, agency: Agency | null, token: string, refreshToken?: string, businesses?: any[]) => {
      const next = {
        isAuthenticated: true,
        agencyUser: user,
        agency,
        businesses: businesses || (agency ? [agency] : []),
        token,
      };
      setState(next);
      localStorage.setItem(AGENCY_AUTH_STORAGE_KEYS.AUTH_STATE, JSON.stringify(next));
      agencyApiClient.setTokens({ accessToken: token, refreshToken });
    },
    []
  );

  const setActiveAgency = useCallback((agency: Agency) => {
    setState((prev) => {
      const next = { ...prev, agency };
      localStorage.setItem(AGENCY_AUTH_STORAGE_KEYS.AUTH_STATE, JSON.stringify(next));
      return next;
    });
  }, []);

  const logoutAgency = useCallback(() => {
    setState({ isAuthenticated: false, agencyUser: null, agency: null, businesses: [], token: null });
    agencyApiClient.clearTokens();
    localStorage.removeItem(AGENCY_AUTH_STORAGE_KEYS.AUTH_STATE);
    localStorage.removeItem(AGENCY_AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AGENCY_AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  }, []);

  const refreshAgencyProfile = useCallback(async () => {
    const currentToken = agencyApiClient.getAccessToken();
    if (!currentToken) return;

    try {
      const res = await agencyApiClient.get<{ agency: Agency; businesses?: any[]; user?: any }>('/agencies/auth/me', {
        requiresAuth: true,
      });

      const data = res.data;
      if (data) {
        setState((prev) => {
          const next = {
            ...prev,
            agency: data.agency || prev.agency,
            businesses: data.businesses || prev.businesses || [],
            agencyUser: data.user ? { ...prev.agencyUser, ...data.user } : prev.agencyUser,
            isAuthenticated: true,
          };
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
    <AgencyAuthContext.Provider
      value={{
        ...state,
        loginAgency,
        logoutAgency,
        refreshAgencyProfile,
        setActiveAgency,
      }}
    >
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
  /**
   * STEP 1: Register Account
   */
  registerAccount: async (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
  }): Promise<AgencyApiResponse<{ userId: string; email: string; phone: string; message: string; debugOtp?: string }>> => {
    return agencyApiClient.post('/agencies/auth/register-account', payload, { requiresAuth: false });
  },

  /**
   * STEP 2: Verify Email OTP (Auto-Login with JWT)
   */
  verifyEmailOtp: async (
    userId: string,
    otp: string
  ): Promise<AgencyApiResponse<{ success: boolean; token: string; user: AgencyUser; businesses: any[]; message: string }>> => {
    return agencyApiClient.post('/agencies/auth/verify-email-otp', { userId, otp }, { requiresAuth: false });
  },

  /**
   * Resend Email OTP
   */
  resendEmailOtp: async (userId: string): Promise<AgencyApiResponse<{ success: boolean; message: string; debugOtp?: string }>> => {
    return agencyApiClient.post('/agencies/auth/resend-email-otp', { userId }, { requiresAuth: false });
  },

  /**
   * STEP 6: Create Business (Authenticated)
   */
  createBusiness: async (data: {
    businessType: 'agency' | 'car_rental';
    name: string;
    agencyDisplayName?: string;
    legalBusinessName?: string;
    businessAddress: string;
    city: string;
    state: string;
    pinCode: string;
    country?: string;
    yearEstablished?: string;
    registrationNumber?: string;
    gstNumber?: string;
    panNumber?: string;
    website?: string;
    fleetSize?: number;
    supportedVehicleServices?: string[];
  }): Promise<AgencyApiResponse<{ business: Agency }>> => {
    return agencyApiClient.post('/agencies/businesses/create', data, { requiresAuth: true });
  },

  /**
   * Fetch all businesses owned by user
   */
  getMyBusinesses: async (): Promise<AgencyApiResponse<{ businesses: Agency[] }>> => {
    return agencyApiClient.get('/agencies/businesses', { requiresAuth: true });
  },

  register: async (payload: {
    ownerName: string;
    businessName: string;
    businessType?: 'agency' | 'car_rental';
    email: string;
    phone: string;
    password: string;
    city?: string;
    state?: string;
  }): Promise<AgencyApiResponse<{ token: string; user: AgencyUser; agency: Agency; onboardingStatus: string; resumed?: boolean }>> => {
    return agencyApiClient.post(
      '/agencies/auth/register',
      payload,
      { requiresAuth: false }
    );
  },

  login: async (
    email: string,
    password: string
  ): Promise<AgencyApiResponse<{
    token: string;
    user: AgencyUser;
    agency: Agency;
    businesses?: Agency[];
    activeBusiness?: Agency;
    onboardingStatus: string;
    mustChangePassword?: boolean;
    requiresVerification?: boolean;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    userId?: string;
  }>> => {
    return agencyApiClient.post(
      '/agencies/auth/login',
      { email, password },
      { requiresAuth: false }
    );
  },

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
