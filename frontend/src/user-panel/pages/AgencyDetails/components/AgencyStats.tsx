import React from 'react';
import { Briefcase, Calendar, MapPin, Users, Star, ThumbsUp } from 'lucide-react';
import { Agency } from '../../../types/agency';

interface AgencyStatsProps {
  agency: Agency;
}

export const AgencyStats: React.FC<AgencyStatsProps> = ({ agency }) => {
  const stats = [
    { label: 'Trips', value: agency.tripsCompleted, icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[#6356E5]" /> },
    { label: 'Years', value: `${agency.yearsExperience}+`, icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#6356E5]" /> },
    { label: 'Destinations', value: `${agency.destinationsCount}+`, icon: <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#6356E5]" /> },
    { label: 'Tour Guides', value: `${agency.guidesCount}+`, icon: <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#6356E5]" /> },
    { label: 'Rating', value: String(agency.rating), icon: <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500" /> },
  ];

  return (
    <div className="space-y-3">
      {/* 5 Stats Grid */}
      <div className="w-full bg-[#F5F3FF] rounded-3xl p-3 sm:p-5 border border-purple-100 shadow-2xs">
        <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center divide-x divide-purple-200/60">
          {stats.map((st, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 px-0.5 sm:px-1 min-w-0">
              <div className="mb-0.5">{st.icon}</div>
              <span className="text-sm sm:text-xl font-black text-[#0F172A] tracking-tight whitespace-nowrap">
                {st.value}
              </span>
              <span className="text-[9px] min-[380px]:text-[10px] sm:text-xs font-extrabold text-slate-500 whitespace-nowrap tracking-tighter sm:tracking-normal">
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Recommendation Banner */}
      <div className="bg-emerald-50/80 rounded-2xl p-3 border border-emerald-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <ThumbsUp className="w-4 h-4 fill-current" />
          </div>
          <div>
            <p className="text-xs font-black text-[#0F172A]">
              Recommended by <span className="text-emerald-700">2,456 Travelers</span>
            </p>
            <p className="text-[11px] font-semibold text-slate-500">
              96% positive recommendation rate from verified bookings
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-black shrink-0">
          96% Rate
        </span>
      </div>
    </div>
  );
};
