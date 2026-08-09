import { useState, useMemo } from 'react';
import { MOCK_ANALYTICS_DATA } from '../data/analytics';

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

export function useAnalytics() {
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>('01 Aug 2025 - 08 Aug 2025' as any);
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

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const rawData = MOCK_ANALYTICS_DATA;

  // Filtered packages
  const packagesList = useMemo(() => {
    let list = [...rawData.packages];
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
  }, [rawData.packages, searchTerm, packageSortBy]);

  // Filtered destinations
  const destinationsList = useMemo(() => {
    let list = [...rawData.destinations];
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
  }, [rawData.destinations, searchTerm, destinationSortBy]);

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
    kpis: rawData.kpis,
    revenueOverview: rawData.revenueOverview,
    revenueSources: rawData.revenueSources,
    revenueVsExpenses: rawData.revenueVsExpenses,
    bookingOverview: rawData.bookingOverview,
    bookingTrend: rawData.bookingTrend,
    tripPerformance: rawData.tripPerformance,
    packages: packagesList,
    destinations: destinationsList,
    travelers: rawData.travelers,
    financialSummary: rawData.financialSummary,
    insights: rawData.insights,
    resetFilters,
    handleExport,
  };
}
