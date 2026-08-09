import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface TermsSectionProps {
  accepted: boolean;
  onToggle: (checked: boolean) => void;
}

export const TermsSection: React.FC<TermsSectionProps> = ({ accepted, onToggle }) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-soft hover:shadow-soft-lg transition-all select-none">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => onToggle(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded text-[#6356E5] focus:ring-[#6356E5] cursor-pointer shrink-0 accent-[#6356E5]"
        />
        <span className="text-xs font-bold text-slate-600 leading-relaxed">
          I confirm my booking details and agree to the{' '}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              alert('ApnaTrip Terms & Conditions: Payments processed via Razorpay encrypted gateway.');
            }}
            className="text-[#6356E5] font-black underline hover:text-[#5245d6]"
          >
            Terms of Service
          </button>{' '}
          and{' '}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              alert('ApnaTrip Privacy Policy: Your data is 100% encrypted and safe.');
            }}
            className="text-[#6356E5] font-black underline hover:text-[#5245d6]"
          >
            Privacy Policy
          </button>
          .
        </span>
      </label>
    </div>
  );
};

export default TermsSection;
