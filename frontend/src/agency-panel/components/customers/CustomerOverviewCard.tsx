import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Calendar, User, ShieldCheck } from 'lucide-react';
import { Customer } from '../../data/customers';
import { LoyaltyBadge, TravelerTypeBadge } from './CustomerBadge';

interface CustomerOverviewCardProps {
  customer: Customer;
}

export const CustomerOverviewCard: React.FC<CustomerOverviewCardProps> = ({ customer }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-5 select-none"
    >
      {/* Header Profile Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-purple-50 shadow-md shrink-0"
          />
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-[#0F172A]">{customer.name}</h2>
              <LoyaltyBadge badge={customer.loyaltyBadge} />
              <TravelerTypeBadge type={customer.travelerType} />
            </div>
            <p className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {customer.city}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500">
          <span className="px-3 py-1 rounded-full bg-purple-50 text-[#583BE8] border border-purple-100 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Member since {customer.memberSince}
          </span>
        </div>
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Phone</span>
          <span className="font-extrabold text-[#583BE8] truncate block">{customer.phone}</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Email</span>
          <span className="font-bold text-[#0F172A] truncate block">{customer.email}</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Gender & Age</span>
          <span className="font-extrabold text-[#0F172A]">{customer.gender}, {customer.age} yrs</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Customer Status</span>
          <span className="font-extrabold text-emerald-700">{customer.status}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerOverviewCard;
