import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CreditCard,
  QrCode,
  Sparkles,
  AlertCircle,
  User,
  Phone,
  Mail,
  ChevronRight,
  Info,
  Car,
  Bike,
  FileCheck,
  BadgeCheck,
  Edit2,
} from 'lucide-react';
import { Vehicle } from '../../types/carRental';
import { carRentalService } from '../../services/carRental.service';
import { travelProfileService, TravelProfileData } from '../../services/travelProfile.service';
import { apiClient } from '../../../services/apiClient';
import { useNavigate } from 'react-router-dom';

interface RentalBookingModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  defaultPickupDateTime?: string;
  defaultReturnDateTime?: string;
  defaultPickupLocation?: string;
}

export const RentalBookingModal: React.FC<RentalBookingModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  defaultPickupDateTime,
  defaultReturnDateTime,
  defaultPickupLocation,
}) => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [pickupLocation, setPickupLocation] = useState(
    defaultPickupLocation || vehicle?.pickupLocation || 'Main Hub / City Center'
  );
  const [pickupDateTime, setPickupDateTime] = useState(() => {
    if (defaultPickupDateTime) return defaultPickupDateTime;
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [returnDateTime, setReturnDateTime] = useState(() => {
    if (defaultReturnDateTime) return defaultReturnDateTime;
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(18, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });

  // Customer State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Phase 6: Verified Travel Profile State
  const [useProfileDetails, setUseProfileDetails] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<TravelProfileData | null>(null);
  const [isProfileVerified, setIsProfileVerified] = useState<boolean>(false);
  const [emergencyContact, setEmergencyContact] = useState<{ name: string; phone: string; relationship?: string } | undefined>(undefined);
  const [address, setAddress] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | undefined>(undefined);
  const [age, setAge] = useState<number | undefined>(undefined);

  // Payment State
  const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('full');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quote, setQuote] = useState<any>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Sync defaults
  useEffect(() => {
    if (defaultPickupLocation) setPickupLocation(defaultPickupLocation);
    else if (vehicle?.pickupLocation) setPickupLocation(vehicle.pickupLocation);
    if (defaultPickupDateTime) setPickupDateTime(defaultPickupDateTime);
    if (defaultReturnDateTime) setReturnDateTime(defaultReturnDateTime);
  }, [defaultPickupLocation, defaultPickupDateTime, defaultReturnDateTime, vehicle]);

  // Lock body scroll & prefill profile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(1);
      setBookingError(null);

      travelProfileService
        .getProfile()
        .then((res) => {
          if (res?.profile) {
            setProfileData(res.profile);
            const isVer = res.profile.verificationStatus === 'VERIFIED' || res.stats?.isVerified;
            setIsProfileVerified(Boolean(isVer));

            if (res.profile.fullName) setFullName(res.profile.fullName);
            if (res.profile.phone) setPhone(res.profile.phone);
            if (res.profile.email) setEmail(res.profile.email);
            if (res.profile.emergencyContact?.phone) {
              setEmergencyContact({
                name: res.profile.emergencyContact.name || 'Primary Contact',
                phone: res.profile.emergencyContact.phone,
                relationship: res.profile.emergencyContact.relationship,
              });
            }
            if (res.profile.address) setAddress(res.profile.address);
            if (res.profile.gender && res.profile.gender !== 'prefer_not_to_say') {
              setGender(res.profile.gender as any);
            }
            if (res.profile.dob) {
              const birthYear = new Date(res.profile.dob).getFullYear();
              if (!isNaN(birthYear)) {
                setAge(new Date().getFullYear() - birthYear);
              }
            }
          }
        })
        .catch((err) => {
          console.warn('Could not auto-fetch travel profile:', err);
        });
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fetch dynamic quote whenever vehicle or dates change
  useEffect(() => {
    if (!isOpen || !vehicle?.id || !pickupDateTime || !returnDateTime) return;
    let isMounted = true;
    const fetchQuote = async () => {
      setIsQuoting(true);
      setQuoteError(null);
      try {
        const res = await carRentalService.getRentalPriceEstimate(
          vehicle.id,
          pickupDateTime,
          returnDateTime
        );
        if (isMounted) {
          if (res.available === false) {
            setQuoteError(res.message || 'Vehicle is not available for these selected dates.');
            setQuote(null);
          } else {
            setQuote(res.pricing);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setQuoteError(err.response?.data?.message || 'Failed to calculate dynamic rental pricing.');
          setQuote(null);
        }
      } finally {
        if (isMounted) setIsQuoting(false);
      }
    };

    fetchQuote();
    return () => {
      isMounted = false;
    };
  }, [isOpen, vehicle?.id, pickupDateTime, returnDateTime]);

  if (!isOpen || !vehicle) return null;

  const isBike = vehicle.vehicleSubCategory === 'bike';
  const policies = vehicle.rentalPolicies || {
    securityDeposit: 2000,
    includedKmPerDay: 200,
    extraKmCharge: 10,
    fuelPolicy: 'same_to_same',
  };

  // Helper: Dynamic Razorpay checkout script loader
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

  const handleNextToCustomer = () => {
    if (quoteError) return;
    if (!pickupLocation.trim()) {
      setQuoteError('Please enter or select a pickup location.');
      return;
    }
    setStep(2);
  };

  const handleNextToPayment = () => {
    if (!fullName.trim()) {
      setBookingError('Please enter primary driver full name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setBookingError('Please enter a valid 10-digit mobile number.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setBookingError('Please enter a valid email address.');
      return;
    }
    setBookingError(null);
    setStep(3);
  };

  // Phase 5: Transactional Razorpay Payment Confirmation
  const handleConfirmRental = async () => {
    setIsProcessing(true);
    setBookingError(null);
    try {
      let bookingToUse = confirmedBooking;

      // 1. Transactionally create rental booking if not already existing
      if (!bookingToUse?.bookingId && !bookingToUse?._id) {
        const res = await carRentalService.createRentalBooking({
          carId: vehicle.id,
          pickupDateTime,
          returnDateTime,
          pickupLocation,
          dropLocation: pickupLocation,
          paymentType,
          customerName: fullName.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim(),
          specialNotes: notes.trim(),
          emergencyContact,
          address,
          gender,
          age,
        });

        if (!res) {
          throw new Error('Failed to reserve rental vehicle. Please try again.');
        }
        bookingToUse = res;
        setConfirmedBooking(res);
      }

      const bookingIdToPay = bookingToUse.bookingId || bookingToUse._id;

      // 2. Ensure Razorpay SDK is loaded
      const isLoaded = await ensureRazorpayLoaded();
      if (!isLoaded || !(window as any).Razorpay) {
        throw new Error('Razorpay secure checkout script could not be loaded. Please check your internet connection.');
      }

      // 3. Request order from production payment engine
      const orderRes = await apiClient.post<any>('/payments/create-order', {
        bookingId: bookingIdToPay,
        notes: {
          vehicleName: vehicle.name,
          pickupLocation,
          pickupDateTime,
          returnDateTime,
          type: 'SELF_DRIVE_RENTAL',
        },
      });

      const orderData = orderRes.data?.data || orderRes.data;
      if (!orderData?.key || !orderData?.orderId) {
        throw new Error(orderRes.data?.message || 'Unable to generate Razorpay order. Please try again.');
      }

      // 4. Launch Razorpay modal
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'ApnaTrip Self-Drive',
        description: `${vehicle.name} Rental (${quote?.durationHours || 24}h)`,
        image: vehicle.thumbnail || 'https://cdn-icons-png.flaticon.com/512/201/201623.png',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            setIsProcessing(true);
            const verifyRes = await apiClient.post<any>('/payments/verify', {
              bookingId: bookingIdToPay,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data?.success || verifyRes.data?.data?.verified || verifyRes.data?.verified) {
              setConfirmedBooking((prev: any) => ({
                ...prev,
                bookingStatus: 'CONFIRMED',
                paymentStatus: paymentType === 'deposit' ? 'DEPOSIT_PAID' : 'FULL_PAID',
                transactionId: response.razorpay_payment_id,
              }));
              setStep(4);
            } else {
              throw new Error(verifyRes.data?.message || 'Payment signature verification failed.');
            }
          } catch (vErr: any) {
            console.error('Rental payment verification failed:', vErr);
            setBookingError(vErr.response?.data?.message || vErr.message || 'Payment signature verification failed.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: fullName.trim(),
          email: email.trim(),
          contact: phone.trim(),
        },
        theme: {
          color: '#4F46E5',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setBookingError('Payment was not completed. You can retry payment below to secure your rental reservation.');
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        setIsProcessing(false);
        setBookingError(resp.error?.description || 'Payment failed. Please retry.');
      });
      rzp.open();
    } catch (err: any) {
      console.error('Rental booking error:', err);
      setBookingError(
        err.response?.data?.message ||
          err.message ||
          'Failed to reserve rental vehicle. Please try again.'
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden flex flex-col my-auto max-h-[92vh] text-[#0F172A] dark:text-slate-100"
      >
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              {isBike ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-white leading-tight">
                  Self-Drive {isBike ? 'Bike' : 'Car'} Rental
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                  Instant Confirm
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {vehicle.name} ({vehicle.brand}{vehicle.model ? ` ${vehicle.model}` : ''})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Step 1: Dates, Hub Location & Dynamic Quote */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Pickup & Return Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    Pickup Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={pickupDateTime}
                    onChange={(e) => setPickupDateTime(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 dark:text-white outline-none cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    Return Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={returnDateTime}
                    onChange={(e) => setReturnDateTime(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 dark:text-white outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Pickup Location Hub */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF4D6D]" />
                  Pickup & Drop Hub Location
                </label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="e.g. Airport Terminal 1, Station Road, City Center"
                  className="w-full bg-transparent font-semibold text-xs sm:text-sm text-slate-800 dark:text-white outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Quote Breakdown Card */}
              {isQuoting ? (
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 py-6">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Calculating optimal rental tier & live availability...
                </div>
              ) : quoteError ? (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{quoteError}</span>
                </div>
              ) : quote ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Duration:</span>
                      <span className="text-xs font-black text-slate-800 dark:text-white">
                        {quote.durationHours} Hours ({quote.pricingTierApplied.toUpperCase()} TIER)
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      Best Price Applied
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Base Rental ({quote.durationHours}h)</span>
                      <span className="font-bold text-slate-800 dark:text-white">₹{quote.baseRentalCharge.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>GST & State Taxes (5%)</span>
                      <span className="font-bold text-slate-800 dark:text-white">₹{quote.gstAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-indigo-600 dark:text-indigo-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Security Deposit (100% Refundable)
                      </span>
                      <span className="font-bold">₹{quote.securityDeposit.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between items-center text-sm font-black text-[#0F172A] dark:text-white">
                      <span>Total Payable Now</span>
                      <span className="text-base text-indigo-600 dark:text-indigo-400 font-extrabold">
                        ₹{quote.finalPayableAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Policies Snapshot */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40">
                  <span className="block text-slate-400 font-medium">Included KM</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {policies.includedKmPerDay} km/day (Extra: ₹{policies.extraKmCharge}/km)
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40">
                  <span className="block text-slate-400 font-medium">Fuel Policy</span>
                  <span className="font-bold capitalize text-slate-800 dark:text-slate-200">
                    {policies.fuelPolicy.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Driver & Customer Details (With Phase 6 One-Click Autofill) */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Phase 6: Verified Profile Banner */}
              {profileData && (
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <BadgeCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-indigo-950 dark:text-indigo-200">
                          One-Click Travel Profile
                        </span>
                        {isProfileVerified && (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        Autofilled credentials for seamless verification
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={useProfileDetails}
                      onChange={(e) => setUseProfileDetails(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">Use Profile</span>
                  </label>
                </div>
              )}

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Please provide details of the primary driver. You must present an original Driving
                  License & Govt ID proof during vehicle handover.
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    Full Legal Name (as per Driving License) *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-indigo-500" />
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-500" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="booking@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                {emergencyContact?.phone && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/10 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Emergency Contact
                    </span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {emergencyContact.name || 'Primary Contact'} • {emergencyContact.phone}
                      {emergencyContact.relationship ? ` (${emergencyContact.relationship})` : ''}
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Special Requests or Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Helmet needed for pillion rider / Child safety seat"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>

              {bookingError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Booking Review & Razorpay Payment Mode (Phase 7 Review Screen) */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Dossier Review */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-[#0F172A] dark:text-white tracking-wider">
                    Rental Summary
                  </h4>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Dates</span>
                  </button>
                </div>

                <div className="text-xs space-y-2 font-semibold text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vehicle:</span>
                    <strong className="text-[#0F172A] dark:text-white">{vehicle.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pickup Hub:</span>
                    <strong className="text-[#0F172A] dark:text-white text-right max-w-[220px] truncate">{pickupLocation}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Timeframe:</span>
                    <strong className="text-[#0F172A] dark:text-white text-right">
                      {new Date(pickupDateTime).toLocaleDateString()} to {new Date(returnDateTime).toLocaleDateString()}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lead Driver:</span>
                    <strong className="text-[#0F172A] dark:text-white">{fullName} ({phone})</strong>
                  </div>
                </div>
              </div>

              {/* Payment Mode Option */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block">
                  Select Payment Option
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType('full')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentType === 'full'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <span className="block text-xs font-black">Pay Full Amount</span>
                    <span className="block text-[10px] opacity-80">
                      ₹{quote?.finalPayableAmount.toLocaleString()} (Includes Deposit)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('deposit')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentType === 'deposit'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <span className="block text-xs font-black">Pay Deposit Only</span>
                    <span className="block text-[10px] opacity-80">
                      ₹{quote?.securityDeposit.toLocaleString()} (Rental at Pickup)
                    </span>
                  </button>
                </div>
              </div>

              {/* Payment Gateways */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">Production Payment Gateway</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: 'Razorpay UPI', icon: QrCode },
                    { id: 'card', label: 'Debit / Card', icon: CreditCard },
                    { id: 'netbanking', label: 'Net Banking', icon: FileCheck },
                  ].map((gw) => {
                    const Icon = gw.icon;
                    return (
                      <button
                        key={gw.id}
                        type="button"
                        onClick={() => setPaymentMethod(gw.id as any)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                          paymentMethod === gw.id
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{gw.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Terms Checklist */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Security deposit is refunded within 2 hours of vehicle return inspection.</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Zero cancellation fee if cancelled at least 6 hours before pickup.</span>
                </div>
              </div>

              {bookingError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Success Confirmed Screen */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#0F172A] dark:text-white">
                  Rental Reserved Successfully!
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Booking ID:{' '}
                  <span className="text-indigo-600 dark:text-indigo-400 font-black font-mono">
                    {confirmedBooking?.bookingId || confirmedBooking?.bookingReference || confirmedBooking?._id || 'APT-RENTAL'}
                  </span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-left text-xs space-y-2 border border-slate-100 dark:border-white/10">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Vehicle</span>
                  <span className="font-bold text-slate-800 dark:text-white">{vehicle.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Pickup Hub</span>
                  <span className="font-bold text-slate-800 dark:text-white">{pickupLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Security Deposit Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{quote?.securityDeposit || 2000} (Securely Escrowed)
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/bookings');
                  }}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  View in My Bookings
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Controls (Steps 1-3) */}
        {step < 4 && (
          <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step === 1 && (
              <button
                type="button"
                disabled={Boolean(quoteError) || isQuoting || !quote}
                onClick={handleNextToCustomer}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-black shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={handleNextToPayment}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Review &amp; Pay</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmRental}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black shadow-md shadow-emerald-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Connecting to Razorpay...</span>
                  </>
                ) : (
                  <>
                    <span>
                      Pay ₹{paymentType === 'full' ? quote?.finalPayableAmount.toLocaleString() : quote?.securityDeposit.toLocaleString()} via Razorpay
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RentalBookingModal;
