import React from 'react';
import { TravelPartner } from '../../data/bookings';
import { PrimaryTravelerBadge } from './PrimaryTravelerBadge';
import { User, Phone, Mail, FileText, PhoneCall, HeartPulse } from 'lucide-react';

interface TravelPartnerCardProps {
  partner: TravelPartner;
  isPrimary?: boolean;
  partnerIndex?: number;
}

export const TravelPartnerCard: React.FC<TravelPartnerCardProps> = ({
  partner,
  isPrimary = false,
  partnerIndex = 1,
}) => {
  return (
    <div
      className={`p-4 rounded-2xl border transition-all space-y-3 select-none ${
        isPrimary
          ? 'bg-purple-50/60 border-purple-200/90 shadow-2xs'
          : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-50'
      }`}
    >
      {/* Header: Avatar, Name & Role Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black shrink-0 ${
              isPrimary
                ? 'bg-[#583BE8] text-white shadow-md shadow-[#583BE8]/20'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            <User className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
              <span>{partner.name}</span>
            </h5>
            <p className="text-xs font-bold text-slate-500">
              {partner.age} yrs • {partner.gender}
            </p>
          </div>
        </div>

        {isPrimary ? (
          <PrimaryTravelerBadge size="sm" />
        ) : (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-600 text-[10px] font-extrabold border border-slate-300/60">
            Travel Partner {partnerIndex}
          </span>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold pt-1 border-t border-slate-200/60">
        {partner.phone && (
          <div className="flex items-center gap-1.5 text-slate-600">
            <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <a href={`tel:${partner.phone}`} className="hover:text-[#583BE8] font-extrabold">
              {partner.phone}
            </a>
          </div>
        )}

        {partner.email && (
          <div className="flex items-center gap-1.5 text-slate-600">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{partner.email}</span>
          </div>
        )}

        {partner.idProofType && (
          <div className="flex items-center gap-1.5 text-slate-600">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {partner.idProofType}: {partner.idProofNumber || 'Verified'}
            </span>
          </div>
        )}

        {partner.emergencyContact && (
          <div className="flex items-center gap-1.5 text-slate-600">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Emergency: {partner.emergencyContact}</span>
          </div>
        )}
      </div>

      {/* Medical Notes */}
      {partner.medicalNotes && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60 text-[11px] font-bold text-amber-900 flex items-center gap-2">
          <HeartPulse className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Medical: {partner.medicalNotes}</span>
        </div>
      )}
    </div>
  );
};

export default TravelPartnerCard;
