import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, UserCheck, ShieldAlert } from 'lucide-react';
import { EmergencyContactInfo } from '../../data/customers';

interface EmergencyContactCardProps {
  contact: EmergencyContactInfo;
}

export const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({ contact }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-rose-600" />
        <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Emergency Contact</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100">
          <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Contact Name</span>
          <span className="font-extrabold text-[#0F172A]">{contact.name}</span>
        </div>
        <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100">
          <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Relationship</span>
          <span className="font-extrabold text-[#0F172A]">{contact.relationship}</span>
        </div>
        <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100">
          <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Phone Number</span>
          <span className="font-extrabold text-rose-700">{contact.phone}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EmergencyContactCard;
