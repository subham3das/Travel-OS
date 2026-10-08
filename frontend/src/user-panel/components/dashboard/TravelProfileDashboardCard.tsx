import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Clock,
  XCircle,
  FileUp,
} from 'lucide-react';
import {
  travelProfileService,
  TravelProfileStats,
  TravelProfileData,
} from '../../services/travelProfile.service';

interface TravelProfileDashboardCardProps {
  className?: string;
  onManageClick?: () => void;
}

export const TravelProfileDashboardCard: React.FC<TravelProfileDashboardCardProps> = ({
  className = '',
  onManageClick,
}) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<TravelProfileData | null>(null);
  const [stats, setStats] = useState<TravelProfileStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    travelProfileService
      .getProfile()
      .then((res) => {
        if (isMounted) {
          setProfile(res.profile);
          setStats(res.stats);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Could not load travel profile stats:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleClick = (subTab?: string) => {
    if (onManageClick) {
      onManageClick();
    } else {
      navigate(subTab ? `/profile?tab=${subTab}` : '/profile?tab=travel-profile');
    }
  };

  if (loading) {
    return (
      <div className={`p-4 rounded-3xl bg-white border border-slate-100 shadow-2xs animate-pulse ${className}`}>
        <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
        <div className="h-2 w-full bg-slate-100 rounded-full mb-3" />
        <div className="h-4 w-48 bg-slate-200 rounded" />
      </div>
    );
  }

  const isVerified = stats?.isVerified || profile?.verificationStatus === 'VERIFIED';
  const isRejected = profile?.verificationStatus === 'REJECTED';
  const isPending = profile?.verificationStatus === 'PENDING';
  const percentage = stats?.completionPercentage ?? profile?.completionPercentage ?? 40;
  const travelersCount = stats?.savedTravelersCount ?? 1;

  // ── STATE 3: Admin verified KYC ──
  // Automatically remove card completely from Home screen. No empty spacing. Reflow naturally.
  if (isVerified) {
    return null;
  }

  // ── STATE 4: KYC Verification Rejected / Failed ──
  if (isRejected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl bg-rose-50/70 border border-rose-200 p-4 sm:p-5 shadow-2xs transition-all ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <XCircle className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-rose-900 tracking-tight">
                Verification Failed
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-rose-200/60 text-rose-800 text-[10px] font-black uppercase">
                Action Required
              </span>
            </div>

            <p className="text-xs text-rose-700 font-medium leading-relaxed pl-9">
              {profile?.rejectionReason
                ? profile.rejectionReason
                : 'Your government ID documents could not be verified by compliance. Please review and re-upload clear photos.'}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:self-center shrink-0 pl-9 sm:pl-0">
            <button
              onClick={() => handleClick('travel-profile')}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Re-upload Documents</span>
            </button>

            <button
              onClick={() => handleClick('travel-profile')}
              className="px-3 py-2 rounded-xl bg-white border border-rose-200 text-rose-800 text-xs font-bold hover:bg-rose-100/50 transition-colors cursor-pointer"
            >
              Manage Profile
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── STATE 2: Travel Profile Completed, KYC Pending Review ──
  // Compact informational card (reduced height ~40–50%, no oversized illustrations or excessive padding)
  if (isPending) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl bg-white border border-slate-100 shadow-2xs p-3.5 sm:p-4 hover:border-slate-200 transition-all ${className}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-[#0F172A]">
                  Travel Profile
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black border border-amber-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Pending Verification
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                Your profile has been submitted and is under review by compliance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-1 text-[11px] font-extrabold text-slate-700 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
              <span>Progress</span>
              <span className="text-emerald-600 font-black">{percentage}%</span>
            </div>

            <button
              onClick={() => handleClick('travel-profile')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── STATE 1: Travel Profile Not Started / In Progress ──
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-50/60 dark:from-slate-800 dark:to-slate-850 dark:bg-slate-800 p-5 sm:p-6 border border-slate-100/90 dark:border-white/10 shadow-xs dark:shadow-none hover:shadow-md dark:hover:border-white/20 transition-all ${className}`}
    >
      {/* Background Accent Pill Glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#2563EB]/10 to-[#FF4D6D]/5 dark:from-[#2563EB]/15 dark:to-[#06B6D4]/10 rounded-bl-[80px] pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
            </div>
            <h3 className="text-base font-black text-[#0F172A] dark:text-white tracking-tight">
              One-Time Travel Profile
            </h3>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-black border border-amber-100 dark:border-amber-900/40">
              <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              In Progress
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
              <Users className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              {travelersCount} Saved Traveler{travelersCount === 1 ? '' : 's'}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-300 font-medium leading-relaxed max-w-xl">
            Complete your travel profile once to unlock instant 1-click bookings and Silver tier privileges across all packages.
          </p>

          {/* Progress bar */}
          <div className="space-y-1.5 max-w-md pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#0F172A] dark:text-white">{percentage}% Complete</span>
              <span className="text-[11px] font-semibold text-slate-400">
                {stats?.missingFields && stats.missingFields.length > 0
                  ? `Missing: ${stats.missingFields.slice(0, 2).join(', ')}${
                      stats.missingFields.length > 2 ? '...' : ''
                    }`
                  : 'Complete verification documents'}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-white/10">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  percentage >= 80
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : percentage >= 50
                    ? 'bg-gradient-to-r from-[#2563EB] to-blue-400'
                    : 'bg-gradient-to-r from-amber-500 to-[#FF4D6D]'
                }`}
                style={{ width: `${Math.max(5, percentage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="sm:self-center shrink-0">
          <button
            onClick={() => handleClick('travel-profile')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-black shadow-md shadow-[#2563EB]/20 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>Complete Travel Profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
