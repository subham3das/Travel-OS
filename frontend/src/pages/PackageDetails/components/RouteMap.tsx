import React from 'react';
import { ChevronRight, Car, Clock, Navigation, MapPin, Camera } from 'lucide-react';
import { TourPackage } from '../../../types/package';

interface RouteMapProps {
  routeDetails?: TourPackage['routeDetails'];
  destinationName: string;
}

export const RouteMap: React.FC<RouteMapProps> = ({ routeDetails, destinationName }) => {
  const details = routeDetails || {
    distance: '320 KM Total',
    travelTime: '10 - 11 Hours',
    highway: 'Via NH6 & NH127B',
    stops: ['Guwahati', 'Shillong', 'Cherrapunji', 'Mawlynnong', 'Dawki', 'Guwahati'],
  };

  const handleOpenGoogleMaps = () => {
    const query = encodeURIComponent(`${destinationName} travel route`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
          Trip Route
        </h2>
        <button
          onClick={handleOpenGoogleMaps}
          className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <span>View on Map</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="bg-[#F8F9FC] rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4">
        {/* Illustrated Route Graphic Banner */}
        <div className="relative w-full bg-white rounded-2xl p-4 sm:p-6 border border-purple-100/80 shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none py-2">
            {details.stops.map((stop, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black shadow-2xs ${
                      idx === 0 || idx === details.stops.length - 1
                        ? 'bg-[#6356E5] text-white'
                        : 'bg-purple-100 text-[#6356E5]'
                    }`}
                  >
                    {idx === 0 || idx === details.stops.length - 1 ? (
                      <MapPin className="w-4 h-4" />
                    ) : (
                      <Camera className="w-3.5 h-3.5 text-[#6356E5]" />
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs font-extrabold text-[#0F172A] whitespace-nowrap">
                    {stop}
                  </span>
                </div>

                {idx < details.stops.length - 1 && (
                  <div className="flex-1 min-w-[30px] sm:min-w-[50px] border-t-2 border-dashed border-[#6356E5]/40 self-center -mt-4" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Route Stats Bar */}
        <div className="flex items-center justify-around gap-2 text-xs font-bold text-slate-600 flex-wrap pt-1">
          <span className="flex items-center gap-1.5">
            <Car className="w-4 h-4 text-slate-500" />
            <span>{details.distance}</span>
          </span>

          <span className="text-slate-300">•</span>

          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>{details.travelTime}</span>
          </span>

          <span className="text-slate-300">•</span>

          <span className="flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-slate-500" />
            <span>{details.highway}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
