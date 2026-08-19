import React from 'react';
import { AdminTripItem } from '../../../types/tripManagement';
import { TripTableRow } from './TripTableRow';

interface TripTableProps {
  trips: AdminTripItem[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onViewDetails: (trip: AdminTripItem) => void;
  onOpenTimeline: (trip: AdminTripItem) => void;
  onViewTravelers: (trip: AdminTripItem) => void;
  onContactAgency: (trip: AdminTripItem) => void;
  onContactGuide: (trip: AdminTripItem) => void;
  onExportTrip: (trip: AdminTripItem) => void;
  onCancelTrip: (trip: AdminTripItem) => void;
}

export const TripTable: React.FC<TripTableProps> = ({
  trips,
  selectedIds,
  onToggleSelectAll,
  onToggleSelect,
  onViewDetails,
  onOpenTimeline,
  onViewTravelers,
  onContactAgency,
  onContactGuide,
  onExportTrip,
  onCancelTrip,
}) => {
  const isAllSelected = trips.length > 0 && selectedIds.length === trips.length;

  return (
    <div className="bg-white rounded-3xl border border-slate-100/90 shadow-2xs overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/60 border-b border-slate-100">
              {/* 1. Select All Checkbox */}
              <th className="py-3 px-3 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded-md border-slate-300 text-[#6356E5] focus:ring-[#6356E5] cursor-pointer"
                />
              </th>

              {/* Columns */}
              <th className="py-3 px-3">Trip ID</th>
              <th className="py-3 px-3">Package</th>
              <th className="py-3 px-3">Destination</th>
              <th className="py-3 px-3">Agency</th>
              <th className="py-3 px-3">Guide</th>
              <th className="py-3 px-3">Departure</th>
              <th className="py-3 px-3">Return</th>
              <th className="py-3 px-3 text-center">Travelers</th>
              <th className="py-3 px-3">Vehicle</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3">Progress</th>
              <th className="py-3 px-3 text-center">Rating</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {trips.length === 0 ? (
              <tr>
                <td colSpan={14} className="py-12 text-center text-slate-400 font-semibold">
                  No trips found matching the selected filters.
                </td>
              </tr>
            ) : (
              trips.map((trip) => (
                <TripTableRow
                  key={trip.id}
                  trip={trip}
                  isSelected={selectedIds.includes(trip.id)}
                  onToggleSelect={onToggleSelect}
                  onViewDetails={onViewDetails}
                  onOpenTimeline={onOpenTimeline}
                  onViewTravelers={onViewTravelers}
                  onContactAgency={onContactAgency}
                  onContactGuide={onContactGuide}
                  onExportTrip={onExportTrip}
                  onCancelTrip={onCancelTrip}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
