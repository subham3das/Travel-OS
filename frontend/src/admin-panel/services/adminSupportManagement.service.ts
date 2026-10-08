import {
  SupportKPIStats,
  SupportTicketItem,
  SupportAnalyticsData,
  SupportFilters,
  SupportMessage,
  SupportTicketStatus,
} from '../types/supportManagement';
import { adminApiClient } from './adminApiClient';

export const initialSupportKPIStats: SupportKPIStats = {
  openTickets: {
    id: 'kpi-1',
    title: 'Open Tickets',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'vs. last week',
    iconType: 'open',
    sparklineColor: '#6356E5',
  },
  criticalTickets: {
    id: 'kpi-2',
    title: 'Critical Escalations',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'requires immediate SLA action',
    iconType: 'critical',
    sparklineColor: '#EF4444',
  },
  avgResponseTime: {
    id: 'kpi-3',
    title: 'Avg First Response',
    value: '0 mins',
    growth: '0 mins',
    isPositive: true,
    comparison: 'vs. target SLA',
    iconType: 'response_time',
    sparklineColor: '#10B981',
  },
  resolutionRate: {
    id: 'kpi-4',
    title: 'Resolution Rate',
    value: '0.0%',
    growth: '0%',
    isPositive: true,
    comparison: 'resolution rate',
    iconType: 'resolution',
    sparklineColor: '#3B82F6',
  },
  activeAgents: {
    id: 'kpi-5',
    title: 'Active Agents',
    value: '0 Online',
    growth: '0 active',
    isPositive: true,
    comparison: 'handling live chat queue',
    iconType: 'agents',
    sparklineColor: '#8B5CF6',
  },
  customerSatisfaction: {
    id: 'kpi-6',
    title: 'CSAT Score',
    value: '0.0 / 5.0',
    growth: '0.0',
    isPositive: true,
    comparison: 'customer rating',
    iconType: 'csat',
    sparklineColor: '#F59E0B',
  },
};

export const initialSupportAnalytics: SupportAnalyticsData = {
  volumeTrend: [],
  categories: [],
  overallResolutionTime: {
    average: '0m',
    change: '0m',
    isPositive: true,
    distribution: [],
  },
  slaCompliance: {
    rate: 0,
    statusText: 'No tickets evaluated',
    withinSLA: 0,
    breached: 0,
  },
  agentLeaderboard: [],
  issueTags: [],
  statusDistribution: [],
  csatTrend: [],
};

export const initialSupportTickets: SupportTicketItem[] = [];

class AdminSupportManagementService {
  public async getKPIStats(): Promise<SupportKPIStats> {
    try {
      const response = await adminApiClient.get<SupportKPIStats>('/admin/support/stats');
      if (response.success && response.data) {
        return {
          openTickets: response.data.openTickets || initialSupportKPIStats.openTickets,
          criticalTickets: response.data.criticalTickets || initialSupportKPIStats.criticalTickets,
          avgResponseTime: response.data.avgResponseTime || initialSupportKPIStats.avgResponseTime,
          resolutionRate: response.data.resolutionRate || initialSupportKPIStats.resolutionRate,
          activeAgents: response.data.activeAgents || initialSupportKPIStats.activeAgents,
          customerSatisfaction: response.data.customerSatisfaction || initialSupportKPIStats.customerSatisfaction,
        };
      }
      return initialSupportKPIStats;
    } catch {
      return initialSupportKPIStats;
    }
  }

  public async getTickets(filters?: Partial<SupportFilters>): Promise<SupportTicketItem[]> {
    try {
      const params: Record<string, any> = {};
      if (filters?.status && filters.status !== 'All') params.status = filters.status;
      if (filters?.priority && filters.priority !== 'All') params.priority = filters.priority;
      if (filters?.category && filters.category !== 'All') params.category = filters.category;
      if (filters?.search) params.search = filters.search;

      const response = await adminApiClient.get<SupportTicketItem[]>('/admin/support/tickets', { params });
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch {
      return [];
    }
  }

  public async getTicketById(id: string): Promise<SupportTicketItem | undefined> {
    try {
      const response = await adminApiClient.get<SupportTicketItem>(`/admin/support/tickets/${id}`);
      if (response.success && response.data) {
        return response.data;
      }
      return undefined;
    } catch {
      return undefined;
    }
  }

  public async getAnalytics(): Promise<SupportAnalyticsData> {
    try {
      const response = await adminApiClient.get<SupportAnalyticsData>('/admin/support/analytics');
      if (response.success && response.data) {
        return response.data;
      }
      return initialSupportAnalytics;
    } catch {
      return initialSupportAnalytics;
    }
  }

  public async addMessage(
    ticketId: string,
    message: Omit<SupportMessage, 'id' | 'timestamp'>
  ): Promise<SupportTicketItem> {
    const cleanId = ticketId.replace('#', '');
    const response = await adminApiClient.post<SupportTicketItem>(`/admin/support/tickets/${cleanId}/messages`, message);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to send message');
  }

  public async updateTicketStatus(
    ticketId: string,
    status: SupportTicketStatus
  ): Promise<SupportTicketItem> {
    const cleanId = ticketId.replace('#', '');
    const response = await adminApiClient.patch<SupportTicketItem>(`/admin/support/tickets/${cleanId}/status`, { status });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update ticket status');
  }
}

export const adminSupportManagementService = new AdminSupportManagementService();
