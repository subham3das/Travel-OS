import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  Download,
  MessageSquare,
  Compass,
  CheckCircle2,
  Copy,
  Car,
  Users,
  Phone,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { bookingService } from '../../services/booking.service';
import apiClient from '../../../services/apiClient';

export const BookingDetailsPage: React.FC = () => {
  const { bookingId, id } = useParams<{ bookingId?: string; id?: string }>();
  const targetBookingId = bookingId || id || '';
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!targetBookingId) {
      setLoading(false);
      return;
    }

    const loadBookingData = async () => {
      setLoading(true);
      try {
        // 1. Try standard booking service first
        try {
          const res = await bookingService.getBookingById(targetBookingId);
          if (isMounted && res) {
            setBooking(res);
            setLoading(false);
            return;
          }
        } catch {
          // Continue to car rental lookup
        }

        // 2. Try car rental booking endpoint
        try {
          const carRes = await apiClient.get<any>(`/car-bookings/${encodeURIComponent(targetBookingId)}`);
          const cb = carRes.data?.data?.booking || carRes.data?.booking || carRes.data;
          if (isMounted && cb) {
            const carObj = cb.carId as any;
            const agencyObj = cb.agencyId as any;
            const isRental =
              cb.serviceType === 'SELF_DRIVE_RENTAL' ||
              cb.serviceType === 'self_drive_car' ||
              cb.serviceType === 'self_drive_bike';

            setBooking({
              id: cb.bookingId || cb._id,
              bookingId: cb.bookingId || cb._id,
              packageName:
                cb.vehicleModel ||
                carObj?.name ||
                cb.vehicleName ||
                (isRental ? 'Self-Drive Vehicle' : 'Route Vehicle'),
              packageThumbnail:
                cb.carThumbnail ||
                carObj?.images?.[0] ||
                carObj?.thumbnail ||
                cb.vehicleImage ||
                'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800',
              agencyName:
                cb.agencyName ||
                agencyObj?.businessName ||
                agencyObj?.name ||
                'ApnaTrip Fleet Partner',
              agencyPhone:
                cb.agencyContactNumber ||
                cb.agencyPhone ||
                agencyObj?.phone ||
                '+91 98765 00000',
              customerName: cb.customerName,
              customerEmail: cb.customerEmail,
              customerPhone: cb.customerPhone,
              travelersCount: cb.passengersCount || 4,
              totalAmount: cb.totalAmount,
              amountPaid: cb.depositPaid,
              remainingAmount: cb.remainingAmount,
              bookingStatus: cb.bookingStatus || cb.status || 'PENDING',
              paymentStatus: cb.paymentStatus || 'DEPOSIT_PAID',
              departureDate: cb.startDate
                ? new Date(cb.startDate).toLocaleDateString()
                : cb.pickupDate
                ? new Date(cb.pickupDate).toLocaleDateString()
                : 'Confirmed',
              returnDate: cb.endDate ? new Date(cb.endDate).toLocaleDateString() : '',
              pickupTime: cb.pickupTime || '10:00 AM',
              pickupLocation: cb.pickupLocation || 'Pickup Hub',
              dropLocation: cb.dropLocation || 'Destination Hub',
              driverId: cb.driverId,
              driverName: cb.driverName || '',
              driverPhone: cb.driverPhone || '',
              driverPhoto: cb.driverPhoto || '',
              driverLicense: cb.driverLicense || '',
              vehicleNumber: cb.vehicleNumber || carObj?.registrationNumber || 'Commercial Fleet',
              vehicleModel:
                cb.vehicleModel ||
                carObj?.name ||
                cb.vehicleName ||
                'Rental Vehicle',
              isCarRental: true,
              timeline: cb.timeline || [],
              associatedTripId: undefined,
              specialNotes: cb.specialNotes || '',
              cancellationPolicy:
                cb.cancellationPolicy ||
                'Free cancellation up to 24 hours prior to scheduled pickup time.',
            });
            setLoading(false);
            return;
          }
        } catch {
          // If car booking lookup also fails
        }

        if (isMounted) {
          setBooking(null);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Failed to load booking details:', err);
        if (isMounted) {
          setBooking(null);
          setLoading(false);
        }
      }
    };

    loadBookingData();
    return () => {
      isMounted = false;
    };
  }, [targetBookingId]);

  const handleCopyId = () => {
    if (!booking) return;
    navigator.clipboard.writeText(booking.bookingId || booking.id);
    setCopied(true);
    showToast('Booking ID copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadInvoice = () => {
    if (!booking) return;
    const invNum = booking.documents?.find((d: any) => d.id?.startsWith('INV'))?.id || `INV-${booking.bookingId || targetBookingId}`;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Pop-up blocked! Allow pop-ups to download invoice.', 'error');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ApnaTrip Tax Invoice - ${invNum}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
          .logo { font-size: 26px; font-weight: 900; color: #2563EB; }
          .badge { display: inline-block; padding: 4px 12px; background: #ecfdf5; color: #059669; border-radius: 999px; font-weight: 700; font-size: 12px; }
          .details { margin: 24px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 13px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 13px; }
          .table th { background: #f8fafc; text-align: left; padding: 12px; border-bottom: 1px solid #cbd5e1; }
          .table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
          .total-box { margin-top: 24px; text-align: right; font-size: 16px; font-weight: 800; color: #0f172a; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <img src="/logo/logo-light.png" alt="ApnaTrip" style="height: 34px; width: auto; object-fit: contain; margin-bottom: 4px; display: block;" />
            <p style="font-size: 12px; color: #64748b; margin: 4px 0;">Official Tax Invoice & Payment Receipt</p>
          </div>
          <div style="text-align: right;">
            <div class="badge">PAID</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 6px;">Invoice: <strong>${invNum}</strong></div>
            <div style="font-size: 12px; color: #64748b;">Date: ${new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>

        <div class="details">
          <div>
            <strong>Billed To:</strong><br>
            ${booking.customerName || 'Customer'}<br>
            ${booking.customerEmail || ''}<br>
            ${booking.customerPhone || ''}
          </div>
          <div style="text-align: right;">
            <strong>Booking Reference:</strong> ${booking.bookingId || targetBookingId}<br>
            <strong>Transaction ID:</strong> ${booking.transactionId || 'Verified'}<br>
            <strong>Payment Method:</strong> ${booking.paymentMethod || 'Razorpay Gateway'}
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity / Travelers</th>
              <th style="text-align: right;">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${booking.packageName}</strong><br><small style="color: #64748b;">Organized by ${booking.agencyName}</small></td>
              <td>${booking.travelersCount || 1}</td>
              <td style="text-align: right;">₹${(booking.totalAmount || 0).toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-box">
          Total Paid: ₹${(booking.totalAmount || 0).toLocaleString('en-IN')}
        </div>

        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="background: #2563EB; color: white; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; cursor: pointer;">
            Print / Save as PDF
          </button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    showToast(`Invoice preview loaded for ${booking.bookingId || targetBookingId}`, 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center space-y-3">
        <div className="w-9 h-9 border-3 border-[#6356E5]/20 border-t-[#6356E5] rounded-full animate-spin" />
        <p className="text-xs font-black text-slate-500">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center font-black text-2xl">
          ✕
        </div>
        <h2 className="text-xl font-black text-[#0F172A]">Booking Not Found</h2>
        <p className="text-xs font-semibold text-slate-500 max-w-sm">
          We could not find booking reference "{targetBookingId}". It may have been archived or cancelled.
        </p>
        <button
          type="button"
          onClick={() => navigate('/my-bookings')}
          className="px-5 py-2.5 rounded-2xl bg-[#6356E5] text-white font-extrabold text-xs cursor-pointer shadow-md hover:bg-[#5245d6] transition-all"
        >
          Go to My Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5] pb-24">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => (window.history.length > 2 ? navigate(-1) : navigate('/my-bookings'))}
            className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-black text-[#0F172A] leading-tight">
              Booking Details
            </h1>
            <p className="text-[11px] font-semibold text-slate-400">
              Ref: <span className="text-[#6356E5] font-extrabold">{booking.bookingId || booking.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyId}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy ID'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-[#0F172A]">
                  Booking Status:
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase">
                  {booking.bookingStatus || 'CONFIRMED'}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-400 pt-0.5">
                Payment: <span className="font-extrabold text-emerald-600">{booking.paymentStatus || 'PAID'}</span>
              </p>
            </div>
          </div>

          <div className="text-right flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Price</span>
            <span className="text-lg font-black text-[#0F172A]">
              ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </motion.div>

        {/* Backend-Driven Booking Timeline (Phase 11) */}
        {booking.timeline && booking.timeline.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#6356E5]" />
                <span>Booking Progress Timeline</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400">Live Status</span>
            </div>
            <div className="relative pl-6 space-y-4 pt-1 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {booking.timeline.map((step: any, index: number) => {
                const isCompleted = step.status === 'completed';
                const isCurrent = step.status === 'current';
                return (
                  <div key={step.id || index} className="relative flex items-start gap-3 text-xs">
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-black ${isCurrent ? 'text-indigo-600' : 'text-[#0F172A]'}`}>
                          {step.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{step.timestamp}</span>
                      </div>
                      {step.subtitle && (
                        <p className="text-[11px] text-slate-500 font-medium">{step.subtitle}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Item Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <img
              src={booking.packageThumbnail || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800'}
              alt={booking.packageName}
              className="w-full sm:w-32 h-28 rounded-2xl object-cover shrink-0 border border-slate-100"
            />
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {booking.isCarRental ? (
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-black">
                    🚗 Car Rental
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-black">
                    🎒 Tour Package
                  </span>
                )}
                <span className="text-xs font-semibold text-slate-400">by {booking.agencyName}</span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-[#0F172A] leading-tight">
                {booking.packageName}
              </h2>

              {booking.isCarRental && booking.pickupLocation && (
                <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0" />
                  <span>{booking.pickupLocation} ➔ {booking.dropLocation || 'Drop Point'}</span>
                </p>
              )}

              <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 pt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#6356E5]" />
                <span>Travel Date: {booking.departureDate}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50">
              <span className="text-[10px] font-black text-slate-400 uppercase block">Travelers</span>
              <span className="font-extrabold text-[#0F172A]">{booking.travelersCount || 1} Person(s)</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50">
              <span className="text-[10px] font-black text-slate-400 uppercase block">Customer</span>
              <span className="font-extrabold text-[#0F172A] truncate block">{booking.customerName || 'Lead Traveler'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50">
              <span className="text-[10px] font-black text-slate-400 uppercase block">Amount Paid</span>
              <span className="font-extrabold text-emerald-600">₹{(booking.amountPaid || booking.totalAmount || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50">
              <span className="text-[10px] font-black text-slate-400 uppercase block">Pending</span>
              <span className="font-extrabold text-[#0F172A]">₹{(booking.remainingAmount || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </motion.div>

        {/* Dedicated Car Rental Specifics Card */}
        {booking.isCarRental && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-white rounded-3xl p-5 border border-sky-100 shadow-2xs space-y-4"
          >
            {/* Confirmation Banner */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-black text-[#0F172A]">
                    {booking.bookingStatus === 'CONFIRMED' || booking.bookingStatus === 'ACCEPTED'
                      ? 'Booking Confirmed'
                      : 'Booking Requested'}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-400">
                    {booking.bookingStatus === 'CONFIRMED' || booking.bookingStatus === 'ACCEPTED'
                      ? 'Chauffeur and vehicle assigned for your trip.'
                      : 'Awaiting agency driver assignment.'}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black ${
                  booking.bookingStatus === 'CONFIRMED' || booking.bookingStatus === 'ACCEPTED'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {booking.bookingStatus === 'CONFIRMED' || booking.bookingStatus === 'ACCEPTED'
                  ? 'CONFIRMED'
                  : 'PENDING ASSIGNMENT'}
              </span>
            </div>

            {/* Driver Details (When confirmed or driver assigned) */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                Driver &amp; Vehicle Assignment
              </h4>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {booking.driverPhoto ? (
                    <img
                      src={booking.driverPhoto}
                      alt={booking.driverName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-xs">
                      {booking.driverName ? booking.driverName.charAt(0).toUpperCase() : '👨‍✈️'}
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-600 block">
                      Assigned Driver
                    </span>
                    <h4 className="text-sm font-black text-[#0F172A]">
                      {booking.driverName || 'Driver assignment in progress'}
                    </h4>
                    {booking.driverPhone && (
                      <p className="text-xs font-mono font-semibold text-slate-500">
                        {booking.driverPhone}
                      </p>
                    )}
                    {booking.driverLicense && (
                      <p className="text-[10px] font-semibold text-slate-400">
                        License: {booking.driverLicense}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Action: Call Driver Button */}
                {booking.driverPhone && (
                  <a
                    href={`tel:${booking.driverPhone}`}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xs shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Driver</span>
                  </a>
                )}
              </div>

              {/* Vehicle & Trip Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-400 block pb-0.5">
                    Vehicle Model
                  </span>
                  <span className="font-extrabold text-[#0F172A] block truncate">
                    {booking.vehicleModel || booking.packageName || 'Rental Vehicle'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-400 block pb-0.5">
                    Vehicle Number
                  </span>
                  <span className="font-extrabold text-[#0F172A] font-mono block truncate">
                    {booking.vehicleNumber || 'Commercial Fleet'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-400 block pb-0.5">
                    Pickup Time
                  </span>
                  <span className="font-extrabold text-[#0F172A] block truncate">
                    {booking.departureDate} • {booking.pickupTime || '10:00 AM'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-400 block pb-0.5">
                    Agency Contact
                  </span>
                  <span className="font-extrabold text-[#0F172A] block truncate">
                    {booking.agencyName || 'ApnaTrip Partner'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 block truncate">
                    {booking.agencyPhone}
                  </span>
                </div>
              </div>

              {/* Direct Communication Buttons: Call Driver, Call Agency, WhatsApp Agency */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                {booking.driverPhone && (
                  <a
                    href={`tel:${booking.driverPhone}`}
                    className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Driver</span>
                  </a>
                )}
                {booking.agencyPhone && (
                  <a
                    href={`tel:${booking.agencyPhone}`}
                    className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#583BE8]" />
                    <span>Call Agency</span>
                  </a>
                )}
                {booking.agencyPhone && (
                  <a
                    href={`https://wa.me/${(booking.agencyPhone || '').replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Agency</span>
                  </a>
                )}
              </div>
            </div>

            {booking.specialNotes && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-0.5">
                <span className="text-[10px] font-black uppercase text-slate-400 block">
                  Special Requests
                </span>
                <p className="font-semibold text-slate-700">{booking.specialNotes}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Payment Details Card (Phase 10) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.09 }}
          className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                Payment & Billing Information
              </h3>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border ${
                booking.paymentStatus === 'PAID' || booking.bookingStatus === 'CONFIRMED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : booking.paymentStatus === 'REFUNDED'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : booking.paymentStatus === 'FAILED'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {booking.paymentStatus === 'PAID' || booking.bookingStatus === 'CONFIRMED'
                ? '✓ Paid & Verified'
                : booking.paymentStatus || 'Pending'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-black uppercase text-slate-400 block pb-0.5">Gateway</span>
              <span className="font-extrabold text-[#0F172A] block">Razorpay</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-black uppercase text-slate-400 block pb-0.5">Method</span>
              <span className="font-extrabold text-[#0F172A] block">{booking.paymentMethod || 'Razorpay Checkout'}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-black uppercase text-slate-400 block pb-0.5">Transaction ID</span>
              <span className="font-extrabold text-slate-700 font-mono text-[11px] truncate block" title={booking.transactionId || 'pay_verified'}>
                {booking.transactionId || 'pay_verified'}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-black uppercase text-slate-400 block pb-0.5">Total Amount</span>
              <span className="font-extrabold text-emerald-600 block">₹{(booking.totalAmount || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </motion.div>

        {/* Action Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {booking.isCarRental ? (
            <a
              href={`tel:${booking.driverPhone || '+919876544321'}`}
              className="py-3 px-4 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-xs shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call Driver</span>
            </a>
          ) : booking.associatedTripId ? (
            <button
              type="button"
              onClick={() => navigate(`/trips/${booking.associatedTripId}`)}
              className="py-3 px-4 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white font-black text-xs shadow-md shadow-[#6356E5]/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>View Full Trip</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="py-3 px-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download Invoice</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/chat')}
            className="py-3 px-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <MessageSquare className="w-4 h-4 text-purple-600" />
            <span>{booking.isCarRental ? 'Contact Provider' : 'Contact Agency'}</span>
          </button>
        </motion.div>
      </main>
    </div>
  );
};

export default BookingDetailsPage;
