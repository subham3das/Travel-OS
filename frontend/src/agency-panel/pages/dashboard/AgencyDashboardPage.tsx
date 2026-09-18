import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, RefreshCw, X } from 'lucide-react';
import { useAgencyAuth } from '../../hooks/useAgencyAuth';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { StatCard } from '../../components/dashboard/StatCard';
import { BusinessInsightsSection } from '../../components/dashboard/BusinessInsightsSection';
import { RecentBookingsSection } from '../../components/dashboard/RecentBookingsSection';
import { UpcomingDeparturesSection } from '../../components/dashboard/UpcomingDeparturesSection';
import { QuickActionsSection } from '../../components/dashboard/QuickActionsSection';
import { DashboardInsightsSkeleton } from '../../components/dashboard/DashboardInsightsSkeleton';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';

/**
 * Agency Dashboard Component
 * Route: /agency/dashboard (Protected: APPROVED agencies only)
 * Integrated Business Insights & Operational Daily Command Center
 */
export const AgencyDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { agency } = useAgencyAuth();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isDismissedTemporarily, setIsDismissedTemporarily] = useState(false);

  const {
    agencyProfile,
    kpiStats,
    revenue,
    bookingOverview,
    occupancy,
    topPackage,
    upcomingTrips,
    quickInsights,
    recentBookings,
    departures,
    selectedRange,
    setSelectedRange,
    isLoading,
    isError,
    errorMessage,
    refetch,
  } = useDashboardInsights();

  // The welcome notification banner displays until the agency creates and publishes their first package
  const hasPublishedPackages =
    (agencyProfile?.publishedPackagesCount !== undefined && agencyProfile.publishedPackagesCount > 0) ||
    (agencyProfile?.totalPackages !== undefined && agencyProfile.totalPackages > 0);

  const showWelcomeBanner = !isLoading && !hasPublishedPackages && !isDismissedTemporarily;

  const handleDismissWelcome = () => {
    setIsDismissedTemporarily(true);
  };

  const agencyDisplayName =
    agencyProfile?.displayName || agency?.name || 'Agency Partner';

  const currentDateFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      {/* ── DESKTOP SIDEBAR ── */}
      <DesktopSidebar />

      {/* ── MAIN CONTENT WRAPPER ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-8">
        {/* 1. Dashboard Header */}
        <DashboardHeader
          unreadCount={agencyProfile?.unreadMessagesCount}
          notificationsCount={agencyProfile?.notificationsCount}
          onToggleSidebar={() => setShowMobileSidebar(!showMobileSidebar)}
        />

        {/* ── DASHBOARD BODY CONTAINER ── */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-5xl mx-auto w-full">
          {/* Welcome Notification Banner */}
          {showWelcomeBanner && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-[#583BE8] text-white shadow-lg shadow-purple-500/15 flex items-start justify-between gap-4 select-none relative overflow-hidden"
            >
              <div className="space-y-1.5 min-w-0 z-10">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎉</span>
                  <h3 className="text-sm sm:text-base font-black tracking-tight">
                    Welcome to ApnaTrip Partner Portal!
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
                  Your agency has been successfully verified. Start by creating your first travel package and begin receiving bookings from travelers across India.
                </p>
                <div className="pt-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleDismissWelcome();
                      navigate('/agency/packages/create');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-white text-[#583BE8] text-xs font-black hover:bg-purple-50 transition-colors shadow-xs cursor-pointer"
                  >
                    Create First Package →
                  </button>
                  <button
                    type="button"
                    onClick={handleDismissWelcome}
                    className="text-xs font-bold text-purple-200 hover:text-white transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDismissWelcome}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0 z-10"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Error Banner with Retry */}
          {isError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-between gap-3 text-xs font-semibold text-rose-700"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMessage || 'Failed to load latest dashboard metrics.'}</span>
              </div>
              <button
                type="button"
                onClick={refetch}
                className="px-3 py-1 rounded-xl bg-white border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-100 flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </motion.div>
          )}

          {/* Welcome Greeting Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start justify-between gap-4"
          >
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                <span>Good Morning, {agencyDisplayName}</span>
                <span className="text-lg">👋</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Here's what's happening with your business today.
              </p>
            </div>

            {/* Date Pill Card */}
            <div className="px-3.5 py-2 rounded-2xl bg-white border border-slate-100 shadow-2xs flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0">
              <Calendar className="w-4 h-4 text-[#583BE8]" />
              <span>{currentDateFormatted}</span>
            </div>
          </motion.div>

          {/* 2. KPI Cards */}
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {kpiStats.map((stat, idx) => (
              <StatCard key={stat.id} stat={stat} delay={idx * 0.05} />
            ))}
          </div>

          {/* 3. Business Insights Section */}
          {isLoading ? (
            <DashboardInsightsSkeleton />
          ) : (
            <BusinessInsightsSection
              revenue={revenue}
              bookingOverview={bookingOverview}
              occupancy={occupancy}
              topPackage={topPackage}
              upcomingTrips={upcomingTrips}
              quickInsights={quickInsights}
              selectedRange={selectedRange}
              onRangeChange={setSelectedRange}
              onViewFullAnalytics={() => navigate('/agency/analytics')}
            />
          )}

          {/* 4. Recent Bookings Section */}
          <RecentBookingsSection bookings={recentBookings} />

          {/* 5. Upcoming Departures Section */}
          <UpcomingDeparturesSection departures={departures} />

          {/* 6. Quick Actions Section */}
          <QuickActionsSection />
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAVIGATION ── */}
      <BottomNavigation />
    </div>
  );
};

export default AgencyDashboardPage;
