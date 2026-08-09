import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchX, Sparkles, Compass, RotateCcw } from 'lucide-react';

interface NoResultsProps {
  query: string;
  onSuggestionClick: (term: string) => void;
}

export const NoResults: React.FC<NoResultsProps> = ({ query, onSuggestionClick }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100/90 shadow-2xs text-center space-y-4 my-4">
      <div className="w-16 h-16 rounded-full bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto shadow-inner">
        <SearchX className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-black text-[#0F172A]">
          No results found for "{query}"
        </h3>
        <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
          We couldn't find matches for your search. Try checking spelling or search for popular destinations.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => navigate('/explore')}
          className="px-4 py-2.5 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Destinations</span>
        </button>

        <button
          onClick={() => onSuggestionClick('')}
          className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear Search</span>
        </button>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-2 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Popular suggestions:
        </span>
        {['Meghalaya', 'Ladakh', 'Goa', 'Himalayan Explorers'].map((term) => (
          <button
            key={term}
            onClick={() => onSuggestionClick(term)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-[#6356E5] text-xs font-extrabold border border-slate-100 transition-all cursor-pointer"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
};
