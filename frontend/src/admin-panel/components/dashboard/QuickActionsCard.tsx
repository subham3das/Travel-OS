import React from 'react';
import { motion } from 'framer-motion';
import {
  UserPlus,
  Megaphone,
  FileSpreadsheet,
  Image as ImageIcon,
  BarChart2,
} from 'lucide-react';
import { QuickAction } from '../../types/dashboard';

interface QuickActionsCardProps {
  actions: QuickAction[];
  onActionClick?: (actionKey: string) => void;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  actions,
  onActionClick,
}) => {
  const getIcon = (iconName: QuickAction['iconName']) => {
    switch (iconName) {
      case 'add_agency':
        return <UserPlus className="w-5 h-5 text-purple-600" />;
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-blue-600" />;
      case 'report':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'banner':
        return <ImageIcon className="w-5 h-5 text-orange-500" />;
      case 'analytics':
      default:
        return <BarChart2 className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getBgClass = (color: string) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-50 border-purple-100 hover:bg-purple-100/60';
      case 'blue':
        return 'bg-blue-50 border-blue-100 hover:bg-blue-100/60';
      case 'emerald':
        return 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100/60';
      case 'orange':
        return 'bg-orange-50 border-orange-100 hover:bg-orange-100/60';
      case 'indigo':
      default:
        return 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100/60';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight">Quick Actions</h3>
      </div>

      {/* Grid of Action Cards (Responsive 2 to 5 columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((act) => (
          <button
            key={act.id}
            onClick={() => onActionClick && onActionClick(act.actionKey)}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5 group ${getBgClass(
              act.color
            )}`}
          >
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform shrink-0">
              {getIcon(act.iconName)}
            </div>

            <div>
              <p className="text-xs font-black text-[#0F172A] leading-tight group-hover:text-[#6356E5] transition-colors">
                {act.title}
              </p>
              <p className="text-[10px] font-semibold text-slate-400 leading-tight mt-0.5">
                {act.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
