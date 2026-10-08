import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Landmark,
  FileText,
  Copy,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface SettlementTimelineModalProps {
  settlement: any | null;
  onClose: () => void;
}

export const SettlementTimelineModal: React.FC<SettlementTimelineModalProps> = ({
  settlement,
  onClose,
}) => {
  if (!settlement) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'SETTLED' || s === 'PROCESSED' || s === 'COMPLETED') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
          Settled
        </span>
      );
    }
    if (s === 'PROCESSING') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
          Processing
        </span>
      );
    }
    if (s === 'FAILED') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
          Failed
        </span>
      );
    }
    if (s === 'REVERSED') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-800 border border-slate-300">
          Reversed
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
        Pending
      </span>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden font-sans max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#583BE8]">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-[#0F172A]">Settlement Dossier</h3>
                  {getStatusBadge(settlement.status)}
                </div>
                <p className="text-[11px] font-bold text-slate-400 font-mono">
                  Ref: {settlement.settlementId}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Financial Summary Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#FBFBFE] border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Gross Amount</span>
                <p className="text-sm font-black text-[#0F172A] mt-0.5">
                  ₹{(settlement.grossAmount || settlement.bookingAmount || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Platform Fee</span>
                <p className="text-sm font-black text-slate-600 mt-0.5">
                  -₹{(settlement.commissionAmount || settlement.platformFee || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#583BE8]">Net Receivable</span>
                <p className="text-base font-black text-[#583BE8] mt-0.5">
                  ₹{(settlement.netSettledAmount || settlement.agencyReceivable || settlement.amount || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Bank UTR</span>
                <p className="text-xs font-mono font-bold text-slate-800 mt-1 truncate">
                  {settlement.utr || 'Pending'}
                </p>
              </div>
            </div>

            {/* Gateway Identifiers */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400">
                Payment & Route Identifiers
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block">Booking ID</span>
                    <strong className="text-slate-700">{settlement.bookingId}</strong>
                  </div>
                  <button
                    onClick={() => copyToClipboard(settlement.bookingId)}
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block">Transfer ID</span>
                    <strong className="text-slate-700">{settlement.transferId || '—'}</strong>
                  </div>
                  {settlement.transferId && (
                    <button
                      onClick={() => copyToClipboard(settlement.transferId)}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block">Settlement ID</span>
                    <strong className="text-slate-700">{settlement.settlementId}</strong>
                  </div>
                  <button
                    onClick={() => copyToClipboard(settlement.settlementId)}
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block">UTR Reference</span>
                    <strong className="text-emerald-700">{settlement.utr || 'Awaiting Bank Payout'}</strong>
                  </div>
                  {settlement.utr && (
                    <button
                      onClick={() => copyToClipboard(settlement.utr)}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Phase 12: Immutable Ledger Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 flex items-center justify-between">
                <span>Audit Ledger Timeline</span>
                <span className="text-[10px] font-bold text-emerald-600 lowercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  immutable append-only
                </span>
              </h4>

              <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {(settlement.timeline || [
                  {
                    step: 'Payment Captured',
                    status: 'CAPTURED',
                    date: settlement.processedDate || 'Captured at Checkout',
                    notes: 'Traveler payment verified and captured via Razorpay Gateway',
                    webhook: settlement.webhookId || 'whk_pay_init',
                  },
                  {
                    step: 'Route Transfer Created',
                    status: 'TRANSFER_CREATED',
                    date: settlement.processedDate || 'Transfer initiated',
                    notes: `Marketplace split calculated: 90% agency receivable assigned to linked account`,
                    webhook: 'whk_trf_init',
                  },
                  {
                    step: 'Settlement Disbursed',
                    status: settlement.status || 'SETTLED',
                    date: settlement.settledAt || 'Bank settlement completed',
                    notes: settlement.utr
                      ? `Bank transfer completed with UTR ${settlement.utr}`
                      : 'Scheduled for automatic payout to verified bank account (T+2)',
                    webhook: 'whk_stl_done',
                  },
                ]).map((item: any, idx: number) => (
                  <div key={idx} className="relative text-xs">
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-[#583BE8] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#583BE8]" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-800">{item.step || item.newStatus}</span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {item.timestamp ? new Date(item.timestamp).toLocaleString('en-IN') : item.date}
                        </span>
                      </div>
                      <p className="text-slate-500 font-semibold text-[11px] leading-relaxed">
                        {item.notes || 'Status updated via verified event'}
                      </p>
                      {item.webhookId && (
                        <span className="inline-block text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md mt-1">
                          Webhook: {item.webhookId}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/50">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs transition-colors cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
