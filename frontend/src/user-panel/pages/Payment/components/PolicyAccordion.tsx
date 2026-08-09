import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, RefreshCw, FileText } from 'lucide-react';

export const PolicyAccordion: React.FC = () => {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);

  return (
    <div className="space-y-3 select-none">
      {/* Cancellation Policy */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-soft hover:shadow-soft-lg transition-all space-y-2">
        <button
          type="button"
          onClick={() => setCancelOpen(!cancelOpen)}
          className="w-full flex items-center justify-between gap-3 text-left focus:outline-none cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-extrabold">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-[#0F172A]">Cancellation Policy</h3>
              <p className="text-[11px] font-bold text-slate-400">
                Free cancellation up to 7 days before departure.
              </p>
            </div>
          </div>

          <div className="w-7 h-7 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
            {cancelOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {cancelOpen && (
          <div className="pt-3 text-xs font-bold text-slate-600 space-y-2 border-t border-slate-100">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <p><span className="font-black text-[#0F172A]">100% Refund:</span> Cancel 7+ days before trip start date.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <p><span className="font-black text-[#0F172A]">50% Refund:</span> Cancel 3–6 days before trip start date.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <p><span className="font-black text-[#0F172A]">Non-Refundable:</span> Cancellations made within 48 hours of departure.</p>
            </div>
          </div>
        )}
      </div>

      {/* Refund Policy */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-soft hover:shadow-soft-lg transition-all space-y-2">
        <button
          type="button"
          onClick={() => setRefundOpen(!refundOpen)}
          className="w-full flex items-center justify-between gap-3 text-left focus:outline-none cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-extrabold">
              <RefreshCw className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-[#0F172A]">Refund Timeline & Process</h3>
              <p className="text-[11px] font-bold text-slate-400">
                Instant refund initiation to original payment method.
              </p>
            </div>
          </div>

          <div className="w-7 h-7 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
            {refundOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {refundOpen && (
          <div className="pt-3 text-xs font-bold text-slate-600 space-y-2 border-t border-slate-100">
            <p>• Refunds are initiated automatically within 24 hours of cancellation approval.</p>
            <p>• Bank processing takes 3–5 business days depending on your bank/UPI provider.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyAccordion;
