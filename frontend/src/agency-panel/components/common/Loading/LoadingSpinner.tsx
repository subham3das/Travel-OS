import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading...',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 gap-2 text-slate-400 select-none ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-[#583BE8] animate-spin`} />
      {label && <span className="text-xs font-extrabold text-slate-500">{label}</span>}
    </div>
  );
};

export default LoadingSpinner;
