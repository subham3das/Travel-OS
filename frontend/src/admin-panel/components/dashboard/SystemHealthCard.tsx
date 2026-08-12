import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Database, CreditCard, HardDrive, CheckCircle2 } from 'lucide-react';
import { SystemHealth } from '../../types/dashboard';

interface SystemHealthCardProps {
  health: SystemHealth;
  onViewDetails?: () => void;
}

export const SystemHealthCard: React.FC<SystemHealthCardProps> = ({
  health,
  onViewDetails,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'api':
        return <Cpu className="w-4 h-4 text-emerald-600" />;
      case 'db':
        return <Database className="w-4 h-4 text-emerald-600" />;
      case 'gateway':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'storage':
      default:
        return <HardDrive className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.55 }}
      className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight">System Health</h3>
        <button
          onClick={onViewDetails}
          className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
        >
          View Details
        </button>
      </div>

      {/* 2x2 Grid of Services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {health.services.map((srv) => (
          <div
            key={srv.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100/80 hover:bg-emerald-50/40 hover:border-emerald-100 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs group-hover:scale-105 transition-transform">
              {getIcon(srv.iconType)}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-extrabold text-[#0F172A] truncate leading-tight">
                {srv.name}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-600 leading-none">
                  Operational
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
