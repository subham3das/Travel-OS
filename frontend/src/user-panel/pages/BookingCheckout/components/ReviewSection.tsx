import React, { useState } from 'react';
import { 
  Users, MapPin, Calendar, CheckCircle2, XCircle, ShieldCheck, 
  Tag, Receipt, FileText, ChevronRight, Edit3, Lock 
} from 'lucide-react';
import { 
  TravelerSectionData, BookingSummaryData, PromoCodeData, PaymentSummaryData 
} from '../types/checkout';

interface ReviewSectionProps {
  travelerData: TravelerSectionData;
  bookingSummary: BookingSummaryData;
  promoCode: PromoCodeData;
  paymentSummary: PaymentSummaryData;
  isUnlocked: boolean;
  isInsuranceSelected: boolean;
  termsAccepted: boolean;
  onEditTravelers: () => void;
  onToggleInsurance: () => void;
  onApplyPromoCode: (code: string) => void;
  onToggleTerms: (accepted: boolean) => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  travelerData,
  bookingSummary,
  promoCode,
  paymentSummary,
  isUnlocked,
  isInsuranceSelected,
  termsAccepted,
  onEditTravelers,
  onToggleInsurance,
  onApplyPromoCode,
  onToggleTerms,
}) => {
  const [promoInput, setPromoInput] = useState(promoCode.code || 'APNATRIP2000');

  const totalTravelers = 1 + travelerData.additionalTravelers.length;

  if (!isUnlocked) {
    return (
      <section id="section-review" className="scroll-mt-24">
        <div className="bg-slate-100/80 rounded-3xl p-6 border border-slate-200 text-center space-y-3 opacity-60">
          <div className="w-10 h-10 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-700">Section 2: Review Booking</h3>
          <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
            Please complete and save Section 1 (Traveler Details) to unlock booking review.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="section-review" className="space-y-6 scroll-mt-24">
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-soft space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#583BE8]/10 text-[#583BE8] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
                Review Booking Details
              </h2>
              <p className="text-xs font-semibold text-slate-400">
                Verify trip itinerary, inclusions, traveler list & pricing
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onEditTravelers}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Travelers</span>
          </button>
        </div>

        {/* Trip Logistics: Pickup & Drop Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/90 flex items-start gap-3">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 text-[11px] block font-bold">PICKUP LOCATION</span>
              <span className="font-extrabold text-[#0F172A]">{bookingSummary.pickupPoint}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/90 flex items-start gap-3">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 text-[11px] block font-bold">DROP LOCATION</span>
              <span className="font-extrabold text-[#0F172A]">{bookingSummary.dropPoint}</span>
            </div>
          </div>
        </div>

        {/* Traveler List Summary */}
        <div className="space-y-2 text-xs font-semibold">
          <span className="text-xs font-black text-[#0F172A] block uppercase tracking-wider">
            Travelers ({totalTravelers})
          </span>
          <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
            <div>
              <span className="font-black text-[#0F172A] block">{travelerData.leadTraveler.fullName} (Lead)</span>
              <span className="text-slate-500">{travelerData.leadTraveler.phone} • {travelerData.leadTraveler.email}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#583BE8] text-[10px] font-black">
              Primary Contact
            </span>
          </div>

          {travelerData.additionalTravelers.map((c, i) => (
            <div key={c.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#0F172A] block">{c.fullName || `Companion #${i + 1}`}</span>
                <span className="text-slate-500">{c.gender} • ID: {c.idProofType}</span>
              </div>
              <span className="text-[11px] font-bold text-slate-400">Companion #{i + 1}</span>
            </div>
          ))}
        </div>

        {/* Included & Excluded Services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
            <h4 className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>What's Included</span>
            </h4>
            <ul className="space-y-1 text-xs font-bold text-emerald-900/90">
              {bookingSummary.includedServices.map((inc, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
            <h4 className="text-xs font-black text-rose-800 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>What's Excluded</span>
            </h4>
            <ul className="space-y-1 text-xs font-bold text-rose-900/90">
              {bookingSummary.excludedServices.map((exc, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>{exc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Travel Insurance Card */}
        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
            <div>
              <h4 className="text-xs font-black text-sky-900">Comprehensive Travel Insurance</h4>
              <p className="text-[11px] font-semibold text-sky-700">
                Medical cover, baggage loss & trip cancellation protection ({totalTravelers} × ₹499)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleInsurance}
            className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer shrink-0 ${
              isInsuranceSelected ? 'bg-[#583BE8]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                isInsuranceSelected ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Promo Code Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#0F172A] flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#583BE8]" />
              <span>Apply Promo / Coupon Code</span>
            </span>
            {promoCode.isApplied && (
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Applied -₹{promoCode.discountAmount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter code (e.g. APNATRIP2000)"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-[#0F172A]"
            />
            <button
              type="button"
              onClick={() => onApplyPromoCode(promoInput)}
              className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-black transition-all cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs font-semibold text-slate-700">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
            <span className="font-black text-[#0F172A]">Fare Breakdown</span>
            <Receipt className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex justify-between">
            <span>Base Package Fare ({totalTravelers} Travelers)</span>
            <span className="font-extrabold text-[#0F172A]">₹{paymentSummary.packageTotal.toLocaleString('en-IN')}</span>
          </div>

          {isInsuranceSelected && (
            <div className="flex justify-between text-sky-700 font-bold">
              <span>Travel Insurance ({totalTravelers} × ₹499)</span>
              <span>+₹{paymentSummary.insurancePrice.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>GST & Service Fee (5%)</span>
            <span className="font-extrabold text-[#0F172A]">+₹{paymentSummary.taxes.toLocaleString('en-IN')}</span>
          </div>

          {promoCode.isApplied && (
            <div className="flex justify-between text-emerald-700 font-black">
              <span>Promo Discount ({promoCode.code})</span>
              <span>-₹{paymentSummary.discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-black text-[#0F172A]">
            <span>Total Payable Amount</span>
            <span className="text-[#583BE8] text-base font-black">₹{paymentSummary.totalPayable.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
          <h4 className="text-xs font-black text-amber-900">Cancellation & Refund Policy</h4>
          <p className="text-[11px] font-semibold text-amber-800">
            {bookingSummary.cancellationPolicy}
          </p>
        </div>

        {/* Terms & Conditions Checkbox */}
        <label className="flex items-start gap-3 p-4 rounded-2xl bg-purple-50/50 border border-purple-100 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => onToggleTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded accent-[#583BE8]"
          />
          <div className="text-xs font-semibold text-slate-700">
            <span className="font-black text-[#0F172A]">I accept the Terms & Conditions and Cancellation Policy *</span>
            <p className="text-slate-500 text-[11px] pt-0.5">
              By checking this box, you confirm all traveler names and trip details are correct.
            </p>
          </div>
        </label>
      </div>
    </section>
  );
};

export default ReviewSection;
