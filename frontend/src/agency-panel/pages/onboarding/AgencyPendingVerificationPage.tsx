import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ShieldCheck,
  Mail,
  RefreshCw,
  LogOut,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  checkAgencyVerificationStatus,
  getSubmittedApplication,
} from '../../services/agencyOnboarding.service';
import { useAgencyAuthContext } from '../../services/agencyAuth.service';
import { AgencyVerificationStatus } from '../../types/agency';

export const AgencyPendingVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { logoutAgency } = useAgencyAuthContext();

  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const appData = getSubmittedApplication();
  const appId = appData?.applicationId || 'APNA-AGY-2026-8492';
  const email = appData?.email || 'partner@apnatrip.com';
  const submittedAtFormatted = appData?.submittedAt
    ? new Date(appData.submittedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleRefreshStatus = async () => {
    setIsChecking(true);
    setStatusMessage(null);

    try {
      const res = await checkAgencyVerificationStatus();

      if (res.status === AgencyVerificationStatus.APPROVED) {
        setIsApproved(true);
        setStatusMessage('Congratulations! Your application has been approved.');
        setTimeout(() => {
          navigate('/agency/dashboard');
        }, 1800);
      } else if (res.status === AgencyVerificationStatus.REJECTED) {
        navigate('/agency/application-rejected');
      } else {
        setStatusMessage('Still under review. Our verification team is actively reviewing your application.');
      }
    } catch (e) {
      setStatusMessage('Unable to connect to status server. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = () => {
    logoutAgency();
    navigate('/agency/login');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] flex flex-col justify-between font-sans select-none p-4 sm:p-6">
      {/* Top Header */}
      <header className="py-4 px-2 flex justify-center items-center">
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

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto flex flex-col items-center justify-center text-center my-6 space-y-6">
        {/* Approved Animation Overlay */}
        <AnimatePresence>
          {isApproved ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-16 h-16 stroke-[2.5]" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="w-24 h-24 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shadow-lg shadow-amber-500/10"
            >
              <Clock className="w-12 h-12 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-black tracking-wider uppercase inline-block">
            🟡 UNDER REVIEW
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Verification Pending
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
            Your application (<span className="font-bold text-[#0F172A]">{appId}</span>) is currently being reviewed by our verification team.
          </p>
        </div>

        {/* Dynamic Status Toast Message */}
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full p-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 ${
              isApproved
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-purple-50 text-[#583BE8] border border-purple-100'
            }`}
          >
            {isApproved ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMessage}</span>
          </motion.div>
        )}

        {/* Details Card */}
        <div className="w-full bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3.5 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-extrabold text-[#0F172A]">Application ID</span>
            <span className="text-xs font-black text-[#583BE8]">{appId}</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500">Submitted Date</span>
            <span className="text-xs font-bold text-[#0F172A]">{submittedAtFormatted}</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500">Estimated Review Time</span>
            <span className="text-xs font-bold text-emerald-600">24–48 Hours</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-100 truncate">
            <span className="text-xs font-bold text-slate-500 shrink-0">Registered Email</span>
            <span className="text-xs font-bold text-[#0F172A] truncate" title={email}>{email}</span>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-xs font-bold text-slate-500">Support Email</span>
            <a
              href="mailto:support@apnatrip.com"
              className="text-xs font-bold text-[#583BE8] hover:underline"
            >
              support@apnatrip.com
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3 pt-2">
          {/* Refresh Status Button */}
          <button
            type="button"
            disabled={isChecking || isApproved}
            onClick={handleRefreshStatus}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#583BE8]/25 transition-all cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking Status...' : 'Refresh Status'}</span>
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3 px-6 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.99] text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Logout</span>
          </button>
        </div>
      </main>

      <footer className="text-center py-2 text-[11px] text-slate-400 font-medium">
        © 2026 ApnaTrip Partner Portal. All rights reserved.
      </footer>
    </div>
  );
};

export default AgencyPendingVerificationPage;
