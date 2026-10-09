import React, { useState } from 'react';
import { ArrowLeft, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { WIZARD_STEPS } from '../../types/packageWizard';
import { usePackageWizard } from '../../context/PackageWizardContext';

interface WizardHeaderProps {
  currentStep: number;
  onPrevStep?: () => void;
  onDiscard?: () => void;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({
  currentStep,
  onPrevStep,
  onDiscard,
}) => {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { draft, autosaveStatus } = usePackageWizard();

  const stepMeta = WIZARD_STEPS.find((s) => s.step === currentStep) || WIZARD_STEPS[0];
  const isPublishedEdit = draft?.status === 'PUBLISHED';
  const isDraftEdit = Boolean(draft?.packageId && !isPublishedEdit);

  const handleBackClick = () => {
    if (currentStep > 1 && onPrevStep) {
      onPrevStep();
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleCloseClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmLeave = () => {
    if (onDiscard) {
      onDiscard();
    }
    setShowConfirmModal(false);
    navigate('/agency/packages');
  };

  return (
    <>
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBackClick}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-[#0F172A]">
                {isPublishedEdit ? 'Edit Published Package' : isDraftEdit ? 'Edit Package Draft' : 'Create Package'}
              </h2>
              {autosaveStatus === 'saving' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
                  <Loader2 className="w-2.5 h-2.5 animate-spin" /> Saving...
                </span>
              )}
              {autosaveStatus === 'saved' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Saved
                </span>
              )}
              {autosaveStatus === 'error' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-full">
                  <AlertCircle className="w-2.5 h-2.5" /> Save failed
                </span>
              )}
            </div>
            <p className="text-[11px] font-semibold text-slate-400">
              Step {currentStep} of {WIZARD_STEPS.length} • {stepMeta.title}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCloseClick}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close Wizard"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Discard Draft Modal Prompt */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="space-y-1 text-center">
                <h3 className="text-base font-extrabold text-[#0F172A]">Discard draft?</h3>
                <p className="text-xs font-semibold text-slate-500">
                  Any unsaved changes to this package will be lost.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-extrabold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLeave}
                  className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-rose-600/20"
                >
                  Leave
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WizardHeader;
