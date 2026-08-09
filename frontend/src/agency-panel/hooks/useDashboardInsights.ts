import { useState } from 'react';
import { MOCK_DASHBOARD_INSIGHTS } from '../data/dashboardInsights';

export type TimeRangeFilter = 'Today' | 'This Week' | 'This Month' | 'This Year';

export function useDashboardInsights() {
  const [selectedRange, setSelectedRange] = useState<TimeRangeFilter>('This Month');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const {
    revenue,
    bookingOverview,
    occupancy,
    topPackage,
    upcomingTrips,
    quickInsights,
    recentBookings,
    upcomingDepartures,
  } = MOCK_DASHBOARD_INSIGHTS;

  return {
    revenue,
    bookingOverview,
    occupancy,
    topPackage,
    upcomingTrips,
    quickInsights,
    recentBookings,
    departures: upcomingDepartures,
    selectedRange,
    setSelectedRange,
    isLoading,
    isError,
  };
}
