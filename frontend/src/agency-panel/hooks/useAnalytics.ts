import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  KPIStatItem,
  RevenueOverviewData,
  RevenueSourceItem,
  RevenueExpenseDataPoint,
  BookingStatusBreakdown,
  BookingTrendDataPoint,
  TripPerformanceSummary,
  PackageAnalyticsItem,
  DestinationAnalyticsItem,
  TravelerInsightsData,
  FinancialSummaryData,
  AnalyticsInsightItem,
} from '../data/analytics';
import { agencyAnalyticsService, AgencyAnalyticsPayload } from '../services/agencyAnalytics.service';

export type AnalyticsDateRange =
  | 'Today'
  | 'Last 7 Days'
  | 'Last 30 Days'
  | 'This Month'
  | 'Last Month'
  | 'This Year'
  | 'Custom Range';

export type AnalyticsSubTab =
  | 'Overview'
  | 'Revenue'
  | 'Bookings'
  | 'Packages'
  | 'Travelers'
  | 'Destinations'
  | 'Trips'
  | 'Finance';

export interface AnalyticsFilterState {
  package: string;
  destination: string;
  tripStatus: string;
  paymentStatus: string;
  bookingStatus: string;
}

const DEFAULT_ANALYTICS: AgencyAnalyticsPayload = {
  kpis: [
    { id: 'kpi-rev', label: 'Total Revenue', value: '₹0', growth: '0%', growthPeriod: 'vs last 7 days', isPositive: true, type: 'revenue' },
    { id: 'kpi-bk', label: 'Total Bookings', value: '0', growth: '0%', growthPeriod: 'vs last 7 days', isPositive: true, type: 'bookings' },
    { id: 'kpi-trip', label: 'Active Trips', value: '0', growth: '0%', growthPeriod: 'vs last 7 days', isPositive: true, type: 'trips' },
    { id: 'kpi-trv', label: 'Total Travelers', value: '0', growth: '0%', growthPeriod: 'vs last 7 days', isPositive: true, type: 'travelers' },
    { id: 'kpi-rtg', label: 'Avg. Rating', value: '5.0/5', growth: '0', growthPeriod: 'vs last 7 days', isPositive: true, type: 'rating' },
  ],
  revenueOverview: {
    totalRevenue: '₹0',
    growthPct: '0%',
    grossRevenue: '₹0',
    refunds: '₹0',
    netRevenue: '₹0',
    avgBookingValue: '₹0',
    chartLabels: ['1st', '5th', '10th', '15th', '20th', '25th', '30th'],
    chartDataPoints: [0, 0, 0, 0, 0, 0, 0],
  },
  revenueSources: [
    { name: 'Direct Bookings', percentage: 100, value: '₹0', color: '#583BE8' },
  ],
  revenueVsExpenses: [
    { date: '1 Aug', revenue: 0, expenses: 0 },
  ],
  bookingOverview: {
    confirmed: 0,
    confirmedPct: 0,
    pending: 0,
    pendingPct: 0,
    cancelled: 0,
    cancelledPct: 0,
    refunded: 0,
    refundedPct: 0,
    total: 0,
    cancellationRate: '0%',
    refundRate: '0%',
  },
  bookingTrend: [
    { date: '1 Aug', bookings: 0 },
  ],
  tripPerformance: {
    upcoming: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0,
    avgOccupancyPct: 0,
    occupancyGrowth: '0%',
  },
  packages: [],
  destinations: [],
  travelers: {
    totalTravelers: 0,
    totalGrowth: '0%',
    newTravelers: 0,
    newGrowth: '0%',
    returningTravelers: 0,
    returningGrowth: '0%',
    repeatBookingRate: '0%',
    repeatGrowth: '0%',
    avgGroupSize: '0 People',
  },
  financialSummary: {
    grossRevenue: '₹0',
    netRevenue: '₹0',
    refunds: '₹0',
    estimatedProfit: '₹0',
    profitMarginPct: 0,
    marginGrowth: '0%',
    paymentCompletionRate: '100%',
    fullyPaidCount: 0,
    awaitingPaymentCount: 0,
    avgDaysToCompletePayment: '0 Days',
  },
  insights: [],
};

