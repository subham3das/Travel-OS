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
  CreditCard,
  ChevronDown,
  User,
  Users,
  Download,
  Building2,
  ExternalLink,
  ShieldCheck,
  Send,
  Share2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminPaymentItem } from '../../../types/paymentManagement';

interface PaymentDrawerProps {
  payment: AdminPaymentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onViewInvoice: (payment: AdminPaymentItem) => void;
  onApproveSettlement: (payment: AdminPaymentItem) => void;
  onRejectSettlement: (payment: AdminPaymentItem) => void;
  onRefund: (payment: AdminPaymentItem) => void;
}

export const PaymentDrawer: React.FC<PaymentDrawerProps> = ({
  payment,
  isOpen,
  onClose,
  onViewInvoice,
  onApproveSettlement,
  onRejectSettlement,
  onRefund,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Travelers' | 'Payments' | 'Timeline' | 'Activity'>('Overview');
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  if (!isOpen || !payment) return null;

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
              <span className="text-[10px] font-bold text-slate-400 uppercase">Transaction ID</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200">
                {payment.paymentStatus}
              </span>
            </div>
            <h2 className="text-base font-black text-[#0F172A] tracking-tight font-mono mt-0.5">
              {payment.transactionId}
            </h2>
            <p className="text-[10px] font-semibold text-slate-400">
              Booking ID: <span className="font-bold text-slate-700">{payment.bookingId}</span> • Paid on {payment.paymentDate} • {payment.paymentTime}
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
              src={payment.packageThumbnail}
              alt={payment.packageName}
              className="w-16 h-14 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-black text-[#0F172A] truncate">
                {payment.packageName}
              </h3>
              <p className="text-[11px] font-bold text-slate-500 truncate">
                {payment.destinationRegion}, {payment.destinationCountry}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500 font-semibold">
                <img
                  src={payment.agencyLogo}
                  alt={payment.agencyName}
                  className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
                />
                <span className="truncate">{payment.agencyName}</span>
                {payment.isAgencyVerified && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200/60 text-[10px] font-bold text-slate-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{payment.travelDatesText}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{payment.durationText}</span>
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Users className="w-3 h-3 text-slate-400" />
              <span>{payment.travelersCountText}</span>
            </span>
          </div>
        </div>

        {/* ── 3. DRAWER TABS ── */}
        <div className="flex items-center border-b border-slate-100 px-4 bg-white shrink-0 overflow-x-auto scrollbar-none">
          {(['Overview', 'Travelers', 'Payments', 'Timeline', 'Activity'] as const).map((tab) => (
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
              {/* Payment Summary Box */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                  Payment Summary
                </h4>
                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-2 text-xs font-semibold">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Payment Status</span>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {payment.paymentStatus}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Total Amount</span>
                      <span className="font-black text-[#0F172A] block">{payment.totalAmount}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Settlement Status</span>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                        {payment.settlementStatus}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Platform Fee</span>
                      <span className="font-bold text-slate-800 block">{payment.platformFee}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Booking Status</span>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {payment.bookingStatus}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">GST (18%)</span>
                      <span className="font-bold text-slate-800 block">{payment.gstAmount}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Payment Method</span>
                      <span className="font-bold text-slate-800 block truncate">{payment.paymentMethod}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Coupon Discount</span>
                      <span className="font-bold text-emerald-600 block">{payment.couponDiscount || '₹0'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Gateway</span>
                      <span className="font-bold text-slate-800 block">{payment.gateway}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Net Amount</span>
                      <span className="font-black text-[#0F172A] block">{payment.netAmount}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Currency</span>
                      <span className="font-bold text-slate-800 block">{payment.currency}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Agency Earnings</span>
                      <span className="font-black text-emerald-600 block">{payment.agencyEarnings}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gateway Details */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                  Gateway Details
                </h4>
                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Transaction ID (Gateway)</span>
                    <span className="font-mono text-slate-700 font-bold">{payment.gatewayTransactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Payment Reference</span>
                    <span className="font-mono text-slate-700 font-bold">{payment.paymentReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Gateway Response</span>
                    <span className="text-emerald-600 font-bold">{payment.gatewayResponse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Authorization Code</span>
                    <span className="font-mono text-slate-700 font-bold">{payment.authorizationCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Paid At</span>
                    <span className="text-slate-700 font-bold">{payment.paidAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Captured At</span>
                    <span className="text-slate-700 font-bold">{payment.capturedAt}</span>
                  </div>
                </div>
              </div>

              {/* Settlement Details */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                  Settlement Details
                </h4>
                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Settlement ID</span>
                    <span className="font-mono text-slate-700 font-bold">{payment.settlementId || 'SETT-59221'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Scheduled Settlement</span>
                    <span className="text-slate-700 font-bold">{payment.scheduledSettlementDate || 'Jun 15, 2024'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Settlement Account</span>
                    <span className="text-slate-700 font-bold">{payment.settlementAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Remarks</span>
                    <span className="text-slate-500 font-medium">{payment.settlementRemarks || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                  Quick Actions
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => navigate('/admin/bookings')}
                    className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-[#6356E5] text-[11px] font-extrabold transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Booking</span>
                  </button>

                  <button
                    onClick={() => navigate('/admin/users')}
                    className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-700 text-[11px] font-extrabold transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>View Traveler</span>
                  </button>

                  <button
                    onClick={() => navigate('/admin/agencies')}
                    className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-700 text-[11px] font-extrabold transition-colors cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>View Agency</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onViewInvoice(payment)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-700 text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Invoice</span>
                  </button>

                  <button
                    onClick={() => onRefund(payment)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Refund Payment</span>
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
                          onApproveSettlement(payment);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-emerald-50 text-emerald-600 text-xs font-bold text-left"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Force Approve Settlement</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsMoreActionsOpen(false);
                          onRejectSettlement(payment);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-bold text-left"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Put Settlement On Hold</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsMoreActionsOpen(false);
                          alert(`Resent payment receipt to ${payment.travelerEmail}`);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 text-left"
                      >
                        <Send className="w-3.5 h-3.5 text-slate-400" />
                        <span>Email Receipt to Customer</span>
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
              <h4 className="text-xs font-black text-[#0F172A]">Traveler Profile</h4>
              <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={payment.travelerAvatar}
                    alt={payment.travelerName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                  />
                  <div>
                    <p className="font-extrabold text-[#0F172A]">{payment.travelerName}</p>
                    <p className="text-[11px] text-slate-500">{payment.travelerEmail}</p>
                    <p className="text-[10px] text-slate-400">{payment.travelerPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENTS */}
          {activeTab === 'Payments' && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-[#0F172A]">Payment Gateway Ledger</h4>
              <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Gateway Fee (2%):</span>
                  <span className="font-bold text-slate-700">₹580</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GST on Gateway Fee:</span>
                  <span className="font-bold text-slate-700">₹104</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/60 pt-2 font-black text-[#0F172A]">
                  <span>Net Platform Inflow:</span>
                  <span className="text-[#6356E5]">{payment.platformFee}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TIMELINE */}
          {activeTab === 'Timeline' && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-[#0F172A]">Transaction Timeline</h4>
              <div className="relative pl-4 space-y-4 border-l-2 border-slate-100">
                {payment.timeline.map((step) => (
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

          {/* TAB 5: ACTIVITY */}
          {activeTab === 'Activity' && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-[#0F172A]">Activity Log</h4>
              <div className="relative pl-4 space-y-4 border-l-2 border-slate-100">
                {payment.activities.map((a) => (
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
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
