import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Headphones, Check } from 'lucide-react';

interface PaymentProgressProps {
  currentStep?: number; // 3 for Payment
}

export const PaymentProgress: React.FC<PaymentProgressProps> = ({ currentStep = 3 }) => {
  const navigate = useNavigate();

  const steps = [
    { number: 1, label: 'Traveler Details' },
    { number: 2, label: 'Review Booking' },
    { number: 3, label: 'Payment' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white border border-slate-200/80 text-slate-800 flex items-center justify-center shadow-2xs hover:bg-slate-50 transition-all cursor-pointer focus:outline-none shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center space-y-0.5">
          <h1 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight">
            Payment
          </h1>
          <p className="text-xs font-bold text-slate-400">Step {currentStep} of 3</p>
        </div>

        <button
          onClick={() => alert('Support team is available 24/7! Call +91 98765 43210')}
          className="flex items-center gap-1.5 text-xs font-extrabold text-[#0F172A] hover:text-[#6356E5] transition-colors cursor-pointer"
        >
          <Headphones className="w-4 h-4 text-[#0F172A]" />
          <span>Help</span>
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="relative flex items-center justify-between max-w-lg mx-auto px-4 py-2">
        {/* Connecting Lines */}
        <div className="absolute top-1/2 left-10 right-10 -translate-y-4 h-0.5 bg-slate-200 z-0" />
        <div
          className="absolute top-1/2 left-10 -translate-y-4 h-0.5 bg-[#6356E5] transition-all duration-500 z-0"
          style={{ width: '100%' }}
        />

        {steps.map((st) => {
          const isCompleted = st.number < currentStep;
          const isActive = st.number === currentStep;

          return (
            <div key={st.number} className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  isCompleted || isActive
                    ? 'bg-[#6356E5] text-white shadow-md shadow-[#6356E5]/25'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : st.number}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-extrabold whitespace-nowrap ${
                  isActive || isCompleted ? 'text-[#6356E5]' : 'text-slate-400'
                }`}
              >
                {st.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
