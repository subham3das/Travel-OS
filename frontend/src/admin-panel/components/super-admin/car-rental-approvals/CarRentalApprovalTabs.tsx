import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, AlertTriangle, Layers } from 'lucide-react';
import { CarRentalStats } from '../../../types/carRentalApproval';

export type QueueTabType = 'Pending' | 'Approved' | 'Rejected' | 'Needs Changes' | 'All';

interface CarRentalApprovalTabsProps {
  activeTab: QueueTabType;
  onChangeTab: (tab: QueueTabType) => void;
  stats: CarRentalStats | null;
}

export const CarRentalApprovalTabs: React.FC<CarRentalApprovalTabsProps> = ({
  activeTab,
  onChangeTab,
  stats,
}) => {
  const tabs: Array<{ id: QueueTabType; label: string; icon: any; count?: number; color: string }> = [
    {
      id: 'Pending',
      label: 'Pending',
      icon: Clock,
      count: stats?.pendingRequests?.count,
      color: 'amber',
    },
    {
      id: 'Approved',
      label: 'Approved',
      icon: CheckCircle2,
      count: stats?.approvedToday?.count,
      color: 'emerald',
    },
    {
      id: 'Needs Changes',
      label: 'Needs Changes',
      icon: AlertTriangle,
      count: stats?.needsChanges?.count,
      color: 'violet',
    },
    {
      id: 'Rejected',
      label: 'Rejected',
      icon: XCircle,
      count: stats?.rejectedToday?.count,
      color: 'rose',
    },
    {
      id: 'All',
      label: 'All Applications',
      icon: Layers,
      color: 'slate',
    },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 overflow-x-auto scrollbar-none select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const IconComponent = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-white text-[#0F172A] shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            <IconComponent
              className={`w-4 h-4 transition-colors ${
                isActive ? 'text-[#6356E5]' : 'text-slate-400'
              }`}
            />
            <span>{tab.label}</span>

            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-black transition-colors ${
                  isActive
                    ? 'bg-[#EEF2FF] text-[#6356E5]'
                    : 'bg-slate-200/70 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            )}

            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 rounded-xl bg-white shadow-xs -z-10"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
