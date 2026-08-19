// ─── Super Admin Finance Management Interfaces ────────────────────────────────

export interface FinanceKPICardItem {
  id: string;
  title: string;
  value: string;
  growth: string;
  isPositive: boolean;
  comparison: string;
  iconType: 'gmv' | 'revenue' | 'profit' | 'payouts' | 'settlements' | 'refund' | 'taxes' | 'earnings';
}

export interface FinanceKPIStats {
  gmv: FinanceKPICardItem;
  revenue: FinanceKPICardItem;
  profit: FinanceKPICardItem;
  pendingPayouts: FinanceKPICardItem;
  completedSettlements: FinanceKPICardItem;
  refundAmount: FinanceKPICardItem;
  taxesCollected: FinanceKPICardItem;
  netEarnings: FinanceKPICardItem;
}

export interface RevenueChartPoint {
  date: string;
  label: string;
  revenue: number;
  gmv: number;
  profit: number;
  formattedRevenue: string;
  formattedGmv: string;
  formattedProfit: string;
}

export interface CommissionBreakdownItem {
  name: string;
  amount: string;
  percentage: string;
  color: string;
  value: number;
}

export interface DestinationRevenueItem {
  destination: string;
  amount: string;
  heightPercent: number; // 0 - 100 for bar height
}

export interface TopPerformingAgencyItem {
  id: string;
  rank: number;
  agencyName: string;
  agencyLogo: string;
  revenue: string;
  bookings: number;
  commission: string;
  growth: string;
  isGrowthPositive: boolean;
  rating: number;
}

export interface FinancialSummaryData {
  grossRevenue: { value: string; growth: string; isPositive: boolean };
  netRevenue: { value: string; growth: string; isPositive: boolean };
  totalRefunds: { value: string; growth: string; isPositive: boolean };
  totalDiscounts: { value: string; growth: string; isPositive: boolean };
  taxesPaid: { value: string; growth: string; isPositive: boolean };
  gatewayCharges: { value: string; growth: string; isPositive: boolean };
}

export interface RefundAnalyticsData {
  totalRequests: number;
  approved: number;
  pending: number;
  rejected: number;
  trends: { month: string; requests: number; approved: number }[];
}

export interface SettlementRecord {
  id: string;
  settlementId?: string;
  agencyId: string;
  agencyName: string;
  agencyLogo?: string;
  settlementAmount: string;
  commission: string;
  tax: string;
  netAmount: string;
  settlementDate: string;
  status: 'Pending' | 'Settled' | 'Failed';
  invoiceNumber?: string;
  bankAccount?: string;
  ifsc?: string;
  utrNumber?: string;
}

export type AgencySettlementRow = SettlementRecord;

export interface FinancialTimelineEvent {
  id: string;
  title: string;
  time: string;
  description: string;
  type: 'milestone' | 'payout' | 'refund_spike' | 'target_achieved' | 'peak_revenue';
  amount?: string;
  badge?: string;
}

export type FinancialTimelineItem = FinancialTimelineEvent;

export interface AgencySidebarProfileData {
  agencyId: string;
  agencyName: string;
  agencyLogo: string;
  verified: boolean;
  rating: number;
  revenueOverview: {
    totalRevenue: string;
    bookings: number;
    avgBookingValue: string;
    totalCommission: string;
  };
  settlementHistory: {
    id: string;
    date: string;
    amount: string;
    status: 'Pending' | 'Settled' | 'Failed';
  }[];
  monthlyTrends: {
    month: string;
    revenue: number;
    profit: number;
  }[];
}

export type AgencySidebarData = AgencySidebarProfileData;
