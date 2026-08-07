import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';

export interface FestivalItem {
  id: string;
  name: string;
  date: string;
  location: string;
  imageUrl: string;
}

interface FestivalCardProps {
  festival: FestivalItem;
  onClick?: (festival: FestivalItem) => void;
  className?: string;
}

export const FestivalCard: React.FC<FestivalCardProps> = ({
  festival,
  onClick,
  className = '',
}) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick && onClick(festival)}
      className={`relative w-64 sm:w-72 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col shrink-0 cursor-pointer group ${className}`}
    >
      {/* Festival Image */}
      <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-slate-100">
        <img
          src={festival.imageUrl}
          alt={festival.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute bottom-2.5 left-3 right-3 text-white">
          <h4 className="text-sm sm:text-base font-bold tracking-tight drop-shadow-sm">
            {festival.name}
          </h4>
        </div>
      </div>

      {/* Festival Details */}
      <div className="p-3.5 space-y-1.5 text-xs font-medium text-slate-500">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0" />
          <span>{festival.date}</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{festival.location}</span>
        </div>
      </div>
    </motion.div>
  );
};
