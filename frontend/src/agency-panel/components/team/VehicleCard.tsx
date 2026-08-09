import React from 'react';
import { Bus, RefreshCw } from 'lucide-react';
import { AssignedVehicleInfo } from '../../data/staff';

interface VehicleCardProps {
  vehicle: AssignedVehicleInfo | null;
  onChangeVehicle?: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onChangeVehicle }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none flex-1">
      <div className="flex items-center gap-2">
        <Bus className="w-4 h-4 text-[#583BE8]" />
        <h3 className="text-sm font-extrabold text-[#0F172A]">Vehicle Assignment</h3>
      </div>

      {vehicle ? (
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-3">
          <div className="flex items-center gap-3.5">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-16 h-14 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
            />

            <div className="space-y-0.5 min-w-0 flex-1">
              <h4 className="text-sm font-extrabold text-[#0F172A] truncate">{vehicle.name}</h4>
              <p className="text-xs font-black text-[#583BE8]">{vehicle.registrationNumber}</p>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 pt-0.5">
                <span>👥 {vehicle.capacityText}</span>
                <span>•</span>
                <span>⚙ {vehicle.hasAC ? 'AC' : 'Non-AC'}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onChangeVehicle}
            className="w-full py-2 px-3 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-[#583BE8] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Change Vehicle</span>
          </button>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-50 text-center space-y-2 border border-slate-100">
          <p className="text-xs font-semibold text-slate-400">No vehicle assigned</p>
          <button
            type="button"
            onClick={onChangeVehicle}
            className="px-4 py-2 rounded-xl bg-[#583BE8] text-white text-xs font-extrabold cursor-pointer"
          >
            Assign Vehicle
          </button>
        </div>
      )}
    </div>
  );
};

export default VehicleCard;
