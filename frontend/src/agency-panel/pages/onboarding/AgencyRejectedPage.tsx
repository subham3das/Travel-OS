import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Mail, ArrowLeft, LogOut, RefreshCw } from 'lucide-react';
import { getSubmittedApplication } from '../../services/agencyOnboarding.service';
import { useAgencyAuthContext } from '../../services/agencyAuth.service';

/**
 * Agency Application Rejected Page
 * Route: /agency/application-rejected
 */
export const AgencyRejectedPage: React.FC = () => {
  const navigate = useNavigate();
  const { logoutAgency } = useAgencyAuthContext();
  const appData = getSubmittedApplication();

  const appId = appData?.applicationId || 'APNA-AGY-2026-8492';
  const email = appData?.email || 'partner@apnatrip.com';
  const rejectionReason = appData?.rejectionReason || 'Uploaded documents could not be verified by compliance team.';

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
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-600 border border-rose-200/80 flex items-center justify-center shadow-lg shadow-rose-500/10"
        >
          <AlertTriangle className="w-10 h-10" />
        </motion.div>

        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-extrabold tracking-wider uppercase inline-block">
            🔴 APPLICATION REJECTED
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Application Not Approved
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
            Regrettably, your agency application (<span className="font-bold text-[#0F172A]">{appId}</span>) was not approved.
          </p>
        </div>

        {/* Reason Box */}
        <div className="w-full bg-rose-50/60 rounded-3xl p-5 border border-rose-200/80 text-left space-y-2">
          <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-wider block">Rejection Reason</span>
          <p className="text-xs font-bold text-rose-900 leading-relaxed">{rejectionReason}</p>
        </div>

        {/* Details Card */}
        <div className="w-full bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3.5 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500">Registered Email</span>
            <span className="text-xs font-bold text-[#0F172A]">{email}</span>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-xs font-bold text-slate-500">Support Assistance</span>
            <a
              href="mailto:support@apnatrip.com"
              className="text-xs font-bold text-[#583BE8] hover:underline"
            >
              support@apnatrip.com
            </a>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full space-y-3 pt-2">
          <button
            onClick={() => navigate('/agency/onboarding')}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#583BE8]/25 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Re-apply with Updated Info</span>
          </button>

          <button
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

export default AgencyRejectedPage;
