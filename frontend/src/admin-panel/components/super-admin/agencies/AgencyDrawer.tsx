import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Agency } from '../../../types/agency';
import { AgencyDrawerHeader } from './AgencyDrawerHeader';
import { AgencyOverviewCard } from './AgencyOverviewCard';
import { AgencyVerificationCard } from './AgencyVerificationCard';
import { AgencyPerformanceCard } from './AgencyPerformanceCard';
import { AgencyQuickActions } from './AgencyQuickActions';
import { FileText, Clock } from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';

interface AgencyDrawerProps {
  agency: Agency | null;
  isOpen: boolean;
  onClose: () => void;
  onViewFullProfile: (agency: Agency) => void;
  onVerifyAgency: (agency: Agency) => void;
  onSuspendAgency: (agency: Agency) => void;
  onEditAgency: (agency: Agency) => void;
  onMoreActions: (agency: Agency) => void;
}

export const AgencyDrawer: React.FC<AgencyDrawerProps> = ({
  agency,
  isOpen,
  onClose,
  onViewFullProfile,
  onVerifyAgency,
  onSuspendAgency,
  onEditAgency,
  onMoreActions,
}) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Performance' | 'Documents' | 'Activity'>(
    'Overview'
  );

  if (!isOpen || !agency) return null;

  const mockDocuments = [
    { name: 'GST Certificate.pdf', type: 'GST', status: 'Verified', date: 'May 21, 2024' },
    { name: 'PAN Card Copy.pdf', type: 'KYC', status: 'Verified', date: 'May 21, 2024' },
    { name: 'Business License.pdf', type: 'License', status: 'Verified', date: 'May 22, 2024' },
    { name: 'Cancelled Cheque.pdf', type: 'Bank', status: 'Under Review', date: 'Jun 05, 2024' },
  ];

  const mockActivities = [
    { title: 'Package Added', desc: 'Added "Leh Ladakh Bike Expedition"', time: '2 hours ago' },
    { title: 'Booking Received', desc: 'Booking #BK-98451 confirmed', time: '5 hours ago' },
    { title: 'Profile Updated', desc: 'Updated contact email & phone', time: '1 day ago' },
    { title: 'Verification Submitted', desc: 'Submitted Bank Details for audit', time: '3 days ago' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Drawer Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full sm:w-[440px] h-full bg-[#F8F9FC] shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <AgencyDrawerHeader agency={agency} onClose={onClose} />

            {/* Navigation Tabs */}
            <div className="flex items-center border-b border-slate-200/80 bg-white px-5 shrink-0">
              {(['Overview', 'Performance', 'Documents', 'Activity'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-3.5 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'border-[#6356E5] text-[#6356E5] font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Scrollable Tab Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-none">
              {activeTab === 'Overview' && (
                <>
                  <AgencyOverviewCard agency={agency} />
                  <AgencyVerificationCard agency={agency} />
                  <AgencyPerformanceCard agency={agency} />
                  <AgencyQuickActions
                    agency={agency}
                    onViewFullProfile={onViewFullProfile}
                    onVerifyAgency={onVerifyAgency}
                    onSuspendAgency={onSuspendAgency}
                    onEditAgency={onEditAgency}
                    onMoreActions={onMoreActions}
                  />
                </>
              )}

              {activeTab === 'Performance' && (
                <>
                  <AgencyPerformanceCard agency={agency} />
                  <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
                    <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                      Package Metrics
                    </h4>
                    <div className="space-y-2 text-xs font-semibold text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Listed Packages</span>
                        <span className="font-extrabold text-[#0F172A]">{agency.packages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Active Bookings</span>
                        <span className="font-extrabold text-[#0F172A]">{agency.bookings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Lifetime Revenue</span>
                        <span className="font-extrabold text-[#0F172A]">{agency.revenue}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'Documents' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                    Uploaded Documents
                  </h4>
                  <div className="space-y-2.5">
                    {mockDocuments.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-4 h-4 text-[#6356E5] shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-extrabold text-[#0F172A] truncate">
                              {doc.name}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400">{doc.date}</p>
                          </div>
                        </div>
                        <VerificationBadge status={doc.status as any} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Activity' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                    Recent Activity Log
                  </h4>
                  <div className="space-y-3">
                    {mockActivities.map((act, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#6356E5] flex items-center justify-center shrink-0 mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-extrabold text-[#0F172A]">{act.title}</p>
                          <p className="text-[11px] font-semibold text-slate-500">{act.desc}</p>
                          <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">
                            {act.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
