import React from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Calendar, ShieldAlert, X, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';
import { ConversationCustomerInfo } from '../../data/inbox';
import { TravelCompanionCard } from './TravelCompanionCard';
import { AgencyNotesCard } from './AgencyNotesCard';

interface CustomerInfoCardProps {
  info: ConversationCustomerInfo;
  onClose: () => void;
  onAddNote: (note: string) => void;
}

export const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({
  info,
  onClose,
  onAddNote,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full md:w-80 bg-white border-l border-slate-100 p-4 sm:p-5 space-y-5 overflow-y-auto max-h-screen select-none shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-[#0F172A]">Customer Information</h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Customer Profile Summary */}
      <div className="text-center space-y-2 pb-3 border-b border-slate-100">
        <img
          src={info.avatar}
          alt={info.name}
          className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-purple-100 shadow-xs"
        />
        <div>
          <div className="flex items-center justify-center gap-1.5">
            <h4 className="text-base font-black text-[#0F172A]">{info.name}</h4>
            {info.isVIP && (
              <span className="text-[9px] font-black uppercase text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-md border border-amber-200">
                VIP
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-400">{info.email}</p>
          <p className="text-xs font-bold text-[#583BE8]">{info.phone}</p>
        </div>
      </div>

      {/* Booking Overview Details */}
      <div className="space-y-2 text-xs">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
          Booking Overview
        </span>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-bold">Booking ID</span>
            <span className="font-extrabold text-[#583BE8]">{info.bookingId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-bold">Package</span>
            <span className="font-extrabold text-[#0F172A] truncate max-w-[130px]">{info.packageName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-bold">Departure Date</span>
            <span className="font-extrabold text-[#0F172A]">{info.departureDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-bold">Payment Status</span>
            <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]">
              {info.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Travel Companions */}
      {info.companions && info.companions.length > 0 && (
        <TravelCompanionCard companions={info.companions} />
      )}

      {/* Agency Private Notes */}
      <AgencyNotesCard notes={info.privateNotes} onAddNote={onAddNote} />

      {/* Emergency Contact */}
      <div className="space-y-1.5 text-xs">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
          Emergency Contact
        </span>
        <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-1">
          <p className="font-extrabold text-[#0F172A]">{info.emergencyContact.name}</p>
          <p className="text-[11px] font-semibold text-slate-500">{info.emergencyContact.relationship}</p>
          <p className="text-[11px] font-extrabold text-rose-700">{info.emergencyContact.phone}</p>
        </div>
      </div>

      {/* Future Ready Integrations Placeholder */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 via-slate-50 to-purple-50 border border-purple-100 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-black text-[#583BE8] text-[11px] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Future Omni-Channel
          </span>
          <span className="text-[9px] font-black uppercase text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
            Coming Soon
          </span>
        </div>
        <p className="text-[10px] font-medium text-slate-500 leading-tight">
          WhatsApp, Email & Push Notification sync will be activated directly from this panel.
        </p>
      </div>
    </motion.div>
  );
};

export default CustomerInfoCard;
