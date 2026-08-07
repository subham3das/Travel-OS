import React from 'react';
import { motion } from 'framer-motion';

export interface MoodItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

interface MoodCardProps {
  mood: MoodItem;
  onClick?: (mood: MoodItem) => void;
}

export const MoodCard: React.FC<MoodCardProps> = ({ mood, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onClick && onClick(mood)}
      className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer group"
    >
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${mood.bgColor} ${mood.iconColor} flex items-center justify-center mb-2 transition-transform group-hover:scale-110`}
      >
        {mood.icon}
      </div>
      <span className="text-xs sm:text-sm font-bold text-[#0F172A] tracking-tight">
        {mood.title}
      </span>
    </motion.div>
  );
};
