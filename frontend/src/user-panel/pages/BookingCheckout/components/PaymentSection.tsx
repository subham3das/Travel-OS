import React, { useState } from 'react';
import { 
  CreditCard, Lock, ShieldCheck, Zap, Receipt, 
  HelpCircle, CheckCircle2, ChevronRight, Headphones 
} from 'lucide-react';
import { 
  PaymentSummaryData, InvoicePreview, StepCompletionStatus 
} from '../types/checkout';

interface PaymentSectionProps {
  paymentSummary: PaymentSummaryData;
  invoice: InvoicePreview;
  stepCompletion: StepCompletionStatus;
  termsAccepted: boolean;
  onProceedPayment: () => void;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  paymentSummary,
  invoice,
  stepCompletion,
  termsAccepted,
  onProceedPayment,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  const isProceedEnabled =
    stepCompletion.travelerDetails && stepCompletion.review && termsAccepted;

  return (
    <section id="section-payment" className="space-y-6 scroll-mt-24">
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-soft space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#583BE8]/10 text-[#583BE8] flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
                Payment & Invoice Details
              </h2>
              <p className="text-xs font-semibold text-slate-400">
                100% Encrypted Payment via Razorpay
              </p>
            </div>
          </div>

          <div className="px-3 py-1 rounded-xl bg-[#0C2340]/5 border border-[#0C2340]/10 text-[#0C2340] text-xs font-black shrink-0">
            Razorpay
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs font-semibold text-slate-700">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/70">
            <span className="font-extrabold text-[#0F172A]">Transaction Preview</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black">
              {invoice.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
            <div>
              <span className="text-slate-400 block font-bold">INVOICE NUMBER</span>
              <span className="font-extrabold text-[#0F172A]">{invoice.invoiceNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold">TRANSACTION PREVIEW ID</span>
              <span className="font-extrabold text-[#0F172A]">{invoice.transactionPreviewId}</span>
            </div>
          </div>
        </div>

        {/* Fare Summary */}
        <div className="space-y-2.5 text-xs font-semibold text-slate-700">
          <span className="text-xs font-black text-[#0F172A] block uppercase tracking-wider">
            Fare Summary
          </span>

          <div className="flex justify-between">
            <span>Booking Amount ({paymentSummary.travelerCount} Travelers)</span>
            <span className="font-extrabold text-[#0F172A]">₹{paymentSummary.packageTotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between">
            <span>Platform Services & Maintenance</span>
            <span className="font-extrabold text-[#0F172A]">₹{paymentSummary.platformFees.toLocaleString('en-IN')}</span>
          </div>

          {paymentSummary.insurancePrice > 0 && (
            <div className="flex justify-between text-sky-700">
              <span>Travel Protection Insurance</span>
              <span className="font-extrabold">+₹{paymentSummary.insurancePrice.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>GST & Service Taxes (5%)</span>
            <span className="font-extrabold text-[#0F172A]">+₹{paymentSummary.taxes.toLocaleString('en-IN')}</span>
          </div>

          {paymentSummary.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-extrabold">
              <span>Applied Promo Discount</span>
              <span>-₹{paymentSummary.discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-base font-black text-[#0F172A]">
            <span>Total Amount Payable</span>
            <span className="text-xl text-[#583BE8] font-black">₹{paymentSummary.totalPayable.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-2.5">
          <span className="text-xs font-black text-[#0F172A] block uppercase tracking-wider">
            Accepted Payment Methods
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'upi', label: 'UPI / GPay / PhonePe' },
              { id: 'card', label: 'Credit / Debit Card' },
              { id: 'netbanking', label: 'Net Banking' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMethod(m.id as any)}
                className={`p-3 rounded-2xl border text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                  selectedMethod === m.id
                    ? 'bg-purple-50/70 border-[#583BE8] text-[#583BE8] shadow-2xs'
                    : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{m.label}</span>
                <input
                  type="radio"
                  readOnly
                  checked={selectedMethod === m.id}
                  className="accent-[#583BE8]"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Security & Refund Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
          <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2.5 text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>256-Bit SSL Encrypted & PCI-DSS Compliant</span>
          </div>

          <div className="p-3 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-center gap-2.5 text-sky-800">
            <Zap className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Instant Booking & Immediate E-Tickets</span>
          </div>
        </div>

        {/* Support */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-[#583BE8]" />
            <span>Need assistance with payment? 24/7 Helpline available.</span>
          </div>
          <span className="font-extrabold text-[#0F172A]">+91 98765 43210</span>
        </div>

        {/* Button */}
        <button
          type="button"
          disabled={!isProceedEnabled}
          onClick={onProceedPayment}
          className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2.5 focus:outline-none ${
            isProceedEnabled
              ? 'bg-[#FF4D6D] hover:bg-[#e03e5c] text-white shadow-[#FF4D6D]/25 cursor-pointer active:scale-[0.99]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <Lock className="w-4 h-4 shrink-0" />
          <span>Proceed to Payment (₹{paymentSummary.totalPayable.toLocaleString('en-IN')})</span>
          <ChevronRight className="w-5 h-5 shrink-0" />
        </button>

        {!isProceedEnabled && (
          <p className="text-[11px] font-bold text-amber-600 text-center">
            ⚠️ Please save Traveler Details & accept Terms in Section 2 to enable payment.
          </p>
        )}
      </div>
    </section>
  );
};

export default PaymentSection;
