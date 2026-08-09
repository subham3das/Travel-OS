import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface UpcomingTrip {
  id: string;
  packageId?: string;
  title: string;
  dates: string;
  duration: string;
  locations: string;
  status: 'Confirmed' | 'Pending' | 'Booked';
  imageUrl: string;
  companions: string[];
  extraCompanionsCount?: number;
}

interface UpcomingTripCardProps {
  trip: UpcomingTrip;
  onViewTrip?: (trip: UpcomingTrip) => void;
}

export const UpcomingTripCard: React.FC<UpcomingTripCardProps> = ({
  trip,
  onViewTrip,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onViewTrip) {
      onViewTrip(trip);
    } else {
      navigate(`/trips/${trip.id || 'trip-001'}`);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="relative w-full rounded-3xl bg-white border border-slate-100 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all overflow-hidden cursor-pointer"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left Column: Trip Image */}
        <div className="md:col-span-5 relative h-48 sm:h-52 md:h-44 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
          <img
            src={trip.imageUrl}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-xs">
            {trip.status}
          </div>
        </div>

        {/* Right Column: Trip Info */}
        <div className="md:col-span-7 space-y-3 flex flex-col justify-between h-full">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                {trip.title}
              </h3>
              <button
                onClick={(e) => e.stopPropagation()}
                className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 text-xs sm:text-sm font-semibold text-slate-500">
              <p className="flex items-center gap-1.5 text-slate-600">
                <Calendar className="w-4 h-4 text-[#FF4D6D]" />
                <span>{trip.dates}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-700 font-bold">{trip.duration}</span>
              </p>
              <p className="flex items-center gap-1.5 text-slate-500">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{trip.locations}</span>
              </p>
            </div>
          </div>

          {/* Companions & Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100/80">
            {/* Companion Avatars Stack */}
            <div className="flex items-center -space-x-2">
              {trip.companions.map((c, idx) => (
                <img
                  key={idx}
                  src={c}
                  alt="Companion"
                  className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-2xs"
                />
              ))}
              {trip.extraCompanionsCount && (
                <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shadow-2xs">
                  +{trip.extraCompanionsCount}
                </div>
              )}
            </div>

            {/* Action Button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-50 hover:bg-[#6356E5] text-[#6356E5] hover:text-white border border-slate-200 hover:border-[#6356E5] text-xs sm:text-sm font-bold transition-all shadow-2xs focus:outline-none cursor-pointer"
            >
              <span>View Package Details</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
