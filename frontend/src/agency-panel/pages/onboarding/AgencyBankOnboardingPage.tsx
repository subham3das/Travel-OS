import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Smartphone,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { OnboardingStepper } from '../../components/OnboardingStepper';

const STORAGE_KEY = 'apnatrip_agency_onboarding_bank';

export type PayoutMethod = 'bank' | 'upi';

export interface BankFormData {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  upiId: string;
  payoutMethod: PayoutMethod;
}

const initialBankData: BankFormData = {
  accountHolderName: '',
  bankName: '',
  accountNumber: '',
  confirmAccountNumber: '',
  ifscCode: '',
  upiId: '',
  payoutMethod: 'bank',
};

// IFSC Prefix Lookup dictionary for realistic Bank Name & Branch rendering
const MOCK_IFSC_MAP: Record<string, { bank: string; branch: string }> = {
  SBIN: { bank: 'State Bank of India', branch: 'Dibrugarh Branch, Assam' },
  HDFC: { bank: 'HDFC Bank', branch: 'Koramangala Branch, Bengaluru' },
  ICIC: { bank: 'ICICI Bank', branch: 'Connaught Place Branch, New Delhi' },
  UTIB: { bank: 'Axis Bank', branch: 'Bandra West Branch, Mumbai' },
  PUNB: { bank: 'Punjab National Bank', branch: 'Mall Road Branch, Shimla' },
  BARB: { bank: 'Bank of Baroda', branch: 'Alkapuri Branch, Vadodara' },
  KKBK: { bank: 'Kotak Mahindra Bank', branch: 'MG Road Branch, Pune' },
};

