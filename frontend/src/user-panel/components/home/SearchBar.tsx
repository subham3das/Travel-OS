import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Mic } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
  className?: string;
  onClick?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search destinations, agencies, packages...',
  onSearch,
  onFilterClick,
  className = '',
  onClick,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleContainerClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/search');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) onSearch(val);
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`relative flex items-center w-full cursor-pointer ${className}`}
    >
      <motion.div
        layoutId="global-search-bar"
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 28,
        }}
        className="relative flex-1 flex items-center bg-white rounded-2xl sm:rounded-full border border-slate-100 shadow-sm hover:border-slate-200 focus-within:border-[#6356E5] focus-within:ring-2 focus-within:ring-[#6356E5]/15 transition-all px-4 py-3 sm:py-3.5"
      >
        <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
        <input
          type="text"
          readOnly
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm sm:text-base font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none cursor-pointer"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onFilterClick) onFilterClick();
            else navigate('/search');
          }}
          className="p-1.5 rounded-xl text-[#6356E5] hover:bg-[#6356E5]/10 transition-colors shrink-0 ml-2 focus:outline-none cursor-pointer"
          aria-label="Voice Search"
        >
          <Mic className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};
