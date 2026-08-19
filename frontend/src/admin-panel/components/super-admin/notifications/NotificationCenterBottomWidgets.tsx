import React from 'react';
import {
  BarChart3,
  Activity,
  AlertOctagon,
  Send,
  RotateCw,
  Clock,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { NotificationBottomWidgetsData } from '../../../types/advancedNotificationCenter';

interface NotificationCenterBottomWidgetsProps {
  data: NotificationBottomWidgetsData;
  onRetryDelivery: (channel: string) => void;
}

export const NotificationCenterBottomWidgets: React.FC<
  NotificationCenterBottomWidgetsProps
> = ({ data, onRetryDelivery }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
      {/* ── 1. Notification Analytics ── */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <BarChart3 className="w-4 h-4 text-[#6356E5]" />
          <h3 className="text-xs font-black text-[#0F172A]">Notification Analytics</h3>
        </div>

        <div className="space-y-2.5">
          {data.analytics.map((item) => (
            <div key={item.category} className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-600">{item.category}</span>
                <span className="text-[#0F172A] font-black">{item.count} ({item.percentage}%)</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. Recent Activity ── */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <Activity className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-black text-[#0F172A]">Recent Activity</h3>
        </div>

        <div className="space-y-2.5">
          {data.recentActivity.map((act) => (
            <div
              key={act.id}
              className="p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100/80 space-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#0F172A]">{act.action}</span>
                <span className="text-[9px] text-slate-400 font-semibold">{act.time}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate">{act.entity}</p>
              <span className="text-[9px] font-black text-[#6356E5] block">by {act.admin}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Escalation Queue ── */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <AlertOctagon className="w-4 h-4 text-rose-500" />
          <h3 className="text-xs font-black text-[#0F172A]">Escalation Queue</h3>
        </div>

        <div className="space-y-2.5">
          {data.escalations.map((esc) => (
            <div
              key={esc.id}
              className="p-2.5 rounded-2xl bg-rose-50/40 border border-rose-100/80 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#0F172A] truncate max-w-[170px]">
                  {esc.title}
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-600 text-[8px] font-black">
                  {esc.priority}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>{esc.assignedTo}</span>
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  Due: {esc.dueIn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Delivery Status ── */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <Send className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-black text-[#0F172A]">Delivery Status</h3>
        </div>

        <div className="space-y-2 text-xs font-bold text-slate-700">
          {/* Push */}
          <div className="p-2 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black text-[#0F172A]">Desktop Push</p>
              <p className="text-[9px] text-slate-400">
                {data.deliveryStatus.push.delivered.toLocaleString()} delivered • {data.deliveryStatus.push.failed} failed
              </p>
            </div>
            <span className="text-xs font-black text-emerald-600">
              {data.deliveryStatus.push.rate}
            </span>
          </div>

          {/* Email */}
          <div className="p-2 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black text-[#0F172A]">Email Alerts</p>
              <p className="text-[9px] text-slate-400">
                {data.deliveryStatus.email.delivered.toLocaleString()} delivered • {data.deliveryStatus.email.failed} failed
              </p>
            </div>
            <span className="text-xs font-black text-emerald-600">
              {data.deliveryStatus.email.rate}
            </span>
          </div>

          {/* SMS */}
          <div className="p-2 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black text-[#0F172A]">SMS Gateway</p>
              <p className="text-[9px] text-slate-400">
                {data.deliveryStatus.sms.delivered.toLocaleString()} delivered • {data.deliveryStatus.sms.failed} failed
              </p>
            </div>
            <span className="text-xs font-black text-emerald-600">
              {data.deliveryStatus.sms.rate}
            </span>
          </div>

          {/* WhatsApp */}
          <div className="p-2 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black text-[#0F172A]">WhatsApp Business</p>
              <p className="text-[9px] text-slate-400">
                {data.deliveryStatus.whatsapp.delivered.toLocaleString()} delivered • {data.deliveryStatus.whatsapp.failed} failed
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRetryDelivery('whatsapp')}
              className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#6356E5] hover:border-purple-200 transition-colors cursor-pointer"
              title="Retry Failed WhatsApp Alerts"
            >
              <RotateCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
