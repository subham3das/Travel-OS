import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
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
import { agencyPackagesService } from '../../services/agencyPackages.service';
import { DetailedPackage } from '../../data/packageDetails';

export const AgencyPackageDetailsPage: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState<DetailedPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!packageId) return;

    setIsLoading(true);
    agencyPackagesService
      .getPackageById(packageId)
      .then((raw: any) => {
        const detailed: DetailedPackage = {
          id: raw._id || raw.id || packageId,
          packageId: raw.packageId || `PKG-${packageId.slice(-4).toUpperCase()}`,
          packageName: raw.title || raw.name || 'Himalayan Tour',
          status: raw.status || 'Active',
          destination: raw.destination || 'North India',
          duration: raw.duration || `${raw.itinerary?.length || 5} Days / ${Math.max(1, (raw.itinerary?.length || 5) - 1)} Nights`,
          packageType: raw.category === 'International' ? 'International' : 'Domestic',
          tripDifficulty: 'Moderate',
          price: raw.price || 24500,
          originalPrice: Math.round((raw.price || 24500) * 1.2),
          discountedPrice: raw.price || 24500,
          taxesPercent: 5,
          rating: raw.rating || 4.8,
          reviewCount: raw.reviewCount || 0,
          totalBookings: raw.bookingsCount || 0,
          coverImage: raw.coverImage || raw.featuredImage || 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&auto=format&fit=crop&q=80',
          galleryImages: raw.galleryImages || [raw.coverImage || raw.featuredImage || 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&auto=format&fit=crop&q=80'],
          description: raw.description || '',
          highlights: ['Scenic Himalayan routes', 'Guided cultural experiences', 'Comfortable accommodation'],
          bestSeason: 'May to October',
          minTravelers: 4,
          maxTravelers: raw.totalSeats || 20,
          included: raw.inclusions || ['Accommodation', 'Guided tours', 'Breakfast & Dinner'],
          excluded: raw.exclusions || ['Personal expenses', 'Flight tickets'],
          pricingModel: 'Per Person Twin Sharing',
          itinerary: (raw.itinerary || []).map((item: any, idx: number) => ({
            dayNumber: item.day || idx + 1,
            title: item.title || `Day ${idx + 1}`,
            description: item.description || '',
            activities: ['Sightseeing', 'Exploration'],
            meals: item.meals ? [item.meals] : ['Breakfast', 'Dinner'],
            stay: item.stay || 'Premium Hotel / Resort',
            transportation: ['Private Tempo / SUV'],
          })),
          accommodation: {
            hotelName: 'The Grand Vista Resort',
            roomType: 'Deluxe Valley View Room',
            mealsIncluded: 'Breakfast & Dinner (MAP)',
            vehicleType: 'Tempo Traveller AC',
            pickupLocation: 'Airport / Railway Station',
            dropLocation: 'Airport / Railway Station',
          },
          upcomingDepartures: [
            {
              id: 'dep-1',
              departureDate: '2026-06-15',
              returnDate: '2026-06-21',
              seatsFilled: raw.bookingsCount || 6,
              totalCapacity: raw.totalSeats || 20,
              bookingDeadline: '2026-06-10',
              status: 'OPEN',
            },
          ],
          reviews: {
            averageRating: raw.rating || 4.8,
            ratingBreakdown: [
              { stars: 5, count: 18, percentage: 80 },
              { stars: 4, count: 4, percentage: 20 },
            ],
            latestReviews: [],
          },
          analytics: {
            totalRevenue: raw.totalRevenue || (raw.price ? raw.price * (raw.bookingsCount || 0) : 0),
            totalBookings: raw.bookingsCount || 0,
            occupancyRate: 85,
            conversionRate: 4.2,
          },
          recentBookings: [],
        };

        setPkg(detailed);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load detailed package:', err);
        setIsLoading(false);
      });
  }, [packageId]);

  const handleEdit = () => {
    if (packageId) navigate(`/agency/packages/${packageId}/edit`);
  };

  const handleDuplicate = async () => {
    if (!packageId) return;
    try {
      const cloned = await agencyPackagesService.duplicatePackage(packageId);
      navigate(`/agency/packages/${cloned.id || cloned.packageId}`);
    } catch (err) {
      console.error('Error duplicating package:', err);
    }
  };

  const handlePause = async () => {
    if (!pkg || !packageId) return;
    const nextStatus = pkg.status === 'Hidden' ? 'Active' : 'Hidden';
    try {
      await agencyPackagesService.updatePackageStatus(packageId, nextStatus);
      setPkg((prev) => (prev ? { ...prev, status: nextStatus } : null));
    } catch (err) {
      console.error('Error toggling package status:', err);
    }
  };

  const handleCreateDeparture = () => {
    navigate('/agency/bookings');
  };

  const handleViewAnalytics = () => {
    navigate('/agency/analytics');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Package link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBFBFE] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#583BE8]" />
          <p className="text-xs font-bold text-slate-500">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#FBFBFE] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-lg font-black text-[#0F172A]">Package Not Found</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">The package you are trying to view does not exist or has been removed.</p>
        <button
          type="button"
          onClick={() => navigate('/agency/packages')}
          className="mt-4 px-5 py-2.5 rounded-2xl bg-[#583BE8] text-white text-xs font-bold shadow-md shadow-[#583BE8]/20"
        >
          Back to Packages
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-32 md:pb-24">
        <DashboardHeader />

        <div className="px-4 py-3 sm:px-6 bg-white border-b border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/agency/packages')}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#583BE8] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Packages</span>
          </button>
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-5xl mx-auto w-full">
          <PackageHero
            pkg={pkg}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onPause={handlePause}
            onShare={handleShare}
          />

          <PackageOverview pkg={pkg} />
          <PackageGallery images={pkg.galleryImages} />
          <PricingOverview pkg={pkg} />
          <ItineraryTimeline itinerary={pkg.itinerary} />
          <AccommodationCard accommodation={pkg.accommodation} />
          <DeparturePreview departures={pkg.upcomingDepartures} />
          <ReviewsPreview reviews={pkg.reviews} packageName={pkg.packageName} />
          <AnalyticsPreview analytics={pkg.analytics} />
          <RecentBookingsPreview recentBookings={pkg.recentBookings || []} />
        </main>

        <StickyPackageActions
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onCreateDeparture={handleCreateDeparture}
          onViewAnalytics={handleViewAnalytics}
        />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AgencyPackageDetailsPage;
