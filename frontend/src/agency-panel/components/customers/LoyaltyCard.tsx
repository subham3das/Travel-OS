import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Wallet, Plane, CheckCircle2, Clock, Share2 } from 'lucide-react';
import { Customer } from '../../data/customers';
import { LoyaltyBadge } from './CustomerBadge';

interface LoyaltyCardProps {
  customer: Customer;
}

export const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ customer }) => {
  // Compute loyalty tier dynamically based on spend & trips count
  const computeBadge = () => {
    if (customer.lifetimeSpend >= 100000 || customer.totalTrips >= 5) return 'VIP Traveler';
    if (customer.totalTrips >= 3) return 'Frequent Traveler';
    if (customer.totalTrips >= 2) return 'Returning Traveler';
    return 'New Traveler';
  };

  const currentBadge = computeBadge();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Loyalty Summary</h3>
        </div>
        <LoyaltyBadge badge={currentBadge} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
        <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1 text-center">
          <span className="text-[10px] font-bold text-slate-400 block">Lifetime Spend</span>
          <span className="font-black text-[#0F172A] text-sm sm:text-base">{customer.lifetimeSpendFormatted}</span>
        </div>

        <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1 text-center">
          <span className="text-[10px] font-bold text-slate-400 block">Total Trips</span>
          <span className="font-black text-[#583BE8] text-sm sm:text-base">{customer.totalTrips}</span>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1 text-center">
          <span className="text-[10px] font-bold text-slate-400 block">Completed Trips</span>
          <span className="font-black text-emerald-700 text-sm sm:text-base">{customer.completedTrips}</span>
        </div>

        <div className="p-3 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-1 text-center">
          <span className="text-[10px] font-bold text-slate-400 block">Upcoming Trips</span>
          <span className="font-black text-sky-700 text-sm sm:text-base">{customer.upcomingTrips}</span>
        </div>

        <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1 text-center">
          <span className="text-[10px] font-bold text-slate-400 block">Referral Count</span>
          <span className="font-black text-blue-700 text-sm sm:text-base">{customer.referralCount}</span>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1 text-center">
          <span className="text-[10px] font-bold text-slate-400 block">Avg Rating Given</span>
          <span className="font-black text-amber-600 text-sm sm:text-base flex items-center justify-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {customer.rating} / 5
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default LoyaltyCard;
