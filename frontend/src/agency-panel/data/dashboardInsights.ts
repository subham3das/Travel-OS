// ─── Agency Dashboard & Business Insights Data Types ──────────────────────────

export interface RevenueData {
  revenueAmount: string; // e.g. "₹4,28,750"
  growthPct: string; // e.g. "18.6%"
  isPositive: boolean;
  chartPoints: number[];
  chartLabels: string[];
}

export interface BookingOverviewData {
  confirmed: number;
  pending: number;
  cancelled: number;
  total: number;
}

export interface OccupancyData {
  percentage: number; // e.g. 78
  growthText: string; // e.g. "↑ 8% vs last month"
  tripsRatioText: string; // e.g. "18 / 23 Trips"
  monthText: string; // e.g. "This Month"
}

export interface TopPackageData {
  packageName: string;
  bookingsCount: string; // e.g. "124 Bookings"
  revenueText: string; // e.g. "₹3,24,000 Revenue"
  coverImage: string;
  badgeText: string; // e.g. "🔥 Best Seller"
}

export interface UpcomingTripSummaryItem {
  label: string; // "Today" | "Tomorrow" | "This Week"
  tripText: string; // "2 Trips"
  count: number;
}

export interface QuickInsightItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'growth' | 'fire' | 'warning' | 'wallet';
}

export interface DashboardRecentBooking {
  id: string; // BK-20391
  packageId: string;
  packageName: string;
  travelerName: string;
  travelerAvatar: string;
  bookingStatus: 'Confirmed' | 'Pending' | 'Cancelled';
  amountText: string; // ₹37,998
  bookingDate: string;
}

export interface DashboardUpcomingDeparture {
  id: string;
  monthBadge: string; // "AUG"
  dayBadge: string; // "10"
  packageName: string;
  dateRange: string; // "10 Aug – 18 Aug 2025"
  filledRatio: string; // "18 / 20"
  occupancyPct: number; // 90
  occupancyColor: 'green' | 'orange' | 'red';
}

export interface AgencyDashboardDataPayload {
  agency: {
    id: string;
    applicationId?: string;
    name: string;
    displayName: string;
    logo?: string;
    initials: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone?: string;
    verificationStatus: string;
    isVerified: boolean;
    unreadMessagesCount: number;
    notificationsCount: number;
    totalPackages?: number;
    publishedPackagesCount?: number;
  };
  kpiStats: Array<{
    id: string;
    label: string;
    count: string | number;
    growth: string;
    type: 'bookings' | 'trips' | 'packages' | 'revenue' | 'awaiting_payment';
  }>;
  revenue: RevenueData;
  bookingOverview: BookingOverviewData;
  occupancy: OccupancyData;
  topPackage: TopPackageData;
  upcomingTrips: UpcomingTripSummaryItem[];
  quickInsights: QuickInsightItem[];
  recentBookings: DashboardRecentBooking[];
  departures: DashboardUpcomingDeparture[];
}
