import React from 'react';
import { ArrowRight } from 'lucide-react';

interface WizardFooterProps {
  onCancel: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
}

export const WizardFooter: React.FC<WizardFooterProps> = ({
  onCancel,
  onNext,
  isNextDisabled = false,
  nextLabel = 'Next',
}) => {
  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 p-3.5 sm:px-6 shadow-2xl select-none md:ml-64">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 sm:flex-none px-6 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer min-w-[100px] text-center"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer min-w-[140px] ${
            isNextDisabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-[#583BE8] hover:bg-[#492de0] text-white shadow-md shadow-[#583BE8]/25 active:scale-95'
          }`}
        >
          <span>{nextLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default WizardFooter;
