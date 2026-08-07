import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Heart } from 'lucide-react';

export interface CommunityPick {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  isVerifiedTraveler?: boolean;
  quote: string;
  visitedDestination: string;
  agencyName?: string;
  rating: number;
  likesCount?: number;
  timeAgo?: string;
  thumbnailUrl: string;
}

interface CommunityCardProps {
  pick: CommunityPick;
  onClick?: (pick: CommunityPick) => void;
  className?: string;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  pick,
  onClick,
  className = '',
}) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick && onClick(pick)}
      className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row gap-4 shrink-0 w-80 sm:w-96 cursor-pointer group ${className}`}
    >
      {/* Left: Author & Review Content */}
      <div className="flex-1 space-y-3 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Header Author Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-200">
              <img
                src={pick.authorAvatar}
                alt={pick.authorName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-0.5 overflow-hidden">
              <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] tracking-tight leading-none truncate">
                {pick.authorName}
              </h4>
              <p className="text-[11px] font-medium text-slate-400 leading-none">
                {pick.authorHandle}
              </p>
            </div>
          </div>

          {/* Verified Badge */}
          {pick.isVerifiedTraveler && (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Verified Traveler</span>
            </div>
          )}

          {/* Quote Text */}
          <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug line-clamp-3">
            {pick.quote}
          </p>
        </div>

        {/* Visited Info & Rating */}
        <div className="pt-2 border-t border-slate-100 space-y-1">
          <p className="text-[11px] font-semibold text-slate-500">
            Visited <span className="font-bold text-[#0F172A]">{pick.visitedDestination}</span>
            {pick.agencyName && (
              <>
                {' '}with <span className="font-bold text-[#FF4D6D]">{pick.agencyName}</span>
              </>
            )}
          </p>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(pick.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-200'
                }`}
              />
            ))}
            <span className="text-xs font-bold text-slate-700 ml-1">{pick.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Right: Image Preview */}
      <div className="relative w-full md:w-32 h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100">
        <img
          src={pick.thumbnailUrl}
          alt={pick.visitedDestination}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {pick.likesCount && (
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
            <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
            <span>{pick.likesCount}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
