import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Briefcase, Wallet, PieChart, Users } from 'lucide-react';

export interface QuickAccessAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

const defaultActions: QuickAccessAction[] = [
  {
    id: 'itinerary',
    title: 'Itinerary',
    icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 'documents',
    title: 'Documents',
    icon: <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />,
    bgColor: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
  {
    id: 'bookings',
    title: 'Bookings',
    icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />,
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'expenses',
    title: 'Expenses',
    icon: <PieChart className="w-5 h-5 sm:w-6 sm:h-6" />,
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    id: 'companions',
    title: 'Companions',
    icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
    bgColor: 'bg-rose-50',
    iconColor: 'text-[#FF4D6D]',
  },
];

interface QuickActionGridProps {
  actions?: QuickAccessAction[];
  onActionClick?: (action: QuickAccessAction) => void;
}

export const QuickActionGrid: React.FC<QuickActionGridProps> = ({
  actions = defaultActions,
  onActionClick,
}) => {
  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-4 w-full">
      {actions.map((act) => (
        <motion.div
          key={act.id}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onActionClick && onActionClick(act)}
          className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer group"
        >
          <div
            className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl ${act.bgColor} ${act.iconColor} flex items-center justify-center mb-2 transition-transform group-hover:scale-105`}
          >
            {act.icon}
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] tracking-tight leading-snug">
            {act.title}
          </h4>
        </motion.div>
      ))}
    </div>
  );
};
