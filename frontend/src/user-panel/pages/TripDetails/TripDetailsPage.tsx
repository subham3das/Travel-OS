import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripById } from '../../data/trips';

import { TripHero } from './components/TripHero';
import { BookingCard } from './components/BookingCard';
import { TripStatusSection } from './components/TripStatusSection';
import { QuickActions } from './components/QuickActions';
import { TripTimeline } from './components/TripTimeline';
import { TravelerCard } from './components/TravelerCard';
import { AgencyCard } from './components/AgencyCard';
import { HotelCard } from './components/HotelCard';
import { TransportCard } from './components/TransportCard';
import { WeatherCard } from './components/WeatherCard';
import { ChecklistCard } from './components/ChecklistCard';
import { ExpensesCard } from './components/ExpensesCard';
import { StickyItineraryButton } from './components/StickyItineraryButton';

export const TripDetailsPage: React.FC = () => {
  const { tripId, id } = useParams<{ tripId?: string; id?: string }>();
  const navigate = useNavigate();

  const targetId = tripId || id || 'trip-001';
  const trip = getTripById(targetId);

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5] pb-32">
      {/* 1. Hero Cover */}
      <TripHero trip={trip} />

      <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 space-y-6">
        {/* 2. Booking Confirmed Card */}
        <BookingCard trip={trip} />

        {/* 3. Trip Status & Live Updates Section */}
        <TripStatusSection tripId={trip.id} agencyId={trip.agencyId} />

        {/* 4. Quick Actions */}
        <QuickActions trip={trip} />

        {/* 5. Trip Timeline */}
        <TripTimeline trip={trip} />

        {/* 6. Traveler Details */}
        <TravelerCard trip={trip} />

        {/* 7. Agency Card */}
        <AgencyCard trip={trip} />

        {/* 8. Hotel Card */}
        <HotelCard trip={trip} />

        {/* 9. Transport Card */}
        <TransportCard trip={trip} />

        {/* 10. Weather Forecast */}
        <WeatherCard trip={trip} />

        {/* 11. Trip Checklist */}
        <ChecklistCard trip={trip} />

        {/* 12. Expenses Summary */}
        <ExpensesCard trip={trip} />
      </main>

      {/* 13. Sticky Bottom CTA */}
      <StickyItineraryButton
        onViewItinerary={() => alert(`Opening Full Itinerary for ${trip.title}`)}
      />
    </div>
  );
};

export default TripDetailsPage;
