import { SystemSettingsModel } from '../models/systemSettings.model.js';
import { AuditLoggerService } from './auditLogger.service.js';

export class AdminSettingsService {
  /**
   * 1. Settings KPI Stats
   */
  async getKPIStats() {
    return {
      platformHealth: {
        id: 'platformHealth',
        title: 'Platform Health',
        value: '99.8%',
        subtitle: 'Online & Stable',
        growth: '4.2%',
        isPositive: true,
        comparison: '▲ 4.2%',
        iconType: 'health' as const,
        sparklineColor: '#6356E5',
      },
      activeIntegrations: {
        id: 'activeIntegrations',
        title: 'Active Integrations',
        value: '12 / 12',
        subtitle: 'All Connected',
        isPositive: true,
        comparison: 'All Connected',
        iconType: 'integrations' as const,
      },
      enabledModules: {
        id: 'enabledModules',
        title: 'Enabled Modules',
        value: '16 / 16',
        subtitle: 'Active',
        isPositive: true,
        comparison: 'Active',
        iconType: 'modules' as const,
      },
      storageUsage: {
        id: 'storageUsage',
        title: 'Storage Usage',
        value: '68%',
        subtitle: '136 GB / 200 GB',
        isPositive: true,
        comparison: '136 GB / 200 GB',
        iconType: 'storage' as const,
        progressPercent: 68,
      },
      apiRequestsToday: {
        id: 'apiRequestsToday',
        title: 'API Requests Today',
        value: '24,392',
        growth: '18%',
        isPositive: true,
        comparison: 'vs yesterday',
        iconType: 'api' as const,
        sparklineColor: '#8B5CF6',
      },
      lastBackup: {
        id: 'lastBackup',
        title: 'Last Backup',
        value: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        subtitle: '10:42 AM',
        isPositive: true,
        comparison: '10:42 AM',
        iconType: 'backup' as const,
      },
    };
  }

  /**
   * 2. General Settings
   */
  async getGeneralSettings() {
    let settings = await SystemSettingsModel.findOne({ key: 'GLOBAL_SETTINGS' }).lean();
    if (!settings) {
      const created = await SystemSettingsModel.create({
        key: 'GLOBAL_SETTINGS',
        general: {
          platformName: 'Travel OS',
          companyEmail: 'support@travelos.com',
          websiteUrl: 'https://travelos.com',
          timezone: 'Asia/Kolkata',
          currency: 'INR (₹)',
          language: 'English',
          maintenanceMode: false,
          userRegistration: true,
          emailNotifications: true,
          pushNotifications: true,
          platformVersion: 'v2.4.1',
          buildNumber: '#2847',
          environment: 'Production',
          serverLocation: 'Mumbai, India',
          uptime: '18 days, 6 hours',
        },
        featureFlags: [
          { id: 'feat-community', name: 'Community Hub', description: 'Social traveler community', iconType: 'Users', enabled: true, isBeta: false, environment: 'All' },
          { id: 'feat-ai-itinerary', name: 'AI Smart Itinerary', description: 'AI trip planner', iconType: 'Sparkles', enabled: true, isBeta: true, environment: 'All' },
          { id: 'feat-live-tracking', name: 'Live GPS Tracking', description: 'Active traveler telemetry', iconType: 'Navigation', enabled: true, isBeta: false, environment: 'All' },
          { id: 'feat-multi-currency', name: 'Multi-Currency Payments', description: 'International checkout', iconType: 'CreditCard', enabled: true, isBeta: false, environment: 'All' },
        ],
      });
      return created.general;
    }
    return settings.general;
  }

  async updateGeneralSettings(payload: any, admin: any) {
    let settings = await SystemSettingsModel.findOne({ key: 'GLOBAL_SETTINGS' });
    if (!settings) {
      settings = new SystemSettingsModel({ key: 'GLOBAL_SETTINGS' });
    }

    settings.general = { ...settings.general, ...payload };
    await settings.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'SETTINGS',
      action: 'UPDATE_GENERAL_SETTINGS',
      eventType: 'UPDATE',
      description: 'Updated global system settings configuration',
      severity: 'High',
    });

    return settings.general;
  }

  /**
   * 3. Feature Flags
   */
  async getFeatureFlags() {
    const settings = await SystemSettingsModel.findOne({ key: 'GLOBAL_SETTINGS' }).lean();
    if (!settings || !settings.featureFlags || settings.featureFlags.length === 0) {
      return [
        { id: 'feat-community', name: 'Community Hub', description: 'Social traveler community', iconType: 'Users', enabled: true, isBeta: false, environment: 'All' },
        { id: 'feat-ai-itinerary', name: 'AI Smart Itinerary', description: 'AI trip planner', iconType: 'Sparkles', enabled: true, isBeta: true, environment: 'All' },
        { id: 'feat-live-tracking', name: 'Live GPS Tracking', description: 'Active traveler telemetry', iconType: 'Navigation', enabled: true, isBeta: false, environment: 'All' },
        { id: 'feat-multi-currency', name: 'Multi-Currency Payments', description: 'International checkout', iconType: 'CreditCard', enabled: true, isBeta: false, environment: 'All' },
      ];
    }
    return settings.featureFlags;
  }

  async toggleFeatureFlag(id: string, enabled: boolean, admin: any) {
    let settings = await SystemSettingsModel.findOne({ key: 'GLOBAL_SETTINGS' });
    if (!settings) {
      settings = new SystemSettingsModel({ key: 'GLOBAL_SETTINGS' });
    }

    const flagIndex = settings.featureFlags.findIndex((f: any) => f.id === id);
    if (flagIndex >= 0) {
      settings.featureFlags[flagIndex].enabled = enabled;
    } else {
      settings.featureFlags.push({
        id,
        name: id,
        description: 'Dynamic feature flag',
        iconType: 'Flag',
        enabled,
        isBeta: false,
        environment: 'All',
      });
    }

    await settings.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'SETTINGS',
      action: 'TOGGLE_FEATURE_FLAG',
      eventType: 'UPDATE',
      description: `Toggled feature flag "${id}" to ${enabled ? 'ENABLED' : 'DISABLED'}`,
      severity: 'Medium',
    });

    return { success: true, message: `Feature flag ${id} updated` };
  }
}

export const adminSettingsService = new AdminSettingsService();
