import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, MapPin, Mountain, ChevronDown } from 'lucide-react';

export interface FilterChipItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

const defaultFilterChips: FilterChipItem[] = [
  { id: 'verified', label: 'Verified', icon: <CheckCircle2 className="w-4 h-4" /> },
  { id: 'top-rated', label: 'Top Rated', icon: <Star className="w-4 h-4" /> },
  { id: 'near-me', label: 'Near Me', icon: <MapPin className="w-4 h-4" /> },
  { id: 'adventure', label: 'Adventure', icon: <Mountain className="w-4 h-4" /> },
  { id: 'more', label: 'More', icon: <ChevronDown className="w-4 h-4" /> },
];

interface AgencyFilterProps {
  activeFilter: string;
  onFilterChange: (id: string) => void;
}

export const AgencyFilter: React.FC<AgencyFilterProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
      {defaultFilterChips.map((chip) => {
        const isActive = activeFilter === chip.id;
        return (
          <motion.button
            key={chip.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFilterChange(chip.id)}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all focus:outline-none shrink-0 cursor-pointer ${
              isActive
                ? 'bg-[#6356E5] text-white shadow-md shadow-[#6356E5]/20'
                : 'bg-white text-slate-700 border border-slate-100 hover:bg-slate-50 shadow-2xs'
            }`}
          >
            {chip.icon && <span>{chip.icon}</span>}
            <span>{chip.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};
