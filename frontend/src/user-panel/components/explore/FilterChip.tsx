import React from 'react';
import { motion } from 'framer-motion';

export interface FilterChipOption {
  id: string;
  label: string;
  icon?: string | React.ReactNode;
}

interface FilterChipProps {
  option: FilterChipOption;
  isActive: boolean;
  onClick: (id: string) => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  option,
  isActive,
  onClick,
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(option.id)}
      className={`px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all focus:outline-none shrink-0 ${
        isActive
          ? 'bg-[#FF4D6D] text-white shadow-md shadow-[#FF4D6D]/20 font-bold'
          : 'bg-white text-slate-700 border border-slate-100 hover:bg-slate-50 hover:text-[#0F172A] shadow-2xs'
      }`}
    >
      {option.icon && (
        <span className={typeof option.icon === 'string' ? 'text-sm' : ''}>
          {option.icon}
        </span>
      )}
      <span>{option.label}</span>
    </motion.button>
  );
};
