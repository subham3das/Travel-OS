import React from 'react';
import {
  Cpu,
  HardDrive,
  Database,
  Layers,
  Globe,
  ArrowRight,
  MapPin,
  Bot,
  CreditCard,
  MessageSquare,
  Flame,
  Mail,
} from 'lucide-react';
import {
  SystemStatusMetric,
  ConnectedServiceItem,
  SettingsRecentChangeItem,
} from '../../../types/settingsManagement';

interface SystemStatusSidebarProps {
  metrics: SystemStatusMetric[];
  services: ConnectedServiceItem[];
  recentChanges: SettingsRecentChangeItem[];
  onViewMetrics?: () => void;
  onViewAllChanges?: () => void;
}

export const SystemStatusSidebar: React.FC<SystemStatusSidebarProps> = ({
  metrics,
  services,
  recentChanges,
  onViewMetrics,
  onViewAllChanges,
}) => {
  const getMetricIcon = (name: string) => {
    switch (name) {
      case 'CPU':
        return <Cpu className="w-3 h-3 text-purple-600" />;
      case 'Memory':
        return <HardDrive className="w-3 h-3 text-blue-600" />;
      case 'Database':
        return <Database className="w-3 h-3 text-emerald-600" />;
      case 'Cache':
        return <Layers className="w-3 h-3 text-amber-600" />;
      case 'CDN':
      default:
        return <Globe className="w-3 h-3 text-[#6356E5]" />;
    }
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'MapPin':
        return <MapPin className="w-3.5 h-3.5 text-blue-600" />;
      case 'Bot':
        return <Bot className="w-3.5 h-3.5 text-emerald-600" />;
      case 'CreditCard':
        return <CreditCard className="w-3.5 h-3.5 text-indigo-600" />;
      case 'MessageSquare':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Flame':
        return <Flame className="w-3.5 h-3.5 text-orange-600" />;
      case 'Mail':
      default:
        return <Mail className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* ── 1. SYSTEM STATUS ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">System Status</h3>
          <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>All Systems Operational</span>
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {metrics.map((m) => (
            <div key={m.name} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                  {getMetricIcon(m.name)}
                  <span>{m.name}</span>
                </div>
                <span className="font-mono font-black text-slate-800">{m.value}%</span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-1 text-center">
          <button
            onClick={onViewMetrics}
            className="text-[10px] font-bold text-[#6356E5] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View System Metrics</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* ── 2. CONNECTED SERVICES ── */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-black text-[#0F172A]">Connected Services</h3>

        <div className="space-y-1.5">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors text-xs"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {getServiceIcon(srv.iconType)}
                </div>
                <span className="font-bold text-slate-800 text-[11px]">{srv.name}</span>
              </div>

              <span
                className={`text-[9px] font-black flex items-center gap-1 px-1.5 py-0.2 rounded-md ${
                  srv.status === 'Connected'
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-amber-600 bg-amber-50'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    srv.status === 'Connected' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                <span>{srv.status}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. RECENT CHANGES ── */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-[#0F172A]">Recent Changes</h3>
          <button
            onClick={onViewAllChanges}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-2">
          {recentChanges.map((item) => (
            <div key={item.id} className="flex items-start gap-2 text-xs">
              <span
                className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                  item.type === 'green'
                    ? 'bg-emerald-500'
                    : item.type === 'blue'
                    ? 'bg-blue-500'
                    : 'bg-orange-500'
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-800 text-[11px] truncate">{item.action}</p>
                <p className="text-[9px] text-slate-400 font-mono pt-0.2">
                  {item.timestamp} • {item.admin}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
