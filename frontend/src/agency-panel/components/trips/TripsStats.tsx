import React from 'react';
import { Package, Users, UserCheck, Bus } from 'lucide-react';
import { TripsQuickStatsData } from '../../data/trips';

interface TripsStatsProps {
  stats: TripsQuickStatsData;
}

export const TripsStats: React.FC<TripsStatsProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 lg:divide-x divide-slate-100 select-none">
      {/* 1: Upcoming Trips */}
      <div className="flex items-center gap-3.5 p-1">
        <div className="w-10 h-10 rounded-2xl bg-purple-100/80 text-[#583BE8] flex items-center justify-center shrink-0">
          <Package className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <span className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight block">
            {stats.upcomingCount}
          </span>
          <span className="text-xs font-bold text-slate-400">Upcoming Trips</span>
        </div>
      </div>

      {/* 2: Total Travelers */}
      <div className="flex items-center gap-3.5 p-1 lg:pl-4">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <span className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight block">
            {stats.totalTravelers}
          </span>
          <span className="text-xs font-bold text-slate-400">Total Travelers</span>
        </div>
      </div>

      {/* 3: Assigned Guides */}
      <div className="flex items-center gap-3.5 p-1 pt-3 sm:pt-1 lg:pl-4">
        <div className="w-10 h-10 rounded-2xl bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
          <UserCheck className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <span className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight block">
            {stats.assignedGuides}
          </span>
          <span className="text-xs font-bold text-slate-400">Assigned Guides</span>
        </div>
      </div>

      {/* 4: Vehicles Assigned */}
      <div className="flex items-center gap-3.5 p-1 pt-3 sm:pt-1 lg:pl-4">
        <div className="w-10 h-10 rounded-2xl bg-sky-100/80 text-sky-600 flex items-center justify-center shrink-0">
          <Bus className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <span className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight block">
            {stats.vehiclesAssigned}
          </span>
          <span className="text-xs font-bold text-slate-400">Vehicles Assigned</span>
        </div>
      </div>
    </div>
  );
};

export default TripsStats;
