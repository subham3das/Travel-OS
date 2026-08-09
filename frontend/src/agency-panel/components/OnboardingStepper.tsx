import React from 'react';

export interface StepperStep {
  id: number;
  label: string;
}

export const ONBOARDING_STEPS: StepperStep[] = [
  { id: 1, label: 'Business Information' },
  { id: 2, label: 'Agency Profile' },
  { id: 3, label: 'Verification Documents' },
  { id: 4, label: 'Bank & Payments' },
  { id: 5, label: 'Review & Submit' },
];

interface OnboardingStepperProps {
  currentStep: number; // 1-indexed
  steps?: StepperStep[];
}

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({
  currentStep = 1,
  steps = ONBOARDING_STEPS,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto py-2 px-2">
      <div className="relative flex items-center justify-between">
        {/* Connecting Lines Layer */}
        <div className="absolute top-[9px] left-3 right-3 h-[2px] bg-slate-200 -z-0">
          <div
            className="h-full bg-[#583BE8] transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Step Nodes */}
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center flex-1">
              {/* Circle Node */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 bg-white ${
                  isActive
                    ? 'border-2 border-[#583BE8] shadow-sm'
                    : isCompleted
                    ? 'border-2 border-[#583BE8]'
                    : 'border-2 border-slate-300'
                }`}
              >
                {isActive && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#583BE8]" />
                )}
                {isCompleted && (
                  <div className="w-full h-full rounded-full bg-[#583BE8] flex items-center justify-center text-white">
                    <svg className="w-3 h-3 text-white stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] sm:text-[11px] font-semibold text-center mt-2 leading-tight max-w-[64px] sm:max-w-[76px] transition-colors ${
                  isActive
                    ? 'text-[#583BE8] font-bold'
                    : isCompleted
                    ? 'text-slate-700'
                    : 'text-slate-400 font-normal'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingStepper;
