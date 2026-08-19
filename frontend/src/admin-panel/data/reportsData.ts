import {
  ReportKPIStats,
  ReportItem,
  RevenueTrendDataPoint,
  GeographicRegionData,
  TopDestinationReportItem,
  AgencyMatrixBubble,
  CategoryPerformanceItem,
  AIInsightItem,
  ScheduledReportItem,
  RecentExportItem,
} from '../types/reportsManagement';

export const initialReportKPIStats: ReportKPIStats = {
  grossRevenue: {
    id: 'grossRevenue',
    title: 'Gross Revenue',
    value: '₹12,48,75,890',
    growth: '18.6%',
    isPositive: true,
    comparison: 'vs last 30 days',
    iconType: 'revenue',
    sparklineColor: '#6356E5',
  },
  totalBookings: {
    id: 'totalBookings',
    title: 'Total Bookings',
    value: '24,875',
    growth: '15.3%',
    isPositive: true,
    comparison: 'vs last 30 days',
    iconType: 'bookings',
    sparklineColor: '#10B981',
  },
  platformGrowth: {
    id: 'platformGrowth',
    title: 'Platform Growth',
    value: '18.76%',
    growth: '12.8%',
    isPositive: true,
    comparison: 'vs last 30 days',
    iconType: 'growth',
    sparklineColor: '#10B981',
  },
  activeUsers: {
    id: 'activeUsers',
    title: 'Active Users',
    value: '1,24,856',
    growth: '11.2%',
    isPositive: true,
    comparison: 'vs last 30 days',
    iconType: 'users',
    sparklineColor: '#3B82F6',
  },
  activeAgencies: {
    id: 'activeAgencies',
    title: 'Active Agencies',
    value: '2,345',
    growth: '9.6%',
    isPositive: true,
    comparison: 'vs last 30 days',
    iconType: 'agencies',
    sparklineColor: '#6356E5',
  },
  avgBookingValue: {
    id: 'avgBookingValue',
    title: 'Avg. Booking Value',
    value: '₹5,024',
    growth: '8.7%',
    isPositive: true,
    comparison: 'vs last 30 days',
    iconType: 'abv',
    sparklineColor: '#F97316',
  },
  customerSatisfaction: {
    id: 'customerSatisfaction',
    title: 'Customer Satisfaction',
    value: '4.6 / 5',
    growth: '0.3',
    isPositive: true,
    comparison: 'vs last 30 days',
    iconType: 'csat',
    sparklineColor: '#F59E0B',
  },
  netProfit: {
    id: 'netProfit',
    title: 'Net Profit',
    value: '₹2,34,56,780',
    growth: '16.7%',
    isPositive: true,
    comparison: 'vs last 30 days',
    iconType: 'profit',
    sparklineColor: '#8B5CF6',
  },
};

export const initialReportLibraryData: ReportItem[] = [
  {
    id: 'REP-01',
    name: 'Revenue Report',
    category: 'Financial',
    lastGenerated: 'Jun 12, 2024 10:30 AM',
    owner: 'Neha Sharma',
    availableFormats: ['PDF', 'Excel'],
    scheduleStatus: 'Daily',
  },
  {
    id: 'REP-02',
    name: 'Booking Analytics',
    category: 'Bookings',
    lastGenerated: 'Jun 12, 2024 09:15 AM',
    owner: 'Arjun Mehta',
    availableFormats: ['PDF', 'Excel'],
    scheduleStatus: 'Weekly',
  },
  {
    id: 'REP-03',
    name: 'User Growth Report',
    category: 'Users',
    lastGenerated: 'Jun 11, 2024 11:20 PM',
    owner: 'Pooja Nair',
    availableFormats: ['PDF', 'Excel'],
    scheduleStatus: 'Monthly',
  },
  {
    id: 'REP-04',
    name: 'Agency Performance',
    category: 'Agencies',
    lastGenerated: 'Jun 11, 2024 06:45 PM',
    owner: 'Rajat Verma',
    availableFormats: ['PDF', 'Excel'],
    scheduleStatus: 'Weekly',
  },
  {
    id: 'REP-05',
    name: 'Trip Performance',
    category: 'Trips',
    lastGenerated: 'Jun 10, 2024 06:30 PM',
    owner: 'Vikram Singh',
    availableFormats: ['PDF', 'Excel'],
    scheduleStatus: 'Weekly',
  },
  {
    id: 'REP-06',
    name: 'Community Insights',
    category: 'Community',
    lastGenerated: 'Jun 10, 2024 05:10 PM',
    owner: 'Arjun Mehta',
    availableFormats: ['PDF'],
    scheduleStatus: 'On Demand',
  },
];

