import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Star,
  X,
  Plus,
  CheckCircle2,
  Download,
  CreditCard,
  Phone,
  RefreshCw,
} from 'lucide-react';

import { AppHeader } from '../../components/home/AppHeader';
import { BottomNavigation } from '../../components/common/BottomNavigation';
import { EmptyState } from '../../components/common/EmptyState';
import {
  UserBooking,
  TravelStats,
  MasterTripStatus,
} from '../../data/trips';
import { tripService } from '../../services/trip.service';
import { apiClient } from '../../../services/apiClient';

const INITIAL_ZERO_STATS: TravelStats = {
  totalTrips: 0,
  upcomingTrips: 0,
  completedTrips: 0,
  countriesVisited: 0,
  lifetimeSpend: '₹0',
  avgRatingGiven: 0,
  badges: [],
};

interface MyTripsPageProps {
  defaultTab?: 'trips' | 'bookings' | 'stats';
}

export const MyTripsPage: React.FC<MyTripsPageProps> = ({ defaultTab = 'bookings' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bookings' | 'stats'>(
    defaultTab === 'stats' ? 'stats' : 'bookings'
  );
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<any>(null);

  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [stats, setStats] = useState<TravelStats>(INITIAL_ZERO_STATS);
  const [loading, setLoading] = useState(true);
  const [bookingFilter, setBookingFilter] = useState<'all' | 'cars' | 'packages'>('all');

  // Review Modal State
  const [reviewBooking, setReviewBooking] = useState<UserBooking | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);

  const handleOpenReview = (b: UserBooking) => {
    setReviewBooking(b);
    setRating(5);
    setHoverRating(0);
    setReviewText('');
    setImages([]);
    setImageUrl('');
    setReviewError(null);
    setReviewSuccess(false);
  };

  const handleAddImage = () => {
    if (imageUrl.trim() && !images.includes(imageUrl.trim())) {
      setImages((prev) => [...prev, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking) return;
    if (!reviewText.trim()) {
      setReviewError('Please share a few words about your trip experience.');
      return;
    }
    setSubmittingReview(true);
    setReviewError(null);
    try {
      const res: any = await apiClient.post('/reviews/package', {
        packageId: reviewBooking.packageId,
        bookingId: reviewBooking.id,
        rating,
        reviewText: reviewText.trim(),
        images,
      });
      if (res.status === 'success' || res.success) {
        setReviewSuccess(true);
        setBookings((prev) =>
          prev.map((b) =>
            b.id === reviewBooking.id
              ? { ...b, hasReviewed: true, bookingStatus: 'Reviewed' }
              : b
          )
        );
        setTimeout(() => {
          setReviewBooking(null);
          setReviewSuccess(false);
        }, 1600);
      } else {
        setReviewError(res.message || 'Failed to submit review.');
      }
    } catch (err: any) {
      setReviewError(
        err?.response?.data?.message || err?.message || 'Failed to submit review'
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    if (defaultTab === 'stats') {
      setActiveTab('stats');
    } else {
      setActiveTab('bookings');
    }
  }, [defaultTab]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    tripService.getMyTrips().then((res) => {
      if (isMounted) {
        setBookings(res.bookings || []);
        if (res.stats) {
          setStats(res.stats);
        }
        setLoading(false);
      }
    }).catch((err) => {
      console.warn('Failed to fetch live trips:', err);
      if (isMounted) {
        setBookings([]);
        setStats(INITIAL_ZERO_STATS);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const getStatusColor = (status: MasterTripStatus) => {
    switch (status) {
      case 'Trip Ready':
      case 'Booking Confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Preparing Your Trip':
      case 'Upcoming':
        return 'bg-purple-100 text-[#583BE8] border-purple-200';
      case 'Ongoing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Completed':
      case 'Reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none pb-24">
      {/* Top Navigation */}
      <AppHeader title="My Bookings" />

      <main className="px-4 py-4 sm:px-6 max-w-4xl mx-auto space-y-5">
        {/* 1. Synchronized Tab Switcher */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center justify-between text-xs font-black select-none shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer text-center ${
              activeTab === 'bookings'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-slate-500 hover:text-[#0F172A]'
            }`}
          >
            My Bookings ({bookings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer text-center ${
              activeTab === 'stats'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-slate-500 hover:text-[#0F172A]'
            }`}
          >
            Travel Stats 🏆
          </button>
        </div>

        {loading ? (
          <div className="space-y-4 py-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs animate-pulse space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-32 h-32 bg-slate-100 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-2.5 w-full">
                    <div className="h-4 bg-slate-100 rounded-full w-1/4" />
                    <div className="h-6 bg-slate-100 rounded-full w-3/4" />
                    <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* TAB CONTENT: MY BOOKINGS */}
            {activeTab === 'bookings' && (() => {
              const carCount = bookings.filter(
                (b) =>
                  b.bookingType === 'CAR_RENTAL' ||
                  b.bookingType === 'ROUTE_BOOKING' ||
                  b.bookingType === 'SELF_DRIVE_RENTAL'
              ).length;
              const pkgCount = bookings.length - carCount;

              const filteredBookings = bookings.filter((b) => {
                const isCar =
                  b.bookingType === 'CAR_RENTAL' ||
                  b.bookingType === 'ROUTE_BOOKING' ||
                  b.bookingType === 'SELF_DRIVE_RENTAL';
                if (bookingFilter === 'cars') return isCar;
                if (bookingFilter === 'packages') return !isCar;
                return true;
              });

              return (
                <div className="space-y-4">
                  {/* Category Filter Pills */}
                  {bookings.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
                      <button
                        type="button"
                        onClick={() => setBookingFilter('all')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                          bookingFilter === 'all'
                            ? 'bg-[#0F172A] text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        All Bookings ({bookings.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingFilter('cars')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          bookingFilter === 'cars'
                            ? 'bg-[#FF4D6D] text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>🚗 Cars &amp; Rentals</span>
                        <span className="text-[10px] opacity-80">({carCount})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingFilter('packages')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          bookingFilter === 'packages'
                            ? 'bg-[#583BE8] text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>🎒 Tour Packages</span>
                        <span className="text-[10px] opacity-80">({pkgCount})</span>
                      </button>
                    </div>
                  )}

                  {filteredBookings.length === 0 ? (
                    <EmptyState
                      emoji="📋"
                      title={bookingFilter === 'all' ? 'No Bookings Found' : `No ${bookingFilter === 'cars' ? 'Car Bookings' : 'Tour Packages'} Found`}
                      description={
                        bookingFilter === 'cars'
                          ? 'You have not reserved any cars or self-drive rentals yet.'
                          : "You haven't made any bookings in this section yet."
                      }
                      actionLabel={bookingFilter === 'cars' ? 'Explore Cars & Rentals' : 'Explore Packages'}
                      onAction={() => navigate(bookingFilter === 'cars' ? '/car-rental' : '/explore')}
                    />
                  ) : (
                    filteredBookings.map((booking, idx) => {
                      const isRental = booking.bookingType === 'SELF_DRIVE_RENTAL';
                      const isRoute = booking.bookingType === 'ROUTE_BOOKING' || booking.bookingType === 'CAR_RENTAL';
                      const isCar = isRental || isRoute;

                      return (
                        <motion.div
                          key={booking._id || booking.id || `booking-${booking.bookingType || 'tour'}-${idx}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row items-start gap-4">
                            <img
                              src={booking.coverImage}
                              alt={booking.packageName}
                              className="w-full sm:w-28 h-28 rounded-2xl object-cover shrink-0"
                            />

                            <div className="flex-1 min-w-0 space-y-1.5 w-full">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-1.5">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(booking.bookingStatus as MasterTripStatus)}`}>
                                    {booking.bookingStatus}
                                  </span>
                                  {isRental ? (
                                    <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                                      🔑 Self-Drive Rental
                                    </span>
                                  ) : isRoute ? (
                                    <span className="text-[10px] font-black text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                                      🚗 Route Booking
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-black text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                                      🎒 Tour Package
                                    </span>
                                  )}
                                </div>
                                {(() => {
                                  const pStatus = (booking.paymentStatus || 'PENDING').toUpperCase();
                                  const isPaid =
                                    pStatus === 'PAID' ||
                                    pStatus === 'FULL_PAID' ||
                                    booking.bookingStatus === 'Confirmed' ||
                                    (booking as any).actualBookingStatus === 'CONFIRMED' ||
                                    booking.bookingStatus === 'Completed';
                                  const isDeposit = pStatus === 'DEPOSIT_PAID' || pStatus === 'ADVANCE_PAID';
                                  const isFailed = pStatus === 'FAILED';
                                  const isRefunded = pStatus === 'REFUNDED';
                                  return (
                                    <span
                                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                                        isPaid
                                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                          : isDeposit
                                          ? 'text-amber-800 bg-amber-50 border-amber-200'
                                          : isFailed
                                          ? 'text-rose-700 bg-rose-50 border-rose-200'
                                          : isRefunded
                                          ? 'text-purple-700 bg-purple-50 border-purple-200'
                                          : 'text-amber-700 bg-amber-50 border-amber-200'
                                      }`}
                                    >
                                      {isPaid ? '✓ Full Paid' : isDeposit ? '✓ Token Paid' : isFailed ? '✕ Failed' : isRefunded ? 'Refunded' : 'Pending Payment'}
                                    </span>
                                  );
                                })()}
                              </div>

                              <h3 className="text-base font-black text-[#0F172A] tracking-tight">
                                {booking.packageName}
                              </h3>

                              {/* Agency / Fleet Provider Name */}
                              <p className="text-[11px] font-semibold text-slate-400">
                                Agency:{' '}
                                <strong className="text-slate-700">
                                  {booking.agencyName || booking.provider || 'ApnaTrip Fleet Partner'}
                                </strong>
                              </p>

                              {isCar && booking.pickupLocation && (
                                <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0" />
                                  <span>{booking.pickupLocation} ➔ {booking.dropLocation || 'Drop Point'}</span>
                                </p>
                              )}

                              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-500 pt-0.5">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 block">BOOKING ID</span>
                                  <span className="font-extrabold text-[#0F172A] font-mono">{booking.id}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 block">
                                    {isCar ? 'PICKUP DATE' : 'DEPARTURE'}
                                  </span>
                                  <span className="font-extrabold text-[#0F172A]">
                                    {booking.departureDate} {booking.pickupTime ? `(${booking.pickupTime})` : ''}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Driver Assignment Banner (Phase 10) */}
                          {booking.driverName && (
                            <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                  👨‍✈️
                                </span>
                                <div className="min-w-0">
                                  <span className="text-[10px] font-black uppercase text-indigo-600 block">
                                    Assigned Driver
                                  </span>
                                  <span className="font-extrabold text-[#0F172A] block truncate">
                                    {booking.driverName}
                                  </span>
                                  {booking.driverPhone && (
                                    <span className="text-[10px] font-mono font-bold text-slate-500 block">
                                      {booking.driverPhone}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {booking.driverPhone && (
                                <a
                                  href={`tel:${booking.driverPhone}`}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shrink-0"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>Call Driver</span>
                                </a>
                              )}
                            </div>
                          )}

                          {/* Countdown & Payment Info */}
                          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-[#583BE8]" />
                              <span className="font-extrabold text-[#0F172A]">
                                {booking.countdownDays <= 0 ? 'Travel Begins Today / In Progress' : `Starts in ${booking.countdownDays} Days`}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-right">
                              {booking.remainingAmount && booking.remainingAmount > 0 ? (
                                <div className="text-[11px] font-bold">
                                  <span className="text-emerald-700">₹{booking.amountPaid.toLocaleString()} Advance</span>
                                  <span className="text-slate-400 mx-1">•</span>
                                  <span className="text-amber-800">₹{booking.remainingAmount.toLocaleString()} on Pickup</span>
                                </div>
                              ) : (
                                <span className="font-black text-[#583BE8]">
                                  ₹{booking.totalAmount.toLocaleString()} Total
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action CTA */}
                          <div className="flex items-center justify-end gap-2 pt-1 flex-wrap">
                            {/* Book Again */}
                            <button
                              type="button"
                              onClick={() => navigate(isCar ? '/car-rental' : '/explore')}
                              className="px-3.5 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
                              title="Book Another Trip"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                              <span>Book Again</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => navigate(`/bookings/${booking.id}`)}
                              className="px-3.5 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
                              title="View & Download Tax Invoice"
                            >
                              <Download className="w-3.5 h-3.5 text-slate-500" />
                              <span>Invoice</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => navigate('/chat')}
                              className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-extrabold transition-all cursor-pointer"
                            >
                              Contact Support
                            </button>

                            <button
                              type="button"
                              onClick={() => navigate(`/bookings/${booking.id}`)}
                              className="px-5 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#472bd1] text-white text-xs font-black shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <span>View Booking Details</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              );
            })()}

        {/* 4. TAB CONTENT: TRAVEL STATS */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sparkles className="w-5 h-5 text-[#583BE8]" />
                <div>
                  <h3 className="text-base font-black text-[#0F172A]">Traveler Statistics</h3>
                  <p className="text-[11px] font-semibold text-slate-400">Your lifetime journey metrics on Travel OS</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100">
                  <span className="text-xl font-black text-[#583BE8] block">{stats.totalTrips}</span>
                  <span className="text-[11px] font-extrabold text-slate-500">Total Trips</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-xl font-black text-emerald-700 block">{stats.completedTrips}</span>
                  <span className="text-[11px] font-extrabold text-slate-500">Completed</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100">
                  <span className="text-xl font-black text-amber-700 block">{stats.countriesVisited}</span>
                  <span className="text-[11px] font-extrabold text-slate-500">States & Countries</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100">
                  <span className="text-xl font-black text-sky-700 block">{stats.avgRatingGiven} ★</span>
                  <span className="text-[11px] font-extrabold text-slate-500">Avg. Rating</span>
                </div>
              </div>

              {/* Badges Section */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                  Earned Travel Badges ({stats.badges.length})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {stats.badges.map((b, i) => (
                    <div key={`badge-${b.name || i}-${i}`} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center gap-3">
                      <span className="text-2xl">{b.icon}</span>
                      <div>
                        <h5 className="font-extrabold text-xs text-[#0F172A]">{b.name}</h5>
                        <p className="text-[10px] font-medium text-slate-400">{b.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )}
  </main>

      {/* Review Submission Modal for Completed Trips */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-[#0F172A]">Rate & Review Your Trip</h3>
                <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Traveler Review</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReviewBooking(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-black cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Trip Info Card */}
            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center gap-3">
              <img
                src={reviewBooking.coverImage}
                alt={reviewBooking.packageName}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-black text-[#0F172A] text-sm truncate">{reviewBooking.packageName}</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold mt-0.5">
                  <span>Booking ID: {reviewBooking.id}</span>
                  <span>•</span>
                  <span>{reviewBooking.departureDate}</span>
                </div>
              </div>
            </div>

            {reviewSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
                  ✓
                </div>
                <h4 className="text-lg font-black text-[#0F172A]">Review Submitted!</h4>
                <p className="text-xs font-semibold text-slate-500">
                  Thank you for sharing your genuine experience with fellow travelers.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {reviewError && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                    {reviewError}
                  </div>
                )}

                {/* Rating Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                    Your Overall Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-black text-slate-700">
                      {(hoverRating || rating) === 5 && '5.0 - Exceptional'}
                      {(hoverRating || rating) === 4 && '4.0 - Very Good'}
                      {(hoverRating || rating) === 3 && '3.0 - Good'}
                      {(hoverRating || rating) === 2 && '2.0 - Fair'}
                      {(hoverRating || rating) === 1 && '1.0 - Poor'}
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                    Write Your Experience *
                  </label>
                  <textarea
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe your tour guides, hotels, itinerary execution, vehicle comfort, and highlights..."
                    className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#583BE8]/20 focus:border-[#583BE8] transition-all resize-none"
                    required
                  />
                </div>

                {/* Trip Photos (Optional) */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                    Trip Photos (Optional URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste image URL (https://...)"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#583BE8]/20 focus:border-[#583BE8]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {images.map((img, idx) => (
                        <div key={`review-img-${idx}-${img.slice(-10)}`} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                          <img src={img} alt={`Trip upload ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px] cursor-pointer hover:bg-black"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewBooking(null)}
                    disabled={submittingReview}
                    className="px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-extrabold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#472bd1] text-white text-xs font-black shadow-md shadow-[#583BE8]/20 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {submittingReview ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>Submit Verified Review</span>
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Booking Status & Details Modal */}
      {selectedBookingForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-[#0F172A]">Booking Status</h3>
                <p className="text-xs font-semibold text-[#583BE8]">
                  ID: {selectedBookingForModal.bookingId || selectedBookingForModal.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedBookingForModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-600">
              <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
                <span className="font-extrabold text-[#0F172A] block text-sm">
                  {selectedBookingForModal.packageTitle || selectedBookingForModal.packageName || 'Tour Booking'}
                </span>
                <span className="text-slate-500">
                  Agency: {selectedBookingForModal.agencyName || 'ApnaTrip Partner'}
                </span>
              </div>

              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                <span>Status:</span>
                <span className="font-black text-emerald-600">
                  {selectedBookingForModal.status || selectedBookingForModal.bookingStatus || 'Confirmed'}
                </span>
              </div>

              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                <span>Total Amount Paid:</span>
                <span className="font-black text-[#0F172A]">
                  ₹{(selectedBookingForModal.totalPrice ?? selectedBookingForModal.totalAmount ?? 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                <span>Travelers:</span>
                <span className="font-black text-slate-800">
                  {selectedBookingForModal.travelersCount ?? selectedBookingForModal.travelerCount ?? 1} Person(s)
                </span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  const targetId = selectedBookingForModal.id || selectedBookingForModal.bookingId;
                  setSelectedBookingForModal(null);
                  navigate(`/bookings/${targetId}`);
                }}
                className="flex-1 py-3 rounded-2xl bg-[#583BE8] hover:bg-[#472bd1] text-white font-extrabold text-xs transition-colors cursor-pointer"
              >
                View Full Details
              </button>
              <button
                type="button"
                onClick={() => setSelectedBookingForModal(null)}
                className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default MyTripsPage;
