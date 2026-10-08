import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Building2,
  Phone,
  Mail,
  Lock,
  MapPin,
  FileText,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { agencyCarRentalService } from '../../services/agencyCarRental.service';
import { registrationDraftClient } from '../../services/registrationDraftClient.service';
import { useAgencyAuth } from '../../hooks/useAgencyAuth';
import { useActiveBusiness } from '../../context/ActiveBusinessContext';
import { useAgencyAuthContext, agencyAuthService } from '../../services/agencyAuth.service';
import { useToast } from '../../../user-panel/context/ToastContext';

export const CarRentalOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { agencyUser, setActiveAgency } = useAgencyAuthContext();
  const { loginAgency } = useAgencyAuth();
  const { refreshBusinessProfile } = useActiveBusiness();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    businessName: '',
    legalBusinessName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '',
    operatingCities: 'Mumbai, Pune, Goa',
    fleetSize: 5,
    workingHours: '24/7 Service',
    emergencyContact: '',
    description: 'Specialized commercial fleet provider providing verified chauffeur and self-drive vehicles.',
    // Compliance / Docs
    businessLicenseNumber: '',
    panNumber: '',
    gstNumber: '',
    // Bank
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    if (!formData.businessName.trim()) {
      showToast('Please enter your fleet business name', 'error');
      return false;
    }
    if (!formData.address.trim()) {
      showToast('Please enter your business operating address', 'error');
      return false;
    }
    if (!formData.city.trim()) {
      showToast('Please enter your operating city', 'error');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.panNumber.trim() && !formData.gstNumber.trim() && !formData.businessLicenseNumber.trim()) {
      showToast('Please provide at least one business registration or PAN number', 'error');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.accountNumber.trim()) {
      showToast('Bank account number is required for payouts', 'error');
      return false;
    }
    if (!formData.ifscCode.trim()) {
      showToast('Bank IFSC code is required', 'error');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const parsedCities = formData.operatingCities
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      const businessRes = await agencyAuthService.createBusiness({
        businessType: 'car_rental',
        name: formData.businessName.trim(),
        legalBusinessName: (formData.legalBusinessName || formData.businessName).trim(),
        businessAddress: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pinCode: formData.pinCode.trim() || '400001',
        gstNumber: formData.gstNumber.trim(),
        panNumber: formData.panNumber.trim(),
        fleetSize: Number(formData.fleetSize) || 1,
      });

      if (businessRes.data?.business) {
        setActiveAgency(businessRes.data.business);
      }

      showToast('Fleet registered! Proceeding to Registration Payment.', 'success');
      navigate('/agency/onboarding/payment?type=car_rental');
    } catch (err: any) {
      console.error('Car Rental creation error:', err);
      showToast(err.message || 'Failed to create car rental business', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Fleet Basics' },
    { num: 2, title: 'Permits & Compliance' },
    { num: 3, title: 'Payout Details' },
    { num: 4, title: 'Review & Submit' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col justify-start py-8 px-4 sm:px-6 lg:px-8 font-sans select-none overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        {/* Back navigation & brand header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => (currentStep === 1 ? navigate('/agency/partner/select-business') : prevStep())}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#583BE8] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? 'Change Partner Type' : 'Back to Previous Step'}</span>
          </button>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/agency')}>
            <div className="w-8 h-8 rounded-full bg-[#583BE8] text-white flex items-center justify-center font-black text-xs shadow-md shadow-[#583BE8]/20">
              AT
            </div>
            <span className="font-extrabold text-[#0F172A] tracking-tight">ApnaTrip</span>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 w-full -z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#583BE8] transition-all duration-300 -z-0"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step) => {
              const isDone = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <div key={step.num} className="flex flex-col items-center gap-1.5 relative z-10">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs transition-all ${
                      isDone
                        ? 'bg-[#583BE8] text-white shadow-xs'
                        : isCurrent
                        ? 'bg-[#583BE8] text-white ring-4 ring-purple-100 shadow-md shadow-[#583BE8]/20'
                        : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                  </div>
                  <span
                    className={`text-[11px] font-bold hidden sm:block ${
                      isCurrent ? 'text-[#583BE8]' : isDone ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <form onSubmit={currentStep === 4 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
            {/* STEP 1: Fleet Basics */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-purple-100 text-[#583BE8] text-[10px] font-black uppercase">
                      Step 1 of 4
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">• Car Rental Division</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                    Fleet Brand & Owner Information
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Register your vehicle fleet service. You will receive reservations directly to your car rental portal.
                  </p>
                </div>

                {/* Authenticated Account Info Card */}
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">
                      Authenticated Partner Account
                    </span>
                    <div className="text-xs font-bold text-slate-900">
                      {agencyUser?.name || formData.ownerName || 'Partner'} • {agencyUser?.email || 'Authenticated Session'}
                    </div>
                  </div>
                  <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Fleet Brand / Business Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 focus-within:border-[#583BE8] focus-within:bg-white transition-all">
                      <Car className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        name="businessName"
                        required
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="e.g. Royal Heritage Car Rentals"
                        className="w-full text-xs font-semibold text-slate-800 py-3 bg-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Legal Business / Operating Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 focus-within:border-[#583BE8] focus-within:bg-white transition-all">
                      <MapPin className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Suite / Street, Hub Location"
                        className="w-full text-xs font-semibold text-slate-800 py-3 bg-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Operating City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai"
                      className="w-full text-xs font-semibold text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#583BE8] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Active Fleet Size (Approx.)</label>
                    <input
                      type="number"
                      name="fleetSize"
                      min={1}
                      value={formData.fleetSize}
                      onChange={handleChange}
                      className="w-full text-xs font-semibold text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#583BE8] focus:bg-white transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Operating Hubs / Cities</label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 focus-within:border-[#583BE8] focus-within:bg-white transition-all">
                      <MapPin className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        name="operatingCities"
                        value={formData.operatingCities}
                        onChange={handleChange}
                        placeholder="e.g. Mumbai, Pune, Goa, Ahmedabad"
                        className="w-full text-xs font-semibold text-slate-800 py-3 bg-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Compliance & Permits */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-purple-100 text-[#583BE8] text-[10px] font-black uppercase">
                      Step 2 of 4
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">• Verification & Trust</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                    Permits, Licenses & Tax Compliance
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified commercial credentials unlock instant booking acceptance and the Verified Partner badge.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Commercial Permit / License Number
                    </label>
                    <input
                      type="text"
                      name="businessLicenseNumber"
                      value={formData.businessLicenseNumber}
                      onChange={handleChange}
                      placeholder="e.g. MH-COMM-2024-91823"
                      className="w-full text-xs font-semibold text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#583BE8] focus:bg-white transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Business PAN Card Number
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      placeholder="e.g. ABCDE1234F"
                      className="w-full text-xs font-semibold text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#583BE8] focus:bg-white transition-all uppercase font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">GST Registration Number</label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="e.g. 27AAAAA0000A1Z5"
                      className="w-full text-xs font-semibold text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#583BE8] focus:bg-white transition-all uppercase font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      24/7 Roadside Assistance Helpline
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      placeholder="Emergency contact for travelers on the road"
                      className="w-full text-xs font-semibold text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#583BE8] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Bank & Settlement Details */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-purple-100 text-[#583BE8] text-[10px] font-black uppercase">
                      Step 3 of 4
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">• Banking & Payouts</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                    Settlement Bank Account
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    All advance token deposits (20% upfront) and booking payouts are deposited into this account.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Account Beneficiary Name</label>
                    <input
                      type="text"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleChange}
                      placeholder={formData.ownerName || 'Account Holder'}
                      className="w-full text-xs font-semibold text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#583BE8] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="e.g. HDFC Bank, SBI, ICICI"
                      className="w-full text-xs font-semibold text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#583BE8] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Bank Account Number</label>
                    <input
                      type="text"
                      name="accountNumber"
                      required
                      value={formData.accountNumber}
                      onChange={handleChange}
                      placeholder="Account number"
                      className="w-full text-xs font-semibold text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#583BE8] focus:bg-white transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">IFSC Code</label>
                    <input
                      type="text"
                      name="ifscCode"
                      required
                      value={formData.ifscCode}
                      onChange={handleChange}
                      placeholder="e.g. HDFC0001234"
                      className="w-full text-xs font-semibold text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#583BE8] focus:bg-white transition-all font-mono uppercase"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Business UPI ID (Optional)</label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      placeholder="e.g. fleet@okaxis"
                      className="w-full text-xs font-semibold text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#583BE8] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Review & Submit */}
            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase">
                      Ready to Submit
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">• Final Step</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                    Review Your Fleet Application
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Please verify your details. Once submitted, our team will review and approve your car rental operations.
                  </p>
                </div>

                <div className="space-y-3 bg-slate-50 p-5 rounded-3xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Business Name:</span>
                    <span className="font-bold text-slate-900">{formData.businessName}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Owner Name:</span>
                    <span className="font-bold text-slate-900">{formData.ownerName}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Contact:</span>
                    <span className="font-bold text-slate-900">{formData.phone} • {formData.email}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Operating Hubs:</span>
                    <span className="font-bold text-slate-900">{formData.operatingCities}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Fleet Size:</span>
                    <span className="font-bold text-[#583BE8]">{formData.fleetSize} Vehicles</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 font-medium">Payout Account:</span>
                    <span className="font-mono font-bold text-slate-900">{formData.accountNumber} ({formData.ifscCode})</span>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex items-start gap-3 text-xs text-purple-900">
                  <ShieldCheck className="w-5 h-5 text-[#583BE8] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    By submitting, you confirm you are authorized to operate this commercial fleet on ApnaTrip and agree to our Commercial Partner terms.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Navigation & Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Previous Step
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-2xl bg-[#583BE8] hover:bg-[#472ecc] text-white font-bold text-xs shadow-md shadow-[#583BE8]/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 rounded-2xl bg-[#583BE8] hover:bg-[#472ecc] text-white font-black text-xs sm:text-sm shadow-xl shadow-[#583BE8]/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Saving Draft...' : 'Continue to Registration Payment'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarRentalOnboardingPage;
