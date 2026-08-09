import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Edit2,
  Building2,
  UserCheck,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  Lock,
  AlertCircle,
  RefreshCw,
  FileCheck,
  ShieldCheck,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Check,
} from 'lucide-react';
import { OnboardingStepper } from '../../components/OnboardingStepper';
import {
  submitAgencyOnboarding,
  clearOnboardingDrafts,
  CompleteOnboardingPayload,
} from '../../services/agencyOnboarding.service';

export const AgencyReviewOnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  // Load all onboarding data from local storage
  const [businessData, setBusinessData] = useState<Record<string, any>>({});
  const [profileData, setProfileData] = useState<Record<string, any>>({});
  const [verificationData, setVerificationData] = useState<Record<string, any>>({});
  const [bankData, setBankData] = useState<Record<string, any>>({});

  const [confirmAccuracy, setConfirmAccuracy] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const b = localStorage.getItem('apnatrip_agency_onboarding_business');
      if (b) setBusinessData(JSON.parse(b));

      const p = localStorage.getItem('apnatrip_agency_onboarding_profile');
      if (p) setProfileData(JSON.parse(p));

      const v = localStorage.getItem('apnatrip_agency_onboarding_verification');
      if (v) setVerificationData(JSON.parse(v));

      const k = localStorage.getItem('apnatrip_agency_onboarding_bank');
      if (k) setBankData(JSON.parse(k));
    } catch (e) {
      // ignore
    }
  }, []);

  // Helper mask for account number
  const maskAccountNumber = (accNum?: string) => {
    if (!accNum) return '•••• •••• ••••';
    const clean = accNum.trim();
    if (clean.length <= 4) return clean;
    const last4 = clean.slice(-4);
    return `•••• •••• ${last4}`;
  };

  const isDeclarationsValid = confirmAccuracy && agreeTerms;

  const handleSubmitApplication = async () => {
    if (!isDeclarationsValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const payload: CompleteOnboardingPayload = {
      business: businessData,
      profile: profileData,
      verification: verificationData,
      bank: bankData,
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await submitAgencyOnboarding(payload);
      if (res.success) {
        clearOnboardingDrafts();
        navigate('/agency/onboarding/submitted');
      } else {
        setSubmitError('Failed to submit application. Please try again.');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'An error occurred during submission. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] flex flex-col font-sans select-none">
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

      {/* ── Progress Stepper ── */}
      <div className="pt-4 pb-2 bg-white border-b border-slate-100">
        <OnboardingStepper currentStep={5} />
      </div>

      {/* ── Main Container ── */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 space-y-6 pb-28">
        {/* Title Header with Document Review Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-start justify-between gap-4"
        >
          <div className="space-y-1.5 max-w-md">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Review Your Application
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Review your information before submitting your agency application.
            </p>
          </div>

          {/* Document Review Illustration */}
          <div className="shrink-0 w-24 h-20 sm:w-32 sm:h-24 relative hidden xs:flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 140 100" fill="none">
              <rect x="25" y="15" width="85" height="70" rx="8" fill="#EDE8FF" />
              <rect x="35" y="28" width="65" height="8" rx="2" fill="#583BE8" />
              <rect x="35" y="42" width="45" height="5" rx="1.5" fill="#B4A4FF" />
              <rect x="35" y="52" width="55" height="5" rx="1.5" fill="#CBD5E1" />
              <circle cx="105" cy="65" r="14" fill="#583BE8" />
              <path d="M100 65L103.5 68.5L110 61" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </motion.div>

        {/* Global Submission Error Toast */}
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
            <button
              onClick={() => setSubmitError(null)}
              className="text-rose-500 hover:text-rose-700 cursor-pointer text-xs"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        <div className="space-y-6">
          {/* ── SECTION 1: Business Information Summary ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A]">Business Information</h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/agency/onboarding/business')}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 font-semibold block">Legal Business Name</span>
                <p className="font-extrabold text-[#0F172A]">
                  {businessData.legalBusinessName || 'Not Provided'}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-semibold block">Agency Display Name</span>
                <p className="font-extrabold text-[#0F172A]">
                  {businessData.agencyDisplayName || 'Not Provided'}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-semibold block">Business Type</span>
                <p className="font-bold text-slate-700">
                  {businessData.businessType || 'Not Provided'}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-semibold block">Year Established</span>
                <p className="font-bold text-slate-700">
                  {businessData.yearEstablished || 'N/A'}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-semibold block">Registration Number</span>
                <p className="font-bold text-slate-700">
                  {businessData.registrationNumber || 'Optional / Not Provided'}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-semibold block">GST Number</span>
                <p className="font-bold text-slate-700 uppercase">
                  {businessData.gstNumber || 'Optional / Not Provided'}
                </p>
              </div>

              <div className="sm:col-span-2 space-y-0.5 pt-1">
                <span className="text-slate-400 font-semibold block">Business Address</span>
                <p className="font-bold text-slate-700 leading-relaxed">
                  {businessData.businessAddress ? (
                    <>
                      {businessData.businessAddress}, {businessData.city}, {businessData.state} -{' '}
                      {businessData.pinCode}, {businessData.country || 'India'}
                    </>
                  ) : (
                    'Not Provided'
                  )}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── SECTION 2: Agency Profile Summary ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A]">Agency Profile</h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/agency/onboarding/profile')}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            {/* Media Thumbnails */}
            <div className="flex items-center gap-4">
              {profileData.logoUrl ? (
                <div className="w-14 h-14 rounded-full border-2 border-[#583BE8] overflow-hidden shrink-0 shadow-sm">
                  <img src={profileData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold">
                  No Logo
                </div>
              )}

              {profileData.coverUrl && (
                <div className="h-14 flex-1 rounded-2xl overflow-hidden border border-slate-200">
                  <img src={profileData.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 font-semibold block">Tagline</span>
                <p className="font-extrabold text-[#0F172A]">
                  "{profileData.tagline || 'Not Provided'}"
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-semibold block">About Agency</span>
                <p className="font-medium text-slate-700 leading-relaxed line-clamp-3">
                  {profileData.about || 'Not Provided'}
                </p>
              </div>

              {/* Services Offered Chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-slate-400 font-semibold block">Services Offered</span>
                <div className="flex flex-wrap gap-1.5">
                  {profileData.selectedServices?.length > 0 ? (
                    profileData.selectedServices.map((srv: string) => (
                      <span
                        key={srv}
                        className="px-2.5 py-1 rounded-xl bg-purple-50 text-[#583BE8] font-bold text-[11px] capitalize"
                      >
                        ✦ {srv}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">None selected</span>
                  )}
                </div>
              </div>

              {/* Destinations Covered Chips */}
              <div className="space-y-1.5">
                <span className="text-slate-400 font-semibold block">Destinations Covered</span>
                <div className="flex flex-wrap gap-1.5">
                  {profileData.destinations?.length > 0 ? (
                    profileData.destinations.map((dest: string) => (
                      <span
                        key={dest}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-[11px]"
                      >
                        {dest}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">None selected</span>
                  )}
                </div>
              </div>

              {/* Languages Spoken */}
              <div className="space-y-1.5">
                <span className="text-slate-400 font-semibold block">Languages Spoken</span>
                <div className="flex flex-wrap gap-1.5">
                  {profileData.languages?.length > 0 ? (
                    profileData.languages.map((lang: string) => (
                      <span
                        key={lang}
                        className="px-2.5 py-1 rounded-xl bg-[#583BE8] text-white font-bold text-[11px]"
                      >
                        {lang}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">None selected</span>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#583BE8]" />
                  <span className="font-bold text-slate-700">{profileData.phone || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#583BE8]" />
                  <span className="font-bold text-slate-700 truncate">{profileData.email || 'N/A'}</span>
                </div>

                {profileData.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-[#583BE8]" />
                    <span className="font-bold text-slate-700 truncate">{profileData.website}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── SECTION 3: Verification Documents Summary ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A]">Verification Documents</h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/agency/onboarding/verification')}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Registration Cert */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-purple-50/50 border border-purple-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-extrabold text-[#0F172A]">Business Registration Certificate</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                  UPLOADED
                </span>
              </div>

              {/* PAN Card */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-purple-50/50 border border-purple-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-extrabold text-[#0F172A]">PAN Card</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                  UPLOADED
                </span>
              </div>

              {/* Government ID */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-purple-50/50 border border-purple-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-extrabold text-[#0F172A]">
                    Government ID ({verificationData.governmentIdType || 'Aadhaar/Passport'})
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                  UPLOADED
                </span>
              </div>

              {/* Selfie Verification */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-purple-50/50 border border-purple-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-extrabold text-[#0F172A]">Selfie Verification</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                  UPLOADED
                </span>
              </div>

              {/* Business Address Proof */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-purple-50/50 border border-purple-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-extrabold text-[#0F172A]">Business Address Proof</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                  UPLOADED
                </span>
              </div>

              {/* GST Certificate (Optional) */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  {verificationData.gstCert ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-slate-300 inline-block shrink-0" />
                  )}
                  <span className="font-bold text-slate-700">GST Certificate (Optional)</span>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    verificationData.gstCert
                      ? 'text-emerald-700 bg-emerald-100'
                      : 'text-slate-400 bg-slate-200/60'
                  }`}
                >
                  {verificationData.gstCert ? 'UPLOADED' : 'Not Provided'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── SECTION 4: Payment Details Summary ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A]">Payment Details</h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/agency/onboarding/bank')}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 font-semibold block">Bank Name</span>
                <p className="font-extrabold text-[#0F172A]">{bankData.bankName || 'State Bank of India'}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-semibold block">Account Holder Name</span>
                <p className="font-extrabold text-[#0F172A]">
                  {bankData.accountHolderName || 'Not Provided'}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-semibold block">Masked Account Number</span>
                <p className="font-bold text-[#583BE8] tracking-wider">
                  {maskAccountNumber(bankData.accountNumber)}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-semibold block">IFSC Code</span>
                <p className="font-extrabold text-[#0F172A] uppercase">
                  {bankData.ifscCode || 'SBIN0001234'}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-semibold block">Primary Payout Method</span>
                <p className="font-bold text-slate-700 capitalize">
                  {bankData.payoutMethod === 'upi' ? 'UPI Transfer' : 'Direct Bank Transfer'}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-semibold block">UPI ID</span>
                <p className="font-bold text-slate-700">{bankData.upiId || 'Not Provided'}</p>
              </div>
            </div>
          </motion.div>

          {/* ── DECLARATION CARD ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4"
          >
            <h3 className="text-sm font-extrabold text-[#0F172A]">Partner Declaration</h3>

            <div className="space-y-3 text-xs font-medium text-slate-700">
              {/* Checkbox 1 */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={confirmAccuracy}
                  onChange={(e) => setConfirmAccuracy(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#583BE8] focus:ring-[#583BE8] border-slate-300 cursor-pointer"
                />
                <span className="leading-relaxed">
                  I confirm that all the information provided is accurate, up-to-date, and belongs to my registered business.
                </span>
              </label>

              {/* Checkbox 2 */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#583BE8] focus:ring-[#583BE8] border-slate-300 cursor-pointer"
                />
                <span className="leading-relaxed">
                  I agree to ApnaTrip's{' '}
                  <a href="#terms" onClick={(e) => e.preventDefault()} className="text-[#583BE8] font-bold hover:underline">
                    Partner Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-[#583BE8] font-bold hover:underline">
                    Privacy Policy
                  </a>.
                </span>
              </label>
            </div>
          </motion.div>

          {/* ── APPLICATION REVIEW NOTICE CARD ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
            className="p-4 rounded-3xl bg-purple-50/70 border border-purple-100 flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#583BE8] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#583BE8]/20">
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">
                Application Review
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">
                Our verification team usually reviews agency applications within 24–48 hours. You'll receive updates through email and in-app notifications.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ── Fixed Sticky Bottom Action Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 shadow-lg">
        <div className="w-full max-w-2xl mx-auto flex items-center justify-between gap-4">
          {/* Back Button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => navigate('/agency/onboarding/bank')}
            className="w-1/2 py-3.5 px-6 rounded-2xl bg-white border border-[#583BE8]/30 hover:border-[#583BE8] active:scale-[0.99] text-[#583BE8] font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back</span>
          </button>

          {/* Submit Button */}
          <button
            type="button"
            disabled={!isDeclarationsValid || isSubmitting}
            onClick={handleSubmitApplication}
            className={`w-1/2 py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg ${
              isDeclarationsValid && !isSubmitting
                ? 'bg-[#583BE8] hover:bg-[#492de0] active:scale-[0.99] text-white shadow-[#583BE8]/25 cursor-pointer'
                : 'bg-slate-300 text-slate-500 shadow-none cursor-not-allowed opacity-70'
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit Application</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgencyReviewOnboardingPage;
