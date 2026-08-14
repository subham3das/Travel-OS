import {
  FinanceKPIStats,
  RevenueChartPoint,
  CommissionBreakdownItem,
  DestinationRevenueItem,
  TopPerformingAgencyItem,
  FinancialSummaryData,
  RefundAnalyticsData,
  AgencySettlementRow,
  FinancialTimelineItem,
  AgencySidebarData,
} from '../types/financeManagement';

export const initialFinanceKPIStats: FinanceKPIStats = {
  gmv: {
    id: 'gmv',
    title: 'Gross Merchandise Value',
    value: '₹24.68 Cr',
    growth: '18.6%',
    isPositive: true,
    comparison: 'from last 30 days',
    iconType: 'gmv',
  },
  revenue: {
    id: 'revenue',
    title: 'Platform Revenue',
    value: '₹3.74 Cr',
    growth: '16.2%',
    isPositive: true,
    comparison: 'from last 30 days',
    iconType: 'revenue',
  },
  profit: {
    id: 'profit',
    title: 'Platform Profit',
    value: '₹2.18 Cr',
    growth: '20.4%',
    isPositive: true,
    comparison: 'from last 30 days',
    iconType: 'profit',
  },
  pendingPayouts: {
    id: 'payouts',
    title: 'Pending Agency Payouts',
    value: '₹8.73 Cr',
    growth: '3.1%',
    isPositive: false,
    comparison: 'from last 30 days',
    iconType: 'payouts',
  },
  completedSettlements: {
    id: 'settlements',
    title: 'Completed Settlements',
    value: '₹15.95 Cr',
    growth: '22.7%',
    isPositive: true,
    comparison: 'from last 30 days',
    iconType: 'settlements',
  },
  refundAmount: {
    id: 'refund',
    title: 'Refund Amount',
    value: '₹1.32 Cr',
    growth: '6.4%',
    isPositive: false,
    comparison: 'from last 30 days',
    iconType: 'refund',
  },
  taxesCollected: {
    id: 'taxes',
    title: 'Taxes Collected',
    value: '₹1.85 Cr',
    growth: '14.3%',
    isPositive: true,
    comparison: 'from last 30 days',
    iconType: 'taxes',
  },
  netEarnings: {
    id: 'earnings',
    title: 'Net Earnings',
    value: '₹2.52 Cr',
    growth: '19.8%',
    isPositive: true,
    comparison: 'from last 30 days',
    iconType: 'earnings',
  },
};

export const initialRevenueChartDaily: RevenueChartPoint[] = [
  { date: 'Jun 1', label: 'Jun 1', revenue: 1800000, gmv: 12000000, profit: 1100000, formattedRevenue: '₹18.0 L', formattedGmv: '₹1.20 Cr', formattedProfit: '₹11.0 L' },
  { date: 'Jun 2', label: 'Jun 2', revenue: 2100000, gmv: 14200000, profit: 1300000, formattedRevenue: '₹21.0 L', formattedGmv: '₹1.42 Cr', formattedProfit: '₹13.0 L' },
  { date: 'Jun 3', label: 'Jun 3', revenue: 2400000, gmv: 16500000, profit: 1550000, formattedRevenue: '₹24.0 L', formattedGmv: '₹1.65 Cr', formattedProfit: '₹15.5 L' },
  { date: 'Jun 4', label: 'Jun 4', revenue: 2900000, gmv: 19800000, profit: 1800000, formattedRevenue: '₹29.0 L', formattedGmv: '₹1.98 Cr', formattedProfit: '₹18.0 L' },
  { date: 'Jun 5', label: 'Jun 5', revenue: 2600000, gmv: 17200000, profit: 1600000, formattedRevenue: '₹26.0 L', formattedGmv: '₹1.72 Cr', formattedProfit: '₹16.0 L' },
  { date: 'Jun 6', label: 'Jun 6', revenue: 3245760, gmv: 21500000, profit: 2100000, formattedRevenue: '₹32,45,760', formattedGmv: '₹2.15 Cr', formattedProfit: '₹21.0 L' },
  { date: 'Jun 7', label: 'Jun 7', revenue: 3000000, gmv: 20100000, profit: 1950000, formattedRevenue: '₹30.0 L', formattedGmv: '₹2.01 Cr', formattedProfit: '₹19.5 L' },
  { date: 'Jun 8', label: 'Jun 8', revenue: 3300000, gmv: 22400000, profit: 2200000, formattedRevenue: '₹33.0 L', formattedGmv: '₹2.24 Cr', formattedProfit: '₹22.0 L' },
  { date: 'Jun 9', label: 'Jun 9', revenue: 2800000, gmv: 18900000, profit: 1750000, formattedRevenue: '₹28.0 L', formattedGmv: '₹1.89 Cr', formattedProfit: '₹17.5 L' },
  { date: 'Jun 10', label: 'Jun 10', revenue: 3500000, gmv: 23800000, profit: 2400000, formattedRevenue: '₹35.0 L', formattedGmv: '₹2.38 Cr', formattedProfit: '₹24.0 L' },
  { date: 'Jun 11', label: 'Jun 11', revenue: 3100000, gmv: 21000000, profit: 2050000, formattedRevenue: '₹31.0 L', formattedGmv: '₹2.10 Cr', formattedProfit: '₹20.5 L' },
  { date: 'Jun 12', label: 'Jun 12', revenue: 4200000, gmv: 27500000, profit: 2900000, formattedRevenue: '₹42.0 L', formattedGmv: '₹2.75 Cr', formattedProfit: '₹29.0 L' },
];

