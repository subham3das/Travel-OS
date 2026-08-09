import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

export const PolicyAccordion: React.FC = () => {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);

  return (
    <div className="space-y-3">
      {/* Cancellation Policy */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-2">
        <button
          onClick={() => setCancelOpen(!cancelOpen)}
          className="w-full flex items-center justify-between gap-3 text-left focus:outline-none cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">Cancellation Policy</h3>
              <p className="text-[11px] font-semibold text-slate-500">
                Free cancellation up to 7 days before departure.
              </p>
            </div>
          </div>

          {cancelOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
          )}
        </button>

        {cancelOpen && (
          <div className="pt-2 text-xs font-semibold text-slate-600 space-y-1 border-t border-slate-100">
            <p>• 100% refund if cancelled 7+ days before departure.</p>
            <p>• 50% refund if cancelled 3-6 days before departure.</p>
          </div>
        )}
      </div>

      {/* Refund Policy */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-2">
        <button
          onClick={() => setRefundOpen(!refundOpen)}
          className="w-full flex items-center justify-between gap-3 text-left focus:outline-none cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">Refund Policy</h3>
              <p className="text-[11px] font-semibold text-slate-500">
                Refunds are processed as per our refund policy.
              </p>
            </div>
          </div>

          {refundOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
          )}
        </button>

        {refundOpen && (
          <div className="pt-2 text-xs font-semibold text-slate-600 space-y-1 border-t border-slate-100">
            <p>• Approved refunds are credited back to source account within 5-7 business days.</p>
          </div>
        )}
      </div>
    </div>
  );
};
