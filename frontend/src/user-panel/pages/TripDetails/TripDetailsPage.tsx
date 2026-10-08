import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trip } from '../../data/trips';
import { useToast } from '../../context/ToastContext';
import { tripService } from '../../services/trip.service';

import { TripHero } from './components/TripHero';
import { BookingCard } from './components/BookingCard';
import { TripStatusSection } from './components/TripStatusSection';
import { QuickActions } from './components/QuickActions';
import { TravelerCard } from './components/TravelerCard';
import { AgencyCard } from './components/AgencyCard';
import { HotelCard } from './components/HotelCard';
import { TransportCard } from './components/TransportCard';
import { WeatherCard } from './components/WeatherCard';
import { ChecklistCard } from './components/ChecklistCard';

export const TripDetailsPage: React.FC = () => {
  const { tripId, id } = useParams<{ tripId?: string; id?: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const targetId = tripId || id || '';
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(Boolean(targetId));

  useEffect(() => {
    let isMounted = true;
    if (!targetId) {
      setLoading(false);
      return;
    }
    tripService.getTripById(targetId).then((res) => {
      if (isMounted && res) {
        setTrip(res);
      }
    }).catch((err) => {
      console.warn('Trip API unreachable:', err);
    }).finally(() => {
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, [targetId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center space-y-3">
        <div className="w-9 h-9 border-3 border-[#6356E5]/20 border-t-[#6356E5] rounded-full animate-spin" />
        <p className="text-xs font-black text-slate-500">Loading trip details...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center font-black text-2xl">✕</div>
        <h2 className="text-xl font-black text-[#0F172A]">Trip Not Found</h2>
        <p className="text-xs font-semibold text-slate-500 max-w-sm">
          The requested trip details could not be loaded or the server is unavailable.
        </p>
        <button onClick={() => navigate('/my-trips')} className="px-5 py-2.5 rounded-xl bg-[#6356E5] text-white text-xs font-bold cursor-pointer">
          Back to My Trips
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5] pb-12">
      {/* 1. Hero Cover */}
      <TripHero trip={trip} />

      <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 space-y-6">
        {/* 2. Booking Confirmed Card */}
        <BookingCard trip={trip} />

        {/* 3. Trip Status & Live Updates Section */}
        <TripStatusSection tripId={trip.id} agencyId={trip.agencyId} />

        {/* 4. Quick Actions */}
        <QuickActions trip={trip} onOpenInvoice={() => setIsInvoiceOpen(true)} />

        {/* 5. Traveler Details */}
        <TravelerCard trip={trip} />

        {/* 6. Agency Card */}
        <AgencyCard trip={trip} />

        {/* 7. Hotel Card */}
        <HotelCard trip={trip} />

        {/* 8. Transport Card */}
        <TransportCard trip={trip} />

        {/* 9. Weather Forecast */}
        <WeatherCard trip={trip} />

        {/* 10. Trip Checklist */}
        <ChecklistCard trip={trip} />
      </main>

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
