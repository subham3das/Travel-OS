import {
  AuditLogKPIStats,
  AuditLogItem,
  EventCategoryCount,
  EventDistributionItem,
  TopActiveAdminItem,
  SecurityAlertItem,
  AuditSeverity,
  AuditStatus,
} from '../types/auditLogsManagement';
import {
  initialAuditKPIStats,
  initialAuditLogsData,
  initialEventCategories,
  initialEventDistribution,
  initialLoginHeatmapMatrix,
  initialTopAdmins,
  initialSecurityAlerts,
} from '../data/auditLogsData';

export interface AuditLogFilters {
  search?: string;
  category?: string;
  severity?: string;
  module?: string;
  user?: string;
  status?: string;
}

class AdminAuditLogsManagementService {
  private kpiStats: AuditLogKPIStats = initialAuditKPIStats;
  private logs: AuditLogItem[] = initialAuditLogsData;
  private categories: EventCategoryCount[] = initialEventCategories;
  private eventDistribution: EventDistributionItem[] = initialEventDistribution;
  private heatmapMatrix: number[][] = initialLoginHeatmapMatrix;
  private topAdmins: TopActiveAdminItem[] = initialTopAdmins;
  private securityAlerts: SecurityAlertItem[] = initialSecurityAlerts;

  public async getKPIStats(): Promise<AuditLogKPIStats> {
    return new Promise((resolve) => setTimeout(() => resolve(this.kpiStats), 40));
  }

  public async getAuditLogs(filters?: AuditLogFilters): Promise<AuditLogItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...this.logs];

        if (filters?.category && filters.category !== 'All') {
          result = result.filter(
            (l) => l.module.toLowerCase() === filters.category?.toLowerCase()
          );
        }

        if (filters?.severity && filters.severity !== 'All Severities') {
          result = result.filter(
            (l) => l.severity.toLowerCase() === filters.severity?.toLowerCase()
          );
        }

        if (filters?.module && filters.module !== 'All Modules') {
          result = result.filter(
            (l) => l.module.toLowerCase() === filters.module?.toLowerCase()
          );
        }

        if (filters?.status && filters.status !== 'All Statuses') {
          result = result.filter(
            (l) => l.status.toLowerCase() === filters.status?.toLowerCase()
          );
        }

        if (filters?.search && filters.search.trim() !== '') {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (l) =>
              l.description.toLowerCase().includes(q) ||
              l.eventType.toLowerCase().includes(q) ||
              l.actor.name.toLowerCase().includes(q) ||
              l.ipAddress.includes(q) ||
              l.id.toLowerCase().includes(q)
          );
        }

        resolve(result);
      }, 40);
    });
  }

  public async getCategories(): Promise<EventCategoryCount[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.categories), 40));
  }

  public async getEventDistribution(): Promise<EventDistributionItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.eventDistribution), 40));
  }

  public async getLoginHeatmap(): Promise<number[][]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.heatmapMatrix), 40));
  }

  public async getTopAdmins(): Promise<TopActiveAdminItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.topAdmins), 40));
  }

  public async getSecurityAlerts(): Promise<SecurityAlertItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.securityAlerts), 40));
  }
}

export const adminAuditLogsManagementService = new AdminAuditLogsManagementService();
