import React from 'react';
import { Building, MapPin, Clock, Phone, ExternalLink } from 'lucide-react';
import { Trip } from '../../../data/trips';

interface HotelCardProps {
  trip: Trip;
}

export const HotelCard: React.FC<HotelCardProps> = ({ trip }) => {
  // If it's a car rental trip without hotel accommodation, don't show an empty hotel card
  if (trip?.tripType === 'car_rental' && !trip?.hotel) {
    return null;
  }

  const hotel = trip?.hotel || (trip as any)?.assignedHotel;
  if (!hotel) return null;

  const hotelName = hotel.name || 'Confirmed Stay';
  const hotelAddress = hotel.address || hotel.roomType || 'Details provided in booking voucher';
  const roomType = hotel.roomType || 'Standard AC Room';
  const contactPhone = hotel.contactPhone || (hotel as any)?.contactNumber || '';
  const checkIn = hotel.checkIn || '12:00 PM';
  const checkOut = hotel.checkOut || '11:00 AM';

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-sky-600" />
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Hotel & Accommodation</h3>
            <p className="text-[11px] font-semibold text-slate-400">Confirmed stay details & check-in timings</p>
          </div>
        </div>
        <span className="text-[10px] font-black text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
          Confirmed
        </span>
      </div>

      <div className="space-y-3 text-xs">
        <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-2">
          <h4 className="text-base font-black text-[#0F172A]">{hotelName}</h4>
          <p className="text-xs font-semibold text-slate-500 flex items-start gap-1.5">
            <MapPin className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
            <span>{hotelAddress}</span>
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-sky-100/80 font-semibold text-slate-600">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Room Category</span>
              <span className="font-extrabold text-[#0F172A]">{roomType}</span>
            </div>

            {contactPhone && (
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Contact Phone</span>
                <span className="font-extrabold text-sky-700 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {contactPhone}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Timings & Google Maps Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3 text-xs font-extrabold text-slate-700">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" /> Check-in: {checkIn}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-rose-600" /> Check-out: {checkOut}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelName)}`,
                '_blank'
              )
            }
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[#0F172A] hover:bg-slate-50 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>View Map</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
