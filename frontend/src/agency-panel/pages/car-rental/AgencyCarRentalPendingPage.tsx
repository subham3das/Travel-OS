import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  ShieldCheck,
  Building2,
  Phone,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Car,
} from 'lucide-react';
import { useActiveBusiness } from '../../context/ActiveBusinessContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';

export const AgencyCarRentalPendingPage: React.FC = () => {
  const navigate = useNavigate();
  const { carRentalStatus, carRentalProfile, isCarRentalApproved, refreshBusinessProfile } =
    useActiveBusiness();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isCarRentalApproved) {
      navigate('/agency/car-rental/dashboard');
    }
  }, [isCarRentalApproved, navigate]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshBusinessProfile();
    setIsRefreshing(false);
  };

  return (
    <div className="flex h-screen bg-[#F8F9FC] overflow-hidden font-sans select-none">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-sm text-center space-y-6"
          >
            {/* Status Icon */}
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-100 shadow-xs">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-black border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>Verification Under Review</span>
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                Car Rental Business Verification Pending
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed">
                Your application for <span className="font-extrabold text-[#0F172A]">{carRentalProfile?.businessName || 'Car Rental Service'}</span> has been received and is currently being audited by the ApnaTrip Compliance Team.
              </p>
            </div>

            {/* Application Overview Box */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 text-left space-y-3 max-w-lg mx-auto">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business Vertical</span>
                <span className="text-xs font-extrabold text-[#583BE8] flex items-center gap-1">
                  <Car className="w-3.5 h-3.5" />
                  <span>Commercial Car Rental</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Fleet Size</span>
                  <span className="text-[#0F172A] font-extrabold">{carRentalProfile?.fleetSize || 1} Vehicle(s)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Operating Cities</span>
                  <span className="text-[#0F172A] font-extrabold">{carRentalProfile?.operatingCities?.join(', ') || 'Mumbai'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Estimated Turnaround</span>
                  <span className="text-amber-600 font-extrabold">2 - 4 Business Hours</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Travel Agency Status</span>
                  <span className="text-emerald-600 font-extrabold">Active & Operating</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Check Approval Status</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/agency/dashboard')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#583BE8] text-white text-xs font-black shadow-md shadow-[#583BE8]/25 hover:bg-[#492de0] transition-colors cursor-pointer"
              >
                <span>Return to Agency Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default AgencyCarRentalPendingPage;