export const initialCommissionBreakdown: CommissionBreakdownItem[] = [
  { name: 'Platform Commission', amount: '₹3.74 Cr', percentage: '15.2%', color: '#6356E5', value: 15.2 },
  { name: 'Agency Earnings', amount: '₹16.10 Cr', percentage: '65.3%', color: '#10B981', value: 65.3 },
  { name: 'Taxes', amount: '₹1.85 Cr', percentage: '7.5%', color: '#F59E0B', value: 7.5 },
  { name: 'Gateway Charges', amount: '₹0.99 Cr', percentage: '4.0%', color: '#3B82F6', value: 4.0 },
  { name: 'Others', amount: '₹0.00 Cr', percentage: '0.0%', color: '#94A3B8', value: 0.0 },
];

export const initialDestinationRevenues: DestinationRevenueItem[] = [
  { destination: 'Meghalaya', amount: '₹4.68 Cr', heightPercent: 100 },
  { destination: 'Ladakh', amount: '₹3.89 Cr', heightPercent: 83 },
  { destination: 'Goa', amount: '₹3.26 Cr', heightPercent: 70 },
  { destination: 'Kashmir', amount: '₹2.45 Cr', heightPercent: 52 },
  { destination: 'Kerala', amount: '₹2.28 Cr', heightPercent: 49 },
  { destination: 'Andaman', amount: '₹1.75 Cr', heightPercent: 37 },
];

export const initialTopAgencies: TopPerformingAgencyItem[] = [
  {
    id: 'ag-1',
    rank: 1,
    agencyName: 'Wanderlust Holidays',
    agencyLogo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
    revenue: '₹2.68 Cr',
    bookings: 1248,
    commission: '₹40.2 L',
    growth: '24.5%',
    isGrowthPositive: true,
    rating: 4.8,
  },
  {
    id: 'ag-2',
    rank: 2,
    agencyName: 'Himalayan Treks',
    agencyLogo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=200&auto=format&fit=crop',
    revenue: '₹2.34 Cr',
    bookings: 1102,
    commission: '₹35.1 L',
    growth: '18.2%',
    isGrowthPositive: true,
    rating: 4.7,
  },
  {
    id: 'ag-3',
    rank: 3,
    agencyName: 'Goa Getaways',
    agencyLogo: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=200&auto=format&fit=crop',
    revenue: '₹1.98 Cr',
    bookings: 935,
    commission: '₹29.7 L',
    growth: '16.4%',
    isGrowthPositive: true,
    rating: 4.6,
  },
  {
    id: 'ag-4',
    rank: 4,
    agencyName: 'Adventure India',
    agencyLogo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    revenue: '₹1.76 Cr',
    bookings: 842,
    commission: '₹26.4 L',
    growth: '12.8%',
    isGrowthPositive: true,
    rating: 4.5,
  },
  {
    id: 'ag-5',
    rank: 5,
    agencyName: 'TravelXperts',
    agencyLogo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    revenue: '₹1.52 Cr',
    bookings: 732,
    commission: '₹22.8 L',
    growth: '9.3%',
    isGrowthPositive: true,
    rating: 4.4,
  },
];

