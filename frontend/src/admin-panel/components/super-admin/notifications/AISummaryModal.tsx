import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, CheckCircle2, AlertTriangle, Shield, Wallet } from 'lucide-react';
import { AISummaryData } from '../../../types/advancedNotificationCenter';

interface AISummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: AISummaryData;
}

export const AISummaryModal: React.FC<AISummaryModalProps> = ({
  isOpen,
  onClose,
  summary,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-10 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center border border-purple-100 shadow-2xs">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A]">AI Operational Briefing</h3>
                <p className="text-xs text-slate-400 font-semibold">
                  Synthesized operations intelligence
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Executive Overview */}
          <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
            <h4 className="text-xs font-black text-[#6356E5]">Executive Summary</h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {summary.executiveSummary}
            </p>
          </div>

          {/* Quick Metrics Breakdown */}
          <div className="grid grid-cols-2 gap-2.5 text-xs font-bold">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Urgent Actions</span>
              </div>
              <span className="font-black text-amber-600">{summary.immediateActionCount}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Shield className="w-4 h-4 text-rose-500" />
                <span>Critical Alerts</span>
              </div>
              <span className="font-black text-rose-600">{summary.criticalAlertsCount}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>Approvals</span>
              </div>
              <span className="font-black text-blue-600">{summary.approvalsPendingCount}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Wallet className="w-4 h-4 text-emerald-500" />
                <span>Failed Payments</span>
              </div>
              <span className="font-black text-emerald-600">{summary.paymentFailuresCount}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#6356E5] text-white text-xs font-bold shadow-md shadow-[#6356E5]/20 hover:bg-[#5244e0] cursor-pointer"
            >
              Close Briefing
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
