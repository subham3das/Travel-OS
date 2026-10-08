import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UserCheck,
  Phone,
  Car,
  FileCheck,
  Star,
  Award,
  DollarSign,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface DriverDetailsDrawerProps {
  isOpen: boolean;
  driver: any | null;
  onClose: () => void;
  onEdit?: (driver: any) => void;
}

export const DriverDetailsDrawer: React.FC<DriverDetailsDrawerProps> = ({
  isOpen,
  driver,
  onClose,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'license' | 'history'>('details');

  if (!isOpen || !driver) return null;

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
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-slate-200 overflow-hidden shrink-0 border-2 border-white shadow-xs">
                {driver.photo ? (
                  <img src={driver.photo} alt={driver.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-black text-slate-500">
                    {driver.name?.[0] || 'D'}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-[#0F172A]">{driver.name}</h2>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      driver.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {driver.status || 'Active'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  {driver.experienceYears || 8}+ Years Professional Commercial Driving
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(driver)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-white transition-colors"
                >
                  Edit
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="px-6 py-4 grid grid-cols-3 gap-3 border-b border-slate-100 bg-slate-50/40 text-center">
            <div className="p-2.5 rounded-2xl bg-white border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Trips</span>
              <span className="text-base font-black text-[#583BE8]">{driver.tripsCompleted || 46}</span>
              <span className="text-[9px] text-slate-400 block font-medium">Completed</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Rating</span>
              <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-base">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{driver.rating || 4.9}</span>
              </div>
              <span className="text-[9px] text-slate-400 block font-medium">Satisfaction</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Revenue</span>
              <span className="text-base font-black text-emerald-600">
                ₹{((driver.totalRevenueGenerated || 85000) / 1000).toFixed(0)}k
              </span>
              <span className="text-[9px] text-slate-400 block font-medium">Generated</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100 px-6 gap-6 text-xs font-bold text-slate-400">
            {[
              { id: 'details', label: 'Driver Profile & Vehicle' },
              { id: 'license', label: 'License & Verification' },
              { id: 'history', label: 'Trips & Feedback' },
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

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeTab === 'details' && (
              <div className="space-y-4">
                {/* Contact Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Contact Manifest</span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Phone</span>
                      <span className="font-bold text-[#0F172A] font-mono">{driver.phone || '+91 98765 43210'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Languages</span>
                      <span className="font-bold text-[#0F172A]">
                        {driver.languages?.join(', ') || 'Hindi, English, Marathi'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Assigned Vehicle */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Assigned Vehicle</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#583BE8]">
                      Primary Chauffeur
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 font-bold">
                      🚗
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#0F172A]">
                        {driver.assignedVehicle?.name || 'Toyota Innova Crysta'}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono font-bold">
                        {driver.assignedVehicle?.registrationNumber || 'MH 02 CZ 8920'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'license' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-[#583BE8]" />
                      <h4 className="text-xs font-black text-[#0F172A]">Commercial Driving License (LMV / HMV)</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      RTO Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">License Number</span>
                      <span className="font-mono font-black text-[#0F172A]">
                        {driver.licenseNumber || 'MH-02-2015-0049281'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Valid Until</span>
                      <span className="font-bold text-[#0F172A]">
                        {driver.licenseExpiryDate
                          ? new Date(driver.licenseExpiryDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '12 Sep 2029'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <h4 className="text-xs font-black text-[#0F172A]">Background Verification</h4>
                  <div className="space-y-1.5 text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Police Verification Certificate Cleared</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Aadhaar Identity Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Commercial Transport Badge Active</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                  <span className="text-xs font-black text-[#583BE8] block">Safety & Compliance Record</span>
                  <p className="text-xs text-slate-600 mt-1">
                    Zero accidents, 99.4% on-time pickup punctuality rate, and exceptional traveler reviews.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Recent Traveler Review</span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>5.0 / 5.0</span>
                  </div>
                  <p className="text-xs text-slate-700 italic">
                    "Ramesh was exceptionally courteous, kept the vehicle pristine, and navigated the ghat sections very safely."
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium block">— Pune to Mahabaleshwar Trip</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DriverDetailsDrawer;
