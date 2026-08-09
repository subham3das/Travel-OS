import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, ShieldAlert, FileText } from 'lucide-react';
import { TripDefaultsData } from '../../../data/profile';

interface TripDefaultsCardProps {
  data: TripDefaultsData;
  isEditing: boolean;
  onChange: (updated: Partial<TripDefaultsData>) => void;
}

export const TripDefaultsCard: React.FC<TripDefaultsCardProps> = ({
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
        <Clock className="w-5 h-5 text-purple-600" />
        <div>
          <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Trip Defaults</h3>
          <p className="text-[11px] font-semibold text-slate-400">Default check-in/out times, emergency contact & pickup instructions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Check-in Time */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Default Hotel Check-in Time
          </label>
          {isEditing ? (
            <input
              type="text"
              value={data.defaultCheckInTime}
              onChange={(e) => onChange({ defaultCheckInTime: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
            />
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-extrabold text-[#0F172A]">
              {data.defaultCheckInTime}
            </div>
          )}
        </div>

        {/* Check-out Time */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Default Hotel Check-out Time
          </label>
          {isEditing ? (
            <input
              type="text"
              value={data.defaultCheckOutTime}
              onChange={(e) => onChange({ defaultCheckOutTime: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
            />
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-extrabold text-[#0F172A]">
              {data.defaultCheckOutTime}
            </div>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Default Emergency Helpline
          </label>
          {isEditing ? (
            <input
              type="text"
              value={data.emergencyContact}
              onChange={(e) => onChange({ emergencyContact: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
            />
          ) : (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 font-extrabold text-rose-800">
              {data.emergencyContact}
            </div>
          )}
        </div>

        {/* Pickup Instructions */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Default Pickup Instructions
          </label>
          {isEditing ? (
            <textarea
              rows={2}
              value={data.pickupInstructions}
              onChange={(e) => onChange({ pickupInstructions: e.target.value })}
              className="w-full p-3 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] resize-none"
            />
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-semibold text-slate-700 leading-relaxed">
              {data.pickupInstructions}
            </div>
          )}
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Standard Traveler Terms & Conditions
          </label>
          {isEditing ? (
            <textarea
              rows={2}
              value={data.termsAndConditions}
              onChange={(e) => onChange({ termsAndConditions: e.target.value })}
              className="w-full p-3 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] resize-none"
            />
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-semibold text-slate-700 leading-relaxed">
              {data.termsAndConditions}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TripDefaultsCard;
