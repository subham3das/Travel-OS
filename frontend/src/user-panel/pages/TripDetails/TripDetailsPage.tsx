import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripById } from '../../data/trips';
import { useToast } from '../../context/ToastContext';

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
  const { showToast } = useToast();
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const targetId = tripId || id || 'trip-001';
  const trip = getTripById(targetId);

  const handleScrollToItinerary = () => {
    const elem = document.getElementById('itinerary-section');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

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
        <QuickActions trip={trip} onOpenInvoice={() => setIsInvoiceOpen(true)} />

        {/* 5. Trip Timeline */}
        <div id="itinerary-section">
          <TripTimeline trip={trip} />
        </div>

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
      <StickyItineraryButton onViewItinerary={handleScrollToItinerary} />

      {/* Invoice Modal */}
      {isInvoiceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-[#0F172A]">Official Trip Invoice</h3>
              <button
                onClick={() => setIsInvoiceOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-600">
              <div className="flex justify-between p-2 rounded-xl bg-slate-50">
                <span>Trip:</span>
                <span className="font-extrabold text-[#0F172A]">{trip.title}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-50">
                <span>Booking ID:</span>
                <span className="font-extrabold text-[#6356E5]">{trip.bookingId}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-50">
                <span>Agency:</span>
                <span className="font-extrabold text-slate-800">{trip.agency.name}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-50">
                <span>Total Amount:</span>
                <span className="font-extrabold text-emerald-600">₹{((trip as any).price || 24998).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast(`PDF Invoice downloaded for ${trip.bookingId}`, 'success');
                setIsInvoiceOpen(false);
              }}
              className="w-full py-3 rounded-2xl bg-[#6356E5] text-white font-extrabold text-xs cursor-pointer"
            >
              Download PDF Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetailsPage;
