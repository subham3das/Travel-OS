import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, MapPin, Calendar, Users } from 'lucide-react';
import { Trip } from '../../../data/trips';

interface TripHeroProps {
  trip: Trip;
}

export const TripHero: React.FC<TripHeroProps> = ({ trip }) => {
  const navigate = useNavigate();

  const coverImage =
    trip?.coverImage ||
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop';
  const title = trip?.title || 'Trip Details';
  const status = trip?.status || trip?.masterStatus || 'Confirmed';
  const locations = trip?.locations || trip?.destination || 'Destination';
  const destinationId = trip?.destinationId;
  const dates = trip?.dates || `${trip?.tripStartDate || ''} – ${trip?.tripEndDate || ''}`;
  const travelerCount = trip?.travelerCount || (trip as any)?.companions?.length || 1;

  const handleDestinationClick = () => {
    if (destinationId) {
      navigate(`/destination/${destinationId}`);
    }
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[420px] bg-slate-900 overflow-hidden">
      {/* Background Image & Overlay */}
      <img
        src={coverImage}
        alt={title}
        className="w-full h-full object-cover scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

      {/* Floating Header */}
      <div className="absolute top-4 inset-x-4 sm:inset-x-8 z-20 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30 transition-all cursor-pointer focus:outline-none"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => navigate('/notifications')}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30 transition-all cursor-pointer focus:outline-none"
          title="Notifications"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-10 inset-x-4 sm:inset-x-8 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* Left Hero Details */}
        <div className="space-y-2 text-white max-w-xl">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#00D68F] text-slate-950 text-xs font-black uppercase tracking-wide">
            {status}
          </div>

          <h1
            onClick={handleDestinationClick}
            className={`text-3xl sm:text-4xl font-black tracking-tight text-white leading-none ${
              destinationId ? 'hover:text-emerald-300 transition-colors cursor-pointer' : ''
            }`}
          >
            {title}
          </h1>

          <p
            onClick={handleDestinationClick}
            className={`text-xs sm:text-sm font-semibold text-white/90 flex items-center gap-1 ${
              destinationId ? 'hover:underline cursor-pointer' : ''
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0" />
            <span>{locations}</span>
          </p>

          <div className="flex items-center gap-3 text-xs font-bold text-white/80 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#6356E5]" />
              <span>{dates}</span>
            </span>
            <span>|</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{travelerCount} Traveler{travelerCount > 1 ? 's' : ''}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
