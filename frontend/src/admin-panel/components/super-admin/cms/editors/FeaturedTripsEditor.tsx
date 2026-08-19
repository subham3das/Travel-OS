import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Tag,
  Flame,
  Star,
  Trash2,
  Calendar,
} from 'lucide-react';
import { FeaturedTripItem } from '../../../../types/cmsManagement';

interface FeaturedTripsEditorProps {
  trips: FeaturedTripItem[];
  onSaveTrip: (trip: Partial<FeaturedTripItem>) => void;
  onDeleteTrip: (id: string) => void;
}

export const FeaturedTripsEditor: React.FC<FeaturedTripsEditorProps> = ({
  trips,
  onSaveTrip,
  onDeleteTrip,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [tripTitle, setTripTitle] = useState('');
  const [agencyName, setAgencyName] = useState('Himalayan Explorers Club');
  const [discountBadge, setDiscountBadge] = useState('Flat 20% OFF');
  const [schedule, setSchedule] = useState('Weekly Departures');

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripTitle.trim()) return;
    onSaveTrip({
      tripTitle: tripTitle.trim(),
      agencyName: agencyName.trim(),
      discountBadge: discountBadge.trim(),
      bannerImage:
        'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=800&auto=format&fit=crop',
      isTrending: true,
      isFeatured: true,
      priority: trips.length + 1,
      schedule,
      displayOrder: trips.length + 1,
      isEnabled: true,
    });
    setTripTitle('');
    setIsAddingNew(false);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-black text-[#0F172A]">Featured Holiday Packages & Trips</h2>
          <p className="text-[11px] text-slate-400 font-semibold">
            Promote specific tour packages with discount badges and quick booking hooks
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAddingNew ? 'Cancel' : '+ Feature Trip'}</span>
        </button>
      </div>

      {/* Add New Form */}
      {isAddingNew && (
        <form
          onSubmit={handleAddNew}
          className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-200 space-y-3 text-xs"
        >
          <span className="font-black text-[#0F172A] block">Add Promoted Holiday Package</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                Trip Title
              </label>
              <input
                type="text"
                required
                value={tripTitle}
                onChange={(e) => setTripTitle(e.target.value)}
                placeholder="e.g. Manali Snow Trail 5D4N"
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                Organizing Agency
              </label>
              <input
                type="text"
                required
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                Discount Tag / Offer Badge
              </label>
              <input
                type="text"
                value={discountBadge}
                onChange={(e) => setDiscountBadge(e.target.value)}
                placeholder="e.g. Early Bird ₹3,000 Off"
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                Departure Frequency
              </label>
              <input
                type="text"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="e.g. Daily / Every Friday"
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold text-[#0F172A]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-black shadow-xs cursor-pointer"
            >
              Feature Package
            </button>
          </div>
        </form>
      )}

      {/* Trips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className={`p-3.5 rounded-2xl border transition-all ${
              trip.isEnabled
                ? 'bg-slate-50/70 border-slate-200 hover:border-indigo-200'
                : 'bg-slate-100/50 border-slate-200 opacity-60'
            }`}
          >
            <div className="relative h-28 rounded-xl overflow-hidden bg-slate-200 border border-slate-200 mb-2.5">
              <img src={trip.bannerImage} alt={trip.tripTitle} className="w-full h-full object-cover" />
              {trip.discountBadge && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center gap-0.5 shadow-xs">
                  <Tag className="w-2.5 h-2.5" /> {trip.discountBadge}
                </span>
              )}
              {trip.isTrending && (
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5 fill-white" /> Popular
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-black text-[#0F172A] line-clamp-1">{trip.tripTitle}</h3>
              <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                By <span className="text-[#6356E5] font-bold">{trip.agencyName}</span>
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> {trip.schedule}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onSaveTrip({ id: trip.id, isEnabled: !trip.isEnabled })}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black cursor-pointer ${
                      trip.isEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {trip.isEnabled ? 'Active' : 'Paused'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteTrip(trip.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
