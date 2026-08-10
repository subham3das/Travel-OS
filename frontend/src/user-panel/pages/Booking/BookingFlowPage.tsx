import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Headphones, Check, Users, ShieldCheck, CreditCard, Lock, 
  UserCheck, Plus, Trash2, Edit3, ChevronRight, AlertCircle, FileText, CheckCircle2 
} from 'lucide-react';

import { usePackage } from '../../hooks/usePackage';

// Subcomponents imported from modular payment/review/traveler components
import { PackageSummaryCard } from '../BookingReview/components/PackageSummaryCard';
import { TravelerSummary } from '../BookingReview/components/TravelerSummary';
import { EmergencyContactCard } from '../BookingReview/components/EmergencyContactCard';
import { DocumentSummary } from '../BookingReview/components/DocumentSummary';
import { SpecialRequestCard } from '../BookingReview/components/SpecialRequestCard';
import { InsuranceSummary } from '../BookingReview/components/InsuranceSummary';
import { CouponSummary } from '../BookingReview/components/CouponSummary';
import { PriceBreakdown } from '../BookingReview/components/PriceBreakdown';
import { CancellationPolicy } from '../BookingReview/components/CancellationPolicy';

import { OrderSummary } from '../Payment/components/OrderSummary';
import { AmountSummary } from '../Payment/components/AmountSummary';
import { RazorpayCard } from '../Payment/components/RazorpayCard';
import { BillingAddress } from '../Payment/components/BillingAddress';
import { SecuritySection } from '../Payment/components/SecuritySection';
import { PolicyAccordion } from '../Payment/components/PolicyAccordion';
import { TermsSection } from '../Payment/components/TermsSection';
import { StickyPaymentBar } from '../Payment/components/StickyPaymentBar';
import { PriceSummary } from '../TravelerDetails/components/PriceSummary';

