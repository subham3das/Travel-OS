const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'apnatrip_access_token',
  REFRESH_TOKEN: 'apnatrip_refresh_token',
} as const;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ field?: string; message: string }>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: string;
}

export interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];
  private onUnauthorizedCallback?: () => void;

  public getAccessToken(): string | null {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    } catch {
      return null;
    }
  }

  public getRefreshToken(): string | null {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    } catch {
      return null;
    }
  }

  public setTokens(tokens: { accessToken: string; refreshToken?: string }) {
    try {
      if (tokens.accessToken) {
        localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
      }
      if (tokens.refreshToken) {
        localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      }
    } catch (e) {
      console.warn('Failed to save auth tokens to localStorage:', e);
    }
  }

  public clearTokens() {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    } catch (e) {
      console.warn('Failed to clear tokens from localStorage:', e);
    }
  }

  public setOnUnauthorized(callback: () => void) {
    this.onUnauthorizedCallback = callback;
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb);
  }

  /**
   * Attempt to refresh token via backend /auth/refresh
   */
  public async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearTokens();
      if (this.onUnauthorizedCallback) this.onUnauthorizedCallback();
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        if (this.onUnauthorizedCallback) this.onUnauthorizedCallback();
        return null;
      }

      const result: ApiResponse<{ accessToken: string; refreshToken?: string }> = await response.json();
      if (result.success && result.data?.accessToken) {
        this.setTokens({
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken || refreshToken,
        });
        return result.data.accessToken;
      }

      this.clearTokens();
      if (this.onUnauthorizedCallback) this.onUnauthorizedCallback();
      return null;
    } catch {
      this.clearTokens();
      if (this.onUnauthorizedCallback) this.onUnauthorizedCallback();
      return null;
    }
  }

  /**
   * Unified HTTP Request Pipeline
   */
  public async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { requiresAuth = true, params, ...customConfig } = options;

    let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          searchParams.append(key, String(val));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    const headers: Record<string, string> = {
      ...(customConfig.headers as Record<string, string>),
    };

    // Auto content-type JSON unless FormData
    if (!(customConfig.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    // Auto-attach Bearer token
    if (requiresAuth) {
      let token = this.getAccessToken();
      if (!token) {
        // Try refresh if access token missing but refresh token exists
        token = await this.refreshAccessToken();
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        // If protected and no token could be obtained, fail early
        const authError: any = new Error('Authentication required. Please log in.');
        authError.status = 401;
        throw authError;
      }
    } else {
      const token = this.getAccessToken();
      if (token && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    let response: Response;
    try {
      response = await fetch(url, {
        ...customConfig,
        headers,
      });
    } catch (networkError: any) {
      const err: any = new Error('Unable to connect to server. Please check your network.');
      err.status = 0;
      err.isNetworkError = true;
      throw err;
    }

    // Handle 401 Unauthorized with token refresh and retry
    if (response.status === 401 && requiresAuth) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        const newToken = await this.refreshAccessToken();
        this.isRefreshing = false;

        if (newToken) {
          this.onTokenRefreshed(newToken);
          headers['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(url, {
            ...customConfig,
            headers,
          });
        } else {
          const authError: any = new Error('Session expired. Please log in again.');
          authError.status = 401;
          throw authError;
        }
      } else {
        // Wait for active refresh to complete
        const retryToken = await new Promise<string>((resolve) => {
          this.addRefreshSubscriber((token) => resolve(token));
        });

        if (retryToken) {
          headers['Authorization'] = `Bearer ${retryToken}`;
          response = await fetch(url, {
            ...customConfig,
            headers,
          });
        }
      }
    }

    const data: ApiResponse<T> = await response.json().catch(() => ({
      success: response.ok,
      message: response.statusText,
    }));

    if (!response.ok) {
      const errorMessage =
        data.message ||
        (data.errors && data.errors.length > 0 ? data.errors[0].message : `Request failed with status ${response.status}`);
      const error: any = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  public get<T = any>(endpoint: string, options: ApiRequestOptions = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T = any>(endpoint: string, body?: any, options: ApiRequestOptions = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public patch<T = any>(endpoint: string, body?: any, options: ApiRequestOptions = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public put<T = any>(endpoint: string, body?: any, options: ApiRequestOptions = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public delete<T = any>(endpoint: string, options: ApiRequestOptions = {}) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
