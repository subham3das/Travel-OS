import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Lock, Plane, Users, Plus, Trash2, UserCheck, HeartPulse } from 'lucide-react';

interface CompanionForm {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  phone?: string;
  email?: string;
  idProofType: string;
  idProofNumber: string;
  emergencyContact: string;
  medicalNotes?: string;
}

export const BookingFlowPage: React.FC = () => {
  const navigate = useNavigate();
  const { packageId } = useParams();
  const location = useLocation();

  // Step state: 1 = Traveler Details, 2 = Booking Review, 3 = Payment, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Booking Owner Form
  const [fullName, setFullName] = useState('Subham Das');
  const [email, setEmail] = useState('subham@apnatrip.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [ownerGender, setOwnerGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [ownerDob, setOwnerDob] = useState('1996-05-12');
  const [ownerIdProof, setOwnerIdProof] = useState('Aadhaar Card');
  const [ownerIdNumber, setOwnerIdNumber] = useState('9988-7766-5544');

  // Travel Companions Form Array
  const [companions, setCompanions] = useState<CompanionForm[]>([
    {
      id: 'comp-1',
      name: 'Rahul Das',
      gender: 'Male',
      dob: '1998-08-20',
      phone: '+91 98765 11111',
      email: 'rahul.das@example.com',
      idProofType: 'Aadhaar Card',
      idProofNumber: '1122-3344-5566',
      emergencyContact: '+91 98765 00000',
      medicalNotes: '',
    },
  ]);

  const [selectedPayment, setSelectedPayment] = useState<'upi' | 'card' | 'netbanking'>('upi');

  const totalTravelersCount = 1 + companions.length;
  const basePricePerPerson = 12499;
  const taxes = 625 * totalTravelersCount;
  const totalPrice = basePricePerPerson * totalTravelersCount + taxes;

  const handleAddPartner = () => {
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

  const handleRemovePartner = (id: string) => {
    setCompanions((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCompanionChange = (id: string, field: keyof CompanionForm, value: string) => {
    setCompanions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

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
            {step === 1 && 'Traveler & Companions Details'}
            {step === 2 && 'Review Group Booking'}
            {step === 3 && 'Payment'}
            {step === 4 && 'Booking Confirmed!'}
          </h2>
          {step < 4 && <p className="text-[10px] font-bold text-slate-400">Step {step} of 3</p>}
        </div>

        <div className="w-10" />
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* STEP 1: TRAVELER & COMPANIONS DETAILS */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Booking Owner / Primary Traveler Section */}
            <div className="bg-white rounded-3xl p-5 border border-purple-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#583BE8]" />
                  <h3 className="text-base font-extrabold text-[#0F172A]">Primary Traveler (Booking Owner)</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#583BE8] text-[10px] font-black">
                  Lead Contact
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Gender *</label>
                  <select
                    value={ownerGender}
                    onChange={(e) => setOwnerGender(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Government ID Type *</label>
                  <select
                    value={ownerIdProof}
                    onChange={(e) => setOwnerIdProof(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A]"
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Voter ID">Voter ID</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">ID Number *</label>
                  <input
                    type="text"
                    value={ownerIdNumber}
                    onChange={(e) => setOwnerIdNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A]"
                  />
                </div>
              </div>
            </div>

            {/* Travel Companions Section */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-700" />
                  <h3 className="text-base font-extrabold text-[#0F172A]">Travel Companions</h3>
                </div>
                <span className="text-xs font-extrabold text-[#583BE8]">
                  {companions.length} Partner{companions.length === 1 ? '' : 's'} Added
                </span>
              </div>

              {/* Dynamic Companions Forms */}
              {companions.map((comp, idx) => (
                <div key={comp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#583BE8]">
                      Travel Partner #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePartner(comp.id)}
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
                        placeholder="Companion Full Name"
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

                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Govt ID Number *</label>
                      <input
                        type="text"
                        placeholder="ID Number"
                        value={comp.idProofNumber}
                        onChange={(e) => handleCompanionChange(comp.id, 'idProofNumber', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Emergency Contact *</label>
                      <input
                        type="tel"
                        placeholder="Emergency Phone"
                        value={comp.emergencyContact}
                        onChange={(e) => handleCompanionChange(comp.id, 'emergencyContact', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A]"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Partner Button */}
              <button
                type="button"
                onClick={handleAddPartner}
                className="w-full py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] border border-purple-200 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Partner</span>
              </button>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-[#FF4D6D] text-white font-extrabold text-sm shadow-lg shadow-[#FF4D6D]/20 focus:outline-none cursor-pointer"
            >
              Continue to Review Group ({totalTravelersCount} Travelers) →
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

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 space-y-1">
                <span className="text-[#583BE8] font-black block">Booking Group Composition:</span>
                <p>• Primary Traveler: {fullName} ({phone})</p>
                {companions.map((c, i) => (
                  <p key={c.id}>• Partner #{i + 1}: {c.name || 'Partner Name'}</p>
                ))}
              </div>

              <div className="space-y-2 text-xs font-semibold text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>Base Fare ({totalTravelersCount} Travelers @ ₹{basePricePerPerson.toLocaleString('en-IN')})</span>
                  <span>₹{(basePricePerPerson * totalTravelersCount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Service Fee</span>
                  <span>₹{taxes.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-extrabold text-[#0F172A]">
                  <span>Total Amount Payable</span>
                  <span className="text-[#FF4D6D]">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-[#FF4D6D] text-white font-extrabold text-sm shadow-lg shadow-[#FF4D6D]/20 focus:outline-none cursor-pointer"
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
              className="w-full py-4 rounded-2xl bg-[#FF4D6D] text-white font-extrabold text-sm shadow-lg shadow-[#FF4D6D]/20 focus:outline-none flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Pay ₹{totalPrice.toLocaleString('en-IN')} & Confirm Booking</span>
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
              <h2 className="text-2xl font-black text-[#0F172A]">Group Booking Confirmed! 🎉</h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-md mx-auto">
                Booking confirmed for <span className="font-extrabold text-slate-800">{totalTravelersCount} Travelers</span> (Lead: {fullName}). Invoice sent to <span className="font-extrabold text-slate-800">{email}</span>.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/my-trips')}
                className="px-6 py-3.5 rounded-2xl bg-[#FF4D6D] text-white font-extrabold text-xs shadow-md shadow-[#FF4D6D]/20 cursor-pointer"
              >
                Go to My Trips
              </button>
              <button
                onClick={() => navigate('/home')}
                className="px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
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