interface CompanionForm {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  idProofType: string;
  idProofNumber: string;
  emergencyContact: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const BookingFlowPage: React.FC = () => {
  const navigate = useNavigate();
  const { packageId, id } = useParams<{ packageId?: string; id?: string }>();
  const targetId = packageId || id || 'package-001';

  const { pkg, loading } = usePackage(targetId);

  // Dynamic Booking Step state: 1 = Traveler Details, 2 = Review Booking, 3 = Payment, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // --- Step 1: Lead Traveler Data ---
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [email, setEmail] = useState('rahulsharma@gmail.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dob, setDob] = useState('1994-08-15');
  const [idType, setIdType] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('9988-7766-5544');
  const [address, setAddress] = useState('123, MG Road, Shillong, Meghalaya');

  // --- Companions List ---
  const [companions, setCompanions] = useState<CompanionForm[]>([
    {
      id: 'comp-1',
      name: 'Ananya Sharma',
      gender: 'Female',
      dob: '1996-11-20',
      idProofType: 'Aadhaar Card',
      idProofNumber: '1122-3344-5566',
      emergencyContact: '+91 98765 43210',
    },
  ]);

  // --- Emergency Contact ---
  const [emergencyName, setEmergencyName] = useState('Vikram Sharma');
  const [emergencyRelation, setEmergencyRelation] = useState('Brother');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 91234 56789');

  // --- Addons & Preferences ---
  const [isInsuranceEnabled, setIsInsuranceEnabled] = useState(true);
  const [specialRequests, setSpecialRequests] = useState('');
  const [couponCode, setCouponCode] = useState('APNATRIP2000');
  const [discountAmount, setDiscountAmount] = useState(2000);

  // --- Step 3 Payment & Verification ---
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [priceBreakdownOpen, setPriceBreakdownOpen] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [bookingId, setBookingId] = useState('BK-APTRIP-89201');

  // Load Razorpay SDK
  useEffect(() => {
    if (!document.getElementById('razorpay-sdk')) {
      const script = document.createElement('script');
      script.id = 'razorpay-sdk';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Scroll smooth to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const selectedPkg = pkg || {
    id: 'package-001',
    title: '7-Day Meghalaya Waterfall & Cave Trail',
    agencyName: 'Himalayan Explorers',
    agencyVerified: true,
    price: '₹24,998',
    duration: '7 Days / 6 Nights',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
  };

  // Financial Computations
  const totalTravelersCount = 1 + companions.length;
  const basePricePerPerson = parseInt(selectedPkg.price.replace(/[^0-9]/g, '')) || 24998;
  const packagePrice = basePricePerPerson * totalTravelersCount;
  const insurancePrice = isInsuranceEnabled ? totalTravelersCount * 499 : 0;
  const taxes = Math.round(packagePrice * 0.05);
  const totalAmount = Math.max(0, packagePrice + taxes + insurancePrice - discountAmount);

  // Companion Handlers
  const handleAddCompanion = () => {
    const newComp: CompanionForm = {
      id: `comp-${Date.now()}`,
      name: '',
      gender: 'Male',
      dob: '',
      idProofType: 'Aadhaar Card',
      idProofNumber: '',
      emergencyContact: phone,
    };
    setCompanions((prev) => [...prev, newComp]);
  };

  const handleRemoveCompanion = (idToRemove: string) => {
    setCompanions((prev) => prev.filter((c) => c.id !== idToRemove));
  };

  const handleCompanionChange = (idToUpdate: string, field: keyof CompanionForm, val: string) => {
    setCompanions((prev) =>
      prev.map((c) => (c.id === idToUpdate ? { ...c, [field]: val } : c))
    );
  };

  // Step Navigators
  const goToStep = (targetStep: 1 | 2 | 3) => {
    setStep(targetStep);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      alert('Please fill out all required fields for the primary traveler.');
      return;
    }
    setStep(2);
  };

  const handleRazorpayPayment = () => {
    if (!termsAccepted) {
      alert('Please accept the Terms & Conditions before proceeding.');
      return;
    }

    const generatedBookingId = `BK-${Date.now().toString().slice(-6)}`;
    setBookingId(generatedBookingId);

    if (window.Razorpay) {
      const options = {
        key: 'rzp_test_mock_key',
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'ApnaTrip Travel OS',
        description: selectedPkg.title,
        image: selectedPkg.coverImage,
        handler: function () {
          setStep(4);
        },
        prefill: {
          name: fullName,
          email: email,
          contact: phone,
        },
        theme: {
          color: '#583BE8',
        },
        modal: {
          ondismiss: function () {
            console.log('Payment modal dismissed');
          },
        },
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        simulateFallbackPayment();
      }
    } else {
      simulateFallbackPayment();
    }
  };

  const simulateFallbackPayment = () => {
    const confirmPay = window.confirm(
      `Launching Razorpay Secure Checkout for ₹${totalAmount.toLocaleString('en-IN')}.\n\nClick OK to simulate successful payment.`
    );
    if (confirmPay) {
      setStep(4);
    } else {
      setPaymentFailed(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#583BE8]/20 border-t-[#583BE8] rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-500">Loading booking flow...</p>
      </div>
    );
  }

  const steps = [
    { number: 1, label: 'Traveler Details' },
    { number: 2, label: 'Review Booking' },
    { number: 3, label: 'Payment' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#583BE8]/20 selection:text-[#583BE8] pb-12">
      {/* ========================================================================= */}
      {/* 1. STICKY PROGRESS HEADER STEPPER */}
      {/* ========================================================================= */}
      {step < 4 && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100/90 shadow-2xs select-none">
          <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-2.5 space-y-2">
            {/* Top Header Bar */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => (step > 1 ? setStep((prev) => (prev - 1) as any) : navigate(-1))}
                className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200/80 text-slate-800 flex items-center justify-center shadow-2xs hover:bg-slate-100 transition-all cursor-pointer focus:outline-none shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="text-center flex-1 px-3">
                <h1 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight leading-none">
                  {step === 1 && 'Traveler Details'}
                  {step === 2 && 'Review Booking'}
                  {step === 3 && 'Payment'}
                </h1>
                <p className="text-[10px] font-bold text-slate-400 pt-0.5">Step {step} of 3</p>
              </div>

              <button
                type="button"
                onClick={() => alert('Support team is available 24/7! Call +91 98765 43210')}
                className="flex items-center gap-1 text-xs font-extrabold text-[#0F172A] hover:text-[#583BE8] transition-colors cursor-pointer shrink-0"
              >
                <Headphones className="w-4 h-4" />
                <span>Help</span>
              </button>
            </div>

            {/* Stepper Node Bar */}
            <div className="relative flex items-center justify-between px-2">
              <div className="absolute top-3 sm:top-3.5 left-[16%] right-[16%] h-0.5 bg-slate-200 z-0" />
              <div
                className="absolute top-3 sm:top-3.5 left-[16%] h-0.5 bg-[#583BE8] transition-all duration-500 z-0"
                style={{ width: step === 1 ? '0%' : step === 2 ? '34%' : '68%' }}
              />

              {steps.map((st) => {
                const isCompleted = st.number < step;
                const isActive = st.number === step;

                return (
                  <button
                    key={st.number}
                    type="button"
                    onClick={() => {
                      if (isCompleted) goToStep(st.number as any);
                    }}
                    disabled={!isCompleted && !isActive}
                    className={`relative z-10 flex flex-col items-center gap-1 w-24 sm:w-28 transition-all ${
                      isCompleted ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black transition-all ${
                        isCompleted
                          ? 'bg-[#583BE8] text-white shadow-xs'
                          : isActive
                          ? 'bg-[#583BE8] text-white ring-4 ring-[#583BE8]/15 shadow-md'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : st.number}
                    </div>

                    <span
                      className={`text-[10px] font-extrabold text-center leading-tight transition-colors ${
                        isActive ? 'text-[#583BE8]' : isCompleted ? 'text-[#0F172A]' : 'text-slate-400'
                      }`}
                    >
                      {st.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>
      )}

      {/* ========================================================================= */}
      {/* MAIN STEP CONTENT WRAPPER */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-6 space-y-6">
        <AnimatePresence mode="wait">
          {/* --------------------------------------------------------------------- */}
          {/* STEP 1: TRAVELER & COMPANION DETAILS FORM */}
          {/* --------------------------------------------------------------------- */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Package Summary Card Header */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft flex items-center gap-4">
                <img
                  src={selectedPkg.coverImage}
                  alt={selectedPkg.title}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-xs"
                />
                <div className="space-y-1 flex-1 min-w-0">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#583BE8] text-[10px] font-black tracking-wider uppercase inline-block">
                    {selectedPkg.duration}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#0F172A] truncate">
                    {selectedPkg.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    by {selectedPkg.agencyName}
                  </p>
                </div>
              </div>

              {/* Primary Traveler Form */}
              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-soft space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#583BE8]/10 text-[#583BE8] flex items-center justify-center">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <h2 className="text-base font-black text-[#0F172A]">
                        Primary Traveler (Lead Contact)
                      </h2>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#583BE8] text-[10px] font-black">
                      Lead Contact
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#583BE8] outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#583BE8] outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#583BE8] outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Gender *</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#583BE8] outline-none transition-all"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#583BE8] outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Govt ID Type *</label>
                      <select
                        value={idType}
                        onChange={(e) => setIdType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#583BE8] outline-none transition-all"
                      >
                        <option value="Aadhaar Card">Aadhaar Card</option>
                        <option value="Passport">Passport</option>
                        <option value="Driving License">Driving License</option>
                        <option value="Voter ID">Voter ID</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">ID Number *</label>
                    <input
                      type="text"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#583BE8] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Additional Companions Section */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-soft space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <h2 className="text-base font-black text-[#0F172A]">
                        Travel Companions ({companions.length})
                      </h2>
                    </div>
                    <span className="text-xs font-extrabold text-[#583BE8]">
                      Total Travelers: {totalTravelersCount}
                    </span>
                  </div>

                  {companions.map((comp, idx) => (
                    <div key={comp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#583BE8]">
                          Traveler #{idx + 2} (Companion)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCompanion(comp.id)}
                          className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Full Name *</label>
                          <input
                            type="text"
                            placeholder="Companion Name"
                            value={comp.name}
                            onChange={(e) => handleCompanionChange(comp.id, 'name', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Gender *</label>
                          <select
                            value={comp.gender}
                            onChange={(e) => handleCompanionChange(comp.id, 'gender', e.target.value as any)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A]"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Date of Birth *</label>
                          <input
                            type="date"
                            value={comp.dob}
                            onChange={(e) => handleCompanionChange(comp.id, 'dob', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Govt ID Type *</label>
                          <select
                            value={comp.idProofType}
                            onChange={(e) => handleCompanionChange(comp.id, 'idProofType', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A]"
                          >
                            <option value="Aadhaar Card">Aadhaar Card</option>
                            <option value="Passport">Passport</option>
                            <option value="Driving License">Driving License</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddCompanion}
                    className="w-full py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] border border-purple-200/80 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Companion Traveler</span>
                  </button>
                </div>

                {/* Emergency Contact */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-soft space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <h2 className="text-base font-black text-[#0F172A]">Emergency Contact</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Contact Name *</label>
                      <input
                        type="text"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Relationship *</label>
                      <input
                        type="text"
                        value={emergencyRelation}
                        onChange={(e) => setEmergencyRelation(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A]"
                      />
                    </div>
                  </div>
                </div>

                {/* Travel Protection Insurance Toggle */}
                <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-soft flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#0F172A]">
                        Comprehensive Travel Insurance
                      </h3>
                      <p className="text-xs font-semibold text-slate-400">
                        Coverage up to ₹5,00,000 for medical & trip delays ({totalTravelersCount} × ₹499)
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsInsuranceEnabled(!isInsuranceEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer shrink-0 ${
                      isInsuranceEnabled ? 'bg-[#583BE8]' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        isInsuranceEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Special Requests */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft space-y-2">
                  <label className="text-xs font-extrabold text-[#0F172A] block">
                    Special Requests & Preferences (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="E.g. Vegetarian meal preferences, room accessibility, bed preferences..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-medium text-[#0F172A] outline-none focus:bg-white focus:border-[#583BE8] transition-all"
                  />
                </div>

                {/* Step 1 Next Action Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-[#583BE8] hover:bg-[#482bd4] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#583BE8]/25 transition-all cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span>Continue to Review Booking ({totalTravelersCount} Travelers)</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* STEP 2: REVIEW BOOKING SUMMARY */}
          {/* --------------------------------------------------------------------- */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* 1. Package Summary */}
              <PackageSummaryCard pkg={selectedPkg as any} travelerCount={totalTravelersCount} />

              {/* 2. Travelers Summary with Edit Button */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#583BE8]" />
                    <h3 className="text-base font-extrabold text-[#0F172A]">Travelers Summary</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-extrabold text-[#583BE8] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="space-y-2 text-xs font-semibold text-slate-700">
                  <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
                    <div>
                      <span className="font-black text-[#0F172A] block">{fullName} (Primary)</span>
                      <span className="text-slate-500">{phone} • {email}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#583BE8] text-[10px] font-black">
                      Lead
                    </span>
                  </div>

                  {companions.map((comp, idx) => (
                    <div key={comp.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#0F172A] block">{comp.name || `Companion #${idx + 1}`}</span>
                        <span className="text-slate-500">{comp.gender} • ID: {comp.idProofType}</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">Traveler #{idx + 2}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Emergency Contact & Documents */}
              <EmergencyContactCard
                packageId={selectedPkg.id}
                name={emergencyName}
                relationship={emergencyRelation}
                phone={emergencyPhone}
              />

              <DocumentSummary packageId={selectedPkg.id} />

              {specialRequests && (
                <SpecialRequestCard packageId={selectedPkg.id} />
              )}

              {/* 4. Insurance & Coupon Summaries */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InsuranceSummary insurancePrice={insurancePrice} />
                <CouponSummary couponCode={couponCode} discountAmount={discountAmount} />
              </div>

              {/* 5. Price Breakdown */}
              <PriceBreakdown
                packagePrice={packagePrice}
                taxes={taxes}
                insurancePrice={insurancePrice}
                discountAmount={discountAmount}
                totalAmount={totalAmount}
              />

              <CancellationPolicy />

              {/* Step 2 Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm transition-all cursor-pointer"
                >
                  ← Edit Details
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full sm:flex-1 py-4 rounded-2xl bg-[#583BE8] hover:bg-[#482bd4] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#583BE8]/25 transition-all cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span>Proceed to Payment (₹{totalAmount.toLocaleString('en-IN')})</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* STEP 3: PAYMENT & GATEWAY CHECKOUT */}
          {/* --------------------------------------------------------------------- */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {paymentFailed && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-3xl space-y-2">
                  <h3 className="text-sm font-extrabold flex items-center gap-2 text-rose-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Payment Failed or Cancelled</span>
                  </h3>
                  <p className="text-xs font-medium">
                    We couldn't process your payment. Don't worry, no money was deducted. Please retry using Razorpay Checkout.
                  </p>
                </div>
              )}

              {/* Order Summary Card */}
              <OrderSummary pkg={selectedPkg as any} travelerCount={totalTravelersCount} />

              {/* Amount Summary */}
              <AmountSummary
                packagePrice={packagePrice}
                taxes={taxes}
                insurancePrice={insurancePrice}
                discountAmount={discountAmount}
                couponCode={couponCode}
                totalAmount={totalAmount}
              />

              {/* Razorpay Gateway Launcher */}
              <RazorpayCard
                totalAmount={totalAmount}
                isDisabled={!termsAccepted}
                onPayClick={handleRazorpayPayment}
              />

              {/* Billing Address */}
              <BillingAddress />

              {/* Security Badges */}
              <SecuritySection />

              {/* Cancellation Policies */}
              <PolicyAccordion />

              {/* Terms Section */}
              <TermsSection
                accepted={termsAccepted}
                onToggle={(val) => setTermsAccepted(val)}
              />

              {/* Sticky Payment Bar */}
              <StickyPaymentBar
                totalAmount={totalAmount}
                isDisabled={!termsAccepted}
                onOpenPriceBreakdown={() => setPriceBreakdownOpen(true)}
                isBreakdownOpen={priceBreakdownOpen}
                onPayClick={handleRazorpayPayment}
                buttonText="Proceed to Payment"
              />
            </motion.div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* STEP 4: BOOKING CONFIRMED SUCCESS */}
          {/* --------------------------------------------------------------------- */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6 text-center py-8"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-black shadow-lg shadow-emerald-500/20">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold uppercase tracking-wider border border-emerald-200 inline-block">
                  Booking Confirmed! 🎉
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                  You're all set for your trip!
                </h2>
                <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-md mx-auto">
                  Booking ID: <span className="font-extrabold text-[#583BE8]">{bookingId}</span> for{' '}
                  <span className="font-extrabold text-slate-800">{totalTravelersCount} Travelers</span>. An official PDF invoice has been emailed to{' '}
                  <span className="font-extrabold text-slate-800">{email}</span>.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-100 max-w-md mx-auto space-y-3 text-left shadow-soft">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span>Package:</span>
                  <span className="text-[#0F172A]">{selectedPkg.title}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span>Primary Traveler:</span>
                  <span className="text-[#0F172A]">{fullName}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span>Total Amount Paid:</span>
                  <span className="text-[#583BE8] text-sm font-extrabold">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => navigate('/my-trips')}
                  className="w-full py-4 rounded-2xl bg-[#583BE8] text-white font-extrabold text-xs shadow-lg shadow-[#583BE8]/20 cursor-pointer hover:bg-[#482bd4] transition-all"
                >
                  Go to My Trips & Bookings
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/home')}
                  className="w-full py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer hover:bg-slate-50 transition-all"
                >
                  Back to Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Detailed Price Breakdown Modal */}
      {priceBreakdownOpen && (
        <PriceSummary
          basePrice={packagePrice}
          travelerCount={totalTravelersCount}
          insurancePrice={insurancePrice}
          discountAmount={discountAmount}
          taxesAmount={taxes}
          grandTotal={totalAmount}
          onClose={() => setPriceBreakdownOpen(false)}
        />
      )}
    </div>
  );
};

export default BookingFlowPage;
