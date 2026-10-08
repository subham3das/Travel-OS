import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  Lock,
  Sparkles,
  HelpCircle,
  ExternalLink,
  RefreshCw,
  ArrowRight,
  Save,
  Check,
  AlertTriangle,
  X,
} from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { agencyFinanceService } from '../../services/agencyFinance.service';

const BUSINESS_TYPES = [
  { value: 'proprietorship', label: 'Sole Proprietorship' },
  { value: 'individual', label: 'Individual / Freelancer' },
  { value: 'partnership', label: 'Partnership Firm' },
  { value: 'private_limited', label: 'Private Limited Company (Pvt Ltd)' },
  { value: 'public_limited', label: 'Public Limited Company' },
  { value: 'llp', label: 'Limited Liability Partnership (LLP)' },
  { value: 'trust', label: 'Trust / NGO' },
  { value: 'society', label: 'Registered Society' },
];

const WIZARD_STEPS = [
  { step: 1, title: 'Business Profile', subtitle: 'Legal & Tax Info' },
  { step: 2, title: 'Bank Account', subtitle: 'IFSC & Account' },
  { step: 3, title: 'Security & Consent', subtitle: 'AES-256 & Route' },
  { step: 4, title: 'Verification', subtitle: 'Gateway Sync' },
  { step: 5, title: 'Ready to Sell', subtitle: 'Live Payouts' },
];

