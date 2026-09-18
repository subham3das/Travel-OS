import {
  FinanceKPIStats,
  RevenueChartPoint,
  CommissionBreakdownItem,
  DestinationRevenueItem,
  TopPerformingAgencyItem,
  FinancialSummaryData,
  RefundAnalyticsData,
  SettlementRecord,
  FinancialTimelineEvent,
  AgencySidebarProfileData,
  AgencySettlementRow,
  FinancialTimelineItem,
  AgencySidebarData,
} from '../types/financeManagement';
import { adminApiClient } from './adminApiClient';

export const initialFinanceKPIStats: FinanceKPIStats = {
  gmv: { id: 'gmv', title: 'Gross Merchandise Value', value: '₹0', growth: '0%', isPositive: true, comparison: 'from last 30 days', iconType: 'gmv' },
  revenue: { id: 'revenue', title: 'Platform Revenue', value: '₹0', growth: '0%', isPositive: true, comparison: 'from last 30 days', iconType: 'revenue' },
  profit: { id: 'profit', title: 'Platform Profit', value: '₹0', growth: '0%', isPositive: true, comparison: 'from last 30 days', iconType: 'profit' },
  pendingPayouts: { id: 'payouts', title: 'Pending Agency Payouts', value: '₹0', growth: '0%', isPositive: false, comparison: 'from last 30 days', iconType: 'payouts' },
  completedSettlements: { id: 'settlements', title: 'Completed Settlements', value: '₹0', growth: '0%', isPositive: true, comparison: 'from last 30 days', iconType: 'settlements' },
  refundAmount: { id: 'refund', title: 'Refund Amount', value: '₹0', growth: '0%', isPositive: false, comparison: 'from last 30 days', iconType: 'refund' },
  taxesCollected: { id: 'taxes', title: 'Taxes Collected', value: '₹0', growth: '0%', isPositive: true, comparison: 'from last 30 days', iconType: 'taxes' },
  netEarnings: { id: 'earnings', title: 'Net Earnings', value: '₹0', growth: '0%', isPositive: true, comparison: 'from last 30 days', iconType: 'earnings' },
};

export const initialSettlementRows: AgencySettlementRow[] = [];
export const initialFinancialTimeline: FinancialTimelineItem[] = [];
export const initialAgencySidebarData: AgencySidebarData = {
  agencyId: 'ag-default',
  agencyName: 'Agency Profile',
  agencyLogo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
  verified: true,
  rating: 4.8,
  revenueOverview: {
    totalRevenue: '₹0',
    bookings: 0,
    avgBookingValue: '₹0',
    totalCommission: '₹0',
  },
  settlementHistory: [],
  monthlyTrends: [],
};

export const initialRevenueChartDaily: RevenueChartPoint[] = [];
export const initialCommissionBreakdown: CommissionBreakdownItem[] = [];
export const initialDestinationRevenue: DestinationRevenueItem[] = [];
export const initialDestinationRevenues: DestinationRevenueItem[] = [];
export const initialTopAgencies: TopPerformingAgencyItem[] = [];
export const initialFinancialSummary: FinancialSummaryData = {
  grossRevenue: { value: '₹0', growth: '0%', isPositive: true },
  netRevenue: { value: '₹0', growth: '0%', isPositive: true },
  totalRefunds: { value: '₹0', growth: '0%', isPositive: true },
  totalDiscounts: { value: '₹0', growth: '0%', isPositive: true },
  taxesPaid: { value: '₹0', growth: '0%', isPositive: true },
  gatewayCharges: { value: '₹0', growth: '0%', isPositive: true },
};
export const initialRefundAnalytics: RefundAnalyticsData = {
  totalRequests: 0,
  approved: 0,
  pending: 0,
  rejected: 0,
  trends: [],
};

class AdminFinanceManagementService {
  /**
   * 1. Live KPI Telemetry
   */
  public async getKPIStats(): Promise<FinanceKPIStats> {
    try {
      const res = await adminApiClient.get<FinanceKPIStats>('/admin/finance/stats');
      return res.data || initialFinanceKPIStats;
    } catch {
      return initialFinanceKPIStats;
    }
  }

  /**
   * 2. Live Revenue Chart Points
   */
  public async getRevenueOverview(timeframe: string = '30d'): Promise<RevenueChartPoint[]> {
    const res = await adminApiClient.get<RevenueChartPoint[]>(`/admin/finance/charts?range=${timeframe.toLowerCase()}`);
    return res.data || [];
  }

  public async getRevenueChart(timeframe: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly'): Promise<RevenueChartPoint[]> {
    return this.getRevenueOverview(timeframe);
  }

  /**
   * 3. Commission Breakdown
   */
  public async getCommissionBreakdown(): Promise<CommissionBreakdownItem[]> {
    const res = await adminApiClient.get<CommissionBreakdownItem[]>('/admin/finance/commission-breakdown');
    return res.data || [];
  }

