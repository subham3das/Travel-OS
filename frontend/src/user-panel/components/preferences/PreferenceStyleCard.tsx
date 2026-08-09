import React from 'react';
import { motion } from 'framer-motion';

export interface StyleOption {
  id: string;
  label: string;
  icon: string;
}

interface PreferenceStyleCardProps {
  option: StyleOption;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export const PreferenceStyleCard: React.FC<PreferenceStyleCardProps> = ({
  option,
  isSelected,
  onToggle,
}) => {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onToggle(option.id)}
      className={`p-3.5 sm:p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all focus:outline-none cursor-pointer ${
        isSelected
          ? 'bg-[#FF4D6D] text-white border-[#FF4D6D] shadow-md shadow-[#FF4D6D]/20 font-bold'
          : 'bg-white text-slate-700 border-slate-100 hover:border-slate-200 shadow-2xs font-semibold'
      }`}
    >
      <span className="text-2xl sm:text-3xl">{option.icon}</span>
      <span className="text-xs sm:text-sm tracking-tight leading-snug">{option.label}</span>
    </motion.button>
  );
};
