import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Printer, CheckCircle2 } from 'lucide-react';
import { AdminPaymentItem } from '../../../types/paymentManagement';

interface PaymentInvoiceModalProps {
  payment: AdminPaymentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentInvoiceModal: React.FC<PaymentInvoiceModalProps> = ({
  payment,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header Bar with Logo + Close */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#6356E5] flex items-center justify-center text-white font-black text-lg shadow-md shadow-[#6356E5]/25">
                T
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0F172A]">Travel OS Global Payments</h3>
                <p className="text-[10px] font-semibold text-slate-400">Electronic Payment Receipt & Tax Voucher</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                title="Print Receipt"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Invoice Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Transaction ID</span>
              <span className="font-mono font-bold text-[#6356E5]">{payment.transactionId}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Booking ID</span>
              <span className="font-mono font-bold text-slate-800">{payment.bookingId}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Date</span>
              <span className="font-bold text-slate-800">{payment.paymentDate}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Status</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
                {payment.paymentStatus}
              </span>
            </div>
          </div>

          {/* Billed To / Agency Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 rounded-2xl p-4 border border-slate-100 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Paid By (Traveler)</span>
              <p className="font-black text-[#0F172A]">{payment.travelerName}</p>
              <p className="text-slate-500">{payment.travelerEmail}</p>
              <p className="text-slate-500">{payment.travelerPhone}</p>
            </div>

            <div className="space-y-1 sm:border-l sm:border-slate-200/80 sm:pl-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Settlement Account</span>
              <p className="font-black text-[#0F172A]">{payment.agencyName}</p>
              <p className="text-slate-500">{payment.settlementAccount}</p>
              <p className="text-slate-500">Gateway: {payment.gateway} ({payment.paymentMethod})</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-100 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                <tr>
                  <th className="py-2.5 px-4">Item & Description</th>
                  <th className="py-2.5 px-3 text-center">Ref</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-extrabold text-[#0F172A]">{payment.packageName}</p>
                    <p className="text-[10px] text-slate-400">{payment.destinationRegion}, {payment.destinationCountry} • {payment.travelDatesText}</p>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-[10px] text-slate-500">
                    {payment.bookingId}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-[#0F172A]">
                    {payment.totalAmount}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-slate-500">Platform Service Fee</td>
                  <td className="py-2 px-3 text-center text-slate-400">—</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-700">{payment.platformFee}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-slate-500">GST on Platform Fee (18%)</td>
                  <td className="py-2 px-3 text-center text-slate-400">—</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-700">{payment.gstAmount}</td>
                </tr>
                {payment.couponDiscount && payment.couponDiscount !== '₹0' && (
                  <tr>
                    <td className="py-2 px-4 text-emerald-600 font-bold">Discount Applied ({payment.couponCode || 'PROMO'})</td>
                    <td className="py-2 px-3 text-center text-slate-400">—</td>
                    <td className="py-2 px-3 text-right font-black text-emerald-600">{payment.couponDiscount}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Grand Total Bar */}
          <div className="flex items-center justify-between p-4 bg-[#EEF2FF] rounded-2xl text-xs font-black">
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Total Captured</span>
              <span className="text-[#6356E5] font-mono text-[11px]">{payment.gatewayTransactionId}</span>
            </div>
            <span className="text-xl font-black text-[#6356E5]">{payment.totalAmount}</span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-semibold">
              Authenticated by {payment.gateway} Gateway. Authorization Code: {payment.authorizationCode}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
