import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePackage } from '../../hooks/usePackage';

import { BookingProgress } from './components/BookingProgress';
import { PackageSummary } from './components/PackageSummary';
import { LeadTravelerForm, LeadTravelerData } from './components/LeadTravelerForm';
import { AdditionalTravelerList } from './components/AdditionalTravelerList';
import { AdditionalTraveler } from './components/TravelerCard';
import { EmergencyContact, EmergencyContactData } from './components/EmergencyContact';
import { DocumentUploader, DocumentStatus } from './components/DocumentUploader';
import { InsuranceCard } from './components/InsuranceCard';
import { CouponCard } from './components/CouponCard';
import { TermsSection } from './components/TermsSection';
import { PriceSummary } from './components/PriceSummary';
import { StickyContinueBar } from './components/StickyContinueBar';

export const TravelerDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { packageId, id } = useParams<{ packageId?: string; id?: string }>();
  const targetId = packageId || id || 'package-001';

  const { pkg, loading, error } = usePackage(targetId);

  // Form State
  const [leadTraveler, setLeadTraveler] = useState<LeadTravelerData>({
    fullName: 'Rahul Sharma',
    gender: 'Male',
    dob: '15/08/1992',
    phone: '+91 98765 43210',
    email: 'rahulsharma@gmail.com',
    address: '123, MG Road, Shillong, Meghalaya',
  });

  const [additionalTravelers, setAdditionalTravelers] = useState<AdditionalTraveler[]>([
    {
      id: 'at-1',
      name: 'Ananya Sharma',
      age: '12',
      gender: 'Female',
      type: 'Child',
    },
  ]);

  const [emergencyContact, setEmergencyContact] = useState<EmergencyContactData>({
    name: 'Vikram Sharma',
    relationship: 'Brother',
    phone: '+91 91234 56789',
  });

  const [documents, setDocuments] = useState<DocumentStatus[]>([
    {
      travelerName: 'Rahul Sharma',
      travelerType: 'Adult',
      docType: 'Aadhaar Card',
      isUploaded: true,
    },
    {
      travelerName: 'Ananya Sharma',
      travelerType: 'Child',
      docType: 'Aadhaar Card',
      isUploaded: false,
    },
  ]);

  const [specialRequests, setSpecialRequests] = useState('');
  const [isInsuranceEnabled, setIsInsuranceEnabled] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [priceBreakdownOpen, setPriceBreakdownOpen] = useState(false);

  // Field level validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#6356E5]/20 border-t-[#6356E5] rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-500">Loading booking details...</p>
      </div>
    );
  }

  const selectedPkg = pkg || {
    id: 'package-001',
    title: '7-Day Meghalaya Waterfall & Cave Trail',
    agencyName: 'Himalayan Explorers',
    agencyVerified: true,
    price: '₹24,999',
    duration: '7 Days / 6 Nights',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
  };

  const totalTravelers = 1 + additionalTravelers.length;

  // Numerical Price Computations
  const numericBasePrice = parseInt(selectedPkg.price.replace(/[^0-9]/g, '')) || 24999;
  const insurancePrice = isInsuranceEnabled ? totalTravelers * 499 : 0;
  const taxesAmount = Math.round(numericBasePrice * 0.05);

  let discountAmount = 0;
  if (appliedCoupon === 'APNATRIP10') {
    discountAmount = Math.round(numericBasePrice * 0.1);
  } else if (appliedCoupon === 'WELCOME20') {
    discountAmount = Math.round(numericBasePrice * 0.2);
  }

  const grandTotal = numericBasePrice + insurancePrice + taxesAmount - discountAmount;

  // Handlers for Lead Traveler
  const handleLeadChange = (field: keyof LeadTravelerData, value: string) => {
    setLeadTraveler((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Handlers for Additional Travelers
  const handleAddTraveler = (newT: Omit<AdditionalTraveler, 'id'>) => {
    const id = `at-${Date.now()}`;
    const added = { ...newT, id };
    setAdditionalTravelers((prev) => [...prev, added]);

    // Also append to documents list
    setDocuments((prev) => [
      ...prev,
      {
        travelerName: added.name,
        travelerType: added.type,
        docType: 'Aadhaar Card',
        isUploaded: false,
      },
    ]);
  };

  const handleEditTraveler = (updated: AdditionalTraveler) => {
    setAdditionalTravelers((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  const handleDeleteTraveler = (id: string) => {
    setAdditionalTravelers((prev) => prev.filter((t) => t.id !== id));
  };

  // Handlers for Emergency Contact
  const handleEmergencyChange = (field: keyof EmergencyContactData, value: string) => {
    setEmergencyContact((prev) => ({ ...prev, [field]: value }));
    if (errors[`emergency_${field}`]) {
      setErrors((prev) => ({ ...prev, [`emergency_${field}`]: '' }));
    }
  };

  // Handlers for Document Upload
  const handleDocumentUpload = (travelerName: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.travelerName === travelerName ? { ...d, isUploaded: true } : d))
    );
    alert(`Document successfully uploaded for ${travelerName}!`);
  };

  // Handlers for Coupon Code
  const handleApplyCoupon = (code: string) => {
    const uppercase = code.toUpperCase().trim();
    if (uppercase === 'APNATRIP10' || uppercase === 'WELCOME20') {
      setAppliedCoupon(uppercase);
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  // Form Validation check
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!leadTraveler.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!leadTraveler.dob.trim()) newErrors.dob = 'DOB is required';
    if (!leadTraveler.phone.trim()) newErrors.phone = 'Mobile Number is required';
    if (!leadTraveler.email.trim()) newErrors.email = 'Email is required';
    if (!leadTraveler.address.trim()) newErrors.address = 'Address is required';
    if (!emergencyContact.name.trim()) newErrors.emergency_name = 'Emergency contact is required';
    if (!emergencyContact.phone.trim()) newErrors.emergency_phone = 'Emergency phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) return;
    if (!termsAccepted) {
      alert('Please accept the Terms & Conditions before continuing.');
      return;
    }
    // Navigate to Review Booking
    navigate(`/booking/review/${selectedPkg.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5] pb-32">
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* 1. Header & Stepper */}
        <BookingProgress currentStep={1} />

        {/* 2. Package Summary Card */}
        <PackageSummary
          pkg={selectedPkg as any}
          travelerCount={totalTravelers}
          totalPrice={grandTotal}
        />

        {/* 3. Lead Traveler Form */}
        <LeadTravelerForm
          data={leadTraveler}
          onChange={handleLeadChange}
          errors={errors}
        />

        {/* 4. Additional Travelers */}
        <AdditionalTravelerList
          travelers={additionalTravelers}
          onAddTraveler={handleAddTraveler}
          onEditTraveler={handleEditTraveler}
          onDeleteTraveler={handleDeleteTraveler}
        />

        {/* 5. Emergency Contact */}
        <EmergencyContact
          data={emergencyContact}
          onChange={handleEmergencyChange}
          errors={{
            name: errors.emergency_name,
            phone: errors.emergency_phone,
          }}
        />

        {/* 6. Identity Documents */}
        <DocumentUploader
          documents={documents}
          onUpload={handleDocumentUpload}
        />

        {/* 7. Special Requests */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
              Special Requests
            </h2>
            <span className="text-xs font-semibold text-slate-400">(Optional)</span>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs relative">
            <textarea
              rows={3}
              maxLength={200}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Enter any special requests or preferences (e.g. Vegetarian meals, Wheelchair, Honeymoon setup...)"
              className="w-full text-xs sm:text-sm font-semibold text-[#0F172A] focus:outline-none resize-none placeholder:text-slate-400"
            />
            <div className="text-right text-[10px] font-bold text-slate-400 pt-1">
              {specialRequests.length}/200
            </div>
          </div>
        </div>

        {/* 8. Travel Insurance & Coupon Code Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InsuranceCard
            isEnabled={isInsuranceEnabled}
            onToggle={(val) => setIsInsuranceEnabled(val)}
            pricePerTraveler={499}
          />
          <CouponCard
            appliedCoupon={appliedCoupon}
            discountAmount={discountAmount}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
          />
        </div>

        {/* 9. Terms & Conditions */}
        <TermsSection
          accepted={termsAccepted}
          onToggle={(val) => setTermsAccepted(val)}
        />
      </main>

      {/* 10. Sticky Bottom CTA Bar */}
      <StickyContinueBar
        grandTotal={grandTotal}
        isDisabled={!termsAccepted}
        onOpenPriceBreakdown={() => setPriceBreakdownOpen(true)}
        isBreakdownOpen={priceBreakdownOpen}
        onContinue={handleContinue}
      />

      {/* Price Summary Modal */}
      {priceBreakdownOpen && (
        <PriceSummary
          basePrice={numericBasePrice}
          travelerCount={totalTravelers}
          insurancePrice={insurancePrice}
          discountAmount={discountAmount}
          taxesAmount={taxesAmount}
          grandTotal={grandTotal}
          onClose={() => setPriceBreakdownOpen(false)}
        />
      )}
    </div>
  );
};

export default TravelerDetailsPage;