export function useAnalytics() {
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>('Last 7 Days');
  const [activeTab, setActiveTab] = useState<AnalyticsSubTab>('Overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  const [packageSortBy, setPackageSortBy] = useState<'Revenue' | 'Bookings' | 'Rating'>('Revenue');
  const [destinationSortBy, setDestinationSortBy] = useState<'Bookings' | 'Revenue' | 'Growth'>('Bookings');

  const [filters, setFilters] = useState<AnalyticsFilterState>({
    package: 'ALL',
    destination: 'ALL',
    tripStatus: 'ALL',
    paymentStatus: 'ALL',
    bookingStatus: 'ALL',
  });

  const [analyticsData, setAnalyticsData] = useState<AgencyAnalyticsPayload>(DEFAULT_ANALYTICS);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await agencyAnalyticsService.getAnalytics(dateRange);
      setAnalyticsData(data);
    } catch (err) {
      console.error('Failed to fetch agency analytics:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Filtered packages
  const packagesList = useMemo(() => {
    let list = [...(analyticsData.packages || [])];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (packageSortBy === 'Bookings') {
      list.sort((a, b) => b.bookings - a.bookings);
    } else if (packageSortBy === 'Rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      list.sort((a, b) => b.revenueVal - a.revenueVal);
    }
    return list;
  }, [analyticsData.packages, searchTerm, packageSortBy]);

  // Filtered destinations
  const destinationsList = useMemo(() => {
    let list = [...(analyticsData.destinations || [])];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter((d) => d.name.toLowerCase().includes(q));
    }
    if (destinationSortBy === 'Revenue') {
      list.sort((a, b) => b.revenueVal - a.revenueVal);
    } else {
      list.sort((a, b) => b.bookings - a.bookings);
    }
    return list;
  }, [analyticsData.destinations, searchTerm, destinationSortBy]);

  const resetFilters = () => {
    setFilters({
      package: 'ALL',
      destination: 'ALL',
      tripStatus: 'ALL',
      paymentStatus: 'ALL',
      bookingStatus: 'ALL',
    });
    setSearchTerm('');
  };

  const handleExport = (format: 'PDF' | 'Excel' | 'CSV') => {
    setIsExportDropdownOpen(false);
    alert(`Exporting Analytics report as ${format}... (Feature preview ready)`);
  };

  return {
    dateRange,
    setDateRange,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    isFilterModalOpen,
    setIsFilterModalOpen,
    isExportDropdownOpen,
    setIsExportDropdownOpen,
    filters,
    setFilters,
    packageSortBy,
    setPackageSortBy,
    destinationSortBy,
    setDestinationSortBy,
    isLoading,
    isError,
    kpis: analyticsData.kpis || DEFAULT_ANALYTICS.kpis,
    revenueOverview: analyticsData.revenueOverview || DEFAULT_ANALYTICS.revenueOverview,
    revenueSources: analyticsData.revenueSources || DEFAULT_ANALYTICS.revenueSources,
    revenueVsExpenses: analyticsData.revenueVsExpenses || DEFAULT_ANALYTICS.revenueVsExpenses,
    bookingOverview: analyticsData.bookingOverview || DEFAULT_ANALYTICS.bookingOverview,
    bookingTrend: analyticsData.bookingTrend || DEFAULT_ANALYTICS.bookingTrend,
    tripPerformance: analyticsData.tripPerformance || DEFAULT_ANALYTICS.tripPerformance,
    packages: packagesList,
    destinations: destinationsList,
    travelers: analyticsData.travelers || DEFAULT_ANALYTICS.travelers,
    financialSummary: analyticsData.financialSummary || DEFAULT_ANALYTICS.financialSummary,
    insights: analyticsData.insights || DEFAULT_ANALYTICS.insights,
    resetFilters,
    handleExport,
  };
}
