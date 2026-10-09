import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePackage } from '../../hooks/usePackage';

import { PackageHero } from './components/PackageHero';
import { PackageOverview } from './components/PackageOverview';
import { IncludedSection } from './components/IncludedSection';
import { ExcludedSection } from './components/ExcludedSection';
import { ItineraryTimeline } from './components/ItineraryTimeline';
import { AccommodationSection } from './components/AccommodationSection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { ReviewSection } from './components/ReviewSection';
import { FAQSection } from './components/FAQSection';
import { SimilarPackages } from './components/SimilarPackages';
import { StickyBookingBar } from './components/StickyBookingBar';
import { AvailableDeparturesSelector } from './components/AvailableDeparturesSelector';
import { PackageDepartureInfo } from '../../types/package';

export const PackageDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { packageId, id } = useParams<{ packageId?: string; id?: string }>();
  const targetId = packageId || id;

  const { pkg, loading, error } = usePackage(targetId);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [selectedDeparture, setSelectedDeparture] = useState<PackageDepartureInfo | null>(null);

  React.useEffect(() => {
    if (pkg) {
      const allDeps = pkg.departures && pkg.departures.length > 0
        ? pkg.departures
        : (pkg.departure ? [pkg.departure] : []);

      const firstSelectable = allDeps.find((d) => {
        const available = d.availableSeats !== undefined ? d.availableSeats : Math.max(0, d.capacity - (d.bookedSeats || 0));
        return (d.status === 'OPEN' || !d.status) && available > 0 && d.isSelectable !== false;
      }) || allDeps[0] || null;

      setSelectedDeparture(firstSelectable);
    }
  }, [pkg]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#6356E5]/20 border-t-[#6356E5] rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-500">Loading package details...</p>
      </div>
    );
  }

  // Unavailable / Not Found state: Do NOT show package details if package is not bookable or not found
  if (error || !pkg || pkg.isBookable === false) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-2xl shadow-xs">
          !
        </div>
        <h2 className="text-2xl font-black text-[#0F172A]">This package is currently unavailable.</h2>
        <p className="text-sm font-semibold text-slate-500 max-w-sm">
          The tour package you are trying to view is currently not available. Please explore other available packages.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-extrabold text-xs shadow-2xs hover:bg-slate-50 cursor-pointer"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/explore')}
            className="px-5 py-2.5 rounded-xl bg-[#6356E5] text-white font-extrabold text-xs shadow-md hover:bg-[#5245d6] cursor-pointer"
          >
            Explore Packages
          </button>
        </div>
      </div>
    );
  }

  const galleryImages = pkg.gallery && pkg.gallery.length > 0 ? pkg.gallery : [pkg.coverImage];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5] pb-28">
      {/* 1. Hero Gallery Header */}
      <PackageHero pkg={pkg} onOpenGallery={() => setGalleryOpen(true)} />

      {/* Main Body */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 space-y-8">

        {/* 2. Overview Card */}
        <PackageOverview pkg={pkg} selectedDeparture={selectedDeparture} />

        {/* 2b. Available Departures Selector */}
        {((pkg.departures && pkg.departures.length > 0) || pkg.departure) && (
          <AvailableDeparturesSelector
            departures={
              pkg.departures && pkg.departures.length > 0
                ? pkg.departures
                : pkg.departure
                ? [pkg.departure]
                : []
            }
            selectedDepartureId={selectedDeparture?.departureId}
            onSelectDeparture={(dep) => setSelectedDeparture(dep)}
            packagePrice={pkg.price}
          />
        )}

        {/* 3. Included & Excluded Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IncludedSection includes={pkg.includes} />
          <ExcludedSection excludes={pkg.excludes} />
        </div>

        {/* 4. Day-wise Itinerary Timeline */}
        <ItineraryTimeline itinerary={pkg.itinerary} />

        {/* 5. Accommodation */}
        <AccommodationSection hotels={pkg.hotels} />

        {/* 7. Top Activities */}
        <ActivitiesSection activities={pkg.activities} />

        {/* 8. Traveler Reviews */}
        <ReviewSection reviews={pkg.reviews} rating={pkg.rating} reviewCount={pkg.reviewCount} />

        {/* 9. FAQ */}
        <FAQSection faq={pkg.faq} />

        {/* 10. Similar Packages */}
        <SimilarPackages currentPackageId={pkg.id} />
      </main>

      {/* 11. Sticky Booking Bar */}
      <StickyBookingBar pkg={pkg} selectedDeparture={selectedDeparture} />

      {/* Fullscreen Gallery Modal */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 sm:p-8">
          <div className="w-full flex items-center justify-between text-white">
            <span className="text-xs font-extrabold tracking-widest uppercase">
              {activeGalleryIdx + 1} of {galleryImages.length}
            </span>
            <button
              onClick={() => setGalleryOpen(false)}
              className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative w-full max-w-4xl h-[60vh] sm:h-[75vh] flex items-center justify-center">
            <img
              src={typeof galleryImages[activeGalleryIdx] === 'string' ? galleryImages[activeGalleryIdx] : (galleryImages[activeGalleryIdx] as any)?.url || ''}
              alt="Gallery Preview"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            />

            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveGalleryIdx((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setActiveGalleryIdx((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto py-2">
            {galleryImages.map((img, idx) => {
              const thumbUrl = typeof img === 'string' ? img : (img as any)?.url || '';
              return (
                <button
                  key={idx}
                  onClick={() => setActiveGalleryIdx(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    idx === activeGalleryIdx ? 'border-[#6356E5] scale-105' : 'border-transparent opacity-50'
                  }`}
                >
                  <img src={thumbUrl} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDetailsPage;
