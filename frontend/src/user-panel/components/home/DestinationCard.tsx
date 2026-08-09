import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';

export interface Destination {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
}

interface DestinationCardProps {
  destination: Destination;
  onExplore?: (destination: Destination) => void;
  className?: string;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onExplore,
  className = '',
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`relative w-72 sm:w-80 h-44 sm:h-52 rounded-3xl overflow-hidden shadow-sm border border-slate-100/60 shrink-0 group cursor-pointer ${className}`}
      onClick={() => onExplore && onExplore(destination)}
    >
      {/* Destination Image */}
      <img
        src={destination.imageUrl}
        alt={destination.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      {/* Top Right Location Pin Circle */}
      <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
        <MapPin className="w-4 h-4 text-white" />
      </div>

      {/* Card Bottom Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10 flex items-end justify-between">
        <div className="space-y-1">
          <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight drop-shadow-sm">
            {destination.name}
          </h4>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs font-semibold text-white/90">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
            <span>{destination.rating}</span>
            <span className="text-white/70">({destination.reviewsCount})</span>
          </div>
        </div>

        {/* Explore Button Pill */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onExplore) onExplore(destination);
          }}
          className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-[#0F172A] border border-white/30 text-xs font-bold transition-all shadow-sm focus:outline-none"
        >
          Explore
        </button>
      </div>
    </motion.div>
  );
};
