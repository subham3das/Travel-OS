import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { Trip } from '../../../data/trips';

interface TripSummaryCardProps {
  trip: Trip;
}

export const TripSummaryCard: React.FC<TripSummaryCardProps> = ({ trip }) => {
  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex items-center gap-4">
      {/* Left Destination Image */}
      <img
        src={trip.coverImage}
        alt={trip.title}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0"
      />

      {/* Right Details */}
      <div className="space-y-1.5 min-w-0 flex-1">
        <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight leading-snug truncate">
          {trip.title} 🏔️
        </h2>

        <p className="text-xs font-semibold text-slate-500 truncate">
          {trip.locations}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#6356E5]" />
            <span>{trip.tripStartDate} – {trip.tripEndDate}</span>
          </span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <span>{trip.travelerCount} Travelers</span>
          </span>
        </div>

        <div className="pt-0.5">
          <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold">
            Booking ID: {trip.bookingId}
          </span>
        </div>
      </div>
    </div>
  );
};
