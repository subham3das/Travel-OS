import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileText,
  Edit,
  ChevronDown,
  User,
  CreditCard,
  History,
  Send,
  Download,
  Share2,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { AdminBookingItem } from '../../../types/bookingManagement';

interface BookingDetailsDrawerProps {
  booking: AdminBookingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onViewInvoice: (booking: AdminBookingItem) => void;
  onModify: (booking: AdminBookingItem) => void;
  onConfirm: (booking: AdminBookingItem) => void;
  onCancel: (booking: AdminBookingItem) => void;
  onRefund: (booking: AdminBookingItem) => void;
}

export const BookingDetailsDrawer: React.FC<BookingDetailsDrawerProps> = ({
  booking,
  isOpen,
  onClose,
  onViewInvoice,
  onModify,
  onConfirm,
  onCancel,
  onRefund,
}) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Travelers' | 'Payments' | 'Activity' | 'Timeline'>('Overview');
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  if (!isOpen || !booking) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.25 }}
        className="w-full xl:w-[410px] shrink-0 bg-white rounded-3xl border border-slate-100/90 shadow-sm flex flex-col h-auto max-h-[calc(100vh-140px)] overflow-hidden sticky top-24 select-none"
      >
        {/* ── 1. DRAWER TOP HEADER ── */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Booking ID</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200">
                {booking.bookingStatus}
              </span>
            </div>
            <h2 className="text-base font-black text-[#0F172A] tracking-tight font-mono mt-0.5">
              {booking.bookingId}
            </h2>
            <p className="text-[10px] font-semibold text-slate-400">
              Booked on {booking.bookedAtDate} • {booking.bookedAtTime}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── 2. PACKAGE PREVIEW CARD ── */}
        <div className="p-3.5 bg-slate-50/80 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={booking.packageThumbnail}
              alt={booking.packageName}
              className="w-16 h-14 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-black text-[#0F172A] truncate">
                {booking.packageName}
              </h3>
              <p className="text-[11px] font-bold text-slate-500 truncate">
                {booking.destinationRegion || booking.destinationCountry}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500 font-semibold">
                <img
                  src={booking.agencyLogo}
                  alt={booking.agencyName}
                  className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
                />
                <span className="truncate">{booking.agencyName}</span>
                {booking.isAgencyVerified && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200/60 text-[10px] font-bold text-slate-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{booking.travelDatesText}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{booking.durationText}</span>
            </span>
          </div>
        </div>

        {/* ── 3. DRAWER TABS ── */}
        <div className="flex items-center border-b border-slate-100 px-4 bg-white shrink-0 overflow-x-auto scrollbar-none">
          {(['Overview', 'Travelers', 'Payments', 'Activity', 'Timeline'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-2.5 text-xs font-black border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[#6356E5] text-[#6356E5]'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── 4. DRAWER CONTENT AREA (SCROLLABLE) ── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <>
              {/* Booking Summary Box */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                  Booking Summary
                </h4>
                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Users</span>
                      <span className="font-extrabold text-[#0F172A] block truncate">
                        {booking.travelerName}{' '}
                        {booking.additionalTravelersCount > 0 && (
                          <span className="text-slate-400 text-[10px]">
                            (+{booking.additionalTravelersCount} More)
                          </span>
                        )}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Payment Status</span>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Travelers</span>
                      <span className="font-extrabold text-[#0F172A] block">{booking.travelersSummary}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Booking Status</span>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {booking.bookingStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Total Amount</span>
                      <span className="font-black text-[#0F172A] text-sm block">{booking.totalAmount}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Booking Source</span>
                      <span className="font-bold text-slate-700 block">{booking.bookingSource}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                  Payment Details
                </h4>
                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Payment Method</span>
                      <span className="font-extrabold text-[#0F172A] block">{booking.paymentMethod}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Transaction ID</span>
                      <span className="font-mono text-[10px] font-bold text-slate-700 block truncate">
                        {booking.transactionId}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Paid Amount</span>
                      <span className="font-black text-[#0F172A] block">{booking.paidAmount}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Payment Date</span>
                      <span className="font-semibold text-slate-600 text-[10px] block">
                        {booking.paidDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                  Price Breakdown
                </h4>
                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-1.5 text-xs font-semibold">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Base Price</span>
                    <span className="font-bold text-[#0F172A]">{booking.basePrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Taxes & Fees</span>
                    <span className="font-bold text-[#0F172A]">{booking.taxesAndFees}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Platform Fee</span>
                    <span className="font-bold text-[#0F172A]">{booking.platformFee}</span>
                  </div>
                  {booking.discountAmount && booking.discountAmount !== '₹0' && (
                    <div className="flex items-center justify-between text-emerald-600 font-bold">
                      <span>Discount ({booking.discountCode || 'PROMO'})</span>
                      <span>{booking.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-sm font-black text-[#0F172A]">
                    <span>Total Amount</span>
                    <span className="text-[#6356E5]">{booking.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                  Quick Actions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onViewInvoice(booking)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Invoice</span>
                  </button>

                  <button
                    onClick={() => onRefund(booking)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-700 text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Refund Booking</span>
                  </button>

                  <button
                    onClick={() => onModify(booking)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Modify Booking</span>
                  </button>

                  <button
                    onClick={() => onCancel(booking)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Booking</span>
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    <span>More Actions</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isMoreActionsOpen && (
                    <div className="mt-1.5 w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 select-none space-y-0.5">
                      <button
                        onClick={() => {
                          setIsMoreActionsOpen(false);
                          onViewInvoice(booking);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 text-left"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-400" />
                        <span>Download Voucher & Tickets</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsMoreActionsOpen(false);
                          alert(`Resent confirmation email to ${booking.travelerEmail}`);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 text-left"
                      >
                        <Send className="w-3.5 h-3.5 text-slate-400" />
                        <span>Resend Confirmation Email</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsMoreActionsOpen(false);
                          alert(`WhatsApp confirmation dispatched to ${booking.travelerPhone}`);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 text-left"
                      >
                        <Share2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Resend WhatsApp Confirmation</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: TRAVELERS */}
          {activeTab === 'Travelers' && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-[#0F172A]">
                Traveler Details ({booking.travelers.length})
              </h4>
              {booking.travelers.map((t, idx) => (
                <div
                  key={t.id || idx}
                  className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-100 text-[#6356E5] flex items-center justify-center font-bold text-xs">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-extrabold text-[#0F172A]">{t.name}</p>
                        <p className="text-[10px] text-slate-400">{t.age} Yrs • {t.gender}</p>
                      </div>
                    </div>
                    {t.isPrimary && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#6356E5] text-white">
                        Primary
                      </span>
                    )}
                  </div>
                  {t.passportNumber && (
                    <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-600 flex justify-between">
                      <span className="text-slate-400">Passport Number</span>
                      <span className="font-mono font-bold">{t.passportNumber}</span>
                    </div>
                  )}
                  {t.phone && (
                    <div className="text-[10px] text-slate-600 flex justify-between">
                      <span className="text-slate-400">Phone</span>
                      <span className="font-bold">{t.phone}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PAYMENTS */}
          {activeTab === 'Payments' && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-[#0F172A]">Payment History</h4>
              <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#6356E5]" />
                    <span className="font-extrabold text-[#0F172A]">{booking.paymentMethod}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200">
                    {booking.paymentStatus}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transaction ID:</span>
                    <span className="font-mono font-bold">{booking.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Captured Amount:</span>
                    <span className="font-black text-[#0F172A]">{booking.paidAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Timestamp:</span>
                    <span className="font-medium">{booking.paidDate}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVITY */}
          {activeTab === 'Activity' && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-[#0F172A]">Booking Activity Log</h4>
              <div className="relative pl-4 space-y-4 border-l-2 border-slate-100">
                {booking.activities.map((a) => (
                  <div key={a.id} className="relative space-y-0.5">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#6356E5] ring-4 ring-white" />
                    <p className="text-xs font-black text-[#0F172A]">{a.action}</p>
                    <p className="text-[11px] font-semibold text-slate-500">{a.details}</p>
                    <p className="text-[10px] font-semibold text-slate-400">{a.timestamp} • by {a.actor}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TIMELINE */}
          {activeTab === 'Timeline' && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-[#0F172A]">Trip Timeline</h4>
              <div className="relative pl-4 space-y-4 border-l-2 border-slate-100">
                {booking.timeline.map((step) => (
                  <div key={step.id} className="relative space-y-0.5">
                    <div
                      className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                        step.status === 'completed'
                          ? 'bg-emerald-500'
                          : step.status === 'current'
                          ? 'bg-[#6356E5]'
                          : 'bg-slate-300'
                      }`}
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-[#0F172A]">{step.title}</p>
                      {step.timestamp && (
                        <span className="text-[10px] font-semibold text-slate-400">{step.timestamp}</span>
                      )}
                    </div>
                    {step.subtitle && (
                      <p className="text-[11px] font-semibold text-slate-500">{step.subtitle}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
