import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export interface SavedTrip {
  id: string;
  title: string;
  imageUrl: string;
}

interface SavedTripCardProps {
  trip: SavedTrip;
  onClick?: (trip: SavedTrip) => void;
}

export const SavedTripCard: React.FC<SavedTripCardProps> = ({ trip, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick && onClick(trip)}
      className="relative w-56 sm:w-64 h-36 sm:h-40 rounded-2xl overflow-hidden shadow-2xs border border-slate-100/60 shrink-0 cursor-pointer group"
    >
      <img
        src={trip.imageUrl}
        alt={trip.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Heart Icon Button */}
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
        <Heart className="w-4 h-4 fill-white text-white" />
      </div>

      {/* Destination Title */}
      <div className="absolute bottom-3 left-4 text-white">
        <h4 className="text-base sm:text-lg font-bold tracking-tight drop-shadow-xs">
          {trip.title}
        </h4>
      </div>
    </motion.div>
  );
};
