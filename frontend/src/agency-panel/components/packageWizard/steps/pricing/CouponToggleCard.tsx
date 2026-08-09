import React from 'react';

interface CouponToggleCardProps {
  allowCouponCodes: boolean;
  onToggle: () => void;
}

export const CouponToggleCard: React.FC<CouponToggleCardProps> = ({
  allowCouponCodes,
  onToggle,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between select-none">
      <div className="space-y-0.5">
        <p className="text-xs font-black text-[#0F172A]">Allow Coupon Codes</p>
        <p className="text-[11px] font-semibold text-slate-400">Let customers use coupon codes</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`w-11 h-6 rounded-full flex items-center transition-all cursor-pointer ${
          allowCouponCodes ? 'bg-[#583BE8] justify-end' : 'bg-slate-200 justify-start'
        }`}
      >
        <span className="w-5 h-5 rounded-full bg-white mx-0.5 shadow-md" />
      </button>
    </div>
  );
};

export default CouponToggleCard;
