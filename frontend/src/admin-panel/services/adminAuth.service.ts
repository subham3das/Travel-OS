// ─── Admin Auth Service ───────────────────────────────────────────────────────
// Service layer for Super Admin authentication and Google Workspace integration.

import { Admin } from '../types/admin';

export interface AdminLoginResponse {
  success: boolean;
  admin: Admin;
  token: string;
  refreshToken: string;
}

/**
 * Authenticate administrator using Login ID / Email and Password.
 */
export const loginAdminService = async (
  loginId: string,
  password: string
): Promise<AdminLoginResponse> => {
  // Simulate network request delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const cleanId = loginId.trim().toLowerCase();

  // Validate credentials
  if (cleanId === 'invalid@apnatrip.com' || password === 'wrong') {
    throw new Error('Invalid Login ID or Password.');
  }

  if (cleanId === 'unauthorized@apnatrip.com') {
    throw new Error('You do not have permission to access the Admin Portal.');
  }

  return {
    success: true,
    admin: {
      id: 'admin-001',
      name: 'Super Admin',
      email: cleanId || 'admin@apnatrip.com',
      role: 'SUPER_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isActive: true,
      lastLogin: new Date().toISOString(),
    },
    token: 'apnatrip_admin_access_token_mock',
    refreshToken: 'apnatrip_admin_refresh_token_mock',
  };
};

/**
 * Authenticate administrator using Google Workspace SSO token.
 */
export const loginWithGoogleService = async (): Promise<AdminLoginResponse> => {
  // Simulate network request delay
  await new Promise((resolve) => setTimeout(resolve, 900));

  // Simulated Google Workspace domain validation
  // Backend verifies if account belongs to authorized administrator list or @apnatrip.com workspace
  return {
    success: true,
    admin: {
      id: 'admin-sso-001',
      name: 'Authorized Admin',
      email: 'sso.admin@apnatrip.com',
      role: 'SUPER_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isActive: true,
      lastLogin: new Date().toISOString(),
    },
    token: 'apnatrip_admin_google_sso_token',
    refreshToken: 'apnatrip_admin_google_refresh_token',
  };
};

export const logoutAdminService = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
};
