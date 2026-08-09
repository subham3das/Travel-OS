import React, { useState } from 'react';
import { AgencyBooking } from '../../data/bookings';
import { TravelPartnerCard } from './TravelPartnerCard';
import { Users, ChevronDown, ChevronUp, UserCheck } from 'lucide-react';

interface TravelGroupCardProps {
  booking: AgencyBooking;
}

export const TravelGroupCard: React.FC<TravelGroupCardProps> = ({ booking }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const owner = booking.owner || {
    id: 'owner-default',
    name: booking.traveler.name,
    gender: 'Male',
    age: 30,
    phone: booking.traveler.phone,
    email: booking.traveler.email,
    idProofType: booking.traveler.idProofType,
    emergencyContact: booking.traveler.emergencyPhone,
    isPrimary: true,
  };

  const partners = booking.partners || [];
  const totalTravelers = 1 + partners.length;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* Header Bar */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-purple-100 text-[#583BE8] flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-[#0F172A] flex items-center gap-2">
              <span>Travel Group</span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#583BE8] text-[10px] font-extrabold border border-purple-200">
                {totalTravelers} {totalTravelers === 1 ? 'Traveler' : 'Travelers'}
              </span>
            </h4>
            <p className="text-[11px] font-semibold text-slate-400">
              Primary Contact: {owner.name} ({owner.phone})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
          <span>{isExpanded ? 'Hide' : 'Show Details'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded List */}
      {isExpanded && (
        <div className="space-y-3 pt-1 border-t border-slate-100">
          {/* Primary Traveler / Booking Owner */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Booking Owner / Primary Contact
            </span>
            <TravelPartnerCard partner={owner} isPrimary={true} />
          </div>

          {/* Travel Partners / Companions */}
          {partners.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Travel Companions ({partners.length})
              </span>
              <div className="space-y-2.5">
                {partners.map((partner, index) => (
                  <TravelPartnerCard
                    key={partner.id || `partner-${index}`}
                    partner={partner}
                    isPrimary={false}
                    partnerIndex={index + 1}
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

export default TravelGroupCard;
