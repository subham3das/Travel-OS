import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ArrowRight, X, Building2, CheckCircle2 } from 'lucide-react';
import { agencyFinanceService } from '../../services/agencyFinance.service';

export const PaymentSetupReminderModal: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);

  useEffect(() => {
    // Don't show if already on payment setup page or login/auth pages
    if (
      location.pathname.includes('/agency/settings/payment') ||
      location.pathname.includes('/agency/profile/bank') ||
      location.pathname.includes('/agency/login') ||
      location.pathname.includes('/agency/signup')
    ) {
      setIsOpen(false);
      return;
    }

    // Check session storage first so it doesn't harass on every single route click during same session
    const sessionDismissed = sessionStorage.getItem('payout_reminder_dismissed');
    if (sessionDismissed === 'true') {
      return;
    }

    // Check payout profile status
    agencyFinanceService
      .getPaymentProfile()
      .then((profile) => {
        if (!profile || profile.status !== 'APPROVED') {
          setProfileStatus(profile?.status || 'NOT_STARTED');
          setIsOpen(true);
        }
      })
      .catch((err) => {
        console.warn('Payment profile status check notice:', err.message);
      });
  }, [location.pathname]);

  const handleSetupNow = () => {
    setIsOpen(false);
    sessionStorage.setItem('payout_reminder_dismissed', 'true');
    navigate('/agency/settings/payment');
  };

  const handleSkipForNow = async () => {
    try {
      setIsSkipping(true);
      await agencyFinanceService.skipPaymentProfile('Agency');
    } catch (err) {
      console.warn('Failed to register skip status:', err);
    } finally {
      setIsSkipping(false);
      sessionStorage.setItem('payout_reminder_dismissed', 'true');
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden font-sans"
        >
          {/* Header decorative strip */}
          <div className="h-2 bg-gradient-to-r from-[#583BE8] via-indigo-500 to-purple-600" />

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 sm:p-7 text-center space-y-5">
            {/* Icon */}
            <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#583BE8] shadow-xs">
              <Building2 className="w-7 h-7" />
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/70">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Action Required to Sell</span>
              </div>
              <h2 className="text-xl font-black text-[#0F172A] tracking-tight">Complete Payment Setup</h2>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-xs mx-auto">
                Complete your payout account setup to start selling packages and receive automated settlements directly into your bank account.
              </p>
            </div>

            {/* Highlights */}
            <div className="bg-slate-50/80 rounded-2xl p-3.5 text-left border border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Direct bank payouts via Razorpay Route</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Publish Ready-To-Sell packages instantly</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Bank accounts secured with AES-256 encryption</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleSetupNow}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#583BE8] hover:bg-[#472ec4] text-white font-extrabold text-xs tracking-wide shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Setup Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleSkipForNow}
                disabled={isSkipping}
                className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
              >
                {isSkipping ? 'Saving preference...' : 'Skip For Now'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
