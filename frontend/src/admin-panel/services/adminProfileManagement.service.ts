import {
  SuperAdminProfileData,
  AdminPersonalInfo,
  AdminPreferences,
  AdminDeviceItem,
} from '../types/profileManagement';
import { initialSuperAdminProfile } from '../data/profileData';

class AdminProfileManagementService {
  private profile: SuperAdminProfileData = initialSuperAdminProfile;

  public async getProfile(): Promise<SuperAdminProfileData> {
    return new Promise((resolve) => setTimeout(() => resolve(this.profile), 40));
  }

  public async updatePersonalInfo(data: Partial<AdminPersonalInfo>): Promise<SuperAdminProfileData> {
    this.profile = {
      ...this.profile,
      personalInfo: {
        ...this.profile.personalInfo,
        ...data,
      },
    };
    return this.profile;
  }

  public async updateAvatar(url: string): Promise<string> {
    this.profile = {
      ...this.profile,
      avatarUrl: url,
    };
    return url;
  }

  public async updatePreferences(data: Partial<AdminPreferences>): Promise<AdminPreferences> {
    this.profile = {
      ...this.profile,
      preferences: {
        ...this.profile.preferences,
        ...data,
      },
    };
    return this.profile.preferences;
  }

  public async terminateDevice(deviceId: string): Promise<AdminDeviceItem[]> {
    this.profile = {
      ...this.profile,
      devices: this.profile.devices.filter((d) => d.id !== deviceId),
      security: {
        ...this.profile.security,
        activeSessionsCount: Math.max(1, this.profile.security.activeSessionsCount - 1),
      },
    };
    return this.profile.devices;
  }

  public async changePassword(oldPass: string, newPass: string): Promise<boolean> {
    this.profile = {
      ...this.profile,
      security: {
        ...this.profile.security,
        lastPasswordChange: 'Just now',
      },
    };
    return true;
  }
}

export const adminProfileManagementService = new AdminProfileManagementService();
