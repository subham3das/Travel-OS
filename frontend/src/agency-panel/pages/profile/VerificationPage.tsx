import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, CheckCircle2, Clock, Upload, Eye, RefreshCw } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { MOCK_AGENCY_PROFILE, VerificationItem } from '../../data/profile';

export const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<VerificationItem[]>(MOCK_AGENCY_PROFILE.verifications);

  const handleAction = (type: string, name: string) => {
    alert(`${type} action initiated for "${name}".`);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-24 md:pb-16">
        <DashboardHeader />

        <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-[3.5rem] z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/agency/profile')}
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#0F172A]">Verification & Trust</h2>
              <p className="text-[11px] font-semibold text-slate-400">Documents & agency verification status</p>
            </div>
          </div>
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 max-w-3xl mx-auto w-full space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Status Card Banner */}
            <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200/90 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-black text-emerald-950">Verified Travel Agency</h3>
                <p className="text-xs font-semibold text-emerald-800">
                  Your business credentials and legal identity are fully verified by Travel OS.
                </p>
              </div>
            </div>

            {/* Verifications List */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Verification Documents
              </h4>

              <div className="space-y-3">
                {items.map((v) => (
                  <div
                    key={v.id}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="text-xs sm:text-sm font-extrabold text-[#0F172A] truncate">
                          {v.documentType}
                        </h5>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            v.status === 'Verified'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {v.status === 'Verified' ? '✓ Verified' : '⏳ Pending'}
                        </span>
                      </div>

                      <p className="text-[11px] font-semibold text-slate-400">
                        Uploaded on {v.uploadedDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAction('Preview', v.documentType)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAction('Replace', v.documentType)}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 text-[#583BE8] text-xs font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Replace</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default VerificationPage;
