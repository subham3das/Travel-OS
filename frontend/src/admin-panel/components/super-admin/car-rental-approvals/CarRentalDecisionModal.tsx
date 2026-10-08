import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, XCircle, Clock, ShieldAlert, X } from 'lucide-react';

interface CarRentalDecisionModalProps {
  isOpen: boolean;
  type: 'approve' | 'reject' | 'suspend' | 'reopen';
  businessName: string;
  isProcessing: boolean;
  onConfirm: (reason?: string, notes?: string) => void;
  onCancel: () => void;
}

export const CarRentalDecisionModal: React.FC<CarRentalDecisionModalProps> = ({
  isOpen,
  type,
  businessName,
  isProcessing,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const isReject = type === 'reject';
  const isSuspend = type === 'suspend';
  const isApprove = type === 'approve';
  const isReopen = type === 'reopen';

  const title = isApprove
    ? 'Approve Car Rental Business'
    : isReject
    ? 'Reject Car Rental Application'
    : isSuspend
    ? 'Suspend Car Rental Operations'
    : 'Reopen Application Review';

  const description = isApprove
    ? `Are you sure you want to approve "${businessName}"? This will unlock fleet operations, reservation acceptance, and chauffeur dispatch for this partner.`
    : isReject
    ? `Rejecting "${businessName}" will notify the applicant with your provided reason. A reason is mandatory.`
    : isSuspend
    ? `Suspending "${businessName}" will prevent new vehicle bookings and mark their fleet inactive.`
    : `Moving "${businessName}" back to active review queue will clear previous rejection/change statuses.`;

  const handleConfirmClick = () => {
    if ((isReject || isSuspend) && !reason.trim()) {
      return;
    }
    onConfirm(reason.trim(), notes.trim());
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative z-10 border border-slate-100"
        >
          <div className="flex items-center justify-between">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                isApprove
                  ? 'bg-emerald-50 text-emerald-600'
                  : isReject || isSuspend
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-blue-50 text-blue-600'
              }`}
            >
              {isApprove && <CheckCircle2 className="w-6 h-6" />}
              {isReject && <XCircle className="w-6 h-6" />}
              {isSuspend && <ShieldAlert className="w-6 h-6" />}
              {isReopen && <Clock className="w-6 h-6" />}
            </div>

            <button
              onClick={onCancel}
              className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400 flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h3 className="text-base font-black text-[#0F172A] tracking-tight">{title}</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">{description}</p>
          </div>

          {/* Mandatory Reason for Reject or Suspend */}
          {(isReject || isSuspend) && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 block">
                Reason Required <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  isReject
                    ? 'e.g. Commercial RC expired or vehicle fitness certificate missing.'
                    : 'e.g. Policy violation or licensing dispute.'
                }
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-rose-500 focus:bg-white transition-all resize-none"
              />
            </div>
          )}

          {/* Optional Admin Notes for Approve */}
          {isApprove && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 block">
                Optional Approval Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional internal remarks..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all resize-none"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmClick}
              disabled={isProcessing || ((isReject || isSuspend) && !reason.trim())}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold text-white transition-all cursor-pointer disabled:opacity-50 ${
                isApprove
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25'
                  : isReject || isSuspend
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/25'
                  : 'bg-[#6356E5] hover:bg-[#5244e0] shadow-md shadow-[#6356E5]/25'
              }`}
            >
              {isProcessing ? 'Processing...' : isApprove ? 'Confirm Approval' : isReject ? 'Confirm Rejection' : 'Confirm Action'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
