import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, ShoppingBag, ShieldCheck, Tag, Receipt, CheckCircle2 } from 'lucide-react';

interface AmountSummaryProps {
  packagePrice?: number;
  taxes?: number;
  insurancePrice?: number;
  discountAmount?: number;
  couponCode?: string;
  totalAmount?: number;
  platformFees?: number;
  invoiceNumber?: string;
  transactionId?: string;
  paymentStatus?: string;
}

export const AmountSummary: React.FC<AmountSummaryProps> = ({
  packagePrice = 24998,
  taxes = 1499,
  insurancePrice = 998,
  discountAmount = 2000,
  couponCode = 'APNATRIP2000',
  totalAmount = 25495,
  platformFees = 900,
  invoiceNumber = 'INV-AT-2025-9988',
  transactionId = 'TXN-9988112233',
  paymentStatus = 'PENDING',
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-soft hover:shadow-soft-lg transition-all space-y-4 select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center font-black shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#0F172A] tracking-tight">
              Payment Details & Invoice
            </h2>
            <p className="text-[11px] font-semibold text-slate-400">
              Itemized charges and breakdown
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 text-xs font-black text-[#6356E5] transition-all flex items-center gap-1 cursor-pointer focus:outline-none"
        >
          <span>{isOpen ? 'Collapse' : 'View Breakdown'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-3.5 pt-2 text-xs sm:text-sm font-semibold text-slate-600 border-t border-slate-100">
          {/* Invoice & Transaction Metadata Badge Grid */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                INVOICE NO
              </span>
              <span className="font-black text-[#0F172A] tracking-tight block">
                {invoiceNumber}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                TRANSACTION ID
              </span>
              <span className="font-black text-[#0F172A] tracking-tight block">
                {transactionId}
              </span>
            </div>
          </div>

          {/* Line Items */}
          <div className="flex justify-between items-center pt-1">
            <span className="flex items-center gap-2 text-[#0F172A] font-bold">
              <FileText className="w-4 h-4 text-slate-400 shrink-0" />
              Booking Amount
            </span>
            <span className="font-black text-[#0F172A]">₹{packagePrice.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-[#0F172A] font-bold">
              <ShoppingBag className="w-4 h-4 text-slate-400 shrink-0" />
              Platform Fees
            </span>
            <span className="font-black text-[#0F172A]">₹{platformFees.toLocaleString('en-IN')}</span>
          </div>

          {insurancePrice > 0 && (
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                Travel Insurance
              </span>
              <span className="font-black text-emerald-700">₹{insurancePrice.toLocaleString('en-IN')}</span>
            </div>
          )}

          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-emerald-600 font-black">
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-500 shrink-0" />
                Promo Code ({couponCode})
              </span>
              <span className="bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60">
                -₹{discountAmount.toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {/* Total Banner */}
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <div>
              <span className="text-sm font-black text-[#0F172A]">Total Amount Payable</span>
              <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-1 pt-0.5">
                <CheckCircle2 className="w-3 h-3 fill-emerald-500/20 text-emerald-600" />
                All taxes & GST included
              </span>
            </div>

            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black text-[#6356E5] tracking-tight block">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmountSummary;
