import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
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
import { MOCK_AGENCY_KPI_STATS } from '../../data/dashboard';

/**
 * Agency Dashboard Component
 * Route: /agency/dashboard (Protected: APPROVED agencies only)
 * Integrated Business Insights & Operational Daily Command Center
 */
export const AgencyDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { agency } = useAgencyAuth();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const {
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
  } = useDashboardInsights();

  const agencyDisplayName = agency?.name || 'Himalayan Trails';
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
        <DashboardHeader onToggleSidebar={() => setShowMobileSidebar(!showMobileSidebar)} />

        {/* ── DASHBOARD BODY CONTAINER ── */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-5xl mx-auto w-full">
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
            {MOCK_AGENCY_KPI_STATS.map((stat, idx) => (
              <StatCard key={stat.id} stat={stat} delay={idx * 0.05} />
            ))}
          </div>

          {/* 3. Business Insights Section (NEW) */}
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
