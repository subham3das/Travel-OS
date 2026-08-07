import React from 'react';
import { Calendar, Mountain, Globe2, Camera, Users, User } from 'lucide-react';

export interface ProfileStat {
  id: string;
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const defaultStats: ProfileStat[] = [
  { id: 'trips', label: 'Trips', value: '24', icon: <Calendar className="w-5 h-5" />, color: 'text-purple-600' },
  { id: 'states', label: 'States', value: '15', icon: <Mountain className="w-5 h-5" />, color: 'text-emerald-600' },
  { id: 'countries', label: 'Countries', value: '2', icon: <Globe2 className="w-5 h-5" />, color: 'text-amber-600' },
  { id: 'posts', label: 'Posts', value: '182', icon: <Camera className="w-5 h-5" />, color: 'text-[#FF4D6D]' },
  { id: 'followers', label: 'Followers', value: '1.2K', icon: <Users className="w-5 h-5" />, color: 'text-sky-600' },
  { id: 'following', label: 'Following', value: '356', icon: <User className="w-5 h-5" />, color: 'text-purple-600' },
];

export const TravelStatsBar: React.FC = () => {
  return (
    <div className="w-full rounded-3xl bg-white border border-slate-100 p-4 shadow-2xs grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-0 sm:divide-x divide-slate-100 text-center">
      {defaultStats.map((stat) => (
        <div key={stat.id} className="p-2 space-y-1">
          <div className={`mx-auto w-8 h-8 flex items-center justify-center ${stat.color}`}>
            {stat.icon}
          </div>
          <h4 className="text-base sm:text-lg font-black text-[#0F172A] leading-none">
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
