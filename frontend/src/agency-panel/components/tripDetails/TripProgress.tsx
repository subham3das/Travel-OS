import React from 'react';
import { CheckCircle2, Building, Clock, Flag } from 'lucide-react';

export const TripProgress: React.FC = () => {
  const steps = [
    { label: 'Created', date: '10 May', status: 'completed' },
    { label: 'Confirmed', date: '12 May', status: 'completed' },
    { label: 'Ready', date: '14 May', status: 'active' },
    { label: 'Ongoing', date: '15 May', status: 'pending' },
    { label: 'Completed', date: '22 May', status: 'pending' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none">
      <h3 className="text-sm font-extrabold text-[#0F172A]">Trip Progress</h3>

      <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-none">
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isActive = step.status === 'active';

          return (
            <React.Fragment key={idx}>
              {/* Step Icon & Details */}
              <div className="flex flex-col items-center gap-1.5 shrink-0 px-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-500'
                      : isActive
                      ? 'bg-[#583BE8] text-white shadow-md shadow-[#583BE8]/25 ring-4 ring-purple-100'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                  ) : isActive ? (
                    <Building className="w-4 h-4" />
                  ) : idx === 3 ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <Flag className="w-4 h-4" />
                  )}
                </div>

                <div className="text-center">
                  <span
                    className={`text-xs block ${
                      isActive
                        ? 'font-black text-[#583BE8]'
                        : isCompleted
                        ? 'font-extrabold text-[#0F172A]'
                        : 'font-semibold text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 block">{step.date}</span>
                </div>
              </div>

              {/* Connecting Line */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 min-w-[30px] sm:min-w-[50px] transition-colors ${
                    isCompleted ? 'bg-emerald-500' : 'bg-slate-200 border-t border-dashed border-slate-300'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default TripProgress;
