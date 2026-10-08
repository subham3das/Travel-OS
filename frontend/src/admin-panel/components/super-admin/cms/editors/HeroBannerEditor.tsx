import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Eye,
  History,
  RotateCcw,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { HeroBannerItem, BannerTargetType } from '../../../../types/cmsManagement';
import { adminCMSManagementService } from '../../../../services/adminCMSManagement.service';
import { UniversalImageUploader } from '../../../../../components/common/UniversalImageUploader';
import { CMSSelectionModal } from '../modals/CMSSelectionModal';

interface HeroBannerEditorProps {
  banners: HeroBannerItem[];
  onSaveBanner: (banner: Partial<HeroBannerItem>) => void;
  onDeleteBanner: (id: string) => void;
  onOpenNewModal: () => void;
}

export const HeroBannerEditor: React.FC<HeroBannerEditorProps> = ({
  banners,
  onSaveBanner,
  onDeleteBanner,
  onOpenNewModal,
}) => {
  const [editingBanner, setEditingBanner] = useState<HeroBannerItem | null>(null);
  const [historyBanner, setHistoryBanner] = useState<HeroBannerItem | null>(null);
  const [isBrowseTargetOpen, setIsBrowseTargetOpen] = useState(false);

  const handleRestoreVersion = async (bannerId: string, versionNumber: number) => {
    try {
      await adminCMSManagementService.restoreBannerVersion(bannerId, versionNumber);
      setHistoryBanner(null);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Failed to restore version');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-black text-[#0F172A]">Hero Banners Carousel</h2>
          <p className="text-[11px] text-slate-400 font-semibold">
            Manage top homepage carousel slides with target internal routing, scheduling, and version history.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenNewModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Banner</span>
        </button>
      </div>

      {/* Empty State */}
      {banners.length === 0 ? (
        <div className="py-12 px-4 text-center border-2 border-dashed border-slate-100 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800">No Hero Banners Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-0.5">
              Your database currently has zero hero banners. Click below to publish your first banner to the live storefront.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenNewModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6356E5] text-white text-xs font-black shadow-sm hover:bg-[#5244e0] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Banner</span>
          </button>
        </div>
      ) : (
        /* Banner Cards List */
        <div className="space-y-3.5">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`p-4 rounded-2xl border transition-all ${
                banner.isEnabled
                  ? 'bg-slate-50/60 border-slate-200/80 hover:border-purple-200'
                  : 'bg-slate-100/50 border-slate-200/50 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {/* Thumbnail */}
                <div className="relative w-full sm:w-44 h-24 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 shadow-2xs">
                  <img
                    src={banner.desktopImage}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[9px] font-black backdrop-blur-xs">
                    Slide #{index + 1}
                  </span>
                  <span
                    className={`absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black capitalize ${
                      banner.isEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                    }`}
                  >
                    {banner.isEnabled ? 'Active' : 'Disabled'}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-black text-[#0F172A] line-clamp-1">{banner.title}</h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{banner.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onSaveBanner({ id: banner.id, isEnabled: !banner.isEnabled })}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-colors cursor-pointer ${
                          banner.isEnabled
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {banner.isEnabled ? 'Enabled' : 'Disabled'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingBanner(banner)}
                        className="p-1 rounded-lg hover:bg-purple-50 text-slate-400 hover:text-[#6356E5] transition-colors cursor-pointer"
                        title="Edit Banner"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {banner.versionHistory && banner.versionHistory.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setHistoryBanner(banner)}
                          className="p-1 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Version History"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onDeleteBanner(banner.id)}
                        className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Banner"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-500 font-semibold">
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#6356E5] font-black">
                      Routes: {banner.targetType} {banner.targetId ? `(#${banner.targetId})` : ''}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      CTA: "{banner.ctaText}"
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      Priority: {banner.priority}
                    </span>
                    {banner.version && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold">
                        v{banner.version}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Banner Drawer / Modal */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">Edit Hero Banner</h3>
              <button
                onClick={() => setEditingBanner(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Banner Title</label>
                <input
                  type="text"
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingBanner.subtitle || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Route Type</label>
                  <select
                    value={editingBanner.targetType || 'Package'}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, targetType: e.target.value as BannerTargetType })
                    }
                    className="w-full px-3 py-2 border rounded-xl font-semibold bg-white"
                  >
                    <option value="Package">Package</option>
                    <option value="Agency">Agency</option>
                    <option value="Destination">Destination</option>
                    <option value="Car Rental">Car Rental</option>
                    <option value="External">External URL</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 block">
                      {editingBanner.targetType === 'External' ? 'External URL' : 'Target ID / Slug'}
                    </label>
                    {editingBanner.targetType !== 'External' && (
                      <span className="text-[10px] text-purple-600 font-bold">From MongoDB</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={
                        editingBanner.targetType === 'External'
                          ? editingBanner.externalUrl || ''
                          : editingBanner.targetId || ''
                      }
                      onChange={(e) =>
                        editingBanner.targetType === 'External'
                          ? setEditingBanner({ ...editingBanner, externalUrl: e.target.value })
                          : setEditingBanner({ ...editingBanner, targetId: e.target.value })
                      }
                      placeholder={
                        editingBanner.targetType === 'External'
                          ? 'https://...'
                          : `Select or type ${editingBanner.targetType.toLowerCase()} ID...`
                      }
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                    {editingBanner.targetType !== 'External' && (
                      <button
                        type="button"
                        onClick={() => setIsBrowseTargetOpen(true)}
                        className="px-2.5 py-2 bg-purple-50 hover:bg-purple-100 text-[#6356E5] rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer border border-purple-200/60"
                        title={`Browse available ${editingBanner.targetType}s from database`}
                      >
                        Browse
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={editingBanner.ctaText}
                    onChange={(e) => setEditingBanner({ ...editingBanner, ctaText: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority (Sort Order)</label>
                  <input
                    type="number"
                    value={editingBanner.priority}
                    onChange={(e) => setEditingBanner({ ...editingBanner, priority: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Cloudinary Universal Uploader */}
              <UniversalImageUploader
                label="Desktop Image (Cloudinary)"
                helpText="Replaces directly in Cloudinary"
                folder="travelos/banners"
                value={editingBanner.desktopImage}
                onChange={(url: any) => setEditingBanner({ ...editingBanner, desktopImage: url, mobileImage: url })}
                aspectRatio="wide"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="px-4 py-2 rounded-xl border text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onSaveBanner(editingBanner);
                  setEditingBanner(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#6356E5] text-white font-black text-xs"
              >
                Save & Update Storefront
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Target Selector Modal for Edit */}
      {editingBanner && editingBanner.targetType !== 'External' && isBrowseTargetOpen && (
        <CMSSelectionModal
          isOpen={isBrowseTargetOpen}
          onClose={() => setIsBrowseTargetOpen(false)}
          type={
            editingBanner.targetType === 'Package'
              ? 'packages'
              : editingBanner.targetType === 'Agency'
              ? 'agencies'
              : editingBanner.targetType === 'Destination'
              ? 'destinations'
              : 'vehicles'
          }
          title={`Select ${editingBanner.targetType}`}
          subtitle={`Choose a ${editingBanner.targetType.toLowerCase()} from MongoDB to link to this banner`}
          multiSelect={false}
          actionButtonText="Select as Target"
          onConfirm={(selectedItems) => {
            if (selectedItems.length > 0) {
              const item = selectedItems[0];
              const code = item.packageId || item.agencyId || item.destination || item.name || item.id;
              setEditingBanner({
                ...editingBanner,
                targetId: code,
                title: editingBanner.title || item.title || item.name || '',
              });
            }
            setIsBrowseTargetOpen(false);
          }}
        />
      )}

      {/* Version History Modal */}
      {historyBanner && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h3 className="text-sm font-black text-slate-900">Version History</h3>
                <p className="text-xs text-slate-400">"{historyBanner.title}"</p>
              </div>
              <button
                onClick={() => setHistoryBanner(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {historyBanner.versionHistory?.map((ver) => (
                <div
                  key={ver.version}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-xs font-black text-slate-800 block">Version {ver.version}</span>
                    <span className="text-[10px] text-slate-400 block">
                      Saved by {ver.savedBy} • {new Date(ver.savedAt).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                      Target: {ver.targetType} {ver.targetId ? `(${ver.targetId})` : ''}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRestoreVersion(historyBanner.id, ver.version)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
