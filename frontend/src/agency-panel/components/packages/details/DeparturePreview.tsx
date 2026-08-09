import React from 'react';
import { DepartureItem } from '../../../data/packageDetails';
import { Calendar, Users, Clock, ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DeparturePreviewProps {
  departures: DepartureItem[];
}

export const DeparturePreview: React.FC<DeparturePreviewProps> = ({ departures }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm sm:text-lg font-black text-[#0F172A] flex items-center gap-2 truncate">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#583BE8] shrink-0" />
          <span className="truncate">Upcoming Departures & Schedules ({departures.length})</span>
        </h3>

        <button
          type="button"
          onClick={() => navigate('/agency/bookings')}
          className="text-xs font-extrabold text-[#583BE8] hover:underline cursor-pointer flex items-center gap-1 shrink-0"
        >
          <span>Manage Departures</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {departures.map((dep) => {
          const availableSeats = Math.max(0, dep.totalCapacity - dep.seatsFilled);

          return (
            <div
              key={dep.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-purple-50/40 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <h4 className="text-xs sm:text-sm font-black text-[#0F172A] truncate">
                    Departure: {dep.departureDate} @ 09:00 AM
                  </h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                      dep.status === 'READY_FOR_TRIP'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-purple-100 text-[#583BE8] border border-purple-200'
                    }`}
                  >
                    {dep.status === 'READY_FOR_TRIP' ? 'Trip Ready ✓' : 'Open for Booking'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold text-slate-600 pt-0.5">
                  <span className="flex items-center gap-1 truncate text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-[#583BE8] shrink-0" />
                    <span>Return: {dep.returnDate}</span>
                  </span>

                  <span className="flex items-center gap-1 truncate text-slate-700">
                    <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Booked: {dep.seatsFilled} / {dep.totalCapacity} ({availableSeats} Left)</span>
                  </span>

                  <span className="flex items-center gap-1 truncate text-amber-800">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Closes: {dep.bookingDeadline}</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/agency/bookings')}
                className="px-4 py-2 rounded-xl bg-white border border-purple-200 hover:bg-[#583BE8] hover:text-white hover:border-[#583BE8] text-[#583BE8] text-xs font-black transition-all cursor-pointer shadow-2xs self-start sm:self-auto shrink-0"
              >
                View Departure
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeparturePreview;
