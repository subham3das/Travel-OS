import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Lock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Agency, PartnerOnboardingStatus } from '../../types/agency';

interface PartnerOnboardingStatusHeroProps {
  agency: Agency;
  onContinuePayment?: () => void;
}

export const PartnerOnboardingStatusHero: React.FC<PartnerOnboardingStatusHeroProps> = ({
  agency,
  onContinuePayment,
}) => {
  const navigate = useNavigate();

  const status: PartnerOnboardingStatus =
    (agency.onboardingStatus as PartnerOnboardingStatus) ||
    (agency.verificationStatus === 'APPROVED' ? 'APPROVED' : 'PAYMENT_PENDING');

  const isPaymentPending = status === 'ACCOUNT_CREATED' || status === 'PAYMENT_PENDING';
  const isUnderReview =
    status === 'PAYMENT_COMPLETED' ||
    status === 'DOCUMENTS_SUBMITTED' ||
    status === 'UNDER_REVIEW';
  const isApproved = status === 'APPROVED';

  const partnerName = agency.agencyDisplayName || agency.name || 'Partner';
  const applicationId = agency.applicationId || 'AGY-REQ-2026';

  const handlePaymentClick = () => {
    if (onContinuePayment) {
      onContinuePayment();
    } else {
      const type = agency.activeBusiness === 'car_rental' ? 'car_rental' : 'agency';
      navigate(`/partner/subscription?type=${type}`);
    }
  };

  if (isApproved) {
    return null; // When approved, regular dashboard renders completely without onboarding hero
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6 select-none overflow-hidden relative"
    >
      {/* Decorative gradient glow at top */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#583BE8] to-purple-600" />

      {/* Top Banner for Under Review State */}
      {isUnderReview && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/5 border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-indigo-950">
                Application Under Review - Expected Review Time: 24-48 Hours
              </p>
              <p className="text-[11px] text-slate-600 font-medium">
                Accessible items: Dashboard, Profile, Notifications, Support, Invoices. Operational modules (Packages, Bookings, Finance, Fleet) unlock upon Super Admin approval.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full self-start sm:self-auto shrink-0">
            Pending Approval
          </span>
        </div>
      )}

      {/* Top Header Row: Title & Contextual Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#583BE8] bg-purple-50 px-2.5 py-1 rounded-lg inline-block">
              Partner Onboarding
            </span>
            <span className="text-xs font-bold text-slate-400">Ref: {applicationId}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Welcome, {partnerName}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {isPaymentPending
              ? 'Your account is created. Complete registration fee payment to submit your partner application for review.'
              : isUnderReview
              ? 'Application Under Review - Expected Review Time: 24-48 Hours. Our team is verifying your partner KYC documents.'
              : 'Partner onboarding state machine active.'}
          </p>
        </div>

        {/* Status Pill */}
        <div className="shrink-0 self-start sm:self-auto">
          {isPaymentPending && (
            <div className="px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-extrabold flex items-center gap-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Registration Fee Pending</span>
            </div>
          )}
          {isUnderReview && (
            <div className="px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-extrabold flex items-center gap-2 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
              <span>Under Review (24–48h)</span>
            </div>
          )}
        </div>
      </div>

      {/* 4-Step Milestone Checklist (Clean SaaS Shopify/Stripe Card) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
        {/* Milestone 1: Account Created */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
          <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-black text-[#0F172A]">Account Created</p>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">✓</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
              Partner profile and login credentials active.
            </p>
          </div>
        </div>

        {/* Milestone 2: Registration Fee Pending / Paid */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            !isPaymentPending
              ? 'bg-emerald-50/70 border-emerald-200/80'
              : 'bg-amber-50/80 border-amber-200 shadow-xs'
          } flex items-start gap-3`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
              !isPaymentPending
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {!isPaymentPending ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <CreditCard className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-black text-[#0F172A]">
                {!isPaymentPending ? 'Registration Fee Paid' : 'Registration Fee Pending'}
              </p>
              {!isPaymentPending && (
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">✓</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
              {!isPaymentPending
                ? 'One-time onboarding fee verified.'
                : '₹1,000 verification & platform setup fee.'}
            </p>
          </div>
        </div>

        {/* Milestone 3: Application Not Submitted / Submitted */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isUnderReview
              ? 'bg-emerald-50/70 border-emerald-200/80'
              : 'bg-slate-50 border-slate-200/80 opacity-75'
          } flex items-start gap-3`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
              isUnderReview ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            {isUnderReview ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <FileCheck className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-black text-[#0F172A]">
                {isUnderReview ? 'Application Submitted' : 'Application Not Submitted'}
              </p>
              {isUnderReview && (
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">✓</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
              {isUnderReview
                ? 'Application submitted successfully.'
                : 'Triggers automatically upon fee payment.'}
            </p>
          </div>
        </div>

        {/* Milestone 4: Verification Pending */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isUnderReview
              ? 'bg-indigo-50/80 border-indigo-200 shadow-xs'
              : 'bg-slate-50 border-slate-200/80 opacity-75'
          } flex items-start gap-3`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
              isUnderReview ? 'bg-[#583BE8] text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-[#0F172A]">Verification Pending</p>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
              {isUnderReview
                ? 'Super Admin reviewing compliance (24–48h).'
                : 'Queues after fee payment & submission.'}
            </p>
          </div>
        </div>
      </div>

      {/* Prominent Action Callout */}
      {isPaymentPending ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50/60 to-purple-50/30 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#583BE8]" />
              <h4 className="text-sm font-black text-[#0F172A]">
                Ready to activate your partner operations?
              </h4>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Complete the one-time registration fee payment to submit your application and unlock operations.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePaymentClick}
            className="px-6 py-3.5 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#583BE8]/25 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <span>Continue Payment (₹1,000)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : isUnderReview ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-indigo-600" />
              <h4 className="text-sm font-black text-indigo-950">
                Application Submitted Successfully
              </h4>
            </div>
            <p className="text-xs text-indigo-800 font-medium">
              Your registration fee is paid. Our compliance team is verifying your business details.
              You will be notified once operational access is unlocked.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/agency/profile')}
            className="px-4 py-2.5 rounded-xl bg-white border border-indigo-200 text-indigo-900 hover:bg-indigo-50 font-bold text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            <span>View Application Profile</span>
            <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
          </button>
        </div>
      ) : null}

      {/* Operational Modules Locked Banner */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2.5 text-xs text-slate-500 font-semibold">
        <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>
          Operational modules (Packages, Bookings, Customers, Analytics, Payments) remain securely locked until application verification is completed.
        </span>
      </div>
    </motion.div>
  );
};
