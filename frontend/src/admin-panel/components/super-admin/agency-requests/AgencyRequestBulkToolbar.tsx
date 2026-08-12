import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  MoreHorizontal,
  CheckSquare,
} from 'lucide-react';

interface AgencyRequestBulkToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onApproveSelected: () => void;
  onRejectSelected: () => void;
  onRequestDocuments: () => void;
  onExportSelected: () => void;
  onMoreActions: () => void;
}

export const AgencyRequestBulkToolbar: React.FC<AgencyRequestBulkToolbarProps> = ({
  selectedCount,
  onClearSelection,
  onApproveSelected,
  onRejectSelected,
  onRequestDocuments,
  onExportSelected,
  onMoreActions,
}) => {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[#EEF2FF] border border-[#6356E5]/30 rounded-2xl p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 shadow-sm select-none"
    >
      {/* Left: Selected count & Clear Selection link */}
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-lg bg-[#6356E5] text-white flex items-center justify-center text-xs font-black">
          <CheckSquare className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-black text-[#0F172A]">
          {selectedCount} selected
        </span>
        <button
          onClick={onClearSelection}
          className="text-xs font-bold text-[#6356E5] hover:underline cursor-pointer ml-1"
        >
          Clear Selection
        </button>
      </div>

      {/* Right: Bulk Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onApproveSelected}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-700 text-xs font-extrabold hover:bg-emerald-50 transition-colors cursor-pointer shadow-2xs"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Approve Selected</span>
        </button>

        <button
          onClick={onRejectSelected}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 text-xs font-extrabold hover:bg-rose-50 transition-colors cursor-pointer shadow-2xs"
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Reject Selected</span>
        </button>

        <button
          onClick={onRequestDocuments}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-amber-700 text-xs font-extrabold hover:bg-amber-50 transition-colors cursor-pointer shadow-2xs"
        >
          <FileText className="w-3.5 h-3.5 text-amber-600" />
          <span>Request Documents</span>
        </button>

        <button
          onClick={onExportSelected}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-[#6356E5] text-xs font-extrabold hover:bg-purple-50 transition-colors cursor-pointer shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-[#6356E5]" />
          <span>Export Selected</span>
        </button>

        <button
          onClick={onMoreActions}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
        >
          <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span>More Actions</span>
        </button>
      </div>
    </motion.div>
  );
};
