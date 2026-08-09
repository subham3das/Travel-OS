import React from 'react';
import { motion } from 'framer-motion';
import { Mountain, Camera, Luggage, Globe2, Compass } from 'lucide-react';

export interface AchievementBadge {
  id: string;
  title: string;
  level: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  iconColor: string;
}

const defaultBadges: AchievementBadge[] = [
  {
    id: 'explorer',
    title: 'Explorer',
    level: 'Level 3',
    icon: <Compass className="w-6 h-6" />,
    bgColor: 'bg-emerald-500',
    borderColor: 'border-emerald-600',
    iconColor: 'text-white',
  },
  {
    id: 'photographer',
    title: 'Photographer',
    level: 'Level 2',
    icon: <Camera className="w-6 h-6" />,
    bgColor: 'bg-sky-500',
    borderColor: 'border-sky-600',
    iconColor: 'text-white',
  },
  {
    id: 'backpacker',
    title: 'Backpacker',
    level: 'Level 2',
    icon: <Luggage className="w-6 h-6" />,
    bgColor: 'bg-amber-500',
    borderColor: 'border-amber-600',
    iconColor: 'text-white',
  },
  {
    id: 'globetrotter',
    title: 'Globetrotter',
    level: 'Level 1',
    icon: <Globe2 className="w-6 h-6" />,
    bgColor: 'bg-purple-500',
    borderColor: 'border-purple-600',
    iconColor: 'text-white',
  },
  {
    id: 'trekker',
    title: 'Trekker',
    level: 'Level 2',
    icon: <Mountain className="w-6 h-6" />,
    bgColor: 'bg-teal-500',
    borderColor: 'border-teal-600',
    iconColor: 'text-white',
  },
];

export const AchievementGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-4 w-full">
      {defaultBadges.map((badge) => (
        <motion.div
          key={badge.id}
          whileHover={{ y: -3 }}
          className="flex flex-col items-center text-center group cursor-pointer"
        >
          {/* Polygon Shield Icon */}
          <div
            className={`w-12 h-14 sm:w-14 sm:h-16 ${badge.bgColor} ${badge.borderColor} border-2 flex items-center justify-center text-white mb-2 shadow-sm transition-transform group-hover:scale-105`}
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          >
            {badge.icon}
          </div>

          <h5 className="text-xs sm:text-sm font-bold text-[#0F172A] tracking-tight leading-tight">
            {badge.title}
          </h5>
          <p className="text-[10px] sm:text-xs font-semibold text-slate-400 leading-none mt-0.5">
            {badge.level}
          </p>
        </motion.div>
      ))}
    </div>
  );
};
