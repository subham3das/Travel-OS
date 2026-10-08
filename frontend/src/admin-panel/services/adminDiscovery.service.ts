import { adminApiClient } from './adminApiClient';
import { AdminDiscoveryOverride, AdminSectionConfig } from '../types/discovery';

class AdminDiscoveryService {
  /**
   * Fetch all active & scheduled overrides
   */
  public async getOverrides(targetType?: string): Promise<AdminDiscoveryOverride[]> {
    const query = targetType ? `?targetType=${targetType}` : '';
    const res = await adminApiClient.get<{ overrides: AdminDiscoveryOverride[] }>(
      `/admin/discovery/overrides${query}`
    );
    return res.data?.overrides || [];
  }

  /**
   * Pin / override a package or agency
   */
  public async createOrUpdateOverride(data: {
    targetType: 'PACKAGE' | 'AGENCY';
    targetId: string;
    sectionId: string;
    overrideBadge?: string;
    priority?: number;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
    notes?: string;
  }): Promise<AdminDiscoveryOverride> {
    const res = await adminApiClient.post<AdminDiscoveryOverride>(
      '/admin/discovery/override',
      data
    );
    return res.data!;
  }

  /**
   * Remove an override (item returns immediately to live auto-ranking)
   */
  public async deleteOverride(overrideId: string): Promise<void> {
    await adminApiClient.delete(`/admin/discovery/override/${overrideId}`);
  }

  /**
   * Fetch all section configurations
   */
  public async getSections(): Promise<AdminSectionConfig[]> {
    const res = await adminApiClient.get<{ sections: AdminSectionConfig[] }>(
      '/admin/discovery/sections'
    );
    return res.data?.sections || [];
  }

  /**
   * Update section visibility, title, limits, order
   */
  public async updateSection(
    sectionId: string,
    data: Partial<AdminSectionConfig>
  ): Promise<AdminSectionConfig> {
    const res = await adminApiClient.put<AdminSectionConfig>(
      `/admin/discovery/sections/${sectionId}`,
      data
    );
    return res.data!;
  }

  /**
   * Quick toggle section ON / OFF
   */
  public async toggleSection(sectionId: string): Promise<AdminSectionConfig> {
    const res = await adminApiClient.patch<AdminSectionConfig>(
      `/admin/discovery/sections/${sectionId}/toggle`,
      {}
    );
    return res.data!;
  }

  /**
   * Reset / Seed default sections
   */
  public async seedDefaultSections(): Promise<AdminSectionConfig[]> {
    const res = await adminApiClient.post<{ sections: AdminSectionConfig[] }>(
      '/admin/discovery/sections/seed-default',
      {}
    );
    return res.data?.sections || [];
  }
}

export const adminDiscoveryService = new AdminDiscoveryService();
