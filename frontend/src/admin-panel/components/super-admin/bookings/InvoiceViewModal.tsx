import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Printer, CheckCircle2, Building2 } from 'lucide-react';
import { AdminBookingItem } from '../../../types/bookingManagement';

interface InvoiceViewModalProps {
  booking: AdminBookingItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !booking) return null;

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
                <h3 className="text-lg font-black text-[#0F172A]">Travel OS Global Inc.</h3>
                <p className="text-[10px] font-semibold text-slate-400">Official Tax Invoice & Receipt</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                title="Print Invoice"
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
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Invoice ID</span>
              <span className="font-mono font-bold text-[#6356E5]">{booking.bookingId.replace('BK-', 'INV-')}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Booking ID</span>
              <span className="font-mono font-bold text-slate-800">{booking.bookingId}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Issue Date</span>
              <span className="font-bold text-slate-800">{booking.bookedAtDate}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Status</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
                {booking.paymentStatus}
              </span>
            </div>
          </div>

          {/* Billed To / Agency Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 rounded-2xl p-4 border border-slate-100 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Billed To (Traveler)</span>
              <p className="font-black text-[#0F172A]">{booking.travelerName}</p>
              <p className="text-slate-500">{booking.travelerEmail}</p>
              <p className="text-slate-500">{booking.travelerPhone}</p>
            </div>

            <div className="space-y-1 sm:border-l sm:border-slate-200/80 sm:pl-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Fulfillment Partner</span>
              <p className="font-black text-[#0F172A]">{booking.agencyName}</p>
              <p className="text-slate-500">{booking.destinationRegion}, {booking.destinationCountry}</p>
              <p className="text-slate-500">Travel: {booking.travelDatesText} ({booking.durationText})</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-100 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                <tr>
                  <th className="py-2.5 px-4">Item & Description</th>
                  <th className="py-2.5 px-3 text-center">Travelers</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-extrabold text-[#0F172A]">{booking.packageName}</p>
                    <p className="text-[10px] text-slate-400">Complete tour package including stay & guided transfers</p>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-700">
                    {1 + booking.additionalTravelersCount}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-[#0F172A]">
                    {booking.basePrice}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-slate-500">Taxes & Regulatory Surcharges (GST 5%)</td>
                  <td className="py-2 px-3 text-center text-slate-400">—</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-700">{booking.taxesAndFees}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-slate-500">Platform Convenience & Protection Fee</td>
                  <td className="py-2 px-3 text-center text-slate-400">—</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-700">{booking.platformFee}</td>
                </tr>
                {booking.discountAmount && booking.discountAmount !== '₹0' && (
                  <tr>
                    <td className="py-2 px-4 text-emerald-600 font-bold">Promotional Discount Voucher ({booking.discountCode || 'PROMO'})</td>
                    <td className="py-2 px-3 text-center text-slate-400">—</td>
                    <td className="py-2 px-3 text-right font-black text-emerald-600">{booking.discountAmount}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Grand Total Bar */}
          <div className="flex items-center justify-between p-4 bg-[#EEF2FF] rounded-2xl text-xs font-black">
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Grand Total Paid</span>
              <span className="text-[#6356E5] font-mono text-[11px]">{booking.paymentMethod} • {booking.transactionId}</span>
            </div>
            <span className="text-xl font-black text-[#6356E5]">{booking.totalAmount}</span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-semibold">
              Electronically generated receipt. Valid without signature.
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
