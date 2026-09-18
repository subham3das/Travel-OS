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
    growth: '-2.4%',
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
    value: '14 mins',
    growth: '-4.2 mins',
    isPositive: true,
    comparison: 'vs. 28 min target SLA',
    iconType: 'response_time',
    sparklineColor: '#10B981',
  },
  resolutionRate: {
    id: 'kpi-4',
    title: 'Resolution Rate',
    value: '94.2%',
    growth: '+1.8%',
    isPositive: true,
    comparison: 'within first 24 hrs',
    iconType: 'resolution',
    sparklineColor: '#3B82F6',
  },
  activeAgents: {
    id: 'kpi-5',
    title: 'Active Agents',
    value: '12 Online',
    growth: '100% capacity',
    isPositive: true,
    comparison: 'handling live chat queue',
    iconType: 'agents',
    sparklineColor: '#8B5CF6',
  },
  customerSatisfaction: {
    id: 'kpi-6',
    title: 'CSAT Score',
    value: '4.85 / 5.0',
    growth: '+0.12',
    isPositive: true,
    comparison: '97.2% positive ratings',
    iconType: 'csat',
    sparklineColor: '#F59E0B',
  },
};

export const initialSupportAnalytics: SupportAnalyticsData = {
  volumeTrend: [
    { date: 'Mon', label: 'Mon', tickets: 24 },
    { date: 'Tue', label: 'Tue', tickets: 32 },
    { date: 'Wed', label: 'Wed', tickets: 45 },
    { date: 'Thu', label: 'Thu', tickets: 38 },
    { date: 'Fri', label: 'Fri', tickets: 52 },
    { date: 'Sat', label: 'Sat', tickets: 29 },
    { date: 'Sun', label: 'Sun', tickets: 20 },
  ],
  categories: [
    { name: 'Refund', count: 48, percentage: 35, color: '#EF4444' },
    { name: 'Package', count: 32, percentage: 24, color: '#6356E5' },
    { name: 'Payment', count: 24, percentage: 18, color: '#10B981' },
    { name: 'Check-in', count: 18, percentage: 13, color: '#F59E0B' },
    { name: 'Other', count: 14, percentage: 10, color: '#64748B' },
  ],
  overallResolutionTime: {
    average: '4h 12m',
    change: '-25 mins',
    isPositive: true,
    distribution: [
      { range: '< 1 hr', percentage: 42, color: '#10B981' },
      { range: '1 - 4 hrs', percentage: 38, color: '#3B82F6' },
      { range: '4 - 12 hrs', percentage: 14, color: '#F59E0B' },
      { range: '> 12 hrs', percentage: 6, color: '#EF4444' },
    ],
  },
  slaCompliance: {
    rate: 98.4,
    statusText: 'Excellent SLA Compliance',
    withinSLA: 124,
    breached: 2,
  },
  agentLeaderboard: [
    {
      id: 'ag-1',
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      assigned: 48,
      resolved: 46,
      resolutionTime: '1h 45m',
      slaCompliance: 99.2,
      rating: 4.9,
    },
    {
      id: 'ag-2',
      name: 'Rahul Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      assigned: 42,
      resolved: 39,
      resolutionTime: '2h 10m',
      slaCompliance: 97.8,
      rating: 4.8,
    },
  ],
  issueTags: [
    { tag: 'Refund Delay', count: 34, size: 'large', color: '#EF4444', bgColor: '#FEF2F2' },
    { tag: 'Booking Voucher', count: 28, size: 'large', color: '#6356E5', bgColor: '#EEF2FF' },
    { tag: 'Cancellation Policy', count: 21, size: 'medium', color: '#F59E0B', bgColor: '#FFFBEB' },
    { tag: 'Payment Gateway', count: 18, size: 'medium', color: '#10B981', bgColor: '#ECFDF5' },
    { tag: 'Hotel Check-in', count: 12, size: 'small', color: '#64748B', bgColor: '#F8FAFC' },
  ],
  statusDistribution: [
    { name: 'Open', count: 18, percentage: 22, color: '#6356E5' },
    { name: 'Assigned', count: 24, percentage: 30, color: '#3B82F6' },
    { name: 'Pending', count: 12, percentage: 15, color: '#F59E0B' },
    { name: 'Escalated', count: 4, percentage: 5, color: '#EF4444' },
    { name: 'Closed', count: 22, percentage: 28, color: '#10B981' },
  ],
  csatTrend: [
    { label: 'Week 1', date: 'W1', score: 4.75 },
    { label: 'Week 2', date: 'W2', score: 4.8 },
    { label: 'Week 3', date: 'W3', score: 4.82 },
    { label: 'Week 4', date: 'W4', score: 4.85 },
  ],
};

export const initialSupportTickets: SupportTicketItem[] = [];

class AdminSupportManagementService {
  public async getKPIStats(): Promise<SupportKPIStats> {
    try {
      const response = await adminApiClient.get<SupportKPIStats>('/support/stats');
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

      const response = await adminApiClient.get<SupportTicketItem[]>('/support/tickets', { params });
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
      const response = await adminApiClient.get<SupportTicketItem>(`/support/tickets/${id}`);
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
      const response = await adminApiClient.get<SupportAnalyticsData>('/support/analytics');
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
    const response = await adminApiClient.post<SupportTicketItem>(`/support/tickets/${cleanId}/messages`, message);
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
    const response = await adminApiClient.patch<SupportTicketItem>(`/support/tickets/${cleanId}/status`, { status });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update ticket status');
  }
}

export const adminSupportManagementService = new AdminSupportManagementService();
