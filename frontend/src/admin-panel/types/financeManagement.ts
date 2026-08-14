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
  totalRequests: { value: number; growth: string; isPositive: boolean };
  approvedRefunds: { value: number; growth: string; isPositive: boolean };
  pendingRefunds: { value: number; growth: string; isPositive: boolean };
  rejectedRefunds: { value: number; growth: string; isPositive: boolean };
  trendPoints: { date: string; requests: number; approved: number }[];
}

export interface AgencySettlementRow {
  id: string;
  settlementId: string; // e.g. SETT-89231
  agencyName: string;
  agencyLogo: string;
  settlementAmount: string; // e.g. ₹28,45,760
  commission: string; // e.g. ₹4,05,320
  tax: string; // e.g. ₹2,31,100
  netAmount: string; // e.g. ₹22,09,340
  settlementDate: string; // e.g. Jun 12, 2024
  status: 'Pending' | 'Settled' | 'Failed';
}

export interface FinancialTimelineItem {
  id: string;
  date: string;
  title: string;
  type: 'revenue' | 'disbursement' | 'refund' | 'target' | 'record';
}

export interface AgencySidebarData {
  agencyId: string; // e.g. AGY-1001
  agencyName: string;
  agencyLogo: string;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  totalRevenue: string;
  revenueGrowth: string;
  totalBookings: number;
  bookingsGrowth: string;
  avgBookingValue: string;
  avgBookingGrowth: string;
  totalCommission: string;
  commissionGrowth: string;
  settlementHistory: {
    date: string;
    amount: string;
    status: 'Pending' | 'Settled' | 'Failed';
  }[];
  profitBreakdown: {
    totalRevenue: string;
    commission: string;
    taxes: string;
    gatewayCharges: string;
    netProfit: string;
  };
  monthlyTrendPoints: {
    month: string;
    revenue: number;
    profit: number;
  }[];
}
