import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  FileText,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { OnboardingStepper } from '../../components/OnboardingStepper';

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export const BUSINESS_TYPES = [
  'Travel Agency',
  'Tour Operator',
  'Destination Management Company (DMC)',
  'Adventure Travel',
  'Pilgrimage Tours',
  'Corporate Travel',
  'Other',
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS_LIST = Array.from({ length: 75 }, (_, i) => CURRENT_YEAR - i);

const STORAGE_KEY = 'apnatrip_agency_onboarding_business';

export interface BusinessInfoFormData {
  legalBusinessName: string;
  agencyDisplayName: string;
  businessType: string;
  yearEstablished: string;
  registrationNumber: string;
  gstNumber: string;
  businessAddress: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

const initialFormData: BusinessInfoFormData = {
  legalBusinessName: '',
  agencyDisplayName: '',
  businessType: '',
  yearEstablished: '',
  registrationNumber: '',
  gstNumber: '',
  businessAddress: '',
  city: '',
  state: '',
  pinCode: '',
  country: 'India',
};

export const AgencyBusinessOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BusinessInfoFormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
    return initialFormData;
  });

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Field Validations
  const getCityError = (city: string) => {
    if (!city.trim()) return 'City is required';
    if (!/^[a-zA-Z\s]+$/.test(city.trim())) {
      return 'City must contain alphabets only';
    }
    return '';
  };

  const getPinCodeError = (pinCode: string) => {
    if (!pinCode.trim()) return 'PIN code is required';
    if (!/^\d{6}$/.test(pinCode.trim())) {
      return 'PIN code must be exactly 6 digits';
    }
    return '';
  };

  const getYearError = (year: string) => {
    if (year && parseInt(year, 10) > CURRENT_YEAR) {
      return `Year cannot be greater than ${CURRENT_YEAR}`;
    }
    return '';
  };

  // Validation Checks
  const isLegalNameValid = formData.legalBusinessName.trim().length > 0;
  const isDisplayNameValid = formData.agencyDisplayName.trim().length > 0;
  const isBusinessTypeValid = formData.businessType.trim().length > 0;
  const isAddressValid = formData.businessAddress.trim().length > 0;
  const isCityValid = getCityError(formData.city) === '';
  const isStateValid = formData.state.trim().length > 0;
  const isPinCodeValid = getPinCodeError(formData.pinCode) === '';
  const isYearValid = getYearError(formData.yearEstablished) === '';

  const isFormValid =
    isLegalNameValid &&
    isDisplayNameValid &&
    isBusinessTypeValid &&
    isAddressValid &&
    isCityValid &&
    isStateValid &&
    isPinCodeValid &&
    isYearValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      navigate('/agency/onboarding/profile');
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
        <OnboardingStepper currentStep={1} />
      </div>

      {/* ── Main Container ── */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 space-y-6 pb-28">
        {/* Title Header with Shop Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-start justify-between gap-4"
        >
          <div className="space-y-1.5 max-w-md">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Business Information
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Let's start with some basic information about your business.
            </p>
          </div>

          {/* Shop Front Vector Illustration */}
          <div className="shrink-0 w-24 h-20 sm:w-32 sm:h-24 relative hidden xs:flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 140 100" fill="none">
              <rect x="25" y="30" width="90" height="60" rx="4" fill="#EDE8FF" />
              <path d="M20 30L30 12H110L120 30H20Z" fill="#583BE8" />
              <rect x="40" y="45" width="25" height="45" fill="#583BE8" rx="2" />
              <rect x="75" y="45" width="30" height="25" fill="#DCD3FF" rx="2" />
              <circle cx="118" cy="80" r="6" fill="#8C75FF" />
              <path d="M118 70C113 65 110 55 110 50C120 50 125 65 118 70Z" fill="#583BE8" />
            </svg>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── SECTION 1: Business Basics ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-[#0F172A]">Business Basics</h2>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
              {/* Legal Business Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  Legal Business Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="legalBusinessName"
                  value={formData.legalBusinessName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('legalBusinessName')}
                  placeholder="Enter legal business name"
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-50/80 border text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none transition-all ${
                    touched.legalBusinessName && !isLegalNameValid
                      ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500'
                      : 'border-slate-200 focus:border-[#583BE8] focus:bg-white'
                  }`}
                />
                {touched.legalBusinessName && !isLegalNameValid && (
                  <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> Legal business name is required
                  </p>
                )}
              </div>

              {/* Agency Display Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  Agency Display Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="agencyDisplayName"
                  value={formData.agencyDisplayName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('agencyDisplayName')}
                  placeholder="Enter name as you want it to appear"
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-50/80 border text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none transition-all ${
                    touched.agencyDisplayName && !isDisplayNameValid
                      ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500'
                      : 'border-slate-200 focus:border-[#583BE8] focus:bg-white'
                  }`}
                />
                {touched.agencyDisplayName && !isDisplayNameValid && (
                  <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> Agency display name is required
                  </p>
                )}
              </div>

              {/* Business Type & Year Established Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Business Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    Business Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    onBlur={() => handleBlur('businessType')}
                    className={`w-full px-4 py-3 rounded-2xl bg-slate-50/80 border text-sm font-medium text-[#0F172A] focus:outline-none transition-all cursor-pointer ${
                      touched.businessType && !isBusinessTypeValid
                        ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500'
                        : 'border-slate-200 focus:border-[#583BE8] focus:bg-white'
                    }`}
                  >
                    <option value="" disabled>
                      Select business type
                    </option>
                    {BUSINESS_TYPES.map((bt) => (
                      <option key={bt} value={bt}>
                        {bt}
                      </option>
                    ))}
                  </select>
                  {touched.businessType && !isBusinessTypeValid && (
                    <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> Business type is required
                    </p>
                  )}
                </div>

                {/* Year Established */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    Year Established
                  </label>
                  <div className="relative">
                    <select
                      name="yearEstablished"
                      value={formData.yearEstablished}
                      onChange={handleChange}
                      onBlur={() => handleBlur('yearEstablished')}
                      className={`w-full px-4 py-3 pr-10 rounded-2xl bg-slate-50/80 border text-sm font-medium text-[#0F172A] focus:outline-none transition-all cursor-pointer ${
                        touched.yearEstablished && !isYearValid
                          ? 'border-rose-300 bg-rose-50/30'
                          : 'border-slate-200 focus:border-[#583BE8] focus:bg-white'
                      }`}
                    >
                      <option value="">Select year</option>
                      {YEARS_LIST.map((y) => (
                        <option key={y} value={y.toString()}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {touched.yearEstablished && !isYearValid && (
                    <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {getYearError(formData.yearEstablished)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── SECTION 2: Registration Details ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-[#0F172A]">Registration Details</h2>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Business Registration Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Business Registration Number
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="Enter registration number"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all"
                  />
                </div>

                {/* GST Number (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    GST Number <span className="text-slate-400 font-normal">(if applicable)</span>
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="Enter GST number"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all uppercase"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── SECTION 3: Business Location ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-[#0F172A]">Business Location</h2>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
              {/* Business Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  Business Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="businessAddress"
                    rows={2}
                    value={formData.businessAddress}
                    onChange={handleChange}
                    onBlur={() => handleBlur('businessAddress')}
                    placeholder="Enter complete business address"
                    className={`w-full px-4 py-3 pr-10 rounded-2xl bg-slate-50/80 border text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none transition-all resize-none ${
                      touched.businessAddress && !isAddressValid
                        ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500'
                        : 'border-slate-200 focus:border-[#583BE8] focus:bg-white'
                    }`}
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
                {touched.businessAddress && !isAddressValid && (
                  <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> Business address is required
                  </p>
                )}
              </div>

              {/* City & State Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={() => handleBlur('city')}
                    placeholder="Enter city"
                    className={`w-full px-4 py-3 rounded-2xl bg-slate-50/80 border text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none transition-all ${
                      touched.city && !isCityValid
                        ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500'
                        : 'border-slate-200 focus:border-[#583BE8] focus:bg-white'
                    }`}
                  />
                  {touched.city && !isCityValid && (
                    <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {getCityError(formData.city)}
                    </p>
                  )}
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    onBlur={() => handleBlur('state')}
                    className={`w-full px-4 py-3 rounded-2xl bg-slate-50/80 border text-sm font-medium text-[#0F172A] focus:outline-none transition-all cursor-pointer ${
                      touched.state && !isStateValid
                        ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500'
                        : 'border-slate-200 focus:border-[#583BE8] focus:bg-white'
                    }`}
                  >
                    <option value="" disabled>
                      Select state
                    </option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  {touched.state && !isStateValid && (
                    <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> State is required
                    </p>
                  )}
                </div>
              </div>

              {/* PIN Code & Country Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* PIN Code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    PIN Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    maxLength={6}
                    value={formData.pinCode}
                    onChange={(e) => {
                      // Only numeric digits allowed
                      const val = e.target.value.replace(/\D/g, '');
                      setFormData((prev) => ({ ...prev, pinCode: val }));
                    }}
                    onBlur={() => handleBlur('pinCode')}
                    placeholder="Enter PIN code"
                    className={`w-full px-4 py-3 rounded-2xl bg-slate-50/80 border text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none transition-all ${
                      touched.pinCode && !isPinCodeValid
                        ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500'
                        : 'border-slate-200 focus:border-[#583BE8] focus:bg-white'
                    }`}
                  />
                  {touched.pinCode && !isPinCodeValid && (
                    <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {getPinCodeError(formData.pinCode)}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    readOnly
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-sm font-medium text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
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
            onClick={() => navigate('/agency/onboarding')}
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

export default AgencyBusinessOnboardingPage;
