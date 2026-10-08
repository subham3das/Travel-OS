import React from 'react';
import { motion } from 'framer-motion';
import { Car, Building2, Plane, Clock, Key, Crown } from 'lucide-react';
import { VehicleCategory } from '../../types/carRental';

interface CategoryOption {
  id: VehicleCategory;
  label: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'outstation', label: 'Outstation', icon: <Car className="w-5 h-5 sm:w-6 sm:h-6" /> },
  { id: 'local', label: 'Local', icon: <Building2 className="w-5 h-5 sm:w-6 sm:h-6" /> },
  { id: 'airport', label: 'Airport', icon: <Plane className="w-5 h-5 sm:w-6 sm:h-6" /> },
  { id: 'hourly', label: 'Hourly', icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" /> },
  { id: 'self_drive', label: 'Self Drive', icon: <Key className="w-5 h-5 sm:w-6 sm:h-6" /> },
  { id: 'luxury', label: 'Luxury', icon: <Crown className="w-5 h-5 sm:w-6 sm:h-6" /> },
];

interface CarCategoryScrollProps {
  selectedCategory: VehicleCategory;
  onSelectCategory: (category: VehicleCategory) => void;
}

export const CarCategoryScroll: React.FC<CarCategoryScrollProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-none py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-4 sm:gap-6 min-w-max">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="flex flex-col items-center gap-2 group focus:outline-none cursor-pointer"
            >
              {/* Circular Icon Container */}
              <motion.div
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-rose-50 text-[#FF4D6D] ring-2 ring-[#FF4D6D] ring-offset-2 ring-offset-white shadow-sm'
                    : 'bg-slate-100/90 text-slate-500 hover:bg-slate-200/80 hover:text-slate-700'
                }`}
              >
                {cat.icon}
              </motion.div>

              {/* Label */}
              <span
                className={`text-xs sm:text-sm font-bold tracking-tight transition-colors ${
                  isSelected ? 'text-[#FF4D6D]' : 'text-slate-600 group-hover:text-slate-900'
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
