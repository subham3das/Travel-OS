import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
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
      isCompleted: stepCompletion.travelerDetails && activeSection !== 'traveler',
    },
    {
      id: 'section-review' as const,
      sectionKey: 'review' as const,
      number: 2,
      label: 'Review Booking',
      isCompleted: stepCompletion.review && activeSection !== 'review',
    },
    {
      id: 'section-payment' as const,
      sectionKey: 'payment' as const,
      number: 3,
      label: 'Payment',
      isCompleted: false,
    },
  ];

  // Compute completed progress percentage along the connector track (0% -> 50% -> 100%)
  const getProgressWidth = () => {
    if (activeSection === 'payment' || stepCompletion.review) return 100;
    if (activeSection === 'review' || stepCompletion.travelerDetails) return 50;
    return 0;
  };

  const progressWidth = getProgressWidth();

  return (
    <nav
      aria-label="Booking Progress"
      className="w-full bg-white/95 backdrop-blur-md border-b border-slate-100/90 py-3 sm:py-4 px-2 sm:px-6 shadow-2xs select-none sticky top-[57px] z-30"
    >
      <div className="max-w-2xl mx-auto">
        <div className="relative flex items-center justify-between">
          {/* Connector Track: Positioned exactly from center of step 1 to center of step 3 */}
          <div
            className="absolute top-[17px] sm:top-[20px] -translate-y-1/2 left-[calc(100%/6)] right-[calc(100%/6)] h-[2px] bg-slate-200 z-[1] overflow-hidden"
            aria-hidden="true"
          >
            {/* Animated Completed Portion */}
            <motion.div
              className="h-full bg-[#583BE8]"
              initial={false}
              animate={{ width: `${progressWidth}%` }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
          </div>

          {/* Stepper Columns */}
          {steps.map((st) => {
            const isCompleted = st.isCompleted;
            const isCurrent = activeSection === st.sectionKey;
            const isUpcoming = !isCompleted && !isCurrent;

            return (
              <button
                key={st.number}
                type="button"
                onClick={() => onStepClick(st.id)}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={isCompleted ? `Completed: ${st.label}` : isCurrent ? `Current: ${st.label}` : st.label}
                className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 group cursor-pointer focus:outline-none relative z-[2] px-1"
              >
                {/* Step Circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className={`w-[34px] h-[34px] sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors duration-250 ease-out shrink-0 ${
                    isCompleted
                      ? 'bg-[#583BE8] text-white border-2 border-[#583BE8] shadow-xs'
                      : isCurrent
                      ? 'bg-white text-[#583BE8] border-2 border-[#583BE8] shadow-sm'
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <motion.div
                      key="check"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
                    </motion.div>
                  ) : (
                    <span
                      className={`text-xs sm:text-sm font-semibold transition-colors duration-250 ease-out ${
                        isCurrent ? 'text-[#583BE8]' : 'text-slate-400'
                      }`}
                    >
                      {st.number}
                    </span>
                  )}
                </motion.div>

                {/* Step Label */}
                <span
                  className={`text-xs sm:text-sm font-semibold text-center leading-tight max-w-[85px] sm:max-w-[130px] break-words transition-colors duration-250 ease-out ${
                    isCompleted
                      ? 'text-[#583BE8]'
                      : isCurrent
                      ? 'text-slate-900'
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
    </nav>
  );
};

export default BookingStepper;
