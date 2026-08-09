import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { PackageHero } from '../../components/packages/details/PackageHero';
import { PackageOverview } from '../../components/packages/details/PackageOverview';
import { PackageGallery } from '../../components/packages/details/PackageGallery';
import { PricingOverview } from '../../components/packages/details/PricingOverview';
import { ItineraryTimeline } from '../../components/packages/details/ItineraryTimeline';
import { AccommodationCard } from '../../components/packages/details/AccommodationCard';
import { DeparturePreview } from '../../components/packages/details/DeparturePreview';
import { ReviewsPreview } from '../../components/packages/details/ReviewsPreview';
import { AnalyticsPreview } from '../../components/packages/details/AnalyticsPreview';
import { RecentBookingsPreview } from '../../components/packages/details/RecentBookingsPreview';
import { StickyPackageActions } from '../../components/packages/details/StickyPackageActions';
import { getDetailedPackageById } from '../../data/packageDetails';

/**
 * Premium Package Details View Page (Read-Only)
 * Route: /agency/packages/:packageId
 */
export const AgencyPackageDetailsPage: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();

  const currentId = packageId || 'pkg-ladakh-1';
  const pkg = getDetailedPackageById(currentId);

  const handleEdit = () => {
    navigate(`/agency/packages/${currentId}/edit`);
  };

  const handleDuplicate = () => {
    alert(`Package "${pkg.packageName}" duplicated as a new draft!`);
  };

  const handlePause = () => {
    alert(`Booking status toggled for "${pkg.packageName}".`);
  };

  const handleShare = () => {
    alert(`Package URL copied to clipboard!`);
  };

  const handleCreateDeparture = () => {
    navigate('/agency/bookings');
  };

  const handleViewAnalytics = () => {
    navigate('/agency/analytics');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-36 sm:pb-28">
        <DashboardHeader />

        {/* Back Navigation Bar */}
        <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-[3.5rem] z-20">
          <button
            type="button"
            onClick={() => navigate('/agency/packages')}
            className="flex items-center gap-2 text-xs font-black text-slate-700 hover:text-[#583BE8] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Packages</span>
          </button>

          <span className="text-xs font-bold text-slate-400">
            ID: <span className="font-black text-slate-800">{pkg.packageId}</span>
          </span>
        </div>

        {/* Main Body with All 11 Sections */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* 1. Hero Section */}
            <PackageHero
              pkg={pkg}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onPause={handlePause}
              onShare={handleShare}
            />

            {/* 2. Package Overview */}
            <PackageOverview pkg={pkg} />

            {/* 3. Gallery Grid */}
            <PackageGallery images={pkg.galleryImages} />

            {/* 4. Pricing Breakdown */}
            <PricingOverview pkg={pkg} />

            {/* 5. Itinerary Timeline */}
            <ItineraryTimeline itinerary={pkg.itinerary} />

            {/* 6. Accommodation & Transport */}
            <AccommodationCard accommodation={pkg.accommodation} />

            {/* 7. Upcoming Departures */}
            <DeparturePreview departures={pkg.upcomingDepartures} />

            {/* 8. Reviews Preview */}
            <ReviewsPreview reviews={pkg.reviews} packageName={pkg.packageName} />

            {/* 9. Analytics Preview */}
            <AnalyticsPreview analytics={pkg.analytics} />

            {/* 10. Recent Bookings */}
            <RecentBookingsPreview recentBookings={pkg.recentBookings} />
          </motion.div>
        </main>
      </div>

      {/* 11. Sticky Bottom Action Bar */}
      <StickyPackageActions
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onCreateDeparture={handleCreateDeparture}
        onViewAnalytics={handleViewAnalytics}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default AgencyPackageDetailsPage;
