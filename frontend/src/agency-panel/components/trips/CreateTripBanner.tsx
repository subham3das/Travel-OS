import React from 'react';
import { Plus } from 'lucide-react';

interface CreateTripBannerProps {
  onCreateTrip?: () => void;
}

export const CreateTripBanner: React.FC<CreateTripBannerProps> = ({ onCreateTrip }) => {
  return (
    <div className="bg-gradient-to-br from-purple-50/90 via-indigo-50/50 to-white rounded-3xl p-5 sm:p-6 border border-purple-100/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 select-none">
      {/* Left: Vector Illustration Graphic & Text */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-purple-100 shadow-2xs flex items-center justify-center shrink-0">
          <svg className="w-10 h-10 text-[#583BE8]" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.6947 13.7H15.7037M15.6947 16.7H15.7037M11.9955 13.7H12.0045M11.9955 16.7H12.0045M8.29431 13.7H8.30331M8.29431 16.7H8.30331"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
            Plan your next trip batch
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Create a new trip batch and start receiving bookings.
          </p>
        </div>
      </div>

      {/* Right Button */}
      <button
        type="button"
        onClick={onCreateTrip}
        className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#583BE8]/25 transition-all cursor-pointer shrink-0"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Create Trip</span>
      </button>
    </div>
  );
};

export default CreateTripBanner;
