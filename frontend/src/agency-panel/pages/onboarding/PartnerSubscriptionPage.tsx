import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  Tag,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Building2,
  Car,
  Printer,
  Lock,
  RotateCcw,
  Clock,
  Sparkles,
  FileCheck,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { agencyApiClient } from '../../services/agencyApiClient';
import { useAgencyAuthContext } from '../../services/agencyAuth.service';
import { registrationDraftClient } from '../../services/registrationDraftClient.service';


declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const PartnerSubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { agency, agencyUser, refreshAgencyProfile } = useAgencyAuthContext();
  const initialType = (searchParams.get('type') === 'car_rental' || agency?.activeBusiness === 'car_rental')
    ? 'car_rental' : 'agency';

  const [businessType, setBusinessType] = useState<'agency' | 'car_rental'>(initialType);
  const draftId =
    searchParams.get('draftId') ||
    registrationDraftClient.getStoredDraftId() ||
    localStorage.getItem('apnatrip_active_registration_draft_id') ||
    localStorage.getItem('apnatrip_current_registration_draft_id') ||
    undefined;

  // Partner details — read-only from auth session (no re-entry needed)
  const partnerName = agencyUser?.name || agency?.name || '';
  const email = agency?.loginEmail || agencyUser?.email || agency?.email || '';
  const phone = agencyUser?.phone || agency?.phone || '';

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Payment & Checkout State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  const basePrice = 1000;
  const discountAmount = appliedCoupon?.discount || 0;
  const finalPrice = Math.max(0, basePrice - discountAmount);

  // Redirect to waiting/verification page once payment is verified (after 2s for UX)
  useEffect(() => {
    if (successData) {
      refreshAgencyProfile().then(() => {
        setTimeout(() => navigate('/agency/verification-pending'), 2000);
      });
    }
  }, [successData, refreshAgencyProfile, navigate]);

  // Dynamically load Razorpay SDK
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Apply Coupon Handler
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError(null);

    try {
      const platform = businessType === 'car_rental' ? 'car_rental_subscription' : 'agency_subscription';
      const res: any = await agencyApiClient.post('/coupons/apply', {
        code: couponCode.trim(),
        platform,
        amount: basePrice,
        userEmail: email.trim() || undefined,
        businessType,
      }, { requiresAuth: false });

      if (res.data?.isValid) {
        setAppliedCoupon(res.data);
        setCouponError(null);
      } else {
        setCouponError(res.message || 'Coupon Invalid');
        setAppliedCoupon(null);
      }
    } catch (err: any) {
      setCouponError(err?.response?.data?.message || err?.message || 'Coupon Invalid');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  // Razorpay Checkout — uses authenticated agency session
  const handleCheckout = async () => {
    if (!partnerName || !email || !phone) {
      setCheckoutError('Account details incomplete. Please return to registration and ensure your profile is filled.');
      return;
    }

    setIsProcessingPayment(true);
    setCheckoutError(null);

    try {
      // 1. Create order via authenticated endpoint (JWT auto-sent)
      const orderRes: any = await agencyApiClient.post('/subscriptions/create-order', {
        businessType,
        couponCode: appliedCoupon?.code,
        draftId,
      }, { requiresAuth: true });

      const orderData = orderRes.data;
      if (!orderData?.subscriptionId) {
        throw new Error('Could not initialize subscription payment order.');
      }
      if (!orderData.keyId) {
        throw new Error('Payment gateway configuration is missing. Please contact support.');
      }

      // Load official Razorpay SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection and retry.');
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100, // in paise
        currency: 'INR',
        name: 'ApnaTrip Partner Network',
        description: `${businessType === 'car_rental' ? 'Car Rental' : 'Travel Agency'} Registration Fee`,
        order_id: orderData.orderId.startsWith('order_') ? orderData.orderId : undefined,
        prefill: {
          name: partnerName,
          email,
          contact: phone,
        },
        theme: {
          color: '#583BE8',
        },
        handler: async (response: any) => {
          try {
            // 2. Cryptographic Verification — authenticated
            const verifyRes: any = await agencyApiClient.post('/subscriptions/verify-payment', {
              subscriptionId: orderData.subscriptionId,
              orderId: response.razorpay_order_id || orderData.orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              draftId,
            }, { requiresAuth: true });

            // 3. Finalize Registration Submission with Draft
            if (draftId) {
              try {
                await registrationDraftClient.submitRegistration({
                  draftId,
                  subscriptionId: orderData.subscriptionId,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id || orderData.orderId,
                });
              } catch (regSubmitErr) {
                console.warn('Frontend submitRegistration fallback:', regSubmitErr);
              }
            }

            const verifyData = verifyRes.data || {};
            setSuccessData({
              referenceNumber: verifyData.subscriptionId || orderData.subscriptionId,
              applicationId: verifyData.subscriptionId,
              paymentId: response.razorpay_payment_id,
              invoiceNumber: verifyData.invoiceNumber,
              amountPaid: finalPrice,
              businessName: agency?.name || partnerName,
              businessType,
              serviceType: businessType === 'car_rental' ? 'Car Rental' : 'Travel Agency',
            });
          } catch (postPayErr: any) {
            setCheckoutError(postPayErr?.message || 'Payment received but verification failed. Our support team has been notified.');
          } finally {
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
            setCheckoutError('Payment cancelled. Your onboarding details remain safely saved in your registration draft.');
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', (resp: any) => {
        setIsProcessingPayment(false);
        const reason = resp.error?.description || 'Payment was declined by bank or gateway.';
        setCheckoutError(`Payment Failed: ${reason}. Your onboarding form is safely saved.`);
      });
      razorpayInstance.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setCheckoutError(err?.message || 'Failed to initiate payment. Please retry.');
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans select-none">
      {/* ── Top Brand Header ── */}
      <header className="w-full bg-white border-b border-slate-100 py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/agency')}>
            <div className="w-9 h-9 rounded-2xl bg-[#583BE8] flex items-center justify-center shadow-md shadow-[#583BE8]/25 shrink-0">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21.5C12 21.5 19 15.5 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15.5 12 21.5 12 21.5Z"
                  fill="white"
                  fillOpacity="0.25"
                />
                <circle cx="12" cy="9.5" r="3.5" stroke="white" strokeWidth="1.8" />
                <path d="M12 7.5L13.5 11L12 10L10.5 11L12 7.5Z" fill="white" />
              </svg>
            </div>
            <span className="text-xl font-black text-[#0F172A] tracking-tight">
              Apna<span className="text-[#583BE8]">Trip</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate(businessType === 'car_rental' ? '/agency/onboarding/car-rental' : '/agency/onboarding/business')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#583BE8] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Business Onboarding</span>
          </button>
        </div>
      </header>

      {/* ── Main Checkout Content ── */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-8 space-y-8">
        {/* Title & Badge */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-[#583BE8] text-xs font-black uppercase tracking-wider">
            {businessType === 'car_rental' ? <Car className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
            <span>{businessType === 'car_rental' ? 'Car Rental Partner' : 'Travel Agency Partner'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            ApnaTrip Partner Registration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Complete your one-time registration fee to activate your application.
          </p>
        </div>

        {checkoutError && (
          <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{checkoutError}</span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-[11px] flex items-center gap-1 cursor-pointer shrink-0 transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry Payment</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
          {/* LEFT COLUMN: Partner Details & Subscription Benefits (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Contact Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-2xs space-y-4">
              <h2 className="text-base font-black text-[#0F172A] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-[#583BE8] flex items-center justify-center text-xs font-black">
                  1
                </span>
                <span>Verified Partner Identity</span>
              </h2>

              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <User className="w-4 h-4 text-[#583BE8] shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Partner Name</p>
                    <p className="text-sm font-black text-[#0F172A]">{partnerName || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <Mail className="w-4 h-4 text-[#583BE8] shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Email</p>
                    <p className="text-sm font-black text-[#0F172A]">{email || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <Phone className="w-4 h-4 text-[#583BE8] shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-black text-[#0F172A]">{phone || '—'}</p>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 text-center pt-1">
                  Details inherited from your verified partner account
                </p>
              </div>
            </div>

            {/* Benefits Checklist Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-[#0F172A] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
                    ✓
                  </span>
                  <span>Partner Benefits</span>
                </h2>
                <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#583BE8] text-[10px] font-black uppercase">
                  Verified Partner
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Partner Badge</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dashboard Access</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Customer Management</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Booking Management</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Analytics & Reports</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct Customer Messaging</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Future Feature Updates</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Official GST Tax Invoice</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary & Payment (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-2xs space-y-5 sticky top-6">
              <h2 className="text-base font-black text-[#0F172A] pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Registration Fee</span>
                <span className="text-[10px] font-extrabold text-[#583BE8] bg-purple-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  One-Time Fee
                </span>
              </h2>

              {/* Coupon Section */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#583BE8]" />
                  <span>Coupon Code</span>
                </label>

                {!appliedCoupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SAVE20"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-black uppercase text-slate-800 placeholder:normal-case placeholder:font-normal focus:outline-hidden focus:ring-2 focus:ring-[#583BE8]/20 focus:border-[#583BE8]"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black cursor-pointer transition-colors disabled:opacity-50 flex items-center gap-1 shrink-0"
                    >
                      {couponLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Apply</span>}
                    </button>
                  </form>
                ) : (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-emerald-800 uppercase">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-[10px] font-extrabold bg-emerald-200/70 text-emerald-800 px-1.5 py-0.5 rounded-md">
                          Coupon Applied
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-emerald-700">
                        {appliedCoupon.type === 'percentage'
                          ? `-${appliedCoupon.percentage}% Discount (Saved ₹${appliedCoupon.discount})`
                          : `-₹${appliedCoupon.discount} Discount Applied`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs font-black text-rose-600 hover:text-rose-700 cursor-pointer p-1"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="text-xs font-bold text-rose-600 mt-1">
                    ✕ {couponError}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Registration Fee</span>
                  <span className="font-extrabold text-[#0F172A]">₹{basePrice.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>GST</span>
                  <span className="text-slate-400 font-bold">₹0</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-black text-[#0F172A]">Total</span>
                  <div className="text-right">
                    {discountAmount > 0 && (
                      <span className="text-xs text-slate-400 line-through font-bold block">
                        ₹{basePrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span className="text-2xl font-black text-[#583BE8]">
                      ₹{finalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Razorpay Action Button */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessingPayment}
                className="w-full py-4 px-6 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] active:scale-[0.99] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#583BE8]/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Continue to Razorpay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit SSL Encrypted • Razorpay Certified</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── STEP 7: Application Submitted & Payment Success Screen ── */}
      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md select-none overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 text-center my-8"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-black shadow-lg shadow-emerald-500/20">
              ✓
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-black text-[#0F172A]">Application Submitted</h3>
              <p className="text-sm font-semibold text-emerald-600">
                Thank you. Your payment has been received.
              </p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Your {successData.serviceType} Registration has been submitted for review.
              </p>
            </div>

            {/* Reference Number Box */}
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
                Reference Number
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-[#583BE8] tracking-wider">
                {successData.referenceNumber}
              </div>
            </div>

            {/* Details Table */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600 space-y-2.5 text-left">
              <div className="flex justify-between">
                <span>Business Name:</span>
                <span className="font-extrabold text-[#0F172A]">{successData.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span>Invoice Number:</span>
                <span className="font-extrabold text-[#0F172A]">{successData.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Reference:</span>
                <span className="font-mono text-[#583BE8] font-bold">{successData.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-black text-emerald-700">₹{successData.amountPaid?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Review:</span>
                <span className="font-bold text-[#0F172A]">24–48 Hours</span>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-700 font-bold leading-relaxed flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>Redirecting you to application review status in a moment...</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/agency/verification-pending')}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#583BE8]/25 cursor-pointer"
              >
                <span>View Application Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PartnerSubscriptionPage;
