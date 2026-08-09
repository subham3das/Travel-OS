import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Headphones, Check } from 'lucide-react';

interface PaymentProgressProps {
  currentStep?: number;
  stepTitle?: string;
}

export const PaymentProgress: React.FC<PaymentProgressProps> = ({
  currentStep = 3,
  stepTitle = 'Payment',
}) => {
  const navigate = useNavigate();

  const steps = [
    { number: 1, label: 'Traveler Details' },
    { number: 2, label: 'Review Booking' },
    { number: 3, label: 'Payment' },
  ];

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100/90 shadow-2xs select-none">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-3 space-y-3">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200/80 text-slate-800 flex items-center justify-center shadow-2xs hover:bg-slate-100 transition-all cursor-pointer focus:outline-none shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="text-center flex-1 px-3">
            <h1 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight leading-none">
              {currentStep === 1 ? 'Traveler Details' : currentStep === 2 ? 'Review Booking' : stepTitle}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 pt-0.5">Step {currentStep} of 3</p>
          </div>

          <button
            type="button"
            onClick={() => alert('Support team is available 24/7! Call +91 98765 43210')}
            className="flex items-center gap-1 text-xs font-extrabold text-[#0F172A] hover:text-[#583BE8] transition-colors cursor-pointer shrink-0"
          >
            <Headphones className="w-4 h-4" />
            <span>Help</span>
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="relative flex items-center justify-between px-2">
          {/* Background line */}
          <div className="absolute top-3 sm:top-3.5 left-[16%] right-[16%] h-0.5 bg-slate-200 z-0" />
          {/* Active line */}
          <div
            className="absolute top-3 sm:top-3.5 left-[16%] h-0.5 bg-[#583BE8] transition-all duration-500 z-0"
            style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '34%' : '68%' }}
          />

          {steps.map((st) => {
            const isCompleted = st.number < currentStep;
            const isActive = st.number === currentStep;

            return (
              <div key={st.number} className="relative z-10 flex flex-col items-center gap-1 w-24 sm:w-28">
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black transition-all ${
                    isCompleted
                      ? 'bg-[#583BE8] text-white shadow-xs'
                      : isActive
                      ? 'bg-[#583BE8] text-white ring-4 ring-[#583BE8]/15 shadow-md'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : st.number}
                </div>

                <span
                  className={`text-[10px] font-extrabold text-center leading-tight transition-colors ${
                    isActive ? 'text-[#583BE8]' : isCompleted ? 'text-[#0F172A]' : 'text-slate-400'
                  }`}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentProgress;
