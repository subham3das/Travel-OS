import React from 'react';
import { Calendar, MapPin, Navigation, Car, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ItineraryMap: React.FC = () => {
  const navigate = useNavigate();

  const days = [
    { day: 1, title: 'Guwahati Arrival', isDone: true },
    { day: 2, title: 'Shillong Sightseeing', isDone: false },
    { day: 3, title: 'Cherrapunji Exploration', isDone: false },
    { day: 4, title: 'Mawlynnong & Dawki', isDone: false },
    { day: 5, title: 'Guwahati Departure', isDone: false },
  ];

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
          Itinerary & Route (Meghalaya Adventure)
        </h3>
        <button
          onClick={() => navigate('/package/pkg-meghalaya-7d')}
          className="text-xs sm:text-sm font-bold text-[#6356E5] hover:underline focus:outline-none flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>View Full Itinerary</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="rounded-3xl bg-white border border-slate-100/90 shadow-2xs overflow-hidden flex flex-col md:flex-row">
        {/* Left Column: Timeline list */}
        <div className="p-4 sm:p-5 md:w-80 space-y-3 border-b md:border-b-0 md:border-r border-slate-100 shrink-0">
          <div className="space-y-2.5">
            {days.map((item) => (
              <div key={item.day} className="flex items-center gap-3 text-xs sm:text-sm">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    item.isDone ? 'bg-[#6356E5] text-white' : 'bg-purple-100 text-[#6356E5]'
                  }`}
                >
                  ✓
                </span>
                <span className="font-extrabold text-[#0F172A]">Day {item.day}</span>
                <span className="text-slate-500 font-medium line-clamp-1">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Route Map Illustration */}
        <div className="relative flex-1 h-56 md:h-auto bg-emerald-50/40 p-4 flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full text-[#6356E5]" viewBox="0 0 500 250" fill="none">
            <path
              d="M 50 120 C 120 40, 220 50, 280 140 C 340 220, 420 180, 460 90"
              stroke="#6356E5"
              strokeWidth="4"
              strokeDasharray="8 6"
            />
          </svg>

          {/* Map Pins */}
          <div className="absolute top-12 left-10 bg-white shadow-md border border-slate-100 px-3 py-1 rounded-xl text-[10px] font-extrabold text-[#0F172A]">
            📍 Day 1: Guwahati
          </div>
          <div className="absolute top-16 right-28 bg-white shadow-md border border-slate-100 px-3 py-1 rounded-xl text-[10px] font-extrabold text-[#0F172A]">
            📍 Day 2: Shillong
          </div>
          <div className="absolute bottom-10 right-32 bg-white shadow-md border border-slate-100 px-3 py-1 rounded-xl text-[10px] font-extrabold text-[#0F172A]">
            📍 Day 3: Cherrapunji
          </div>
          <div className="absolute bottom-6 left-36 bg-white shadow-md border border-slate-100 px-3 py-1 rounded-xl text-[10px] font-extrabold text-[#0F172A]">
            📍 Day 4: Dawki
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-white border border-slate-100 text-xs font-semibold text-slate-600 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#6356E5]" />
          <span>5 Days / 4 Nights</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#6356E5]" />
          <span>4 Destinations</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-[#6356E5]" />
          <span>~320 KM Total</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <Car className="w-3.5 h-3.5 text-[#6356E5]" />
          <span>Private Vehicle</span>
        </div>
      </div>
    </div>
  );
};
