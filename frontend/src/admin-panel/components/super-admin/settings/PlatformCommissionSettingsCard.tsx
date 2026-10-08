import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Percent,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Save,
  HelpCircle,
  RefreshCw,
  Coins,
  History,
} from 'lucide-react';
import { adminApiClient } from '../../../services/adminApiClient';

export const PlatformCommissionSettingsCard: React.FC = () => {
  const [commType, setCommType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [rate, setRate] = useState<number>(10);
  const [taxRate, setTaxRate] = useState<number>(18);
  const [settlementCycle, setSettlementCycle] = useState('T+2');
  const [isAutoTransferEnabled, setIsAutoTransferEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await adminApiClient.get<any>('/admin/settings/commission');
      if (res?.data) {
        setCommType(res.data.type || 'PERCENTAGE');
        setRate(typeof res.data.rate === 'number' ? res.data.rate : 10);
        setTaxRate(res.data.taxRate || 18);
        setSettlementCycle(res.data.settlementCycle || 'T+2');
        setIsAutoTransferEnabled(res.data.isAutoTransferEnabled ?? true);
      }
    } catch (err: any) {
      console.warn('Failed to load commission settings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      await adminApiClient.patch('/admin/settings/commission', {
        type: commType,
        rate: Number(rate),
        taxRate: Number(taxRate),
        settlementCycle,
        isAutoTransferEnabled,
      });
      setMessage({
        text: `Platform commission updated to ${rate}${commType === 'PERCENTAGE' ? '%' : ' INR'}. Future bookings will use this rate.`,
        type: 'success',
      });
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        text: err?.response?.data?.message || err.message || 'Failed to update commission settings.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100/90 shadow-2xs space-y-6 select-none font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#583BE8]">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#0F172A]">Platform Commission Engine</h3>
            <p className="text-xs font-semibold text-slate-400">
              Dynamic marketplace fee split applied on customer bookings
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadSettings}
          disabled={loading}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          title="Refresh Settings"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Commission Type & Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
          <div>
            <label className="text-slate-700 block mb-1.5">Fee Calculation Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCommType('PERCENTAGE')}
                className={`py-2.5 px-3 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                  commType === 'PERCENTAGE'
                    ? 'bg-[#583BE8] text-white shadow-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Percentage (%)
              </button>
              <button
                type="button"
                onClick={() => setCommType('FIXED')}
                className={`py-2.5 px-3 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                  commType === 'FIXED'
                    ? 'bg-[#583BE8] text-white shadow-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Fixed Amount (₹)
              </button>
            </div>
          </div>

          <div>
            <label className="text-slate-700 block mb-1.5">
              Platform Fee {commType === 'PERCENTAGE' ? '(Percentage %)' : '(Flat INR ₹)'} *
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max={commType === 'PERCENTAGE' ? '50' : '100000'}
                step="0.5"
                required
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 font-extrabold text-sm focus:outline-none focus:border-[#583BE8] transition-colors"
              />
              <span className="absolute right-4 top-3 text-xs font-black text-slate-400">
                {commType === 'PERCENTAGE' ? '%' : 'INR'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">
              Standard marketplace default is 10% platform fee.
            </p>
          </div>

          <div>
            <label className="text-slate-700 block mb-1.5">Applicable GST / Tax Rate (%)</label>
            <input
              type="number"
              min="0"
              max="28"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 18)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 font-extrabold focus:outline-none focus:border-[#583BE8] transition-colors"
            />
          </div>

          <div>
            <label className="text-slate-700 block mb-1.5">Route Settlement Payout Cycle</label>
            <select
              value={settlementCycle}
              onChange={(e) => setSettlementCycle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 font-extrabold focus:outline-none focus:border-[#583BE8] transition-colors"
            >
              <option value="T+1">T+1 Day (Next Day Settlement)</option>
              <option value="T+2">T+2 Days (Standard Route Cycle)</option>
              <option value="T+3">T+3 Days</option>
              <option value="Weekly">Weekly (Every Monday)</option>
            </select>
          </div>
        </div>

        {/* Phase 3 Versioning Notice */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3 text-xs">
          <History className="w-4 h-4 text-[#583BE8] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-black text-indigo-950">Permanent Financial Snapshot Guarantee</span>
            <p className="text-slate-600 font-medium leading-relaxed">
              Updating this setting updates the active platform commission for future bookings. Every booking permanently stores its versioned commission rate, fee, and receivable breakdown forever.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#472ec4] text-white font-black text-xs shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating Engine...' : 'Save Commission Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