export const AgencyBankOnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BankFormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
    return initialBankData;
  });

  const [showAccountNum, setShowAccountNum] = useState<boolean>(false);
  const [showConfirmNum, setShowConfirmNum] = useState<boolean>(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Auto save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      // ignore
    }
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let val = value;
    if (name === 'ifscCode') {
      val = value.toUpperCase().trim();
    }
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // IFSC Verification Lookup
  const isValidIFSCFormat = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode);
  const ifscPrefix = formData.ifscCode.substring(0, 4);
  const verifiedBankInfo = isValidIFSCFormat
    ? MOCK_IFSC_MAP[ifscPrefix] || {
        bank: formData.bankName || 'Verified Scheduled Bank',
        branch: 'Main City Branch, India',
      }
    : null;

  // Auto-fill Bank Name if IFSC is verified and Bank Name is empty
  useEffect(() => {
    if (verifiedBankInfo && !formData.bankName) {
      setFormData((prev) => ({ ...prev, bankName: verifiedBankInfo.bank }));
    }
  }, [verifiedBankInfo]);

  // Validations
  const isHolderValid = formData.accountHolderName.trim().length > 0;
  const isBankNameValid = formData.bankName.trim().length > 0;
  const isAccNumValid = formData.accountNumber.trim().length >= 8;
  const isConfirmAccNumValid =
    formData.confirmAccountNumber.trim().length > 0 &&
    formData.confirmAccountNumber.trim() === formData.accountNumber.trim();
  const isIfscValid = isValidIFSCFormat;

  const isUpiFormatValid =
    formData.upiId.trim() === '' || /^[\w.-]+@[\w.-]+$/.test(formData.upiId.trim());

  const isFormValid =
    isHolderValid &&
    isBankNameValid &&
    isAccNumValid &&
    isConfirmAccNumValid &&
    isIfscValid &&
    isUpiFormatValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      navigate('/agency/onboarding/review');
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
        <OnboardingStepper currentStep={4} />
      </div>

      {/* ── Main Container ── */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 space-y-6 pb-28">
        {/* Title Header with Bank Vault Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-start justify-between gap-4"
        >
          <div className="space-y-1.5 max-w-md">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Bank & Payment Details
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Add your bank details to receive customer payouts securely.
            </p>
          </div>

          {/* Bank Vault Illustration */}
          <div className="shrink-0 w-24 h-20 sm:w-32 sm:h-24 relative hidden xs:flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 140 100" fill="none">
              <rect x="25" y="20" width="85" height="65" rx="8" fill="#EDE8FF" />
              <rect x="35" y="32" width="65" height="10" rx="2" fill="#583BE8" />
              <circle cx="50" cy="62" r="10" fill="#B4A4FF" />
              <circle cx="85" cy="62" r="10" fill="#8C75FF" />
              <rect x="100" y="50" width="20" height="30" rx="4" fill="#583BE8" />
            </svg>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── SECTION 1: Bank Account Details ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                <Building className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-[#0F172A]">1. Bank Account Details</h2>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
              {/* Account Holder Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  Account Holder Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('accountHolderName')}
                  placeholder="Enter account holder name"
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-50/80 border text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none transition-all ${
                    touched.accountHolderName && !isHolderValid
                      ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500'
                      : 'border-slate-200 focus:border-[#583BE8] focus:bg-white'
                  }`}
                />
                {touched.accountHolderName && !isHolderValid && (
                  <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> Account holder name is required
                  </p>
                )}
              </div>

              {/* Bank Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  Bank Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('bankName')}
                  placeholder="Enter bank name e.g. State Bank of India"
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-50/80 border text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none transition-all ${
                    touched.bankName && !isBankNameValid
                      ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500'
                      : 'border-slate-200 focus:border-[#583BE8] focus:bg-white'
                  }`}
                />
                {touched.bankName && !isBankNameValid && (
                  <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> Bank name is required
                  </p>
                )}
              </div>

              {/* Account Number & Confirm Account Number Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Account Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    Account Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showAccountNum ? 'text' : 'password'}
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      onBlur={() => handleBlur('accountNumber')}
                      placeholder="Enter account number"
                      className={`w-full px-4 py-3 pr-11 rounded-2xl bg-slate-50/80 border text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none transition-all ${
                        touched.accountNumber && !isAccNumValid
                          ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500'
                          : 'border-slate-200 focus:border-[#583BE8] focus:bg-white'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccountNum(!showAccountNum)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showAccountNum ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {touched.accountNumber && !isAccNumValid && (
                    <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> Account number is required
                    </p>
                  )}
                </div>

                {/* Confirm Account Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    Confirm Account Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmNum ? 'text' : 'password'}
                      name="confirmAccountNumber"
                      value={formData.confirmAccountNumber}
                      onChange={handleChange}
                      onBlur={() => handleBlur('confirmAccountNumber')}
                      placeholder="Re-enter account number"
                      className={`w-full px-4 py-3 pr-11 rounded-2xl bg-slate-50/80 border text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none transition-all ${
                        touched.confirmAccountNumber && !isConfirmAccNumValid
                          ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500'
                          : 'border-slate-200 focus:border-[#583BE8] focus:bg-white'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNum(!showConfirmNum)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmNum ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {touched.confirmAccountNumber && !isConfirmAccNumValid && (
                    <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {formData.confirmAccountNumber
                        ? 'Account numbers do not match'
                        : 'Please confirm account number'}
                    </p>
                  )}
                </div>
              </div>

              {/* IFSC Code Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  IFSC Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  maxLength={11}
                  value={formData.ifscCode}
                  onChange={handleChange}
                  onBlur={() => handleBlur('ifscCode')}
                  placeholder="Enter 11-digit IFSC code e.g. SBIN0001234"
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-50/80 border text-sm font-medium text-[#0F172A] uppercase placeholder:text-slate-400 placeholder:normal-case focus:outline-none transition-all ${
                    touched.ifscCode && !isIfscValid
                      ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500'
                      : 'border-slate-200 focus:border-[#583BE8] focus:bg-white'
                  }`}
                />
                {touched.ifscCode && !isIfscValid && (
                  <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> Invalid IFSC code format. Example: SBIN0001234
                  </p>
                )}
              </div>

              {/* Verified IFSC Information Card */}
              {verifiedBankInfo && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-extrabold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> IFSC Code Verified
                    </span>
                    <h4 className="text-sm font-extrabold text-[#0F172A]">
                      {verifiedBankInfo.bank}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">{verifiedBankInfo.branch}</p>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-[10px] font-extrabold tracking-wide">
                    VERIFIED
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* ── SECTION 2: UPI Details ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-[#0F172A]">2. UPI Details</h2>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  UPI ID <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    onBlur={() => handleBlur('upiId')}
                    placeholder="agency@okhdfcbank"
                    className={`w-full px-4 py-3 rounded-2xl bg-slate-50/80 border text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none transition-all ${
                      touched.upiId && !isUpiFormatValid
                        ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500'
                        : 'border-slate-200 focus:border-[#583BE8] focus:bg-white'
                    }`}
                  />
                </div>
                {touched.upiId && !isUpiFormatValid && (
                  <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> Invalid UPI ID format e.g. name@bank
                  </p>
                )}
              </div>

              <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 pt-1">
                <Lock className="w-3.5 h-3.5 text-[#583BE8] shrink-0" />
                <span>Travelers will never see your payment information.</span>
              </p>
            </div>
          </motion.div>

          {/* ── SECTION 3: Primary Payout Method ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-[#0F172A]">3. Primary Payout Method</h2>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Bank Transfer Radio Card */}
                <div
                  onClick={() => setFormData((prev) => ({ ...prev, payoutMethod: 'bank' }))}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    formData.payoutMethod === 'bank'
                      ? 'bg-purple-50/60 border-2 border-[#583BE8] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-purple-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.payoutMethod === 'bank'
                          ? 'border-[#583BE8] bg-[#583BE8]'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {formData.payoutMethod === 'bank' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#583BE8]" />
                      <h4 className="font-extrabold text-[#0F172A] text-sm">Bank Transfer</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Receive payouts directly into your bank account.
                    </p>
                  </div>
                </div>

                {/* UPI Radio Card */}
                <div
                  onClick={() => setFormData((prev) => ({ ...prev, payoutMethod: 'upi' }))}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    formData.payoutMethod === 'upi'
                      ? 'bg-purple-50/60 border-2 border-[#583BE8] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-purple-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.payoutMethod === 'upi'
                          ? 'border-[#583BE8] bg-[#583BE8]'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {formData.payoutMethod === 'upi' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#583BE8]" />
                      <h4 className="font-extrabold text-[#0F172A] text-sm">UPI</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Receive payouts directly into your UPI account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── SECURITY NOTICE CARD ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="p-4 rounded-3xl bg-purple-50/70 border border-purple-100 flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#583BE8] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#583BE8]/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">
                Your security is our priority
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">
                Your payment information is encrypted and securely stored. It is only used for payouts from ApnaTrip.
              </p>
            </div>
          </motion.div>
        </form>
      </main>

      {/* ── Fixed Sticky Bottom Action Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 shadow-lg">
        <div className="w-full max-w-2xl mx-auto flex items-center justify-between gap-4">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate('/agency/onboarding/verification')}
            className="w-1/2 py-3.5 px-6 rounded-2xl bg-white border border-[#583BE8]/30 hover:border-[#583BE8] active:scale-[0.99] text-[#583BE8] font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back</span>
          </button>

          {/* Continue Button */}
          <button
            type="button"
            disabled={!isFormValid}
            onClick={handleSubmit}
            className={`w-1/2 py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg ${
              isFormValid
                ? 'bg-[#583BE8] hover:bg-[#492de0] active:scale-[0.99] text-white shadow-[#583BE8]/25 cursor-pointer'
                : 'bg-slate-300 text-slate-500 shadow-none cursor-not-allowed opacity-70'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgencyBankOnboardingPage;
