import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Star, Send, X } from 'lucide-react';

interface CompleteTripModalProps {
  isOpen: boolean;
  packageName: string;
  travelerCount: number;
  onClose: () => void;
  onConfirmComplete: () => void;
}

export const CompleteTripModal: React.FC<CompleteTripModalProps> = ({
  isOpen,
  packageName,
  travelerCount,
  onClose,
  onConfirmComplete,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 select-none"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0F172A]">Complete Trip Operation?</h3>
                <p className="text-xs font-semibold text-slate-400">{packageName}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Details Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2 text-xs text-emerald-950 font-bold">
            <p className="flex items-center gap-1.5 text-emerald-900 font-extrabold">
              <Star className="w-4 h-4 text-emerald-600 shrink-0" />
              Final Itinerary Day Achieved!
            </p>
            <p className="font-semibold text-slate-600 leading-relaxed">
              Marking this trip as <strong className="text-emerald-700">COMPLETED</strong> will update the trip status and automatically dispatch automated review & rating requests to all{' '}
              <strong className="text-[#0F172A]">{travelerCount} enrolled travelers</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-xs font-semibold text-[#583BE8] flex items-center gap-2">
            <Send className="w-4 h-4 text-[#583BE8] shrink-0" />
            <span>Review Request & Feedback Link will be sent via SMS/Email immediately.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-extrabold transition-all cursor-pointer"
            >
              Keep Trip Active
            </button>
            <button
              type="button"
              onClick={onConfirmComplete}
              className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Complete</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CompleteTripModal;
