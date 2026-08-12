import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, XCircle, FileText } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  type: 'approve' | 'reject' | 'request_docs';
  agencyName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  type,
  agencyName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case 'approve':
        return {
          title: 'Approve Agency Registration?',
          desc: `Are you sure you want to approve "${agencyName}"? They will gain immediate access to the Agency Portal and can start publishing packages.`,
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
          btnText: 'Approve Agency',
          btnStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
        };
      case 'reject':
        return {
          title: 'Reject Agency Registration?',
          desc: `Are you sure you want to reject the application for "${agencyName}"? An notification email will be sent to the agency owner.`,
          icon: <XCircle className="w-6 h-6 text-rose-600" />,
          btnText: 'Reject Agency',
          btnStyle: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20',
        };
      case 'request_docs':
      default:
        return {
          title: 'Request Missing Documents?',
          desc: `Send a document update request to "${agencyName}". The agency will be notified to re-upload missing credentials.`,
          icon: <FileText className="w-6 h-6 text-amber-600" />,
          btnText: 'Request Documents',
          btnStyle: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20',
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          onClick={onCancel}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl z-50 border border-slate-100 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
              {content.icon}
            </div>
            <div>
              <h3 className="text-base font-black text-[#0F172A] leading-tight">
                {content.title}
              </h3>
              <p className="text-xs font-bold text-slate-400 leading-tight mt-0.5">
                Action confirmation required
              </p>
            </div>
          </div>

          <p className="text-xs font-semibold text-slate-600 leading-relaxed">
            {content.desc}
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-5 py-2 rounded-xl text-xs font-extrabold shadow-md transition-all cursor-pointer ${content.btnStyle}`}
            >
              {content.btnText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
