import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, CheckCircle2, Star, Users, Fuel, Cog, ChevronRight, Share2 } from 'lucide-react';
import { Vehicle } from '../../types/carRental';

interface VehicleCardProps {
  vehicle: Vehicle;
  isFavorite?: boolean;
  onToggleFavorite?: (vehicleId: string) => void;
  // ponytail: onSelectVehicle + onBookNow both now navigate to detail page
  // kept in props signature for backward compat but internally both just navigate
  onSelectVehicle?: (vehicle: Vehicle) => void;
  onBookNow?: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const navigate = useNavigate();

  const goToDetail = () => navigate(`/car-rental/${vehicle.id}`);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(vehicle.id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/car-rental/${vehicle.id}`;
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.name} - ApnaTrip Car Rental`,
        text: `Rent ${vehicle.name} from ${vehicle.provider.name} on ApnaTrip for ₹${vehicle.pricing.basePricePerDay.toLocaleString()}/day!`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToDetail();
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={goToDetail}
      className="w-full bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-white/10 p-4 shadow-xs dark:shadow-none hover:shadow-md dark:hover:border-white/20 transition-all cursor-pointer group flex flex-col md:flex-row gap-4 relative overflow-hidden select-none"
    >
      {/* Left / Top: Vehicle Image Container */}
      <div className="relative w-full md:w-56 lg:w-64 h-48 sm:h-52 md:h-auto rounded-2xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-900">
        <img
          src={vehicle.thumbnail}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Phase 7: Adaptive 20-35% dark overlay so images don't overpower dark mode */}
        <div className="absolute inset-0 bg-transparent dark:bg-black/25 pointer-events-none transition-colors" />

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label="Save Vehicle"
          className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xs hover:scale-110 active:scale-90 transition-all flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-rose-500 border border-transparent dark:border-white/10 cursor-pointer focus:outline-none z-10"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300'
            }`}
          />
        </button>

        {/* Transmission Pill */}
        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider z-10">
          {vehicle.specs.transmission}
        </div>
      </div>

      {/* Right / Content Section */}
      <div className="flex-1 flex flex-col justify-between space-y-3">
        {/* Top Header: Title & Provider with Verified Badge */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-white leading-tight group-hover:text-[#FF4D6D] transition-colors flex items-center gap-1">
                <span>{vehicle.name}</span>
              </h4>

              {/* Provider Name + Blue Verified Checkmark */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {vehicle.provider.name}
                </span>
                {vehicle.provider.isVerified && (
                  <CheckCircle2 className="w-3.5 h-3.5 fill-sky-500 text-white" />
                )}
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700/50 group-hover:bg-rose-50 dark:group-hover:bg-rose-950/40 group-hover:text-[#FF4D6D] text-slate-400 dark:text-slate-300 flex items-center justify-center transition-colors shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Specs Badges Row */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/40 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-white/10">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.specs.seats} Seater</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/40 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-white/10">
              <Fuel className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.specs.fuel}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/40 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-white/10">
              <Cog className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.specs.transmission}</span>
            </div>

            {vehicle.specs.hasAC && (
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/40 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-white/10">
                <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400">AC</span>
              </div>
            )}

            {vehicle.specs.driverIncluded && (
              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400">
                <span className="text-[11px] font-bold">Driver Included</span>
              </div>
            )}
          </div>

          {/* Matched Route or Primary Route Pill */}
          {vehicle.matchedRoute && (
            <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50/80 dark:bg-blue-950/40 border border-purple-100 dark:border-blue-800/40 text-[#2563EB] dark:text-[#60A5FA] text-xs font-black">
              <span>{vehicle.matchedRoute.pickup}</span>
              <span className="text-purple-400 dark:text-blue-400">↓</span>
              <span>{vehicle.matchedRoute.destination}</span>
              {vehicle.matchedRoute.estimatedDuration && (
                <span className="text-[10px] text-slate-400 font-semibold pl-1 border-l border-purple-200 dark:border-blue-800/60">
                  {vehicle.matchedRoute.estimatedDuration}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Row: Rating, Share & Price + Book Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-white">
              {vehicle.rating}
            </span>
            <span className="text-xs font-medium text-slate-400">
              ({vehicle.reviewsCount} reviews)
            </span>
          </div>

          {/* Price & Action Buttons */}
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={handleShareClick}
              aria-label="Share listing"
              className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            <div className="text-right">
              <span className="text-base sm:text-lg font-black text-[#FF4D6D]">
                ₹{(vehicle.routePrice || vehicle.pricing.fixedPrice || vehicle.pricing.basePricePerDay).toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-slate-400 block -mt-0.5">Fixed Price</span>
            </div>

            <button
              type="button"
              onClick={handleBookClick}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF3358] hover:opacity-95 text-white text-xs font-black shadow-xs shadow-[#FF4D6D]/20 transition-all cursor-pointer focus:outline-none"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
