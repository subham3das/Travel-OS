import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, ShoppingBag, ShieldCheck, Tag, Download, CheckCircle2 } from 'lucide-react';

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
  packagePrice = 45000,
  taxes = 1499,
  insurancePrice = 998,
  discountAmount = 2000,
  couponCode = 'APNATRIP2000',
  totalAmount = 45000,
  platformFees = 900,
  invoiceNumber = 'INV-AT-2025-9988',
  transactionId = 'TXN-9988112233',
  paymentStatus = 'PAID',
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-[#0F172A] tracking-tight">
          Payment Details & Invoice
        </h2>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-bold text-[#583BE8] hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <span>{isOpen ? 'Collapse' : 'View Breakdown'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-3 pt-1 text-xs sm:text-sm font-semibold text-slate-600 border-t border-slate-100">
          {/* Metadata Row */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block">INVOICE NO</span>
              <span className="font-extrabold text-[#0F172A]">{invoiceNumber}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block">TRANSACTION ID</span>
              <span className="font-extrabold text-[#0F172A]">{transactionId}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              Booking Amount
            </span>
            <span className="font-extrabold text-[#0F172A]">₹{packagePrice.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-slate-400" />
              Platform Fees
            </span>
            <span className="font-extrabold text-[#0F172A]">₹{platformFees.toLocaleString('en-IN')}</span>
          </div>

          {insurancePrice > 0 && (
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Travel Insurance
              </span>
              <span className="font-extrabold text-[#0F172A]">₹{insurancePrice.toLocaleString('en-IN')}</span>
            </div>
          )}

          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-emerald-600 font-extrabold">
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Promo Code ({couponCode})
              </span>
              <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <div>
              <span className="text-sm font-black text-[#0F172A]">Total Paid</span>
              <span className="text-[10px] font-semibold text-slate-400 block">GST Inclusive</span>
            </div>
            <span className="text-lg font-black text-[#583BE8]">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Refund Status & Download Invoice */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-extrabold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Status: Fully Paid (No Refund Pending)</span>
            </div>

            <button
              type="button"
              onClick={() => alert(`Downloading Tax Invoice ${invoiceNumber}...`)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] border border-purple-200 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Invoice</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmountSummary;
