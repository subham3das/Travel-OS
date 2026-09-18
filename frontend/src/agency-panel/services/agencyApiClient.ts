// ─── Agency Isolated API Client ───────────────────────────────────────────────
// Completely isolated HTTP client for Agency Partner Portal.
// Manages its own dedicated tokens and request pipelines without conflicting with User or Admin panels.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AGENCY_AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'apnatrip_agency_access_token',
  REFRESH_TOKEN: 'apnatrip_agency_refresh_token',
  AUTH_STATE: 'apnatrip_agency_auth',
} as const;

export interface AgencyApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ field?: string; message: string }>;
}

export interface AgencyApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
  params?: Record<string, string | number | boolean | undefined>;
}

class AgencyApiClient {
  private onUnauthorizedCallback?: () => void;

  public getAccessToken(): string | null {
    try {
      return localStorage.getItem(AGENCY_AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    } catch {
      return null;
    }
  }

  public getRefreshToken(): string | null {
    try {
      return localStorage.getItem(AGENCY_AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    } catch {
      return null;
    }
  }

  public setTokens(tokens: { accessToken: string; refreshToken?: string }) {
    try {
      if (tokens.accessToken) {
        localStorage.setItem(AGENCY_AUTH_STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
      }
      if (tokens.refreshToken) {
        localStorage.setItem(AGENCY_AUTH_STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      }
    } catch (e) {
      console.warn('Failed to save agency auth tokens:', e);
    }
  }

  public clearTokens() {
    try {
      localStorage.removeItem(AGENCY_AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(AGENCY_AUTH_STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(AGENCY_AUTH_STORAGE_KEYS.AUTH_STATE);
    } catch (e) {
      console.warn('Failed to clear agency tokens:', e);
    }
  }

  public setOnUnauthorized(callback: () => void) {
    this.onUnauthorizedCallback = callback;
  }

  public async request<T = any>(
    endpoint: string,
    options: AgencyApiRequestOptions = {}
  ): Promise<AgencyApiResponse<T>> {
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

    if (!(customConfig.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (requiresAuth) {
      const token = this.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        const authError: any = new Error('Agency authentication required. Please log in to your partner account.');
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
      const err: any = new Error('Unable to connect to ApnaTrip server. Please check your internet connection.');
      err.status = 0;
      err.isNetworkError = true;
      throw err;
    }

    if (response.status === 401 && requiresAuth) {
      this.clearTokens();
      if (this.onUnauthorizedCallback) {
        this.onUnauthorizedCallback();
      }
      const authErr: any = new Error('Your agency partner session has expired. Please log in again.');
      authErr.status = 401;
      throw authErr;
    }

    let jsonResult: AgencyApiResponse<T>;
    try {
      jsonResult = await response.json();
    } catch {
      jsonResult = {
        success: response.ok,
        message: response.statusText || (response.ok ? 'Success' : 'Server error occurred'),
      };
    }

    if (!response.ok) {
      const apiError: any = new Error(jsonResult.message || `Agency API request failed (${response.status})`);
      apiError.status = response.status;
      apiError.data = jsonResult.data;
      apiError.errors = jsonResult.errors;
      throw apiError;
    }

    return jsonResult;
  }

  public get<T = any>(endpoint: string, options?: AgencyApiRequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T = any>(endpoint: string, body?: any, options?: AgencyApiRequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public put<T = any>(endpoint: string, body?: any, options?: AgencyApiRequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public patch<T = any>(endpoint: string, body?: any, options?: AgencyApiRequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public delete<T = any>(endpoint: string, options?: AgencyApiRequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const agencyApiClient = new AgencyApiClient();
