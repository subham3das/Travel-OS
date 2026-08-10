import React from 'react';
import { CheckCircle2, Edit3, UserCheck, Users, ShieldCheck, Tag } from 'lucide-react';
import { TravelerSectionData, PromoCodeData } from '../types/checkout';

interface StepSummaryCardProps {
  title: string;
  section: 'traveler' | 'review';
  data?: TravelerSectionData;
  promoCode?: PromoCodeData;
  isInsuranceSelected?: boolean;
  onEdit: () => void;
}

export const StepSummaryCard: React.FC<StepSummaryCardProps> = ({
  title,
  section,
  data,
  promoCode,
  isInsuranceSelected = true,
  onEdit,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-purple-100/90 shadow-soft space-y-3 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#0F172A] tracking-tight">{title}</h3>
            <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider block">
              Section Completed
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>

      {/* Traveler Summary Content */}
      {section === 'traveler' && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <div className="flex items-center gap-1.5 text-[#583BE8] font-black">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Lead Traveler</span>
            </div>
            <p className="font-extrabold text-[#0F172A]">{data.leadTraveler.fullName}</p>
            <p className="text-slate-500 text-[11px]">{data.leadTraveler.phone} • {data.leadTraveler.email}</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700 font-black">
              <Users className="w-3.5 h-3.5" />
              <span>Group Size</span>
            </div>
            <p className="font-extrabold text-[#0F172A]">
              1 Lead + {data.additionalTravelers.length} Companions ({1 + data.additionalTravelers.length} Total)
            </p>
            <p className="text-slate-500 text-[11px]">Emergency: {data.emergencyContact.name} ({data.emergencyContact.phone})</p>
          </div>
        </div>
      )}

      {/* Review Summary Content */}
      {section === 'review' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Travel Insurance</span>
            </div>
            <span className="font-black text-sky-700">
              {isInsuranceSelected ? 'Active (₹499/person)' : 'Opted Out'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              <span>Promo Code</span>
            </div>
            <span className="font-black text-emerald-700">
              {promoCode?.isApplied ? `${promoCode.code} (-₹${promoCode.discountAmount})` : 'None'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepSummaryCard;
