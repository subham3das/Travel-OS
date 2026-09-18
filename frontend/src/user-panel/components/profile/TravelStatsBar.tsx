import React from 'react';
import { Calendar, Mountain, Globe2, Wallet, Star, CheckCircle2 } from 'lucide-react';

export interface TravelStatsData {
  totalTrips: number;
  upcomingTrips: number;
  completedTrips: number;
  countriesVisited: number;
  lifetimeSpend: string;
  avgRatingGiven: number;
}

interface TravelStatsBarProps {
  stats?: Partial<TravelStatsData>;
}

export const TravelStatsBar: React.FC<TravelStatsBarProps> = ({ stats }) => {
  const currentStats = {
    totalTrips: stats?.totalTrips ?? 0,
    upcomingTrips: stats?.upcomingTrips ?? 0,
    completedTrips: stats?.completedTrips ?? 0,
    countriesVisited: stats?.countriesVisited ?? 0,
    lifetimeSpend: stats?.lifetimeSpend || '₹0',
    avgRatingGiven: stats?.avgRatingGiven ?? 5.0,
  };

  const statItems = [
    { id: 'total', label: 'Total Trips', value: currentStats.totalTrips, icon: <Calendar className="w-5 h-5" />, color: 'text-[#583BE8]' },
    { id: 'upcoming', label: 'Upcoming', value: currentStats.upcomingTrips, icon: <Mountain className="w-5 h-5" />, color: 'text-purple-600' },
    { id: 'completed', label: 'Completed', value: currentStats.completedTrips, icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-600' },
    { id: 'countries', label: 'Countries', value: currentStats.countriesVisited, icon: <Globe2 className="w-5 h-5" />, color: 'text-amber-600' },
    { id: 'spend', label: 'Lifetime Spend', value: currentStats.lifetimeSpend, icon: <Wallet className="w-5 h-5" />, color: 'text-sky-600' },
    { id: 'rating', label: 'Avg Rating', value: `${currentStats.avgRatingGiven} ★`, icon: <Star className="w-5 h-5" />, color: 'text-[#FF4D6D]' },
  ];

  return (
    <div className="w-full rounded-3xl bg-white border border-slate-100 p-4 shadow-2xs grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-0 sm:divide-x divide-slate-100 text-center select-none">
      {statItems.map((stat) => (
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
