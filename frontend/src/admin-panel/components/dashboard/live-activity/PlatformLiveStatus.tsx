import React from 'react';
import { Server, Activity, Database, CreditCard, Mail, Bell, Cpu, ShieldCheck } from 'lucide-react';
import { PlatformServiceStatus } from '../../../types/liveActivityCenter';

interface PlatformLiveStatusProps {
  statuses: PlatformServiceStatus[];
}

export const PlatformLiveStatus: React.FC<PlatformLiveStatusProps> = ({ statuses }) => {
  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'srv-api':
        return <Server className="w-4 h-4 text-emerald-600" />;
      case 'srv-db':
        return <Database className="w-4 h-4 text-[#6356E5]" />;
      case 'srv-pay':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'srv-email':
        return <Mail className="w-4 h-4 text-amber-500" />;
      case 'srv-notif':
        return <Bell className="w-4 h-4 text-purple-600" />;
      case 'srv-ai':
      default:
        return <Cpu className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3 select-none flex flex-col h-full">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-black text-[#0F172A]">Platform Live Status</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-100 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>All Systems 100%</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1">
        {statuses.map((srv) => (
          <div
            key={srv.id}
            className="p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 transition-all flex flex-col justify-between space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-2xs">
                  {getServiceIcon(srv.id)}
                </div>
                <span className="text-xs font-bold text-slate-800 truncate">{srv.name}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
              <span className="flex items-center gap-1 font-bold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {srv.status}
              </span>
              <span className="text-slate-400 font-medium">
                {srv.latency ? `${srv.latency} • ` : ''}
                {srv.lastChecked}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
