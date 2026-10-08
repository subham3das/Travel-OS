import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  AlertCircle,
  XCircle,
  Bell,
  FileText,
  Loader2,
} from 'lucide-react';

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    reason: string;
    internalNote: string;
    sendNotification: boolean;
  }) => Promise<void>;
  userName?: string;
  isProcessing?: boolean;
}

export const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName = 'Traveler',
  isProcessing = false,
}) => {
  const [reason, setReason] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a specific rejection reason.');
      return;
    }
    setError('');
    await onConfirm({
      reason: reason.trim(),
      internalNote: internalNote.trim(),
      sendNotification,
    });
    setReason('');
    setInternalNote('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-rose-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#0F172A]">
                  Reject KYC Submission
                </h3>
                <p className="text-[11px] text-slate-500">
                  User: <span className="font-bold text-slate-800">{userName}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isProcessing}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Rejection Reason (Mandatory) */}
            <div className="space-y-1">
              <label className="block text-[11px] font-black text-slate-700">
                Rejection Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Clearly state why the submission was rejected (e.g., Aadhaar card image is blurry, name does not match profile, expired document)..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-colors resize-none"
              />
              <p className="text-[10px] text-slate-400">
                This explanation will be visible to the traveler in their account.
              </p>
            </div>

            {/* Internal Admin Note (Optional) */}
            <div className="space-y-1">
              <label className="block text-[11px] font-black text-slate-700 flex items-center gap-1">
                <FileText className="w-3 h-3 text-slate-400" />
                <span>Internal Compliance Note (Optional)</span>
              </label>
              <textarea
                rows={2}
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Private note for audit team (not shown to traveler)..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#6356E5] transition-colors resize-none"
              />
            </div>

            {/* Send Notification Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#6356E5]" />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Send notification to traveler
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Dispatches in-app alert informing user to re-upload.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={sendNotification}
                onChange={(e) => setSendNotification(e.target.checked)}
                className="w-4 h-4 accent-[#6356E5] rounded cursor-pointer"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isProcessing || !reason.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Reject KYC</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
