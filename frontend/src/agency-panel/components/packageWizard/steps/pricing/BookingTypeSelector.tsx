import React from 'react';
import { CreditCard, Wallet } from 'lucide-react';
import { PaymentType } from '../../../../data/pricing';

interface BookingTypeSelectorProps {
  paymentType: PaymentType;
  advanceAmount: number;
  onPaymentTypeChange: (type: PaymentType) => void;
  onAdvanceAmountChange: (val: number) => void;
}

export const BookingTypeSelector: React.FC<BookingTypeSelectorProps> = ({
  paymentType,
  advanceAmount,
  onPaymentTypeChange,
  onAdvanceAmountChange,
}) => {
  return (
    <div className="space-y-2 select-none">
      <label className="text-sm font-extrabold text-[#0F172A]">Booking Amount</label>
      <p className="text-xs font-semibold text-slate-400">
        Choose how travelers will pay for this package
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Full Payment */}
        <button
          type="button"
          onClick={() => onPaymentTypeChange('Full Payment')}
          className={`p-4 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
            paymentType === 'Full Payment'
              ? 'bg-purple-50/50 border-[#583BE8] shadow-md shadow-[#583BE8]/10'
              : 'bg-white border-slate-200/80 hover:border-purple-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-[#0F172A]">Full Payment</p>
              <p className="text-[11px] font-semibold text-slate-400">Pay the full amount at once</p>
            </div>
          </div>
          <div
            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
              paymentType === 'Full Payment'
                ? 'border-[#583BE8] bg-[#583BE8] text-white'
                : 'border-slate-300 bg-white'
            }`}
          >
            {paymentType === 'Full Payment' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
        </button>

        {/* Partial Payment */}
        <button
          type="button"
          onClick={() => onPaymentTypeChange('Partial Payment')}
          className={`p-4 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
            paymentType === 'Partial Payment'
              ? 'bg-purple-50/50 border-[#583BE8] shadow-md shadow-[#583BE8]/10'
              : 'bg-white border-slate-200/80 hover:border-purple-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#583BE8] flex items-center justify-center shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-[#0F172A]">Partial Payment</p>
              <p className="text-[11px] font-semibold text-slate-400">Collect advance amount</p>
            </div>
          </div>
          <div
            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
              paymentType === 'Partial Payment'
                ? 'border-[#583BE8] bg-[#583BE8] text-white'
                : 'border-slate-300 bg-white'
            }`}
          >
            {paymentType === 'Partial Payment' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
        </button>
      </div>

      {/* Advance Amount input */}
      {paymentType === 'Partial Payment' && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1.5 mt-2">
          <label className="text-xs font-extrabold text-[#0F172A]">
            Advance Amount <span className="text-rose-500">*</span>
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
              ₹
            </span>
            <input
              type="number"
              min={1}
              value={advanceAmount || ''}
              onChange={(e) => onAdvanceAmountChange(parseInt(e.target.value) || 0)}
              placeholder="5,000"
              className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTypeSelector;
