import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Loader2 } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';
import type { Destination } from '../../data/destinations';

import { DestinationHero } from '../DestinationDetails/components/DestinationHero';
import { QuickFacts } from '../DestinationDetails/components/QuickFacts';
import { AboutSection } from '../DestinationDetails/components/AboutSection';
import { BestTimeSection } from '../DestinationDetails/components/BestTimeSection';
import { WeatherCard } from '../DestinationDetails/components/WeatherCard';
import { MapSection } from '../DestinationDetails/components/MapSection';
import { ThingsToDo } from '../DestinationDetails/components/ThingsToDo';
import { AttractionsSection } from '../DestinationDetails/components/AttractionsSection';
import { HotelsSection } from '../DestinationDetails/components/HotelsSection';
import { RestaurantsSection } from '../DestinationDetails/components/RestaurantsSection';
import { AgencyCarousel } from '../DestinationDetails/components/AgencyCarousel';
import { PackageCarousel } from '../DestinationDetails/components/PackageCarousel';
import { GallerySection } from '../DestinationDetails/components/GallerySection';
import { ReviewsSection } from '../DestinationDetails/components/ReviewsSection';
import { TravelTips } from '../DestinationDetails/components/TravelTips';
import { FAQSection } from '../DestinationDetails/components/FAQSection';
import { StickyCTA } from '../DestinationDetails/components/StickyCTA';

export const DestinationDetailsPage: React.FC = () => {
  const { destinationId, id } = useParams<{ destinationId?: string; id?: string }>();
  const navigate = useNavigate();
  const targetId = destinationId || id;

  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!targetId) {
      setDestination(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    apiClient
      .get<Destination>(`/destinations/${targetId}`, { requiresAuth: false })
      .then((res: any) => {
        setDestination(res.data || null);
      })
      .catch(() => {
        setDestination(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [targetId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#6356E5] mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading destination details...</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
          <MapPin className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#0F172A] mb-2">Destination Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          The requested destination details could not be loaded or do not exist.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-full bg-[#6356E5] text-white font-bold text-sm hover:bg-[#5244d4] transition cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5] pb-32">
      {/* 1. Hero Cover */}
      <DestinationHero destination={destination} />

      <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 space-y-6">
        {/* 2. Quick Facts Bar */}
        <QuickFacts destination={destination} />

        {/* 3. About Destination */}
        <AboutSection destination={destination} />

        {/* 4. Best Time To Visit & Weather Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BestTimeSection destination={destination} />
          <WeatherCard destination={destination} />
        </div>

        {/* 5. Map Section */}
        <MapSection destination={destination} />

        {/* 6. Things to Do */}
        <ThingsToDo destination={destination} />

        {/* 7. Top Attractions */}
        <AttractionsSection destination={destination} />

        {/* 8. Hotels Nearby */}
        <HotelsSection destination={destination} />

        {/* 9. Restaurants Nearby */}
        <RestaurantsSection destination={destination} />

        {/* 10. Nearby Travel Agencies */}
        <AgencyCarousel destination={destination} />

        {/* 11. Popular Packages */}
        <PackageCarousel destination={destination} />

        {/* 12. Gallery Section */}
        <GallerySection destination={destination} />

        {/* 13. Traveler Reviews */}
        <ReviewsSection destination={destination} />

        {/* 14. Travel Tips */}
        <TravelTips destination={destination} />

        {/* 15. FAQ Section */}
        <FAQSection destination={destination} />
      </main>

      {/* 16. Sticky Bottom CTA */}
      <StickyCTA startingPrice={destination.startingPrice} />
    </div>
  );
};

export default DestinationDetailsPage;
