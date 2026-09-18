import { adminApiClient } from './adminApiClient';
import {
  SuperAdminProfileData,
  AdminPersonalInfo,
  AdminPreferences,
} from '../types/profileManagement';
export const initialSuperAdminProfile: SuperAdminProfileData = {
  avatarUrl: '',
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    timezone: '',
    language: 'English',
    location: '',
    memberSince: '',
    adminId: '',
    role: '',
  },
  security: {
    lastLogin: '',
    lastPasswordChange: '',
    twoFactorEnabled: true,
    recoveryEmail: '',
    activeSessionsCount: 0,
  },
  preferences: {
    theme: 'Light',
    language: 'English',
    emailNotifications: true,
    smsNotifications: false,
    desktopNotifications: true,
  },
  activities: [],
  stats: [
    {
      id: 'stat-logins',
      title: 'Total Logins',
      value: '0',
      growth: '',
      iconType: 'logins',
    },
    {
      id: 'stat-actions',
      title: 'Admin Actions',
      value: '0',
      growth: '',
      iconType: 'actions',
    },
    {
      id: 'stat-reports',
      title: 'Security Clearance',
      value: 'Standard',
      growth: '',
      iconType: 'reports',
    },
    {
      id: 'stat-active',
      title: 'Session Status',
      value: 'Active',
      growth: '',
      iconType: 'active',
    },
  ],
  devices: [],
  accountStatus: {
    isVerified: true,
    isTwoFactorEnabled: true,
    isEmailVerified: true,
    securityScore: 80,
  },
};

class AdminProfileManagementService {
  /**
   * 1. Fetch current authenticated administrator profile from MongoDB (/api/admin/profile)
   */
  public async getProfile(): Promise<SuperAdminProfileData> {
    try {
      const response = await adminApiClient.get<SuperAdminProfileData>('/admin/profile');
      return response.data || initialSuperAdminProfile;
    } catch (error: any) {
      console.error('Error fetching admin profile from backend:', error);
      throw error;
    }
  }

  /**
   * 2. Update personal credentials & contact information (/api/admin/profile)
   */
  public async updatePersonalInfo(data: Partial<AdminPersonalInfo>): Promise<SuperAdminProfileData> {
    try {
      const response = await adminApiClient.patch<SuperAdminProfileData>('/admin/profile', data);
      return response.data || this.getProfile();
    } catch (error: any) {
      console.error('Error updating personal info:', error);
      throw error;
    }
  }

  /**
   * 3. Update Profile Avatar Image (/api/admin/profile)
   */
  public async updateAvatar(url: string): Promise<string> {
    try {
      const response = await adminApiClient.patch<SuperAdminProfileData>('/admin/profile', { profileImage: url });
      return response.data?.avatarUrl || url;
    } catch (error: any) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  }

  /**
   * 4. Update Admin Account Preferences (/api/admin/profile/preferences)
   */
  public async updatePreferences(data: Partial<AdminPreferences>): Promise<AdminPreferences> {
    try {
      const response = await adminApiClient.patch<AdminPreferences>('/admin/profile/preferences', data);
      return response.data || {
        theme: data.theme || 'Light',
        language: data.language || 'English',
        emailNotifications: data.emailNotifications ?? true,
        smsNotifications: data.smsNotifications ?? false,
        desktopNotifications: data.desktopNotifications ?? true,
      };
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  /**
   * 5. Terminate Remote Active Login Session (/api/admin/profile/sessions/:sessionId)
   */
  public async terminateDevice(deviceId: string): Promise<void> {
    try {
      await adminApiClient.delete(`/admin/profile/sessions/${deviceId}`);
    } catch (error: any) {
      console.error('Error terminating device session:', error);
      throw error;
    }
  }

  /**
   * 6. Rotate Administrator Account Password (PUT /api/admin/profile/change-password)
   */
  public async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword?: string
  ): Promise<boolean> {
    try {
      await adminApiClient.put('/admin/profile/change-password', {
        currentPassword,
        newPassword,
        confirmPassword: confirmPassword || newPassword,
      });
      return true;
    } catch (error: any) {
      console.error('Error changing admin password:', error);
      const errMsg =
        error.response?.data?.message ||
        'Failed to change password. Please verify current password.';
      throw new Error(errMsg);
    }
  }
}

export const adminProfileManagementService = new AdminProfileManagementService();
