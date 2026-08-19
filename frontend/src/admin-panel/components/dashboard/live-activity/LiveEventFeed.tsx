import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Building2,
  User,
  CreditCard,
  AlertTriangle,
  Package,
  Headphones,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { LiveEventItem, LiveEventType } from '../../../types/liveActivityCenter';

interface LiveEventFeedProps {
  events: LiveEventItem[];
}

export const LiveEventFeed: React.FC<LiveEventFeedProps> = ({ events }) => {
  const navigate = useNavigate();

  const getEventIcon = (type: LiveEventType) => {
    switch (type) {
      case 'booking_created':
      case 'booking_modified':
        return <CalendarCheck className="w-4 h-4 text-emerald-600" />;
      case 'booking_cancelled':
      case 'payment_failed':
      case 'security_alert':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'agency_approved':
      case 'agency_registered':
        return <Building2 className="w-4 h-4 text-[#6356E5]" />;
      case 'user_registered':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'refund_requested':
      case 'payment_success':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'package_submitted':
      case 'package_approved':
        return <Package className="w-4 h-4 text-amber-600" />;
      case 'support_ticket_raised':
      default:
        return <Headphones className="w-4 h-4 text-rose-500" />;
    }
  };

  const getStatusBadge = (status: string, color: LiveEventItem['statusColor']) => {
    let classes = 'bg-slate-50 text-slate-600 border-slate-200';
    if (color === 'emerald') classes = 'bg-emerald-50 text-emerald-600 border-emerald-200';
    if (color === 'purple') classes = 'bg-purple-50 text-[#6356E5] border-purple-200';
    if (color === 'blue') classes = 'bg-blue-50 text-blue-600 border-blue-200';
    if (color === 'amber') classes = 'bg-amber-50 text-amber-600 border-amber-200';
    if (color === 'rose') classes = 'bg-rose-50 text-rose-600 border-rose-200';

    return (
      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${classes}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3 select-none flex flex-col h-full">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <h3 className="text-xs font-black text-[#0F172A]">Live Event Feed</h3>
        </div>
        <span className="text-[10px] font-bold text-slate-400">Continuous Stream</span>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-[380px] scrollbar-thin pr-1 flex-1">
        <AnimatePresence initial={false}>
          {events.map((evt) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              onClick={() => navigate(evt.targetRoute)}
              className="p-2.5 rounded-2xl bg-slate-50/70 hover:bg-purple-50/70 border border-slate-100 hover:border-purple-200 transition-all cursor-pointer flex items-start justify-between gap-2.5 group shadow-2xs"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-purple-100">
                  {getEventIcon(evt.type)}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-xs font-black text-[#0F172A] group-hover:text-[#6356E5] transition-colors truncate">
                      {evt.title}
                    </h4>
                    {getStatusBadge(evt.status, evt.statusColor)}
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 truncate">{evt.subtitle}</p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">{evt.description}</p>
                  {evt.amount && (
                    <span className="text-[10px] font-black text-[#6356E5] font-mono block">
                      {evt.amount}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[9px] font-semibold text-slate-400 whitespace-nowrap">
                  {evt.time}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-[#6356E5] transition-colors" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
