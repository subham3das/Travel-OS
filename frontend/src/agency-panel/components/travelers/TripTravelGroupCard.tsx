import React, { useState } from 'react';
import { TripTravelGroup } from '../../data/travelers';
import { GroupBadge } from './GroupBadge';
import { PrimaryTravelerCard } from './PrimaryTravelerCard';
import { TravelCompanionCard } from './TravelCompanionCard';
import { Users, ChevronDown, ChevronUp, ExternalLink, CheckCircle2, Crown, Phone } from 'lucide-react';

interface TripTravelGroupCardProps {
  group: TripTravelGroup;
  onOpenBookingDetails: (bookingId: string) => void;
  onCheckInTraveler: (travelerId: string) => void;
  onViewTravelerDetails: (travelerId: string) => void;
}

export const TripTravelGroupCard: React.FC<TripTravelGroupCardProps> = ({
  group,
  onOpenBookingDetails,
  onCheckInTraveler,
  onViewTravelerDetails,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const isSolo = group.groupCategory === 'Solo' || group.totalTravelersCount === 1;

  // Calculate Group Attendance Count
  const allTravelers = [group.primaryTraveler, ...(group.companions || [])];
  const checkedInCount = allTravelers.filter((t) => t.checkInStatus === 'Checked In').length;

  return (
    <div className="bg-white rounded-3xl border border-purple-200/90 shadow-[0_4px_20px_rgba(88,59,232,0.04)] overflow-hidden select-none transition-all space-y-0">
      {/* Group Card Top Header Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-50/40 via-white to-white space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Group Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#583BE8] flex items-center justify-center font-black shrink-0 shadow-2xs">
              {isSolo ? <Users className="w-5 h-5" /> : <Users className="w-5 h-5 text-[#583BE8]" />}
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-[#0F172A] truncate">
                  {isSolo ? 'Solo Traveler' : group.groupName}
                </h3>
                <GroupBadge category={group.groupCategory} size="sm" />
              </div>

              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500">
                <button
                  type="button"
                  onClick={() => onOpenBookingDetails(group.bookingId)}
                  className="text-[#583BE8] hover:underline font-black flex items-center gap-1 cursor-pointer"
                >
                  <span>Booking {group.bookingId}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <span>•</span>
                <span>{group.totalTravelersCount} {group.totalTravelersCount === 1 ? 'Person' : 'People'}</span>
              </div>
            </div>
          </div>

          {/* Right Header Stats & Expand Toggle */}
          <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="text-left sm:text-right text-xs font-bold">
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 block text-[11px] font-black">
                {group.paymentStatus}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 block pt-0.5">
                Attendance: {checkedInCount}/{group.totalTravelersCount} Present
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-[#583BE8] flex items-center justify-center transition-colors cursor-pointer"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Roster Body */}
      {isExpanded && (
        <div className="p-4 sm:p-5 pt-1 space-y-4 border-t border-purple-100/60 bg-slate-50/20">
          {/* Primary Traveler / Booking Owner */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Primary Traveler
            </span>
            <PrimaryTravelerCard
              traveler={group.primaryTraveler}
              onCheckIn={onCheckInTraveler}
              onViewDetails={onViewTravelerDetails}
            />
          </div>

          {/* Companions Roster */}
          {group.companions && group.companions.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Travel Companions ({group.companions.length})
              </span>
              <div className="space-y-2.5">
                {group.companions.map((comp) => (
                  <TravelCompanionCard
                    key={comp.id}
                    traveler={comp}
                    index={0}
                    onCheckIn={onCheckInTraveler}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TripTravelGroupCard;
