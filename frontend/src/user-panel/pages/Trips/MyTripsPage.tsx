import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Compass,
  CheckCircle2,
  Bookmark,
  MapPin,
  Clock,
  User,
  Users,
  ShieldCheck,
  Truck,
  Building,
  ArrowRight,
  Sparkles,
  Phone,
  FileText,
  Star,
  Download,
  AlertTriangle,
} from 'lucide-react';

import { AppHeader } from '../../components/home/AppHeader';
import { BottomNavigation } from '../../components/common/BottomNavigation';
import {
  TRIPS_DATA,
  USER_BOOKINGS_DATA,
  USER_TRAVEL_STATS,
  Trip,
  UserBooking,
  MasterTripStatus,
} from '../../data/trips';

export const MyTripsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'trips' | 'bookings' | 'stats'>('trips');
  const [selectedCompanionTrip, setSelectedCompanionTrip] = useState<Trip | null>(null);
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<any>(null);

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
      <AppHeader title="My Trips & Bookings" />

      <main className="px-4 py-4 sm:px-6 max-w-4xl mx-auto space-y-5">
        {/* 1. Synchronized Tab Switcher */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center justify-between text-xs font-black select-none shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('trips')}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer text-center ${
              activeTab === 'trips'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-slate-500 hover:text-[#0F172A]'
            }`}
          >
            My Trips ({TRIPS_DATA.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer text-center ${
              activeTab === 'bookings'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-slate-500 hover:text-[#0F172A]'
            }`}
          >
            My Bookings ({USER_BOOKINGS_DATA.length})
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

        {/* 2. TAB CONTENT: MY TRIPS */}
        {activeTab === 'trips' && (
          <div className="space-y-4">
            {TRIPS_DATA.map((trip) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4"
              >
                {/* Trip Cover & Title Bar */}
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-full sm:w-32 h-32 rounded-2xl object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1.5 w-full">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                      <span className="text-xs font-extrabold text-[#583BE8] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                        {trip.duration}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
                      {trip.title}
                    </h3>

                    <p className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#FF4D6D]" />
                      {trip.locations}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-xs font-extrabold text-slate-600">
                      <span>{trip.tripStartDate} – {trip.tripEndDate}</span>
                      <span>•</span>
                      <span>{trip.travelerCount} Travelers</span>
                    </div>
                  </div>
                </div>

                {/* Operations Info Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  {/* Trip Host & Guide */}
                  <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#583BE8]" />
                      <span className="font-extrabold text-[#0F172A]">Trip Operations Team</span>
                    </div>
                    <div className="space-y-1 pl-6">
                      <p className="font-bold text-slate-700">
                        Host: <span className="text-[#0F172A] font-black">{trip.tripHost.name}</span> ({trip.tripHost.phone})
                      </p>
                      <p className="font-bold text-slate-700">
                        Guide: <span className="text-[#0F172A] font-black">{trip.guide.name}</span> ({trip.guide.phone})
                      </p>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-amber-600" />
                      <span className="font-extrabold text-[#0F172A]">Assigned Vehicle</span>
                    </div>
                    <div className="space-y-1 pl-6">
                      <p className="font-bold text-slate-700">
                        {trip.vehicle.name} (<span className="font-black text-[#0F172A]">{trip.vehicle.number}</span>)
                      </p>
                      <p className="font-semibold text-slate-500 text-[11px]">
                        Pickup: {trip.vehicle.pickupTime} at {trip.vehicle.pickupLocation}
                      </p>
                    </div>
                  </div>

                  {/* Hotel Details */}
                  <div className="p-3 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1.5 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-sky-600" />
                        <span className="font-extrabold text-[#0F172A]">Hotel Reservation</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                        Check-in: {trip.hotel.checkIn}
                      </span>
                    </div>
                    <div className="pl-6 space-y-0.5">
                      <p className="font-black text-[#0F172A]">{trip.hotel.name}</p>
                      <p className="text-[11px] font-semibold text-slate-500">{trip.hotel.address}</p>
                    </div>
                  </div>
                </div>

                {/* Traveling With Companions */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Users className="w-4 h-4 text-slate-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-extrabold text-[#0F172A] text-xs block">Traveling With</span>
                      <p className="text-[11px] font-medium text-slate-500 truncate">
                        {trip.companions.map((c) => `${c.name} (${c.relationship})`).join(', ')}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCompanionTrip(trip)}
                    className="text-[11px] font-extrabold text-[#583BE8] hover:underline shrink-0 cursor-pointer"
                  >
                    View Roster →
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/trips/${trip.id}`)}
                    className="flex-1 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#472bd1] text-white text-xs font-black shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Compass className="w-4 h-4" />
                    <span>View Timeline</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCompanionTrip(trip)}
                    className="flex-1 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>View Travelers</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 3. TAB CONTENT: MY BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {USER_BOOKINGS_DATA.map((booking) => (
              <motion.div
                key={booking.id}
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
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus}
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        {booking.paymentStatus}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-[#0F172A] tracking-tight">
                      {booking.packageName}
                    </h3>

                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-500 pt-0.5">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">BOOKING ID</span>
                        <span className="font-extrabold text-[#0F172A]">{booking.id}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">DEPARTURE</span>
                        <span className="font-extrabold text-[#0F172A]">{booking.departureDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Countdown & Payment Info */}
                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#583BE8]" />
                    <span className="font-extrabold text-[#0F172A]">
                      Departure in {booking.countdownDays} Days
                    </span>
                  </div>

                  <span className="font-black text-[#583BE8]">
                    ₹{booking.totalAmount.toLocaleString()} Paid
                  </span>
                </div>

                {/* Action CTA */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => navigate('/chat')}
                    className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-extrabold transition-all cursor-pointer"
                  >
                    Contact Support
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (booking.associatedTripId) {
                        navigate(`/trips/${booking.associatedTripId}`);
                      } else {
                        setSelectedBookingForModal(booking);
                      }
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#472bd1] text-white text-xs font-black shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{booking.associatedTripId ? 'View Trip' : 'View Booking Status'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

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
                  <span className="text-xl font-black text-[#583BE8] block">{USER_TRAVEL_STATS.totalTrips}</span>
                  <span className="text-[11px] font-extrabold text-slate-500">Total Trips</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-xl font-black text-emerald-700 block">{USER_TRAVEL_STATS.completedTrips}</span>
                  <span className="text-[11px] font-extrabold text-slate-500">Completed</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100">
                  <span className="text-xl font-black text-amber-700 block">{USER_TRAVEL_STATS.countriesVisited}</span>
                  <span className="text-[11px] font-extrabold text-slate-500">States & Countries</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100">
                  <span className="text-xl font-black text-sky-700 block">{USER_TRAVEL_STATS.avgRatingGiven} ★</span>
                  <span className="text-[11px] font-extrabold text-slate-500">Avg. Rating</span>
                </div>
              </div>

              {/* Badges Section */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                  Earned Travel Badges ({USER_TRAVEL_STATS.badges.length})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {USER_TRAVEL_STATS.badges.map((b, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center gap-3">
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
      </main>

      {/* Traveling With Companions Roster Modal */}
      {selectedCompanionTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-[#0F172A]">Travel Companions</h3>
                <p className="text-[11px] font-semibold text-slate-400">{selectedCompanionTrip.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCompanionTrip(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              {selectedCompanionTrip.companions.map((comp) => (
                <div key={comp.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={comp.photo} alt={comp.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div>
                      <h4 className="font-black text-xs text-[#0F172A]">{comp.name}</h4>
                      <p className="text-[10px] font-semibold text-slate-400">{comp.gender} • {comp.age} yrs • {comp.relationship}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    comp.isPrimary ? 'bg-purple-100 text-[#583BE8]' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {comp.isPrimary ? 'Primary Traveler' : 'Companion'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Booking Status & Details Modal */}
      {selectedBookingForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-[#0F172A]">Booking Status</h3>
                <p className="text-xs font-semibold text-[#583BE8]">ID: {selectedBookingForModal.bookingId}</p>
              </div>
              <button
                onClick={() => setSelectedBookingForModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-600">
              <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
                <span className="font-extrabold text-[#0F172A] block text-sm">{selectedBookingForModal.packageTitle}</span>
                <span className="text-slate-500">Agency: {selectedBookingForModal.agencyName}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                <span>Status:</span>
                <span className="font-black text-emerald-600">{selectedBookingForModal.status}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                <span>Total Amount Paid:</span>
                <span className="font-black text-[#0F172A]">₹{selectedBookingForModal.totalPrice?.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                <span>Travelers:</span>
                <span className="font-black text-slate-800">{selectedBookingForModal.travelersCount} Person(s)</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBookingForModal(null)}
              className="w-full py-3 rounded-2xl bg-[#0F172A] text-white font-extrabold text-xs cursor-pointer"
            >
              Close Status Summary
            </button>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default MyTripsPage;
