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
  ChevronDown,
  User,
  CreditCard,
  History,
  Send,
  Download,
  Share2,
  ExternalLink,
  ShieldCheck,
  Building2,
  ArrowRight,
  AlertTriangle,
  Receipt,
  Layers,
  Banknote,
  DollarSign,
  Briefcase,
  Eye,
} from 'lucide-react';
import { AdminPaymentItem } from '../../../types/paymentManagement';

interface PaymentDrawerProps {
  payment: AdminPaymentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onViewInvoice: (payment: AdminPaymentItem) => void;
  onRefund: (payment: AdminPaymentItem) => void;
  onApproveSettlement: (payment: AdminPaymentItem) => void;
  onVerifyGateway: (payment: AdminPaymentItem) => void;
}

export const PaymentDrawer: React.FC<PaymentDrawerProps> = ({
  payment,
  isOpen,
  onClose,
  onViewInvoice,
  onRefund,
  onApproveSettlement,
  onVerifyGateway,
}) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Settlement Breakdown' | 'Gateway Logs' | 'Audit Trail' | 'Invoice'>('Overview');
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  if (!isOpen || !payment) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Drawer Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full sm:w-[480px] md:w-[500px] h-full bg-[#F8F9FC] shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* ── 1. DRAWER TOP HEADER ── */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transaction</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200">
                    {payment.paymentStatus}
                  </span>
                </div>
                <h2 className="text-base font-black text-[#0F172A] tracking-tight font-mono mt-0.5">
                  {payment.transactionId}
                </h2>
                <p className="text-[10px] font-semibold text-slate-400">
                  {payment.date} • {payment.time}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── 2. AGENCY & BOOKING SUMMARY CARD ── */}
            <div className="p-3.5 bg-white border-b border-slate-100 shrink-0 shadow-2xs">
              <div className="flex items-center gap-3">
                <img
                  src={payment.agencyLogo}
                  alt={payment.agencyName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-black text-[#0F172A] truncate">
                      {payment.agencyName}
                    </h3>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 truncate">
                    {payment.packageName}
                  </p>
                  <p className="text-[10px] font-mono text-purple-600 font-bold mt-0.5">
                    Booking: {payment.bookingId}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-600">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>{payment.travelerName}</span>
                </span>
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-slate-400" />
                  <span>{payment.gateway} ({payment.paymentMethod})</span>
                </span>
              </div>
            </div>

            {/* ── 3. DRAWER TABS ── */}
            <div className="flex items-center border-b border-slate-200/80 bg-white px-4 shrink-0 overflow-x-auto scrollbar-none">
              {(['Overview', 'Settlement Breakdown', 'Gateway Logs', 'Audit Trail', 'Invoice'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-2.5 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-px whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-[#6356E5] text-[#6356E5] font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
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
                  {/* Financial Breakdown Card */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
                    <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                      Financial Breakdown
                    </h4>
                    <div className="space-y-2 text-xs font-semibold">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Total Paid Amount (Gross)</span>
                        <span className="font-black text-[#0F172A] text-sm">{payment.totalAmount}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Platform Commission ({payment.commissionRate})</span>
                        <span className="font-extrabold text-[#6356E5]">{payment.platformFee}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Taxes Collected ({payment.taxRate})</span>
                        <span className="font-bold text-slate-700">{payment.taxAmount}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Gateway Processing Fee</span>
                        <span className="font-bold text-slate-700">{payment.gatewayFee}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-black text-[#0F172A]">
                        <span>Net Payable to Agency</span>
                        <span className="text-emerald-600 font-extrabold text-sm">{payment.agencyPayout}</span>
                      </div>
                    </div>
                  </div>

                  {/* Settlement Status Card */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-2.5">
                    <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                      Agency Settlement Status
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block">Settlement Status</span>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200">
                            {payment.settlementStatus}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block">Settlement ID</span>
                          <span className="font-mono text-[10px] font-bold text-slate-700 block truncate mt-0.5">
                            {payment.settlementId || 'SET-PENDING'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block">Settlement Date</span>
                          <span className="font-semibold text-slate-700 text-[10px] block mt-0.5">
                            {payment.settlementDate || 'Scheduled next cycle'}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block">Agency Bank</span>
                          <span className="font-bold text-slate-700 text-[10px] block mt-0.5">
                            {payment.bankAccount || 'HDFC Bank •••• 4821'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-2">
                    <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                      Customer Information
                    </h4>
                    <div className="space-y-1.5 text-xs font-semibold">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Customer Name</span>
                        <span className="font-bold text-[#0F172A]">{payment.travelerName}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Email</span>
                        <span className="font-bold text-slate-700">{payment.travelerEmail}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Phone</span>
                        <span className="font-bold text-slate-700">{payment.travelerPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action CTAs */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-2.5">
                    <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                      Quick Operational Actions
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onViewInvoice(payment)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>View Invoice</span>
                      </button>

                      <button
                        onClick={() => onRefund(payment)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-700 text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Process Refund</span>
                      </button>

                      <button
                        onClick={() => onApproveSettlement(payment)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-700 text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Payout</span>
                      </button>

                      <button
                        onClick={() => onVerifyGateway(payment)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-700 text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify Gateway</span>
                      </button>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        <span>More Actions</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      {isMoreActionsOpen && (
                        <div className="mt-1.5 w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 select-none space-y-0.5">
                          <button
                            onClick={() => {
                              setIsMoreActionsOpen(false);
                              onViewInvoice(payment);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 text-left"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-400" />
                            <span>Download Tax Invoice (GST)</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsMoreActionsOpen(false);
                              alert(`Gateway transaction statement fetched for ${payment.transactionId}`);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 text-left"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span>Download Gateway Raw Payload</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: SETTLEMENT BREAKDOWN */}
              {activeTab === 'Settlement Breakdown' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black text-[#0F172A]">Settlement Calculation</h4>
                  <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Gross Traveler Payment:</span>
                      <span className="font-black text-[#0F172A]">{payment.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-purple-700 font-semibold">
                      <span>- Platform Commission ({payment.commissionRate}):</span>
                      <span>{payment.platformFee}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>- GST on Commission (18%):</span>
                      <span>₹{(parseFloat(payment.platformFee.replace(/[^0-9.]/g, '')) * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>- TDS (1% u/s 194O):</span>
                      <span>₹{(parseFloat(payment.totalAmount.replace(/[^0-9.]/g, '')) * 0.01).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-purple-200 text-sm font-black text-emerald-700">
                      <span>Final Net Disbursement:</span>
                      <span>{payment.agencyPayout}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: GATEWAY LOGS */}
              {activeTab === 'Gateway Logs' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black text-[#0F172A]">Payment Gateway Raw Telemetry</h4>
                  <div className="p-3 bg-slate-900 rounded-xl text-[11px] font-mono text-emerald-400 space-y-1 overflow-x-auto">
                    <p>&#123;</p>
                    <p className="pl-4">"gateway": "{payment.gateway}",</p>
                    <p className="pl-4">"transaction_id": "{payment.transactionId}",</p>
                    <p className="pl-4">"status": "captured",</p>
                    <p className="pl-4">"method": "{payment.paymentMethod}",</p>
                    <p className="pl-4">"currency": "INR",</p>
                    <p className="pl-4">"amount": "{payment.totalAmount}",</p>
                    <p className="pl-4">"webhook_verified": true,</p>
                    <p className="pl-4">"gateway_reference": "pay_9f2kX92l1mn"</p>
                    <p>&#125;</p>
                  </div>
                </div>
              )}

              {/* TAB 4: AUDIT TRAIL */}
              {activeTab === 'Audit Trail' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black text-[#0F172A]">Payment Audit Trail</h4>
                  <div className="relative pl-4 space-y-4 border-l-2 border-slate-100">
                    <div className="relative space-y-0.5">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                      <p className="text-xs font-black text-[#0F172A]">Payment Captured & Reconciled</p>
                      <p className="text-[10px] font-semibold text-slate-400">{payment.date} {payment.time} • Razorpay Webhook</p>
                    </div>
                    <div className="relative space-y-0.5">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#6356E5] ring-4 ring-white" />
                      <p className="text-xs font-black text-[#0F172A]">Commission & Tax Splitting</p>
                      <p className="text-[10px] font-semibold text-slate-400">Automated Ledger Posting</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: INVOICE */}
              {activeTab === 'Invoice' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3 text-center">
                  <FileText className="w-8 h-8 text-[#6356E5] mx-auto" />
                  <h4 className="text-xs font-black text-[#0F172A]">GST Tax Invoice Ready</h4>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Invoice #INV-2024-{payment.transactionId.replace(/[^0-9]/g, '') || '9821'} is available for instant download.
                  </p>
                  <button
                    onClick={() => onViewInvoice(payment)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6356E5] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>View & Download Invoice</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
