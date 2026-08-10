import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: React.ReactNode;
  emoji?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  emoji,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-white rounded-3xl p-8 sm:p-12 border border-slate-100/90 shadow-2xs text-center flex flex-col items-center justify-center space-y-4 my-4"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-purple-50 text-[#6356E5] flex items-center justify-center text-2xl sm:text-3xl border border-purple-100 shadow-sm shrink-0">
        {icon ? icon : emoji || '🏝️'}
      </div>

      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">{title}</h3>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed">{description}</p>
      </div>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full max-w-xs">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="w-full py-3 px-5 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-[#6356E5]/20 transition-all cursor-pointer text-center"
            >
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer text-center"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};
