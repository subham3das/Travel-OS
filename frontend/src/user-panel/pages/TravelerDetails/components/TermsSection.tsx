import React from 'react';

interface TermsSectionProps {
  accepted: boolean;
  onToggle: (checked: boolean) => void;
}

export const TermsSection: React.FC<TermsSectionProps> = ({ accepted, onToggle }) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs">
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => onToggle(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded text-[#6356E5] focus:ring-[#6356E5] cursor-pointer"
        />
        <span className="text-xs font-semibold text-slate-600 leading-relaxed">
          I agree to the{' '}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              alert('ApnaTrip Terms & Conditions: 100% refund on cancellations 48 hours prior to trip start date.');
            }}
            className="text-[#6356E5] font-extrabold underline hover:text-[#5245d6]"
          >
            Terms & Conditions
          </button>{' '}
          and{' '}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              alert('Cancellation Policy: Full refund if cancelled 48h before departure. 50% refund if cancelled 24h before departure.');
            }}
            className="text-[#6356E5] font-extrabold underline hover:text-[#5245d6]"
          >
            Cancellation Policy
          </button>
          .
        </span>
      </label>
    </div>
  );
};
