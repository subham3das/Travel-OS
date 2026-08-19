import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Check,
  CreditCard,
  Building2,
  Receipt,
  FileCheck,
} from 'lucide-react';
import { SettlementRecord } from '../../../types/financeManagement';

interface SettlementDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  settlement: SettlementRecord | null;
  onApprove: (settlement: SettlementRecord) => void;
  onReject: (settlement: SettlementRecord) => void;
  onDownload: (settlement: SettlementRecord) => void;
}

export const SettlementDetailModal: React.FC<SettlementDetailModalProps> = ({
  isOpen,
  onClose,
  settlement,
  onApprove,
  onReject,
  onDownload,
}) => {
  if (!isOpen || !settlement) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-[#6356E5] border border-purple-100">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-[#0F172A]">Settlement Statement</h3>
                  <span className="text-xs font-mono font-bold text-[#6356E5] bg-purple-50 px-2 py-0.5 rounded-md">
                    {settlement.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold">
                  Disbursement batch review & GST audit
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl hover:bg-slate-200/80 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Agency info */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                {settlement.agencyLogo ? (
                  <img
                    src={settlement.agencyLogo}
                    alt={settlement.agencyName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#6356E5] font-bold flex items-center justify-center text-sm">
                    {settlement.agencyName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-sm text-[#0F172A]">{settlement.agencyName}</h4>
                  <span className="text-xs font-mono text-slate-400">{settlement.agencyId}</span>
                </div>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-1 ${
                    settlement.status === 'Settled'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : settlement.status === 'Pending'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {settlement.status === 'Settled' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {settlement.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                  {settlement.status === 'Failed' && <XCircle className="w-3.5 h-3.5" />}
                  <span>{settlement.status}</span>
                </span>
              </div>
            </div>

            {/* Financial Calculations Table */}
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Financial Breakdown
              </span>

              <div className="flex justify-between text-xs font-semibold py-1 border-b border-slate-200/50">
                <span className="text-slate-600">Gross Booking Volume</span>
                <span className="font-mono font-black text-[#0F172A]">{settlement.settlementAmount}</span>
              </div>

              <div className="flex justify-between text-xs font-semibold py-1 border-b border-slate-200/50">
                <span className="text-[#6356E5]">Platform Commission (10%)</span>
                <span className="font-mono font-bold text-[#6356E5]">- {settlement.commission}</span>
              </div>

              <div className="flex justify-between text-xs font-semibold py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Applicable GST / TDS (18% on Comm)</span>
                <span className="font-mono text-slate-500">- {settlement.tax}</span>
              </div>

              <div className="flex justify-between text-sm font-black pt-1">
                <span className="text-emerald-700">Net Payable Amount</span>
                <span className="font-mono text-emerald-600 text-base">{settlement.netAmount}</span>
              </div>
            </div>

            {/* Payout & Bank Details */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  Payout Schedule
                </span>
                <span className="font-bold text-[#0F172A] mt-0.5 block">
                  {settlement.settlementDate}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  Invoice Number
                </span>
                <span className="font-mono font-bold text-slate-700 mt-0.5 block">
                  {settlement.invoiceNumber}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  Bank Account / IFSC
                </span>
                <span className="font-mono font-bold text-slate-700 mt-0.5 block truncate">
                  {settlement.bankAccount} ({settlement.ifsc})
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  UTR / Reference
                </span>
                <span className="font-mono font-bold text-slate-700 mt-0.5 block">
                  {settlement.utrNumber || 'Pending Gateway Sync'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
            <button
              onClick={() => onDownload(settlement)}
              className="py-2.5 px-4 rounded-xl bg-slate-200/80 hover:bg-slate-300/80 text-[#0F172A] text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Tax Invoice</span>
            </button>

            <div className="flex items-center gap-2">
              {settlement.status === 'Pending' ? (
                <>
                  <button
                    onClick={() => {
                      onReject(settlement);
                      onClose();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black transition-all cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      onApprove(settlement);
                      onClose();
                    }}
                    className="py-2.5 px-4 rounded-xl bg-[#6356E5] hover:bg-[#5245cc] text-white text-xs font-black flex items-center gap-1.5 shadow-sm shadow-[#6356E5]/20 transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Release</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-black transition-all cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
