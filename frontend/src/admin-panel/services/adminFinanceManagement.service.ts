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
  agencyId: '',
  agencyName: 'Agency Profile',
  agencyLogo: '',
  verified: false,
  rating: 0.0,
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
    try {
      const res = await adminApiClient.get<DestinationRevenueItem[]>('/admin/finance/destinations');
      return res.data || [];
    } catch {
      return [];
    }
  }

  public async getDestinationRevenues(): Promise<DestinationRevenueItem[]> {
    return this.getDestinationRevenue();
  }

  /**
   * 5. Top Performing Agencies
   */
  public async getTopAgencies(): Promise<TopPerformingAgencyItem[]> {
    try {
      const res = await adminApiClient.get<TopPerformingAgencyItem[]>('/admin/finance/top-agencies');
      return res.data || [];
    } catch {
      return [];
    }
  }

  public async getTopPerformingAgencies(): Promise<TopPerformingAgencyItem[]> {
    return this.getTopAgencies();
  }

  /**
   * 6. Financial Summary Data
   */
  public async getFinancialSummary(): Promise<FinancialSummaryData> {
    try {
      const res = await adminApiClient.get<FinancialSummaryData>('/admin/finance/summary');
      return res.data || initialFinancialSummary;
    } catch {
      return initialFinancialSummary;
    }
  }

  /**
   * 7. Refund Analytics
   */
  public async getRefundAnalytics(): Promise<RefundAnalyticsData> {
    try {
      const res = await adminApiClient.get<RefundAnalyticsData>('/admin/finance/refunds');
      return res.data || initialRefundAnalytics;
    } catch {
      return initialRefundAnalytics;
    }
  }

  /**
   * 8. Agency Settlements Queue
   */
  public async getSettlements(): Promise<SettlementRecord[]> {
    try {
      const res = await adminApiClient.get<SettlementRecord[]>('/admin/finance/settlements');
      return res.data || [];
    } catch {
      return [];
    }
  }

  /**
   * 9. Financial Timeline
   */
  public async getFinancialTimeline(): Promise<FinancialTimelineEvent[]> {
    try {
      const res = await adminApiClient.get<FinancialTimelineEvent[]>('/admin/finance/timeline');
      return res.data || [];
    } catch {
      return [];
    }
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
    try {
      const res = await adminApiClient.get<AgencySidebarProfileData>(`/admin/finance/agency/${agencyId}`);
      if (res.success && res.data) {
        return res.data;
      }
    } catch {
      // fallback to empty
    }
    return {
      agencyId,
      agencyName: 'Agency Profile',
      agencyLogo: '',
      verified: false,
      rating: 0.0,
      revenueOverview: {
        totalRevenue: '₹0',
        bookings: 0,
        avgBookingValue: '₹0',
        totalCommission: '₹0',
      },
      settlementHistory: [],
      monthlyTrends: [],
    };
  }

  public async getAgencySidebarProfile(agencyId: string): Promise<AgencySidebarProfileData | null> {
    return this.getAgencySidebarData(agencyId);
  }
}

export const adminFinanceManagementService = new AdminFinanceManagementService();
