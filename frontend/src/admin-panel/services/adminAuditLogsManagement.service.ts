import { adminApiClient } from './adminApiClient';
import {
  AuditLogKPIStats,
  AuditLogItem,
  EventCategoryCount,
  EventDistributionItem,
  TopActiveAdminItem,
  SecurityAlertItem,
} from '../types/auditLogsManagement';
export const initialAuditKPIStats: AuditLogKPIStats = {
  totalEventsToday: {
    id: 'totalEventsToday',
    title: 'Total Events Today',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'vs yesterday',
    iconType: 'events',
    sparklineColor: '#6356E5',
  },
  criticalEvents: {
    id: 'criticalEvents',
    title: 'Critical Events',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'vs yesterday',
    iconType: 'critical',
    sparklineColor: '#EF4444',
  },
  failedLogins: {
    id: 'failedLogins',
    title: 'Failed Logins',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'vs yesterday',
    iconType: 'failed',
    sparklineColor: '#F97316',
  },
  suspiciousActivities: {
    id: 'suspiciousActivities',
    title: 'Suspicious Activities',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'vs yesterday',
    iconType: 'threats',
    sparklineColor: '#EF4444',
  },
  adminActions: {
    id: 'adminActions',
    title: 'Admin Actions',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'vs yesterday',
    iconType: 'admin',
    sparklineColor: '#3B82F6',
  },
  systemEvents: {
    id: 'systemEvents',
    title: 'System Events',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'vs yesterday',
    iconType: 'system',
    sparklineColor: '#10B981',
  },
};

export const initialLoginHeatmapMatrix: number[][] = Array(7)
  .fill(0)
  .map(() => Array(7).fill(0));

export interface AuditLogFilters {
  search?: string;
  category?: string;
  severity?: string;
  module?: string;
  user?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAuditLogsResponse {
  logs: AuditLogItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class AdminAuditLogsManagementService {
  /**
   * 1. Fetch Real-time Dashboard KPI Telemetry from MongoDB
   */
  public async getKPIStats(): Promise<AuditLogKPIStats> {
    try {
      const res = await adminApiClient.get<AuditLogKPIStats>('/admin/audit-logs/stats');
      return res.data || initialAuditKPIStats;
    } catch (error: any) {
      console.error('Error fetching audit KPI stats:', error);
      throw error;
    }
  }

  /**
   * 2. Fetch Paginated & Filtered Audit Logs from MongoDB
   */
  public async getAuditLogs(
    filters?: AuditLogFilters
  ): Promise<PaginatedAuditLogsResponse> {
    try {
      const res = await adminApiClient.get<PaginatedAuditLogsResponse>('/admin/audit-logs', {
        params: {
          search: filters?.search || undefined,
          category: filters?.category || undefined,
          severity: filters?.severity || undefined,
          module: filters?.module || undefined,
          status: filters?.status || undefined,
          startDate: filters?.startDate || undefined,
          endDate: filters?.endDate || undefined,
          page: filters?.page || 1,
          limit: filters?.limit || 20,
        },
      });

      return res.data || {
        logs: [],
        pagination: { total: 0, page: 1, limit: 20, totalPages: 1 },
      };
    } catch (error: any) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }

  /**
   * 3. Fetch Grouped Module Categories with Live Counts
   */
  public async getCategories(): Promise<EventCategoryCount[]> {
    try {
      const res = await adminApiClient.get<EventCategoryCount[]>('/admin/audit-logs/categories');
      return res.data || [];
    } catch (error: any) {
      console.error('Error fetching audit categories:', error);
      return [];
    }
  }

  /**
   * 4. Fetch Event Distribution Breakdown
   */
  public async getEventDistribution(): Promise<EventDistributionItem[]> {
    try {
      const res = await adminApiClient.get<EventDistributionItem[]>('/admin/audit-logs/distribution');
      return res.data || [];
    } catch (error: any) {
      console.error('Error fetching event distribution:', error);
      return [];
    }
  }

  /**
   * 5. Fetch 7x7 Login Activity Heatmap
   */
  public async getLoginHeatmap(): Promise<number[][]> {
    try {
      const res = await adminApiClient.get<number[][]>('/admin/audit-logs/heatmap');
      return res.data || initialLoginHeatmapMatrix;
    } catch (error: any) {
      console.error('Error fetching login heatmap:', error);
      return initialLoginHeatmapMatrix;
    }
  }

  /**
   * 6. Fetch Top Active Administrators
   */
  public async getTopAdmins(): Promise<TopActiveAdminItem[]> {
    try {
      const res = await adminApiClient.get<TopActiveAdminItem[]>('/admin/audit-logs/top-admins');
      return res.data || [];
    } catch (error: any) {
      console.error('Error fetching top active admins:', error);
      return [];
    }
  }

  /**
   * 7. Fetch Security Alerts
   */
  public async getSecurityAlerts(): Promise<SecurityAlertItem[]> {
    try {
      const res = await adminApiClient.get<SecurityAlertItem[]>('/admin/audit-logs/security-alerts');
      return res.data || [];
    } catch (error: any) {
      console.error('Error fetching security alerts:', error);
      return [];
    }
  }

  /**
   * 8. Fetch Single Event by ID
   */
  public async getAuditLogById(id: string): Promise<AuditLogItem | null> {
    try {
      const res = await adminApiClient.get<AuditLogItem>(`/admin/audit-logs/${id}`);
      return res.data || null;
    } catch (error: any) {
      console.error('Error fetching audit log by ID:', error);
      return null;
    }
  }
}

export const adminAuditLogsManagementService = new AdminAuditLogsManagementService();