export const initialRevenueTrend: RevenueTrendDataPoint[] = [
  { label: 'Jun 1', date: '2024-06-01', thisPeriod: 7.2, lastPeriod: 5.8 },
  { label: 'Jun 3', date: '2024-06-03', thisPeriod: 8.9, lastPeriod: 6.5 },
  { label: 'Jun 5', date: '2024-06-05', thisPeriod: 13.5, lastPeriod: 9.2 },
  { label: 'Jun 7', date: '2024-06-07', thisPeriod: 11.2, lastPeriod: 8.0 },
  { label: 'Jun 9', date: '2024-06-09', thisPeriod: 12.8, lastPeriod: 9.8 },
  { label: 'Jun 11', date: '2024-06-11', thisPeriod: 16.4, lastPeriod: 12.1 },
];

export const initialBookingHeatmapMatrix = [
  [0.1, 0.2, 0.4, 0.7, 0.85, 0.9, 0.4], // Mon
  [0.2, 0.3, 0.5, 0.8, 0.95, 0.8, 0.3], // Tue
  [0.1, 0.4, 0.6, 0.9, 0.9, 0.85, 0.5], // Wed
  [0.2, 0.3, 0.7, 0.85, 0.95, 0.9, 0.6], // Thu
  [0.3, 0.5, 0.8, 0.95, 1.0, 0.95, 0.7], // Fri
  [0.4, 0.6, 0.9, 0.95, 0.9, 0.8, 0.6], // Sat
  [0.3, 0.4, 0.7, 0.85, 0.8, 0.7, 0.5], // Sun
];

export const initialGeographicData: GeographicRegionData[] = [
  { state: 'Maharashtra', percentage: 18.6, revenue: '₹2.32 Cr', color: '#6356E5' },
  { state: 'Karnataka', percentage: 15.2, revenue: '₹1.90 Cr', color: '#3B82F6' },
  { state: 'Tamil Nadu', percentage: 12.8, revenue: '₹1.60 Cr', color: '#06B6D4' },
  { state: 'Delhi', percentage: 9.7, revenue: '₹1.21 Cr', color: '#10B981' },
  { state: 'Rajasthan', percentage: 8.3, revenue: '₹1.04 Cr', color: '#F97316' },
  { state: 'Others', percentage: 35.4, revenue: '₹4.42 Cr', color: '#94A3B8' },
];

export const initialTopDestinations: TopDestinationReportItem[] = [
  {
    rank: 1,
    name: 'Ladakh',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=150&auto=format&fit=crop',
    bookings: '4,875',
    revenue: '₹2.48 Cr',
    growth: '+22.4%',
  },
  {
    rank: 2,
    name: 'Manali',
    thumbnail: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=150&auto=format&fit=crop',
    bookings: '3,642',
    revenue: '₹1.86 Cr',
    growth: '+18.7%',
  },
  {
    rank: 3,
    name: 'Goa',
    thumbnail: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=150&auto=format&fit=crop',
    bookings: '3,201',
    revenue: '₹1.42 Cr',
    growth: '+16.3%',
  },
  {
    rank: 4,
    name: 'Andaman',
    thumbnail: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=150&auto=format&fit=crop',
    bookings: '2,854',
    revenue: '₹1.28 Cr',
    growth: '+14.8%',
  },
  {
    rank: 5,
    name: 'Kerala',
    thumbnail: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=150&auto=format&fit=crop',
    bookings: '2,456',
    revenue: '₹1.05 Cr',
    growth: '+12.1%',
  },
];

