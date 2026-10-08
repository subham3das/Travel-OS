import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Trash2,
  Star,
  CheckCircle,
} from 'lucide-react';
import { FeaturedAgencyItem, CMSSelectItem } from '../../../../types/cmsManagement';
import { adminCMSManagementService } from '../../../../services/adminCMSManagement.service';
import { CMSSelectionModal } from '../modals/CMSSelectionModal';

interface FeaturedAgenciesEditorProps {
  agencies: FeaturedAgencyItem[];
  onSaveAgency: (agency: Partial<FeaturedAgencyItem>) => void;
  onDeleteAgency: (id: string) => void;
}

export const FeaturedAgenciesEditor: React.FC<FeaturedAgenciesEditorProps> = ({
  agencies,
  onSaveAgency,
  onDeleteAgency,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleConfirmFeature = async (
    selectedItems: CMSSelectItem[],
    options?: { priority?: number; customBadge?: string }
  ) => {
    const agencyIds = selectedItems.map((i) => i.id || i.agencyId || '');
    try {
      await adminCMSManagementService.bulkFeatureAgencies(
        agencyIds,
        options?.priority || 1,
        options?.customBadge || 'Top Rated Partner'
      );
      setIsAddingNew(false);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Failed to feature agency(ies)');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-black text-[#0F172A]">Featured Agency Partners</h2>
          <p className="text-[11px] text-slate-400 font-semibold">
            Select verified partner agencies from MongoDB to showcase on the storefront
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Feature Agency</span>
        </button>
      </div>

      {/* Empty State */}
      {agencies.length === 0 ? (
        <div className="py-12 px-4 text-center border-2 border-dashed border-slate-100 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800">No Featured Agencies</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-0.5">
              Select accredited agency operators from your directory to feature on the storefront.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-sm hover:bg-emerald-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Select Agency</span>
          </button>
        </div>
      ) : (
        /* Agencies Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {agencies.map((agency) => (
            <div
              key={agency.id}
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-200 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={
                    agency.agencyLogo ||
                    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100'
                  }
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-black inline-block">
                      {agency.featuredBadge || 'Verified Partner'}
                    </span>
                    {agency.isVerified && (
                      <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                    )}
                  </div>
                  <h4 className="text-xs font-black text-[#0F172A] truncate">
                    {agency.agencyName}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      {agency.rating || 4.9}
                    </span>
                    <span>•</span>
                    <span>ID: {agency.agencyId}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                  P-{agency.priority}
                </span>
                <button
                  type="button"
                  onClick={() => onDeleteAgency(agency.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Unfeature Agency"
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
        type="agencies"
        title="Feature Agency Partners"
        subtitle="Browse verified agencies from MongoDB to showcase on the storefront"
        alreadyFeaturedIds={agencies.map((a) => a.id)}
        onConfirm={handleConfirmFeature}
        defaultBadgeText="Top Rated Partner"
        createButtonRoute="/admin/agencies"
        createButtonText="Register Agency"
      />
    </div>
  );
};
