import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, AlertTriangle, User, ChevronDown, ChevronUp, Armchair, Hotel } from 'lucide-react';
import { TripTravelerRecord } from '../../data/travelers';
import { AttendanceBadge } from './AttendanceBadge';

// TravelCompanionCard — compact card for a single travel companion inside expanded view
interface TravelCompanionCardProps {
  traveler: TripTravelerRecord;
  index: number;
  onCheckIn: (id: string) => void;
}

export const TravelCompanionCard: React.FC<TravelCompanionCardProps> = ({
  traveler,
  index,
  onCheckIn,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.18, delay: index * 0.04 }}
    className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-2xs"
  >
    <img
      src={traveler.avatar}
      alt={traveler.name}
      className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-white shadow-sm"
    />
    <div className="flex-1 min-w-0 space-y-2">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="min-w-0">
          <p className="text-xs font-extrabold text-[#0F172A] truncate">{traveler.name}</p>
          <p className="text-[10px] font-semibold text-slate-400">Travel Companion</p>
        </div>
        <AttendanceBadge
          status={traveler.checkInStatus}
          onCheckIn={() => onCheckIn(traveler.id)}
        />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-semibold text-slate-500">
        {traveler.phone && (
          <span className="flex items-center gap-1 truncate">
            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
            {traveler.phone}
          </span>
        )}
        {traveler.age && (
          <span className="flex items-center gap-1">
            <User className="w-3 h-3 text-slate-400 shrink-0" />
            {traveler.age} yrs • {traveler.gender}
          </span>
        )}
        {traveler.seatNumbers.length > 0 && (
          <span className="flex items-center gap-1">
            <Armchair className="w-3 h-3 text-slate-400 shrink-0" />
            Seat {traveler.seatNumbers.join(', ')}
          </span>
        )}
        {traveler.emergencyContact?.name && (
          <span className="flex items-center gap-1 truncate">
            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
            {traveler.emergencyContact.name}
          </span>
        )}
      </div>

      {traveler.hasMedicalNotes && traveler.medicalNotesText && (
        <div className="flex items-start gap-1.5 px-2 py-1.5 rounded-xl bg-rose-50 border border-rose-100 text-[10px] font-bold text-rose-800">
          <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
          <span>{traveler.medicalNotesText}</span>
        </div>
      )}
    </div>
  </motion.div>
);

// CompanionList — animated expanding list of travel companions
interface CompanionListProps {
  companions: TripTravelerRecord[];
  isExpanded: boolean;
  onCheckIn: (id: string) => void;
}

export const CompanionList: React.FC<CompanionListProps> = ({
  companions,
  isExpanded,
  onCheckIn,
}) => (
  <AnimatePresence>
    {isExpanded && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="pt-3 pb-1 px-4 sm:px-5 space-y-2.5 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Traveling With ({companions.length})
          </p>
          {companions.map((c, i) => (
            <TravelCompanionCard
              key={c.id}
              traveler={c}
              index={i}
              onCheckIn={onCheckIn}
            />
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default CompanionList;
