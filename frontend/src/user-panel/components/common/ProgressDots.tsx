import React from 'react';
import { motion } from 'framer-motion';

interface TopProgressBarProps {
  totalSteps?: number;
  currentStep: number; // 1-indexed
  variant?: 'dark' | 'light';
}

export const TopProgressBar: React.FC<TopProgressBarProps> = ({
  totalSteps = 4,
  currentStep,
  variant = 'dark',
}) => {
  const isLight = variant === 'light';

  return (
    <div className="flex items-center gap-1.5 w-28">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;

        return (
          <div
            key={index}
            className={`relative h-1 flex-1 rounded-full overflow-hidden ${
              isLight ? 'bg-white/40' : 'bg-slate-200'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTopBar"
                className="absolute inset-0 bg-[#FF4D6D] rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

interface PaginationDotsProps {
  total: number;
  current: number; // 0-indexed or 1-indexed
  onSelect?: (index: number) => void;
}

export const PaginationDots: React.FC<PaginationDotsProps> = ({
  total,
  current,
  onSelect,
}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === current;

        return (
          <button
            key={index}
            onClick={() => onSelect && onSelect(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="focus:outline-none py-2"
          >
            <motion.div
              animate={{
                width: isActive ? 12 : 8,
                backgroundColor: isActive ? '#FF4D6D' : '#CBD5E1',
              }}
              transition={{ duration: 0.3 }}
              className="h-2.5 rounded-full"
            />
          </button>
        );
      })}
    </div>
  );
};
