import React from 'react';
import { TripTravelerRecord } from '../../data/travelers';
import { UserCheck, PhoneCall, Mail, CheckCircle2, HeartPulse, ShieldCheck, Crown } from 'lucide-react';

interface PrimaryTravelerCardProps {
  traveler: TripTravelerRecord;
  onCheckIn?: (travelerId: string) => void;
  onViewDetails?: (travelerId: string) => void;
}

export const PrimaryTravelerCard: React.FC<PrimaryTravelerCardProps> = ({
  traveler,
  onCheckIn,
  onViewDetails,
}) => {
  const isCheckedIn = traveler.checkInStatus === 'Checked In';

  return (
    <div className="bg-purple-50/70 rounded-2xl p-4 border border-purple-200 shadow-2xs space-y-3 select-none">
      {/* Header Row: Avatar, Name & Crown Primary Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <img
              src={traveler.avatar}
              alt={traveler.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-300 shadow-2xs"
            />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-[10px] shadow-2xs">
              <Crown className="w-3 h-3 fill-amber-950" />
            </span>
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-black text-[#0F172A] truncate">
                {traveler.name}
              </h4>
              <span className="px-2.5 py-0.5 rounded-full bg-[#583BE8] text-white text-[10px] font-black inline-flex items-center gap-1 shadow-2xs">
                <Crown className="w-3 h-3" />
                <span>Primary Traveler</span>
              </span>
            </div>

            <p className="text-xs font-extrabold text-[#583BE8]">
              {traveler.age ? `${traveler.age} yrs` : ''} {traveler.gender ? `• ${traveler.gender}` : ''} • Booking Owner
            </p>
          </div>
        </div>

        {/* Individual Attendance Action Button */}
        <div className="shrink-0 flex items-center gap-2">
          {isCheckedIn ? (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Present ✓</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onCheckIn?.(traveler.id)}
              className="px-4 py-2 rounded-xl bg-[#583BE8] hover:bg-[#472dbf] text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#583BE8]/25 transition-all cursor-pointer"
            >
              <span>Mark Attendance</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-white/90 border border-purple-100 text-xs font-bold">
        <div>
          <span className="text-[10px] text-slate-400 block font-semibold">Phone (Primary Contact)</span>
          <a href={`tel:${traveler.phone}`} className="text-[#583BE8] font-black flex items-center gap-1">
            <PhoneCall className="w-3 h-3 text-emerald-600 shrink-0" />
            {traveler.phone}
          </a>
        </div>

        {traveler.email && (
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Email</span>
            <span className="text-slate-700 font-extrabold truncate block">{traveler.email}</span>
          </div>
        )}

        <div>
          <span className="text-[10px] text-slate-400 block font-semibold">Emergency Contact</span>
          <span className="text-rose-700 font-extrabold flex items-center gap-1">
            <PhoneCall className="w-3 h-3 text-rose-500 shrink-0" />
            {traveler.emergencyContact.name} ({traveler.emergencyContact.phone})
          </span>
        </div>
      </div>

      {/* Medical Notes if available */}
      {traveler.hasMedicalNotes && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Medical Advisory: {traveler.medicalNotesText || 'Has recorded medical condition'}</span>
        </div>
      )}
    </div>
  );
};

export default PrimaryTravelerCard;
