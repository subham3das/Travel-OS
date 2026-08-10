import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { TourPackage } from '../../../types/package';

interface StickyBookingBarProps {
  pkg: TourPackage;
}

export const StickyBookingBar: React.FC<StickyBookingBarProps> = ({ pkg }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleBookNow = () => {
    navigate(`/booking/checkout/${pkg.id}`);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 p-3.5 sm:p-4 shadow-2xl">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Left Price Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="w-11 h-11 rounded-2xl border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 transition-all cursor-pointer focus:outline-none shrink-0"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isWishlisted ? 'fill-[#FF4D6D] text-[#FF4D6D]' : 'text-slate-600'
              }`}
            />
          </button>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Starting from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                {pkg.price}
              </span>
              <span className="text-xs font-semibold text-slate-500">/ person</span>
            </div>
          </div>
        </div>

        {/* Book Now Primary Button */}
        <button
          onClick={handleBookNow}
          className="py-3 sm:py-3.5 px-6 sm:px-10 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-[#6356E5]/25 transition-all cursor-pointer focus:outline-none flex flex-col items-center justify-center shrink-0"
        >
          <span>Book Now</span>
          <span className="text-[10px] font-medium opacity-80">Secure your spot</span>
        </button>
      </div>
    </div>
  );
};
