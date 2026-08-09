// ─── Agency Dashboard & Business Insights Mock Data ─────────────────────────────

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

export const MOCK_DASHBOARD_INSIGHTS = {
  revenue: {
    revenueAmount: '₹4,28,750',
    growthPct: '18.6%',
    isPositive: true,
    chartPoints: [25, 32, 28, 44, 38, 56, 48, 65],
    chartLabels: ['1 Aug', '8 Aug', '15 Aug', '22 Aug', '31 Aug'],
  } as RevenueData,

  bookingOverview: {
    confirmed: 96,
    pending: 18,
    cancelled: 14,
    total: 128,
  } as BookingOverviewData,

  occupancy: {
    percentage: 78,
    growthText: '↑ 8% vs last month',
    tripsRatioText: '18 / 23 Trips',
    monthText: 'This Month',
  } as OccupancyData,

  topPackage: {
    packageName: 'Ladakh Adventure',
    bookingsCount: '124 Bookings',
    revenueText: '₹3,24,000 Revenue',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80',
    badgeText: '🔥 Best Seller',
  } as TopPackageData,

  upcomingTrips: [
    { label: 'Today', tripText: '2 Trips', count: 2 },
    { label: 'Tomorrow', tripText: '1 Trip', count: 1 },
    { label: 'This Week', tripText: '6 Trips', count: 6 },
  ] as UpcomingTripSummaryItem[],

  quickInsights: [
    {
      id: 'qi-1',
      title: 'Revenue up 18%',
      subtitle: 'compared to last month',
      type: 'growth',
    },
    {
      id: 'qi-2',
      title: 'Ladakh Adventure',
      subtitle: 'is your best selling package',
      type: 'fire',
    },
    {
      id: 'qi-3',
      title: '2 departures',
      subtitle: 'are below minimum travelers',
      type: 'warning',
    },
    {
      id: 'qi-4',
      title: '₹48,000 in',
      subtitle: 'pending payments',
      type: 'wallet',
    },
  ] as QuickInsightItem[],

  recentBookings: [
    {
      id: 'BK-20391',
      packageId: 'pkg-1',
      packageName: 'Ladakh Adventure',
      travelerName: 'Subham Das',
      travelerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      bookingStatus: 'Confirmed',
      amountText: '₹37,998',
      bookingDate: '08 Aug 2025',
    },
    {
      id: 'BK-20390',
      packageId: 'pkg-2',
      packageName: 'Meghalaya Explorer',
      travelerName: 'Priya Sharma',
      travelerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
      bookingStatus: 'Pending',
      amountText: '₹18,499',
      bookingDate: '08 Aug 2025',
    },
    {
      id: 'BK-20389',
      packageId: 'pkg-3',
      packageName: 'Spiti Expedition',
      travelerName: 'Rahul Verma',
      travelerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      bookingStatus: 'Confirmed',
      amountText: '₹22,999',
      bookingDate: '07 Aug 2025',
    },
    {
      id: 'BK-20388',
      packageId: 'pkg-4',
      packageName: 'Kedarnath Yatra',
      travelerName: 'Anita Singh',
      travelerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      bookingStatus: 'Cancelled',
      amountText: '₹15,999',
      bookingDate: '07 Aug 2025',
    },
  ] as DashboardRecentBooking[],

  upcomingDepartures: [
    {
      id: 'dep-1',
      monthBadge: 'AUG',
      dayBadge: '10',
      packageName: 'Ladakh Adventure',
      dateRange: '10 Aug – 18 Aug 2025',
      filledRatio: '18 / 20',
      occupancyPct: 90,
      occupancyColor: 'green',
    },
    {
      id: 'dep-2',
      monthBadge: 'AUG',
      dayBadge: '12',
      packageName: 'Spiti Expedition',
      dateRange: '12 Aug – 20 Aug 2025',
      filledRatio: '12 / 16',
      occupancyPct: 75,
      occupancyColor: 'orange',
    },
    {
      id: 'dep-3',
      monthBadge: 'AUG',
      dayBadge: '15',
      packageName: 'Valley of Flowers',
      dateRange: '15 Aug – 20 Aug 2025',
      filledRatio: '10 / 15',
      occupancyPct: 67,
      occupancyColor: 'red',
    },
    {
      id: 'dep-4',
      monthBadge: 'AUG',
      dayBadge: '18',
      packageName: 'Meghalaya Explorer',
      dateRange: '18 Aug – 24 Aug 2025',
      filledRatio: '8 / 12',
      occupancyPct: 67,
      occupancyColor: 'red',
    },
  ] as DashboardUpcomingDeparture[],
};
