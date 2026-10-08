import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Download, X } from 'lucide-react';

interface CarRentalApprovalBulkToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onApproveSelected: () => void;
  onRejectSelected: () => void;
  onRequestChanges: () => void;
  onExportSelected: () => void;
}

export const CarRentalApprovalBulkToolbar: React.FC<CarRentalApprovalBulkToolbarProps> = ({
  selectedCount,
  onClearSelection,
  onApproveSelected,
  onRejectSelected,
  onRequestChanges,
  onExportSelected,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="bg-[#0F172A] text-white p-3.5 sm:px-5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl shadow-slate-950/20 select-none"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center font-black text-xs">
          {selectedCount}
        </div>
        <span className="text-xs font-bold text-slate-200">
          Car Rental applications selected
        </span>
        <button
          onClick={onClearSelection}
          className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer ml-2"
        >
          <X className="w-3.5 h-3.5" />
          <span>Deselect All</span>
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onApproveSelected}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold transition-all cursor-pointer shadow-xs"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Bulk Approve</span>
        </button>

        <button
          onClick={onRequestChanges}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold transition-all cursor-pointer shadow-xs"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Request Changes</span>
        </button>

        <button
          onClick={onRejectSelected}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold transition-all cursor-pointer shadow-xs"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Bulk Reject</span>
        </button>

        <button
          onClick={onExportSelected}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </motion.div>
  );
};
