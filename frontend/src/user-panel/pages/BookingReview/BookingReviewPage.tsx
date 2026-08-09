import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePackage } from '../../hooks/usePackage';

import { BookingProgress } from './components/BookingProgress';
import { PackageSummaryCard } from './components/PackageSummaryCard';
import { TravelerSummary } from './components/TravelerSummary';
import { EmergencyContactCard } from './components/EmergencyContactCard';
import { DocumentSummary } from './components/DocumentSummary';
import { SpecialRequestCard } from './components/SpecialRequestCard';
import { InsuranceSummary } from './components/InsuranceSummary';
import { CouponSummary } from './components/CouponSummary';
import { PriceBreakdown } from './components/PriceBreakdown';
import { CancellationPolicy } from './components/CancellationPolicy';
import { SecureCheckoutCard } from './components/SecureCheckoutCard';
import { TermsSection } from './components/TermsSection';
import { StickyPaymentBar } from './components/StickyPaymentBar';
import { PriceSummary } from '../TravelerDetails/components/PriceSummary';

export const BookingReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { packageId, id } = useParams<{ packageId?: string; id?: string }>();
  const targetId = packageId || id || 'package-001';

  const { pkg, loading } = usePackage(targetId);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [priceBreakdownOpen, setPriceBreakdownOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#6356E5]/20 border-t-[#6356E5] rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-500">Loading booking review...</p>
      </div>
    );
  }

  const selectedPkg = pkg || {
    id: 'package-001',
    title: '7-Day Meghalaya Waterfall & Cave Trail',
    agencyName: 'Himalayan Explorers',
    agencyVerified: true,
    price: '₹24,998',
    duration: '7 Days / 6 Nights',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
  };

  // Fixed/Dynamic pricing figures matching approved UI
  const packagePrice = 24998;
  const taxes = 1499;
  const insurancePrice = 998;
  const discountAmount = 2000;
  const totalPayable = packagePrice + taxes + insurancePrice - discountAmount; // 25,495

  const handleProceedToPayment = () => {
    if (!termsAccepted) {
      alert('Please confirm that all details are correct and accept terms before proceeding.');
      return;
    }
    navigate(`/booking/payment/${selectedPkg.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5] pb-32">
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* 1. Header & Stepper */}
        <BookingProgress currentStep={2} />

        {/* 2. Package Summary Card */}
        <PackageSummaryCard pkg={selectedPkg as any} travelerCount={2} />

        {/* 3. Travelers Summary */}
        <TravelerSummary packageId={selectedPkg.id} travelers={[]} />

        {/* 4. Emergency Contact */}
        <EmergencyContactCard
          packageId={selectedPkg.id}
          name="Vikram Sharma"
          relationship="Brother"
          phone="+91 91234 56789"
        />

        {/* 5. Documents */}
        <DocumentSummary packageId={selectedPkg.id} />

        {/* 6. Special Requests */}
        <SpecialRequestCard packageId={selectedPkg.id} />

        {/* 7. Insurance & Coupon Side-by-Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InsuranceSummary insurancePrice={insurancePrice} />
          <CouponSummary couponCode="APNATRIP2000" discountAmount={discountAmount} />
        </div>

        {/* 8. Price Breakdown Card */}
        <PriceBreakdown
          packagePrice={packagePrice}
          taxes={taxes}
          insurancePrice={insurancePrice}
          discountAmount={discountAmount}
          totalAmount={totalPayable}
        />

        {/* 9. Cancellation Policy Accordion */}
        <CancellationPolicy />

        {/* 10. Secure Checkout Card */}
        <SecureCheckoutCard />

        {/* 11. Terms & Conditions */}
        <TermsSection
          accepted={termsAccepted}
          onToggle={(val) => setTermsAccepted(val)}
        />
      </main>

      {/* 12. Sticky Bottom Payment Bar */}
      <StickyPaymentBar
        totalPayable={totalPayable}
        isDisabled={!termsAccepted}
        onOpenPriceBreakdown={() => setPriceBreakdownOpen(true)}
        isBreakdownOpen={priceBreakdownOpen}
        onProceedToPayment={handleProceedToPayment}
      />

      {/* Price Breakdown Modal */}
      {priceBreakdownOpen && (
        <PriceSummary
          basePrice={packagePrice}
          travelerCount={2}
          insurancePrice={insurancePrice}
          discountAmount={discountAmount}
          taxesAmount={taxes}
          grandTotal={totalPayable}
          onClose={() => setPriceBreakdownOpen(false)}
        />
      )}
    </div>
  );
};

export default BookingReviewPage;
