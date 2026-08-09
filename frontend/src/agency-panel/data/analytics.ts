// ─── Agency Analytics Mock Data Repository ───────────────────────────────────

export interface KPIStatItem {
  id: string;
  label: string;
  value: string;
  growth: string;
  growthPeriod: string;
  isPositive: boolean;
  type: 'revenue' | 'bookings' | 'trips' | 'travelers' | 'rating';
}

export interface RevenueOverviewData {
  totalRevenue: string; // "₹8,76,540"
  growthPct: string; // "18.6%"
  grossRevenue: string; // "₹9,45,200"
  refunds: string; // "-₹68,660"
  netRevenue: string; // "₹8,76,540"
  avgBookingValue: string; // "₹3,712"
  chartLabels: string[];
  chartDataPoints: number[];
}

export interface RevenueSourceItem {
  name: string;
  percentage: number;
  value: string;
  color: string;
}

export interface RevenueExpenseDataPoint {
  date: string;
  revenue: number;
  expenses: number;
}

export interface BookingStatusBreakdown {
  confirmed: number;
  confirmedPct: number;
  pending: number;
  pendingPct: number;
  cancelled: number;
  cancelledPct: number;
  refunded: number;
  refundedPct: number;
  total: number;
  cancellationRate: string;
  refundRate: string;
}

export interface BookingTrendDataPoint {
  date: string;
  bookings: number;
}

export interface TripPerformanceSummary {
  upcoming: number;
  ongoing: number;
  completed: number;
  cancelled: number;
  avgOccupancyPct: number;
  occupancyGrowth: string;
}

export interface PackageAnalyticsItem {
  rank: number;
  id: string;
  name: string;
  bookings: number;
  revenue: string;
  revenueVal: number;
  rating: number;
  occupancyPct: number;
  coverImage: string;
}

export interface DestinationAnalyticsItem {
  rank: number;
  id: string;
  name: string;
  bookings: number;
  revenue: string;
  revenueVal: number;
  avgOccupancyPct: number;
  growthPct: string;
}

export interface TravelerInsightsData {
  totalTravelers: number;
  totalGrowth: string;
  newTravelers: number;
  newGrowth: string;
  returningTravelers: number;
  returningGrowth: string;
  repeatBookingRate: string;
  repeatGrowth: string;
  avgGroupSize: string;
}

export interface FinancialSummaryData {
  grossRevenue: string;
  netRevenue: string;
  refunds: string;
  estimatedProfit: string;
  profitMarginPct: number;
  marginGrowth: string;
  paymentCompletionRate: string; // e.g. "94.2%"
  fullyPaidCount: number; // 312
  awaitingPaymentCount: number; // 36
  avgDaysToCompletePayment: string; // "3.4 Days"
}

export interface AnalyticsInsightItem {
  id: string;
  title: string;
  iconType: 'revenue' | 'package' | 'warning' | 'trend' | 'rating';
}

