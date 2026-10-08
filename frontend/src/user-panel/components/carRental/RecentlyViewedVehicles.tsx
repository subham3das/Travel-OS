import React from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronRight } from 'lucide-react';
import { Vehicle } from '../../types/carRental';

interface RecentlyViewedVehiclesProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const RecentlyViewedVehicles: React.FC<RecentlyViewedVehiclesProps> = ({
  vehicles,
  onSelectVehicle,
}) => {
  const safeVehicles = vehicles.filter((v) => v && v.provider && v.pricing);
  if (!safeVehicles || safeVehicles.length === 0) return null;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
          Recently Viewed
        </h3>
      </div>

      <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {safeVehicles.map((veh) => (
          <motion.div
            key={veh.id}
            whileHover={{ y: -3 }}
            onClick={() => onSelectVehicle(veh)}
            className="flex-shrink-0 w-48 sm:w-56 bg-white rounded-3xl p-3 border border-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="relative h-28 sm:h-32 w-full rounded-2xl overflow-hidden bg-slate-100 mb-2">
              <img
                src={veh.thumbnail}
                alt={veh.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-black text-amber-800">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{veh.rating}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs sm:text-sm font-black text-[#0F172A] truncate group-hover:text-[#FF4D6D] transition-colors">
                {veh.name}
              </h4>
              <p className="text-[11px] font-semibold text-slate-400 truncate">
                {veh.provider.name}
              </p>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                <span className="text-xs sm:text-sm font-black text-[#FF4D6D]">
                  ₹{veh.pricing.basePricePerDay.toLocaleString()}
                  <span className="text-[10px] text-slate-400 font-bold">/day</span>
                </span>
                <div className="w-6 h-6 rounded-full bg-slate-50 group-hover:bg-rose-50 group-hover:text-[#FF4D6D] text-slate-400 flex items-center justify-center transition-colors">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
