import {
  SettingsKPIStats,
  GeneralSettingsData,
  FeatureFlagItem,
  SystemStatusMetric,
  ConnectedServiceItem,
  SettingsRecentChangeItem,
  IntegrationHealthItem,
  BackupTimelineItem,
  FeatureUsageItem,
  ApiUsagePoint,
} from '../types/settingsManagement';
import {
  initialSettingsKPIStats,
  initialGeneralSettings,
  initialFeatureFlags,
  initialSystemStatusMetrics,
  initialConnectedServices,
  initialSettingsRecentChanges,
  initialIntegrationHealth,
  initialApiUsagePoints,
  initialBackupTimeline,
  initialFeatureUsage,
} from '../data/settingsData';

class AdminSettingsManagementService {
  private kpiStats: SettingsKPIStats = initialSettingsKPIStats;
  private generalSettings: GeneralSettingsData = initialGeneralSettings;
  private featureFlags: FeatureFlagItem[] = initialFeatureFlags;
  private systemMetrics: SystemStatusMetric[] = initialSystemStatusMetrics;
  private connectedServices: ConnectedServiceItem[] = initialConnectedServices;
  private recentChanges: SettingsRecentChangeItem[] = initialSettingsRecentChanges;
  private integrationHealth: IntegrationHealthItem[] = initialIntegrationHealth;
  private apiUsage: ApiUsagePoint[] = initialApiUsagePoints;
  private backupTimeline: BackupTimelineItem[] = initialBackupTimeline;
  private featureUsage: FeatureUsageItem[] = initialFeatureUsage;

  public async getKPIStats(): Promise<SettingsKPIStats> {
    return new Promise((resolve) => setTimeout(() => resolve(this.kpiStats), 40));
  }

  public async getGeneralSettings(): Promise<GeneralSettingsData> {
    return new Promise((resolve) => setTimeout(() => resolve(this.generalSettings), 40));
  }

  public async updateGeneralSettings(data: Partial<GeneralSettingsData>): Promise<GeneralSettingsData> {
    this.generalSettings = { ...this.generalSettings, ...data };
    return this.generalSettings;
  }

  public async getFeatureFlags(): Promise<FeatureFlagItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.featureFlags), 40));
  }

  public async toggleFeatureFlag(id: string, enabled: boolean): Promise<FeatureFlagItem[]> {
    this.featureFlags = this.featureFlags.map((f) =>
      f.id === id ? { ...f, enabled } : f
    );
    return this.featureFlags;
  }

  public async getSystemMetrics(): Promise<SystemStatusMetric[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.systemMetrics), 40));
  }

  public async getConnectedServices(): Promise<ConnectedServiceItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.connectedServices), 40));
  }

  public async getRecentChanges(): Promise<SettingsRecentChangeItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.recentChanges), 40));
  }

  public async getIntegrationHealth(): Promise<IntegrationHealthItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.integrationHealth), 40));
  }

  public async getApiUsage(): Promise<ApiUsagePoint[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.apiUsage), 40));
  }

  public async getBackupTimeline(): Promise<BackupTimelineItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.backupTimeline), 40));
  }

  public async createBackup(): Promise<BackupTimelineItem> {
    const newBackup: BackupTimelineItem = {
      id: `bk-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      type: 'Manual Backup',
      status: 'Success',
    };
    this.backupTimeline = [newBackup, ...this.backupTimeline];
    return newBackup;
  }

  public async getFeatureUsage(): Promise<FeatureUsageItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.featureUsage), 40));
  }

  public async resetToDefaults(): Promise<GeneralSettingsData> {
    this.generalSettings = { ...initialGeneralSettings };
    this.featureFlags = [...initialFeatureFlags];
    return this.generalSettings;
  }
}

export const adminSettingsManagementService = new AdminSettingsManagementService();
