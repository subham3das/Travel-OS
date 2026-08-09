import React from 'react';
import { Package, Hash, Clock, Calendar, Bus, User, UserCheck } from 'lucide-react';
import { DetailedTripInfo } from '../../data/tripDetails';

interface OverviewGridProps {
  trip: DetailedTripInfo;
}

export const OverviewGrid: React.FC<OverviewGridProps> = ({ trip }) => {
  const items = [
    { label: 'Package', value: trip.packageName, icon: <Package className="w-4 h-4 text-[#583BE8]" /> },
    { label: 'Trip ID', value: trip.tripId, icon: <Hash className="w-4 h-4 text-sky-600" /> },
    { label: 'Duration', value: trip.durationText, icon: <Clock className="w-4 h-4 text-emerald-600" /> },
    { label: 'Departure', value: trip.departureDate, icon: <Calendar className="w-4 h-4 text-amber-600" /> },
    { label: 'Return', value: trip.returnDate, icon: <Calendar className="w-4 h-4 text-rose-600" /> },
    { label: 'Vehicle', value: trip.vehicleName, icon: <Bus className="w-4 h-4 text-indigo-600" /> },
    { label: 'Guide', value: trip.guideName, icon: <User className="w-4 h-4 text-purple-600" /> },
    { label: 'Coordinator', value: trip.coordinatorName, icon: <UserCheck className="w-4 h-4 text-teal-600" /> },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none">
      <h3 className="text-sm font-extrabold text-[#0F172A]">Overview</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/80 space-y-1"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <p className="text-xs font-black text-[#0F172A] truncate" title={item.value}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewGrid;
