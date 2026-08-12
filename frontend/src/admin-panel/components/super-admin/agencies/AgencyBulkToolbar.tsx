import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Download,
  Trash2,
  CheckSquare,
} from 'lucide-react';

interface AgencyBulkToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll?: () => void;
  onVerifySelected: () => void;
  onSuspendSelected: () => void;
  onActivateSelected: () => void;
  onExportSelected: () => void;
  onDeleteSelected: () => void;
}

export const AgencyBulkToolbar: React.FC<AgencyBulkToolbarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onVerifySelected,
  onSuspendSelected,
  onActivateSelected,
  onExportSelected,
  onDeleteSelected,
}) => {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[#EEF2FF] border border-[#6356E5]/30 rounded-2xl p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 shadow-sm select-none"
    >
      {/* Left: Selected count & Select All link */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-[#6356E5] text-white flex items-center justify-center text-xs font-black">
          <CheckSquare className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-black text-[#0F172A]">
          {selectedCount} selected
        </span>
        {onSelectAll && (
          <button
            onClick={onSelectAll}
            className="text-xs font-bold text-[#6356E5] hover:underline cursor-pointer ml-1"
          >
            Select all {totalCount}
          </button>
        )}
      </div>

      {/* Right: Bulk Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onVerifySelected}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-700 text-xs font-extrabold hover:bg-emerald-50 transition-colors cursor-pointer shadow-2xs"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verify Selected</span>
        </button>

        <button
          onClick={onSuspendSelected}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-amber-700 text-xs font-extrabold hover:bg-amber-50 transition-colors cursor-pointer shadow-2xs"
        >
          <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Suspend Selected</span>
        </button>

        <button
          onClick={onActivateSelected}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-700 text-xs font-extrabold hover:bg-emerald-50 transition-colors cursor-pointer shadow-2xs"
        >
          <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Activate Selected</span>
        </button>

        <button
          onClick={onExportSelected}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-[#6356E5] text-xs font-extrabold hover:bg-purple-50 transition-colors cursor-pointer shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-[#6356E5]" />
          <span>Export Selected</span>
        </button>

        <button
          onClick={onDeleteSelected}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 text-xs font-extrabold hover:bg-rose-50 transition-colors cursor-pointer shadow-2xs"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
          <span>Delete Selected</span>
        </button>
      </div>
    </motion.div>
  );
};
