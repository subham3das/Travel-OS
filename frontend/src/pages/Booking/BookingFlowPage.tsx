import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Lock, Plane, Users, Check } from 'lucide-react';

export const BookingFlowPage: React.FC = () => {
  const navigate = useNavigate();
  const { packageId } = useParams();
  const location = useLocation();

  // Step state: 1 = Traveler Details, 2 = Booking Review, 3 = Payment, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form States
  const [travelersCount, setTravelersCount] = useState(1);
  const [fullName, setFullName] = useState('Subham Das');
  const [email, setEmail] = useState('subham@apnatrip.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [selectedPayment, setSelectedPayment] = useState<'upi' | 'card' | 'netbanking'>('upi');

  const basePricePerPerson = 12499;
  const taxes = 625;
  const totalPrice = basePricePerPerson * travelersCount + taxes;

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#FF4D6D]/20 selection:text-[#FF4D6D]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center justify-between">
        <button
          onClick={() => (step > 1 && step < 4 ? setStep((prev) => (prev - 1) as any) : navigate(-1))}
          className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all focus:outline-none cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="text-sm font-extrabold text-[#0F172A]">
            {step === 1 && 'Traveler Details'}
            {step === 2 && 'Review Booking'}
            {step === 3 && 'Payment'}
            {step === 4 && 'Booking Confirmed!'}
          </h2>
          {step < 4 && <p className="text-[10px] font-bold text-slate-400">Step {step} of 3</p>}
        </div>

        <div className="w-10" />
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* STEP 1: TRAVELER DETAILS */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
              <h3 className="text-base font-extrabold text-[#0F172A]">Trip & Traveler Information</h3>

              {/* Number of Travelers */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">Number of Travelers</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTravelersCount((p) => Math.max(1, p - 1))}
                    className="w-8 h-8 rounded-full bg-slate-100 font-bold text-slate-700 focus:outline-none"
                  >
                    -
                  </button>
                  <span className="text-sm font-extrabold text-[#0F172A]">{travelersCount}</span>
                  <button
                    onClick={() => setTravelersCount((p) => Math.min(10, p + 1))}
                    className="w-8 h-8 rounded-full bg-slate-100 font-bold text-slate-700 focus:outline-none"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Lead Traveler Form */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#0F172A]"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-[#FF4D6D] text-white font-extrabold text-sm shadow-lg shadow-[#FF4D6D]/20 focus:outline-none"
            >
              Continue to Review →
            </button>
          </motion.div>
        )}

        {/* STEP 2: REVIEW BOOKING */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
              <h3 className="text-base font-extrabold text-[#0F172A]">Summary & Price Details</h3>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-xs font-semibold text-[#FF4D6D]">
                7-Day Meghalaya Waterfall & Cave Trail by Himalayan Explorers
              </div>

              <div className="space-y-2 text-xs font-semibold text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>Base Fare ({travelersCount} Traveler)</span>
                  <span>₹{(basePricePerPerson * travelersCount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Service Fee</span>
                  <span>₹{taxes}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-extrabold text-[#0F172A]">
                  <span>Total Amount Payable</span>
                  <span className="text-[#FF4D6D]">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-[#FF4D6D] text-white font-extrabold text-sm shadow-lg shadow-[#FF4D6D]/20 focus:outline-none"
            >
              Proceed to Payment (₹{totalPrice.toLocaleString('en-IN')}) →
            </button>
          </motion.div>
        )}

        {/* STEP 3: PAYMENT */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
              <h3 className="text-base font-extrabold text-[#0F172A]">Select Payment Method</h3>

              <div className="space-y-2">
                {['upi', 'card', 'netbanking'].map((method) => (
                  <div
                    key={method}
                    onClick={() => setSelectedPayment(method as any)}
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedPayment === method ? 'border-[#FF4D6D] bg-rose-50/50' : 'border-slate-100 bg-white'
                    }`}
                  >
                    <span className="text-xs font-extrabold text-[#0F172A] capitalize">{method === 'upi' ? 'GPay / PhonePe / BHIM UPI' : method === 'card' ? 'Credit / Debit Card' : 'Net Banking'}</span>
                    <input type="radio" checked={selectedPayment === method} onChange={() => {}} className="accent-[#FF4D6D]" />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-[#FF4D6D] text-white font-extrabold text-sm shadow-lg shadow-[#FF4D6D]/20 focus:outline-none flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Pay ₹{totalPrice.toLocaleString('en-IN')} & Confirm</span>
            </button>
          </motion.div>
        )}

        {/* STEP 4: BOOKING SUCCESS */}
        {step === 4 && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6 text-center py-8">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-black">
              ✓
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#0F172A]">Booking Successful! 🎉</h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-md mx-auto">
                Your trip confirmation & invoice have been sent to <span className="font-extrabold text-slate-800">{email}</span>.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/my-trips')}
                className="px-6 py-3.5 rounded-2xl bg-[#FF4D6D] text-white font-extrabold text-xs shadow-md shadow-[#FF4D6D]/20"
              >
                Go to My Trips
              </button>
              <button
                onClick={() => navigate('/home')}
                className="px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-extrabold text-xs"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default BookingFlowPage;
