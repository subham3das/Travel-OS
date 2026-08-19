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
  Users,
  Layout,
  Calendar,
} from 'lucide-react';
import {
  PlatformAnnouncementItem,
  AnnouncementType,
  AnnouncementAudience,
  AnnouncementLocation,
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
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" /> Critical
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
            <Info className="w-3 h-3" /> Info
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
            <h2 className="text-sm font-black text-[#0F172A]">Platform Announcement Center</h2>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-black border border-amber-200">
              Universal Alert Engine
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
            Dispatches live alerts and notices across Homepage, Customer App, and Agency Portal without deployment.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenNewModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`p-4 rounded-2xl border transition-all ${
              ann.type === 'critical'
                ? 'bg-rose-50/40 border-rose-200'
                : ann.type === 'warning'
                ? 'bg-amber-50/40 border-amber-200'
                : ann.type === 'success'
                ? 'bg-emerald-50/40 border-emerald-200'
                : 'bg-blue-50/40 border-blue-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {getTypeBadge(ann.type)}
                  {ann.isPinned && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-100 text-[#6356E5] flex items-center gap-0.5">
                      <Pin className="w-2.5 h-2.5" /> Pinned
                    </span>
                  )}
                  {ann.requireAck && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-900 text-white">
                      Ack Required
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Status: {ann.status}
                  </span>
                </div>

                <h3 className="text-xs font-black text-[#0F172A]">{ann.title}</h3>
                <p className="text-[11px] text-slate-600 font-medium">{ann.description}</p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-slate-500 font-semibold">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    Audience: <strong className="text-slate-800 uppercase">{ann.audience}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Layout className="w-3 h-3 text-slate-400" />
                    Location: <strong className="text-slate-800 uppercase">{ann.location}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {ann.startDate} → {ann.endDate}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    onSaveAnnouncement({
                      id: ann.id,
                      status: ann.status === 'published' ? 'draft' : 'published',
                    })
                  }
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-colors cursor-pointer ${
                    ann.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {ann.status === 'published' ? 'Live' : 'Draft'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingAnn(ann)}
                  className="p-1.5 rounded-lg hover:bg-white text-slate-500 hover:text-[#6356E5] transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteAnnouncement(ann.id)}
                  className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-rose-600 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Announcement Modal */}
      {editingAnn && (
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3 text-xs">
          <div className="flex items-center justify-between pb-1 border-b border-amber-200">
            <span className="font-black text-[#0F172A]">Edit Announcement: {editingAnn.title}</span>
            <button
              type="button"
              onClick={() => setEditingAnn(null)}
              className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                Announcement Headline
              </label>
              <input
                type="text"
                value={editingAnn.title}
                onChange={(e) => setEditingAnn({ ...editingAnn, title: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                Message Body
              </label>
              <textarea
                rows={2}
                value={editingAnn.description}
                onChange={(e) => setEditingAnn({ ...editingAnn, description: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold text-[#0F172A]"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                  Type
                </label>
                <select
                  value={editingAnn.type}
                  onChange={(e) =>
                    setEditingAnn({ ...editingAnn, type: e.target.value as AnnouncementType })
                  }
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-xs"
                >
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                  Audience
                </label>
                <select
                  value={editingAnn.audience}
                  onChange={(e) =>
                    setEditingAnn({ ...editingAnn, audience: e.target.value as AnnouncementAudience })
                  }
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-xs"
                >
                  <option value="all">Everyone</option>
                  <option value="customers">Customers Only</option>
                  <option value="agencies">Agencies Only</option>
                  <option value="logged_in">Logged In Users</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                  Display Location
                </label>
                <select
                  value={editingAnn.location}
                  onChange={(e) =>
                    setEditingAnn({ ...editingAnn, location: e.target.value as AnnouncementLocation })
                  }
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-xs"
                >
                  <option value="homepage">Homepage Only</option>
                  <option value="customer_dashboard">Customer Dashboard</option>
                  <option value="agency_dashboard">Agency Dashboard</option>
                  <option value="both">Both Dashboards</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                  Pin to Top
                </label>
                <select
                  value={editingAnn.isPinned ? 'yes' : 'no'}
                  onChange={(e) =>
                    setEditingAnn({ ...editingAnn, isPinned: e.target.value === 'yes' })
                  }
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-xs"
                >
                  <option value="yes">Pinned</option>
                  <option value="no">Standard</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setEditingAnn(null)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onSaveAnnouncement(editingAnn);
                setEditingAnn(null);
              }}
              className="px-4 py-1.5 rounded-xl bg-amber-500 text-white font-black shadow-xs cursor-pointer"
            >
              Save Announcement
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
