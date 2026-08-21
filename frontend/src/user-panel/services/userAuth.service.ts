const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface UserAuthResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  profileImage?: string;
  status: string;
  isEmailVerified: boolean;
  profileCompleted: boolean;
  preferenceCompleted: boolean;
  notificationsCompleted: boolean;
  privacyCompleted: boolean;
  onboardingCompleted: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: string;
}

class UserAuthService {
  private getAccessToken(): string | null {
    return localStorage.getItem('apnatrip_access_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('apnatrip_refresh_token');
  }

  public setTokens(tokens: AuthTokens) {
    if (tokens.accessToken) {
      localStorage.setItem('apnatrip_access_token', tokens.accessToken);
    }
    if (tokens.refreshToken) {
      localStorage.setItem('apnatrip_refresh_token', tokens.refreshToken);
    }
  }

  public clearTokens() {
    localStorage.removeItem('apnatrip_access_token');
    localStorage.removeItem('apnatrip_refresh_token');
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth = false
  ): Promise<{ success: boolean; data: T; message?: string; errors?: any[] }> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (requiresAuth) {
      const token = this.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle token expiration & automatic refresh
    if (response.status === 401 && requiresAuth) {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });
          const refreshData = await refreshRes.json();
          if (refreshData.success && refreshData.data?.accessToken) {
            this.setTokens({
              accessToken: refreshData.data.accessToken,
              refreshToken: refreshData.data.refreshToken || refreshToken,
            });
            headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
            response = await fetch(url, {
              ...options,
              headers,
            });
          } else {
            this.clearTokens();
          }
        } catch {
          this.clearTokens();
        }
      }
    }

    const data = await response.json().catch(() => ({
      success: false,
      message: 'Network response was not valid JSON',
    }));

    if (!response.ok) {
      const errorMessage =
        data.message ||
        (data.errors && data.errors.length > 0 ? data.errors[0].message : 'Request failed');
      const error: any = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
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

    if (res.data?.tokens) {
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

    if (res.data?.tokens) {
      this.setTokens(res.data.tokens);
    }
    return res.data;
  }

  // 3. Google OAuth Login
  public async googleLogin(payload: {
    credential?: string;
    token?: string;
    email?: string;
    name?: string;
    googleId?: string;
    avatar?: string;
  }) {
    const res = await this.request<{
      user: UserAuthResponse;
      tokens: AuthTokens;
    }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res.data?.tokens) {
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

  // 7. Complete Onboarding
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
