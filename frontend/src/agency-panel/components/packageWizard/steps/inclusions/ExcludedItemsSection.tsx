import React, { useState } from 'react';
import { X, Minus, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';
import { EXCLUDED_OPTIONS_CONFIG } from '../../../../data/packageOptions';

export const ExcludedItemsSection: React.FC = () => {
  const {
    draft,
    toggleExcludedItem,
    addCustomExclusion,
    removeCustomExclusion,
  } = usePackageWizard();

  const [isExpanded, setIsExpanded] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [customText, setCustomText] = useState('');

  const excludedItems = draft?.step6?.excludedItems || [];
  const customExcludedItems = draft?.step6?.customExcludedItems || [];
  const totalCount = excludedItems.length + customExcludedItems.length;

  const handleAddCustom = () => {
    if (customText.trim()) {
      addCustomExclusion(customText);
      setCustomText('');
      setShowInput(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-[#0F172A]">What's NOT Included</h3>
            <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <X className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-400">Things not included in the package</p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <span>{totalCount} items</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-1">
          {/* Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {EXCLUDED_OPTIONS_CONFIG.map(({ id, label }) => {
              const isSelected = excludedItems.includes(id);

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleExcludedItem(id)}
                  className={`p-3 rounded-2xl border text-xs font-extrabold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-50/60 border-rose-300 text-rose-700 shadow-2xs scale-[1.02]'
                      : 'bg-white border-slate-200/80 text-slate-700 hover:border-rose-200'
                  }`}
                >
                  <span className="truncate">{label}</span>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border border-rose-400 text-rose-600 bg-white'
                        : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Minus className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Exclusion Prompt */}
          {showInput ? (
            <div className="flex items-center gap-2 p-2 rounded-2xl border border-rose-400 bg-rose-50/30">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. Monument Entry Tickets"
                className="flex-1 px-3 py-1.5 text-xs font-bold text-[#0F172A] bg-transparent focus:outline-none"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              />
              <button
                type="button"
                onClick={handleAddCustom}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-extrabold shadow-2xs"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowInput(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowInput(true)}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/40 hover:bg-rose-50 text-rose-600 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Custom Exclusion</span>
            </button>
          )}

          {/* Custom Excluded Items List */}
          {customExcludedItems.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {customExcludedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold flex items-center gap-2"
                >
                  <Minus className="w-3.5 h-3.5 text-rose-600" />
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeCustomExclusion(idx)}
                    className="p-0.5 hover:bg-rose-100 rounded-md transition-colors text-rose-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExcludedItemsSection;
