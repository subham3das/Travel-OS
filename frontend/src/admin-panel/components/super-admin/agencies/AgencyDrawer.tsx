import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Agency } from '../../../types/agency';
import { adminAgencyService } from '../../../services/adminAgency.service';
import { AgencyDrawerHeader } from './AgencyDrawerHeader';
import { AgencyOverviewCard } from './AgencyOverviewCard';
import { AgencyVerificationCard } from './AgencyVerificationCard';
import { AgencyPerformanceCard } from './AgencyPerformanceCard';
import { AgencyQuickActions } from './AgencyQuickActions';
import { FileText, Clock, ExternalLink, Package } from 'lucide-react';
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
  const [detailedAgency, setDetailedAgency] = useState<Agency | null>(agency);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  useEffect(() => {
    if (agency && isOpen) {
      setDetailedAgency(agency);
      setLoadingDetails(true);
      adminAgencyService
        .getAgencyById(agency.id)
        .then((fullData: Agency | null) => {
          if (fullData) setDetailedAgency(fullData);
        })
        .catch((err: any) => console.error('Failed to load full agency details:', err))
        .finally(() => setLoadingDetails(false));
    }
  }, [agency?.id, isOpen]);

  if (!isOpen || !agency) return null;

  const currentAgency = detailedAgency || agency;
  const docsList = currentAgency.documents || [];
  const activitiesList = currentAgency.activities || [];
  const packagesList = (currentAgency as any).packagesList || [];

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
            <AgencyDrawerHeader agency={currentAgency} onClose={onClose} />

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
                  <AgencyOverviewCard agency={currentAgency} />
                  <AgencyVerificationCard agency={currentAgency} />
                  <AgencyPerformanceCard agency={currentAgency} />
                  <AgencyQuickActions
                    agency={currentAgency}
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
                  <AgencyPerformanceCard agency={currentAgency} />
                  <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
                    <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                      Package Metrics
                    </h4>
                    <div className="space-y-2 text-xs font-semibold text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Listed Packages</span>
                        <span className="font-extrabold text-[#0F172A]">{currentAgency.packages || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Active Bookings</span>
                        <span className="font-extrabold text-[#0F172A]">{currentAgency.bookings || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Lifetime Revenue</span>
                        <span className="font-extrabold text-[#0F172A]">{currentAgency.revenue || '₹0'}</span>
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
                  {docsList.length > 0 ? (
                    <div className="space-y-2.5">
                      {docsList.map((doc, idx) => (
                        <div
                          key={doc.id || idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="w-4 h-4 text-[#6356E5] shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-extrabold text-[#0F172A] truncate">
                                {doc.name}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400">
                                {doc.type} • {doc.uploadedAt}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <VerificationBadge status={(doc.status as any) || 'Verified'} />
                            {(doc as any).fileUrl && (doc as any).fileUrl !== '#' && (
                              <a
                                href={(doc as any).fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                                title="View Document"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-slate-400 py-3 text-center">
                      No documents currently uploaded.
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'Activity' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                    Recent Activity Log
                  </h4>
                  {activitiesList.length > 0 ? (
                    <div className="space-y-3">
                      {activitiesList.map((act, idx) => (
                        <div key={act.id || idx} className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#6356E5] flex items-center justify-center shrink-0 mt-0.5">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-extrabold text-[#0F172A]">{act.title}</p>
                            <p className="text-[11px] font-semibold text-slate-500">{act.description}</p>
                            <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">
                              {act.timestamp}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-slate-400 py-3 text-center">
                      No recent activity recorded for this agency.
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
