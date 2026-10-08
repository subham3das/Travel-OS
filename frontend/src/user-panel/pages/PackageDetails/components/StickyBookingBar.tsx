import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { TourPackage, PackageDepartureInfo } from '../../../types/package';
import { wishlistService } from '../../../services/wishlist.service';
import { useToast } from '../../../context/ToastContext';

interface StickyBookingBarProps {
  pkg: TourPackage;
  selectedDeparture?: PackageDepartureInfo | null;
}

export const StickyBookingBar: React.FC<StickyBookingBarProps> = ({ pkg, selectedDeparture }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(() => wishlistService.isPackageSaved(pkg.id));

  useEffect(() => {
    setIsWishlisted(wishlistService.isPackageSaved(pkg.id));
  }, [pkg.id]);

  const handleToggleWishlist = () => {
    const nextState = wishlistService.toggleSavePackage({
      id: pkg.id,
      title: pkg.title,
      price: pkg.price,
      image: (pkg.gallery && pkg.gallery[0]) || pkg.coverImage,
      agency: pkg.agencyName || 'Verified Partner',
      duration: pkg.duration,
    });
    setIsWishlisted(nextState);
    showToast(nextState ? 'Added to your Wishlist!' : 'Removed from Wishlist', 'info');
  };

  const handleBookNow = () => {
    const activeDep = selectedDeparture || pkg.departure;
    const query = activeDep?.departureId
      ? `?departureId=${encodeURIComponent(activeDep.departureId)}&date=${encodeURIComponent(activeDep.departureDate)}`
      : '';
    navigate(`/booking/checkout/${pkg.id}${query}`);
  };

  // Phase 3: If package is not bookable, completely block booking and show notice
  if (pkg.isBookable === false) {
    return (
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200 p-3.5 sm:p-4 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-amber-800">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span className="text-xs sm:text-sm font-extrabold">
              This departure is currently unavailable.
            </span>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#6356E5] hover:bg-[#5245d6] text-white font-extrabold text-xs shadow-md transition-colors cursor-pointer"
            >
              Explore Similar Trips
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 p-3.5 sm:p-4 shadow-2xl">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Left Price Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleWishlist}
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
        {(() => {
          const dep = selectedDeparture || pkg.departure;
          const isSoldOut = dep?.status === 'SOLDOUT' || (dep && dep.availableSeats <= 0);
          const isClosed = dep?.status === 'BOOKING_CLOSED' || dep?.status === 'COMPLETED';

          if (isSoldOut) {
            return (
              <button
                disabled
                className="py-3 sm:py-3.5 px-6 sm:px-8 rounded-2xl bg-amber-100 text-amber-800 font-extrabold text-xs sm:text-sm cursor-not-allowed opacity-90 flex flex-col items-center justify-center shrink-0 border border-amber-200"
              >
                <span>Sold Out</span>
                <span className="text-[10px] font-medium opacity-80">All seats booked</span>
              </button>
            );
          }

          if (isClosed) {
            return (
              <button
                disabled
                className="py-3 sm:py-3.5 px-6 sm:px-8 rounded-2xl bg-slate-200 text-slate-600 font-extrabold text-xs sm:text-sm cursor-not-allowed opacity-90 flex flex-col items-center justify-center shrink-0"
              >
                <span>Bookings Closed</span>
                <span className="text-[10px] font-medium opacity-80">Registration ended</span>
              </button>
            );
          }

          return (
            <button
              onClick={handleBookNow}
              className="py-3 sm:py-3.5 px-6 sm:px-10 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-[#6356E5]/25 transition-all cursor-pointer focus:outline-none flex flex-col items-center justify-center shrink-0"
            >
              <span>Book Now</span>
              <span className="text-[10px] font-medium opacity-80">
                {dep ? `${dep.availableSeats} spots remaining` : 'Secure your spot'}
              </span>
            </button>
          );
        })()}
      </div>
    </div>
  );
};
