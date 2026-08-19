import React from 'react';
import { Compass, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ActiveTripItem } from '../../../types/liveActivityCenter';

interface ActiveTripsWidgetProps {
  trips: ActiveTripItem[];
}

export const ActiveTripsWidget: React.FC<ActiveTripsWidgetProps> = ({ trips }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3 select-none flex flex-col justify-between">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-black text-[#0F172A]">Active Trips Running</h3>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/trips')}
          className="text-[10px] font-bold text-[#6356E5] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2">
        {trips.map((trp) => (
          <div
            key={trp.id}
            onClick={() => navigate(trp.targetRoute)}
            className="p-2.5 rounded-2xl bg-slate-50/70 hover:bg-purple-50/70 border border-slate-100 transition-all cursor-pointer flex items-center justify-between gap-2"
          >
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-[#6356E5]">{trp.id}</span>
                <span className="text-xs font-black text-[#0F172A] truncate">{trp.title}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                {trp.agency} • {trp.destination}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200 text-[9px] font-black">
                {trp.status}
              </span>
              <span className="text-[9px] text-slate-400 font-bold flex items-center gap-0.5">
                <Users className="w-2.5 h-2.5" />
                {trp.travelers} pax
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
