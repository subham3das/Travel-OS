import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Receipt, Landmark, Sparkles, CheckCircle2 } from 'lucide-react';
import { PaymentSettingsData } from '../../../data/profile';

interface PaymentSettingsCardProps {
  data: PaymentSettingsData;
  isEditing: boolean;
  onChange: (updated: Partial<PaymentSettingsData>) => void;
}

export const PaymentSettingsCard: React.FC<PaymentSettingsCardProps> = ({
  data,
  isEditing,
  onChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <CreditCard className="w-5 h-5 text-emerald-600" />
        <div>
          <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Payment & Tax Settings</h3>
          <p className="text-[11px] font-semibold text-slate-400">GST billing, invoice prefixes, UPI & settlement preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* GST Number */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            GST Registration Number
          </label>
          {isEditing ? (
            <input
              type="text"
              value={data.gstNumber}
              onChange={(e) => onChange({ gstNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
            />
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-extrabold text-[#0F172A]">
              {data.gstNumber}
            </div>
          )}
        </div>

        {/* GST Percentage */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            GST Tax Percentage (%)
          </label>
          {isEditing ? (
            <input
              type="number"
              value={data.gstPercentage}
              onChange={(e) => onChange({ gstPercentage: parseFloat(e.target.value) || 5 })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
            />
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-extrabold text-[#0F172A]">
              {data.gstPercentage}% Standard GST Rate
            </div>
          )}
        </div>

        {/* Invoice Prefix */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Invoice Number Prefix
          </label>
          {isEditing ? (
            <input
              type="text"
              value={data.invoicePrefix}
              onChange={(e) => onChange({ invoicePrefix: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
            />
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-extrabold text-[#0F172A]">
              {data.invoicePrefix}
            </div>
          )}
        </div>

        {/* UPI ID */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Agency UPI ID
          </label>
          {isEditing ? (
            <input
              type="text"
              value={data.upiId}
              onChange={(e) => onChange({ upiId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
            />
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-extrabold text-emerald-700">
              {data.upiId}
            </div>
          )}
        </div>

        {/* Settlement Account */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Primary Settlement Bank Account
          </label>
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 font-extrabold text-emerald-900 flex items-center justify-between">
            <span>{data.settlementAccount}</span>
            <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Active Payouts
            </span>
          </div>
        </div>

        {/* Payment Gateway Status (Future Ready) */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Payment Gateway Integration
          </label>
          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#583BE8]" />
              <span className="font-black text-[#0F172A]">Razorpay & UPI Instant Settlement Gateway</span>
            </div>
            <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
              {data.gatewayStatus}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentSettingsCard;
