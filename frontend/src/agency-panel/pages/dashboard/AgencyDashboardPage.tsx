import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, RefreshCw, X, Car, ArrowRight, Sparkles, Lock } from 'lucide-react';
import { useAgencyAuth } from '../../hooks/useAgencyAuth';
import { useActiveBusiness } from '../../context/ActiveBusinessContext';
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
import { BusinessSegmentedToggle } from '../../components/dashboard/BusinessSegmentedToggle';
import { PackagesRequiringAttentionCard } from '../../components/dashboard/PackagesRequiringAttentionCard';
import { PaymentSetupReminderModal } from '../../components/payment/PaymentSetupReminderModal';
import { PartnerOnboardingStatusHero } from '../../components/onboarding/PartnerOnboardingStatusHero';

/**
 * Agency Dashboard Component
 * Route: /agency/dashboard (Protected: APPROVED agencies only)
 * Integrated Business Insights & Operational Daily Command Center
 */
export const AgencyDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { agency } = useAgencyAuth();
  const { carRentalStatus } = useActiveBusiness();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isDismissedTemporarily, setIsDismissedTemporarily] = useState(false);
  const [isExpansionDismissed, setIsExpansionDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('apnatrip_agency_dismiss_car_rental_expansion') === 'true';
    } catch {
      return false;
    }
  });

  const handleDismissExpansion = () => {
    setIsExpansionDismissed(true);
    try {
      localStorage.setItem('apnatrip_agency_dismiss_car_rental_expansion', 'true');
    } catch {}
  };

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
    packagesRequiringAttention,
    selectedRange,
    setSelectedRange,
    isLoading,
    isError,
    errorMessage,
    refetch,
  } = useDashboardInsights();

  const onboardingStatus =
    agency?.onboardingStatus ||
    (agency?.verificationStatus === 'APPROVED' ? 'APPROVED' : 'PAYMENT_PENDING');
  const isOnboarding = onboardingStatus !== 'APPROVED';

  // The welcome notification banner displays until the agency creates and publishes their first package
  const hasPublishedPackages =
    (agencyProfile?.publishedPackagesCount !== undefined && agencyProfile.publishedPackagesCount > 0) ||
    (agencyProfile?.totalPackages !== undefined && agencyProfile.totalPackages > 0);

  const showWelcomeBanner = !isOnboarding && !isLoading && !hasPublishedPackages && !isDismissedTemporarily;

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
          {/* Onboarding Status Machine Hero (Rendered whenever partner is in onboarding) */}
          {isOnboarding && agency && (
            <PartnerOnboardingStatusHero agency={agency} />
          )}

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
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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

            {/* Date & Segmented Switch Column */}
            <div className="flex flex-col sm:items-end gap-2.5 shrink-0">
              <div className="px-3.5 py-1.5 rounded-2xl bg-white border border-slate-100 shadow-2xs flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0 self-start sm:self-end">
                <Calendar className="w-3.5 h-3.5 text-[#583BE8]" />
                <span>{currentDateFormatted}</span>
              </div>
              <BusinessSegmentedToggle />
            </div>
          </motion.div>

          {/* Expand Your Business Card (Soft & Optional with Dismissal) */}
          {carRentalStatus !== 'APPROVED' && !isExpansionDismissed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="p-4 sm:p-5 rounded-3xl bg-white text-[#0F172A] border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
            >
              <div className="space-y-1 z-10 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-[#583BE8] text-[11px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-[#583BE8]" />
                  <span>Expand Your Business (Optional)</span>
                </div>
                <h3 className="text-sm sm:text-base font-black tracking-tight text-[#0F172A]">
                  {carRentalStatus === 'PENDING' || carRentalStatus === 'UNDER_REVIEW'
                    ? 'Car Rental Application in Review'
                    : 'Reach more travelers by offering car rental services alongside your travel agency.'}
                </h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  {carRentalStatus === 'PENDING' || carRentalStatus === 'UNDER_REVIEW'
                    ? 'Your fleet verification is currently being reviewed by our compliance team. You can track status anytime.'
                    : 'Offer vehicle rentals alongside your tour packages. You can always configure this later from Settings.'}
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 z-10">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      carRentalStatus === 'PENDING' || carRentalStatus === 'UNDER_REVIEW'
                        ? '/agency/car-rental/pending'
                        : '/agency/car-rental/activate'
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-bold transition-all shadow-sm shadow-[#583BE8]/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>
                    {carRentalStatus === 'PENDING' || carRentalStatus === 'UNDER_REVIEW'
                      ? 'View Status'
                      : 'Start Now'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleDismissExpansion}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          )}

          {/* Operational Sections: Locked if partner in onboarding */}
          {isOnboarding ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shadow-xs">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <h3 className="text-base sm:text-lg font-black text-[#0F172A]">
                  Operational Modules Locked
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  {onboardingStatus === 'ACCOUNT_CREATED' || onboardingStatus === 'PAYMENT_PENDING'
                    ? 'Bookings, Package Listings, Customer CRM, Departures, Analytics and Payouts are locked until the registration fee is paid and application verification is completed.'
                    : 'Your partner application is under review by our compliance team. Once verified and approved, all operational modules will unlock automatically.'}
                </p>
              </div>

              {(onboardingStatus === 'ACCOUNT_CREATED' || onboardingStatus === 'PAYMENT_PENDING') && (
                <button
                  type="button"
                  onClick={() => {
                    const type = agency?.activeBusiness === 'car_rental' ? 'car_rental' : 'agency';
                    navigate(`/partner/subscription?type=${type}`);
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#583BE8]/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Continue Payment (₹1,000)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <>
              {/* 2. KPI Cards */}
              <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                {kpiStats.map((stat, idx) => (
                  <StatCard key={stat.id} stat={stat} delay={idx * 0.05} />
                ))}
              </div>

              {/* Phase 7: Packages Requiring Attention Dashboard Card */}
              <PackagesRequiringAttentionCard data={packagesRequiringAttention} />

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
            </>
          )}
        </main>
      </div>

      {/* ── PAYMENT SETUP REMINDER MODAL (PHASE 4) ── */}
      <PaymentSetupReminderModal />

      {/* ── MOBILE BOTTOM NAVIGATION ── */}
      <BottomNavigation />
    </div>
  );
};

export default AgencyDashboardPage;
