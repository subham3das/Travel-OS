import React from 'react';
import { BrandLogo, BrandIcon } from '../../../common/brand';

export interface LogoProps {
  variant?: 'dark' | 'light' | 'auto';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
  iconOnly?: boolean;
}

/**
 * ApnaTrip Logo Component (Centralized Integration)
 * Renders the new official ApnaTrip wordmark or icon.
 * Preserves full backward-compatibility with all existing panels.
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'auto',
  size = 'md',
  showSubtitle = false,
  className = '',
  onClick,
  iconOnly = false,
}) => {
  const sizeHeight = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-12',
    xl: 'h-14 sm:h-16',
  }[size];

  const iconSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  }[size];

  if (iconOnly) {
    return (
      <BrandIcon
        className={`${iconSize} ${className}`}
        onClick={onClick}
        alt="ApnaTrip"
      />
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center justify-center ${
        onClick ? 'cursor-pointer select-none' : ''
      } ${className}`}
    >
      <BrandLogo
        theme={variant}
        className={`${sizeHeight} w-auto max-w-full`}
        alt="ApnaTrip"
      />
      {showSubtitle && (
        <span className="text-[10px] sm:text-xs font-bold text-slate-400 mt-1 tracking-wider uppercase">
          Discover. Connect. Travel.
        </span>
      )}
    </div>
  );
};
