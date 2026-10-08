import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Car,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  UserCheck,
  Loader2,
  Eye,
  MessageSquare,
  X,
  AlertCircle,
  Copy,
  ChevronRight,
  ShieldCheck,
  Star,
  Check,
  RefreshCw,
  Ban,
  Users,
} from 'lucide-react';
import { agencyCarRentalService } from '../../services/agencyCarRental.service';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { useToast } from '../../../user-panel/context/ToastContext';

export const AgencyCarRentalBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const carIdFilter = searchParams.get('carId');
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Driver Assignment Modal State
  const [assigningDriverBooking, setAssigningDriverBooking] = useState<any | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [vehicleNumberInput, setVehicleNumberInput] = useState<string>('');
  const [vehicleModelInput, setVehicleModelInput] = useState<string>('');
  const [driverSearchQuery, setDriverSearchQuery] = useState<string>('');
  const [isAssigningDriver, setIsAssigningDriver] = useState(false);

  // View Booking Modal State
  const [viewingBooking, setViewingBooking] = useState<any | null>(null);

  // Rejection Modal State
  const [rejectingBooking, setRejectingBooking] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('Vehicle unavailable for requested route');

  // Cancel Booking Modal State
  const [cancellingBooking, setCancellingBooking] = useState<any | null>(null);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await agencyCarRentalService.getBookings();
      setBookings(data);
    } catch (err: any) {
      console.error('Failed to load bookings:', err);
      showToast(err.message || 'Failed to load bookings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const data = await agencyCarRentalService.getDrivers();
      setDrivers(data || []);
    } catch (err: any) {
      console.warn('Failed to load drivers roster:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchDrivers();
  }, []);

  // Open Driver Assignment Modal
  const handleOpenAssignDriverModal = (booking: any) => {
    setAssigningDriverBooking(booking);
    setDriverSearchQuery('');
    setVehicleNumberInput(
      booking.vehicleNumber ||
      booking.carId?.registrationNumber ||
      'DL-01-COMMERCIAL'
    );
    setVehicleModelInput(
      booking.vehicleModel ||
      (booking.carId ? `${booking.carId.brand} ${booking.carId.name}` : 'Rental Vehicle')
    );

    // Pick existing driver if assigned, else pick first available
    if (booking.driverId) {
      setSelectedDriverId(String(booking.driverId));
    } else if (drivers.length > 0) {
      const firstAvailable = drivers.find((d) => d.status === 'active') || drivers[0];
      setSelectedDriverId(String(firstAvailable._id || firstAvailable.id));
    } else {
      setSelectedDriverId('');
    }
  };

  // Assign Driver Submit
  const handleAssignDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningDriverBooking) return;
    if (!selectedDriverId) {
      showToast('Please select a driver from the roster', 'error');
      return;
    }

    setIsAssigningDriver(true);
    try {
      const updated = await agencyCarRentalService.assignDriver(
        assigningDriverBooking._id || assigningDriverBooking.bookingId,
        {
          driverId: selectedDriverId,
          vehicleNumber: vehicleNumberInput.trim(),
          vehicleModel: vehicleModelInput.trim(),
        }
      );

      const isChange =
        assigningDriverBooking.bookingStatus === 'CONFIRMED' ||
        assigningDriverBooking.bookingStatus === 'ACCEPTED';

      showToast(
        isChange ? 'Assigned driver has been updated!' : 'Booking confirmed with driver assigned!',
        'success'
      );

      setBookings((prev) =>
        prev.map((b) =>
          b._id === assigningDriverBooking._id || b.bookingId === assigningDriverBooking.bookingId
            ? { ...b, ...updated, bookingStatus: 'CONFIRMED' }
            : b
        )
      );

      setAssigningDriverBooking(null);
      await fetchBookings();
    } catch (err: any) {
      showToast(err.message || 'Failed to assign driver', 'error');
    } finally {
      setIsAssigningDriver(false);
    }
  };

  // Reject Booking Submit
  const handleRejectSubmit = async () => {
    if (!rejectingBooking) return;
    setActionInProgress(rejectingBooking._id);
    try {
      await agencyCarRentalService.updateBookingStatus(
        rejectingBooking._id || rejectingBooking.bookingId,
        'REJECTED',
        rejectionReason
      );
      showToast('Booking rejected', 'success');
      setBookings((prev) =>
        prev.map((b) =>
          b._id === rejectingBooking._id ? { ...b, bookingStatus: 'REJECTED' } : b
        )
      );
      setRejectingBooking(null);
      await fetchBookings();
    } catch (err: any) {
      showToast(err.message || 'Failed to reject booking', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  // Cancel Booking Submit
  const handleCancelSubmit = async () => {
    if (!cancellingBooking) return;
    setActionInProgress(cancellingBooking._id);
    try {
      await agencyCarRentalService.updateBookingStatus(
        cancellingBooking._id || cancellingBooking.bookingId,
        'CANCELLED'
      );
      showToast('Booking cancelled', 'success');
      setBookings((prev) =>
        prev.map((b) =>
          b._id === cancellingBooking._id ? { ...b, bookingStatus: 'CANCELLED' } : b
        )
      );
      setCancellingBooking(null);
      await fetchBookings();
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel booking', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  const filteredDrivers = drivers.filter((d) => {
    if (!driverSearchQuery.trim()) return true;
    const q = driverSearchQuery.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.phone?.toLowerCase().includes(q) ||
      d.licenseNumber?.toLowerCase().includes(q)
    );
  });

  const filteredBookings = bookings.filter((b) => {
    if (carIdFilter && b.carId?._id !== carIdFilter && b.carId !== carIdFilter) {
      return false;
    }
    const bStatus = (b.bookingStatus || '').toUpperCase();
    let matchesStatus = true;
    if (selectedStatus === 'PENDING') {
      matchesStatus = bStatus === 'PENDING' || bStatus === 'REQUESTED' || bStatus === 'PENDING_PAYMENT';
    } else if (selectedStatus === 'CONFIRMED') {
      matchesStatus = bStatus === 'CONFIRMED' || bStatus === 'ACCEPTED';
    } else if (selectedStatus === 'COMPLETED') {
      matchesStatus = bStatus === 'COMPLETED';
    } else if (selectedStatus === 'CANCELLED') {
      matchesStatus = bStatus === 'CANCELLED' || bStatus === 'REJECTED';
    }

    const matchesSearch =
      b.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.pickupLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.dropLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.carId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.driverName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-[#F8F9FC] overflow-hidden font-sans select-none">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📅</span>
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                  Rental Reservations &amp; Dispatch
                </h1>
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Real-time booking confirmations, commercial driver assignments, and trip communications.
              </p>
            </div>

            {carIdFilter && (
              <button
                type="button"
                onClick={() => navigate('/agency/car-rental/bookings')}
                className="px-3.5 py-1.5 rounded-xl bg-purple-50 text-[#583BE8] text-xs font-black hover:bg-purple-100 transition-colors cursor-pointer"
              >
                Clear Vehicle Filter ✕
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by booking ID, traveler, pickup, destination, or driver..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] transition-colors shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { key: 'all', label: 'All Bookings' },
                { key: 'PENDING', label: 'Pending Action' },
                { key: 'CONFIRMED', label: 'Confirmed' },
                { key: 'COMPLETED', label: 'Completed' },
                { key: 'CANCELLED', label: 'Cancelled' },
              ].map((st) => (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => setSelectedStatus(st.key)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    selectedStatus === st.key
                      ? 'bg-[#583BE8] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-full border-2 border-[#583BE8]/20 border-t-[#583BE8] animate-spin" />
                <span className="text-xs font-bold text-slate-400">Loading rental reservations...</span>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black text-[#0F172A]">No bookings found</h3>
                <p className="text-xs font-medium text-slate-400">
                  Try changing your status filter or search keywords.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-3">Booking ID &amp; Vehicle</th>
                      <th className="py-3.5 px-3">Traveler Details</th>
                      <th className="py-3.5 px-3">Pickup &amp; Destination</th>
                      <th className="py-3.5 px-3">Date &amp; Time</th>
                      <th className="py-3.5 px-3 text-center">Status</th>
                      <th className="py-3.5 px-3">Assigned Driver</th>
                      <th className="py-3.5 px-3">Fare &amp; Payment</th>
                      <th className="py-3.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredBookings.map((b) => {
                      const bStatus = (b.bookingStatus || '').toUpperCase();
                      const isPending = bStatus === 'PENDING' || bStatus === 'REQUESTED' || bStatus === 'PENDING_PAYMENT';
                      const isConfirmed = bStatus === 'CONFIRMED' || bStatus === 'ACCEPTED';
                      const cleanPhone = (b.customerPhone || '').replace(/\D/g, '');
                      const cleanDriverPhone = (b.driverPhone || '').replace(/\D/g, '');
                      const fare = b.totalAmount || b.fixedPrice || 0;
                      const hasDriver = Boolean(b.driverName);

                      return (
                        <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                          {/* 1. Booking ID & Vehicle */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                {b.carId?.thumbnail || b.carId?.images?.[0] ? (
                                  <img
                                    src={b.carId.thumbnail || b.carId.images[0]}
                                    alt="Vehicle"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs">🚗</div>
                                )}
                              </div>
                              <div>
                                <span className="font-extrabold text-[#0F172A] block leading-tight">
                                  {b.carId?.brand} {b.carId?.name || b.vehicleModel || 'Car'}
                                </span>
                                <span className="text-[10px] font-mono text-[#583BE8] font-bold block mt-0.5">
                                  #{b.bookingId}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* 2. Traveler Details */}
                          <td className="py-3.5 px-3">
                            <span className="font-extrabold text-[#0F172A] block">{b.customerName}</span>
                            <span className="text-[10px] text-slate-500 font-mono block">{b.customerPhone}</span>
                            <span className="text-[10px] text-slate-400 block">
                              {b.passengersCount || 4} Passenger{b.passengersCount !== 1 ? 's' : ''}
                            </span>
                          </td>

                          {/* 3. Pickup & Destination */}
                          <td className="py-3.5 px-3 max-w-[150px]">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 font-bold text-[#0F172A] truncate">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                <span className="truncate">{b.pickupLocation}</span>
                              </div>
                              <div className="flex items-center gap-1 font-bold text-[#0F172A] truncate">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                <span className="truncate">{b.dropLocation || b.pickupLocation}</span>
                              </div>
                            </div>
                          </td>

                          {/* 4. Date & Time */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <span className="font-bold text-[#0F172A] block">
                              {new Date(b.startDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 block mt-0.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {b.pickupTime || '10:00 AM'}
                            </span>
                          </td>

                          {/* 5. Status */}
                          <td className="py-3.5 px-3 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                                isConfirmed
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : isPending
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : bStatus === 'COMPLETED'
                                  ? 'bg-purple-50 text-[#583BE8] border-purple-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {isConfirmed ? 'CONFIRMED' : isPending ? 'PENDING' : bStatus}
                            </span>
                          </td>

                          {/* 6. Driver */}
                          <td className="py-3.5 px-3 max-w-[140px]">
                            {hasDriver ? (
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1 font-bold text-[#0F172A] truncate">
                                  <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span className="truncate">{b.driverName}</span>
                                </div>
                                {b.driverPhone && (
                                  <span className="text-[10px] text-slate-500 font-mono block">
                                    {b.driverPhone}
                                  </span>
                                )}
                                {b.vehicleNumber && (
                                  <span className="text-[9px] font-extrabold text-slate-400 font-mono block">
                                    {b.vehicleNumber}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                                No Driver Assigned
                              </span>
                            )}
                          </td>

                          {/* 7. Fare & Payment */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <span className="font-black text-[#0F172A] block">
                              ₹{fare.toLocaleString()}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                b.paymentStatus === 'FULL_PAID' || b.paymentStatus === 'PAID'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : b.paymentStatus === 'DEPOSIT_PAID'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {b.paymentStatus || 'PENDING'}
                            </span>
                          </td>

                          {/* 8. Actions */}
                          <td className="py-3.5 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Actions for Pending Booking */}
                              {isPending && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenAssignDriverModal(b)}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Confirm Booking</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setRejectingBooking(b)}
                                    className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[11px] font-bold transition-colors cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}

                              {/* Actions for Confirmed Booking */}
                              {isConfirmed && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenAssignDriverModal(b)}
                                    title="Change Assigned Driver"
                                    className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#583BE8] border border-indigo-200 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" />
                                    <span>Change Driver</span>
                                  </button>

                                  {b.driverPhone && (
                                    <a
                                      href={`tel:${b.driverPhone}`}
                                      title={`Call Driver (${b.driverPhone})`}
                                      className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
                                    >
                                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                    </a>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => setCancellingBooking(b)}
                                    title="Cancel Booking"
                                    className="p-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center justify-center"
                                  >
                                    <Ban className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}

                              {/* Common Communication Actions: Call Traveler, WhatsApp Traveler, View Booking */}
                              <a
                                href={`tel:${b.customerPhone}`}
                                title={`Call Traveler (${b.customerPhone})`}
                                className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
                              >
                                <Phone className="w-3.5 h-3.5 text-[#583BE8]" />
                              </a>

                              <a
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="WhatsApp Traveler"
                                className="p-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center justify-center"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                              </a>

                              <button
                                type="button"
                                onClick={() => setViewingBooking(b)}
                                title="View Full Booking Details"
                                className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* CONFIRM BOOKING / SELECT DRIVER MODAL */}
          <AnimatePresence>
            {assigningDriverBooking && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
                >
                  {/* Modal Header */}
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div>
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-[#583BE8]" />
                        <h2 className="text-lg font-black text-[#0F172A]">
                          {assigningDriverBooking.bookingStatus === 'CONFIRMED' ||
                          assigningDriverBooking.bookingStatus === 'ACCEPTED'
                            ? 'Change Assigned Driver'
                            : 'Select Driver & Confirm Booking'}
                        </h2>
                      </div>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5">
                        Booking Reference: #{assigningDriverBooking.bookingId} •{' '}
                        {assigningDriverBooking.customerName}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAssigningDriverBooking(null)}
                      className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <form onSubmit={handleAssignDriverSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Vehicle Details confirmation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-indigo-50/40 border border-indigo-100 rounded-2xl p-3.5">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-indigo-900 block mb-1">
                          Vehicle Model
                        </label>
                        <input
                          type="text"
                          value={vehicleModelInput}
                          onChange={(e) => setVehicleModelInput(e.target.value)}
                          placeholder="e.g. Toyota Innova Crysta"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#583BE8]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-indigo-900 block mb-1">
                          Vehicle Number
                        </label>
                        <input
                          type="text"
                          value={vehicleNumberInput}
                          onChange={(e) => setVehicleNumberInput(e.target.value)}
                          placeholder="e.g. AS-06-BC-1234"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-[#583BE8]"
                        />
                      </div>
                    </div>

                    {/* Driver Search Input */}
                    <div>
                      <label className="text-xs font-black text-slate-700 block mb-1.5">
                        Available Commercial Drivers ({drivers.length})
                      </label>
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={driverSearchQuery}
                          onChange={(e) => setDriverSearchQuery(e.target.value)}
                          placeholder="Search drivers by name, phone, or license..."
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#583BE8]"
                        />
                      </div>
                    </div>

                    {/* Drivers List */}
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {filteredDrivers.length === 0 ? (
                        <div className="p-6 text-center text-xs font-medium text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          No drivers found matching your search.
                        </div>
                      ) : (
                        filteredDrivers.map((driver) => {
                          const driverId = String(driver._id || driver.id);
                          const isSelected = selectedDriverId === driverId;
                          const isAvailable = driver.status === 'active' || !driver.status || driver.status === 'available';

                          return (
                            <div
                              key={driverId}
                              onClick={() => setSelectedDriverId(driverId)}
                              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                isSelected
                                  ? 'border-[#583BE8] bg-indigo-50/50 shadow-xs ring-1 ring-[#583BE8]/20'
                                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {driver.photo ? (
                                  <img
                                    src={driver.photo}
                                    alt={driver.name}
                                    className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                                  />
                                ) : (
                                  <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0">
                                    {driver.name ? driver.name.charAt(0).toUpperCase() : '👨‍✈️'}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-xs font-black text-[#0F172A] truncate">{driver.name}</h4>
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                        isAvailable
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                                      }`}
                                    >
                                      {isAvailable ? 'Available' : 'Busy'}
                                    </span>
                                  </div>
                                  <p className="text-[11px] font-mono text-slate-500 font-semibold mt-0.5">
                                    {driver.phone} • {driver.experienceYears || 3} yrs exp
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-mono">
                                    License: {driver.licenseNumber || 'Commercial'}
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0 flex items-center">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    isSelected
                                      ? 'border-[#583BE8] bg-[#583BE8] text-white'
                                      : 'border-slate-300 bg-white'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setAssigningDriverBooking(null)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isAssigningDriver || !selectedDriverId}
                        className="px-5 py-2.5 rounded-xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-black transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isAssigningDriver && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>
                          {isAssigningDriver
                            ? 'Assigning...'
                            : assigningDriverBooking.bookingStatus === 'CONFIRMED' ||
                              assigningDriverBooking.bookingStatus === 'ACCEPTED'
                            ? 'Update Driver'
                            : 'Assign Driver & Confirm'}
                        </span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* VIEW BOOKING MODAL */}
          <AnimatePresence>
            {viewingBooking && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
                >
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div>
                      <h3 className="text-base font-black text-[#0F172A]">Booking Dossier</h3>
                      <p className="text-xs font-mono font-bold text-[#583BE8]">
                        #{viewingBooking.bookingId}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewingBooking(null)}
                      className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto space-y-4 text-xs">
                    {/* Traveler Details */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 block">
                        Traveler Information
                      </span>
                      <h4 className="font-extrabold text-[#0F172A] text-sm">{viewingBooking.customerName}</h4>
                      <div className="flex items-center gap-3 text-slate-600 font-semibold pt-0.5">
                        <span>📞 {viewingBooking.customerPhone}</span>
                        {viewingBooking.customerEmail && <span>✉️ {viewingBooking.customerEmail}</span>}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Passengers: {viewingBooking.passengersCount || 4}
                      </p>
                    </div>

                    {/* Route & Schedule */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <span className="text-[10px] font-black uppercase text-slate-400 block">
                        Route &amp; Timing
                      </span>
                      <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                        <span>{viewingBooking.pickupLocation}</span>
                        <span className="text-slate-400">→</span>
                        <span>{viewingBooking.dropLocation || viewingBooking.pickupLocation}</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-600 font-medium">
                        <span>
                          Date:{' '}
                          {new Date(viewingBooking.startDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span>Pickup Time: {viewingBooking.pickupTime || '10:00 AM'}</span>
                      </div>
                    </div>

                    {/* Assigned Driver & Vehicle */}
                    <div className="p-3.5 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-2">
                      <span className="text-[10px] font-black uppercase text-indigo-900 block">
                        Assigned Driver &amp; Vehicle
                      </span>
                      {viewingBooking.driverName ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-extrabold text-[#0F172A] text-sm">
                              {viewingBooking.driverName}
                            </p>
                            <p className="font-mono text-slate-600 font-semibold">
                              {viewingBooking.driverPhone}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              Plate: {viewingBooking.vehicleNumber || 'Commercial Fleet'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${viewingBooking.driverPhone}`}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call Driver</span>
                            </a>
                          </div>
                        </div>
                      ) : (
                        <p className="text-amber-700 font-semibold">No driver assigned yet.</p>
                      )}
                    </div>

                    {/* Fare & Financials */}
                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase block">Total Fare</span>
                        <span className="text-sm font-black text-[#0F172A]">
                          ₹{(viewingBooking.totalAmount || viewingBooking.fixedPrice || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase block">Advance Paid</span>
                        <span className="text-sm font-black text-emerald-600">
                          ₹{(viewingBooking.depositPaid || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase block">Balance Due</span>
                        <span className="text-sm font-black text-amber-600">
                          ₹{Math.max(
                            0,
                            (viewingBooking.totalAmount || 0) - (viewingBooking.depositPaid || 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setViewingBooking(null)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* REJECT BOOKING MODAL */}
          <AnimatePresence>
            {rejectingBooking && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100"
                >
                  <div className="flex items-center gap-2.5 text-rose-600">
                    <XCircle className="w-5 h-5" />
                    <h3 className="text-base font-black text-[#0F172A]">Decline Reservation</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Are you sure you want to decline booking #{rejectingBooking.bookingId} for{' '}
                    {rejectingBooking.customerName}?
                  </p>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                      Reason for Rejection
                    </label>
                    <input
                      type="text"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#583BE8]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRejectingBooking(null)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleRejectSubmit}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black cursor-pointer shadow-xs"
                    >
                      Confirm Decline
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* CANCEL BOOKING MODAL */}
          <AnimatePresence>
            {cancellingBooking && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100"
                >
                  <div className="flex items-center gap-2.5 text-rose-600">
                    <Ban className="w-5 h-5" />
                    <h3 className="text-base font-black text-[#0F172A]">Cancel Booking</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Are you sure you want to cancel confirmed booking #{cancellingBooking.bookingId}?
                    The traveler will be notified immediately.
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setCancellingBooking(null)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold cursor-pointer"
                    >
                      Keep Booking
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelSubmit}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black cursor-pointer shadow-xs"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default AgencyCarRentalBookingsPage;

