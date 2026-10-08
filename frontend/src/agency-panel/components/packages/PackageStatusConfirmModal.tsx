import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  Archive,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Edit,
  Building2,
} from 'lucide-react';
import { AgencyPackage } from '../../data/packages';

export type PackageConfirmActionType = 'activate' | 'deactivate' | 'archive' | 'delete';

interface PackageStatusConfirmModalProps {
  isOpen: boolean;
  actionType: PackageConfirmActionType | null;
  pkg: AgencyPackage | null;
  isLoading: boolean;
  errorMessage?: string | null;
  onConfirm: () => void;
  onClose: () => void;
  onScheduleDeparture?: (pkgId: string, autoActivate?: boolean) => void;
  onEditPackage?: (pkgId: string) => void;
}

export const PackageStatusConfirmModal: React.FC<PackageStatusConfirmModalProps> = ({
  isOpen,
  actionType,
  pkg,
  isLoading,
  errorMessage,
  onConfirm,
  onClose,
  onScheduleDeparture,
  onEditPackage,
}) => {
  if (!isOpen || !pkg || !actionType) return null;

  // Parse error message into bullet points if it mentions missing required fields
  const missingFieldsList: string[] = [];
  if (errorMessage && errorMessage.includes('Missing required fields:')) {
    const rawList = errorMessage.split('Missing required fields:')[1];
    if (rawList) {
      rawList.split(',').forEach((f) => {
        const trimmed = f.trim();
        if (trimmed) missingFieldsList.push(trimmed);
      });
    }
  }

  const getModalConfig = () => {
    switch (actionType) {
      case 'activate':
        return {
          title: 'Activate Package',
          icon: <PlayCircle className="w-6 h-6 text-emerald-600" />,
          iconBg: 'bg-emerald-100 text-emerald-600',
          confirmText: 'Activate Package',
          confirmBtnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
          description: `Are you sure you want to activate "${pkg.packageName}"? This package will become visible to all travelers on Search, Explore, and homepage rankings.`,
        };
      case 'deactivate':
        return {
          title: 'Deactivate Package',
          icon: <PauseCircle className="w-6 h-6 text-amber-600" />,
          iconBg: 'bg-amber-100 text-amber-600',
          confirmText: 'Deactivate Package',
          confirmBtnClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
          description: `Are you sure you want to deactivate "${pkg.packageName}"?`,
          details: [
            'Removes package from traveler search and Explore',
            'Removes package from Homepage rankings and recommendations',
            'Existing bookings, departures, and history remain completely intact',
            'No data will be deleted',
          ],
        };
      case 'archive':
        return {
          title: 'Archive Package',
          icon: <Archive className="w-6 h-6 text-slate-700" />,
          iconBg: 'bg-slate-100 text-slate-700',
          confirmText: 'Archive Package',
          confirmBtnClass: 'bg-slate-800 hover:bg-slate-900 text-white shadow-slate-800/20',
          description: `Are you sure you want to archive "${pkg.packageName}"? It will be moved to archived inventory.`,
        };
      case 'delete':
        return {
          title: 'Delete Package',
          icon: <Trash2 className="w-6 h-6 text-rose-600" />,
          iconBg: 'bg-rose-100 text-rose-600',
          confirmText: 'Delete Permanently',
          confirmBtnClass: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
          description: `Are you sure you want to permanently delete "${pkg.packageName}"? This action cannot be undone.`,
        };
    }
  };

  const config = getModalConfig();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 pb-0 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${config.iconBg}`}>
                {config.icon}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] leading-tight">
                  {config.title}
                </h3>
                <p className="text-xs font-semibold text-slate-400 truncate max-w-[240px]">
                  {pkg.packageName} ({pkg.packageId})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* If there's an activation validation error */}
            {errorMessage ? (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>Activation Requirements Incomplete</span>
                </div>
                <p className="text-xs font-semibold text-rose-600">
                  This package cannot be activated until the following requirements are met:
                </p>

                {missingFieldsList.length > 0 ? (
                  <ul className="space-y-1.5 pt-1">
                    {missingFieldsList.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs font-bold text-rose-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs font-bold text-rose-700">{errorMessage}</p>
                )}

                {/* Helpful Quick Fix Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {errorMessage.toLowerCase().includes('payout') && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        window.location.href = '/agency/settings/payment';
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#583BE8] hover:bg-[#472ec4] text-white text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Complete Payout Setup</span>
                    </button>
                  )}
                  {missingFieldsList.some((f) => f.toLowerCase().includes('departure')) && onScheduleDeparture && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onScheduleDeparture(pkg.id, true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Schedule Departure &amp; Activate</span>
                    </button>
                  )}
                  {onEditPackage && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEditPackage(pkg.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Package</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                  {config.description}
                </p>

                {/* Specific bullets for deactivation */}
                {config.details && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                    <p className="text-[11px] font-black uppercase text-amber-800 tracking-wider">
                      Deactivation Impact
                    </p>
                    <ul className="space-y-1.5">
                      {config.details.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-amber-900">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            {!errorMessage && (
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-5 py-2.5 rounded-2xl font-black text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${config.confirmBtnClass}`}
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{config.confirmText}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PackageStatusConfirmModal;
