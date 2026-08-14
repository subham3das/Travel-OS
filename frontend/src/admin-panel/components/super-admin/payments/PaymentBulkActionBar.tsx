import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  FileText,
  ChevronDown,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface PaymentBulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkApproveSettlement: () => void;
  onBulkRejectSettlement: () => void;
  onBulkRefund: () => void;
  onBulkExport: () => void;
  onBulkDownloadInvoice: () => void;
}

export const PaymentBulkActionBar: React.FC<PaymentBulkActionBarProps> = ({
  selectedCount,
  onClearSelection,
  onBulkApproveSettlement,
  onBulkRejectSettlement,
  onBulkRefund,
  onBulkExport,
  onBulkDownloadInvoice,
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
          onClick={onBulkExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#6356E5]" />
          <span>Export</span>
        </button>

        <button
          onClick={onBulkApproveSettlement}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-700 text-xs font-extrabold transition-colors cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Approve Settlement</span>
        </button>

        <button
          onClick={onBulkRejectSettlement}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 text-xs font-extrabold transition-colors cursor-pointer"
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Reject Settlement</span>
        </button>

        <button
          onClick={onBulkRefund}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#6356E5]" />
          <span>Process Refund</span>
        </button>

        <button
          onClick={onBulkDownloadInvoice}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-[#6356E5]" />
          <span>Download Invoice</span>
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
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-30 select-none">
              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  onBulkExport();
                }}
                className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors flex items-center gap-2"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                <span>Export Settlement Sheet</span>
              </button>
              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  onBulkApproveSettlement();
                }}
                className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
              >
                Re-verify Gateways
              </button>
              <div className="my-1 border-t border-slate-100" />
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
