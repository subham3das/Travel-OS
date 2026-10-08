import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  FileUp,
  PlayCircle,
  Loader2,
} from 'lucide-react';

export type KycConfirmActionType = 'revoke' | 'renew' | 'unsuspend' | 'reupload';

interface KycActionConfirmModalProps {
  isOpen: boolean;
  actionType: KycConfirmActionType | null;
  onClose: () => void;
  onConfirm: (reason?: string) => Promise<void>;
  userName?: string;
  isProcessing?: boolean;
}

export const KycActionConfirmModal: React.FC<KycActionConfirmModalProps> = ({
  isOpen,
  actionType,
  onClose,
  onConfirm,
  userName = 'Traveler',
  isProcessing = false,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !actionType) return null;

  const requiresReason = actionType === 'revoke' || actionType === 'reupload';

  const getActionConfig = () => {
    switch (actionType) {
      case 'revoke':
        return {
          title: 'Revoke KYC Verification',
          icon: <RotateCcw className="w-5 h-5 text-rose-600" />,
          iconBg: 'bg-rose-100',
          confirmBtnText: 'Revoke Verification',
          confirmBtnClass: 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20',
          description: `Are you sure you want to revoke the verified status of ${userName}? Their account will return to pending review.`,
          reasonLabel: 'Revocation Reason',
          reasonPlaceholder: 'Explain why verification is being revoked...',
        };
      case 'reupload':
        return {
          title: 'Request Document Re-upload',
          icon: <FileUp className="w-5 h-5 text-[#6356E5]" />,
          iconBg: 'bg-purple-100',
          confirmBtnText: 'Send Request',
          confirmBtnClass: 'bg-[#6356E5] hover:bg-[#5244e0] shadow-[#6356E5]/25',
          description: `Request ${userName} to re-upload clear identity documents.`,
          reasonLabel: 'Instructions for Traveler',
          reasonPlaceholder: 'Specify which document needs re-upload and why (e.g. Back side of Aadhaar missing)...',
        };
      case 'renew':
        return {
          title: 'Renew KYC Verification',
          icon: <RefreshCw className="w-5 h-5 text-emerald-600" />,
          iconBg: 'bg-emerald-100',
          confirmBtnText: 'Renew Verification',
          confirmBtnClass: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20',
          description: `Confirm renewal of KYC validity period for ${userName}.`,
          reasonLabel: 'Renewal Note (Optional)',
          reasonPlaceholder: 'Optional renewal remarks...',
        };
      case 'unsuspend':
        return {
          title: 'Unsuspend KYC Status',
          icon: <PlayCircle className="w-5 h-5 text-emerald-600" />,
          iconBg: 'bg-emerald-100',
          confirmBtnText: 'Unsuspend Account',
          confirmBtnClass: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20',
          description: `Unsuspend KYC status for ${userName} and restore compliance privileges.`,
          reasonLabel: 'Unsuspension Note (Optional)',
          reasonPlaceholder: 'Optional remarks...',
        };
    }
  };

  const config = getActionConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requiresReason && !reason.trim()) {
      setError('Please provide a reason to continue.');
      return;
    }
    setError('');
    await onConfirm(reason.trim());
    setReason('');
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
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-2xl ${config.iconBg} flex items-center justify-center shrink-0 shadow-2xs`}
              >
                {config.icon}
              </div>
              <div>
                <h3 className="text-sm font-black text-[#0F172A]">
                  {config.title}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {config.description}
            </p>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Input field if required or optional */}
            <div className="space-y-1">
              <label className="block text-[11px] font-black text-slate-700">
                {config.reasonLabel} {requiresReason && <span className="text-rose-500">*</span>}
              </label>
              <textarea
                rows={3}
                required={requiresReason}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                placeholder={config.reasonPlaceholder}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#6356E5] transition-colors resize-none"
              />
            </div>

            {/* Buttons */}
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
                disabled={isProcessing}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white shadow-md transition-all cursor-pointer disabled:opacity-50 ${config.confirmBtnClass}`}
              >
                {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{config.confirmBtnText}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
