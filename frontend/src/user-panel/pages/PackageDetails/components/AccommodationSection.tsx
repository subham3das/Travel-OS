import React from 'react';
import { ChevronRight, Star, Wifi, Utensils, ParkingSquare, Flame, MapPin, Building, BedDouble } from 'lucide-react';
import { PackageHotel } from '../../../types/package';

interface AccommodationSectionProps {
  hotels?: PackageHotel[];
}

export const AccommodationSection: React.FC<AccommodationSectionProps> = ({ hotels }) => {
  // If no hotels exist or accommodation is unconfirmed, do NOT render the section at all
  if (!hotels || hotels.length === 0) {
    return null;
  }

  const renderAmenityIcon = (am: string) => {
    const lower = am.toLowerCase();
    if (lower.includes('wifi') || lower.includes('wi-fi')) return <Wifi className="w-3 h-3 text-slate-400" />;
    if (lower.includes('food') || lower.includes('restaurant') || lower.includes('breakfast') || lower.includes('dinner')) return <Utensils className="w-3 h-3 text-slate-400" />;
    if (lower.includes('parking')) return <ParkingSquare className="w-3 h-3 text-slate-400" />;
    if (lower.includes('heat') || lower.includes('fire')) return <Flame className="w-3 h-3 text-slate-400" />;
    return <Building className="w-3 h-3 text-slate-400" />;
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
          Accommodation
        </h2>
        {hotels.length > 2 && (
          <button className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-0.5 cursor-pointer">
            <span>View All ({hotels.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="w-80 sm:w-96 bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all shrink-0 flex gap-4 cursor-pointer group"
          >
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
              {hotel.imageUrl ? (
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <Building className="w-10 h-10 text-slate-300" />
              )}
            </div>

            <div className="flex-1 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm sm:text-base font-extrabold text-[#0F172A] tracking-tight line-clamp-1">
                    {hotel.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {hotel.badge && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 text-[10px] font-bold">
                      {hotel.badge}
                    </span>
                  )}
                  {(hotel as any).roomType && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                      <BedDouble className="w-2.5 h-2.5" />
                      {(hotel as any).roomType}
                    </span>
                  )}
                </div>

                {hotel.rating > 0 && (
                  <div className="flex items-center gap-1 text-xs font-extrabold text-amber-500 pt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{hotel.rating}</span>
                    {hotel.reviewsCount > 0 && (
                      <span className="text-slate-400 font-normal">({hotel.reviewsCount})</span>
                    )}
                  </div>
                )}
              </div>

              {/* Real Amenities Row */}
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap text-[10px] font-bold text-slate-600">
                  {hotel.amenities.slice(0, 3).map((am, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      {renderAmenityIcon(am)}
                      <span>{am}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Location */}
              {hotel.location && (
                <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                  <MapPin className="w-3 h-3 text-[#6356E5]" />
                  <span className="truncate">{hotel.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
