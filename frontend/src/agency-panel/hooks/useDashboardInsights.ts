import { useState, useEffect, useCallback } from 'react';
import { agencyDashboardService } from '../services/agencyDashboard.service';
import {
  AgencyDashboardDataPayload,
  RevenueData,
  BookingOverviewData,
  OccupancyData,
  TopPackageData,
  UpcomingTripSummaryItem,
  QuickInsightItem,
  DashboardRecentBooking,
  DashboardUpcomingDeparture,
} from '../data/dashboardInsights';
import { AgencyKPIStat } from '../data/dashboard';

export type TimeRangeFilter = 'Today' | 'This Week' | 'This Month' | 'This Year';

const DEFAULT_REVENUE: RevenueData = {
  revenueAmount: '₹0',
  growthPct: '0%',
  isPositive: true,
  chartPoints: [0, 0, 0, 0, 0],
  chartLabels: ['1st', '8th', '15th', '22nd', 'End'],
};

const DEFAULT_BOOKING_OVERVIEW: BookingOverviewData = {
  confirmed: 0,
  pending: 0,
  cancelled: 0,
  total: 0,
};

const DEFAULT_OCCUPANCY: OccupancyData = {
  percentage: 0,
  growthText: '0% vs last month',
  tripsRatioText: '0 / 0 Seats',
  monthText: 'This Month',
};

const DEFAULT_TOP_PACKAGE: TopPackageData = {
  packageName: 'No Packages Yet',
  bookingsCount: '0 Bookings',
  revenueText: '₹0 Revenue',
  coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80',
  badgeText: 'Create Package',
};

export function useDashboardInsights() {
  const [selectedRange, setSelectedRange] = useState<TimeRangeFilter>('This Month');
  const [dashboardData, setDashboardData] = useState<AgencyDashboardDataPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDashboard = useCallback(async (range: TimeRangeFilter) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);

    try {
      const data = await agencyDashboardService.getDashboard(range);
      setDashboardData(data);
    } catch (err: any) {
      console.error('Failed to load agency dashboard:', err);
      setIsError(true);
      setErrorMessage(err.message || 'Failed to connect to agency dashboard server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard(selectedRange);
  }, [selectedRange, fetchDashboard]);

  const kpiStats: AgencyKPIStat[] = dashboardData?.kpiStats || [
    { id: 'kpi-revenue', label: 'Total Revenue', count: '₹0', growth: '0%', type: 'revenue' },
    { id: 'kpi-bookings', label: 'Total Bookings', count: 0, growth: '0%', type: 'bookings' },
    { id: 'kpi-awaiting-payments', label: 'Awaiting Payment', count: '0 Travelers', growth: 'All Cleared', type: 'awaiting_payment' },
    { id: 'kpi-trips', label: 'Active Trips', count: 0, growth: '0 Packages', type: 'trips' },
  ];

  return {
    agencyProfile: dashboardData?.agency,
    kpiStats,
    revenue: dashboardData?.revenue || DEFAULT_REVENUE,
    bookingOverview: dashboardData?.bookingOverview || DEFAULT_BOOKING_OVERVIEW,
    occupancy: dashboardData?.occupancy || DEFAULT_OCCUPANCY,
    topPackage: dashboardData?.topPackage || DEFAULT_TOP_PACKAGE,
    upcomingTrips: dashboardData?.upcomingTrips || [],
    quickInsights: dashboardData?.quickInsights || [],
    recentBookings: dashboardData?.recentBookings || [],
    departures: dashboardData?.departures || [],
    selectedRange,
    setSelectedRange,
    isLoading,
    isError,
    errorMessage,
    refetch: () => fetchDashboard(selectedRange),
  };
}
