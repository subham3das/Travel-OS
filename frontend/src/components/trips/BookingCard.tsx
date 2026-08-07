import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Building, Package, Ticket } from 'lucide-react';

export interface BookingCategory {
  id: string;
  title: string;
  countText: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

const defaultBookingCategories: BookingCategory[] = [
  {
    id: 'flights',
    title: 'Flights',
    countText: '12 Bookings',
    icon: <Plane className="w-5 h-5 sm:w-6 sm:h-6" />,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 'hotels',
    title: 'Hotels',
    countText: '18 Bookings',
    icon: <Building className="w-5 h-5 sm:w-6 sm:h-6" />,
    bgColor: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
  {
    id: 'packages',
    title: 'Packages',
    countText: '9 Bookings',
    icon: <Package className="w-5 h-5 sm:w-6 sm:h-6" />,
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'activities',
    title: 'Activities',
    countText: '7 Bookings',
    icon: <Ticket className="w-5 h-5 sm:w-6 sm:h-6" />,
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
];

interface BookingCardGridProps {
  categories?: BookingCategory[];
  onCategoryClick?: (cat: BookingCategory) => void;
}

export const BookingCardGrid: React.FC<BookingCardGridProps> = ({
  categories = defaultBookingCategories,
  onCategoryClick,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
      {categories.map((cat) => (
        <motion.div
          key={cat.id}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onCategoryClick && onCategoryClick(cat)}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex items-center gap-3.5 cursor-pointer group"
        >
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${cat.bgColor} ${cat.iconColor} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
          >
            {cat.icon}
          </div>

          <div className="space-y-0.5 overflow-hidden">
            <h5 className="text-sm font-bold text-[#0F172A] tracking-tight truncate">
              {cat.title}
            </h5>
            <p className="text-[11px] font-semibold text-slate-400 leading-none truncate">
              {cat.countText}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
