import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Printer, CheckCircle2 } from 'lucide-react';
import { AgencySettlementRow } from '../../../types/financeManagement';

interface SettlementDetailModalProps {
  settlement: AgencySettlementRow | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SettlementDetailModal: React.FC<SettlementDetailModalProps> = ({
  settlement,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !settlement) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 space-y-5"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#6356E5] flex items-center justify-center text-white font-black text-lg shadow-md shadow-[#6356E5]/25">
                T
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A]">Settlement Statement Voucher</h3>
                <p className="text-[10px] font-semibold text-slate-400">
                  Voucher Reference: <span className="font-mono text-[#6356E5] font-bold">{settlement.settlementId}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Agency Details */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <img
                src={settlement.agencyLogo}
                alt={settlement.agencyName}
                className="w-9 h-9 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <p className="font-black text-[#0F172A]">{settlement.agencyName}</p>
                <p className="text-[11px] text-slate-500">Disbursement Date: {settlement.settlementDate}</p>
              </div>
            </div>

            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                settlement.status === 'Settled'
                  ? 'bg-emerald-50 text-emerald-600'
                  : settlement.status === 'Pending'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              {settlement.status}
            </span>
          </div>

          {/* Financial Breakdown Table */}
          <div className="space-y-2 text-xs border border-slate-100 rounded-2xl p-4 bg-white">
            <div className="flex justify-between py-1 text-slate-600">
              <span>Gross Settlement Amount</span>
              <span className="font-bold text-[#0F172A]">{settlement.settlementAmount}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-600 border-t border-slate-100">
              <span>Platform Commission Deducted</span>
              <span className="font-bold text-rose-600">- {settlement.commission}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-600 border-t border-slate-100">
              <span>TDS / GST Withholding (Taxes)</span>
              <span className="font-bold text-rose-600">- {settlement.tax}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-slate-200 text-sm font-black bg-[#EEF2FF] -mx-4 -mb-4 px-4 rounded-b-2xl">
              <span className="text-[#6356E5]">Net Disbursed Amount</span>
              <span className="text-[#6356E5] font-black">{settlement.netAmount}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Statement</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
