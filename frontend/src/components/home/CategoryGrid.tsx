import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Package, Building2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  path: string;
}

const categories: CategoryItem[] = [
  {
    id: 'destinations',
    title: 'Destinations',
    subtitle: 'Explore places',
    icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />,
    bgColor: 'bg-[#FFE5EC]',
    iconColor: 'text-[#FF4D6D]',
    path: '/explore',
  },
  {
    id: 'packages',
    title: 'Packages',
    subtitle: 'Best deals',
    icon: <Package className="w-5 h-5 sm:w-6 sm:h-6" />,
    bgColor: 'bg-[#E0F2FE]',
    iconColor: 'text-[#0284C7]',
    path: '/explore?tab=packages',
  },
  {
    id: 'agencies',
    title: 'Agencies',
    subtitle: 'Find experts',
    icon: <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />,
    bgColor: 'bg-[#DCFCE7]',
    iconColor: 'text-[#16A34A]',
    path: '/agencies',
  },
  {
    id: 'community',
    title: 'Community',
    subtitle: 'Connect travelers',
    icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
    bgColor: 'bg-[#FFEDD5]',
    iconColor: 'text-[#EA580C]',
    path: '/community',
  },
];

interface CategoryGridProps {
  onCategoryClick?: (category: CategoryItem) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategoryClick }) => {
  const navigate = useNavigate();

  const handleClick = (cat: CategoryItem) => {
    if (onCategoryClick) {
      onCategoryClick(cat);
    } else {
      navigate(cat.path);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full">
      {categories.map((cat) => (
        <motion.div
          key={cat.id}
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => handleClick(cat)}
          className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer group"
        >
          {/* Icon Circle */}
          <div
            className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl ${cat.bgColor} ${cat.iconColor} flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110`}
          >
            {cat.icon}
          </div>

          {/* Title & Subtitle */}
          <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] tracking-tight leading-snug">
            {cat.title}
          </h4>
          <p className="text-[10px] sm:text-xs text-slate-400 font-medium leading-tight mt-0.5 line-clamp-1">
            {cat.subtitle}
          </p>
        </motion.div>
      ))}
    </div>
  );
};
