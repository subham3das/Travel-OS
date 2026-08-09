import React from 'react';
import { ChevronRight } from 'lucide-react';
import { TripTraveler } from '../../data/tripDetails';

interface TravelerListProps {
  travelers: TripTraveler[];
  totalCount: number;
  onViewAll?: () => void;
  onSelectTraveler?: (travelerId: string) => void;
}

export const TravelerList: React.FC<TravelerListProps> = ({
  travelers,
  totalCount,
  onViewAll,
  onSelectTraveler,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#0F172A]">Travelers ({totalCount})</h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-extrabold text-[#583BE8] hover:underline cursor-pointer"
        >
          Manage
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {travelers.map((tr) => (
          <div
            key={tr.id}
            onClick={() => onSelectTraveler?.(tr.id)}
            className="py-3 hover:bg-slate-50/80 rounded-2xl transition-colors flex items-center justify-between gap-3 px-2 cursor-pointer group"
          >
            {/* Left: Avatar & Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img
                src={tr.avatar}
                alt={tr.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs"
              />

              <div className="min-w-0 space-y-0.5">
                <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A] truncate group-hover:text-[#583BE8] transition-colors">
                  {tr.name}
                </h4>
                <p className="text-[11px] font-semibold text-slate-400 truncate">
                  {tr.bookingId} • {tr.phone}
                </p>
              </div>
            </div>

            {/* Middle & Right: Status Pills & Emergency Contact */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden sm:block text-right space-y-0.5">
                <span className="text-[10px] font-semibold text-slate-400 block">Payment</span>
                <span
                  className={`text-[11px] font-black ${
                    tr.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {tr.paymentStatus}
                </span>
              </div>

              <div className="hidden sm:block text-right space-y-0.5">
                <span className="text-[10px] font-semibold text-slate-400 block">Check-in</span>
                <span
                  className={`text-[11px] font-black ${
                    tr.checkInStatus === 'Checked In' ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {tr.checkInStatus}
                </span>
              </div>

              <div className="hidden md:block text-right space-y-0.5 max-w-[140px] truncate">
                <span className="text-[10px] font-semibold text-slate-400 block">Emergency Contact</span>
                <p className="text-[11px] font-bold text-slate-700 truncate">{tr.emergencyContact.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{tr.emergencyContact.phone}</p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#583BE8] transition-colors shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelerList;
