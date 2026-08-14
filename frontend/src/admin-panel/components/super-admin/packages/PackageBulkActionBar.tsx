import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Star,
  EyeOff,
  Trash2,
  Download,
  ChevronDown,
  X,
} from 'lucide-react';

interface PackageBulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkApprove: () => void;
  onBulkFeature: () => void;
  onBulkHide: () => void;
  onBulkDelete: () => void;
  onBulkExport: () => void;
}

export const PackageBulkActionBar: React.FC<PackageBulkActionBarProps> = ({
  selectedCount,
  onClearSelection,
  onBulkApprove,
  onBulkFeature,
  onBulkHide,
  onBulkDelete,
  onBulkExport,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-2xl p-3 px-4 border border-[#6356E5]/30 shadow-md shadow-[#6356E5]/5 flex flex-wrap items-center justify-between gap-3 select-none"
    >
      {/* Left: Selected count + Clear */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EEF2FF] text-[#6356E5] text-xs font-black">
          <input
            type="checkbox"
            checked={true}
            readOnly
            className="w-4 h-4 rounded text-[#6356E5] focus:ring-0 cursor-pointer"
          />
          <span>{selectedCount} Selected</span>
        </div>

        <button
          onClick={onClearSelection}
          className="text-xs font-bold text-slate-500 hover:text-slate-700 underline underline-offset-2 transition-colors cursor-pointer"
        >
          Clear Selection
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onBulkApprove}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-700 text-xs font-extrabold transition-colors cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Approve Selected</span>
        </button>

        <button
          onClick={onBulkFeature}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold transition-colors cursor-pointer"
        >
          <Star className="w-3.5 h-3.5 text-[#6356E5]" />
          <span>Feature Selected</span>
        </button>

        <button
          onClick={onBulkHide}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-700 text-xs font-extrabold transition-colors cursor-pointer"
        >
          <EyeOff className="w-3.5 h-3.5 text-amber-600" />
          <span>Hide Selected</span>
        </button>

        <button
          onClick={onBulkDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 text-xs font-extrabold transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
          <span>Delete Selected</span>
        </button>

        <button
          onClick={onBulkExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#6356E5]" />
          <span>Export Selected</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer"
          >
            <span>More Actions</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isMoreOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-30 select-none">
              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  onBulkExport();
                }}
                className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
              >
                Download PDF Report
              </button>
              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  onBulkApprove();
                }}
                className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
              >
                Notify Agencies
              </button>
              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  onClearSelection();
                }}
                className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-rose-50 text-xs font-bold text-rose-600 transition-colors flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Deselect All</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
