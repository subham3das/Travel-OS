import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, ShieldCheck, Users, Briefcase, MessageSquare } from 'lucide-react';
import deskElementImg from '../../../assets/images/agency-onbord-deskelement.jpg';

/**
 * Agency Onboarding — Welcome (Step 1)
 * Route: /agency/onboarding (and /agency)
 *
 * Pixel-perfect match for frontend/src/assets/images/agency-onbording1.png
 */
export const AgencyOnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] flex flex-col items-center justify-start py-6 px-4 font-sans select-none overflow-y-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[420px] flex flex-col gap-6 py-2"
      >
        {/* ── Top Brand Logo (Centered) ── */}
        <motion.div variants={itemVariants} className="flex justify-center items-center pt-2">
          <div className="flex items-center justify-center gap-2.5">
            {/* Purple Teardrop Badge with Compass / Plane */}
            <div className="w-10 h-10 rounded-full bg-[#583BE8] flex items-center justify-center shadow-md shadow-[#583BE8]/25 shrink-0">
              <svg className="w-5.5 h-5.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 21.5C12 21.5 19 15.5 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15.5 12 21.5 12 21.5Z"
                  fill="white"
                  fillOpacity="0.25"
                />
                <circle cx="12" cy="9.5" r="3.5" stroke="white" strokeWidth="1.8" />
                <path d="M12 7.5L13.5 11L12 10L10.5 11L12 7.5Z" fill="white" />
              </svg>
            </div>
            <span className="text-2xl sm:text-[28px] font-extrabold text-[#0F172A] tracking-tight">
              Apna<span className="text-[#583BE8]">Trip</span>
            </span>
          </div>
        </motion.div>

        {/* ── Headline & Description (Left-aligned) ── */}
        <motion.div variants={itemVariants} className="space-y-2.5 px-1">
          <h1 className="text-3xl sm:text-[34px] font-extrabold text-[#0F172A] tracking-tight leading-[1.18]">
            Grow Your <br />
            Travel Business <br />
            with <span className="text-[#583BE8]">ApnaTrip</span>
          </h1>

          <p className="text-[#64748B] text-sm font-normal leading-relaxed max-w-[320px]">
            List your travel packages, reach more travelers, and manage your bookings from one place.
          </p>
        </motion.div>

        {/* ── Desk Element Illustration (Centered) ── */}
        <motion.div variants={itemVariants} className="w-full flex justify-center items-center my-1">
          <div className="relative w-full max-w-[360px] h-[190px] sm:h-[210px] flex items-center justify-center">
            <img
              src={deskElementImg}
              alt="Agency Desk Illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>

        {/* ── Benefits Card ── */}
        <motion.div variants={itemVariants} className="w-full">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
            {/* Benefit 1 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F0EBFF] text-[#583BE8] flex items-center justify-center shrink-0 mt-0.5">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-[#0F172A] text-[15px] sm:text-base">
                  Reach more travelers
                </h3>
                <p className="text-[#64748B] text-xs font-normal leading-relaxed">
                  Get discovered by thousands of travelers looking for their next trip.
                </p>
              </div>
            </div>

            <div className="h-[1px] bg-slate-100/90 w-full" />

            {/* Benefit 2 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F0EBFF] text-[#583BE8] flex items-center justify-center shrink-0 mt-0.5">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-[#0F172A] text-[15px] sm:text-base">
                  Manage your packages & bookings
                </h3>
                <p className="text-[#64748B] text-xs font-normal leading-relaxed">
                  Create, manage and track all your packages and bookings in one place.
                </p>
              </div>
            </div>

            <div className="h-[1px] bg-slate-100/90 w-full" />

            {/* Benefit 3 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F0EBFF] text-[#583BE8] flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-[#0F172A] text-[15px] sm:text-base">
                  Communicate with customers
                </h3>
                <p className="text-[#64748B] text-xs font-normal leading-relaxed">
                  Chat directly with travelers and provide the best support.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Primary & Secondary CTAs ── */}
        <motion.div variants={itemVariants} className="space-y-3 pt-1">
          {/* Primary CTA */}
          <button
            onClick={() => navigate('/agency/onboarding/business')}
            className="w-full py-4 px-6 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] active:scale-[0.99] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#583BE8]/25 transition-all cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Secondary CTA — Clean text line */}
          <div className="text-center pt-1">
            <span className="text-xs sm:text-sm font-medium text-slate-500">
              Already have an agency account?{' '}
            </span>
            <button
              onClick={() => navigate('/agency/login')}
              className="text-xs sm:text-sm font-bold text-[#583BE8] hover:underline cursor-pointer"
            >
              Login
            </button>
          </div>
        </motion.div>

        {/* ── Legal Footer ── */}
        <motion.div variants={itemVariants} className="pt-1 pb-4">
          <div className="flex items-center justify-center gap-1.5 text-center text-xs text-[#64748B] px-2">
            <ShieldCheck className="w-4 h-4 text-[#583BE8] shrink-0" />
            <span>
              By continuing, you agree to ApnaTrip's{' '}
              <button
                onClick={() => alert('Partner Terms & Conditions coming soon')}
                className="text-[#583BE8] font-semibold hover:underline cursor-pointer"
              >
                Partner Terms & Conditions.
              </button>
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AgencyOnboardingPage;
