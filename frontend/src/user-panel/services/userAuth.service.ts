const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface UserAuthResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  profileImage?: string;
  gender?: string;
  preferredLanguage?: string;
  foodPreference?: string;
  accessibilityRequirements?: string;
  bio?: string;
  homeCity?: string;
  dateOfBirth?: string;
  status: string;
  isEmailVerified: boolean;
  profileCompleted: boolean;
  preferenceCompleted: boolean;
  notificationsCompleted: boolean;
  privacyCompleted: boolean;
  onboardingCompleted: boolean;
}

export interface FullUserProfileResponse extends UserAuthResponse {
  coverImage?: string;
  username?: string;
  location?: string;
  country?: string;
  isVerified?: boolean;
  badgeTitle?: string;
  memberSince?: string;
  stats?: {
    totalTrips: number;
    upcomingTrips: number;
    completedTrips: number;
    countriesVisited: number;
    lifetimeSpend: string;
    avgRatingGiven: number;
    postsCount: number;
    followersCount: number;
    followingCount: number;
    reputationScore: number;
    levelTitle: string;
  };
  currentTrip?: {
    id: string;
    title: string;
    dates: string;
    agencyName: string;
    imageUrl: string;
    status: string;
  } | null;
  achievements?: Array<{
    id: string;
    title: string;
    level: string;
    unlocked: boolean;
    icon: string;
    bgColor: string;
    borderColor: string;
    iconColor: string;
  }>;
  mediaPosts?: Array<{
    id: string;
    title: string;
    location: string;
    imageUrl: string;
  }>;
}

import { apiClient, AuthTokens } from '../../services/apiClient';

export type { AuthTokens };

class UserAuthService {
  public getAccessToken(): string | null {
    return apiClient.getAccessToken();
  }

  public getRefreshToken(): string | null {
    return apiClient.getRefreshToken();
  }

  public setTokens(tokens: AuthTokens) {
    apiClient.setTokens(tokens);
  }

  public clearTokens() {
    apiClient.clearTokens();
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth = false
  ) {
    return apiClient.request<T>(endpoint, {
      ...options,
      requiresAuth,
    });
  }

  // 1. Sign Up / Registration
  public async register(payload: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
  }) {
    const res = await this.request<{
      user: UserAuthResponse;
      tokens: AuthTokens;
      verificationToken?: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!res.data) {
      throw new Error(res.message || 'Registration failed');
    }
    if (res.data.tokens) {
      this.setTokens(res.data.tokens);
    }
    return res.data;
  }

  // 2. Login
  public async login(payload: { email: string; password: string }) {
    const res = await this.request<{
      user: UserAuthResponse;
      tokens: AuthTokens;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!res.data) {
      throw new Error(res.message || 'Login failed');
    }
    if (res.data.tokens) {
      this.setTokens(res.data.tokens);
    }
    return res.data;
  }

  // 3. Google OAuth Login
  public async googleLogin(payload: {
    credential?: string;
    idToken?: string;
    accessToken?: string;
  }) {
    const res = await this.request<{
      user: UserAuthResponse;
      tokens: AuthTokens;
      isNewUser?: boolean;
    }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!res.data) {
      throw new Error(res.message || 'Google login failed');
    }
    if (res.data.tokens) {
      this.setTokens(res.data.tokens);
    }
    return res.data;
  }

  // 4. Get Current User / Verify JWT
  public async getMe() {
    const res = await this.request<{ user: UserAuthResponse }>('/auth/me', {}, true);
    return res.data?.user;
  }

  // 5. Logout
  public async logout() {
    const refreshToken = this.getRefreshToken();
    try {
      if (refreshToken) {
        await this.request(
          '/auth/logout',
          {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
          },
          false
        );
      }
    } catch (e) {
      console.warn('Logout API notification failed:', e);
    } finally {
      this.clearTokens();
    }
  }

  // 6. Dynamic Onboarding Status
  public async getOnboardingStatus() {
    const res = await this.request<{
      onboarding: {
        currentStep: string;
        completedSteps: string[];
        remainingSteps: string[];
        profileComplete: boolean;
        preferencesComplete: boolean;
        notificationsComplete: boolean;
        privacyComplete: boolean;
        onboardingComplete: boolean;
        overallPercentage: number;
      };
    }>('/onboarding/status', {}, true);
    return res.data?.onboarding;
  }

  // 6.5. Get Full Authenticated Profile
  public async getProfile(): Promise<FullUserProfileResponse | null> {
    const res = await this.request<{ profile: FullUserProfileResponse }>(
      '/profile',
      { method: 'GET' },
      true
    );
    return res.data?.profile || null;
  }

  // 7. Update Profile
  public async updateProfile(payload: {
    fullName?: string;
    phone?: string;
    username?: string;
    bio?: string;
    homeCity?: string;
    dateOfBirth?: string;
    gender?: string;
    preferredLanguage?: string;
    foodPreference?: string;
    accessibilityRequirements?: string;
    country?: string;
    avatar?: string;
  }) {
    const res = await this.request<{ profile: UserAuthResponse }>(
      '/profile',
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
      true
    );
    return res.data?.profile;
  }

  // 8. Update Travel Preferences
  public async updateTravelPreferences(payload: {
    travelInterests?: string[];
    travelStyle?: string[];
    budgetPreference?: string;
    preferredBudgetAmount?: number;
    preferredBudgetTier?: string;
    preferredTripDuration?: string[];
    preferredTransportation?: string[];
    foodPreference?: string;
    accessibilityRequirements?: string;
  }) {
    const res = await this.request<any>(
      '/profile/travel-preferences',
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
      true
    );
    return res.data;
  }

  // 9. Update Notification Preferences
  public async updateNotificationPreferences(payload: any) {
    const res = await this.request<any>(
      '/profile/notification-preferences',
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
      true
    );
    return res.data;
  }

  // 10. Update Privacy Preferences
  public async updatePrivacyPreferences(payload: any) {
    const res = await this.request<any>(
      '/profile/privacy-preferences',
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
      true
    );
    return res.data;
  }

  // 11. Complete Onboarding
  public async completeOnboarding() {
    const res = await this.request<any>(
      '/onboarding/complete',
      {
        method: 'POST',
      },
      true
    );
    return res.data;
  }

  // 8. Forgot Password
  public async forgotPassword(email: string) {
    const res = await this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return res.data;
  }

  // 9. Reset Password
  public async resetPassword(token: string, password: string) {
    const res = await this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
    return res.data;
  }
}

export const userAuthService = new UserAuthService();
