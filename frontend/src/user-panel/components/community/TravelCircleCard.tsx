import React from 'react';
import { motion } from 'framer-motion';

export interface TravelCircle {
  id: string;
  title: string;
  membersCount: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

interface TravelCircleCardProps {
  circle: TravelCircle;
  onJoinClick?: (circle: TravelCircle) => void;
}

export const TravelCircleCard: React.FC<TravelCircleCardProps> = ({
  circle,
  onJoinClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onJoinClick && onJoinClick(circle)}
      className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center shrink-0 w-24 sm:w-28 cursor-pointer group"
    >
      <div
        className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl ${circle.bgColor} ${circle.iconColor} flex items-center justify-center mb-2 transition-transform group-hover:scale-105`}
      >
        {circle.icon}
      </div>

      <h5 className="text-xs sm:text-sm font-bold text-[#0F172A] tracking-tight leading-tight">
        {circle.title}
      </h5>

      <p className="text-[10px] sm:text-xs text-slate-400 font-medium leading-none mt-1">
        {circle.membersCount}
      </p>
    </motion.div>
  );
};
