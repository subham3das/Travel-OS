import React from 'react';
import { ArrowRight } from 'lucide-react';

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
  viewAllText = 'See all',
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
        <span>{title}</span>
        {emoji && <span>{emoji}</span>}
      </h3>

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="text-xs sm:text-sm font-bold text-[#6356E5] hover:underline focus:outline-none flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>{viewAllText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