export const MOCK_ANALYTICS_DATA = {
  kpis: [
    {
      id: 'kpi-rev',
      label: 'Total Revenue',
      value: '₹8,76,540',
      growth: '↑ 18.6%',
      growthPeriod: 'vs last 7 days',
      isPositive: true,
      type: 'revenue',
    },
    {
      id: 'kpi-bk',
      label: 'Total Bookings',
      value: '236',
      growth: '↑ 14.2%',
      growthPeriod: 'vs last 7 days',
      isPositive: true,
      type: 'bookings',
    },
    {
      id: 'kpi-[#TRIP]',
      label: 'Active Trips',
      value: '18',
      growth: '↑ 5.6%',
      growthPeriod: 'vs last 7 days',
      isPositive: true,
      type: 'trips',
    },
    {
      id: 'kpi-trv',
      label: 'Total Travelers',
      value: '487',
      growth: '↑ 11.3%',
      growthPeriod: 'vs last 7 days',
      isPositive: true,
      type: 'travelers',
    },
    {
      id: 'kpi-rtg',
      label: 'Avg. Rating',
      value: '4.6/5',
      growth: '↑ 0.4',
      growthPeriod: 'vs last 7 days',
      isPositive: true,
      type: 'rating',
    },
  ] as KPIStatItem[],

  revenueOverview: {
    totalRevenue: '₹8,76,540',
    growthPct: '18.6%',
    grossRevenue: '₹9,45,200',
    refunds: '-₹68,660',
    netRevenue: '₹8,76,540',
    avgBookingValue: '₹3,712',
    chartLabels: ['1 Aug', '5 Aug', '10 Aug', '15 Aug', '20 Aug', '25 Aug', '30 Aug'],
    chartDataPoints: [22, 38, 52, 45, 68, 85, 76, 98],
  } as RevenueOverviewData,

  revenueSources: [
    { name: 'Direct Bookings', percentage: 42, value: '₹3,68,146', color: '#583BE8' },
    { name: 'Travel OS Platform', percentage: 35, value: '₹3,06,789', color: '#0EA5E9' },
    { name: 'Repeat Bookings', percentage: 15, value: '₹1,31,481', color: '#10B981' },
    { name: 'Referrals', percentage: 8, value: '₹70,124', color: '#F59E0B' },
  ] as RevenueSourceItem[],

  revenueVsExpenses: [
    { date: '1 Aug', revenue: 65, expenses: 32 },
    { date: '8 Aug', revenue: 82, expenses: 45 },
    { date: '15 Aug', revenue: 74, expenses: 38 },
    { date: '22 Aug', revenue: 95, expenses: 52 },
    { date: '31 Aug', revenue: 88, expenses: 40 },
  ] as RevenueExpenseDataPoint[],

  bookingOverview: {
    confirmed: 146,
    confirmedPct: 61.9,
    pending: 52,
    pendingPct: 22.0,
    cancelled: 28,
    cancelledPct: 11.9,
    refunded: 10,
    refundedPct: 4.2,
    total: 236,
    cancellationRate: '11.9%',
    refundRate: '4.2%',
  } as BookingStatusBreakdown,

  bookingTrend: [
    { date: '1 Aug', bookings: 28 },
    { date: '8 Aug', bookings: 46 },
    { date: '15 Aug', bookings: 38 },
    { date: '22 Aug', bookings: 54 },
    { date: '31 Aug', bookings: 42 },
  ] as BookingTrendDataPoint[],

  tripPerformance: {
    upcoming: 12,
    ongoing: 6,
    completed: 34,
    cancelled: 5,
    avgOccupancyPct: 82,
    occupancyGrowth: '↑ 9% vs last month',
  } as TripPerformanceSummary,

  packages: [
    {
      rank: 1,
      id: 'pkg-1',
      name: 'Ladakh Adventure',
      bookings: 124,
      revenue: '₹4,25,000',
      revenueVal: 425000,
      rating: 4.9,
      occupancyPct: 92,
      coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80',
    },
    {
      rank: 2,
      id: 'pkg-2',
      name: 'Spiti Expedition',
      bookings: 86,
      revenue: '₹2,85,400',
      revenueVal: 285400,
      rating: 4.8,
      occupancyPct: 85,
      coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80',
    },
    {
      rank: 3,
      id: 'pkg-3',
      name: 'Meghalaya Explorer',
      bookings: 64,
      revenue: '₹1,75,600',
      revenueVal: 175600,
      rating: 4.7,
      occupancyPct: 78,
      coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=300&q=80',
    },
    {
      rank: 4,
      id: 'pkg-4',
      name: 'Valley of Flowers',
      bookings: 48,
      revenue: '₹1,20,540',
      revenueVal: 120540,
      rating: 4.6,
      occupancyPct: 72,
      coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&q=80',
    },
    {
      rank: 5,
      id: 'pkg-5',
      name: 'Kedarnath Yatra',
      bookings: 36,
      revenue: '₹85,200',
      revenueVal: 85200,
      rating: 4.8,
      occupancyPct: 68,
      coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=300&q=80',
    },
  ] as PackageAnalyticsItem[],

  destinations: [
    {
      rank: 1,
      id: 'dest-1',
      name: 'Ladakh',
      bookings: 124,
      revenue: '₹4,25,000',
      revenueVal: 425000,
      avgOccupancyPct: 92,
      growthPct: '+18.4%',
    },
    {
      rank: 2,
      id: 'dest-2',
      name: 'Spiti Valley',
      bookings: 86,
      revenue: '₹2,85,400',
      revenueVal: 285400,
      avgOccupancyPct: 85,
      growthPct: '+12.1%',
    },
    {
      rank: 3,
      id: 'dest-3',
      name: 'Meghalaya',
      bookings: 64,
      revenue: '₹1,75,600',
      revenueVal: 175600,
      avgOccupancyPct: 78,
      growthPct: '+9.5%',
    },
    {
      rank: 4,
      id: 'dest-4',
      name: 'Uttarakhand',
      bookings: 48,
      revenue: '₹1,20,540',
      revenueVal: 120540,
      avgOccupancyPct: 72,
      growthPct: '+6.2%',
    },
    {
      rank: 5,
      id: 'dest-5',
      name: 'Sikkim',
      bookings: 36,
      revenue: '₹85,200',
      revenueVal: 85200,
      avgOccupancyPct: 68,
      growthPct: '+4.0%',
    },
  ] as DestinationAnalyticsItem[],

  travelers: {
    totalTravelers: 487,
    totalGrowth: '↑ 11.3%',
    newTravelers: 312,
    newGrowth: '↑ 14.5%',
    returningTravelers: 175,
    returningGrowth: '↑ 7.2%',
    repeatBookingRate: '35.9%',
    repeatGrowth: '↑ 5.6%',
    avgGroupSize: '4.2 People',
  } as TravelerInsightsData,

  financialSummary: {
    grossRevenue: '₹9,45,200',
    netRevenue: '₹8,76,540',
    refunds: '₹68,660',
    estimatedProfit: '₹2,91,820',
    profitMarginPct: 32.4,
    marginGrowth: '↑ 6.2% vs last month',
    paymentCompletionRate: '94.2%',
    fullyPaidCount: 312,
    awaitingPaymentCount: 36,
    avgDaysToCompletePayment: '3.4 Days',
  } as FinancialSummaryData,

  insights: [
    {
      id: 'ins-1',
      title: 'Revenue is up 18.6% compared to last month.',
      iconType: 'revenue',
    },
    {
      id: 'ins-2',
      title: 'Ladakh Adventure is your top performing package.',
      iconType: 'package',
    },
    {
      id: 'ins-3',
      title: '2 departures have occupancy below 60%.',
      iconType: 'warning',
    },
    {
      id: 'ins-4',
      title: 'Weekend bookings are 28% higher than weekdays.',
      iconType: 'trend',
    },
    {
      id: 'ins-5',
      title: 'Average rating improved by 0.4 this month.',
      iconType: 'rating',
    },
  ] as AnalyticsInsightItem[],
};
