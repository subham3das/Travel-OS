import React from 'react';
import { ChevronRight, Footprints, Anchor, Mountain, Waves, Tent } from 'lucide-react';
import { PackageActivity } from '../../../types/package';

interface ActivitiesSectionProps {
  activities: PackageActivity[];
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ activities }) => {
  const defaultActivities: PackageActivity[] = activities && activities.length > 0 ? activities : [
    { id: 'a1', title: 'Trekking', iconName: 'Trekking', imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop' },
    { id: 'a2', title: 'Boating', iconName: 'Boating', imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400&auto=format&fit=crop' },
    { id: 'a3', title: 'Caving', iconName: 'Caving', imageUrl: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=400&auto=format&fit=crop' },
    { id: 'a4', title: 'Waterfalls', iconName: 'Waterfalls', imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400&auto=format&fit=crop' },
    { id: 'a5', title: 'Camping', iconName: 'Camping', imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop' },
  ];

  const getIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('trek')) return <Footprints className="w-4 h-4 text-emerald-600" />;
    if (lower.includes('boat')) return <Anchor className="w-4 h-4 text-sky-600" />;
    if (lower.includes('cave')) return <Mountain className="w-4 h-4 text-amber-600" />;
    if (lower.includes('waterfall')) return <Waves className="w-4 h-4 text-indigo-600" />;
    if (lower.includes('camp')) return <Tent className="w-4 h-4 text-emerald-600" />;
    return <Footprints className="w-4 h-4 text-[#6356E5]" />;
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
          Top Activities
        </h2>
        <button className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-0.5 cursor-pointer">
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-5 gap-3">
        {defaultActivities.map((act) => (
          <div
            key={act.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100/90 shadow-2xs hover:shadow-md transition-all flex flex-col group cursor-pointer"
          >
            <div className="h-24 sm:h-28 w-full overflow-hidden bg-slate-100">
              <img
                src={act.imageUrl}
                alt={act.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-2.5 flex items-center justify-center gap-1.5 bg-white text-center">
              {getIcon(act.title)}
              <span className="text-xs font-extrabold text-[#0F172A] tracking-tight">
                {act.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
