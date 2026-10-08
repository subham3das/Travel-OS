import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Calendar, MapPin } from 'lucide-react';

export interface TravelPackage {
  id: string;
  badge?: 'Best Seller' | 'Popular' | 'New' | 'Weekend';
  title: string;
  category?: string;
  adventureType?: string;
  price: string;
  rating: number;
  reviewsCount: number;
  duration: string;
  location: string;
  imageUrl: string;
  agency?: string;
  isWishlisted?: boolean;
}

export const ADVENTURE_EMOJIS: Record<string, string> = {
  Trekking: '🥾',
  Camping: '🏕️',
  Backpacking: '🎒',
  Expedition: '🏔️',
  'Road Trip': '🚙',
  'Wildlife Safari': '🦁',
  'Desert Safari': '🐪',
  Cycling: '🚴',
  'River Rafting': '🚣',
  Skiing: '⛷️',
  'Snow Adventure': '❄️',
  'Scuba Diving': '🤿',
  Paragliding: '🪂',
  'General Adventure': '🧗',
};

export const getAdventureEmoji = (type?: string): string => {
  if (!type) return '🧭';
  return ADVENTURE_EMOJIS[type] || '🧭';
};

import { wishlistService } from '../../services/wishlist.service';

interface PackageCardProps {
  packageData: TravelPackage;
  onBook?: (pkg: TravelPackage) => void;
  onWishlistToggle?: (pkg: TravelPackage, active: boolean) => void;
  className?: string;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  packageData,
  onBook,
  onWishlistToggle,
  className = '',
}) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(() =>
    wishlistService.isPackageSaved(packageData.id) || Boolean(packageData.isWishlisted)
  );

  useEffect(() => {
    setIsWishlisted(wishlistService.isPackageSaved(packageData.id) || Boolean(packageData.isWishlisted));
  }, [packageData.id, packageData.isWishlisted]);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = wishlistService.toggleSavePackage({
      id: packageData.id,
      title: packageData.title,
      price: packageData.price,
      image: packageData.imageUrl,
      agency: packageData.agency || 'Verified Agency',
      duration: packageData.duration,
    });
    setIsWishlisted(nextState);
    if (onWishlistToggle) onWishlistToggle(packageData, nextState);
  };

  const handleCardClick = () => {
    if (onBook) {
      onBook(packageData);
    } else {
      navigate(`/package/${packageData.id}`);
    }
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'Best Seller':
        return 'bg-[#FF4D6D] text-white';
      case 'Popular':
        return 'bg-emerald-500 text-white';
      case 'New':
        return 'bg-sky-500 text-white';
      case 'Weekend':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className={`relative w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 shadow-xs dark:shadow-none hover:shadow-md dark:hover:border-white/20 transition-all overflow-hidden flex flex-col shrink-0 cursor-pointer ${className}`}
    >
      {/* Package Image */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={packageData.imageUrl}
          alt={packageData.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Phase 7: Adaptive 20-35% dark overlay so images don't overpower dark mode */}
        <div className="absolute inset-0 bg-transparent dark:bg-black/25 pointer-events-none transition-colors" />

        {/* Badge Tag */}
        {packageData.badge && (
          <div
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold shadow-xs z-10 ${getBadgeColor(
              packageData.badge
            )}`}
          >
            {packageData.badge}
          </div>
        )}



        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label="Wishlist package"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 border border-transparent dark:border-white/10 transition-all shadow-xs focus:outline-none z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-[#FF4D6D] text-[#FF4D6D]' : 'text-slate-600 dark:text-slate-300'
            }`}
          />
        </button>

        {/* Rating Overlay Pill */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1 z-10">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{packageData.rating}</span>
          <span className="text-slate-300 font-normal">({packageData.reviewsCount})</span>
        </div>
      </div>

      {/* Package Details */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <h4 className="text-base font-extrabold text-[#0F172A] dark:text-white tracking-tight line-clamp-1">
            {packageData.title}
          </h4>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {packageData.duration}
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {packageData.location}
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">
              Starting from
            </span>
            <span className="text-lg font-black text-[#0F172A] dark:text-white">{packageData.price}</span>
            <span className="text-[10px] text-slate-400 font-normal"> / person</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs focus:outline-none cursor-pointer"
          >
            Explore
          </button>
        </div>
      </div>
    </motion.div>
  );
};
