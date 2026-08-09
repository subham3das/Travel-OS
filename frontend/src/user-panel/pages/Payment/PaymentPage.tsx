import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePackage } from '../../hooks/usePackage';

import { PaymentProgress } from './components/PaymentProgress';
import { OrderSummary } from './components/OrderSummary';
import { AmountSummary } from './components/AmountSummary';
import { RazorpayCard } from './components/RazorpayCard';
import { BillingAddress } from './components/BillingAddress';
import { SecuritySection } from './components/SecuritySection';
import { PolicyAccordion } from './components/PolicyAccordion';
import { TermsSection } from './components/TermsSection';
import { StickyPaymentBar } from './components/StickyPaymentBar';
import { PriceSummary } from '../TravelerDetails/components/PriceSummary';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { packageId, id } = useParams<{ packageId?: string; id?: string }>();
  const targetId = packageId || id || 'package-001';

  const { pkg, loading } = usePackage(targetId);

  const [termsAccepted, setTermsAccepted] = useState(true);
  const [priceBreakdownOpen, setPriceBreakdownOpen] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);

  // Dynamically load Razorpay SDK script if not loaded
  useEffect(() => {
    if (!document.getElementById('razorpay-sdk')) {
      const script = document.createElement('script');
      script.id = 'razorpay-sdk';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#6356E5]/20 border-t-[#6356E5] rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-500">Initializing payment gateway...</p>
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

  // Numerical figures matching approved UI
  const packagePrice = 24998;
  const taxes = 1499;
  const insurancePrice = 998;
  const discountAmount = 2000;
  const totalAmount = packagePrice + taxes + insurancePrice - discountAmount; // 25,495

  const handleRazorpayPayment = () => {
    if (!termsAccepted) {
      alert('Please agree to the Terms & Conditions before completing payment.');
      return;
    }

    setPaymentFailed(false);

    const bookingId = `BK-${Date.now().toString().slice(-6)}`;
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_APNATRIP123';

    if (window.Razorpay) {
      const options = {
        key: razorpayKey,
        amount: totalAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'ApnaTrip Travel OS',
        description: selectedPkg.title,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=200&auto=format&fit=crop',
        handler: function (response: any) {
          // Success callback -> navigate to success page
          navigate(`/booking/success/${bookingId}`, {
            state: {
              paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
              bookingId,
              pkg: selectedPkg,
              totalAmount,
            },
          });
        },
        prefill: {
          name: 'Rahul Sharma',
          email: 'rahulsharma@gmail.com',
          contact: '9876543210',
        },
        notes: {
          package_id: selectedPkg.id,
          booking_id: bookingId,
        },
        theme: {
          color: '#6356E5',
        },
        modal: {
          ondismiss: function () {
            // Modal closed without completing
            console.log('Payment modal dismissed');
          },
        },
      };

      try {
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on('payment.failed', function () {
          setPaymentFailed(true);
        });
        razorpayInstance.open();
      } catch (err) {
        console.error('Razorpay initialization error:', err);
        // Fallback simulation for dev environment if test key fails
        simulateFallbackPayment(bookingId);
      }
    } else {
      // Fallback simulation if script hasn't finished loading
      simulateFallbackPayment(bookingId);
    }
  };

  const simulateFallbackPayment = (bookingId: string) => {
    const confirmPay = window.confirm(
      `Launching Razorpay Secure Checkout for ₹${totalAmount.toLocaleString('en-IN')}.\n\nClick OK to simulate successful payment.`
    );
    if (confirmPay) {
      navigate(`/booking/success/${bookingId}`, {
        state: {
          paymentId: `pay_demo_${Date.now()}`,
          bookingId,
          pkg: selectedPkg,
          totalAmount,
        },
      });
    } else {
      setPaymentFailed(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#583BE8]/20 selection:text-[#583BE8] pb-12">
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* 1. Header & Stepper */}
        <PaymentProgress currentStep={3} />

        {paymentFailed && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-3xl space-y-2">
            <h3 className="text-sm font-extrabold flex items-center gap-2 text-rose-600">
              ⚠️ Payment Failed or Cancelled
            </h3>
            <p className="text-xs font-medium">
              We couldn't process your payment. Don't worry, no money was deducted. Please retry using Razorpay Checkout.
            </p>
            <button
              onClick={handleRazorpayPayment}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-700 cursor-pointer"
            >
              Retry Payment
            </button>
          </div>
        )}

        {/* 2. Order Summary Card */}
        <OrderSummary pkg={selectedPkg as any} travelerCount={2} />

        {/* 3. Amount Summary Card */}
        <AmountSummary
          packagePrice={packagePrice}
          taxes={taxes}
          insurancePrice={insurancePrice}
          discountAmount={discountAmount}
          couponCode="APNATRIP2000"
          totalAmount={totalAmount}
        />

        {/* 4. Razorpay Secure Checkout Trigger Card */}
        <RazorpayCard
          totalAmount={totalAmount}
          isDisabled={!termsAccepted}
          onPayClick={handleRazorpayPayment}
        />

        {/* 5. Billing Address */}
        <BillingAddress />

        {/* 6. Security Badges */}
        <SecuritySection />

        {/* 7. Cancellation & Refund Policies Accordion */}
        <PolicyAccordion />

        {/* 8. Terms & Conditions Checkbox */}
        <TermsSection
          accepted={termsAccepted}
          onToggle={(val) => setTermsAccepted(val)}
        />
      </main>

      {/* 9. Sticky Bottom Bar */}
      <StickyPaymentBar
        totalAmount={totalAmount}
        isDisabled={!termsAccepted}
        onOpenPriceBreakdown={() => setPriceBreakdownOpen(true)}
        isBreakdownOpen={priceBreakdownOpen}
        onPayClick={handleRazorpayPayment}
      />

      {/* Detailed Price Breakdown Modal */}
      {priceBreakdownOpen && (
        <PriceSummary
          basePrice={packagePrice}
          travelerCount={2}
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

export default PaymentPage;