export const initialFinancialSummary: FinancialSummaryData = {
  grossRevenue: { value: '₹24.68 Cr', growth: '18.6%', isPositive: true },
  netRevenue: { value: '₹18.83 Cr', growth: '17.2%', isPositive: true },
  totalRefunds: { value: '₹1.32 Cr', growth: '6.4%', isPositive: false },
  totalDiscounts: { value: '₹0.98 Cr', growth: '3.1%', isPositive: false },
  taxesPaid: { value: '₹1.85 Cr', growth: '14.3%', isPositive: true },
  gatewayCharges: { value: '₹0.99 Cr', growth: '2.8%', isPositive: false },
};

export const initialRefundAnalytics: RefundAnalyticsData = {
  totalRequests: { value: 1842, growth: '6.2%', isPositive: true },
  approvedRefunds: { value: 1236, growth: '8.4%', isPositive: true },
  pendingRefunds: { value: 428, growth: '2.7%', isPositive: false },
  rejectedRefunds: { value: 178, growth: '4.1%', isPositive: false },
  trendPoints: [
    { date: 'Jun 1', requests: 120, approved: 80 },
    { date: 'Jun 2', requests: 180, approved: 110 },
    { date: 'Jun 3', requests: 160, approved: 105 },
    { date: 'Jun 4', requests: 290, approved: 200 },
    { date: 'Jun 5', requests: 270, approved: 190 },
    { date: 'Jun 6', requests: 310, approved: 230 },
    { date: 'Jun 7', requests: 380, approved: 270 },
    { date: 'Jun 8', requests: 430, approved: 310 },
    { date: 'Jun 9', requests: 590, approved: 420 },
    { date: 'Jun 10', requests: 550, approved: 390 },
    { date: 'Jun 11', requests: 490, approved: 350 },
    { date: 'Jun 12', requests: 620, approved: 440 },
  ],
};

export const initialSettlementRows: AgencySettlementRow[] = [
  {
    id: 's-1',
    settlementId: 'SETT-89231',
    agencyName: 'Wanderlust Holidays',
    agencyLogo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
    settlementAmount: '₹28,45,760',
    commission: '₹4,05,320',
    tax: '₹2,31,100',
    netAmount: '₹22,09,340',
    settlementDate: 'Jun 12, 2024',
    status: 'Pending',
  },
  {
    id: 's-2',
    settlementId: 'SETT-89230',
    agencyName: 'Himalayan Treks',
    agencyLogo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=200&auto=format&fit=crop',
    settlementAmount: '₹24,15,320',
    commission: '₹3,62,300',
    tax: '₹2,02,710',
    netAmount: '₹18,50,310',
    settlementDate: 'Jun 12, 2024',
    status: 'Pending',
  },
  {
    id: 's-3',
    settlementId: 'SETT-89229',
    agencyName: 'Goa Getaways',
    agencyLogo: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=200&auto=format&fit=crop',
    settlementAmount: '₹19,85,450',
    commission: '₹2,97,810',
    tax: '₹1,65,580',
    netAmount: '₹15,22,060',
    settlementDate: 'Jun 11, 2024',
    status: 'Settled',
  },
  {
    id: 's-4',
    settlementId: 'SETT-89228',
    agencyName: 'Adventure India',
    agencyLogo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    settlementAmount: '₹16,75,980',
    commission: '₹2,51,400',
    tax: '₹1,39,620',
    netAmount: '₹12,84,960',
    settlementDate: 'Jun 11, 2024',
    status: 'Settled',
  },
  {
    id: 's-5',
    settlementId: 'SETT-89227',
    agencyName: 'TravelXperts',
    agencyLogo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    settlementAmount: '₹13,25,760',
    commission: '₹1,98,860',
    tax: '₹1,10,480',
    netAmount: '₹10,16,420',
    settlementDate: 'Jun 10, 2024',
    status: 'Failed',
  },
];

