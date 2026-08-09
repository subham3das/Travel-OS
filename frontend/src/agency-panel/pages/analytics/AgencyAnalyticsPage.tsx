import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsHeader } from '../../components/analytics/AnalyticsHeader';
import { AnalyticsDateBar } from '../../components/analytics/AnalyticsDateBar';
import { PerformanceOverview } from '../../components/analytics/PerformanceOverview';
import { RevenueChart } from '../../components/analytics/RevenueChart';
import { RevenueSourceChart } from '../../components/analytics/RevenueSourceChart';
import { RevenueExpenseChart } from '../../components/analytics/RevenueExpenseChart';
import { BookingAnalyticsCard } from '../../components/analytics/BookingAnalyticsCard';
import { BookingTrendChart } from '../../components/analytics/BookingTrendChart';
import { TripPerformanceCard } from '../../components/analytics/TripPerformanceCard';
import { PackagePerformanceCard } from '../../components/analytics/PackagePerformanceCard';
import { DestinationInsightsCard } from '../../components/analytics/DestinationInsightsCard';
import { TravelerInsightsCard } from '../../components/analytics/TravelerInsightsCard';
import { FinancialSummaryCard } from '../../components/analytics/FinancialSummaryCard';
import { BusinessInsightsCard } from '../../components/analytics/BusinessInsightsCard';
import { AnalyticsFilters } from '../../components/analytics/AnalyticsFilters';
import { AnalyticsSkeleton } from '../../components/analytics/AnalyticsSkeleton';
import { AnalyticsEmptyState } from '../../components/analytics/AnalyticsEmptyState';
import { AnalyticsErrorState } from '../../components/analytics/AnalyticsErrorState';
import { Search, X } from 'lucide-react';

/**
 * Agency Analytics Page
 * Route: /agency/analytics (Protected: APPROVED agencies only)
 * Dedicated ONLY to analytics and business intelligence.
 */
export const AgencyAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
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
    kpis,
    revenueOverview,
    revenueSources,
    revenueVsExpenses,
    bookingOverview,
    bookingTrend,
    tripPerformance,
    packages,
    destinations,
    travelers,
    financialSummary,
    insights,
    resetFilters,
    handleExport,
  } = useAnalytics();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      {/* Desktop Sidebar Navigation */}
      <DesktopSidebar />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-8">
        <DashboardHeader />

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-5xl mx-auto w-full">
          {/* 1. Header */}
          <AnalyticsHeader
            isSearchOpen={isSearchOpen}
            onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
            onOpenFilters={() => setIsFilterModalOpen(true)}
          />

          {/* Expandable Search Input */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="relative w-full"
              >
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search analytics by package, destination, trip or keyword..."
                  className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#583BE8] shadow-2xs"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. Date Range & Sub-navigation Chips & Export */}
          <AnalyticsDateBar
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            activeTab={activeTab}
            onTabChange={(tab) => {
              if (tab === 'Finance') {
                navigate('/agency/finance');
              } else {
                setActiveTab(tab);
              }
            }}
            isExportOpen={isExportDropdownOpen}
            onToggleExport={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
            onExport={handleExport}
          />

          {/* Main Analytics Content */}
          {isLoading ? (
            <AnalyticsSkeleton />
          ) : isError ? (
            <AnalyticsErrorState onRetry={() => window.location.reload()} />
          ) : packages.length === 0 && destinations.length === 0 ? (
            <AnalyticsEmptyState onReset={resetFilters} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* 3. Top KPI Cards: Performance Overview */}
              <PerformanceOverview kpis={kpis} />

              {/* 4. Large Revenue Analytics Chart */}
              <RevenueChart data={revenueOverview} />

              {/* 5. Revenue Sources & Revenue vs Expenses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RevenueSourceChart
                  sources={revenueSources}
                  totalRevenue={revenueOverview.totalRevenue}
                />
                <RevenueExpenseChart data={revenueVsExpenses} />
              </div>

              {/* 6. Booking Analytics, Trend & Trip Performance 3-Col Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BookingAnalyticsCard data={bookingOverview} />
                <BookingTrendChart data={bookingTrend} />
                <TripPerformanceCard data={tripPerformance} />
              </div>

              {/* 7. Package Performance, Destination Insights & Traveler Insights 3-Col Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PackagePerformanceCard
                  packages={packages}
                  sortBy={packageSortBy}
                  onSortChange={setPackageSortBy}
                />
                <DestinationInsightsCard
                  destinations={destinations}
                  sortBy={destinationSortBy}
                  onSortChange={setDestinationSortBy}
                />
                <TravelerInsightsCard data={travelers} />
              </div>

              {/* 8. Financial Summary & Business Insights 2-Col Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FinancialSummaryCard data={financialSummary} />
                <BusinessInsightsCard insights={insights} />
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* 9. Advanced Filters Modal / Bottom Sheet */}
      <AnalyticsFilters
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApply={setFilters}
        onClear={resetFilters}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default AgencyAnalyticsPage;
