// ─── Agency Profile & Settings Service ─────────────────────────────────────────
// Production-ready service connected to live /api/agencies/profile endpoints

import { agencyApiClient, AgencyApiResponse } from './agencyApiClient';
import { CompleteAgencyProfile, AgencySettingsData } from '../data/profile';

export class AgencyProfileService {
  /**
   * Fetch authenticated agency profile with live dynamic aggregations
   */
  public async getProfile(): Promise<CompleteAgencyProfile> {
    try {
      const response = await agencyApiClient.get<CompleteAgencyProfile>('/agencies/profile', {
        requiresAuth: true,
      });

      if (response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to load agency profile.');
    } catch (error: any) {
      console.error('AgencyProfileService.getProfile error:', error);
      throw error;
    }
  }

  /**
   * Update authenticated agency profile details (hero, business, contact, bank, hours, social, etc.)
   */
  public async updateProfile(updates: Partial<CompleteAgencyProfile> | any): Promise<CompleteAgencyProfile> {
    try {
      const response = await agencyApiClient.patch<CompleteAgencyProfile>('/agencies/profile', updates, {
        requiresAuth: true,
      });

      if (response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to update agency profile.');
    } catch (error: any) {
      console.error('AgencyProfileService.updateProfile error:', error);
      throw error;
    }
  }

  /**
   * Fetch agency operational and system settings
   */
  public async getSettings(): Promise<AgencySettingsData> {
    try {
      const response = await agencyApiClient.get<AgencySettingsData>('/agencies/profile/settings', {
        requiresAuth: true,
      });

      if (response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to load agency settings.');
    } catch (error: any) {
      console.error('AgencyProfileService.getSettings error:', error);
      throw error;
    }
  }

  /**
   * Update agency operational and system settings
   */
  public async updateSettings(settingsData: Partial<AgencySettingsData>): Promise<AgencySettingsData> {
    try {
      const response = await agencyApiClient.put<AgencySettingsData>('/agencies/profile/settings', settingsData, {
        requiresAuth: true,
      });

      if (response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to update agency settings.');
    } catch (error: any) {
      console.error('AgencyProfileService.updateSettings error:', error);
      throw error;
    }
  }
}

export const agencyProfileService = new AgencyProfileService();
