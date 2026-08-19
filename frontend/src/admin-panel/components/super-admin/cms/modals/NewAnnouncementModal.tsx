import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Megaphone, Plus, Pin, CheckCircle2 } from 'lucide-react';
import {
  PlatformAnnouncementItem,
  AnnouncementType,
  AnnouncementAudience,
  AnnouncementLocation,
} from '../../../../types/cmsManagement';

interface NewAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (ann: Partial<PlatformAnnouncementItem>) => void;
}

export const NewAnnouncementModal: React.FC<NewAnnouncementModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<AnnouncementType>('info');
  const [audience, setAudience] = useState<AnnouncementAudience>('all');
  const [location, setLocation] = useState<AnnouncementLocation>('both');
  const [isPinned, setIsPinned] = useState(false);
  const [isDismissible, setIsDismissible] = useState(true);
  const [requireAck, setRequireAck] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('2025-12-31');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      description: description.trim(),
      type,
      audience,
      location,
      isPinned,
      isDismissible,
      requireAck,
      startDate,
      endDate,
      status: 'published',
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-10 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <Megaphone className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A]">New Platform Announcement</h3>
                <p className="text-xs text-slate-400 font-semibold">
                  Broadcast live alert across Customer and Agency dashboards
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                Announcement Headline
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scheduled System Maintenance on Sunday"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                Message Body
              </label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed message displayed on the alert banner"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                  Type / Severity
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AnnouncementType)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
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
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as AnnouncementAudience)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                >
                  <option value="all">Everyone</option>
                  <option value="customers">Customers</option>
                  <option value="agencies">Agencies</option>
                  <option value="logged_in">Logged In</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                  Display Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value as AnnouncementLocation)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                >
                  <option value="homepage">Homepage</option>
                  <option value="customer_dashboard">Customer App</option>
                  <option value="agency_dashboard">Agency App</option>
                  <option value="both">Both Dashboards</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-[#6356E5]"
                />
                <span className="font-bold text-slate-700">Pin to Top of App</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireAck}
                  onChange={(e) => setRequireAck(e.target.checked)}
                  className="rounded text-[#6356E5]"
                />
                <span className="font-bold text-slate-700">Require User Ack</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black shadow-md transition-all cursor-pointer"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Broadcast Live</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