export const AgencyPaymentSetupPage: React.FC = () => {
  const navigate = useNavigate();

  // Wizard Navigation
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('proprietorship');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [gstin, setGstin] = useState('');

  // Bank State
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');

  // Profile Telemetry & Status
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [ifscLoading, setIfscLoading] = useState(false);
  const [ifscBranch, setIfscBranch] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Payout Account Replacement Modal
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [replaceSubmitting, setReplaceSubmitting] = useState(false);
  const [replaceIfsc, setReplaceIfsc] = useState('');
  const [replaceBankName, setReplaceBankName] = useState('');
  const [replaceAccount, setReplaceAccount] = useState('');
  const [replaceConfirmAccount, setReplaceConfirmAccount] = useState('');
  const [replaceBeneficiary, setReplaceBeneficiary] = useState('');
  const [replaceReason, setReplaceReason] = useState('');
  const [replaceError, setReplaceError] = useState('');

  // Fetch Existing Profile
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await agencyFinanceService.getPaymentProfile('Agency');
      if (data && data.exists) {
        setProfile(data);
        setBusinessName(data.businessName || '');
        setBusinessType(data.businessType || 'proprietorship');
        setBusinessEmail(data.businessEmail || '');
        setBusinessPhone(data.businessPhone || '');
        setPanNumber(data.panNumber || '');
        setGstin(data.gstin || '');
        setIfscCode(data.ifscCode || '');
        setBankName(data.bankName || '');
        setBeneficiaryName(data.beneficiaryName || '');
        if (data.currentStep && data.currentStep >= 1) {
          setCurrentStep(data.status === 'APPROVED' ? 5 : Math.min(4, data.currentStep));
        }
      }
    } catch (err: any) {
      console.warn('Failed to load payment profile:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto Lookup Bank details from IFSC
  const handleIfscChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.toUpperCase().trim();
    setIfscCode(code);
    if (/^[A-Z]{4}0[A-Z0-9]{6}$/.test(code)) {
      try {
        setIfscLoading(true);
        const res = await agencyFinanceService.lookupIFSC(code);
        if (res && res.bankName) {
          setBankName(res.bankName);
          setIfscBranch(res.branch || `${res.bankName} Branch`);
        }
      } catch (err) {
        // Fallback gracefully
      } finally {
        setIfscLoading(false);
      }
    } else {
      setIfscBranch('');
    }
  };

  // Auto Lookup for replacement modal
  const handleReplaceIfscChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.toUpperCase().trim();
    setReplaceIfsc(code);
    if (/^[A-Z]{4}0[A-Z0-9]{6}$/.test(code)) {
      try {
        const res = await agencyFinanceService.lookupIFSC(code);
        if (res && res.bankName) {
          setReplaceBankName(res.bankName);
        }
      } catch (err) {
        // Fallback
      }
    }
  };

  // Save Draft Step
  const handleSaveDraft = async () => {
    try {
      setSavingDraft(true);
      setErrorMessage('');
      await agencyFinanceService.saveDraftStep(currentStep, {
        sellerType: 'Agency',
        businessName,
        businessType,
        businessEmail,
        businessPhone,
        panNumber,
        gstin,
        ifscCode,
        bankName,
        accountNumber,
        beneficiaryName,
      });
      setSuccessMessage('Draft saved successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save draft progress.');
    } finally {
      setSavingDraft(false);
    }
  };

  // Retry Provisioning
  const handleRetryProvisioning = async () => {
    try {
      setRetrying(true);
      setErrorMessage('');
      const res = await agencyFinanceService.retryProvisioning();
      if (res?.success) {
        setSuccessMessage('Route entities successfully provisioned and verified!');
        await loadProfile();
      } else {
        setErrorMessage(res?.message || 'Retry failed. Check gateway credentials or details.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Retry request encountered an error.');
    } finally {
      setRetrying(false);
    }
  };

  // Submit Profile Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!businessName.trim()) {
      setErrorMessage('Legal Business Name is required.');
      setCurrentStep(1);
      return;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.trim())) {
      setErrorMessage('Please enter a valid 11-character Indian IFSC code (e.g. HDFC0001234).');
      setCurrentStep(2);
      return;
    }
    if (!accountNumber || accountNumber.length < 9) {
      setErrorMessage('Please enter a valid Bank Account Number (minimum 9 digits).');
      setCurrentStep(2);
      return;
    }
    if (accountNumber !== confirmAccountNumber) {
      setErrorMessage('Bank account numbers do not match. Please re-enter carefully.');
      setCurrentStep(2);
      return;
    }
    if (!beneficiaryName.trim()) {
      setErrorMessage('Beneficiary Account Holder Name is required.');
      setCurrentStep(2);
      return;
    }

    try {
      setSubmitting(true);
      const res = await agencyFinanceService.submitPaymentProfile({
        sellerType: 'Agency',
        businessName: businessName.trim(),
        businessType,
        businessEmail,
        businessPhone,
        panNumber: panNumber.toUpperCase().trim(),
        gstin: gstin.toUpperCase().trim(),
        ifscCode: ifscCode.toUpperCase().trim(),
        bankName: bankName || 'Commercial Bank',
        accountNumber: accountNumber.trim(),
        confirmAccountNumber: confirmAccountNumber.trim(),
        beneficiaryName: beneficiaryName.trim(),
      });

      if (res?.success) {
        setSuccessMessage('Payout account details saved and verified successfully!');
        setProfile(res.profile || res);
        setCurrentStep(5);
        setAccountNumber('');
        setConfirmAccountNumber('');
      } else {
        setErrorMessage(res?.message || 'Verification could not be completed.');
        setCurrentStep(4);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit payout account details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Payout Account Replacement
  const handleReplaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReplaceError('');

    if (!replaceIfsc || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(replaceIfsc.trim())) {
      setReplaceError('Please enter a valid 11-character IFSC code.');
      return;
    }
    if (!replaceAccount || replaceAccount.length < 9) {
      setReplaceError('Account number must be at least 9 digits.');
      return;
    }
    if (replaceAccount !== replaceConfirmAccount) {
      setReplaceError('Account numbers do not match.');
      return;
    }
    if (!replaceBeneficiary.trim()) {
      setReplaceError('Beneficiary name is required.');
      return;
    }
    if (!replaceReason.trim()) {
      setReplaceError('Reason for replacing payout account is required.');
      return;
    }

    try {
      setReplaceSubmitting(true);
      const res = await agencyFinanceService.requestAccountReplacement({
        sellerType: 'Agency',
        newIfscCode: replaceIfsc.toUpperCase().trim(),
        newBankName: replaceBankName || 'Commercial Bank',
        newAccountNumber: replaceAccount.trim(),
        confirmAccountNumber: replaceConfirmAccount.trim(),
        newBeneficiaryName: replaceBeneficiary.trim(),
        reason: replaceReason.trim(),
      });

      setShowReplaceModal(false);
      setSuccessMessage('Replacement request submitted. Admin has been notified for confirmation.');
      setProfile(res.profile || res);
      setReplaceAccount('');
      setReplaceConfirmAccount('');
      setReplaceReason('');
    } catch (err: any) {
      setReplaceError(err.message || 'Failed to submit replacement request.');
    } finally {
      setReplaceSubmitting(false);
    }
  };

  const isBankLocked = Boolean(profile?.isBankLocked);

  // Render Status Badge Card
  const renderStatusCard = () => {
    const status = profile?.status || 'NOT_STARTED';

    if (status === 'APPROVED') {
      return (
        <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-3xl p-5 sm:p-6 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-700">Account Status</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-200/60 text-emerald-800">
                  Approved & Active
                </span>
              </div>
              <h3 className="text-base font-black text-emerald-900 mt-0.5">Payouts & Razorpay Route Enabled</h3>
              <p className="text-xs font-semibold text-emerald-700/90">
                Linked Account: <span className="font-mono font-bold">{profile?.accountNumberMasked || 'Active'}</span> • Auto settlements active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isBankLocked && (
              <button
                type="button"
                onClick={() => setShowReplaceModal(true)}
                className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-emerald-800 hover:bg-emerald-100/50 transition-colors cursor-pointer"
              >
                Replace Payout Account
              </button>
            )}
            <div className="px-3.5 py-1.5 rounded-xl bg-white/80 border border-emerald-200 text-xs font-bold text-emerald-800 text-center">
              Ready to Sell
            </div>
          </div>
        </div>
      );
    }

    if (status === 'FAILED' || status === 'REJECTED') {
      return (
        <div className="bg-rose-50/90 border border-rose-200 rounded-3xl p-5 sm:p-6 text-rose-950 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-rose-700">Action Required</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-200/70 text-rose-800">
                    Setup Incomplete
                  </span>
                </div>
                <h3 className="text-base font-black text-rose-900 mt-0.5">Onboarding Step Encountered an Issue</h3>
                <p className="text-xs font-semibold text-rose-700/90">
                  Failed Step: <strong className="font-bold">{profile?.onboardingProgress?.failedStep || 'Razorpay Entity Provisioning'}</strong>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRetryProvisioning}
              disabled={retrying}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
              <span>{retrying ? 'Retrying...' : 'Retry Provisioning'}</span>
            </button>
          </div>
          {profile?.onboardingFailureReason && (
            <div className="p-3 bg-white/80 rounded-xl border border-rose-200 text-xs text-rose-800 font-medium">
              <strong>Error Message:</strong> {profile.onboardingFailureReason}
              {profile?.onboardingProgress?.recommendedAction && (
                <div className="mt-1 text-slate-600 font-normal">
                  <strong>Recommended Action:</strong> {profile.onboardingProgress.recommendedAction}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    if (status === 'SUBMITTED' || status === 'UNDER_REVIEW') {
      return (
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-3xl p-5 sm:p-6 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-amber-700">Under Review</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-200/60 text-amber-800">
                  Verification in Progress
                </span>
              </div>
              <h3 className="text-base font-black text-amber-900 mt-0.5">Gateway Synchronization</h3>
              <p className="text-xs font-semibold text-amber-700/90">
                Bank details submitted. Razorpay Route webhook will activate selling immediately upon confirmation.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRetryProvisioning}
            disabled={retrying}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-300 text-xs font-bold text-amber-800 hover:bg-amber-100/50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
            <span>Check Status</span>
          </button>
        </div>
      );
    }

    return (
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-3xl p-5 sm:p-6 text-[#0F172A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100/80 flex items-center justify-center text-[#583BE8] shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#583BE8]">Setup Required</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-200/50 text-[#583BE8]">
                Not Completed
              </span>
            </div>
            <h3 className="text-base font-black text-[#0F172A] mt-0.5">Payout Account Setup Required</h3>
            <p className="text-xs font-semibold text-slate-500">
              Complete bank and business details below to enable publishing packages and receive marketplace settlements.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-24 md:pb-16">
        <DashboardHeader />

        {/* Sticky Header Bar */}
        <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-[57px] sm:top-[65px] z-20 select-none">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#0F172A]">Payment Setup & Onboarding</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-[#583BE8] border border-indigo-100">
                  Razorpay Route
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400">Configure marketplace payout bank account & linked vendor profile</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={savingDraft || profile?.status === 'APPROVED'}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingDraft ? 'Saving...' : 'Save Draft'}</span>
            </button>
          </div>
        </div>

        {/* Main Content Body */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 max-w-4xl mx-auto w-full space-y-6">
          {/* Status Badge Card */}
          {renderStatusCard()}

          {/* Pending Replacement Request Alert */}
          {profile?.payoutChangeRequest?.status === 'PENDING' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <strong>Payout Account Replacement Under Review:</strong> Switch to{' '}
                  <span className="font-mono font-bold">{profile.payoutChangeRequest.newAccountNumberMasked}</span> (
                  {profile.payoutChangeRequest.newBankName}) is pending Super Admin approval.
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 text-[10px] font-black shrink-0">
                In Review
              </span>
            </div>
          )}

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ─── 5-STEP WIZARD PROGRESS BAR ─── */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-2xs">
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {WIZARD_STEPS.map((ws) => {
                const isActive = currentStep === ws.step;
                const isCompleted = currentStep > ws.step || profile?.status === 'APPROVED';

                return (
                  <button
                    key={ws.step}
                    type="button"
                    onClick={() => {
                      if (profile?.status !== 'APPROVED') {
                        setCurrentStep(ws.step);
                      }
                    }}
                    className={`text-left p-2 sm:p-3 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? 'border-[#583BE8] bg-indigo-50/50 shadow-xs'
                        : isCompleted
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : 'border-slate-100 bg-slate-50/50 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <div
                        className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                          isActive
                            ? 'bg-[#583BE8] text-white'
                            : isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3 h-3" /> : ws.step}
                      </div>
                      <span className="hidden sm:inline text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Step {ws.step}
                      </span>
                    </div>
                    <div className="text-xs font-black text-slate-800 truncate">{ws.title}</div>
                    <div className="hidden sm:block text-[10px] font-semibold text-slate-400 truncate">
                      {ws.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: Business Details Section */}
            {(currentStep === 1 || profile?.status === 'APPROVED') && (
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100/90 shadow-2xs space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#0F172A]">1. Business Profile Details</h3>
                    <p className="text-[11px] font-semibold text-slate-400">
                      Legal business identity registered with government authorities
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                  <div className="sm:col-span-2">
                    <label className="text-slate-700 block mb-1">Legal Business Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mountain Trails Travel Pvt Ltd"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 font-extrabold focus:outline-none focus:border-[#583BE8] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1">Business Constitution Type *</label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 font-extrabold focus:outline-none focus:border-[#583BE8] transition-colors"
                    >
                      {BUSINESS_TYPES.map((bt) => (
                        <option key={bt.value} value={bt.value}>
                          {bt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1">Business PAN Card Number</label>
                    <input
                      type="text"
                      placeholder="e.g. ABCDE1234F"
                      maxLength={10}
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 font-extrabold uppercase focus:outline-none focus:border-[#583BE8] transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1">Official Contact Email</label>
                    <input
                      type="email"
                      placeholder="accounts@travelagency.com"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 font-extrabold focus:outline-none focus:border-[#583BE8] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1">GSTIN (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 27ABCDE1234F1Z5"
                      maxLength={15}
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 font-extrabold uppercase focus:outline-none focus:border-[#583BE8] transition-colors font-mono"
                    />
                  </div>
                </div>

                {currentStep === 1 && profile?.status !== 'APPROVED' && (
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#472ec4] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Next: Bank Account</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Bank Details Section */}
            {(currentStep === 2 || profile?.status === 'APPROVED') && (
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100/90 shadow-2xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#583BE8] flex items-center justify-center font-bold">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#0F172A]">2. Bank & Settlement Account</h3>
                      <p className="text-[11px] font-semibold text-slate-400">
                        Direct marketplace payouts from traveler bookings are credited here
                      </p>
                    </div>
                  </div>

                  {isBankLocked && (
                    <span className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Account Locked</span>
                    </span>
                  )}
                </div>

                {profile?.accountNumberMasked && profile.accountNumberMasked !== 'SKIPPED' && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="text-slate-500 font-semibold">Active Registered Account: </span>
                        <strong className="text-slate-800 font-mono font-bold">{profile.accountNumberMasked}</strong>
                      </div>
                    </div>
                    {isBankLocked ? (
                      <button
                        type="button"
                        onClick={() => setShowReplaceModal(true)}
                        className="text-xs font-bold text-[#583BE8] hover:underline cursor-pointer"
                      >
                        Request Replacement
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-[#583BE8]">Encrypted at rest (AES-256)</span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                  <div>
                    <label className="text-slate-700 block mb-1">Branch IFSC Code *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        disabled={isBankLocked}
                        placeholder="e.g. HDFC0001234"
                        maxLength={11}
                        value={ifscCode}
                        onChange={handleIfscChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 font-extrabold uppercase focus:outline-none focus:border-[#583BE8] transition-colors font-mono tracking-wider disabled:opacity-60"
                      />
                      {ifscLoading && (
                        <div className="absolute right-3 top-3 w-4 h-4 border-2 border-[#583BE8] border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                    {ifscBranch && (
                      <p className="text-[11px] text-emerald-600 font-bold mt-1">✓ {ifscBranch}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1">Bank Name</label>
                    <input
                      type="text"
                      disabled={isBankLocked}
                      placeholder="e.g. HDFC Bank"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 font-extrabold focus:outline-none focus:border-[#583BE8] transition-colors disabled:opacity-60"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-700 block mb-1">Beneficiary Account Holder Name *</label>
                    <input
                      type="text"
                      required
                      disabled={isBankLocked}
                      placeholder="Name as printed in Bank Passbook / Cheque"
                      value={beneficiaryName}
                      onChange={(e) => setBeneficiaryName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 font-extrabold focus:outline-none focus:border-[#583BE8] transition-colors disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1">Bank Account Number *</label>
                    <input
                      type="password"
                      required
                      disabled={isBankLocked}
                      placeholder={isBankLocked ? '•••• •••• ••••' : 'Enter Account Number'}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 font-extrabold focus:outline-none focus:border-[#583BE8] transition-colors font-mono tracking-widest disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1">Confirm Bank Account Number *</label>
                    <input
                      type="text"
                      required
                      disabled={isBankLocked}
                      placeholder={isBankLocked ? '•••• •••• ••••' : 'Re-enter Account Number'}
                      value={confirmAccountNumber}
                      onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 font-extrabold focus:outline-none focus:border-[#583BE8] transition-colors font-mono tracking-widest disabled:opacity-60"
                    />
                  </div>
                </div>

                {currentStep === 2 && profile?.status !== 'APPROVED' && (
                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-5 py-2 rounded-2xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#472ec4] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Next: Security & Verification</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3 & 4: Security, Verification & Status Breakdown */}
            {(currentStep >= 3 || profile?.status === 'APPROVED') && (
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100/90 shadow-2xs space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#0F172A]">3. Security, Routing & Compliance</h3>
                    <p className="text-[11px] font-semibold text-slate-400">
                      Live status across Razorpay Route entity provisioning
                    </p>
                  </div>
                </div>

                {/* Granular Provisioning Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-slate-800">1. Vendor Contact</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {profile?.razorpayContactId ? profile.razorpayContactId : 'Provisioned on submit'}
                      </div>
                    </div>
                    {profile?.razorpayContactId ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-slate-800">2. Fund Account</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {profile?.razorpayFundAccountId ? profile.razorpayFundAccountId : 'Provisioned on submit'}
                      </div>
                    </div>
                    {profile?.razorpayFundAccountId ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-slate-800">3. Bank Verification</div>
                      <div className="text-[11px] text-slate-500 font-semibold capitalize">
                        {profile?.bankVerificationStatus || 'Pending submission'}
                      </div>
                    </div>
                    {profile?.bankVerificationStatus === 'VERIFIED' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : profile?.bankVerificationStatus === 'FAILED' ? (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-slate-800">4. Razorpay Route Account</div>
                      <div className="text-[11px] text-slate-500 font-semibold capitalize">
                        {profile?.status === 'APPROVED' ? 'Active & Settling' : profile?.status || 'Pending'}
                      </div>
                    </div>
                    {profile?.status === 'APPROVED' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Security Assurance */}
                <div className="rounded-2xl p-4 bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">Enterprise Security & Encryption Guarantee</p>
                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                      Your bank account details are protected using military-grade AES-256-GCM encryption at rest. Full bank account numbers are never displayed on frontend dashboards or exposed via public APIs.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions Bar */}
            {profile?.status !== 'APPROVED' && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/agency/finance')}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-extrabold text-xs transition-colors cursor-pointer"
                >
                  View Settlement Dashboard
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={submitting || isBankLocked}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#583BE8] hover:bg-[#472ec4] text-white font-black text-xs shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying with Razorpay Route...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Submit & Verify Payout Account</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </main>
      </div>

      {/* ─── PAYOUT ACCOUNT REPLACEMENT MODAL ─── */}
      <AnimatePresence>
        {showReplaceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-100 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#583BE8] flex items-center justify-center font-bold">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Replace Payout Bank Account</h3>
                    <p className="text-[11px] font-semibold text-slate-400">Admin-controlled replacement workflow</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReplaceModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {replaceError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{replaceError}</span>
                </div>
              )}

              <form onSubmit={handleReplaceSubmit} className="space-y-3.5 text-xs font-bold">
                <div>
                  <label className="text-slate-700 block mb-1">New Branch IFSC Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    placeholder="e.g. ICIC0000001"
                    value={replaceIfsc}
                    onChange={handleReplaceIfscChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 uppercase font-mono tracking-wider"
                  />
                  {replaceBankName && <p className="text-[11px] text-emerald-600 mt-1">✓ {replaceBankName}</p>}
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">New Beneficiary Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Account holder name"
                    value={replaceBeneficiary}
                    onChange={(e) => setReplaceBeneficiary(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-700 block mb-1">New Account Number *</label>
                    <input
                      type="password"
                      required
                      placeholder="Account number"
                      value={replaceAccount}
                      onChange={(e) => setReplaceAccount(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 block mb-1">Confirm Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="Re-enter number"
                      value={replaceConfirmAccount}
                      onChange={(e) => setReplaceConfirmAccount(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Reason for Account Replacement *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. Switched primary corporate bank account from HDFC to ICICI"
                    value={replaceReason}
                    onChange={(e) => setReplaceReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 resize-none font-medium"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReplaceModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={replaceSubmitting}
                    className="px-5 py-2 rounded-xl bg-[#583BE8] hover:bg-[#472ec4] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {replaceSubmitting ? 'Submitting...' : 'Submit Replacement Request'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgencyPaymentSetupPage;
