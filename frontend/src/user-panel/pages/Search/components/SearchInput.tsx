import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Mic, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';

interface SearchInputProps {
  query: string;
  onQueryChange: (q: string) => void;
  onClear: () => void;
  onCancel: () => void;
  onBackToHome?: () => void;
  onFilterToggle?: () => void;
  isFilterOpen?: boolean;
  isFilterActive?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  query,
  onQueryChange,
  onClear,
  onCancel,
  onBackToHome,
  onFilterToggle,
  isFilterOpen = false,
  isFilterActive = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleHomeClick = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      navigate('/home');
    }
  };

  useEffect(() => {
    // Auto-focus input when search screen mounts
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleVoiceSearch = () => {
    showToast('Voice Search active: Speak destination name...', 'info');
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 w-full">
      {/* Back Arrow to Home */}
      <button
        type="button"
        onClick={handleHomeClick}
        className="p-2 -ml-1 sm:ml-0 rounded-full text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer shrink-0"
        aria-label="Back to Home"
        title="Back to Home"
      >
        <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors" />
      </button>

      <motion.div
        layoutId="global-search-bar"
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 28,
        }}
        className="relative flex-1 flex items-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs dark:shadow-none focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/15 transition-all"
      >
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-400 ml-3.5 shrink-0 pointer-events-none" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search destinations, packages, agencies..."
          className="w-full py-3 px-3 text-xs sm:text-sm font-extrabold text-[#0F172A] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 placeholder:font-semibold focus:outline-none bg-transparent"
        />

        {query && (
          <button
            onClick={onClear}
            className="p-1.5 mr-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
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
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#2563EB] dark:text-[#60A5FA] hover:bg-blue-50 dark:hover:bg-blue-900/30'
          }`}
          title="Voice Search & Filters"
        >
          <Mic className="w-4 h-4" />
          {isFilterActive && !isFilterOpen && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white dark:ring-slate-800" />
          )}
        </button>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.2 }}
        onClick={onCancel}
        className="text-xs sm:text-sm font-extrabold text-[#2563EB] dark:text-[#60A5FA] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] transition-colors cursor-pointer shrink-0"
      >
        Cancel
      </motion.button>
    </div>
  );
};
