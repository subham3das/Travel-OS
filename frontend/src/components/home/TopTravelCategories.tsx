import React from 'react';
import { motion } from 'framer-motion';
import { Mountain, Palmtree, Landmark, Compass, Users2, MoreHorizontal } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';

export interface TopCategory {
  id: string;
  title: string;
  count: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

const topCategoriesData: TopCategory[] = [
  {
    id: 'mountains',
    title: 'Mountains',
    count: '120+ Trips',
    icon: <Mountain className="w-6 h-6" />,
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'beaches',
    title: 'Beaches',
    count: '85+ Trips',
    icon: <Palmtree className="w-6 h-6" />,
    bgColor: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
  {
    id: 'heritage',
    title: 'Heritage',
    count: '60+ Trips',
    icon: <Landmark className="w-6 h-6" />,
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    id: 'adventure',
    title: 'Adventure',
    count: '95+ Trips',
    icon: <Compass className="w-6 h-6" />,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 'family',
    title: 'Family',
    count: '70+ Trips',
    icon: <Users2 className="w-6 h-6" />,
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    id: 'more',
    title: 'More',
    count: 'Explore all',
    icon: <MoreHorizontal className="w-6 h-6" />,
    bgColor: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
];

interface TopTravelCategoriesProps {
  onCategoryClick?: (cat: TopCategory) => void;
}

export const TopTravelCategories: React.FC<TopTravelCategoriesProps> = ({ onCategoryClick }) => {
  return (
    <div className="w-full space-y-4">
      <SectionHeader title="Top Travel Categories" onViewAll={() => {}} />

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
        {topCategoriesData.map((cat) => (
          <motion.div
            key={cat.id}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onCategoryClick && onCategoryClick(cat)}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer group"
          >
            <div
              className={`w-12 h-12 rounded-2xl ${cat.bgColor} ${cat.iconColor} flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110`}
            >
              {cat.icon}
            </div>
            <h5 className="text-xs sm:text-sm font-bold text-[#0F172A] tracking-tight">
              {cat.title}
            </h5>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">
              {cat.count}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
