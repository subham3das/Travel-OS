import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Mic, X } from 'lucide-react';

interface SearchInputProps {
  query: string;
  onQueryChange: (q: string) => void;
  onClear: () => void;
  onCancel: () => void;
  onFilterToggle?: () => void;
  isFilterOpen?: boolean;
  isFilterActive?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  query,
  onQueryChange,
  onClear,
  onCancel,
  onFilterToggle,
  isFilterOpen = false,
  isFilterActive = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus input when search screen mounts
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleVoiceSearch = () => {
    alert('Listening... Speak now to search destinations!');
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <motion.div
        layoutId="global-search-bar"
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 28,
        }}
        className="relative flex-1 flex items-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs focus-within:border-[#6356E5] focus-within:ring-2 focus-within:ring-[#6356E5]/10 transition-all"
      >
        <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0 pointer-events-none" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search destinations, packages, agencies..."
          className="w-full py-3 px-3 text-xs sm:text-sm font-extrabold text-[#0F172A] placeholder:text-slate-400 placeholder:font-semibold focus:outline-none bg-transparent"
        />

        {query && (
          <button
            onClick={onClear}
            className="p-1.5 mr-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Mic Voice Search & Filter Toggle Button */}
        <button
          type="button"
          onClick={() => {
            if (onFilterToggle) {
              onFilterToggle();
            } else {
              handleVoiceSearch();
            }
          }}
          className={`p-2 mr-2 rounded-xl transition-all cursor-pointer shrink-0 relative ${
            isFilterOpen || isFilterActive
              ? 'bg-[#6356E5] text-white shadow-2xs'
              : 'text-[#6356E5] hover:bg-purple-50'
          }`}
          title="Voice Search & Filters"
        >
          <Mic className="w-4 h-4" />
          {isFilterActive && !isFilterOpen && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white" />
          )}
        </button>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.2 }}
        onClick={onCancel}
        className="text-xs sm:text-sm font-extrabold text-[#6356E5] hover:text-[#5245d6] transition-colors cursor-pointer shrink-0"
      >
        Cancel
      </motion.button>
    </div>
  );
};
