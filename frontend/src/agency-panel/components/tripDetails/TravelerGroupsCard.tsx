import React, { useState } from 'react';
import { Users, Bus, BedDouble, ShieldCheck, ArrowRightLeft } from 'lucide-react';

export interface BookingGroup {
  id: string;
  bookingId: string;
  groupType: 'Partner Booking' | 'Family Booking' | 'Group Booking' | 'Solo Booking';
  primaryTraveler: string;
  members: Array<{ name: string; age?: number; gender?: string }>;
  assignedVehicle: string;
  assignedRoom: string;
}

export const TravelerGroupsCard: React.FC = () => {
  const [groups, setGroups] = useState<BookingGroup[]>([
    {
      id: 'bg-1',
      bookingId: 'BK-2041',
      groupType: 'Group Booking',
      primaryTraveler: 'Subham Das',
      members: [
        { name: 'Subham Das (Primary)' },
        { name: 'Rahul Das' },
        { name: 'Priya Singh' },
        { name: 'Aman Sharma' },
      ],
      assignedVehicle: 'Tempo Traveller Deluxe (UK 07 PA 1234)',
      assignedRoom: 'Rooms 101, 102',
    },
    {
      id: 'bg-2',
      bookingId: 'BK-2042',
      groupType: 'Partner Booking',
      primaryTraveler: 'Rahul Sharma',
      members: [{ name: 'Rahul Sharma (Primary)' }, { name: 'Priya Sharma' }],
      assignedVehicle: 'Tempo Traveller Deluxe (UK 07 PA 1234)',
      assignedRoom: 'Room 103',
    },
    {
      id: 'bg-3',
      bookingId: 'BK-2043',
      groupType: 'Family Booking',
      primaryTraveler: 'Aman Verma',
      members: [
        { name: 'Aman Verma (Primary)' },
        { name: 'Neha Verma' },
        { name: 'Aarav Verma (Child)' },
        { name: 'Kavita Verma' },
      ],
      assignedVehicle: 'Force Urbania Luxury (UK 07 PB 5678)',
      assignedRoom: 'Rooms 201, 202',
    },
  ]);

  const handleVehicleChange = (groupId: string, vehicle: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, assignedVehicle: vehicle } : g))
    );
  };

  const handleRoomChange = (groupId: string, room: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, assignedRoom: room } : g))
    );
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Traveler Groups</h3>
            <p className="text-[11px] font-semibold text-slate-400">
              Preserved booking companions, vehicle & room allocation
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 min-w-0"
          >
            {/* Header Info */}
            <div className="flex items-center justify-between gap-2 flex-wrap min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#583BE8] text-[10px] font-black shrink-0">
                  {group.bookingId}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-extrabold shrink-0">
                  {group.groupType}
                </span>
                <span className="text-xs font-black text-[#0F172A] truncate">
                  Primary: {group.primaryTraveler} ({group.members.length} Travelers)
                </span>
              </div>
            </div>

            {/* Members List Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              {group.members.map((m, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs"
                >
                  👤 {m.name}
                </span>
              ))}
            </div>

            {/* Assignments Controls Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 text-xs font-bold">
              {/* Vehicle Select */}
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1 flex items-center gap-1">
                  <Bus className="w-3 h-3 text-[#583BE8]" />
                  <span>Assigned Vehicle</span>
                </label>
                <select
                  value={group.assignedVehicle}
                  onChange={(e) => handleVehicleChange(group.id, e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 text-xs font-extrabold"
                >
                  <option value="Tempo Traveller Deluxe (UK 07 PA 1234)">Tempo Traveller Deluxe (UK 07 PA 1234)</option>
                  <option value="Force Urbania Luxury (UK 07 PB 5678)">Force Urbania Luxury (UK 07 PB 5678)</option>
                  <option value="Mahindra Scorpio 4x4 (UK 07 PC 9900)">Mahindra Scorpio 4x4 (UK 07 PC 9900)</option>
                </select>
              </div>

              {/* Room Select */}
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1 flex items-center gap-1">
                  <BedDouble className="w-3 h-3 text-[#583BE8]" />
                  <span>Assigned Room(s)</span>
                </label>
                <select
                  value={group.assignedRoom}
                  onChange={(e) => handleRoomChange(group.id, e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 text-xs font-extrabold"
                >
                  <option value="Room 101">Room 101</option>
                  <option value="Room 102">Room 102</option>
                  <option value="Room 103">Room 103</option>
                  <option value="Rooms 101, 102">Rooms 101, 102</option>
                  <option value="Rooms 201, 202">Rooms 201, 202</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelerGroupsCard;
