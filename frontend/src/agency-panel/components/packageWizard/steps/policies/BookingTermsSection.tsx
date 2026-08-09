import React from 'react';
import { Check } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';
import { BOOKING_TERMS_CONFIG } from '../../../../data/policies';

export const BookingTermsSection: React.FC = () => {
  const { draft, toggleBookingTerm } = usePackageWizard();

  const selectedTerms = draft?.step7?.bookingTerms || [];

  return (
    <div className="space-y-2 select-none">
      <div className="space-y-0.5">
        <label className="text-sm font-extrabold text-[#0F172A]">
          Booking Terms <span className="text-rose-500">*</span>
        </label>
        <p className="text-xs font-semibold text-slate-400">Select all terms that apply</p>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {BOOKING_TERMS_CONFIG.map((term) => {
          const isSelected = selectedTerms.includes(term);

          return (
            <button
              key={term}
              type="button"
              onClick={() => toggleBookingTerm(term)}
              className={`px-3.5 py-2 rounded-2xl border text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-50/80 border-[#583BE8] text-[#583BE8] shadow-2xs'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:border-purple-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-[#583BE8] text-white' : 'border border-slate-300 bg-white'
                }`}
              >
                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <span>{term}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingTermsSection;
