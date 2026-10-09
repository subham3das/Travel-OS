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
          readiness: raw.readiness,
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
          accommodation: raw.accommodationConfirmed && Array.isArray(raw.accommodations) && raw.accommodations.length > 0
            ? {
                hotelName: raw.accommodations[0].hotelName,
                roomType: raw.accommodations[0].roomType || 'Standard Room',
                mealsIncluded: (raw.accommodations[0].amenities || []).join(', ') || 'Meals as specified',
                vehicleType: 'Private / Shared AC Vehicle',
                pickupLocation: raw.destination || 'Arrival Point',
                dropLocation: raw.destination || 'Departure Point',
              }
            : null,
          upcomingDepartures: (raw.departures || raw.readiness?.upcomingDepartures || []).map((dep: any, idx: number) => ({
            id: dep.departureId || dep.id || dep._id || `dep-${idx}`,
            departureDate: dep.departureDate
              ? (typeof dep.departureDate === 'string' ? dep.departureDate.split('T')[0] : new Date(dep.departureDate).toISOString().split('T')[0])
              : 'Flexible',
            returnDate: dep.endDate || dep.returnDate
              ? (typeof (dep.endDate || dep.returnDate) === 'string' ? (dep.endDate || dep.returnDate).split('T')[0] : new Date(dep.endDate || dep.returnDate).toISOString().split('T')[0])
              : 'Flexible',
            seatsFilled: dep.bookedSeats ?? dep.seatsFilled ?? dep.seatsBooked ?? 0,
            totalCapacity: dep.capacity ?? dep.totalCapacity ?? dep.seatsTotal ?? (raw.totalSeats || 20),
            bookingDeadline: dep.bookingCloses || dep.bookingDeadline
              ? (typeof (dep.bookingCloses || dep.bookingDeadline) === 'string' ? (dep.bookingCloses || dep.bookingDeadline).split('T')[0] : new Date(dep.bookingCloses || dep.bookingDeadline).toISOString().split('T')[0])
              : 'Flexible',
            status: dep.status || 'OPEN',
          })),
          reviews: {
            averageRating: raw.rating || 0,
            ratingBreakdown: [],
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
            onPause={handlePause}
            onShare={handleShare}
          />

          {/* Phase 5 & 6: Package Readiness Warning Banner */}
          {pkg.readiness && !pkg.readiness.isBookable && (
            <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/90 border border-amber-200/90 shadow-xs space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-black text-lg">
                    ⚠
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-black text-amber-950">
                        Incomplete Setup — Hidden from Travelers
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-200/60 text-amber-900">
                        Needs Setup ⚠
                      </span>
                    </div>
                    <p className="text-xs text-amber-800 font-medium mt-0.5">
                      This package is hidden from traveler searches and cannot be booked until all requirements below are satisfied.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/agency/packages/${pkg.packageId || pkg.id}/edit?step=4`)}
                  className="px-4 py-2.5 rounded-xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-black transition-all shadow-sm shadow-[#583BE8]/20 shrink-0 cursor-pointer self-start sm:self-auto"
                >
                  Schedule Departure →
                </button>
              </div>

              {pkg.readiness.missingRequirements?.length > 0 && (
                <div className="pt-3 border-t border-amber-200/60">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 mb-2">
                    Missing Requirements:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.readiness.missingRequirements.map((req: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-amber-200 text-amber-950 text-xs font-bold shadow-2xs"
                      >
                        <span>❌</span>
                        <span>{req}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {pkg.readiness && pkg.readiness.isBookable && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between gap-3 text-xs font-bold text-emerald-900 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Ready to Sell ✅ — Package is active, departure is scheduled, and travelers can book!</span>
              </div>
              <span className="text-[10px] font-black text-emerald-700 uppercase bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Live in Marketplace
              </span>
            </div>
          )}

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
          onCreateDeparture={handleCreateDeparture}
          onViewAnalytics={handleViewAnalytics}
        />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AgencyPackageDetailsPage;
