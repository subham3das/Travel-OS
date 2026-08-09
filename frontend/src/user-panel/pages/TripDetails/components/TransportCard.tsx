import React from 'react';
import { Truck, MapPin, Clock, Phone, UserCheck } from 'lucide-react';
import { Trip } from '../../../data/trips';

interface TransportCardProps {
  trip: Trip;
}

export const TransportCard: React.FC<TransportCardProps> = ({ trip }) => {
  const { vehicle } = trip;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Assigned Transport Vehicle</h3>
            <p className="text-[11px] font-semibold text-slate-400">Driver details, pickup location & scheduled timing</p>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
          {vehicle.type}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Vehicle Name & Number */}
        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1">
          <span className="text-[10px] font-bold text-amber-800 uppercase block">Vehicle</span>
          <p className="font-black text-[#0F172A]">{vehicle.name}</p>
          <p className="text-[11px] font-bold text-slate-500">Plate Number: {vehicle.number}</p>
        </div>

        {/* Driver Info */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Assigned Driver</span>
          <p className="font-extrabold text-[#0F172A] flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> {vehicle.driverName}
          </p>
          <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Phone className="w-3 h-3 text-slate-400" /> {vehicle.driverPhone}
          </p>
        </div>

        {/* Pickup Location & Time */}
        <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1 sm:col-span-2">
          <span className="text-[10px] font-black text-[#583BE8] uppercase block">Scheduled Pickup Point</span>
          <p className="font-black text-[#0F172A] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#FF4D6D] shrink-0" />
            {vehicle.pickupLocation}
          </p>
          <p className="text-[11px] font-bold text-purple-700 flex items-center gap-1 pl-5">
            <Clock className="w-3.5 h-3.5" /> Pickup Time: {vehicle.pickupTime}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransportCard;
