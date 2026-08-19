// ─── Admin Auth Service ───────────────────────────────────────────────────────
// Service layer for Super Admin authentication and Google Workspace integration.

import { Admin } from '../types/admin';
import { adminAccessControlService } from './adminAccessControl.service';

export interface AdminLoginResponse {
  success: boolean;
  admin: Admin;
  token: string;
  refreshToken: string;
}

/**
 * Authenticate administrator using Login ID / Email and Password with Strict Access Control.
 */
export const loginAdminService = async (
  loginId: string,
  password: string
): Promise<AdminLoginResponse> => {
  // Simulate network request delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const cleanId = loginId.trim().toLowerCase();

  // Validate password
  if (password === 'wrong' || password === 'invalid') {
    throw new Error('Invalid Login credentials.');
  }

  // Gate check against Authorized Admins IAM list
  // Default fallback aliases: 'admin', 'superadmin', 'admin@travelos.com' -> 'admin@travelos.com'
  const emailToCheck =
    cleanId === 'admin' || cleanId === 'superadmin' || cleanId === 'admin@apnatrip.com'
      ? 'admin@travelos.com'
      : cleanId;

  const authCheck = adminAccessControlService.verifyEmailForLogin(emailToCheck);

  if (!authCheck.isAllowed) {
    throw new Error(
      authCheck.reason ||
        'You are not authorized to access the Travel OS Admin Panel. Please contact your system administrator.'
    );
  }

  const authorized = authCheck.admin;

  return {
    success: true,
    admin: {
      id: authorized?.id || 'admin-001',
      name: authorized?.name || 'Super Admin',
      email: authorized?.email || cleanId,
      role: 'SUPER_ADMIN',
      avatar:
        authorized?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isActive: true,
      lastLogin: new Date().toISOString(),
    },
    token: `apnatrip_admin_token_${Date.now()}`,
    refreshToken: `apnatrip_admin_refresh_${Date.now()}`,
  };
};

/**
 * Authenticate administrator using Google Workspace SSO token with Strict Access Control.
 */
export const loginWithGoogleService = async (): Promise<AdminLoginResponse> => {
  // Simulate network request delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const defaultSSOEmail = 'admin@travelos.com';
  const authCheck = adminAccessControlService.verifyEmailForLogin(defaultSSOEmail);

  if (!authCheck.isAllowed) {
    throw new Error(
      authCheck.reason ||
        'This Google account is not authorized to access the Travel OS Admin Panel.'
    );
  }

  const authorized = authCheck.admin;

  return {
    success: true,
    admin: {
      id: authorized?.id || 'admin-sso-001',
      name: authorized?.name || 'Authorized Admin',
      email: authorized?.email || defaultSSOEmail,
      role: 'SUPER_ADMIN',
      avatar:
        authorized?.avatar ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isActive: true,
      lastLogin: new Date().toISOString(),
    },
    token: `apnatrip_google_sso_token_${Date.now()}`,
    refreshToken: `apnatrip_google_sso_refresh_${Date.now()}`,
  };
};

export const logoutAdminService = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
};
