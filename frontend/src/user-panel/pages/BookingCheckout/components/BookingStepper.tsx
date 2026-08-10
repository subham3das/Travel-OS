import React from 'react';
import { Check } from 'lucide-react';
import { StepCompletionStatus } from '../types/checkout';

interface BookingStepperProps {
  stepCompletion: StepCompletionStatus;
  activeSection: 'traveler' | 'review' | 'payment';
  onStepClick: (sectionId: 'section-traveler' | 'section-review' | 'section-payment') => void;
}

export const BookingStepper: React.FC<BookingStepperProps> = ({
  stepCompletion,
  activeSection,
  onStepClick,
}) => {
  const steps = [
    {
      id: 'section-traveler' as const,
      sectionKey: 'traveler' as const,
      number: 1,
      label: 'Traveler Details',
      isCompleted: stepCompletion.travelerDetails,
    },
    {
      id: 'section-review' as const,
      sectionKey: 'review' as const,
      number: 2,
      label: 'Review Booking',
      isCompleted: stepCompletion.review,
    },
    {
      id: 'section-payment' as const,
      sectionKey: 'payment' as const,
      number: 3,
      label: 'Payment',
      isCompleted: false, // Payment is the final section
    },
  ];

  // Compute active index for progress bar fill
  const getProgressWidth = () => {
    if (stepCompletion.review) return '100%';
    if (stepCompletion.travelerDetails) return '50%';
    return '0%';
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-100/90 py-3.5 px-4 sm:px-6 shadow-2xs select-none sticky top-[57px] z-30">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-center justify-between px-3">
          {/* Background Connecting Line */}
          <div className="absolute top-3.5 left-[15%] right-[15%] h-0.5 bg-slate-200 z-0" />
          
          {/* Active Progress Line */}
          <div
            className="absolute top-3.5 left-[15%] h-0.5 bg-[#583BE8] transition-all duration-500 z-0"
            style={{ width: getProgressWidth() }}
          />

          {steps.map((st) => {
            const isCompleted = st.isCompleted;
            const isActive = activeSection === st.sectionKey;

            return (
              <button
                key={st.number}
                type="button"
                onClick={() => onStepClick(st.id)}
                className="relative z-10 flex flex-col items-center gap-1.5 focus:outline-none group cursor-pointer"
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#583BE8] text-white shadow-xs group-hover:scale-105'
                      : isActive
                      ? 'bg-[#583BE8] text-white ring-4 ring-[#583BE8]/20 shadow-md group-hover:scale-105'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 group-hover:bg-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : st.number}
                </div>

                <span
                  className={`text-[11px] sm:text-xs font-extrabold text-center leading-tight transition-colors ${
                    isActive
                      ? 'text-[#583BE8]'
                      : isCompleted
                      ? 'text-[#0F172A]'
                      : 'text-slate-400'
                  }`}
                >
                  {st.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookingStepper;
