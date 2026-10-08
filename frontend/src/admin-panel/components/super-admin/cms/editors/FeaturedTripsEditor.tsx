import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Trash2,
} from 'lucide-react';
import { FeaturedTripItem, CMSSelectItem } from '../../../../types/cmsManagement';
import { adminCMSManagementService } from '../../../../services/adminCMSManagement.service';
import { CMSSelectionModal } from '../modals/CMSSelectionModal';

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

  const handleConfirmFeature = async (
    selectedItems: CMSSelectItem[],
    options?: { priority?: number; customBadge?: string }
  ) => {
    const packageIds = selectedItems.map((i) => i.id || i.packageId || '');
    try {
      await adminCMSManagementService.bulkFeatureTrips(
        packageIds,
        options?.priority || 1,
        options?.customBadge || 'Featured Deal'
      );
      setIsAddingNew(false);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Failed to feature package(s)');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-black text-[#0F172A]">Featured Tour Packages</h2>
          <p className="text-[11px] text-slate-400 font-semibold">
            Curate packages directly from the Package database to highlight on the storefront
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Feature Package</span>
        </button>
      </div>

      {/* Empty State */}
      {trips.length === 0 ? (
        <div className="py-12 px-4 text-center border-2 border-dashed border-slate-100 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800">No Packages Featured</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-0.5">
              Select verified tour packages from your package database to showcase on the homepage.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black shadow-sm hover:bg-indigo-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Select Package</span>
          </button>
        </div>
      ) : (
        /* Trips Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={trip.bannerImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100'}
                  alt=""
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[9px] font-black inline-block mb-1">
                    {trip.discountBadge || 'Featured'}
                  </span>
                  <h4 className="text-xs font-black text-[#0F172A] truncate">{trip.tripTitle}</h4>
                  <p className="text-[10px] text-slate-400">
                    {trip.agencyName} • ₹{trip.price}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                  P-{trip.priority}
                </span>
                <button
                  type="button"
                  onClick={() => onDeleteTrip(trip.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Unfeature Package"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Universal Reusable CMS Selection Modal */}
      <CMSSelectionModal
        isOpen={isAddingNew}
        onClose={() => setIsAddingNew(false)}
        type="packages"
        title="Feature Tour Packages"
        subtitle="Browse verified packages from MongoDB to showcase on the homepage"
        alreadyFeaturedIds={trips.map((t) => t.id)}
        onConfirm={handleConfirmFeature}
        defaultBadgeText="Featured Deal"
        createButtonRoute="/admin/packages"
        createButtonText="Create Package"
      />
    </div>
  );
};
