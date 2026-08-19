// ─── Super Admin Reports & Analytics Types ────────────────────────────────────

export interface ReportKPICardItem {
  id: string;
  title: string;
  value: string;
  growth: string;
  isPositive: boolean;
  comparison: string;
  iconType: 'revenue' | 'bookings' | 'growth' | 'users' | 'agencies' | 'abv' | 'csat' | 'profit';
  sparklineColor: string;
}

export interface ReportKPIStats {
  grossRevenue: ReportKPICardItem;
  totalBookings: ReportKPICardItem;
  platformGrowth: ReportKPICardItem;
  activeUsers: ReportKPICardItem;
  activeAgencies: ReportKPICardItem;
  avgBookingValue: ReportKPICardItem;
  customerSatisfaction: ReportKPICardItem;
  netProfit: ReportKPICardItem;
}

export type ReportCategory = 'All' | 'Financial' | 'Bookings' | 'Users' | 'Agencies' | 'Trips' | 'Marketing' | 'Community';

export interface ReportItem {
  id: string;
  name: string;
  category: ReportCategory;
  lastGenerated: string;
  owner: string;
  isFavorite?: boolean;
  availableFormats: ('PDF' | 'Excel' | 'CSV')[];
  scheduleStatus?: 'Daily' | 'Weekly' | 'Monthly' | 'On Demand';
}

export interface RevenueTrendDataPoint {
  label: string;
  date: string;
  thisPeriod: number; // in Lakhs
  lastPeriod: number; // in Lakhs
}

export interface GeographicRegionData {
  state: string;
  percentage: number;
  revenue: string;
  color: string;
}

export interface TopDestinationReportItem {
  rank: number;
  name: string;
  thumbnail: string;
  bookings: string;
  revenue: string;
  growth: string;
}

export interface AgencyMatrixBubble {
  id: string;
  name: string;
  bookings: number; // X axis (0 - 6K)
  growth: number; // Y axis (-40% to 40%)
  revenue: number; // Bubble Size
  category: 'Top Performer' | 'High Potential' | 'Needs Attention' | 'Low Performer';
  color: string;
}

export interface CategoryPerformanceItem {
  category: string;
  revenue: string;
  percentage: number;
  color: string;
}

export interface AIInsightItem {
  id: string;
  iconType: 'revenue' | 'location' | 'mobile' | 'cancellation';
  text: string;
}

export interface RecentExportItem {
  id: string;
  name: string;
  date: string;
  format: 'PDF' | 'Excel' | 'CSV';
}

export interface ScheduledReportItem {
  id: string;
  name: string;
  schedule: string;
  status: 'Active' | 'Paused';
}

export interface QuickStatisticsData {
  cancellationRate: { value: string; change: string; isPositive: boolean };
  refundsProcessed: { value: string; change: string; isPositive: boolean };
  successfulPayments: { value: string; change: string; isPositive: boolean };
  chargebackRate: { value: string; change: string; isPositive: boolean };
}