export const initialAgencyMatrixBubbles: AgencyMatrixBubble[] = [
  { id: 'b1', name: 'Budget Tours', bookings: 4.8, growth: 28, revenue: 2.1, category: 'Top Performer', color: '#10B981' },
  { id: 'b2', name: 'Travel Easy', bookings: 3.6, growth: 18, revenue: 1.6, category: 'Top Performer', color: '#10B981' },
  { id: 'b3', name: 'Trip N Go', bookings: 2.2, growth: -12, revenue: 0.9, category: 'Needs Attention', color: '#F97316' },
  { id: 'b4', name: 'Mountain Trails', bookings: 5.2, growth: 32, revenue: 2.4, category: 'Top Performer', color: '#3B82F6' },
  { id: 'b5', name: 'Royal Vacations', bookings: 1.8, growth: 8, revenue: 1.2, category: 'High Potential', color: '#EC4899' },
  { id: 'b6', name: 'Go Travels', bookings: 1.2, growth: -24, revenue: 0.5, category: 'Low Performer', color: '#EF4444' },
];

export const initialCategoryPerformance: CategoryPerformanceItem[] = [
  { category: 'Adventure', revenue: '₹3.48 Cr', percentage: 24.8, color: '#6356E5' },
  { category: 'Luxury', revenue: '₹2.85 Cr', percentage: 20.3, color: '#3B82F6' },
  { category: 'Family', revenue: '₹2.12 Cr', percentage: 15.1, color: '#10B981' },
  { category: 'Solo', revenue: '₹1.68 Cr', percentage: 12.0, color: '#06B6D4' },
  { category: 'Weekend Getaways', revenue: '₹1.24 Cr', percentage: 8.8, color: '#F97316' },
  { category: 'International', revenue: '₹1.11 Cr', percentage: 7.9, color: '#8B5CF6' },
  { category: 'Others', revenue: '₹0.65 Cr', percentage: 4.6, color: '#94A3B8' },
];

export const initialAIInsights: AIInsightItem[] = [
  {
    id: 'ai-1',
    iconType: 'revenue',
    text: 'Revenue increased by 18.6% compared to last 30 days.',
  },
  {
    id: 'ai-2',
    iconType: 'location',
    text: 'Ladakh is the top performing destination this month.',
  },
  {
    id: 'ai-3',
    iconType: 'mobile',
    text: 'Mobile app bookings increased by 24% this week.',
  },
  {
    id: 'ai-4',
    iconType: 'cancellation',
    text: 'Cancellation rate decreased by 6.4% this month.',
  },
];

export const initialQuickStatistics = {
  cancellationRate: { value: '2.48%', change: '0.8%', isPositive: true },
  refundsProcessed: { value: '₹45,67,890', change: '5.3%', isPositive: true },
  successfulPayments: { value: '98.62%', change: '1.2%', isPositive: true },
  chargebackRate: { value: '0.21%', change: '0.1%', isPositive: true },
};

export const initialScheduledReports: ScheduledReportItem[] = [
  { id: 'sch-1', name: 'Daily Revenue Report', schedule: 'Every day at 09:00 AM', status: 'Active' },
  { id: 'sch-2', name: 'Weekly Booking Report', schedule: 'Every Monday at 10:00 AM', status: 'Active' },
  { id: 'sch-3', name: 'Monthly Performance Report', schedule: '1st of every month at 11:00 AM', status: 'Active' },
];

export const initialRecentExports: RecentExportItem[] = [
  { id: 'exp-1', name: 'Revenue Report - Jun 2024', date: 'Jun 12, 2024 10:30 AM', format: 'PDF' },
  { id: 'exp-2', name: 'Booking Analytics - Jun 2024', date: 'Jun 12, 2024 09:15 AM', format: 'Excel' },
  { id: 'exp-3', name: 'User Growth Report - Jun 2024', date: 'Jun 11, 2024 11:20 PM', format: 'CSV' },
];
