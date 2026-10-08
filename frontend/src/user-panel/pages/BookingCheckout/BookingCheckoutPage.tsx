import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Headphones, AlertTriangle } from 'lucide-react';
import { usePackage } from '../../hooks/usePackage';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { bookingService } from '../../services/booking.service';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const queryDepartureId = searchParams.get('departureId');
  const queryDate = searchParams.get('date');

  const { showToast } = useToast();
  const { user } = useAuth();
  const { packageId, id } = useParams<{ packageId?: string; id?: string }>();
  const targetId = packageId || id || 'package-001';

  const { pkg, loading } = usePackage(targetId);

  const [activeSection, setActiveSection] = useState<'traveler' | 'review' | 'payment'>('traveler');

  const [travelerData, setTravelerData] = useState<TravelerSectionData>({
    leadTraveler: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      gender: 'Male',
      dob: '',
      idProofType: 'Aadhaar Card',
      idProofNumber: '',
      address: user?.location || '',
      medicalNotes: '',
      travelPreferences: '',
      specialRequests: '',
    },
    additionalTravelers: [],
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
    medicalNotes: '',
    travelPreferences: '',
    specialRequests: '',
  });

  const [bookingSummary, setBookingSummary] = useState<BookingSummaryData>({
    pickupPoint: '',
    dropPoint: '',
    tripDuration: '',
    departureDate: '',
    returnDate: '',
    includedServices: [],
    excludedServices: [],
    cancellationPolicy: '',
    termsAccepted: false,
  });

  const [isInsuranceSelected, setIsInsuranceSelected] = useState(false);

  const [promoCode, setPromoCode] = useState<PromoCodeData>({
    code: '',
    discountAmount: 0,
    isApplied: false,
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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

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

  const selectedPkg = pkg;

  const allDepartures = React.useMemo(() => {
    if (!pkg) return [];
    if (pkg.departures && pkg.departures.length > 0) return pkg.departures;
    if (pkg.departure) return [pkg.departure];
    return [];
  }, [pkg]);

  useEffect(() => {
    if (!pkg || allDepartures.length === 0) return;

    let matched = allDepartures.find((d) => d.departureId === queryDepartureId || (d as any).id === queryDepartureId);
    if (!matched && queryDate) {
      matched = allDepartures.find((d) => d.departureDate.startsWith(queryDate));
    }
    if (!matched && bookingSummary.departureId) {
      matched = allDepartures.find((d) => d.departureId === bookingSummary.departureId || (d as any).id === bookingSummary.departureId);
    }
    if (!matched) {
      matched = allDepartures.find((d) => {
        const available = d.availableSeats !== undefined ? d.availableSeats : Math.max(0, d.capacity - (d.bookedSeats || 0));
        return (d.status === 'OPEN' || !d.status) && available > 0 && d.isSelectable !== false;
      }) || allDepartures[0];
    }

    if (matched) {
      setBookingSummary((prev) => ({
        ...prev,
        departureId: matched.departureId || (matched as any).id,
        departureDate: matched.departureDate ? matched.departureDate.split('T')[0] : prev.departureDate,
        returnDate: matched.endDate ? matched.endDate.split('T')[0] : prev.returnDate,
        tripDuration: pkg.duration || prev.tripDuration,
        pickupPoint: prev.pickupPoint || pkg.startLocation || 'Arrival Hub Pickup Point',
        dropPoint: prev.dropPoint || pkg.endLocation || 'Departure Hub Drop Point',
        includedServices: pkg.includes || prev.includedServices,
        excludedServices: pkg.excludes || prev.excludedServices,
        cancellationPolicy: 'Free cancellation up to 7 days before departure.',
      }));
    }
  }, [pkg, allDepartures, queryDepartureId, queryDate]);

  const selectedDep = React.useMemo(() => {
    if (allDepartures.length === 0) return null;
    return allDepartures.find((d) => d.departureId === bookingSummary.departureId || (d as any).id === bookingSummary.departureId) || allDepartures[0];
  }, [allDepartures, bookingSummary.departureId]);

  const totalTravelersCount =
    travelerData.selectedTravelerIds && travelerData.selectedTravelerIds.length > 0
      ? travelerData.selectedTravelerIds.length
      : 1 + travelerData.additionalTravelers.length;

  const isDepartureUnavailable = React.useMemo(() => {
    if (!selectedDep) return true;
    const available = selectedDep.availableSeats !== undefined
      ? selectedDep.availableSeats
      : Math.max(0, selectedDep.capacity - (selectedDep.bookedSeats || 0));
    const isSoldOut = selectedDep.status === 'SOLDOUT' || available < totalTravelersCount;
    const isClosed = selectedDep.status === 'BOOKING_CLOSED' || selectedDep.status === 'COMPLETED';
    const isPast = new Date(selectedDep.departureDate).getTime() < Date.now();
    return isSoldOut || isClosed || isPast || selectedDep.isSelectable === false;
  }, [selectedDep, totalTravelersCount]);

  const handleSelectAlternativeDeparture = (dep: any) => {
    const depId = dep.departureId || dep.id;
    const depDate = dep.departureDate ? dep.departureDate.split('T')[0] : '';
    const retDate = dep.endDate ? dep.endDate.split('T')[0] : '';
    setBookingSummary((prev) => ({
      ...prev,
      departureId: depId,
      departureDate: depDate,
      returnDate: retDate,
    }));
    setSearchParams({ departureId: depId, date: depDate });
    showToast(`Updated departure date to ${new Date(dep.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`, 'success');
  };

  const basePricePerPerson = selectedPkg?.price ? (parseInt(selectedPkg.price.replace(/[^0-9]/g, '')) || 24998) : 24998;
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

  const handleProceedPayment = async () => {
    if (isProcessingPayment || !selectedPkg) return;

    if (!stepCompletion.travelerDetails) {
      showToast('Please complete and save Traveler Details in Section 1.', 'error');
      scrollToSection('section-traveler');
      return;
    }

    if (isDepartureUnavailable || !selectedDep) {
      showToast('This departure is no longer available. Please select another departure date in Section 2.', 'error');
      scrollToSection('section-review');
      return;
    }

    if (!bookingSummary.termsAccepted) {
      showToast('Please accept the Terms & Conditions in Section 2.', 'error');
      scrollToSection('section-review');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);

    // Ensure Razorpay SDK is available
    const ensureRazorpayLoaded = (): Promise<boolean> => {
      return new Promise((resolve) => {
        if ((window as any).Razorpay) return resolve(true);
        const existingScript = document.getElementById('razorpay-sdk');
        if (existingScript) {
          existingScript.onload = () => resolve(true);
          existingScript.onerror = () => resolve(false);
          return;
        }
        const script = document.createElement('script');
        script.id = 'razorpay-sdk';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    try {
      const checkoutPayload = {
        packageId: targetId,
        departureId: bookingSummary.departureId || selectedDep?.departureId,
        travelerIds: travelerData.selectedTravelerIds,
        departureDate: bookingSummary.departureDate || selectedDep?.departureDate,
        startDate: bookingSummary.departureDate || selectedDep?.departureDate,
        endDate: bookingSummary.returnDate || selectedDep?.endDate,
        leadTraveler: travelerData.leadTraveler,
        travelers: [
          {
            name: travelerData.leadTraveler.fullName,
            email: travelerData.leadTraveler.email,
            phone: travelerData.leadTraveler.phone,
            gender: travelerData.leadTraveler.gender,
            isPrimary: true,
          },
          ...travelerData.additionalTravelers.map((c) => ({
            name: c.fullName,
            gender: c.gender,
            dob: c.dob,
            idProofType: c.idProofType,
            idProofNumber: c.idProofNumber,
            isPrimary: false,
          })),
        ],
        promoCode: promoCode.isApplied ? promoCode.code : undefined,
        pickupPoint: bookingSummary.pickupPoint,
        dropPoint: bookingSummary.dropPoint,
        emergencyContact: travelerData.emergencyContact,
      };

      const result = await bookingService.checkout(checkoutPayload);
      const bookingIdToUse = result.bookingId;

      const isLoaded = await ensureRazorpayLoaded();
      if (!isLoaded || !(window as any).Razorpay) {
        throw new Error('Razorpay secure checkout script could not be loaded. Please check your internet connection.');
      }

      const rzpOrder = (result as any).razorpayOrder || {};
      const rzpKey = rzpOrder.key || (result as any).razorpayKeyId || (result as any).key;
      const rzpOrderId = rzpOrder.orderId || rzpOrder.id || (result as any).orderId;
      const orderAmount = rzpOrder.amount || (result.orderSummary?.grandTotal || totalPayable) * 100;
      const orderCurrency = rzpOrder.currency || 'INR';

      if (!rzpKey || !rzpOrderId) {
        throw new Error('Unable to create Razorpay payment order. Please try again.');
      }

      const options = {
        key: rzpKey,
        amount: orderAmount,
        currency: orderCurrency,
        name: 'ApnaTrip',
        description: `${selectedPkg.title} Booking Confirmation`,
        image: selectedPkg.coverImage || 'https://cdn-icons-png.flaticon.com/512/201/201623.png',
        order_id: rzpOrderId,
        handler: async function (response: any) {
          try {
            setIsProcessingPayment(true);
            showToast('Verifying payment signature with ApnaTrip...', 'info');

            const verifyResult = await bookingService.verifyPayment({
              bookingId: bookingIdToUse,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            localStorage.removeItem(`apnatrip_checkout_${targetId}`);
            showToast('Payment verified successfully! Your trip is confirmed.', 'success');

            navigate(`/booking/success/${bookingIdToUse}`, {
              state: {
                bookingId: bookingIdToUse,
                paymentId: response.razorpay_payment_id,
                transactionId: response.razorpay_payment_id,
                pkg: selectedPkg,
                totalAmount: totalPayable,
                travelerData,
                invoiceNumber: (verifyResult as any).invoiceNumber,
              },
            });
          } catch (vErr: any) {
            console.error('Payment verification failed:', vErr);
            const msg = vErr.message || 'Payment signature verification failed. Please contact support.';
            setPaymentError(msg);
            showToast(msg, 'error');
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: travelerData.leadTraveler.fullName || user?.name || '',
          email: travelerData.leadTraveler.email || user?.email || '',
          contact: travelerData.leadTraveler.phone || user?.phone || '',
        },
        notes: {
          bookingId: bookingIdToUse,
          packageId: targetId,
        },
        theme: {
          color: '#2563EB',
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
            showToast('Payment checkout was closed. Your booking is saved in pending state and can be retried.', 'info');
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on('payment.failed', function (resp: any) {
        setIsProcessingPayment(false);
        const reason = resp.error?.description || resp.error?.reason || 'Payment failed';
        setPaymentError(`Payment failed: ${reason}`);
        showToast(`Payment declined: ${reason}. Please try again or use another payment method.`, 'error');
      });

      rzp.open();
    } catch (err: any) {
      setIsProcessingPayment(false);
      console.error('Checkout error:', err);
      const rawMsg = err?.message || '';
      if (rawMsg.includes('departure is no longer available') || rawMsg.includes('no longer available')) {
        showToast('This departure is no longer available. Please select another departure date.', 'error');
        scrollToSection('section-review');
        return;
      }
      if (rawMsg.includes('PACKAGE_NOT_AVAILABLE') || rawMsg.includes('PACKAGE_NOT_BOOKABLE') || rawMsg.includes('departure is currently unavailable') || rawMsg.includes('currently unavailable')) {
        showToast('This package is currently unavailable.', 'error');
        navigate('/explore');
        return;
      }
      const errMsg = rawMsg || 'Failed to initiate checkout. Please try again.';
      setPaymentError(errMsg);
      showToast(errMsg, 'error');
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

  if (!pkg || !selectedPkg || pkg.isBookable === false) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-2xl shadow-xs">
          !
        </div>
        <h2 className="text-2xl font-black text-[#0F172A]">This package is currently unavailable.</h2>
        <p className="text-sm font-semibold text-slate-500 max-w-sm">
          This tour package is currently not available for booking. Please explore other available packages.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-extrabold text-xs shadow-2xs hover:bg-slate-50 cursor-pointer"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/explore')}
            className="px-5 py-2.5 rounded-xl bg-[#6356E5] text-white font-extrabold text-xs shadow-md hover:bg-[#5245d6] cursor-pointer"
          >
            Explore Packages
          </button>
        </div>
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
              requiresPassport: (selectedPkg as any).requiresPassport,
              requiresVisa: (selectedPkg as any).requiresVisa,
              requiresAadhaar: (selectedPkg as any).requiresAadhaar,
              requiresEmergencyContact: (selectedPkg as any).requiresEmergencyContact,
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
          availableDepartures={allDepartures}
          isDepartureUnavailable={isDepartureUnavailable}
          onSelectDeparture={handleSelectAlternativeDeparture}
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
          isLoading={isProcessingPayment}
          paymentError={paymentError}
          onProceedPayment={handleProceedPayment}
        />
      </main>

      {/* Sticky Payment Bar */}
      <StickyPaymentBar
        totalAmount={totalPayable}
        isDisabled={!(stepCompletion.travelerDetails && bookingSummary.termsAccepted) || isDepartureUnavailable}
        isLoading={isProcessingPayment}
        onOpenPriceBreakdown={() => setPriceBreakdownOpen(true)}
        isBreakdownOpen={priceBreakdownOpen}
        onPayClick={handleProceedPayment}
        buttonText={isDepartureUnavailable ? 'Select Available Departure' : 'Proceed to Payment'}
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
