import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search by name, ID, status or location...',
  isLoading = false,
  className = '',
}) => {
  return (
    <div className={`relative w-full select-none ${className}`}>
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:ring-2 focus:ring-[#583BE8]/10 transition-all shadow-2xs"
        />

        {isLoading && (
          <Loader2 className="w-4 h-4 text-[#583BE8] animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
        )}

        {!isLoading && value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              if (onClear) onClear();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