export const initialFinancialTimeline: FinancialTimelineItem[] = [
  {
    id: 'ftl-1',
    date: 'Jun 12, 2024',
    title: 'Highest Revenue of ₹1.68 Cr achieved',
    type: 'revenue',
  },
  {
    id: 'ftl-2',
    date: 'Jun 11, 2024',
    title: '₹8.45 Cr disbursed to 23 agencies',
    type: 'disbursement',
  },
  {
    id: 'ftl-3',
    date: 'Jun 9, 2024',
    title: 'Refund spike: ₹23.5 L for 62 bookings',
    type: 'refund',
  },
  {
    id: 'ftl-4',
    date: 'Jun 7, 2024',
    title: 'Monthly commission target 75% achieved',
    type: 'target',
  },
  {
    id: 'ftl-5',
    date: 'Jun 5, 2024',
    title: 'New record: 2,156 bookings in a single day',
    type: 'record',
  },
];

export const initialAgencySidebarData: AgencySidebarData = {
  agencyId: 'AGY-1001',
  agencyName: 'Wanderlust Holidays',
  agencyLogo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
  isVerified: true,
  rating: 4.8,
  totalReviews: 1248,
  totalRevenue: '₹2.68 Cr',
  revenueGrowth: '24.5%',
  totalBookings: 1248,
  bookingsGrowth: '18.2%',
  avgBookingValue: '₹21,474',
  avgBookingGrowth: '5.2%',
  totalCommission: '₹40.2 L',
  commissionGrowth: '16.4%',
  settlementHistory: [
    { date: 'Jun 12, 2024', amount: '₹28,45,760', status: 'Pending' },
    { date: 'Jun 11, 2024', amount: '₹24,15,320', status: 'Settled' },
    { date: 'Jun 10, 2024', amount: '₹19,85,450', status: 'Settled' },
    { date: 'Jun 9, 2024', amount: '₹16,75,980', status: 'Settled' },
    { date: 'Jun 8, 2024', amount: '₹13,25,760', status: 'Failed' },
  ],
  profitBreakdown: {
    totalRevenue: '₹2.68 Cr',
    commission: '₹40.2 L',
    taxes: '₹23.1 L',
    gatewayCharges: '₹12.4 L',
    netProfit: '₹1.92 Cr',
  },
  monthlyTrendPoints: [
    { month: 'Jun 1', revenue: 18, profit: 12 },
    { month: 'Jun 4', revenue: 25, profit: 17 },
    { month: 'Jun 7', revenue: 22, profit: 15 },
    { month: 'Jun 10', revenue: 30, profit: 21 },
    { month: 'Jun 12', revenue: 34, profit: 24 },
  ],
};

class AdminFinanceManagementService {
  private kpiStats: FinanceKPIStats = initialFinanceKPIStats;
  private settlements: AgencySettlementRow[] = initialSettlementRows;
  private agencySidebar: AgencySidebarData = initialAgencySidebarData;

  public async getKPIStats(): Promise<FinanceKPIStats> {
    return new Promise((resolve) => setTimeout(() => resolve(this.kpiStats), 50));
  }

