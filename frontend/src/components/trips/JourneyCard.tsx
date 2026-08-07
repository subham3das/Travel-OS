import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Bed, User, AlertCircle, Share2, MapPin } from 'lucide-react';

export interface OngoingJourney {
  id: string;
  title: string;
  currentDay: string;
  date: string;
  locations: string;
  imageUrl: string;
}

interface JourneyCardProps {
  journey: OngoingJourney;
  onActionClick?: (actionType: string) => void;
}

export const JourneyCard: React.FC<JourneyCardProps> = ({
  journey,
  onActionClick,
}) => {
  const actions = [
    { id: 'itinerary', label: 'Itinerary', icon: <Calendar className="w-5 h-5" />, color: 'bg-sky-50 text-sky-600' },
    { id: 'hotel', label: 'Hotel', icon: <Bed className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600' },
    { id: 'guide', label: 'Guide', icon: <User className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600' },
    { id: 'emergency', label: 'Emergency', icon: <AlertCircle className="w-5 h-5" />, color: 'bg-rose-50 text-[#FF4D6D]' },
    { id: 'share', label: 'Share Trip', icon: <Share2 className="w-5 h-5" />, color: 'bg-indigo-50 text-indigo-600' },
  ];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="relative w-full rounded-3xl bg-white border border-slate-100 p-4 sm:p-5 shadow-xs overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left Column: Image with Currently Traveling Badge */}
        <div className="md:col-span-5 relative h-48 sm:h-52 md:h-44 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
          <img
            src={journey.imageUrl}
            alt={journey.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-xs">
            Currently Traveling
          </div>
        </div>

        {/* Right Column: Journey Details & Circle Actions */}
        <div className="md:col-span-7 space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
              {journey.title}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-[#FF4D6D]">
              {journey.currentDay} <span className="text-slate-400 font-medium">• {journey.date}</span>
            </p>
            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {journey.locations}
            </p>
          </div>

          {/* Quick Action Circles Grid */}
          <div className="grid grid-cols-5 gap-2 pt-2 border-t border-slate-100">
            {actions.map((act) => (
              <button
                key={act.id}
                onClick={() => onActionClick && onActionClick(act.id)}
                className="flex flex-col items-center gap-1 group focus:outline-none cursor-pointer"
              >
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl ${act.color} flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs`}
                >
                  {act.icon}
                </div>
                <span className="text-[10px] font-bold text-slate-600 group-hover:text-[#0F172A] text-center leading-tight">
                  {act.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
