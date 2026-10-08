import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { VehicleType } from '../../types/carRental';
import { VEHICLE_CATEGORY_ASSETS } from '../../services/carRental.service';

interface PopularCarCategoriesProps {
  selectedType?: VehicleType | null;
  onSelectType: (type: VehicleType) => void;
  onViewAll?: () => void;
}

export const PopularCarCategories: React.FC<PopularCarCategoriesProps> = ({
  selectedType,
  onSelectType,
  onViewAll,
}) => {
  const types: VehicleType[] = [
    'hatchback',
    'sedan',
    'suv',
    'tempo_traveller',
    'luxury',
    'mini_bus',
  ];

  return (
    <div className="w-full space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
          Popular Categories
        </h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {types.map((type) => {
          const cat = VEHICLE_CATEGORY_ASSETS[type];
          const isSelected = selectedType === type;

          return (
            <motion.div
              key={type}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectType(type)}
              className={`flex-shrink-0 w-36 sm:w-44 bg-white rounded-3xl p-3 sm:p-4 border transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'border-[#FF4D6D] ring-2 ring-[#FF4D6D]/20 shadow-md'
                  : 'border-slate-100 shadow-2xs hover:shadow-md'
              }`}
            >
              {/* Vehicle Thumbnail Preview */}
              <div className="h-20 sm:h-24 w-full flex items-center justify-center p-1 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title, Subtitle & Arrow */}
              <div className="flex items-end justify-between pt-2 border-t border-slate-50">
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A] leading-tight truncate group-hover:text-[#FF4D6D] transition-colors">
                    {cat.label}
                  </h4>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-400 leading-tight truncate mt-0.5">
                    {cat.sub}
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-50 group-hover:bg-rose-50 group-hover:text-[#FF4D6D] text-slate-400 flex items-center justify-center transition-colors shrink-0">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
