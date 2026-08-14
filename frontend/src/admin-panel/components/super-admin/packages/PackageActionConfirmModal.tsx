import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Star,
  EyeOff,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { AdminPackageItem } from '../../../types/packageManagement';

interface PackageActionConfirmModalProps {
  isOpen: boolean;
  type: 'approve' | 'feature' | 'hide' | 'delete' | 'bulk_approve' | 'bulk_feature' | 'bulk_hide' | 'bulk_delete';
  pkg?: AdminPackageItem | null;
  selectedCount?: number;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PackageActionConfirmModal: React.FC<PackageActionConfirmModalProps> = ({
  isOpen,
  type,
  pkg,
  selectedCount = 0,
  isProcessing = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case 'approve':
        return {
          title: `Approve ${pkg?.title}?`,
          desc: `Approve and activate "${pkg?.title}". The package will be immediately discoverable for travelers on the marketplace.`,
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
          btnText: 'Approve Package',
          btnStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
        };
      case 'feature':
        return {
          title: `${pkg?.isFeatured ? 'Unfeature' : 'Feature'} ${pkg?.title}?`,
          desc: pkg?.isFeatured
            ? `Remove "${pkg?.title}" from featured carousel and highlight slots.`
            : `Promote "${pkg?.title}" to the homepage hero and featured collections.`,
          icon: <Star className="w-6 h-6 text-[#6356E5]" />,
          btnText: pkg?.isFeatured ? 'Unfeature' : 'Feature Package',
          btnStyle: 'bg-[#6356E5] hover:bg-[#5244e0] text-white shadow-[#6356E5]/20',
        };
      case 'hide':
        return {
          title: `${pkg?.status === 'Hidden' ? 'Unhide' : 'Hide'} ${pkg?.title}?`,
          desc: pkg?.status === 'Hidden'
            ? `Unhide and restore "${pkg?.title}" to public catalog.`
            : `Hide "${pkg?.title}" from public search results and marketplace view.`,
          icon: <EyeOff className="w-6 h-6 text-amber-600" />,
          btnText: pkg?.status === 'Hidden' ? 'Unhide Package' : 'Hide Package',
          btnStyle: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20',
        };
      case 'delete':
        return {
          title: `Delete ${pkg?.title}?`,
          desc: `Are you sure you want to permanently delete "${pkg?.title}"? This cannot be undone.`,
          icon: <Trash2 className="w-6 h-6 text-rose-600" />,
          btnText: 'Delete Package',
          btnStyle: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20',
        };
      case 'bulk_approve':
        return {
          title: `Approve ${selectedCount} Selected Packages?`,
          desc: `This will approve and activate all ${selectedCount} selected travel packages.`,
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
          btnText: 'Approve All Selected',
          btnStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
        };
      case 'bulk_feature':
        return {
          title: `Feature ${selectedCount} Selected Packages?`,
          desc: `This will mark all ${selectedCount} selected packages as featured on the platform.`,
          icon: <Star className="w-6 h-6 text-[#6356E5]" />,
          btnText: 'Feature All Selected',
          btnStyle: 'bg-[#6356E5] hover:bg-[#5244e0] text-white shadow-[#6356E5]/20',
        };
      case 'bulk_hide':
        return {
          title: `Hide ${selectedCount} Selected Packages?`,
          desc: `This will hide all ${selectedCount} selected packages from the public catalog.`,
          icon: <EyeOff className="w-6 h-6 text-amber-600" />,
          btnText: 'Hide All Selected',
          btnStyle: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20',
        };
      case 'bulk_delete':
      default:
        return {
          title: `Delete ${selectedCount} Selected Packages?`,
          desc: `Are you sure you want to permanently delete ${selectedCount} packages? This cannot be undone.`,
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
