import React from 'react';
import { useParams } from 'react-router-dom';
import { getDestinationById } from '../../data/destinations';

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
  const targetId = destinationId || id || 'meghalaya';

  const destination = getDestinationById(targetId);

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
