import React, { useState } from 'react';
import { Check, Plus, X, ChevronUp, ChevronDown } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';
import { PACKING_OPTIONS_CONFIG } from '../../../../data/packageOptions';

export const PackingItemsSection: React.FC = () => {
  const {
    draft,
    togglePackingItem,
    addCustomPackingItem,
    removeCustomPackingItem,
  } = usePackageWizard();

  const [isExpanded, setIsExpanded] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [customText, setCustomText] = useState('');

  const packingItems = draft?.step6?.packingItems || [];
  const customPackingItems = draft?.step6?.customPackingItems || [];
  const totalCount = packingItems.length + customPackingItems.length;

  const handleAddCustom = () => {
    if (customText.trim()) {
      addCustomPackingItem(customText);
      setCustomText('');
      setShowInput(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-base sm:text-lg font-black text-[#0F172A]">Things Travelers Should Carry</h3>
          <p className="text-xs font-semibold text-slate-400">Essential items for a safe trip</p>
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
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {PACKING_OPTIONS_CONFIG.map(({ id, label }) => {
              const isSelected = packingItems.includes(id);

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => togglePackingItem(id)}
                  className={`p-2.5 px-3 rounded-2xl border text-xs font-extrabold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-50/70 border-[#583BE8] text-[#583BE8]'
                      : 'bg-white border-slate-200/80 text-slate-700 hover:border-purple-200'
                  }`}
                >
                  <span className="truncate">{label}</span>
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#583BE8] text-white'
                        : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Packing Item Prompt */}
          {showInput ? (
            <div className="flex items-center gap-2 p-2 rounded-2xl border border-[#583BE8] bg-purple-50/30">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. Thermal Innerwear"
                className="flex-1 px-3 py-1.5 text-xs font-bold text-[#0F172A] bg-transparent focus:outline-none"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              />
              <button
                type="button"
                onClick={handleAddCustom}
                className="px-3 py-1.5 rounded-xl bg-[#583BE8] text-white text-xs font-extrabold shadow-2xs"
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
              className="w-full py-3 rounded-2xl border-2 border-dashed border-[#583BE8]/50 hover:border-[#583BE8] bg-purple-50/40 hover:bg-purple-50 text-[#583BE8] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Packing Item</span>
            </button>
          )}

          {/* Custom Packing Items List */}
          {customPackingItems.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {customPackingItems.map((item, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-[#583BE8] text-xs font-extrabold flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5 text-[#583BE8]" />
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeCustomPackingItem(idx)}
                    className="p-0.5 hover:bg-purple-100 rounded-md transition-colors text-[#583BE8] cursor-pointer"
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

export default PackingItemsSection;
