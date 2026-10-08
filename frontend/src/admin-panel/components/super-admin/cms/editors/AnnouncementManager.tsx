import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  Pin,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Calendar,
  X,
  Palette,
} from 'lucide-react';
import {
  PlatformAnnouncementItem,
  AnnouncementType,
  AnnouncementPlacement,
} from '../../../../types/cmsManagement';

interface AnnouncementManagerProps {
  announcements: PlatformAnnouncementItem[];
  onSaveAnnouncement: (ann: Partial<PlatformAnnouncementItem>) => void;
  onDeleteAnnouncement: (id: string) => void;
  onOpenNewModal: () => void;
}

export const AnnouncementManager: React.FC<AnnouncementManagerProps> = ({
  announcements,
  onSaveAnnouncement,
  onDeleteAnnouncement,
  onOpenNewModal,
}) => {
  const [editingAnn, setEditingAnn] = useState<PlatformAnnouncementItem | null>(null);

  const getTypeBadge = (type: AnnouncementType) => {
    switch (type) {
      case 'alert':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" /> Critical Alert
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Warning
          </span>
        );
      case 'success':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Success
          </span>
        );
      case 'info':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
            <Info className="w-3 h-3" /> Information
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-[#0F172A]">Platform Announcements</h2>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-black border border-amber-200">
              Universal Alert Engine
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
            Dispatches live alerts, maintenance notices, and broadcast banners to the storefront in real time.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenNewModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Empty State */}
      {announcements.length === 0 ? (
        <div className="py-12 px-4 text-center border-2 border-dashed border-slate-100 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800">No Active Announcements</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-0.5">
              There are no platform broadcast notices right now. Create one to inform travelers about flash sales or updates.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenNewModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-black shadow-sm hover:bg-amber-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Announcement</span>
          </button>
        </div>
      ) : (
        /* Announcements List */
        <div className="space-y-3">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                ann.isEnabled
                  ? 'bg-slate-50/70 border-slate-200/80 hover:border-amber-200'
                  : 'bg-slate-100/40 border-slate-200/40 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {getTypeBadge(ann.type)}
                  {ann.isPinned && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                      <Pin className="w-2.5 h-2.5" /> Pinned
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    Placement: {ann.placement || 'all'}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onSaveAnnouncement({ id: ann.id, isEnabled: !ann.isEnabled })}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-colors cursor-pointer ${
                      ann.isEnabled
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {ann.isEnabled ? 'Active' : 'Disabled'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingAnn(ann)}
                    className="p-1 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
                    title="Edit Announcement"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteAnnouncement(ann.id)}
                    className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-[#0F172A]">{ann.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{ann.description}</p>
              </div>

              {/* Color ribbon preview */}
              <div
                className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between"
                style={{ backgroundColor: ann.bgColor || '#3B82F6', color: ann.textColor || '#FFFFFF' }}
              >
                <span className="truncate">Storefront Banner Preview: {ann.title}</span>
                {ann.ctaText && (
                  <span className="underline text-[11px] shrink-0 ml-2 font-black">{ann.ctaText} →</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Announcement Modal */}
      {editingAnn && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-sm font-black text-slate-900">Edit Announcement</h3>
              <button onClick={() => setEditingAnn(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  value={editingAnn.title}
                  onChange={(e) => setEditingAnn({ ...editingAnn, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Content</label>
                <textarea
                  rows={3}
                  value={editingAnn.description || ''}
                  onChange={(e) => setEditingAnn({ ...editingAnn, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alert Type</label>
                  <select
                    value={editingAnn.type}
                    onChange={(e) => setEditingAnn({ ...editingAnn, type: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl bg-white font-semibold"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="alert">Critical Alert</option>
                    <option value="success">Success</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Placement</label>
                  <select
                    value={editingAnn.placement || 'all'}
                    onChange={(e) => setEditingAnn({ ...editingAnn, placement: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl bg-white font-semibold"
                  >
                    <option value="all">Everywhere</option>
                    <option value="home_only">Homepage Only</option>
                    <option value="mobile_only">Mobile Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Background Color</label>
                  <input
                    type="color"
                    value={editingAnn.bgColor || '#3B82F6'}
                    onChange={(e) => setEditingAnn({ ...editingAnn, bgColor: e.target.value })}
                    className="w-full h-9 border rounded-xl p-1 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Text Color</label>
                  <input
                    type="color"
                    value={editingAnn.textColor || '#FFFFFF'}
                    onChange={(e) => setEditingAnn({ ...editingAnn, textColor: e.target.value })}
                    className="w-full h-9 border rounded-xl p-1 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">CTA Text (Optional)</label>
                  <input
                    type="text"
                    value={editingAnn.ctaText || ''}
                    onChange={(e) => setEditingAnn({ ...editingAnn, ctaText: e.target.value })}
                    placeholder="e.g. Learn More"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Link URL</label>
                  <input
                    type="text"
                    value={editingAnn.linkUrl || ''}
                    onChange={(e) => setEditingAnn({ ...editingAnn, linkUrl: e.target.value })}
                    placeholder="/packages or https://..."
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setEditingAnn(null)}
                className="px-4 py-2 rounded-xl border text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onSaveAnnouncement(editingAnn);
                  setEditingAnn(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-black text-xs"
              >
                Save Announcement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
