import React from 'react';
import {
  Crown,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  RotateCw,
} from 'lucide-react';
import { UserMembershipData } from '../../../../types/userKyc';

interface MembershipCardProps {
  membership: UserMembershipData;
  isLoading?: boolean;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  membership,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-3.5 w-28 bg-slate-100 rounded" />
          <div className="h-5 w-20 bg-slate-100 rounded-full" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-3/4 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  const plan = membership.currentPlan || 'Free';

  const getTierBadgeStyle = () => {
    switch (plan) {
      case 'Platinum':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Gold':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Silver':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Free':
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Crown className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
              Membership Program
            </h4>
            <p className="text-[10px] font-semibold text-slate-400">
              Traveler Tier & Privilege Overview
            </p>
          </div>
        </div>

        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase shadow-2xs ${getTierBadgeStyle()}`}
        >
          {plan} Tier
        </span>
      </div>

      {/* Membership Key Metrics */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> Current Plan
          </span>
          <span className="font-black text-[#0F172A] text-xs">
            {plan} Member
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Calendar className="w-2.5 h-2.5" /> Member Since
          </span>
          <span className="font-extrabold text-slate-700">
            {membership.memberSince || '—'}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> Valid Till
          </span>
          <span className="font-extrabold text-emerald-600">
            {membership.validTill || 'Lifetime'}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <RotateCw className="w-2.5 h-2.5" /> Renewal
          </span>
          <span className="font-bold text-slate-600 text-[11px] truncate block">
            {membership.renewal || 'Auto-renews'}
          </span>
        </div>
      </div>

      {/* Plan Benefits */}
      {membership.benefits && membership.benefits.length > 0 && (
        <div className="pt-2 border-t border-slate-50 space-y-1.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            Tier Benefits & Privileges
          </span>
          <div className="space-y-1">
            {membership.benefits.map((b: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start gap-1.5 text-[11px] text-slate-600 font-semibold"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade Eligibility Banner */}
      {membership.upgradeEligibility && (
        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-800 text-xs flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-[11px] font-bold leading-tight">
            {membership.upgradeEligibility}
          </p>
        </div>
      )}
    </div>
  );
};
