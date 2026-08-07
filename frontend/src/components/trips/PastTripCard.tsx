import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';

export interface PastTrip {
  id: string;
  title: string;
  date: string;
  duration: string;
  rating: number;
  imageUrl: string;
  isWishlisted?: boolean;
}

interface PastTripCardProps {
  trip: PastTrip;
  onClick?: (trip: PastTrip) => void;
  className?: string;
}

export const PastTripCard: React.FC<PastTripCardProps> = ({
  trip,
  onClick,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick(trip);
    } else {
      navigate(`/package/${trip.id.startsWith('package-') ? trip.id : 'package-001'}`);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className={`relative w-60 sm:w-64 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col shrink-0 cursor-pointer group ${className}`}
    >
      {/* Image Container */}
      <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-slate-100">
        <img
          src={trip.imageUrl}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Heart Icon Button */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/25 backdrop-blur-md border border-white/20 flex items-center justify-center text-white focus:outline-none"
        >
          <Heart className={`w-4 h-4 ${trip.isWishlisted ? 'fill-[#FF4D6D] text-[#FF4D6D]' : 'text-white'}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-1">
        <h4 className="text-base font-bold text-[#0F172A] tracking-tight truncate">
          {trip.title}
        </h4>

        <p className="text-xs font-semibold text-slate-400">
          {trip.date} <span className="text-slate-300">•</span> {trip.duration}
        </p>

        <div className="flex items-center gap-1 text-xs font-bold text-slate-700 pt-0.5">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{trip.rating}</span>
        </div>
      </div>
    </motion.div>
  );
};
