import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';

export interface GroupTrip {
  id: string;
  title: string;
  status: 'Open' | 'Upcoming' | 'Filling Fast';
  dates: string;
  location: string;
  imageUrl: string;
  participants: string[];
  extraParticipantsCount?: number;
  spotsLeft: string;
}

interface GroupTripCardProps {
  trip: GroupTrip;
  onJoinClick?: (trip: GroupTrip) => void;
}

export const GroupTripCard: React.FC<GroupTripCardProps> = ({
  trip,
  onJoinClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-4 w-full"
    >
      {/* Left: Thumbnail & Info */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
          <img src={trip.imageUrl} alt={trip.title} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-bold text-[#0F172A] tracking-tight">
              {trip.title}
            </h4>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                trip.status === 'Open'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-sky-50 text-sky-600 border border-sky-200'
              }`}
            >
              {trip.status}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {trip.dates}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {trip.location}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Participants Stack + Join Button */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        {/* Avatars Stack */}
        <div className="flex items-center -space-x-2">
          {trip.participants.map((avatar, idx) => (
            <div
              key={idx}
              className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-slate-200 shadow-2xs"
            >
              <img src={avatar} alt="Participant" className="w-full h-full object-cover" />
            </div>
          ))}
          {trip.extraParticipantsCount && (
            <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shadow-2xs">
              +{trip.extraParticipantsCount}
            </div>
          )}
        </div>

        {/* Join CTA */}
        <div className="flex flex-col items-end gap-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onJoinClick && onJoinClick(trip)}
            className="px-4 py-1.5 rounded-full bg-rose-50 hover:bg-[#FF4D6D] text-[#FF4D6D] hover:text-white border border-rose-200 hover:border-[#FF4D6D] text-xs font-bold transition-all focus:outline-none"
          >
            {trip.status === 'Open' ? 'Join Trip' : 'Interested'}
          </motion.button>
          <span className="text-[10px] font-semibold text-rose-500">{trip.spotsLeft}</span>
        </div>
      </div>
    </motion.div>
  );
};
