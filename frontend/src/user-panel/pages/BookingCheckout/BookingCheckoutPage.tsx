import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Headphones } from 'lucide-react';
import { usePackage } from '../../hooks/usePackage';
import { useToast } from '../../context/ToastContext';

import { 
  TravelerSectionData, BookingSummaryData, PromoCodeData, 
  PaymentSummaryData, InvoicePreview, StepCompletionStatus, 
  CollapsedSectionsState 
} from './types/checkout';

import { BookingStepper } from './components/BookingStepper';
import { StepSummaryCard } from './components/StepSummaryCard';
import { TravelerSection } from './components/TravelerSection';
import { ReviewSection } from './components/ReviewSection';
import { PaymentSection } from './components/PaymentSection';
import { StickyPaymentBar } from './components/StickyPaymentBar';
import { PriceBreakdown } from './components/PriceBreakdown';

export const BookingCheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { packageId, id } = useParams<{ packageId?: string; id?: string }>();
  const targetId = packageId || id || 'package-001';

  const { pkg, loading } = usePackage(targetId);

  const [activeSection, setActiveSection] = useState<'traveler' | 'review' | 'payment'>('traveler');

  const [travelerData, setTravelerData] = useState<TravelerSectionData>({
    leadTraveler: {
      fullName: 'Rahul Sharma',
      email: 'rahulsharma@gmail.com',
      phone: '+91 98765 43210',
      gender: 'Male',
      dob: '1994-08-15',
      idProofType: 'Aadhaar Card',
      idProofNumber: '9988-7766-5544',
      address: '123, MG Road, Shillong, Meghalaya',
      medicalNotes: '',
      travelPreferences: '',
      specialRequests: '',
    },
    additionalTravelers: [
      {
        id: 'comp-1',
        fullName: 'Ananya Sharma',
        gender: 'Female',
        dob: '1996-11-20',
        idProofType: 'Aadhaar Card',
        idProofNumber: '1122-3344-5566',
        emergencyContact: '+91 98765 43210',
        type: 'Adult',
      },
    ],
    emergencyContact: {
      name: 'Vikram Sharma',
      relationship: 'Brother',
      phone: '+91 91234 56789',
    },
    medicalNotes: '',
    travelPreferences: '',
    specialRequests: '',
  });

  const [bookingSummary, setBookingSummary] = useState<BookingSummaryData>({
    pickupPoint: 'Guwahati Airport (GAU) - 09:00 AM',
    dropPoint: 'Guwahati Airport (GAU) - 05:00 PM',
    tripDuration: '7 Days / 6 Nights',
    departureDate: '12 May, 2026',
    returnDate: '18 May, 2026',
    includedServices: [
      'All Stays in Handpicked Boutique Homestays & Resorts',
      'Daily Breakfast & Regional Dinner',
      'Private AC SUV Vehicle & Fuel',
      'Permits, Tolls & Entry Tickets',
      'Dedicated Certified Local Tour Guide',
    ],
    excludedServices: [
      'Personal Shopping & Alcoholic Beverages',
      'Airfare / Train Tickets to Guwahati',
      'Any optional adventure activities (Ziplining)',
    ],
    cancellationPolicy: '100% refund up to 7 days before departure. 50% refund up to 3 days. Non-refundable within 48 hours.',
    termsAccepted: false,
  });

  const [isInsuranceSelected, setIsInsuranceSelected] = useState(true);

  const [promoCode, setPromoCode] = useState<PromoCodeData>({
    code: 'APNATRIP2000',
    discountAmount: 2000,
    isApplied: true,
  });

  const [invoice, setInvoice] = useState<InvoicePreview>({
    invoiceNumber: 'INV-AT-2026-9988',
    transactionPreviewId: 'TXN-9988112233',
    issueDate: new Date().toLocaleDateString('en-IN'),
    status: 'DRAFT',
  });

  const [stepCompletion, setStepCompletion] = useState<StepCompletionStatus>({
    travelerDetails: false,
    review: false,
    termsAccepted: false,
  });

  const [collapsedSections, setCollapsedSections] = useState<CollapsedSectionsState>({
    travelerDetails: false,
    review: false,
  });

  const [priceBreakdownOpen, setPriceBreakdownOpen] = useState(false);

  // Auto-Restore State
  useEffect(() => {
    const savedStateStr = localStorage.getItem(`apnatrip_checkout_${targetId}`);
    if (savedStateStr) {
      try {
        const saved = JSON.parse(savedStateStr);
        if (saved.travelerData) setTravelerData(saved.travelerData);
        if (saved.bookingSummary) setBookingSummary(saved.bookingSummary);
        if (saved.promoCode) setPromoCode(saved.promoCode);
        if (saved.stepCompletion) setStepCompletion(saved.stepCompletion);
        if (saved.collapsedSections) setCollapsedSections(saved.collapsedSections);
        if (typeof saved.isInsuranceSelected === 'boolean') setIsInsuranceSelected(saved.isInsuranceSelected);
      } catch (err) {
        console.warn('Could not parse saved checkout state:', err);
      }
    }
  }, [targetId]);

  // Auto-Save State
  useEffect(() => {
    const stateToSave = {
      travelerData,
      bookingSummary,
      promoCode,
      stepCompletion,
      collapsedSections,
      isInsuranceSelected,
    };
    localStorage.setItem(`apnatrip_checkout_${targetId}`, JSON.stringify(stateToSave));
  }, [travelerData, bookingSummary, promoCode, stepCompletion, collapsedSections, isInsuranceSelected, targetId]);

  // Razorpay SDK Loader
  useEffect(() => {
    if (!document.getElementById('razorpay-sdk')) {
      const script = document.createElement('script');
      script.id = 'razorpay-sdk';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const selectedPkg = pkg || {
    id: targetId,
    title: '7-Day Meghalaya Waterfall & Cave Trail',
    agencyName: 'Himalayan Explorers',
    agencyVerified: true,
    price: '₹24,998',
    duration: '7 Days / 6 Nights',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    departureDate: '12 May, 2026',
  };

  const totalTravelersCount = 1 + travelerData.additionalTravelers.length;
  const basePricePerPerson = parseInt(selectedPkg.price.replace(/[^0-9]/g, '')) || 24998;
  const packageTotal = basePricePerPerson * totalTravelersCount;
  const insurancePrice = isInsuranceSelected ? totalTravelersCount * 499 : 0;
  const platformFees = 900;
  const taxes = Math.round(packageTotal * 0.05);
  const discountAmount = promoCode.isApplied ? promoCode.discountAmount : 0;
  const totalPayable = Math.max(0, packageTotal + platformFees + insurancePrice + taxes - discountAmount);

  const paymentSummary: PaymentSummaryData = {
    basePricePerPerson,
    travelerCount: totalTravelersCount,
    packageTotal,
    platformFees,
    insurancePrice,
    discountAmount,
    taxes,
    totalPayable,
  };

  const scrollToSection = (sectionId: 'section-traveler' | 'section-review' | 'section-payment') => {
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (sectionId === 'section-traveler') setActiveSection('traveler');
      else if (sectionId === 'section-review') setActiveSection('review');
      else if (sectionId === 'section-payment') setActiveSection('payment');
    }
  };

  const handleSaveTravelerDetails = (savedData: TravelerSectionData) => {
    setTravelerData(savedData);
    setStepCompletion((prev) => ({ ...prev, travelerDetails: true }));
    setCollapsedSections((prev) => ({ ...prev, travelerDetails: true }));
    
    setTimeout(() => {
      scrollToSection('section-review');
    }, 200);
  };

  const handleEditTravelerDetails = () => {
    setCollapsedSections((prev) => ({ ...prev, travelerDetails: false }));
    scrollToSection('section-traveler');
  };

  const handleToggleTerms = (accepted: boolean) => {
    setBookingSummary((prev) => ({ ...prev, termsAccepted: accepted }));
    setStepCompletion((prev) => ({
      ...prev,
      termsAccepted: accepted,
      review: accepted && prev.travelerDetails,
    }));
  };

  const handleApplyPromoCode = (code: string) => {
    if (code.trim().toUpperCase() === 'APNATRIP2000') {
      setPromoCode({ code: 'APNATRIP2000', discountAmount: 2000, isApplied: true, message: 'Promo applied!' });
      showToast('Promo code APNATRIP2000 applied (₹2,000 Off!)', 'success');
    } else if (code.trim().toUpperCase() === 'FIRST1000') {
      setPromoCode({ code: 'FIRST1000', discountAmount: 1000, isApplied: true, message: 'Promo applied!' });
      showToast('Promo code FIRST1000 applied (₹1,000 Off!)', 'success');
    } else {
      showToast('Invalid promo code. Try APNATRIP2000', 'error');
    }
  };

  const handleProceedPayment = () => {
    if (!stepCompletion.travelerDetails) {
      showToast('Please complete and save Traveler Details in Section 1.', 'error');
      scrollToSection('section-traveler');
      return;
    }

    if (!bookingSummary.termsAccepted) {
      showToast('Please accept the Terms & Conditions in Section 2.', 'error');
      scrollToSection('section-review');
      return;
    }

    const generatedBookingId = `BK-${Date.now().toString().slice(-6)}`;

    if ((window as any).Razorpay) {
      const options = {
        key: 'rzp_test_mock_key',
        amount: totalPayable * 100,
        currency: 'INR',
        name: 'ApnaTrip Travel OS',
        description: selectedPkg.title,
        image: selectedPkg.coverImage,
        handler: function () {
          localStorage.removeItem(`apnatrip_checkout_${targetId}`);
          navigate(`/booking/success/${generatedBookingId}`, {
            state: {
              bookingId: generatedBookingId,
              pkg: selectedPkg,
              totalAmount: totalPayable,
              travelerData,
            },
          });
        },
        prefill: {
          name: travelerData.leadTraveler.fullName,
          email: travelerData.leadTraveler.email,
          contact: travelerData.leadTraveler.phone,
        },
        theme: {
          color: '#583BE8',
        },
      };

      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch (err) {
        simulateFallbackPayment(generatedBookingId);
      }
    } else {
      simulateFallbackPayment(generatedBookingId);
    }
  };

  const simulateFallbackPayment = (bookingIdToUse: string) => {
    const confirmPay = window.confirm(
      `Launching Razorpay Secure Checkout for ₹${totalPayable.toLocaleString('en-IN')}.\n\nClick OK to simulate successful booking.`
    );
    if (confirmPay) {
      localStorage.removeItem(`apnatrip_checkout_${targetId}`);
      navigate(`/booking/success/${bookingIdToUse}`, {
        state: {
          bookingId: bookingIdToUse,
          pkg: selectedPkg,
          totalAmount: totalPayable,
          travelerData,
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#583BE8]/20 border-t-[#583BE8] rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-500">Initializing checkout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#583BE8]/20 selection:text-[#583BE8] pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100/90 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs select-none">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200/80 text-slate-800 flex items-center justify-center shadow-2xs hover:bg-slate-100 transition-all cursor-pointer focus:outline-none shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center flex-1 px-3">
          <h1 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight leading-none">
            Complete Your Booking
          </h1>
          <p className="text-[11px] font-extrabold text-slate-400 pt-0.5">
            Complete your booking in 3 simple steps
          </p>
        </div>

        <button
          type="button"
          onClick={() => showToast('Support team available 24/7! Call +91 98765 43210', 'info')}
          className="flex items-center gap-1 text-xs font-extrabold text-[#0F172A] hover:text-[#583BE8] transition-colors cursor-pointer shrink-0"
        >
          <Headphones className="w-4 h-4 text-[#0F172A]" />
          <span>Help</span>
        </button>
      </header>

      {/* Progress Stepper */}
      <BookingStepper
        stepCompletion={stepCompletion}
        activeSection={activeSection}
        onStepClick={scrollToSection}
      />

      {/* Main Checkout Container */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-5 pb-8 space-y-8">
        {/* Section 1: Traveler Details */}
        {collapsedSections.travelerDetails ? (
          <StepSummaryCard
            title="Traveler Details"
            section="traveler"
            data={travelerData}
            onEdit={handleEditTravelerDetails}
          />
        ) : (
          <TravelerSection
            packageData={{
              id: selectedPkg.id,
              title: selectedPkg.title,
              agencyName: selectedPkg.agencyName,
              agencyVerified: selectedPkg.agencyVerified ?? true,
              price: selectedPkg.price,
              duration: selectedPkg.duration,
              coverImage: selectedPkg.coverImage,
              departureDate: (selectedPkg as any).departureDate || '12 May, 2026',
            }}
            initialData={travelerData}
            isCollapsed={false}
            onSave={handleSaveTravelerDetails}
            onEdit={handleEditTravelerDetails}
          />
        )}

        {/* Section 2: Review Booking */}
        <ReviewSection
          travelerData={travelerData}
          bookingSummary={bookingSummary}
          promoCode={promoCode}
          paymentSummary={paymentSummary}
          isUnlocked={stepCompletion.travelerDetails}
          isInsuranceSelected={isInsuranceSelected}
          termsAccepted={bookingSummary.termsAccepted}
          onEditTravelers={handleEditTravelerDetails}
          onToggleInsurance={() => setIsInsuranceSelected(!isInsuranceSelected)}
          onApplyPromoCode={handleApplyPromoCode}
          onToggleTerms={handleToggleTerms}
        />

        {/* Section 3: Payment */}
        <PaymentSection
          paymentSummary={paymentSummary}
          invoice={invoice}
          stepCompletion={stepCompletion}
          termsAccepted={bookingSummary.termsAccepted}
          onProceedPayment={handleProceedPayment}
        />
      </main>

      {/* Sticky Payment Bar */}
      <StickyPaymentBar
        totalAmount={totalPayable}
        isDisabled={!(stepCompletion.travelerDetails && bookingSummary.termsAccepted)}
        onOpenPriceBreakdown={() => setPriceBreakdownOpen(true)}
        isBreakdownOpen={priceBreakdownOpen}
        onPayClick={handleProceedPayment}
        buttonText="Proceed to Payment"
      />

      {/* Detailed Price Breakdown Modal */}
      {priceBreakdownOpen && (
        <PriceBreakdown
          paymentSummary={paymentSummary}
          onClose={() => setPriceBreakdownOpen(false)}
        />
      )}
    </div>
  );
};

export default BookingCheckoutPage;
