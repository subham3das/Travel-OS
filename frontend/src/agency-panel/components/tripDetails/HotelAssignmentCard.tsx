import React from 'react';
import { Building2, BedDouble, CheckCircle2, RefreshCw } from 'lucide-react';

export interface HotelInfo {
  id: string;
  name: string;
  location: string;
  roomType: string;
  totalRooms: number;
  occupancyText: string;
  status: 'Confirmed' | 'Pending';
}

export const HotelAssignmentCard: React.FC = () => {
  const hotels: HotelInfo[] = [
    {
      id: 'h-1',
      name: 'Grand Palace Hotel & Resort',
      location: 'Leh City Center',
      roomType: 'Deluxe Mountain View Rooms',
      totalRooms: 9,
      occupancyText: '18 Travelers / 9 Rooms',
      status: 'Confirmed',
    },
    {
      id: 'h-[#]',
      name: 'Apple Orchard Wooden Camps',
      location: 'Nubra Valley',
      roomType: 'Luxury Swiss Tents',
      totalRooms: 9,
      occupancyText: '18 Travelers / 9 Tents',
      status: 'Confirmed',
    },
  ];

  const handleHotelAction = (action: string, name: string) => {
    alert(`${action} triggered for "${name}".`);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Hotel & Stay Assignments</h3>
            <p className="text-[11px] font-semibold text-slate-400">
              Hotels selected during package creation
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {hotels.map((h) => (
          <div
            key={h.id}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 min-w-0"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-black text-[#0F172A] truncate">{h.name}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    ✓ {h.status}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-500 truncate">
                  📍 {h.location} • {h.roomType}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-black text-[#583BE8] block">{h.occupancyText}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleHotelAction('Change Hotel', h.name)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Change Hotel</span>
              </button>

              <button
                type="button"
                onClick={() => handleHotelAction('Assign Rooms', h.name)}
                className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 text-[#583BE8] text-xs font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <BedDouble className="w-3.5 h-3.5" />
                <span>Assign Rooms</span>
              </button>

              <button
                type="button"
                onClick={() => handleHotelAction('View Occupancy', h.name)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer ml-auto"
              >
                View Occupancy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelAssignmentCard;
