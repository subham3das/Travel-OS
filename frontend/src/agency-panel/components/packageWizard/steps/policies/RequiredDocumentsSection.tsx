import React, { useState } from 'react';
import { CreditCard, FileText, Check, Plus, X } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';
import { REQUIRED_DOCUMENTS_CONFIG } from '../../../../data/policies';

export const RequiredDocumentsSection: React.FC = () => {
  const {
    draft,
    toggleRequiredDocument,
    addCustomDocument,
    removeCustomDocument,
  } = usePackageWizard();

  const [showInput, setShowInput] = useState(false);
  const [customText, setCustomText] = useState('');

  const selectedDocs = draft?.step7?.requiredDocuments || [];
  const customDocs = draft?.step7?.customDocuments || [];

  const handleAddCustom = () => {
    if (customText.trim()) {
      addCustomDocument(customText);
      setCustomText('');
      setShowInput(false);
    }
  };

  return (
    <div className="space-y-3 select-none">
      <div className="space-y-0.5">
        <label className="text-sm font-extrabold text-[#0F172A]">
          Required Documents <span className="text-rose-500">*</span>
        </label>
        <p className="text-xs font-semibold text-slate-400">Select documents required from travelers</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {REQUIRED_DOCUMENTS_CONFIG.map(({ id, label }) => {
          const isSelected = selectedDocs.includes(id);

          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleRequiredDocument(id)}
              className={`p-3 rounded-2xl border text-xs font-extrabold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-50/70 border-[#583BE8] text-[#583BE8] shadow-2xs scale-[1.02]'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:border-purple-200'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <CreditCard className="w-4 h-4 text-[#583BE8] shrink-0" />
                <span className="truncate">{label}</span>
              </div>
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-[#583BE8] text-white' : 'border border-slate-300 bg-white'
                }`}
              >
                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Add Custom Document Prompt */}
      {showInput ? (
        <div className="flex items-center gap-2 p-2 rounded-2xl border border-[#583BE8] bg-purple-50/30">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="e.g. Vaccination Certificate"
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
          <span>Add Custom Document</span>
        </button>
      )}

      {/* Custom Documents List */}
      {customDocs.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {customDocs.map((doc, idx) => (
            <div
              key={idx}
              className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-[#583BE8] text-xs font-extrabold flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{doc}</span>
              <button
                type="button"
                onClick={() => removeCustomDocument(idx)}
                className="p-0.5 hover:bg-purple-100 rounded-md transition-colors text-[#583BE8] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequiredDocumentsSection;
