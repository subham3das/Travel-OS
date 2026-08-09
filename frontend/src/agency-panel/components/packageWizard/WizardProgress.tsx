import React from 'react';
import { Check } from 'lucide-react';

interface WizardProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const STEP_PERCENTAGES: Record<number, number> = {
  1: 11,
  2: 22,
  3: 33,
  4: 44,
  5: 55,
  6: 66,
  7: 77,
  8: 88,
  9: 100,
};

export const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  totalSteps = 9,
}) => {
  const percentage = STEP_PERCENTAGES[currentStep] || Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="bg-white border-b border-slate-100 px-4 py-4 sm:px-6 select-none">
      <div className="max-w-3xl mx-auto space-y-3">
        {/* Stepper bar */}
        <div className="relative flex items-center justify-between">
          {/* Connecting Track Line */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 -translate-y-1/2 bg-slate-100 -z-0" />

          {/* Active Progress Track Line */}
          <div
            className="absolute top-1/2 left-4 h-0.5 -translate-y-1/2 bg-[#583BE8] transition-all duration-300 -z-0"
            style={{
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            }}
          />

          {/* Circles */}
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div
                key={stepNum}
                className={`relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#583BE8] text-white shadow-md shadow-[#583BE8]/30 scale-110'
                    : isCompleted
                    ? 'bg-[#583BE8] text-white'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNum}
              </div>
            );
          })}
        </div>

        {/* Step details & percentage */}
        <div className="flex items-center justify-between text-xs font-extrabold">
          <span className="text-slate-400">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-[#583BE8]">{percentage}% Completed</span>
        </div>
      </div>
    </div>
  );
};

export default WizardProgress;