  /**
   * 4. Destination Revenue
   */
  public async getDestinationRevenue(): Promise<DestinationRevenueItem[]> {
    return [
      { destination: 'Manali, HP', amount: '₹78.5 L', heightPercent: 95 },
      { destination: 'Goa Beaches', amount: '₹64.2 L', heightPercent: 80 },
      { destination: 'Kashmir Valley', amount: '₹52.8 L', heightPercent: 65 },
      { destination: 'Kerala Backwaters', amount: '₹41.5 L', heightPercent: 52 },
      { destination: 'Rajasthan Heritage', amount: '₹36.0 L', heightPercent: 45 },
    ];
  }

  public async getDestinationRevenues(): Promise<DestinationRevenueItem[]> {
    return this.getDestinationRevenue();
  }

  /**
   * 5. Top Performing Agencies
   */
  public async getTopAgencies(): Promise<TopPerformingAgencyItem[]> {
    const res = await adminApiClient.get<TopPerformingAgencyItem[]>('/admin/finance/top-agencies');
    return res.data || [];
  }

  public async getTopPerformingAgencies(): Promise<TopPerformingAgencyItem[]> {
    return this.getTopAgencies();
  }

  /**
   * 6. Financial Summary Data
   */
  public async getFinancialSummary(): Promise<FinancialSummaryData> {
    return {
      grossRevenue: { value: '₹24.68 Cr', growth: '+18.6%', isPositive: true },
      netRevenue: { value: '₹3.74 Cr', growth: '+16.2%', isPositive: true },
      totalRefunds: { value: '₹1.32 Cr', growth: '-4.3%', isPositive: true },
      totalDiscounts: { value: '₹84.5 L', growth: '+8.1%', isPositive: true },
      taxesPaid: { value: '₹1.85 Cr', growth: '+14.5%', isPositive: true },
      gatewayCharges: { value: '₹48.2 L', growth: '+12.0%', isPositive: true },
    };
  }

  /**
   * 7. Refund Analytics
   */
  public async getRefundAnalytics(): Promise<RefundAnalyticsData> {
    return {
      totalRequests: 142,
      approved: 128,
      pending: 8,
      rejected: 6,
      trends: [
        { month: 'Jan', requests: 18, approved: 16 },
        { month: 'Feb', requests: 24, approved: 22 },
        { month: 'Mar', requests: 30, approved: 28 },
        { month: 'Apr', requests: 34, approved: 30 },
        { month: 'May', requests: 36, approved: 32 },
      ],
    };
  }

  /**
   * 8. Agency Settlements Queue
   */
  public async getSettlements(): Promise<SettlementRecord[]> {
    const res = await adminApiClient.get<SettlementRecord[]>('/admin/finance/settlements');
    return res.data || [];
  }

  /**
   * 9. Financial Timeline
   */
  public async getFinancialTimeline(): Promise<FinancialTimelineEvent[]> {
    return [
      { id: 'ev-1', type: 'payout', title: 'Automated Bi-Weekly Payout Cycle Disbursed', description: 'Transferred settlements to 48 verified agencies', time: 'Today • 02:00 PM', amount: '₹1.45 Cr', badge: 'Payout' },
      { id: 'ev-2', type: 'target_achieved', title: 'GST Quarterly Reconciliation Finished', description: 'Input tax credit matched with Razorpay statements', time: 'Yesterday • 06:30 PM', amount: '₹36.2 L', badge: 'Tax' },
    ];
  }

  /**
   * 10. Process Settlement Payout
   */
  public async processPayout(settlementId: string): Promise<boolean> {
    const res = await adminApiClient.post(`/admin/finance/settlements/${settlementId}/process`, {});
    return res.success;
  }

  public async approveSettlement(settlementId: string): Promise<boolean> {
    return this.processPayout(settlementId);
  }

  public async rejectSettlement(settlementId: string): Promise<boolean> {
    return true;
  }

  /**
   * 11. Agency Sidebar Profile Data
   */
  public async getAgencySidebarData(agencyId: string): Promise<AgencySidebarProfileData> {
    return {
      agencyId,
      agencyName: 'Wanderlust Holidays Ltd',
      agencyLogo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
      verified: true,
      rating: 4.9,
      revenueOverview: {
        totalRevenue: '₹4.85 Cr',
        bookings: 145,
        avgBookingValue: '₹33,450',
        totalCommission: '₹48.5 L',
      },
      settlementHistory: [
        { id: 'st-1', date: 'May 31, 2024', amount: '₹6.94 L', status: 'Settled' },
        { id: 'st-2', date: 'May 15, 2024', amount: '₹5.82 L', status: 'Settled' },
      ],
      monthlyTrends: [
        { month: 'Jan', revenue: 4200000, profit: 420000 },
        { month: 'Feb', revenue: 4600000, profit: 460000 },
        { month: 'Mar', revenue: 5200000, profit: 520000 },
      ],
    };
  }

  public async getAgencySidebarProfile(agencyId: string): Promise<AgencySidebarProfileData | null> {
    return this.getAgencySidebarData(agencyId);
  }
}

export const adminFinanceManagementService = new AdminFinanceManagementService();
