import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Eye,
  Clock,
  Users,
  Phone,
  DollarSign,
  Download,
  XCircle,
  Star,
} from 'lucide-react';
import { AdminTripItem } from '../../../types/tripManagement';

interface TripTableRowProps {
  trip: AdminTripItem;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onViewDetails: (trip: AdminTripItem) => void;
  onOpenTimeline: (trip: AdminTripItem) => void;
  onViewTravelers: (trip: AdminTripItem) => void;
  onContactAgency: (trip: AdminTripItem) => void;
  onContactGuide: (trip: AdminTripItem) => void;
  onExportTrip: (trip: AdminTripItem) => void;
  onCancelTrip: (trip: AdminTripItem) => void;
}

export const TripTableRow: React.FC<TripTableRowProps> = ({
  trip,
  isSelected,
  onToggleSelect,
  onViewDetails,
  onOpenTimeline,
  onViewTravelers,
  onContactAgency,
  onContactGuide,
  onExportTrip,
  onCancelTrip,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const getStatusBadge = (status: AdminTripItem['status']) => {
    switch (status) {
      case 'Running':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            Running
          </span>
        );
      case 'Upcoming':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
            Upcoming
          </span>
        );
      case 'Completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200">
            Completed
          </span>
        );
      case 'Delayed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
            Delayed
          </span>
        );
      case 'Cancelled':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
            Cancelled
          </span>
        );
    }
  };

  const getProgressBarColor = (status: AdminTripItem['status']) => {
    switch (status) {
      case 'Running':
        return 'bg-emerald-500';
      case 'Upcoming':
        return 'bg-blue-500';
      case 'Completed':
        return 'bg-slate-700';
      case 'Delayed':
        return 'bg-amber-500';
      case 'Cancelled':
      default:
        return 'bg-rose-400';
    }
  };

  return (
    <tr
      className={`transition-colors font-semibold group ${
        isSelected ? 'bg-purple-50/70' : 'hover:bg-slate-50/80'
      }`}
    >
      {/* 1. Checkbox */}
      <td className="py-3 px-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(trip.id)}
          className="w-4 h-4 rounded-md border-slate-300 text-[#6356E5] focus:ring-[#6356E5] cursor-pointer"
        />
      </td>

      {/* 2. Trip ID */}
      <td className="py-3 px-3">
        <button
          onClick={() => onViewDetails(trip)}
          className="font-mono font-bold text-xs text-[#6356E5] hover:underline cursor-pointer text-left"
        >
          {trip.id}
        </button>
      </td>

      {/* 3. Package Name + Image */}
      <td className="py-3 px-3">
        <div
          onClick={() => onViewDetails(trip)}
          className="flex items-center gap-2.5 min-w-[170px] cursor-pointer"
        >
          <img
            src={trip.packageImage}
            alt={trip.packageName}
            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
          />
          <span className="font-bold text-xs text-[#0F172A] group-hover:text-[#6356E5] transition-colors truncate">
            {trip.packageName}
          </span>
        </div>
      </td>

      {/* 4. Destination */}
      <td className="py-3 px-3 text-xs text-slate-700 whitespace-nowrap">
        {trip.destination}
      </td>

      {/* 5. Agency */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-2 min-w-[140px]">
          <img
            src={trip.agencyLogo}
            alt={trip.agencyName}
            className="w-5 h-5 rounded-md object-cover border border-slate-200 shrink-0"
          />
          <span className="text-xs text-slate-800 font-bold truncate">
            {trip.agencyName}
          </span>
        </div>
      </td>

      {/* 6. Guide */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-2 min-w-[130px]">
          <div className="relative shrink-0">
            <img
              src={trip.guide.avatar}
              alt={trip.guide.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
            {trip.guide.isOnline && (
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </div>
          <span className="text-xs text-slate-800 font-bold truncate">
            {trip.guide.name}
          </span>
        </div>
      </td>

      {/* 7. Departure */}
      <td className="py-3 px-3 text-xs text-slate-600 font-medium whitespace-nowrap font-mono">
        {trip.departureDate}
      </td>

      {/* 8. Return */}
      <td className="py-3 px-3 text-xs text-slate-600 font-medium whitespace-nowrap font-mono">
        {trip.returnDate}
      </td>

      {/* 9. Travelers */}
      <td className="py-3 px-3 text-xs text-slate-800 font-black text-center font-mono">
        {trip.travelersCount}
      </td>

      {/* 10. Vehicle */}
      <td className="py-3 px-3 text-xs text-slate-600 whitespace-nowrap">
        {trip.vehicleType}
      </td>

      {/* 11. Status */}
      <td className="py-3 px-3 text-center whitespace-nowrap">
        {getStatusBadge(trip.status)}
      </td>

      {/* 12. Progress */}
      <td className="py-3 px-3 min-w-[110px]">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-black text-slate-700">
            <span>{trip.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${getProgressBarColor(trip.status)}`}
              style={{ width: `${trip.progress}%` }}
            />
          </div>
        </div>
      </td>

      {/* 13. Rating */}
      <td className="py-3 px-3 text-center whitespace-nowrap font-mono text-xs font-bold text-slate-700">
        {trip.rating ? (
          <div className="inline-flex items-center gap-1">
            <span>{trip.rating}</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </div>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>

      {/* 14. Actions */}
      <td className="py-3 px-3 text-right relative">
        <div ref={menuRef} className="inline-block text-left">
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="w-7 h-7 rounded-lg hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Trip Actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Context Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 text-xs font-bold text-slate-700">
              <button
                onClick={() => {
                  onViewDetails(trip);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 hover:text-[#6356E5] text-left transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>View Trip Details</span>
              </button>

              <button
                onClick={() => {
                  onOpenTimeline(trip);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 hover:text-[#6356E5] text-left transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Open Timeline</span>
              </button>

              <button
                onClick={() => {
                  onViewTravelers(trip);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 hover:text-[#6356E5] text-left transition-colors cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>View Travelers</span>
              </button>

              <button
                onClick={() => {
                  onContactAgency(trip);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 hover:text-[#6356E5] text-left transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact Agency</span>
              </button>

              <button
                onClick={() => {
                  onContactGuide(trip);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 hover:text-[#6356E5] text-left transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact Guide</span>
              </button>

              <button
                onClick={() => {
                  onExportTrip(trip);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 hover:text-[#6356E5] text-left transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export Trip</span>
              </button>

              {trip.status !== 'Cancelled' && (
                <button
                  onClick={() => {
                    onCancelTrip(trip);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-rose-50 text-rose-600 text-left transition-colors cursor-pointer border-t border-slate-100"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel Trip</span>
                </button>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};
