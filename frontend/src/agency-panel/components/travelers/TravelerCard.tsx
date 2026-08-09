import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  User,
  ChevronDown,
  ChevronUp,
  Crown,
  Users,
  Armchair,
  Hotel,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { TripTravelGroup, TripTravelerRecord } from '../../data/travelers';
import { AttendanceBadge } from './AttendanceBadge';
import { CompanionList } from './TravelCompanionCard';

// ── TravelerBadge ─────────────────────────────────────────────────────────────

interface TravelerBadgeProps {
  type: 'solo' | 'group';
  count?: number;
}

export const TravelerBadge: React.FC<TravelerBadgeProps> = ({ type, count }) => {
  if (type === 'solo') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[10px] font-extrabold shrink-0">
        <User className="w-3 h-3" />
        Solo Traveler
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-[#583BE8] text-[10px] font-extrabold shrink-0">
      <Users className="w-3 h-3" />
      Group Traveler {count ? `• ${count}` : ''}
    </span>
  );
};

// ── TravelerInfo ──────────────────────────────────────────────────────────────

interface TravelerInfoProps {
  icon: React.ReactNode;
  label: string;
}

export const TravelerInfo: React.FC<TravelerInfoProps> = ({ icon, label }) => (
  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
    {icon}
    <span>{label}</span>
  </span>
);

// ── TravelerCard ──────────────────────────────────────────────────────────────

interface TravelerCardProps {
  group: TripTravelGroup;
  index: number;
  onCheckIn: (travelerId: string) => void;
  onOpenBookingDetails: (bookingId: string) => void;
  onViewDetails: (travelerId: string) => void;
}

export const TravelerCard: React.FC<TravelerCardProps> = ({
  group,
  index,
  onCheckIn,
  onOpenBookingDetails,
  onViewDetails,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { primaryTraveler: t, companions, totalTravelersCount, bookingId } = group;
  const isSolo = totalTravelersCount === 1;
  const hasCompanions = companions && companions.length > 0;

  // Count how many in this group are checked in
  const allInGroup = [t, ...(companions || [])];
  const checkedInCount = allInGroup.filter((x) => x.checkInStatus === 'Checked In').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.06 }}
      className="bg-white rounded-3xl border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden select-none"
    >
      {/* ── Main Card Body ─────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 space-y-3">

        {/* Row 1: Avatar + Name + Badges */}
        <div className="flex items-start gap-3.5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={t.avatar}
              alt={t.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
            {/* Primary indicator dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#583BE8] border-2 border-white flex items-center justify-center">
              <Crown className="w-2 h-2 text-white" />
            </span>
          </div>

          {/* Name + Badges */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-black text-[#0F172A] truncate">{t.name}</h3>
                  {/* Primary Traveler badge */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#583BE8]/10 border border-[#583BE8]/20 text-[#583BE8] text-[10px] font-extrabold shrink-0">
                    <Crown className="w-2.5 h-2.5" />
                    Primary Traveler
                  </span>
                </div>
                {/* Solo / Group badge */}
                <TravelerBadge
                  type={isSolo ? 'solo' : 'group'}
                  count={isSolo ? undefined : totalTravelersCount}
                />
              </div>

              {/* Attendance */}
              <AttendanceBadge
                status={t.checkInStatus}
                onCheckIn={() => onCheckIn(t.id)}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Contact & Travel Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-[11px] pl-0.5">
          {t.phone && (
            <TravelerInfo
              icon={<Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
              label={t.phone}
            />
          )}
          {t.email && (
            <TravelerInfo
              icon={<Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
              label={t.email}
            />
          )}
          {t.age !== undefined && t.gender && (
            <TravelerInfo
              icon={<User className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
              label={`${t.age} yrs • ${t.gender}`}
            />
          )}
          {t.seatNumbers.length > 0 && (
            <TravelerInfo
              icon={<Armchair className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
              label={`Seat ${t.seatNumbers.join(', ')}`}
            />
          )}
        </div>

        {/* Row 3: Medical note (if any) */}
        {t.hasMedicalNotes && t.medicalNotesText && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-2xl bg-rose-50 border border-rose-100 text-xs font-bold text-rose-800">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <span>{t.medicalNotesText}</span>
          </div>
        )}

        {/* Row 4: Bottom meta row — Booking ID + group attendance + expand */}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-100 flex-wrap">
          {/* Left: Booking ID + payment */}
          <div className="flex items-center gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => onOpenBookingDetails(bookingId)}
              className="flex items-center gap-1 font-extrabold text-[#583BE8] hover:underline cursor-pointer"
            >
              <span>{bookingId}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <span className="text-slate-300">•</span>
            <span
              className={`font-extrabold text-[10px] px-2 py-0.5 rounded-full border ${
                t.paymentStatus === 'Payment Complete'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : t.paymentStatus === 'Partial'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {t.paymentStatus}
            </span>
          </div>

          {/* Right: Group attendance count + expand button */}
          <div className="flex items-center gap-2">
            {!isSolo && (
              <span className="text-[10px] font-bold text-slate-500">
                {checkedInCount}/{totalTravelersCount} Present
              </span>
            )}
            {hasCompanions && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] text-[11px] font-extrabold transition-all cursor-pointer"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Collapse</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>
                      {companions.length} Companion{companions.length > 1 ? 's' : ''}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Companion List (Expandable) ─────────────────────────────────────── */}
      {hasCompanions && (
        <CompanionList
          companions={companions}
          isExpanded={isExpanded}
          onCheckIn={onCheckIn}
        />
      )}
    </motion.div>
  );
};

export default TravelerCard;
