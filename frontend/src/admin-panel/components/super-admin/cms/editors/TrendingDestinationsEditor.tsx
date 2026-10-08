import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Trash2,
  Flame,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { TrendingDestinationItem, CMSSelectItem } from '../../../../types/cmsManagement';
import { adminCMSManagementService } from '../../../../services/adminCMSManagement.service';
import { CMSSelectionModal } from '../modals/CMSSelectionModal';

interface TrendingDestinationsEditorProps {
  destinations: TrendingDestinationItem[];
  onSaveDestination: (dest: Partial<TrendingDestinationItem>) => void;
  onDeleteDestination: (id: string) => void;
}

export const TrendingDestinationsEditor: React.FC<TrendingDestinationsEditorProps> = ({
  destinations,
  onSaveDestination,
  onDeleteDestination,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleConfirmFeature = async (
    selectedItems: CMSSelectItem[],
    options?: { priority?: number; customBadge?: string }
  ) => {
    const destinationsToFeature = selectedItems.map((item, idx) => ({
      name: item.name || item.destination || '',
      country: item.country || 'India',
      imageUrl:
        item.coverImage ||
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
      priority: (options?.priority || 1) + idx,
    }));

    try {
      await adminCMSManagementService.bulkCreateTrendingDestinations(destinationsToFeature);
      setIsAddingNew(false);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Failed to feature destinations');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-black text-[#0F172A]">Trending Destinations</h2>
          <p className="text-[11px] text-slate-400 font-semibold">
            Select destinations from verified tour packages to feature as trending on the storefront
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Feature Destination</span>
        </button>
      </div>

      {/* Empty State */}
      {destinations.length === 0 ? (
        <div className="py-12 px-4 text-center border-2 border-dashed border-slate-100 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800">No Trending Destinations Featured</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-0.5">
              Select verified destinations from the database to highlight on the homepage.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-black shadow-sm hover:bg-blue-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Select Destination</span>
          </button>
        </div>
      ) : (
        /* Destinations Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="relative h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={
                    dest.imageUrl ||
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600'
                  }
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-slate-900/70 backdrop-blur-xs px-2 py-0.5 rounded-full text-white text-[9px] font-black">
                  <Flame className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  <span>Trending</span>
                </div>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded-md text-[#0F172A] text-[9px] font-bold">
                  P-{dest.priority}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 px-1">
                <div>
                  <h4 className="text-xs font-black text-[#0F172A]">{dest.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{dest.country || 'India'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteDestination(dest.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove from trending"
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
        type="destinations"
        title="Feature Trending Destinations"
        subtitle="Browse available destinations discovered from tour packages"
        alreadyFeaturedIds={destinations.map((d) => d.id)}
        onConfirm={handleConfirmFeature}
        defaultBadgeText="Trending Now"
        createButtonRoute="/admin/packages"
        createButtonText="Create Package with Destination"
      />
    </div>
  );
};