  public async getRevenueOverview(timeframe: 'Daily' | 'Weekly' | 'Monthly'): Promise<RevenueChartPoint[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (timeframe === 'Weekly') {
          resolve([
            { date: 'W1', label: 'Week 1', revenue: 45000000, gmv: 280000000, profit: 32000000, formattedRevenue: '₹4.50 Cr', formattedGmv: '₹28.0 Cr', formattedProfit: '₹3.20 Cr' },
            { date: 'W2', label: 'Week 2', revenue: 52000000, gmv: 310000000, profit: 39000000, formattedRevenue: '₹5.20 Cr', formattedGmv: '₹31.0 Cr', formattedProfit: '₹3.90 Cr' },
            { date: 'W3', label: 'Week 3', revenue: 61000000, gmv: 370000000, profit: 46000000, formattedRevenue: '₹6.10 Cr', formattedGmv: '₹37.0 Cr', formattedProfit: '₹4.60 Cr' },
            { date: 'W4', label: 'Week 4', revenue: 78000000, gmv: 450000000, profit: 59000000, formattedRevenue: '₹7.80 Cr', formattedGmv: '₹45.0 Cr', formattedProfit: '₹5.90 Cr' },
          ]);
        } else if (timeframe === 'Monthly') {
          resolve([
            { date: 'Jan', label: 'Jan 2024', revenue: 180000000, gmv: 1200000000, profit: 130000000, formattedRevenue: '₹18.0 Cr', formattedGmv: '₹120 Cr', formattedProfit: '₹13.0 Cr' },
            { date: 'Feb', label: 'Feb 2024', revenue: 210000000, gmv: 1400000000, profit: 155000000, formattedRevenue: '₹21.0 Cr', formattedGmv: '₹140 Cr', formattedProfit: '₹15.5 Cr' },
            { date: 'Mar', label: 'Mar 2024', revenue: 250000000, gmv: 1700000000, profit: 190000000, formattedRevenue: '₹25.0 Cr', formattedGmv: '₹170 Cr', formattedProfit: '₹19.0 Cr' },
            { date: 'Apr', label: 'Apr 2024', revenue: 290000000, gmv: 1950000000, profit: 220000000, formattedRevenue: '₹29.0 Cr', formattedGmv: '₹195 Cr', formattedProfit: '₹22.0 Cr' },
            { date: 'May', label: 'May 2024', revenue: 340000000, gmv: 2250000000, profit: 260000000, formattedRevenue: '₹34.0 Cr', formattedGmv: '₹225 Cr', formattedProfit: '₹26.0 Cr' },
            { date: 'Jun', label: 'Jun 2024', revenue: 374000000, gmv: 2468000000, profit: 218000000, formattedRevenue: '₹37.4 Cr', formattedGmv: '₹246.8 Cr', formattedProfit: '₹21.8 Cr' },
          ]);
        } else {
          resolve(initialRevenueChartDaily);
        }
      }, 50);
    });
  }

  public async getCommissionBreakdown(): Promise<CommissionBreakdownItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(initialCommissionBreakdown), 50));
  }

  public async getDestinationRevenues(): Promise<DestinationRevenueItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(initialDestinationRevenues), 50));
  }

  public async getTopAgencies(): Promise<TopPerformingAgencyItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(initialTopAgencies), 50));
  }

  public async getFinancialSummary(): Promise<FinancialSummaryData> {
    return new Promise((resolve) => setTimeout(() => resolve(initialFinancialSummary), 50));
  }

  public async getRefundAnalytics(): Promise<RefundAnalyticsData> {
    return new Promise((resolve) => setTimeout(() => resolve(initialRefundAnalytics), 50));
  }

  public async getSettlements(): Promise<AgencySettlementRow[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.settlements), 50));
  }

  public async approveSettlement(id: string): Promise<boolean> {
    this.settlements = this.settlements.map((s) =>
      s.id === id || s.settlementId === id ? { ...s, status: 'Settled' as const } : s
    );
    return true;
  }

  public async rejectSettlement(id: string): Promise<boolean> {
    this.settlements = this.settlements.map((s) =>
      s.id === id || s.settlementId === id ? { ...s, status: 'Failed' as const } : s
    );
    return true;
  }

  public async getFinancialTimeline(): Promise<FinancialTimelineItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(initialFinancialTimeline), 50));
  }

  public async getAgencySidebarData(agencyName?: string): Promise<AgencySidebarData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (agencyName && agencyName !== 'Wanderlust Holidays') {
          resolve({
            ...this.agencySidebar,
            agencyName,
            agencyId: `AGY-${Math.floor(1000 + Math.random() * 9000)}`,
          });
        } else {
          resolve(this.agencySidebar);
        }
      }, 50);
    });
  }
}

export const adminFinanceManagementService = new AdminFinanceManagementService();
