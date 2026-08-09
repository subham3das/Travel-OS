import React from 'react';
import { Mountain, MessageSquare, IndianRupee, Clock } from 'lucide-react';
import { Destination } from '../../../data/destinations';

interface QuickFactsProps {
  destination: Destination;
}

export const QuickFacts: React.FC<QuickFactsProps> = ({ destination }) => {
  const facts = [
    { label: 'Elevation', value: destination.elevation, icon: <Mountain className="w-5 h-5 text-emerald-600" /> },
    { label: 'Language', value: destination.language, icon: <MessageSquare className="w-5 h-5 text-sky-600" /> },
    { label: 'Currency', value: destination.currency, icon: <IndianRupee className="w-5 h-5 text-amber-600" /> },
    { label: 'Time Zone', value: destination.timezone, icon: <Clock className="w-5 h-5 text-purple-600" /> },
  ];

  return (
    <div className="relative -mt-6 z-30 bg-white rounded-t-3xl rounded-b-3xl p-4 sm:p-5 border border-slate-100 shadow-xs">
      <div className="grid grid-cols-2 min-[480px]:grid-cols-4 gap-3 divide-y min-[480px]:divide-y-0 min-[480px]:divide-x divide-slate-100">
        {facts.map((f, idx) => (
          <div key={idx} className={`flex flex-col items-center text-center py-2 ${idx > 0 ? 'pt-3 min-[480px]:pt-2' : ''}`}>
            <div className="p-2 rounded-2xl bg-slate-50 border border-slate-100 mb-1">
              {f.icon}
            </div>
            <p className="text-xs sm:text-sm font-extrabold text-[#0F172A]">{f.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{f.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
