import React from 'react';
import { motion } from 'framer-motion';

interface PreferenceToggleCardProps {
  id: string;
  title: string;
  subtitle?: string;
  enabled: boolean;
  onToggle: (id: string) => void;
}

export const PreferenceToggleCard: React.FC<PreferenceToggleCardProps> = ({
  id,
  title,
  subtitle,
  enabled,
  onToggle,
}) => {
  return (
    <div
      onClick={() => onToggle(id)}
      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center justify-between gap-4 cursor-pointer hover:border-slate-200 transition-colors"
    >
      <div className="space-y-0.5">
        <h5 className="text-xs sm:text-sm font-bold text-[#0F172A] tracking-tight">{title}</h5>
        {subtitle && <p className="text-[11px] font-medium text-slate-400">{subtitle}</p>}
      </div>

      <motion.div
        animate={{ backgroundColor: enabled ? '#FF4D6D' : '#E2E8F0' }}
        className="w-12 h-6 rounded-full p-0.5 relative shrink-0 transition-colors"
      >
        <motion.div
          animate={{ x: enabled ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-5 h-5 rounded-full bg-white shadow-xs"
        />
      </motion.div>
    </div>
  );
};
