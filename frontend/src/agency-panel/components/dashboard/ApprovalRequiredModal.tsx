import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ShieldCheck, Lock, CheckCircle2, X, ExternalLink, HelpCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ApprovalRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId?: string;
  businessName?: string;
}

export const ApprovalRequiredModal: React.FC<ApprovalRequiredModalProps> = ({
  isOpen,
  onClose,
  applicationId = 'AGY-REQ-2026',
  businessName,
}) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 select-none"
          >
            {/* Top Accent Gradient */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-[#583BE8] to-indigo-600" />

            <div className="p-6 sm:p-7 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#583BE8] shrink-0">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                        Review in Progress
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 font-semibold">
                        Ref: {applicationId}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-[#0F172A] mt-0.5">
                      Application Under Review
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Expected Time Callout Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#583BE8] shrink-0" />
                <div className="text-xs">
                  <p className="font-extrabold text-[#0F172A]">
                    Expected Review Time: 24–48 Hours
                  </p>
                  <p className="text-slate-500 font-medium">
                    Our compliance team is verifying KYC documents and business registration.
                  </p>
                </div>
              </div>

              {/* What is Accessible vs Locked */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Accessible */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-black">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Accessible Now</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-600 font-medium">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Dashboard Overview</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Business Profile & KYC</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Notifications & Alerts</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Partner Support & FAQ</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Invoice & Receipts</span>
                    </li>
                  </ul>
                </div>

                {/* Locked */}
                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-900 font-black">
                    <Lock className="w-4 h-4 text-amber-600" />
                    <span>Locked Until Approval</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-600 font-medium">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>Packages & Inventory</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>Booking Confirmations</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>Customer Communication</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>Fleet & Vehicle Dispatch</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>Finance, Payouts & Stats</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/agency/profile');
                  }}
                  className="w-full sm:w-auto flex-1 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Application Profile</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto flex-1 px-4 py-3 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] text-white font-extrabold text-xs shadow-md shadow-[#583BE8]/25 transition-all cursor-pointer"
                >
                  I Understand
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
