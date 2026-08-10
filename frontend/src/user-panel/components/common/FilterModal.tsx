import React, { useState } from 'react';
import { X, SlidersHorizontal, Check, RefreshCw } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: any) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(30000);
  const [selectedDuration, setSelectedDuration] = useState<string>('any');
  const [sortBy, setSortBy] = useState<string>('recommended');

  if (!isOpen) return null;

  const handleReset = () => {
    setSelectedCategory('all');
    setPriceRange(30000);
    setSelectedDuration('any');
    setSortBy('recommended');
  };

  const handleApply = () => {
    if (onApply) {
      onApply({
        category: selectedCategory,
        maxPrice: priceRange,
        duration: selectedDuration,
        sort: sortBy,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 select-none animate-in fade-in-0">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-5 animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#583BE8]/10 text-[#583BE8] flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#0F172A]">Filter Trips & Packages</h3>
              <p className="text-xs font-semibold text-slate-400">Refine search by price, type & duration</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs font-black cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <label className="text-xs font-black text-[#0F172A] block uppercase tracking-wider">
            Travel Style
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Trips' },
              { id: 'trekking', label: 'Trekking' },
              { id: 'beaches', label: 'Beaches' },
              { id: 'heritage', label: 'Heritage' },
              { id: 'wildlife', label: 'Wildlife' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#583BE8] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Max Budget Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-black text-[#0F172A]">
            <span className="uppercase tracking-wider">Max Budget</span>
            <span className="text-[#583BE8]">₹{priceRange.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min={5000}
            max={100000}
            step={2500}
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full accent-[#583BE8] cursor-pointer"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-xs font-black text-[#0F172A] block uppercase tracking-wider">
            Duration
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs font-extrabold">
            {[
              { id: 'any', label: 'Any' },
              { id: 'short', label: '1 - 3 Days' },
              { id: 'medium', label: '4 - 7 Days' },
            ].map((dur) => (
              <button
                key={dur.id}
                type="button"
                onClick={() => setSelectedDuration(dur.id)}
                className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedDuration === dur.id
                    ? 'bg-purple-50 border-[#583BE8] text-[#583BE8]'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {dur.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3 rounded-2xl bg-[#583BE8] hover:bg-[#472bd1] text-white text-xs font-black shadow-md shadow-[#583BE8]/25 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
