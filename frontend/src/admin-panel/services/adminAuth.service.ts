// ─── Super Admin Auth Service ───────────────────────────────────────────────────
// Production Service layer connecting to backend MongoDB Admin Authentication.

import { Admin } from '../types/admin';
import { adminApiClient, ADMIN_AUTH_STORAGE_KEYS } from './adminApiClient';

export interface AdminLoginResponse {
  success: boolean;
  admin: Admin;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn?: string;
  };
}

/**
 * Authenticate administrator using Email and Password against backend MongoDB.
 */
export const loginAdminService = async (
  loginId: string,
  password: string
): Promise<AdminLoginResponse> => {
  const cleanEmail = loginId.trim().toLowerCase();

  const res = await adminApiClient.post<{
    admin: Admin;
    tokens: { accessToken: string; refreshToken: string; expiresIn?: string };
  }>(
    '/admin/auth/login',
    { email: cleanEmail, password },
    { requiresAuth: false }
  );

  if (!res.data || !res.data.admin || !res.data.tokens) {
    throw new Error(res.message || 'Login failed.');
  }

  // Save tokens in storage
  adminApiClient.setTokens({
    accessToken: res.data.tokens.accessToken,
    refreshToken: res.data.tokens.refreshToken,
  });

  return {
    success: true,
    admin: res.data.admin,
    tokens: res.data.tokens,
  };
};

/**
 * Authenticate administrator using Google Workspace SSO token against backend MongoDB.
 */
export const loginWithGoogleService = async (googlePayload: {
  credential?: string;
  idToken?: string;
  accessToken?: string;
}): Promise<AdminLoginResponse> => {
  const res = await adminApiClient.post<{
    admin: Admin;
    tokens: { accessToken: string; refreshToken: string; expiresIn?: string };
  }>(
    '/admin/auth/google',
    googlePayload,
    { requiresAuth: false }
  );

  if (!res.data || !res.data.admin || !res.data.tokens) {
    throw new Error(res.message || 'Google Login failed.');
  }

  // Save tokens in storage
  adminApiClient.setTokens({
    accessToken: res.data.tokens.accessToken,
    refreshToken: res.data.tokens.refreshToken,
  });

  return {
    success: true,
    admin: res.data.admin,
    tokens: res.data.tokens,
  };
};

/**
 * Fetch current authenticated administrator profile from MongoDB
 */
export const getAdminMeService = async (): Promise<Admin | null> => {
  try {
    const res = await adminApiClient.get<{ admin: Admin }>('/admin/auth/me', {
      requiresAuth: true,
    });
    return res.data?.admin || null;
  } catch {
    return null;
  }
};

/**
 * Log out administrator and revoke backend session
 */
export const logoutAdminService = async (): Promise<void> => {
  const refreshToken = adminApiClient.getRefreshToken();
  try {
    if (refreshToken) {
      await adminApiClient.post(
        '/admin/auth/logout',
        { refreshToken },
        { requiresAuth: false }
      );
    }
  } catch {
    // Ignore network error on logout
  } finally {
    adminApiClient.clearTokens();
  }
};

/**
 * Request Password Reset Email for Administrator (POST /admin/auth/forgot-password)
 */
export const forgotPasswordAdminService = async (email: string): Promise<boolean> => {
  try {
    await adminApiClient.post(
      '/admin/auth/forgot-password',
      { email: email.toLowerCase().trim() },
      { requiresAuth: false }
    );
    return true;
  } catch (error: any) {
    console.error('Forgot password request failed:', error);
    const errMsg =
      error?.data?.message ||
      error?.message ||
      'Unable to send verification email. Please try again in a few moments.';
    throw new Error(errMsg);
  }
};

/**
 * Reset Administrator Password via Token (POST /admin/auth/reset-password)
 */
export const resetPasswordAdminService = async (token: string, newPassword: string): Promise<boolean> => {
  try {
    await adminApiClient.post(
      '/admin/auth/reset-password',
      { token, newPassword },
      { requiresAuth: false }
    );
    return true;
  } catch (error: any) {
    console.error('Reset password request failed:', error);
    const errMsg =
      error?.data?.message ||
      error?.message ||
      'Unable to reset password. Please verify the reset link or request a new one.';
    throw new Error(errMsg);
  }
};



