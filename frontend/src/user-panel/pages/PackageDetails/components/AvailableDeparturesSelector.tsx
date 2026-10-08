import React from 'react';
import { Calendar, Users, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { PackageDepartureInfo } from '../../../types/package';

interface AvailableDeparturesSelectorProps {
  departures: PackageDepartureInfo[];
  selectedDepartureId?: string;
  onSelectDeparture: (departure: PackageDepartureInfo) => void;
  packagePrice?: string;
}

export const AvailableDeparturesSelector: React.FC<AvailableDeparturesSelectorProps> = ({
  departures,
  selectedDepartureId,
  onSelectDeparture,
  packagePrice,
}) => {
  if (!departures || departures.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-white/10 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
          <Calendar className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
          <h2 className="text-base sm:text-lg font-black tracking-tight">Available Departures</h2>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>No upcoming departures currently scheduled for this tour package.</span>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return {
        full: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        weekday: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      };
    } catch {
      return { full: dateStr, weekday: '' };
    }
  };

  return (
    <section className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-white/10 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-[#0F172A] dark:text-white">
            <Calendar className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
            <h2 className="text-base sm:text-lg font-black tracking-tight">Available Departures</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA]">
              {departures.length} Scheduled {departures.length === 1 ? 'Date' : 'Dates'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Select your preferred departure date before proceeding to book.
          </p>
        </div>
      </div>

      {/* Departures Grid / List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {departures.map((dep) => {
          const isSelected = selectedDepartureId === dep.departureId || selectedDepartureId === (dep as any).id;
          const { full: depDateFormatted, weekday } = formatDate(dep.departureDate);
          const availableSeats = dep.availableSeats !== undefined
            ? dep.availableSeats
            : Math.max(0, dep.capacity - (dep.bookedSeats || 0));

          const isSoldOut = dep.status === 'SOLDOUT' || availableSeats <= 0;
          const isClosed = dep.status === 'BOOKING_CLOSED' || dep.status === 'COMPLETED';
          const isSelectable = !isSoldOut && !isClosed && (dep.isSelectable !== false);

          return (
            <button
              key={dep.departureId || (dep as any).id}
              type="button"
              disabled={!isSelectable}
              onClick={() => {
                if (isSelectable) {
                  onSelectDeparture(dep);
                }
              }}
              className={`relative text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'border-[#2563EB] bg-[#2563EB]/5 dark:bg-[#2563EB]/10 shadow-sm ring-2 ring-[#2563EB]/20'
                  : isSelectable
                  ? 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-white dark:bg-slate-900/50'
                  : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/30 opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Radio Indicator & Date */}
              <div className="flex items-start justify-between gap-3 w-full">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div
                    className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[#2563EB] bg-[#2563EB]'
                        : isSelectable
                        ? 'border-slate-300 dark:border-slate-600'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-100'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-black text-[#0F172A] dark:text-white truncate">
                      {depDateFormatted}
                    </p>
                    {weekday && (
                      <p className="text-[11px] font-semibold text-slate-400">
                        {weekday} departure
                      </p>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <span className="shrink-0 flex items-center gap-1 text-[11px] font-black text-[#2563EB] dark:text-[#60A5FA]">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Selected</span>
                  </span>
                )}
              </div>

              {/* Status & Seat Info */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2 text-xs">
                {isSoldOut ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                    Sold Out
                  </span>
                ) : isClosed ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Booking Closed
                  </span>
                ) : availableSeats <= 5 ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>Only {availableSeats} {availableSeats === 1 ? 'Seat' : 'Seats'} Left</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1">
                    <Users className="w-3 h-3 text-emerald-600" />
                    <span>{availableSeats} Seats Left</span>
                  </span>
                )}

                {dep.price ? (
                  <span className="font-black text-xs text-[#0F172A] dark:text-white">
                    ₹{dep.price.toLocaleString('en-IN')}
                  </span>
                ) : packagePrice ? (
                  <span className="font-semibold text-[11px] text-slate-500">
                    {packagePrice}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default AvailableDeparturesSelector;
