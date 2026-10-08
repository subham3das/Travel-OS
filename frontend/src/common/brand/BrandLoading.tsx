import React from 'react';
import { BrandIcon } from './BrandIcon';

export interface BrandLoadingProps {
  className?: string;
  iconClassName?: string;
  message?: string;
}

/**
 * Centered Brand Loading Screen with icon.png and smooth pulse/spinner animation
 */
export const BrandLoading: React.FC<BrandLoadingProps> = ({
  className = 'min-h-[240px]',
  iconClassName = 'w-10 h-10',
  message,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-6 space-y-3.5 ${className}`}>
      <div className="relative flex items-center justify-center">
        <BrandIcon className={`${iconClassName} animate-pulse`} alt="Loading ApnaTrip" isDecorative />
        <div className="absolute inset-0 -m-2 rounded-full border-2 border-[#583BE8]/20 border-t-[#583BE8] animate-spin pointer-events-none" />
      </div>
      {message && <p className="text-xs font-bold text-slate-500 tracking-tight">{message}</p>}
    </div>
  );
};
