import React from 'react';
import { DetailedPackage } from '../../../data/packageDetails';
import { Hotel, Utensils, Bus, MapPin } from 'lucide-react';

interface AccommodationCardProps {
  accommodation: DetailedPackage['accommodation'];
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation }) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none overflow-hidden">
      <h3 className="text-sm sm:text-lg font-black text-[#0F172A] flex items-center gap-2 truncate">
        <Hotel className="w-4 h-4 sm:w-5 sm:h-5 text-[#583BE8] shrink-0" />
        <span className="truncate">Accommodation & Transport Details</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Hotel & Room Type */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 text-xs font-black text-[#583BE8]">
            <Hotel className="w-4 h-4 shrink-0" />
            <span>Stay & Lodging</span>
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A] truncate">{accommodation.hotelName}</h4>
            <p className="text-xs font-semibold text-slate-500 truncate">{accommodation.roomType}</p>
          </div>
        </div>

        {/* Meals Included */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 text-xs font-black text-amber-600">
            <Utensils className="w-4 h-4 shrink-0" />
            <span>Meal Plan</span>
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A] truncate">{accommodation.mealsIncluded}</h4>
            <p className="text-xs font-semibold text-slate-500 truncate">Buffet & Local Delicacies</p>
          </div>
        </div>

        {/* Vehicle & Transfers */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 text-xs font-black text-emerald-600">
            <Bus className="w-4 h-4 shrink-0" />
            <span>Vehicle Type</span>
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A] truncate">{accommodation.vehicleType}</h4>
            <p className="text-xs font-semibold text-slate-500 truncate">Includes Fuel & Driver Charges</p>
          </div>
        </div>

        {/* Pickup & Drop Points */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 text-xs font-black text-purple-600">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>Pickup & Drop Hubs</span>
          </div>
          <div className="text-xs font-semibold text-slate-700 space-y-1 min-w-0">
            <p className="truncate"><span className="font-bold text-slate-400">Pickup:</span> {accommodation.pickupLocation}</p>
            <p className="truncate"><span className="font-bold text-slate-400">Drop:</span> {accommodation.dropLocation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;
