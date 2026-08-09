import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Users, Clock, AlertCircle, FileText } from 'lucide-react';
import { BookingSettingsData } from '../../../data/profile';

interface BookingSettingsCardProps {
  data: BookingSettingsData;
  isEditing: boolean;
  onChange: (updated: Partial<BookingSettingsData>) => void;
}

export const BookingSettingsCard: React.FC<BookingSettingsCardProps> = ({
  data,
  isEditing,
  onChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Calendar className="w-5 h-5 text-[#583BE8]" />
        <div>
          <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Booking Settings</h3>
          <p className="text-[11px] font-semibold text-slate-400">Approval rules, capacity limits, deadlines & policies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Booking Approval */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Booking Approval Mode
          </label>
          {isEditing ? (
            <select
              value={data.bookingApproval}
              onChange={(e) => onChange({ bookingApproval: e.target.value as any })}
              className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
            >
              <option value="Automatic">Automatic (Instant Confirmation)</option>
              <option value="Manual">Manual (Agency Review Required)</option>
            </select>
          ) : (
            <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 font-extrabold text-[#583BE8]">
              {data.bookingApproval} (Instant Confirmation)
            </div>
          )}
        </div>

        {/* Booking Deadline */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Booking Cutoff Deadline
          </label>
          {isEditing ? (
            <input
              type="number"
              value={data.bookingDeadlineDays}
              onChange={(e) => onChange({ bookingDeadlineDays: parseInt(e.target.value) || 1 })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
            />
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-extrabold text-[#0F172A]">
              {data.bookingDeadlineDays} Days Before Departure Date
            </div>
          )}
        </div>

        {/* Min & Max Travelers */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Min Travelers Per Booking
          </label>
          {isEditing ? (
            <input
              type="number"
              value={data.minTravelers}
              onChange={(e) => onChange({ minTravelers: parseInt(e.target.value) || 1 })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
            />
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-extrabold text-[#0F172A]">
              {data.minTravelers} Person
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Max Travelers Per Booking
          </label>
          {isEditing ? (
            <input
              type="number"
              value={data.maxTravelers}
              onChange={(e) => onChange({ maxTravelers: parseInt(e.target.value) || 10 })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
            />
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-extrabold text-[#0F172A]">
              {data.maxTravelers} Persons Max Group
            </div>
          )}
        </div>

        {/* Cancellation Policy */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Default Cancellation Policy
          </label>
          {isEditing ? (
            <textarea
              rows={2}
              value={data.cancellationPolicy}
              onChange={(e) => onChange({ cancellationPolicy: e.target.value })}
              className="w-full p-3 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] resize-none"
            />
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-semibold text-slate-700 leading-relaxed">
              {data.cancellationPolicy}
            </div>
          )}
        </div>

        {/* Refund Policy */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Refund Processing Policy
          </label>
          {isEditing ? (
            <textarea
              rows={2}
              value={data.refundPolicy}
              onChange={(e) => onChange({ refundPolicy: e.target.value })}
              className="w-full p-3 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] resize-none"
            />
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-semibold text-slate-700 leading-relaxed">
              {data.refundPolicy}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookingSettingsCard;
