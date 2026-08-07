import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  emoji?: string;
  onViewAll?: () => void;
  viewAllText?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  emoji,
  onViewAll,
  viewAllText = 'View all',
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
        <span>{title}</span>
        {emoji && <span className="text-xl">{emoji}</span>}
      </h3>

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="group flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#FF4D6D] hover:text-[#e03d5c] transition-colors focus:outline-none"
        >
          <span>{viewAllText}</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      )}
    </div>
  );
};
