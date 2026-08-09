import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

export const CancellationPolicy: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 text-left focus:outline-none cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">Cancellation Policy</h3>
            <p className="text-[11px] font-semibold text-slate-500">
              Free cancellation up to 7 days before departure.
            </p>
          </div>
        </div>

        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="pt-2 text-xs font-semibold text-slate-600 space-y-1.5 border-t border-slate-100">
          <p>• Cancel 7+ days before trip start: 100% full refund.</p>
          <p>• Cancel 3-6 days before trip start: 50% refund.</p>
          <p>• Cancel less than 48 hours before trip: Non-refundable.</p>
        </div>
      )}
    </div>
  );
};
