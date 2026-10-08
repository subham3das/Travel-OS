import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Building2,
  Phone,
  Mail,
  Car,
  Users,
  DollarSign,
  Star,
  Award,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface OwnerProfileDrawerProps {
  isOpen: boolean;
  owner: any | null;
  onClose: () => void;
  onSelectVehicle?: (carId: string) => void;
}

export const OwnerProfileDrawer: React.FC<OwnerProfileDrawerProps> = ({
  isOpen,
  owner,
  onClose,
  onSelectVehicle,
}) => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'drivers' | 'performance'>('vehicles');

  if (!isOpen || !owner) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full max-w-xl bg-white shadow-2xl flex flex-col h-full z-10 select-none overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#583BE8] to-purple-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-[#583BE8]/20">
                {owner.name?.[0] || 'O'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-[#0F172A]">{owner.name}</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Verified Partner
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {owner.businessName || 'Fleet Operations Partner'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contact Details Bar */}
          <div className="px-6 py-3 bg-white border-b border-slate-100 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-semibold">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{owner.phone || '+91 98201 44510'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 font-semibold">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{owner.email || 'partner@apnatrip.in'}</span>
            </div>
          </div>

          {/* Metrics Ribbon */}
          <div className="p-6 grid grid-cols-3 gap-3 border-b border-slate-100 bg-slate-50/40">
            <div className="p-3 rounded-2xl bg-white border border-slate-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Fleet Count</span>
              <span className="text-lg font-black text-[#0F172A]">{owner.vehiclesCount || owner.vehicles?.length || 1}</span>
              <span className="text-[9px] text-slate-400 font-bold block">Vehicles</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Trips</span>
              <span className="text-lg font-black text-[#583BE8]">{owner.totalTrips || 48}</span>
              <span className="text-[9px] text-slate-400 font-bold block">Completed</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Partner Rating</span>
              <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-lg">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>{owner.rating || 4.9}</span>
              </div>
              <span className="text-[9px] text-slate-400 font-bold block">Satisfaction</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100 px-6 gap-6 text-xs font-bold text-slate-400">
            {[
              { id: 'vehicles', label: `Assigned Vehicles (${owner.vehicles?.length || 1})` },
              { id: 'performance', label: 'Revenue & Performance' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`py-3.5 border-b-2 font-black transition-all cursor-pointer ${
                  activeTab === t.id
                    ? 'border-[#583BE8] text-[#583BE8]'
                    : 'border-transparent hover:text-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Body List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeTab === 'vehicles' && (
              <div className="space-y-3">
                {(owner.vehicles && owner.vehicles.length > 0 ? owner.vehicles : [owner]).map((v: any, idx: number) => (
                  <div
                    key={v._id || idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0">
                        {v.thumbnail ? (
                          <img src={v.thumbnail} alt="Vehicle" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                            🚗
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-black text-[#0F172A] block truncate">
                          {v.brand || 'Toyota'} {v.name || 'Innova Crysta'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono font-bold block">
                          {v.registrationNumber || 'MH 02 CZ 8920'} • {v.type?.toUpperCase() || 'SUV'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-[#0F172A] block">
                        ₹{(v.dailyPrice || 4500).toLocaleString()}/day
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase ${
                          v.isAvailable !== false ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {v.isAvailable !== false ? 'Available' : 'Booked'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-4">
                <div className="p-5 rounded-3xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    Gross Lifetime Revenue
                  </span>
                  <p className="text-2xl font-black text-emerald-900">
                    ₹{(owner.totalRevenue || 185000).toLocaleString()}
                  </p>
                  <span className="text-[10px] font-bold text-emerald-600">Disbursed on 1st & 16th of every month</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <h4 className="text-xs font-black text-[#0F172A]">Compliance Status</h4>
                  <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Commercial Vehicle Registration Valid</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>All India Tourist Permit Cleared</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Bank Mandate & GST Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OwnerProfileDrawer;
