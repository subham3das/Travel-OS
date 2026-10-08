import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  FileText,
  Hotel,
  Bus,
  Luggage,
  Clock,
  AlertCircle,
  Headphones,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { TripStatusData } from '../../../data/tripStatus';
import { apiClient } from '../../../../services/apiClient';

interface TripStatusSectionProps {
  tripId: string;
  agencyId: string;
}

export const TripStatusSection: React.FC<TripStatusSectionProps> = ({ tripId, agencyId }) => {
  const navigate = useNavigate();
  const [statusData, setStatusData] = useState<TripStatusData | null>(null);

  useEffect(() => {
    let isMounted = true;
    apiClient
      .get<TripStatusData>(`/trips/${tripId}/status`)
      .then((res) => {
        if (isMounted) setStatusData(res.data || null);
      })
      .catch(() => {
        if (isMounted) setStatusData(null);
      });

    return () => {
      isMounted = false;
    };
  }, [tripId]);

  if (!statusData) {
    return null;
  }

  const renderUpdateIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return <Hotel className="w-4 h-4 text-sky-600" />;
      case 'transport':
        return <Bus className="w-4 h-4 text-[#6356E5]" />;
      case 'document':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getUpdateBg = (type: string) => {
    switch (type) {
      case 'hotel':
        return 'bg-sky-50';
      case 'transport':
        return 'bg-purple-50';
      case 'document':
        return 'bg-emerald-50';
      case 'success':
      default:
        return 'bg-emerald-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100/90 dark:border-white/10 shadow-xs dark:shadow-none space-y-5"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-white tracking-tight">
            Trip Status & Live Updates
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Stay updated with your upcoming journey.
          </p>
        </div>

        {/* Live Pulse Status Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-[#2563EB] dark:text-[#60A5FA] text-xs font-black shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
          <span>{statusData.statusBadge}</span>
        </div>
      </div>

      {/* Current Step Overview Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F4F0FF] via-[#F8F5FF] to-[#FAF8FF] dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 border border-[#E2D8FF] dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider">Current Stage:</span>
            <span className="text-xs font-black text-[#0F172A] dark:text-white">{statusData.nextStep}</span>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {statusData.countdownText} • Last updated {statusData.lastUpdated}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate(`/trips/${tripId}/documents`)}
            className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] text-white text-xs font-black shadow-xs hover:bg-[#1D4ED8] transition-all cursor-pointer"
          >
            Open Documents
          </button>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold text-[#0F172A] dark:text-white uppercase tracking-wider">
          Journey Progress
        </h3>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {statusData.steps.map((step) => {
            let style = 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-400';
            if (step.status === 'completed') {
              style = 'bg-emerald-500 border-emerald-500 text-white shadow-xs';
            } else if (step.status === 'current') {
              style = 'bg-[#2563EB] border-[#2563EB] text-white ring-2 ring-[#2563EB]/20 shadow-xs';
            }

            return (
              <div
                key={step.id}
                className={`p-2.5 rounded-2xl border flex flex-col items-center text-center space-y-1 transition-all ${style}`}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs">
                  {step.status === 'completed' ? '✓' : step.status === 'current' ? '⏳' : '○'}
                </div>
                <span className="text-[10px] font-extrabold leading-tight">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Updates Feed */}
      <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-[#0F172A] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
            <span>Live Agency Updates</span>
          </h3>
          <span className="text-[11px] font-bold text-slate-400">{statusData.updates.length} Updates</span>
        </div>

        <div className="space-y-2.5">
          {statusData.updates.map((update) => (
            <motion.div
              key={update.id}
              whileHover={{ x: 2 }}
              className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-700/40 border border-slate-100 dark:border-white/10 flex items-start gap-3 transition-all"
            >
              <div className={`w-9 h-9 rounded-xl ${getUpdateBg(update.type)} flex items-center justify-center shrink-0 mt-0.5`}>
                {renderUpdateIcon(update.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A] dark:text-white truncate">
                    {update.title}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">
                    {update.timestamp}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-300 leading-snug">
                  {update.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upcoming Reminder Box */}
      {statusData.reminder && (
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100/90 dark:border-amber-900/40 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-black text-amber-900 dark:text-amber-200">
              {statusData.reminder.title}
            </h4>
            <ul className="text-xs font-semibold text-amber-800 dark:text-amber-300 space-y-1 list-disc list-inside">
              {statusData.reminder.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Bottom Action Triggers */}
      <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
        <button
          onClick={() => navigate(`/trips/${tripId}/documents`)}
          className="flex-1 py-2.5 px-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-black shadow-md shadow-[#2563EB]/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>View Documents</span>
        </button>

        <button
          onClick={() => navigate(`/agency/${agencyId}`)}
          className="flex-1 py-2.5 px-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#6356E5] text-xs font-black border border-purple-100 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Headphones className="w-4 h-4" />
          <span>Contact Agency</span>
        </button>
      </div>
    </motion.div>
  );
};
