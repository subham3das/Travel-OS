import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckSquare, Square, X } from 'lucide-react';
import { CarRentalApprovalItem } from '../../../types/carRentalApproval';

interface CarRentalRequestChangesModalProps {
  isOpen: boolean;
  request: CarRentalApprovalItem | null;
  isProcessing: boolean;
  onClose: () => void;
  onSubmit: (issues: string[], message?: string) => void;
}

const COMMON_ISSUES = [
  'Commercial Vehicle RC Expired or Unclear',
  'Comprehensive Fleet Insurance Missing or Expired',
  'Driver Chauffeur License Copy Blurred or Expired',
  'Commercial Passenger Tourist Permit Missing',
  'Vehicle Fitness Certificate Expired',
  'Pollution Under Control (PUC) Certificate Missing',
  'Bank Settlement Account Details or IFSC Incorrect',
  'GST / PAN Verification Document Mismatch',
];

export const CarRentalRequestChangesModal: React.FC<CarRentalRequestChangesModalProps> = ({
  isOpen,
  request,
  isProcessing,
  onClose,
  onSubmit,
}) => {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState('');

  if (!isOpen || !request) return null;

  const toggleIssue = (issue: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
  };

  const handleSubmit = () => {
    if (selectedIssues.length === 0) return;
    onSubmit(selectedIssues, customMessage.trim());
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative z-10 border border-slate-100"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400 flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h3 className="text-base font-black text-[#0F172A] tracking-tight">
              Request Changes from {request.businessName}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Select specific compliance or document issues. The provider will be notified to revise and resubmit their application.
            </p>
          </div>

          {/* Checklist of Common Issues */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Flag Specific Issues ({selectedIssues.length} selected)
            </span>
            {COMMON_ISSUES.map((issue) => {
              const isSelected = selectedIssues.includes(issue);
              return (
                <div
                  key={issue}
                  onClick={() => toggleIssue(issue)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-50/60 border-amber-300 text-amber-900'
                      : 'bg-slate-50/70 border-slate-200/70 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className="truncate">{issue}</span>
                </div>
              );
            })}
          </div>

          {/* Custom Message / Instructions */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 block">
              Additional Instructions for Applicant
            </label>
            <textarea
              rows={3}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="e.g. Please ensure all 4 corners of the vehicle commercial permit are clearly visible..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-amber-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isProcessing || selectedIssues.length === 0}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? 'Dispatching...' : 'Send Request to Partner'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
