import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton';

export interface FeaturedAgency {
  id: string;
  name: string;
  isVerified: boolean;
  featuredBadge?: string;
  rating: number;
  reviewsCount: number;
  tripsCompleted: string;
  specialization: string;
  coverImageUrl: string;
  logoUrl?: string;
  bgColor?: string;
}

interface FeaturedAgencyCardProps {
  agency: FeaturedAgency;
  onViewAgency?: (agency: FeaturedAgency) => void;
}

export const FeaturedAgencyCard: React.FC<FeaturedAgencyCardProps> = ({
  agency,
  onViewAgency,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onViewAgency) {
      onViewAgency(agency);
    } else {
      navigate(`/agency/${agency.id}`);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="relative w-72 sm:w-80 rounded-3xl bg-white border border-slate-100/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col shrink-0 cursor-pointer group"
    >
      {/* Cover Image Container */}
      <div className="relative w-full h-40 overflow-hidden bg-slate-100">
        <img
          src={agency.coverImageUrl}
          alt={agency.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Featured Badge */}
        {agency.featuredBadge && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#6356E5] text-white text-[10px] font-bold shadow-xs">
            {agency.featuredBadge}
          </div>
        )}

        {/* Heart Wishlist Button */}
        <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
          <FavoriteButton />
        </div>
      </div>

      {/* Agency Details */}
      <div className="p-4 space-y-3 relative">
        {/* Logo Avatar Overlapping */}
        <div className="-mt-10 mb-1 flex items-end justify-between">
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="w-14 h-14 rounded-full border-3 border-white overflow-hidden bg-white shadow-md flex items-center justify-center font-bold text-slate-800 text-sm cursor-pointer"
          >
            {agency.logoUrl ? (
              <img src={agency.logoUrl} alt={agency.name} className="w-full h-full object-cover" />
            ) : (
              <span>{agency.name.substring(0, 2).toUpperCase()}</span>
            )}
          </div>
        </div>

        {/* Name & Verified Badge */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <h4
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="text-base font-extrabold text-[#0F172A] tracking-tight hover:text-[#6356E5] transition-colors cursor-pointer"
            >
              {agency.name}
            </h4>
            {agency.isVerified && (
              <CheckCircle2 className="w-4 h-4 text-[#6356E5] fill-[#6356E5]/10 shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-[#0F172A]">{agency.rating}</span>
              <span className="text-slate-400">({agency.reviewsCount})</span>
            </span>

            <span className="text-slate-300">•</span>
            <span>{agency.tripsCompleted} Trips</span>
          </div>
        </div>

        {/* Specialization Tag */}
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-semibold">
            {agency.specialization}
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="w-full py-2.5 rounded-xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs font-bold transition-colors focus:outline-none flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>View Agency</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
