import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search destinations, agencies, packages...',
  onSearch,
  onFilterClick,
  className = '',
}) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) onSearch(val);
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <div className="relative flex-1 flex items-center bg-white rounded-2xl sm:rounded-full border border-slate-100 shadow-sm hover:border-slate-200 focus-within:border-[#FF4D6D] focus-within:ring-2 focus-within:ring-[#FF4D6D]/15 transition-all px-4 py-3 sm:py-3.5">
        <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm sm:text-base font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none"
        />
        {onFilterClick && (
          <button
            type="button"
            onClick={onFilterClick}
            className="p-1.5 rounded-xl text-[#FF4D6D] hover:bg-[#FF4D6D]/10 transition-colors shrink-0 ml-2 focus:outline-none"
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
