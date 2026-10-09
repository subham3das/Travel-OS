import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Star, Calendar, Users, BarChart3, Clock, MapPin, MessageSquare } from 'lucide-react';
import { TourPackage, PackageDepartureInfo } from '../../../types/package';
import { getAdventureEmoji } from '../../../components/home/PackageCard';

interface PackageOverviewProps {
  pkg: TourPackage;
  selectedDeparture?: PackageDepartureInfo | null;
}

export const PackageOverview: React.FC<PackageOverviewProps> = ({ pkg, selectedDeparture }) => {
  const navigate = useNavigate();

  return (
    <div className="relative -mt-6 z-20 w-full bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 border border-slate-100/90 dark:border-white/10 shadow-xs dark:shadow-none space-y-5">
      {/* Header Info Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          {/* Badge Row */}
          <div className="flex items-center gap-2 flex-wrap">
            {pkg.badge && (
              <span className="inline-block px-3 py-0.5 rounded-full bg-[#2563EB] text-white text-[11px] font-bold tracking-tight shadow-xs">
                {pkg.badge}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white tracking-tight leading-tight">
            {pkg.title}
          </h1>

          {/* Agency & Ratings Row */}
          <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            <span>by</span>
            <button
              onClick={() => navigate(`/agency/${pkg.agencyId}`)}
              className="text-[#2563EB] dark:text-[#60A5FA] font-extrabold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>{pkg.agencyName}</span>
              {pkg.agencyVerified !== false && (
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA] fill-[#2563EB]/10 shrink-0" />
              )}
            </button>

            <span className="text-slate-300 dark:text-slate-600">•</span>

            {pkg.reviewCount > 0 && pkg.rating > 0 ? (
              <span className="flex items-center gap-1 font-extrabold text-[#0F172A]">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{pkg.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-semibold">({pkg.reviewCount} Reviews)</span>
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-400">
                No reviews yet
              </span>
            )}

            {pkg.agencyLocation && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium">{pkg.agencyLocation}</span>
              </>
            )}
          </div>
        </div>

        {/* Price Column */}
        <div className="sm:text-right shrink-0">
          <p className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">{pkg.price}</p>
          <p className="text-xs font-semibold text-slate-400">/ person</p>
          <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">Starting from</p>
        </div>
      </div>

      {/* 5 Stats Grid Bar */}
      <div className="grid grid-cols-2 min-[540px]:grid-cols-5 gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#F8F9FC] dark:bg-slate-900/60 border border-slate-100 dark:border-white/10 text-center">
        <div className="flex flex-col items-center justify-center p-1">
          <Calendar className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA] mb-1" />
          <span className="text-xs sm:text-sm font-extrabold text-[#0F172A] dark:text-white whitespace-nowrap">
            {pkg.duration}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">Duration</span>
        </div>

        <div className="flex flex-col items-center justify-center p-1 border-l border-slate-200/60 dark:border-white/10">
          <Users className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA] mb-1" />
          <span className="text-xs sm:text-sm font-extrabold text-[#0F172A] dark:text-white whitespace-nowrap">
            {pkg.groupSize}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">Group Size</span>
        </div>

        <div className="flex flex-col items-center justify-center p-1 border-l border-slate-200/60 dark:border-white/10">
          <BarChart3 className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA] mb-1" />
          <span className="text-xs sm:text-sm font-extrabold text-[#0F172A] dark:text-white whitespace-nowrap">
            {pkg.difficulty}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">Difficulty</span>
        </div>

        <div className="flex flex-col items-center justify-center p-1 border-l border-slate-200/60 dark:border-white/10">
          <Clock className="w-4 h-4 text-sky-500 mb-1" />
          <span className="text-xs sm:text-sm font-extrabold text-[#0F172A] dark:text-white whitespace-nowrap">
            {pkg.bestTime || 'All Year'}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">Best Time</span>
        </div>

        <div className="flex flex-col items-center justify-center p-1 border-l border-slate-200/60 dark:border-white/10">
          <span className="text-base mb-0.5">{getAdventureEmoji(pkg.adventureType)}</span>
          <span className="text-xs sm:text-sm font-extrabold text-[#0F172A] dark:text-white whitespace-nowrap">
            {pkg.adventureType || 'General Adventure'}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">Adventure Type</span>
        </div>
      </div>

      {/* Departure & Live Booking Availability */}
      {(() => {
        const dep = selectedDeparture || pkg.departure;
        const depDate = dep?.departureDate ? new Date(dep.departureDate) : new Date(Date.now() + 7 * 86400000);
        const formattedDepDate = depDate.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        const capacity = dep?.capacity || 20;
        const bookedSeats = dep?.bookedSeats || 0;
        const availableSeats = Math.max(0, capacity - bookedSeats);
        const depStatus = dep?.status || (availableSeats === 0 ? 'SOLDOUT' : 'OPEN');

        return (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FAF9FF] to-[#F3F0FF] dark:from-slate-900 dark:to-slate-850 dark:bg-slate-900 border border-[#E9E4FF] dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA]">
                  Departure Details
                </span>
              </div>

              <div>
                {depStatus === 'OPEN' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                    Booking Status: OPEN
                  </span>
                )}
                {depStatus === 'SOLDOUT' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                    Booking Status: SOLD OUT
                  </span>
                )}
                {depStatus === 'BOOKING_CLOSED' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Booking Status: CLOSED
                  </span>
                )}
                {depStatus === 'ONGOING' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 dark:bg-blue-950/60 text-purple-800 dark:text-blue-300">
                    Booking Status: TRIP ONGOING
                  </span>
                )}
                {depStatus === 'COMPLETED' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                    Booking Status: COMPLETED
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center pt-1">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Departure Date</p>
                <p className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-white mt-0.5">{formattedDepDate}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Capacity</p>
                <p className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-white mt-0.5">{capacity} Seats</p>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Booked Seats</p>
                <p className="text-xs sm:text-sm font-black text-[#2563EB] dark:text-[#60A5FA] mt-0.5">{bookedSeats}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Available Seats</p>
                <p
                  className={`text-xs sm:text-sm font-black mt-0.5 ${
                    availableSeats <= 3 && availableSeats > 0
                      ? 'text-amber-600 dark:text-amber-400'
                      : availableSeats === 0
                      ? 'text-red-500'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {availableSeats}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 shadow-xs col-span-2 sm:col-span-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Booking Status</p>
                <p className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-white mt-0.5">{depStatus}</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Pickup & Drop-off Route summary */}
      {(pkg.pickupCity || pkg.dropOffCity) && (
        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300">
          <MapPin className="w-4 h-4 text-[#2563EB] shrink-0" />
          <div className="flex items-center gap-2 flex-wrap font-medium">
            {pkg.pickupCity && (
              <span><strong className="font-bold text-[#0F172A] dark:text-white">Pickup:</strong> {pkg.pickupCity}</span>
            )}
            {pkg.pickupCity && pkg.dropOffCity && <span className="text-slate-300 dark:text-slate-600">→</span>}
            {pkg.dropOffCity && (
              <span><strong className="font-bold text-[#0F172A] dark:text-white">Drop-off:</strong> {pkg.dropOffCity}</span>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp Community Group Banner */}
      {pkg.whatsappGroupLink && (
        <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/30 gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-950 dark:text-emerald-100 truncate">
                Official Traveler Community
              </p>
              <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300/80 truncate">
                Connect with co-travelers and your tour guide before departure
              </p>
            </div>
          </div>
          <a
            href={pkg.whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shrink-0 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <span>Join WhatsApp Group</span>
          </a>
        </div>
      )}
    </div>
  );
};
