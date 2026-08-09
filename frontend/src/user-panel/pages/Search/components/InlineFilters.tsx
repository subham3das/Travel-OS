import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { FilterState, DEFAULT_FILTER_STATE } from '../../../data/search';

import { BudgetSlider } from './BudgetSlider';
import { ChipGroup } from './ChipGroup';
import { RatingSelector } from './RatingSelector';
import { SortSelector } from './SortSelector';
import { FilterActions } from './FilterActions';

interface InlineFiltersProps {
  filters: FilterState;
  onFilterChange: (updated: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
  totalResultsCount: number;
}

export const InlineFilters: React.FC<InlineFiltersProps> = ({
  filters,
  onFilterChange,
  onApply,
  onReset,
  totalResultsCount,
}) => {
  const destinationOptions = ['Meghalaya', 'Goa', 'Ladakh', 'Kerala', 'Andaman', 'Spiti'];
  const durationOptions = ['1–3 Days', '4–7 Days', '8–12 Days', '12+ Days'];
  const travelTypeOptions = ['Adventure', 'Nature', 'Luxury', 'Family', 'Solo', 'Couple', 'Road Trip', 'Wildlife'];
  const monthOptions = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="overflow-hidden bg-white rounded-3xl border border-slate-200/90 shadow-lg my-3"
    >
      <div className="p-4 sm:p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black text-[#0F172A]">Advanced Filters</h3>
          <span className="text-xs font-bold text-slate-400">Refine your search</span>
        </div>

        {/* 1. Budget Slider */}
        <BudgetSlider
          minBudget={filters.minBudget}
          maxBudget={filters.maxBudget}
          onChange={(min, max) =>
            onFilterChange({ ...filters, minBudget: min, maxBudget: max })
          }
        />

        {/* 2. Destination */}
        <ChipGroup
          title="Destination"
          options={destinationOptions}
          selectedOptions={filters.selectedDestinations}
          onChange={(updated) => onFilterChange({ ...filters, selectedDestinations: updated })}
        />

        {/* 3. Duration */}
        <ChipGroup
          title="Duration"
          options={durationOptions}
          selectedOptions={filters.selectedDurations}
          onChange={(updated) => onFilterChange({ ...filters, selectedDurations: updated })}
        />

        {/* 4. Travel Type */}
        <ChipGroup
          title="Travel Type"
          options={travelTypeOptions}
          selectedOptions={filters.selectedTravelTypes}
          onChange={(updated) => onFilterChange({ ...filters, selectedTravelTypes: updated })}
        />

        {/* 5. Rating Selector */}
        <RatingSelector
          minRating={filters.minRating}
          onChange={(rating) => onFilterChange({ ...filters, minRating: rating })}
        />

        {/* 6. Verified Agencies Toggle */}
        <div className="flex items-center justify-between py-1 border-y border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-extrabold text-[#0F172A]">Verified Agencies Only</span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={(e) => onFilterChange({ ...filters, verifiedOnly: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6356E5]" />
          </label>
        </div>

        {/* 7. Travel Month */}
        <ChipGroup
          title="Travel Month"
          options={monthOptions}
          selectedOptions={filters.selectedMonths}
          onChange={(updated) => onFilterChange({ ...filters, selectedMonths: updated })}
        />

        {/* 8. Sort By */}
        <SortSelector
          sortBy={filters.sortBy}
          onChange={(sort) => onFilterChange({ ...filters, sortBy: sort })}
        />

        {/* 9. Bottom Row Actions */}
        <FilterActions
          totalCount={totalResultsCount}
          onReset={onReset}
          onApply={onApply}
        />
      </div>
    </motion.div>
  );
};
