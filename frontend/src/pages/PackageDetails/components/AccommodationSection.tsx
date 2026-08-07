import React from 'react';
import { ChevronRight, Star, Wifi, Utensils, ParkingSquare, Flame, MapPin } from 'lucide-react';
import { PackageHotel } from '../../../types/package';

interface AccommodationSectionProps {
  hotels: PackageHotel[];
}

export const AccommodationSection: React.FC<AccommodationSectionProps> = ({ hotels }) => {
  const defaultHotels: PackageHotel[] = hotels && hotels.length > 0 ? hotels : [
    {
      id: 'h1',
      name: 'Pinewood Hotel, Shillong',
      badge: 'Premium',
      rating: 4.6,
      reviewsCount: 128,
      amenities: ['Wi-Fi', 'Restaurant', 'Parking', 'Room Heater'],
      location: 'Police Bazar, Shillong',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'h2',
      name: 'Cherrapunji Holiday Resort',
      badge: 'Resort',
      rating: 4.8,
      reviewsCount: 94,
      amenities: ['Wi-Fi', 'Restaurant', 'Waterfall View'],
      location: 'Laitkynsew, Cherrapunji',
      imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600&auto=format&fit=crop',
    },
  ];

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
          Accommodation
        </h2>
        <button className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-0.5 cursor-pointer">
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {defaultHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="w-80 sm:w-96 bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all shrink-0 flex gap-4 cursor-pointer group"
          >
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
              <img
                src={hotel.imageUrl}
                alt={hotel.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex-1 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm sm:text-base font-extrabold text-[#0F172A] tracking-tight line-clamp-1">
                    {hotel.name}
                  </h3>
                </div>

                {hotel.badge && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 text-[10px] font-bold">
                    {hotel.badge}
                  </span>
                )}

                <div className="flex items-center gap-1 text-xs font-extrabold text-amber-500 pt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{hotel.rating}</span>
                  <span className="text-slate-400 font-normal">({hotel.reviewsCount})</span>
                </div>
              </div>

              {/* Amenities Row */}
              <div className="flex items-center gap-2 flex-wrap text-[10px] font-bold text-slate-600">
                <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-slate-400" /> Wi-Fi</span>
                <span className="flex items-center gap-1"><Utensils className="w-3 h-3 text-slate-400" /> Restaurant</span>
                <span className="flex items-center gap-1"><ParkingSquare className="w-3 h-3 text-slate-400" /> Parking</span>
                <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-slate-400" /> Heater</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                <MapPin className="w-3 h-3 text-[#6356E5]" />
                <span className="truncate">{hotel.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
