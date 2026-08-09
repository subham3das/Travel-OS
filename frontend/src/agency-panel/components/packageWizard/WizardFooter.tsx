import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface WizardFooterProps {
  currentStep: number;
  onPrevious: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
  previousLabel?: string;
}

export const WizardFooter: React.FC<WizardFooterProps> = ({
  currentStep,
  onPrevious,
  onNext,
  isNextDisabled = false,
  nextLabel = 'Next',
  previousLabel,
}) => {
  const prevText = previousLabel || (currentStep === 1 ? 'Cancel' : 'Previous');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 p-3.5 sm:px-6 shadow-2xl select-none md:ml-64">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrevious}
          className="flex-1 sm:flex-none px-6 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-extrabold flex items-center justify-center gap-2 transition-colors cursor-pointer min-w-[110px] text-center"
        >
          {currentStep > 1 && <ArrowLeft className="w-4 h-4" />}
          <span>{prevText}</span>
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
