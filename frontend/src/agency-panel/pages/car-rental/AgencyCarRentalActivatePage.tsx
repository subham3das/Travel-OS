import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAgencyAuth } from '../../hooks/useAgencyAuth';
import { useActiveBusiness } from '../../context/ActiveBusinessContext';
import { agencyCarRentalService } from '../../services/agencyCarRental.service';
import { useToast } from '../../../user-panel/context/ToastContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';

export const AgencyCarRentalActivatePage: React.FC = () => {
  const navigate = useNavigate();
  const { agency } = useAgencyAuth();
  const { refreshBusinessProfile } = useActiveBusiness();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const a = agency as any;
  const [formData, setFormData] = useState({
    businessName: a?.agencyDisplayName || a?.name ? `${a.agencyDisplayName || a.name} Car Rentals` : '',
    ownerName: a?.ownerName || a?.owner?.name || a?.name || '',
    email: a?.email || '',
    phone: a?.phone || '',
    address: a?.businessAddress || a?.address || '',
    city: a?.city || 'Mumbai',
    state: a?.state || 'Maharashtra',
    pinCode: a?.pinCode || '',
    panNumber: a?.panNumber || '',
    gstNumber: a?.gstNumber || '',
    businessLicenseNumber: '',
    fleetSize: 3,
    operatingCities: a?.city ? [a.city] : ['Mumbai', 'Pune'],
    emergencyContact: a?.emergencyContact || a?.phone || '',
    description: 'Premier car rental and fleet management service providing safe, verified, and insured vehicles.',
    workingHours: '08:00 AM - 09:00 PM',
    accountHolderName: a?.bankDetails?.accountHolderName || a?.ownerName || a?.name || '',
    bankName: a?.bankDetails?.bankName || '',
    accountNumber: a?.bankDetails?.accountNumber || '',
    ifscCode: a?.bankDetails?.ifscCode || '',
    upiId: a?.bankDetails?.upiId || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName.trim()) {
      showToast('Please enter your car rental business name', 'error');
      return;
    }
    if (!formData.phone.trim()) {
      showToast('Please enter a valid phone number', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await agencyCarRentalService.register({
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        panNumber: formData.panNumber,
        gstNumber: formData.gstNumber,
        businessLicenseNumber: formData.businessLicenseNumber,
        fleetSize: Number(formData.fleetSize) || 1,
        operatingCities: formData.operatingCities,
        emergencyContact: formData.emergencyContact,
        description: formData.description,
        workingHours: formData.workingHours,
        bankDetails: {
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          upiId: formData.upiId,
        },
      });

      await refreshBusinessProfile();
      showToast('Car Rental business registered successfully! Application submitted to Admin.', 'success');
      navigate('/agency/car-rental/pending');
    } catch (err: any) {
      console.error('Registration error:', err);
      showToast(err.message || 'Failed to register car rental business', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FC] overflow-hidden font-sans select-none">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
          {/* Hero Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl bg-gradient-to-r from-[#583BE8] via-[#6356E5] to-[#7B61FF] text-white p-6 sm:p-8 overflow-hidden shadow-lg shadow-[#583BE8]/20"
          >
            <div className="relative z-10 max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-extrabold text-white border border-white/20">
                <Car className="w-3.5 h-3.5" />
                <span>New Business Vertical</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Welcome to Car Rental
              </h1>
              <p className="text-white/90 text-sm font-normal leading-relaxed">
                Earn by renting your vehicles. List hatchbacks, sedans, SUVs, and luxury cars to verified travelers. Manage reservations, assign drivers, and collect payments directly.
              </p>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute right-4 -bottom-6 opacity-15 hidden sm:block">
              <Car className="w-64 h-64 text-white" />
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6"
          >
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-[#0F172A] tracking-tight">
                Register Your Car Rental Business
              </h2>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Provide your fleet details and business info. All credentials link to your single provider login.
              </p>
            </div>

            {/* 1. Business Info Grid */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#583BE8] flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>1. Business Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Rental Business Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Royal Fleet & Car Rentals"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Primary Contact Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Business Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rentals@company.com"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Initial Fleet Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.fleetSize}
                    onChange={(e) => setFormData({ ...formData, fleetSize: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Operating City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Mumbai"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Operating State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Maharashtra"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 2. Bank Settlement Details */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#583BE8] flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>2. Bank Settlement & Payout Account</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    placeholder="e.g. HDFC Bank"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] transition-colors font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Submission Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/agency/dashboard')}
                className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Back to Agency
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-black transition-all shadow-md shadow-[#583BE8]/25 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Car Rental Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default AgencyCarRentalActivatePage;
