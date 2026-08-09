import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hotel, CheckCircle2, Edit2, Save, X } from 'lucide-react';
import { HotelInfo } from '../../data/tripDetails';

interface HotelInformationCardProps {
  hotelInfo: HotelInfo | null;
  onSave: (info: HotelInfo) => void;
}

const EMPTY_HOTEL: HotelInfo = {
  hotelName: '',
  address: '',
  checkInTime: '',
  checkOutTime: '',
  roomAllocationNotes: '',
};

export const HotelInformationCard: React.FC<HotelInformationCardProps> = ({
  hotelInfo,
  onSave,
}) => {
  const isCompleted = Boolean(hotelInfo);
  const [isEditing, setIsEditing] = useState(!isCompleted);
  const [form, setForm] = useState<HotelInfo>(hotelInfo ?? EMPTY_HOTEL);

  const handleChange = (field: keyof HotelInfo, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.hotelName.trim()) return;
    onSave(form);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setForm(hotelInfo ?? EMPTY_HOTEL);
    setIsEditing(true);
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:ring-2 focus:ring-[#583BE8]/10 transition-all';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
            <Hotel className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#0F172A]">Hotel Information</h3>
            <p className="text-[11px] font-semibold text-slate-400">Accommodation details for this trip</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isCompleted && !isEditing && (
            <>
              <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed
              </span>
              <button
                type="button"
                onClick={handleEdit}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {!isCompleted && (
            <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Pending
            </span>
          )}
        </div>
      </div>

      {/* Read-Only Completed View */}
      {isCompleted && !isEditing && hotelInfo && (
        <div className="space-y-2.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">Hotel Name</span>
              <span className="font-extrabold text-[#0F172A]">{hotelInfo.hotelName}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">Address</span>
              <span className="font-bold text-slate-700">{hotelInfo.address}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">Check-in Time</span>
              <span className="font-extrabold text-[#0F172A]">{hotelInfo.checkInTime}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">Check-out Time</span>
              <span className="font-extrabold text-[#0F172A]">{hotelInfo.checkOutTime}</span>
            </div>
          </div>
          {hotelInfo.roomAllocationNotes && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">Room Allocation Notes</span>
              <span className="font-bold text-slate-700">{hotelInfo.roomAllocationNotes}</span>
            </div>
          )}
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600">Hotel Name *</label>
              <input
                type="text"
                value={form.hotelName}
                onChange={(e) => handleChange('hotelName', e.target.value)}
                placeholder="e.g. The Grand Himalayan Resort"
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600">Hotel Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="e.g. Leh, Ladakh 194101"
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600">Check-in Time</label>
              <input
                type="text"
                value={form.checkInTime}
                onChange={(e) => handleChange('checkInTime', e.target.value)}
                placeholder="e.g. 02:00 PM"
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600">Check-out Time</label>
              <input
                type="text"
                value={form.checkOutTime}
                onChange={(e) => handleChange('checkOutTime', e.target.value)}
                placeholder="e.g. 11:00 AM"
                className={inputClass}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600">Room Allocation Notes</label>
            <textarea
              rows={3}
              value={form.roomAllocationNotes}
              onChange={(e) => handleChange('roomAllocationNotes', e.target.value)}
              placeholder="e.g. 8 double rooms, 2 triple rooms for family groups..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-1">
            {isCompleted && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-600 text-xs font-extrabold transition-all cursor-pointer hover:bg-slate-50"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={!form.hotelName.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-extrabold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Save Hotel Information
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HotelInformationCard;
