import React from 'react';
import { motion } from 'framer-motion';
import { Bus, Plus, CheckCircle2, ChevronRight, Users, Hash } from 'lucide-react';
import { AssignedVehicle } from '../../data/tripDetails';

const STATUS_STYLES: Record<AssignedVehicle['status'], string> = {
  Available: 'bg-emerald-100 text-emerald-800',
  Assigned: 'bg-blue-100 text-blue-800',
  Maintenance: 'bg-rose-100 text-rose-800',
};

interface VehicleAssignmentCardProps {
  tripId: string;
  vehicleAssignments: AssignedVehicle[] | null;
  bookedTravelersCount: number;
  onNavigateToVehicle: () => void;
}

export const VehicleAssignmentCard: React.FC<VehicleAssignmentCardProps> = ({
  tripId,
  vehicleAssignments,
  bookedTravelersCount,
  onNavigateToVehicle,
}) => {
  const hasVehicles = vehicleAssignments && vehicleAssignments.length > 0;
  const totalSeats = vehicleAssignments?.reduce((sum, v) => sum + v.capacity, 0) ?? 0;
  const availableSeats = totalSeats - bookedTravelersCount;
  const isOverCapacity = hasVehicles && bookedTravelersCount > totalSeats;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.08 }}
      className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0">
            <Bus className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#0F172A]">Assigned Vehicles</h3>
            <p className="text-[11px] font-semibold text-slate-400">
              {hasVehicles ? `${vehicleAssignments!.length} vehicle${vehicleAssignments!.length > 1 ? 's' : ''} assigned` : 'No vehicles assigned'}
            </p>
          </div>
        </div>

        {hasVehicles ? (
          <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        ) : (
          <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Pending
          </span>
        )}
      </div>

      {/* Empty State */}
      {!hasVehicles && (
        <div className="py-6 flex flex-col items-center justify-center gap-3 border border-dashed border-slate-200 rounded-2xl bg-slate-50/60">
          <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
            <Bus className="w-6 h-6 text-sky-600" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs font-extrabold text-[#0F172A]">No vehicles assigned</p>
            <p className="text-[11px] font-medium text-slate-400">Assign from your fleet in Vehicle Management</p>
          </div>
          <button
            type="button"
            onClick={onNavigateToVehicle}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Assign Vehicle</span>
          </button>
        </div>
      )}

      {/* Populated State */}
      {hasVehicles && (
        <div className="space-y-2.5">
          {/* Capacity Summary */}
          <div className={`grid grid-cols-3 gap-2 p-3 rounded-2xl border text-center text-xs ${
            isOverCapacity ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'
          }`}>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block">Total Seats</span>
              <span className="font-extrabold text-[#0F172A]">{totalSeats}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block">Travelers</span>
              <span className={`font-extrabold ${isOverCapacity ? 'text-rose-600' : 'text-[#0F172A]'}`}>
                {bookedTravelersCount}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block">Available</span>
              <span className={`font-extrabold ${availableSeats < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {availableSeats < 0 ? `−${Math.abs(availableSeats)}` : availableSeats}
              </span>
            </div>
          </div>

          {isOverCapacity && (
            <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
              ⚠️ Traveler count exceeds total vehicle capacity!
            </div>
          )}

          {/* Vehicle Cards */}
          <div className="space-y-2">
            {vehicleAssignments!.map((v) => (
              <div key={v.id} className="flex gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <img
                  src={v.image}
                  alt={v.name}
                  className="w-16 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-extrabold text-[#0F172A] truncate">{v.name}</p>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLES[v.status]}`}>
                      {v.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-[10px] font-semibold text-slate-500">
                    <span className="flex items-center gap-1">
                      <Hash className="w-3 h-3" />{v.registrationNumber}
                    </span>
                    <span>•</span>
                    <span>{v.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                    <Users className="w-3 h-3" />
                    <span>{v.capacity} seats</span>
                    <span>•</span>
                    <span>Driver: {v.assignedDriver}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit */}
          <button
            type="button"
            onClick={onNavigateToVehicle}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-slate-600 hover:text-sky-700 text-xs font-extrabold transition-all cursor-pointer"
          >
            <span>Manage Vehicles</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default VehicleAssignmentCard;
