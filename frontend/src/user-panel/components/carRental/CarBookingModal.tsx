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
  Banknote,
  ArrowRight,
  Sparkles,
  AlertCircle,
  User,
  Phone,
  Mail,
  FileText,
  ChevronRight,
  Info,
  BadgeCheck,
  RotateCcw,
  Edit2,
  Users,
} from 'lucide-react';
import { Vehicle, TripType, CarRentalBooking } from '../../types/carRental';
import { carRentalService } from '../../services/carRental.service';
import { travelProfileService, TravelProfileData } from '../../services/travelProfile.service';
import { apiClient } from '../../../services/apiClient';
import { useNavigate } from 'react-router-dom';
import { CarRentalTimePicker } from './CarRentalTimePicker';

interface CarBookingModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  defaultPickup?: string;
  defaultDrop?: string;
  defaultDate?: string;
  defaultTripType?: TripType;
  defaultRouteId?: string;
  defaultRoutePrice?: number;
}

export const CarBookingModal: React.FC<CarBookingModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  defaultPickup = '',
  defaultDrop = '',
  defaultDate = '',
  defaultTripType = 'one_way',
  defaultRouteId,
  defaultRoutePrice,
}) => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [pickup, setPickup] = useState(defaultPickup);
  const [drop, setDrop] = useState(defaultDrop);
  const [travelDate, setTravelDate] = useState(
    defaultDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [tripType, setTripType] = useState<TripType>(defaultTripType);
  const [passengersCount, setPassengersCount] = useState<number>(2);

  // Form Validation Errors
  const [errorStep1, setErrorStep1] = useState<string | null>(null);
  const [errorStep2, setErrorStep2] = useState<string | null>(null);

  // Traveller Details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Phase 6: One-Click Booking Profile state
  const [useProfileDetails, setUseProfileDetails] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<TravelProfileData | null>(null);
  const [isProfileVerified, setIsProfileVerified] = useState<boolean>(false);
  const [emergencyContact, setEmergencyContact] = useState<{ name: string; phone: string; relationship?: string } | undefined>(undefined);
  const [address, setAddress] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | undefined>(undefined);
  const [age, setAge] = useState<number | undefined>(undefined);

  // Payment Selection & Razorpay Processing
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'pay_on_pickup'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<CarRentalBooking | null>(null);

  // Sync defaults
  useEffect(() => {
    if (defaultPickup) setPickup(defaultPickup);
    if (defaultDrop) setDrop(defaultDrop);
    if (defaultDate) setTravelDate(defaultDate);
    if (defaultTripType) setTripType(defaultTripType);
  }, [defaultPickup, defaultDrop, defaultDate, defaultTripType]);

  // Phase 6: Autofill from verified Travel Profile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setErrorStep1(null);
      setErrorStep2(null);
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

  if (!vehicle) return null;

  const matchedRoute =
    (defaultRouteId && vehicle.routes?.find((r) => r._id === defaultRouteId || r.id === defaultRouteId)) ||
    vehicle.routes?.find(
      (r) =>
        r.pickup.toLowerCase() === pickup.trim().toLowerCase() &&
        r.destination.toLowerCase() === drop.trim().toLowerCase()
    ) ||
    vehicle.matchedRoute ||
    null;

  const routeFare =
    tripType === 'round_trip' && matchedRoute?.pricing?.roundTripPrice
      ? matchedRoute.pricing.roundTripPrice
      : (matchedRoute?.pricing?.oneWayPrice ?? matchedRoute?.price);

  const fixedPrice =
    routeFare ||
    defaultRoutePrice ||
    vehicle.routePrice ||
    vehicle.pricing.fixedPrice ||
    vehicle.pricing.basePricePerDay;

  const totalAmount = fixedPrice;
  const tokenDepositAmount = Math.min(300, fixedPrice);
  const remainingCashAmount = Math.max(0, fixedPrice - tokenDepositAmount);

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

  // Step 1 Validation
  const handleNextFromStep1 = () => {
    if (!pickup.trim()) {
      setErrorStep1('Please enter your pickup location.');
      return;
    }
    if (!drop.trim()) {
      setErrorStep1('Please enter your destination / drop location.');
      return;
    }
    if (!travelDate) {
      setErrorStep1('Please choose a valid travel date.');
      return;
    }
    setErrorStep1(null);
    setStep(2);
  };

  // Step 2 Validation
  const handleNextFromStep2 = () => {
    if (!fullName.trim()) {
      setErrorStep2("Please enter the primary traveller's full name.");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim() || cleanPhone.length < 10) {
      setErrorStep2('Please enter a valid 10-digit mobile number.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorStep2('Please enter a valid email address.');
      return;
    }
    setErrorStep2(null);
    setStep(3);
  };

  // Phase 5: Live Razorpay Integration & Transactional Confirmation
  const handleProceedToPayment = async () => {
    setIsProcessing(true);
    setBookingError(null);
    try {
      let bookingToUse = createdBooking;

      // 1. Transactionally create booking if not already created (or retry)
      if (!bookingToUse?.id) {
        const depositPaid = paymentMethod === 'pay_on_pickup' ? tokenDepositAmount : totalAmount;
        const res = await carRentalService.createBooking({
          vehicleId: vehicle.id,
          routeId: matchedRoute?._id || matchedRoute?.id || defaultRouteId,
          vehicleName: vehicle.name,
          vehicleImage: vehicle.thumbnail,
          providerId: vehicle.provider.id,
          providerName: vehicle.provider.name,
          pickupLocation: pickup.trim(),
          dropLocation: drop.trim(),
          startDate: travelDate,
          endDate: travelDate,
          pickupTime,
          tripType,
          passengersCount,
          customerName: fullName.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim(),
          specialRequests: specialRequests.trim(),
          fixedPrice,
          remainingAmount: paymentMethod === 'pay_on_pickup' ? remainingCashAmount : 0,
          totalAmount,
          depositPaid,
          paymentMethod,
          emergencyContact,
          address,
          gender,
          age,
        });

        if (!res.booking || !res.booking.id) {
          throw new Error('Failed to reserve vehicle. Please check connection and try again.');
        }
        bookingToUse = res.booking;
        setCreatedBooking(res.booking);
      }

      // 2. Ensure Razorpay checkout script is loaded
      const isLoaded = await ensureRazorpayLoaded();
      if (!isLoaded || !(window as any).Razorpay) {
        throw new Error('Razorpay secure checkout script could not be loaded. Please check your internet connection.');
      }

      // 3. Request Razorpay order from production payment engine
      const orderRes = await apiClient.post<any>('/payments/create-order', {
        bookingId: bookingToUse.id,
        notes: {
          vehicleName: vehicle.name,
          pickupLocation: pickup.trim(),
          dropLocation: drop.trim(),
          travelDate,
        },
      });

      const orderData = orderRes.data?.data || orderRes.data;
      if (!orderData?.key || !orderData?.orderId) {
        throw new Error(orderRes.data?.message || 'Unable to initialize Razorpay checkout order. Please try again.');
      }

      // 4. Launch Razorpay native modal
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'ApnaTrip',
        description: `${vehicle.name} (${pickup} to ${drop})`,
        image: vehicle.thumbnail || 'https://cdn-icons-png.flaticon.com/512/201/201623.png',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            setIsProcessing(true);
            const verifyRes = await apiClient.post<any>('/payments/verify', {
              bookingId: bookingToUse!.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data?.success || verifyRes.data?.data?.verified || verifyRes.data?.verified) {
              setCreatedBooking((prev) => ({
                ...prev!,
                paymentStatus: paymentMethod === 'pay_on_pickup' ? 'DEPOSIT_PAID' : 'FULL_PAID',
                bookingStatus: 'CONFIRMED',
                transactionId: response.razorpay_payment_id,
              }));
              setStep(5);
            } else {
              throw new Error(verifyRes.data?.message || 'Payment signature verification failed.');
            }
          } catch (vErr: any) {
            console.error('Payment verification failed:', vErr);
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
          color: '#FF4D6D',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setBookingError('Payment cancelled or dismissed. You can retry payment anytime below.');
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        setIsProcessing(false);
        setBookingError(resp.error?.description || 'Payment transaction failed. Please retry.');
      });
      rzp.open();
    } catch (err: any) {
      console.error('Booking API error', err);
      setBookingError(
        err.response?.data?.message ||
        err.message ||
        'Unable to process your vehicle booking. Please check your network and try again.'
      );
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-0 sm:p-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step === 5 ? undefined : onClose}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs"
          />

          {/* Booking Flow Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl shadow-2xl z-10 sm:my-auto flex flex-col overflow-hidden text-[#0F172A] dark:text-slate-100"
          >
            {/* Header with Progress Steps */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/80 dark:bg-slate-800/50 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-[#0F172A] dark:text-white">
                    {step === 5 ? 'Booking Confirmed' : 'Vehicle Route Booking'}
                  </h3>
                  {step < 5 && (
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400">
                      Step {step} of 4 • {step === 1 && 'Schedule & Route'}
                      {step === 2 && 'Traveller Details'}
                      {step === 3 && 'Booking Review'}
                      {step === 4 && 'Razorpay Payment'}
                    </p>
                  )}
                </div>
                {step < 5 && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Visual Step Progress Bar */}
              {step < 5 && (
                <div className="mt-3 flex items-center gap-1.5">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        s <= step ? 'bg-[#FF4D6D]' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Step Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
              {/* STEP 1: Vehicle & Schedule */}
              {step === 1 && (
                <div className="space-y-4">
                  {/* Vehicle Mini Card */}
                  <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-100 dark:border-white/10">
                    <img
                      src={vehicle.thumbnail}
                      alt={vehicle.name}
                      className="w-16 h-12 object-cover rounded-xl shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-extrabold text-[#0F172A] dark:text-white truncate">
                        {vehicle.name}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                        {vehicle.specs.seats} Seater • {vehicle.specs.transmission} • {vehicle.provider.name}
                      </p>
                    </div>
                  </div>

                  {/* Inline Error Alert */}
                  {errorStep1 && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{errorStep1}</span>
                    </motion.div>
                  )}

                  {/* Trip Type Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Trip Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['one_way', 'round_trip'] as TripType[]).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTripType(t)}
                          className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                            tripType === t
                              ? 'bg-rose-50 dark:bg-rose-950/40 border-[#FF4D6D] text-[#FF4D6D]'
                              : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {t === 'one_way' ? 'One Way' : 'Round Trip'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pickup & Drop Inputs */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Pickup Location <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5 border border-slate-100 dark:border-white/10 focus-within:border-[#FF4D6D] focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          value={pickup}
                          onChange={(e) => {
                            setPickup(e.target.value);
                            if (errorStep1) setErrorStep1(null);
                          }}
                          placeholder="e.g. Guwahati Airport, Hotel Polo Towers"
                          className="w-full bg-transparent text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Drop Location <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5 border border-slate-100 dark:border-white/10 focus-within:border-[#FF4D6D] focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          value={drop}
                          onChange={(e) => {
                            setDrop(e.target.value);
                            if (errorStep1) setErrorStep1(null);
                          }}
                          placeholder="e.g. Shillong Police Bazar, Kaziranga Resort"
                          className="w-full bg-transparent text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date, Time & Passengers */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Travel Date <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5 border border-slate-100 dark:border-white/10 focus-within:border-[#FF4D6D] focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="date"
                          value={travelDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => {
                            setTravelDate(e.target.value);
                            if (errorStep1) setErrorStep1(null);
                          }}
                          className="w-full bg-transparent text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Pickup Time</label>
                      <CarRentalTimePicker
                        value={pickupTime}
                        onChange={(t) => {
                          setPickupTime(t);
                          if (errorStep1) setErrorStep1(null);
                        }}
                        label="Time"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Passengers</label>
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5 border border-slate-100 dark:border-white/10">
                        <Users className="w-4 h-4 text-slate-400 shrink-0" />
                        <select
                          value={passengersCount}
                          onChange={(e) => setPassengersCount(Number(e.target.value))}
                          className="w-full bg-transparent text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none cursor-pointer"
                        >
                          {Array.from({ length: vehicle.specs.seats || 4 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n} className="dark:bg-slate-800">
                              {n} {n === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextFromStep1}
                    className="w-full mt-4 py-3.5 rounded-2xl bg-[#FF4D6D] hover:bg-[#e03d5c] text-white text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#FF4D6D]/20"
                  >
                    <span>Next: Traveller Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: Traveller Details (With Phase 6 One-Click Auto-Fill) */}
              {step === 2 && (
                <div className="space-y-4">
                  {/* Phase 6: Verified Travel Profile Quick Banner */}
                  {profileData && (
                    <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <BadgeCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-indigo-950 dark:text-indigo-200">
                              One-Click Booking
                            </span>
                            {isProfileVerified && (
                              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                                Verified Profile
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            Autofilled from your saved profile credentials
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

                  {/* Inline Error Alert */}
                  {errorStep2 && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{errorStep2}</span>
                    </motion.div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5 border border-slate-100 dark:border-white/10 focus-within:border-[#FF4D6D] focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errorStep2) setErrorStep2(null);
                        }}
                        placeholder="Enter primary traveller's full name"
                        className="w-full bg-transparent text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5 border border-slate-100 dark:border-white/10 focus-within:border-[#FF4D6D] focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (errorStep2) setErrorStep2(null);
                          }}
                          placeholder="9876543210"
                          className="w-full bg-transparent text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5 border border-slate-100 dark:border-white/10 focus-within:border-[#FF4D6D] focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errorStep2) setErrorStep2(null);
                          }}
                          placeholder="traveller@example.com"
                          className="w-full bg-transparent text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Optional Emergency Contact Pre-populated */}
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
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Special Instructions / Remarks</label>
                    <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-white/10 focus-within:border-[#FF4D6D] focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <textarea
                        rows={2}
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="e.g. Extra luggage carrier, English-speaking driver, child seat"
                        className="w-full bg-transparent text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextFromStep2}
                      className="flex-1 py-3.5 rounded-2xl bg-[#FF4D6D] hover:bg-[#e03d5c] text-white text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#FF4D6D]/20"
                    >
                      <span>Review Booking Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Booking Review Screen (Phase 7 Requirements) */}
              {step === 3 && (
                <div className="space-y-4">
                  {/* Route & Vehicle Dossier */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase text-[#0F172A] dark:text-white tracking-wider">
                        Trip &amp; Route Review
                      </h4>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-[11px] font-bold text-[#FF4D6D] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit Route</span>
                      </button>
                    </div>

                    <div className="text-xs space-y-2.5 font-semibold text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Pickup:</span>
                        <strong className="text-[#0F172A] dark:text-white text-right max-w-[240px] truncate">{pickup}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Destination:</span>
                        <strong className="text-[#0F172A] dark:text-white text-right max-w-[240px] truncate">{drop}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Vehicle:</span>
                        <strong className="text-[#0F172A] dark:text-white">{vehicle.name} ({vehicle.specs.seats} Seater)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Chauffeur Included:</span>
                        <strong className="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300 px-2 py-0.5 rounded font-black">
                          {vehicle.specs.driverIncluded ? 'Yes • Professional Driver' : 'No'}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Date &amp; Time:</span>
                        <strong className="text-[#0F172A] dark:text-white">
                          {travelDate} at {pickupTime}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Agency / Fleet:</span>
                        <strong className="text-indigo-600 dark:text-indigo-400">{vehicle.provider.name}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Traveler Summary */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase text-[#0F172A] dark:text-white tracking-wider">
                        Traveler Summary
                      </h4>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-[11px] font-bold text-[#FF4D6D] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                    <div className="text-xs space-y-1.5 font-semibold text-slate-600 dark:text-slate-300">
                      <p>
                        <strong className="text-[#0F172A] dark:text-white">{fullName}</strong> ({passengersCount} Passengers)
                      </p>
                      <p className="text-slate-500 font-mono text-[11px]">
                        Phone: {phone} • Email: {email}
                      </p>
                    </div>
                  </div>

                  {/* Fare Breakdown (Phase 7 itemized breakdown) */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-white/10 space-y-2.5">
                    <h4 className="text-xs font-black uppercase text-[#0F172A] dark:text-white tracking-wider">
                      Fare Breakdown
                    </h4>
                    <div className="divide-y divide-slate-200 dark:divide-slate-700 text-xs">
                      <div className="flex justify-between py-2">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Base Route Fare</span>
                        <span className="font-bold text-[#0F172A] dark:text-white">₹{Math.round(totalAmount / 1.05).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Taxes &amp; GST (5%)</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">₹{Math.round(totalAmount - totalAmount / 1.05).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Platform Service Fee</span>
                        <span className="font-bold text-emerald-600">₹0 (Waived)</span>
                      </div>
                      <div className="flex justify-between py-2.5">
                        <span className="font-black text-[#0F172A] dark:text-white text-sm">Grand Total</span>
                        <span className="font-black text-[#FF4D6D] text-base">₹{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="flex-1 py-3.5 rounded-2xl bg-[#FF4D6D] hover:bg-[#e03d5c] text-white text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#FF4D6D]/20"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Razorpay Payment & Confirmation */}
              {step === 4 && (
                <div className="space-y-4">
                  {/* Amount Due Overview */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-white/10 text-center space-y-1">
                    <span className="text-xs font-bold text-slate-400">Total Payable Amount</span>
                    <h3 className="text-2xl font-black text-[#0F172A] dark:text-white">
                      ₹{paymentMethod === 'pay_on_pickup' ? tokenDepositAmount.toLocaleString() : totalAmount.toLocaleString()}
                    </h3>
                    {paymentMethod === 'pay_on_pickup' ? (
                      <div className="pt-2 flex items-center justify-center gap-4 text-xs font-bold">
                        <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                          Advance Token: ₹{tokenDepositAmount}
                        </span>
                        <span className="text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                          Due on Pickup: ₹{remainingCashAmount.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        100% Encrypted &amp; Verified via Razorpay Production Gateway
                      </p>
                    )}
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-2.5">
                    {[
                      {
                        id: 'upi',
                        label: 'Razorpay UPI / QR Code',
                        sub: 'Google Pay, PhonePe, Paytm, BHIM, Any UPI App',
                        icon: <QrCode className="w-5 h-5 text-purple-600" />,
                      },
                      {
                        id: 'card',
                        label: 'Credit / Debit Card',
                        sub: 'Visa, Mastercard, RuPay, Corporate Cards',
                        icon: <CreditCard className="w-5 h-5 text-sky-600" />,
                      },
                      {
                        id: 'netbanking',
                        label: 'Net Banking',
                        sub: 'All 50+ Scheduled Commercial Banks Supported',
                        icon: <Banknote className="w-5 h-5 text-emerald-600" />,
                      },
                      {
                        id: 'pay_on_pickup',
                        label: 'Reserve with ₹300 Token (Pay Balance on Pickup)',
                        sub: `Reserve slot online via ₹${tokenDepositAmount} token, pay rest to driver on arrival`,
                        icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
                      },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPaymentMethod(opt.id as any)}
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          paymentMethod === opt.id
                            ? 'border-[#FF4D6D] bg-rose-50/50 dark:bg-rose-950/30 shadow-xs'
                            : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="shrink-0">{opt.icon}</div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-[#0F172A] dark:text-white block">{opt.label}</span>
                            <span className="text-[11px] text-slate-400 font-medium block truncate">{opt.sub}</span>
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                            paymentMethod === opt.id
                              ? 'border-[#FF4D6D] bg-[#FF4D6D] text-white'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {paymentMethod === opt.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'pay_on_pickup' && (
                    <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs">
                      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="font-medium leading-relaxed">
                        Pay a ₹{tokenDepositAmount} advance token to confirm slot. The remaining balance of{' '}
                        <strong>₹{remainingCashAmount.toLocaleString()}</strong> will be collected directly by the driver upon vehicle arrival.
                      </p>
                    </div>
                  )}

                  {bookingError && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="flex-1">{bookingError}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleProceedToPayment}
                      className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF4D6D] to-[#FF3358] text-white text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#FF4D6D]/25 disabled:opacity-50"
                    >
                      <span>
                        {isProcessing ? (
                          'Connecting to Razorpay Secure Gateway...'
                        ) : paymentMethod === 'pay_on_pickup' ? (
                          `Pay ₹${tokenDepositAmount} Token via Razorpay`
                        ) : (
                          `Pay ₹${totalAmount.toLocaleString()} via Razorpay`
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Booking Success & Timeline Integration */}
              {step === 5 && (
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold border border-emerald-200 dark:border-emerald-800">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Booking Confirmed &amp; Synchronized</span>
                    </div>
                    <h3 className="text-xl font-black text-[#0F172A] dark:text-white pt-1">
                      Your vehicle is confirmed!
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      {createdBooking?.id ? (
                        <>
                          Booking reference{' '}
                          <span className="font-black text-[#0F172A] dark:text-white font-mono">{createdBooking.id}</span>
                          .{' '}
                        </>
                      ) : null}
                      {vehicle.provider.name} has received your reservation request and will dispatch chauffeur details shortly.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-white/10 text-left space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span>Vehicle:</span>
                      <strong className="text-[#0F172A] dark:text-white">{vehicle.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Travel Date:</span>
                      <strong className="text-[#0F172A] dark:text-white">{travelDate} ({pickupTime})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Pickup:</span>
                      <strong className="text-[#0F172A] dark:text-white truncate max-w-[200px]">{pickup}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Drop:</span>
                      <strong className="text-[#0F172A] dark:text-white truncate max-w-[200px]">{drop}</strong>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between">
                      <span>Amount Paid Now (Razorpay):</span>
                      <strong className="text-emerald-600 font-extrabold">
                        ₹{paymentMethod === 'pay_on_pickup' ? tokenDepositAmount : totalAmount.toLocaleString()}
                      </strong>
                    </div>
                    {paymentMethod === 'pay_on_pickup' && (
                      <div className="flex justify-between text-amber-700 dark:text-amber-400">
                        <span>Balance Due on Pickup:</span>
                        <strong className="font-extrabold">₹{remainingCashAmount.toLocaleString()}</strong>
                      </div>
                    )}
                  </div>

                  {/* Live Driver Assignment Status Badge */}
                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                        👨‍✈️
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#0F172A] dark:text-white block">Driver Assignment In Progress</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">
                          Agency confirming chauffeur name, license &amp; phone
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                      Phase 10 Ready
                    </span>
                  </div>

                  {/* QR Code Verification badge */}
                  {createdBooking?.id && (
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/10 flex items-center justify-between text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-white/10 flex items-center justify-center">
                          <QrCode className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#0F172A] dark:text-white block">Driver Boarding QR</span>
                          <span className="text-[10px] text-slate-400 font-semibold block">Show to driver when entering car</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {createdBooking.id}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate('/bookings');
                      }}
                      className="w-full py-3.5 rounded-2xl bg-[#FF4D6D] hover:bg-[#e03d5c] text-white text-sm font-black shadow-md shadow-[#FF4D6D]/20 cursor-pointer transition-all"
                    >
                      View in My Bookings
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setStep(1);
                        navigate('/car-rental');
                      }}
                      className="w-full py-2.5 rounded-2xl text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs font-extrabold cursor-pointer transition-colors"
                    >
                      Done &amp; Browse More Cars
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CarBookingModal;
