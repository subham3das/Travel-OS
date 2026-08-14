import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Trash2,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';
import { TravelerUser } from '../../../types/userManagement';

interface UserActionConfirmModalProps {
  isOpen: boolean;
  type: 'verify' | 'suspend' | 'activate' | 'delete' | 'reset_password' | 'bulk_verify' | 'bulk_suspend' | 'bulk_activate' | 'bulk_delete';
  user?: TravelerUser | null;
  selectedCount?: number;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const UserActionConfirmModal: React.FC<UserActionConfirmModalProps> = ({
  isOpen,
  type,
  user,
  selectedCount = 0,
  isProcessing = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case 'verify':
        return {
          title: `Verify ${user?.name}?`,
          desc: `Mark ${user?.name} as verified. The traveler will receive a verified badge and full access to all travel bookings.`,
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
          btnText: 'Verify User',
          btnStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
        };
      case 'suspend':
        return {
          title: `Suspend ${user?.name}?`,
          desc: `Suspend account for ${user?.name}. The user will be unable to log in or book packages until reactivated.`,
          icon: <PauseCircle className="w-6 h-6 text-amber-600" />,
          btnText: 'Suspend User',
          btnStyle: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20',
        };
      case 'activate':
        return {
          title: `Activate ${user?.name}?`,
          desc: `Reactivate account for ${user?.name}. The user will regain normal access to the platform immediately.`,
          icon: <PlayCircle className="w-6 h-6 text-emerald-600" />,
          btnText: 'Activate User',
          btnStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
        };
      case 'delete':
        return {
          title: `Delete ${user?.name}?`,
          desc: `Are you sure you want to permanently delete ${user?.name}? This action cannot be undone and all associated records will be archived.`,
          icon: <Trash2 className="w-6 h-6 text-rose-600" />,
          btnText: 'Delete User',
          btnStyle: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20',
        };
      case 'reset_password':
        return {
          title: `Reset Password for ${user?.name}?`,
          desc: `Send a secure password reset link to ${user?.email}. The link will expire in 24 hours.`,
          icon: <KeyRound className="w-6 h-6 text-[#6356E5]" />,
          btnText: 'Send Reset Link',
          btnStyle: 'bg-[#6356E5] hover:bg-[#5244e0] text-white shadow-[#6356E5]/20',
        };
      case 'bulk_verify':
        return {
          title: `Verify ${selectedCount} Selected Users?`,
          desc: `This will mark all ${selectedCount} selected travelers as verified.`,
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
          btnText: 'Verify All Selected',
          btnStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
        };
      case 'bulk_suspend':
        return {
          title: `Suspend ${selectedCount} Selected Users?`,
          desc: `This will suspend account access for all ${selectedCount} selected travelers.`,
          icon: <PauseCircle className="w-6 h-6 text-amber-600" />,
          btnText: 'Suspend All Selected',
          btnStyle: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20',
        };
      case 'bulk_activate':
        return {
          title: `Activate ${selectedCount} Selected Users?`,
          desc: `This will reactivate account access for all ${selectedCount} selected travelers.`,
          icon: <PlayCircle className="w-6 h-6 text-emerald-600" />,
          btnText: 'Activate All Selected',
          btnStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
        };
      case 'bulk_delete':
      default:
        return {
          title: `Delete ${selectedCount} Selected Users?`,
          desc: `Are you sure you want to permanently delete ${selectedCount} users? This action cannot be undone.`,
          icon: <Trash2 className="w-6 h-6 text-rose-600" />,
          btnText: 'Delete Selected',
          btnStyle: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20',
        };
    }
  };

  const content = getContent();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
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
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-4 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto shadow-2xs">
            {content.icon}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-black text-[#0F172A] tracking-tight">
              {content.title}
            </h3>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed px-2">
              {content.desc}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-3 border-t border-slate-100">
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className={`px-5 py-2 rounded-xl text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 ${content.btnStyle}`}
            >
              {isProcessing && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{isProcessing ? 'Processing...' : content.btnText}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
