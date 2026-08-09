import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

export interface SuccessBannerProps {
  isVisible: boolean;
  message: string;
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const SuccessBanner: React.FC<SuccessBannerProps> = ({
  isVisible,
  message,
  onDismiss,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`bg-emerald-500 text-white px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between gap-3 shadow-md shadow-emerald-500/20 select-none ${className}`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="truncate">{message}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {actionLabel && onAction && (
              <button
                type="button"
                onClick={onAction}
                className="underline hover:opacity-80 transition-opacity cursor-pointer font-black"
              >
                {actionLabel}
              </button>
            )}

            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="p-1 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessBanner;
