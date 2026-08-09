import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  LogOut,
  ArrowRight,
  Sparkles,
  FileText,
  Package,
  Calendar,
  Compass,
  MessageSquare,
  BarChart2,
  X,
  RefreshCw,
} from 'lucide-react';
import {
  getSubmittedApplication,
  checkAgencyVerificationStatus,
} from '../../services/agencyOnboarding.service';
import { useAgencyAuthContext } from '../../services/agencyAuth.service';
import { AgencyVerificationStatus } from '../../types/agency';

export const AgencySubmittedOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { agency, logoutAgency } = useAgencyAuthContext();
  const appData = getSubmittedApplication();

  const [status, setStatus] = useState<AgencyVerificationStatus>(
    agency?.verificationStatus || (appData?.status as AgencyVerificationStatus) || AgencyVerificationStatus.UNDER_REVIEW
  );

  const [hasSeenAnim, setHasSeenAnim] = useState<boolean>(() => {
    try {
      return localStorage.getItem('apnatrip_agency_seen_approval_anim') === 'true';
    } catch {
      return false;
    }
  });

  // Approval sequence animation step state (0 to 6)
  const [animStep, setAnimStep] = useState<number>(0);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const applicationId = appData?.applicationId || 'APNA-AGY-2026-8492';
  const email = appData?.email || 'partner@apnatrip.com';
  const phone = appData?.phone || '+91 98765 43210';
  const agencyName = appData?.agencyName || 'Partner Agency';

  const submittedAtFormatted = appData?.submittedAt
    ? new Date(appData.submittedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

  const approvedAtFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // ── Approval Sequence Trigger ──
  const startApprovalSequence = () => {
    setStatus(AgencyVerificationStatus.APPROVED);

    // Step 1: Toast slide-in
    setShowToast(true);
    setAnimStep(1);

    // Step 2: Status Badge transition (0.3s)
    setTimeout(() => {
      setAnimStep(2);
    }, 350);

    // Step 3: Timeline & Confetti burst (0.7s)
    setTimeout(() => {
      setAnimStep(3);
      setShowConfetti(true);
    }, 700);

    // Step 4: Hero text transition (1.2s)
    setTimeout(() => {
      setAnimStep(4);
    }, 1200);

    // Step 5: Feature Cards fade in (1.6s)
    setTimeout(() => {
      setAnimStep(5);
    }, 1600);

    // Step 6: Primary Dashboard button fade in (2.2s)
    setTimeout(() => {
      setAnimStep(6);
    }, 2200);

    // Toast auto-hide after 4 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 4500);

    // Stop confetti after 5s
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  // ── Initial & Polling Status Check ──
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await checkAgencyVerificationStatus();
        if (res.status === AgencyVerificationStatus.APPROVED) {
          setStatus(AgencyVerificationStatus.APPROVED);
          if (!hasSeenAnim) {
            startApprovalSequence();
          } else {
            setAnimStep(6);
          }
        }
      } catch (e) {
        // ignore
      }
    };

    fetchStatus();

    // Setup 30s status monitoring polling
    if (status === AgencyVerificationStatus.UNDER_REVIEW) {
      pollingRef.current = setInterval(fetchStatus, 30000);
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [hasSeenAnim]);

  // If already approved and seen animation, set final step immediately
  useEffect(() => {
    if (status === AgencyVerificationStatus.APPROVED && hasSeenAnim) {
      setAnimStep(6);
    }
  }, [status, hasSeenAnim]);

  const handleGoToDashboard = () => {
    try {
      localStorage.setItem('apnatrip_agency_seen_approval_anim', 'true');
      setHasSeenAnim(true);
    } catch {
      // ignore
    }
    navigate('/agency/dashboard');
  };

  const handleLogout = () => {
    logoutAgency();
    navigate('/agency/login');
  };

  const isApproved = status === AgencyVerificationStatus.APPROVED;

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* ── TOP RIGHT TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-5 right-5 z-50 bg-white border border-emerald-200 shadow-2xl rounded-2xl p-4 max-w-sm flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30 text-lg">
              🎉
            </div>
            <div className="space-y-0.5 flex-1 pr-2">
              <h4 className="text-xs font-black text-[#0F172A]">Application Approved!</h4>
              <p className="text-[11px] font-semibold text-slate-500 leading-snug">
                Your agency has been successfully verified by compliance team.
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CELEBRATION CONFETTI PARTICLES ── */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => {
            const left = Math.random() * 100;
            const size = Math.random() * 10 + 6;
            const colors = ['#583BE8', '#10B981', '#F59E0B', '#3B82F6', '#EC4899'];
            const color = colors[i % colors.length];
            const delay = Math.random() * 0.6;
            const duration = Math.random() * 2 + 2.5;

            return (
              <motion.div
                key={i}
                initial={{ y: -20, x: `${left}vw`, opacity: 1, rotate: 0 }}
                animate={{
                  y: '105vh',
                  x: `${left + (Math.random() * 20 - 10)}vw`,
                  opacity: [1, 1, 0],
                  rotate: 360,
                }}
                transition={{ duration, delay, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  width: size,
                  height: size,
                  backgroundColor: color,
                  borderRadius: i % 2 === 0 ? '50%' : '2px',
                }}
              />
            );
          })}
        </div>
      )}

      {/* ── Top Header with Brand Logo ── */}
      <header className="py-4 px-6 flex justify-center items-center bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#583BE8] flex items-center justify-center shadow-md shadow-[#583BE8]/25 shrink-0">
            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21.5C12 21.5 19 15.5 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15.5 12 21.5 12 21.5Z"
                fill="white"
                fillOpacity="0.25"
              />
              <circle cx="12" cy="9.5" r="3.5" stroke="white" strokeWidth="1.8" />
              <path d="M12 7.5L13.5 11L12 10L10.5 11L12 7.5Z" fill="white" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Apna<span className="text-[#583BE8]">Trip</span>
          </span>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 space-y-6 pb-20">
        {/* Hero Header */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-4"
        >
          {/* Animated Header Badge */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
            {isApproved && animStep >= 2 ? (
              <motion.div
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="w-full h-full rounded-full bg-emerald-50 text-emerald-600 border-4 border-emerald-200 flex items-center justify-center shadow-xl shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.4]" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute -top-1 -right-1 bg-amber-400 text-white p-1 rounded-full text-xs shadow-xs"
                >
                  ✨
                </motion.div>
              </motion.div>
            ) : (
              <div className="w-full h-full rounded-full bg-amber-50 text-amber-600 border-4 border-amber-100 flex items-center justify-center shadow-xl shadow-amber-500/10 relative">
                <Clock className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.2] animate-pulse" />
                <div className="absolute -top-1 -right-1 bg-amber-400 text-white p-1 rounded-full text-xs shadow-xs">
                  ⏳
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {isApproved && animStep >= 4 ? (
                <motion.div
                  key="approved-hero"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-1.5"
                >
                  <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight leading-snug">
                    Congratulations! 🎉<br />Your Agency Has Been Approved.
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
                    You now have full access to the ApnaTrip Partner Portal and agency dashboard capabilities.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="under-review-hero"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-1.5"
                >
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                    Application Submitted Successfully 🎉
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                    Thank you for joining ApnaTrip Partners. Your agency application for{' '}
                    <span className="font-bold text-[#0F172A]">{agencyName}</span> has been successfully submitted. Our verification team is now reviewing your documents.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── STATUS CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className={`p-5 rounded-3xl border transition-all duration-500 flex items-start gap-4 shadow-sm ${
            isApproved && animStep >= 2
              ? 'bg-emerald-50/80 border-emerald-200/90'
              : 'bg-amber-50/80 border-amber-200/80'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-colors duration-500 mt-0.5 ${
              isApproved && animStep >= 2
                ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                : 'bg-amber-500 text-white shadow-amber-500/20'
            }`}
          >
            {isApproved && animStep >= 2 ? (
              <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <Clock className="w-5 h-5 animate-pulse" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {isApproved && animStep >= 2 ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 text-[10px] font-black uppercase tracking-wider">
                  ✓ APPROVED
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                  🟡 UNDER REVIEW
                </span>
              )}
            </div>

            <h3 className="text-sm font-extrabold text-[#0F172A]">
              {isApproved && animStep >= 2 ? 'Verification Approved' : 'Under Review'}
            </h3>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {isApproved && animStep >= 2
                ? 'Your agency documents have been verified. Your account is active and verified for partner operations.'
                : 'Your agency is currently under verification. You will receive an email and an in-app notification once your application has been approved.'}
            </p>
          </div>
        </motion.div>

        {/* ── APPLICATION TIMELINE ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4"
        >
          <h2 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#583BE8]" />
            <span>Application Timeline</span>
          </h2>

          <div className="relative pl-6 space-y-6">
            {/* Timeline Vertical Connecting Line */}
            <div
              className={`absolute left-2.5 top-2 bottom-2 w-0.5 transition-colors duration-700 ${
                isApproved && animStep >= 3 ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            />

            {/* Step 1: Submitted */}
            <div className="relative">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow-sm">
                ✓
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-extrabold text-[#0F172A]">✓ Application Submitted</h4>
                <p className="text-[11px] font-medium text-slate-400">{submittedAtFormatted}</p>
              </div>
            </div>

            {/* Step 2: Under Review */}
            <div className="relative">
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-colors duration-500 ${
                  isApproved && animStep >= 3
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 text-white ring-4 ring-amber-100'
                }`}
              >
                {isApproved && animStep >= 3 ? '✓' : <div className="w-2 h-2 rounded-full bg-white animate-ping" />}
              </div>
              <div className="space-y-0.5">
                <h4
                  className={`text-xs font-extrabold flex items-center gap-1.5 transition-colors duration-500 ${
                    isApproved && animStep >= 3 ? 'text-[#0F172A]' : 'text-amber-700'
                  }`}
                >
                  {isApproved && animStep >= 3 ? '✓ Under Review' : '🟡 Under Review'}
                  {!(isApproved && animStep >= 3) && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                      IN PROGRESS
                    </span>
                  )}
                </h4>
                <p className="text-[11px] font-medium text-slate-500">
                  {isApproved && animStep >= 3
                    ? 'Document & identity verification completed'
                    : 'Verification team is reviewing documents (Estimated 24–48 Hours)'}
                </p>
              </div>
            </div>

            {/* Step 3: Approved */}
            <div className="relative">
              {isApproved && animStep >= 3 ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                  className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow-md shadow-emerald-500/30"
                >
                  ✓
                </motion.div>
              ) : (
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center" />
              )}

              <div className="space-y-0.5">
                <h4
                  className={`text-xs font-bold transition-colors duration-500 ${
                    isApproved && animStep >= 3 ? 'text-emerald-700 font-extrabold' : 'text-slate-400'
                  }`}
                >
                  {isApproved && animStep >= 3 ? '✓ Approved' : '○ Approved'}
                </h4>
                <p className="text-[11px] font-medium text-slate-500">
                  {isApproved && animStep >= 3
                    ? `Approved on ${approvedAtFormatted}`
                    : 'Agency dashboard access will be unlocked after approval'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── FEATURE CARDS FADE IN (Step 5+) ── */}
        <AnimatePresence>
          {isApproved && animStep >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-purple-50/90 via-indigo-50/50 to-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-[#583BE8]" />
                <h3 className="text-sm font-extrabold text-[#0F172A]">You can now</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-[#0F172A]">
                <div className="p-3 rounded-2xl bg-white border border-purple-100 flex items-center gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#583BE8] flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <span>✓ Create Tour Packages</span>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-purple-100 flex items-center gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span>✓ Receive Bookings</span>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-purple-100 flex items-center gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span>✓ Manage Trips</span>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-purple-100 flex items-center gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span>✓ Chat with Travelers</span>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-purple-100 sm:col-span-2 flex items-center gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <span>✓ View Platform Analytics</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── APPLICATION DETAILS CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4"
        >
          <h2 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#583BE8]" />
            <span>Application Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Application ID</span>
              <p className="text-xs font-black text-[#583BE8]">{applicationId}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Submission Date</span>
              <p className="text-xs font-bold text-[#0F172A]">{submittedAtFormatted}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {isApproved ? 'Approved On' : 'Estimated Review Time'}
              </span>
              <p className="text-xs font-bold text-[#0F172A]">
                {isApproved ? approvedAtFormatted : '24–48 Hours'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-0.5 truncate">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Email</span>
              <p className="text-xs font-bold text-[#0F172A] truncate" title={email}>{email}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-0.5 sm:col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Phone</span>
              <p className="text-xs font-bold text-[#0F172A]">{phone}</p>
            </div>
          </div>
        </motion.div>

        {/* ── ACTION BUTTONS ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="space-y-3 pt-2"
        >
          {isApproved && animStep >= 6 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-2"
            >
              {/* Primary Action: Go to Dashboard */}
              <button
                type="button"
                onClick={handleGoToDashboard}
                className="w-full py-4 px-6 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-[#583BE8]/30 transition-all cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-[11px] font-semibold text-slate-400">
                Approved on {approvedAtFormatted}
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Primary Action: Check Application Status */}
              <button
                type="button"
                onClick={() => navigate('/agency/verification-pending')}
                className="w-full sm:w-1/2 py-3.5 px-6 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#583BE8]/25 transition-all cursor-pointer"
              >
                <span>Check Application Status</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Secondary Action: Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full sm:w-1/2 py-3.5 px-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99] text-slate-700 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AgencySubmittedOnboardingPage;
