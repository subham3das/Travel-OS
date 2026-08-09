import React from 'react';
import { Calendar, Mountain, Globe2, Wallet, Star, CheckCircle2 } from 'lucide-react';
import { USER_TRAVEL_STATS } from '../../data/trips';

export const TravelStatsBar: React.FC = () => {
  const stats = [
    { id: 'total', label: 'Total Trips', value: USER_TRAVEL_STATS.totalTrips, icon: <Calendar className="w-5 h-5" />, color: 'text-[#583BE8]' },
    { id: 'upcoming', label: 'Upcoming', value: USER_TRAVEL_STATS.upcomingTrips, icon: <Mountain className="w-5 h-5" />, color: 'text-purple-600' },
    { id: 'completed', label: 'Completed', value: USER_TRAVEL_STATS.completedTrips, icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-600' },
    { id: 'countries', label: 'Countries', value: USER_TRAVEL_STATS.countriesVisited, icon: <Globe2 className="w-5 h-5" />, color: 'text-amber-600' },
    { id: 'spend', label: 'Lifetime Spend', value: USER_TRAVEL_STATS.lifetimeSpend, icon: <Wallet className="w-5 h-5" />, color: 'text-sky-600' },
    { id: 'rating', label: 'Avg Rating', value: `${USER_TRAVEL_STATS.avgRatingGiven} ★`, icon: <Star className="w-5 h-5" />, color: 'text-[#FF4D6D]' },
  ];

  return (
    <div className="w-full rounded-3xl bg-white border border-slate-100 p-4 shadow-2xs grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-0 sm:divide-x divide-slate-100 text-center select-none">
      {stats.map((stat) => (
        <div key={stat.id} className="p-2 space-y-1">
          <div className={`mx-auto w-8 h-8 flex items-center justify-center ${stat.color}`}>
            {stat.icon}
          </div>
          <h4 className="text-sm sm:text-base font-black text-[#0F172A] leading-none">
            {stat.value}
          </h4>
          <p className="text-[11px] font-semibold text-slate-400 leading-none">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TravelStatsBar;
