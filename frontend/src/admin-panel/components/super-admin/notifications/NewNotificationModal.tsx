import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bell, Users, Shield, AlertTriangle } from 'lucide-react';
import {
  NotificationCategoryType,
  NotificationPriorityType,
} from '../../../types/advancedNotificationCenter';

interface NewNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    category: NotificationCategoryType;
    title: string;
    description: string;
    metadata: string;
    priority: NotificationPriorityType;
    targetRoute: string;
  }) => void;
}

export const NewNotificationModal: React.FC<NewNotificationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [category, setCategory] = useState<NotificationCategoryType>('agency');
  const [priority, setPriority] = useState<NotificationPriorityType>('High');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [metadata, setMetadata] = useState('');
  const [targetRoute, setTargetRoute] = useState('/admin/agencies');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmit({
      category,
      title,
      description,
      metadata: metadata || 'Dispatched by Super Admin Console',
      priority,
      targetRoute,
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
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center border border-purple-100">
                <Bell className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A]">Create Platform Alert</h3>
                <p className="text-xs text-slate-400 font-semibold">
                  Broadcast notification to operations queue
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

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Category & Priority Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NotificationCategoryType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                >
                  <option value="agency">Agency</option>
                  <option value="package">Package</option>
                  <option value="support">Support</option>
                  <option value="payment">Payment & Finance</option>
                  <option value="review">Reviews & Content</option>
                  <option value="system">System Alerts</option>
                  <option value="community">Community</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as NotificationPriorityType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                >
                  <option value="High">High (Urgent)</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">
                Alert Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Agency Verification Required"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">
                Description / Details
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details of the operational notification..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
              />
            </div>

            {/* Metadata & Target Route */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">
                  Metadata Note
                </label>
                <input
                  type="text"
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                  placeholder="e.g. Agency ID: AG-1024"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">
                  Target Route
                </label>
                <input
                  type="text"
                  value={targetRoute}
                  onChange={(e) => setTargetRoute(e.target.value)}
                  placeholder="/admin/verification-pending"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Alert</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
