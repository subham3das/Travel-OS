// ─── Super Admin Dashboard Service (Live Backend API Integration) ───────────
import { adminApiClient } from './adminApiClient';
import {
  DashboardStats,
  RevenueMetric,
  BookingMetric,
  GrowthMetric,
  Activity,
  Transaction,
  ApprovalRequest,
  SystemHealth,
  QuickAction,
} from '../types/dashboard';

export const adminDashboardService = {
  /**
   * 1. GET Top 8 KPI Stats from MongoDB
   */
  getStats: async (): Promise<DashboardStats> => {
    const response = await adminApiClient.get<DashboardStats>('/admin/dashboard/stats');
    if (!response.data) throw new Error('Failed to retrieve dashboard stats from backend');
    return response.data;
  },

  /**
   * 2. GET Charts Data
   */
  getCharts: async (range: string = '30d'): Promise<{
    revenue: RevenueMetric;
    bookingTrend: BookingMetric;
    userGrowth: GrowthMetric;
    agencyGrowth: GrowthMetric;
  }> => {
    const response = await adminApiClient.get<{
      revenue: RevenueMetric;
      bookingTrend: BookingMetric;
      userGrowth: GrowthMetric;
      agencyGrowth: GrowthMetric;
    }>(`/admin/dashboard/charts?range=${range}`);
    if (!response.data) throw new Error('Failed to retrieve dashboard charts from backend');
    return response.data;
  },

  getRevenueOverview: async (range: string = '30d'): Promise<RevenueMetric> => {
    const charts = await adminDashboardService.getCharts(range);
    return charts.revenue;
  },

  getBookingTrend: async (range: string = '30d'): Promise<BookingMetric> => {
    const charts = await adminDashboardService.getCharts(range);
    return charts.bookingTrend;
  },

  getUserGrowth: async (range: string = '30d'): Promise<GrowthMetric> => {
    const charts = await adminDashboardService.getCharts(range);
    return charts.userGrowth;
  },

  getAgencyGrowth: async (range: string = '30d'): Promise<GrowthMetric> => {
    const charts = await adminDashboardService.getCharts(range);
    return charts.agencyGrowth;
  },

  /**
   * 3. GET Recent Activities (from audit_logs)
   */
  getRecentActivities: async (limit: number = 5): Promise<Activity[]> => {
    const response = await adminApiClient.get<Activity[]>(`/admin/dashboard/recent-activities?limit=${limit}`);
    return response.data || [];
  },

  /**
   * 4. GET Latest Transactions (from payments)
   */
  getLatestTransactions: async (limit: number = 5): Promise<Transaction[]> => {
    const response = await adminApiClient.get<Transaction[]>(`/admin/dashboard/latest-transactions?limit=${limit}`);
    return response.data || [];
  },

  /**
   * 5. GET Pending Approvals (from agencies & packages)
   */
  getPendingApprovals: async (limit: number = 5): Promise<ApprovalRequest[]> => {
    const response = await adminApiClient.get<ApprovalRequest[]>(`/admin/dashboard/pending-approvals?limit=${limit}`);
    return response.data || [];
  },

  /**
   * 6. GET System Health Telemetry
   */
  getSystemHealth: async (): Promise<SystemHealth> => {
    const response = await adminApiClient.get<SystemHealth>('/admin/dashboard/system-health');
    if (!response.data) throw new Error('Failed to retrieve system health from backend');
    return response.data;
  },

  /**
   * 7. GET Quick Actions
   */
  getQuickActions: async (): Promise<QuickAction[]> => {
    const response = await adminApiClient.get<QuickAction[]>('/admin/dashboard/quick-actions');
    return response.data || [];
  },
};
