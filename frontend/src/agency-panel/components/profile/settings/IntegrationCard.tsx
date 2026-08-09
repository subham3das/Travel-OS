import React from 'react';
import { motion } from 'framer-motion';
import { Layers, MapPin, MessageSquare, Calendar, Mail, CreditCard, Sparkles } from 'lucide-react';
import { IntegrationItem } from '../../../data/profile';

interface IntegrationCardProps {
  integrations: IntegrationItem[];
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({ integrations }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Google Maps API':
        return <MapPin className="w-4 h-4 text-sky-600" />;
      case 'WhatsApp Business API':
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case 'Google Calendar Sync':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'Email Provider (SendGrid)':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'Payment Gateway (Razorpay)':
        return <CreditCard className="w-4 h-4 text-amber-600" />;
      default:
        return <Layers className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#583BE8]" />
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Integrations</h3>
            <p className="text-[11px] font-semibold text-slate-400">External services, maps, communications & payment gateways</p>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-purple-200">
          <Sparkles className="w-3 h-3 text-[#583BE8]" /> Future Ready
        </span>
      </div>

      <div className="space-y-2.5 text-xs">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center border border-slate-200/80 shrink-0 shadow-2xs">
                {getIcon(item.name)}
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-[#0F172A] truncate">{item.name}</h4>
                <p className="text-[11px] font-medium text-slate-400">{item.category}</p>
              </div>
            </div>

            <span
              className={`text-[10px] font-black px-2.5 py-1 rounded-full border shrink-0 ${
                item.status === 'Connected'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : item.status === 'Not Connected'
                  ? 'bg-slate-200 text-slate-700 border-slate-300'
                  : 'bg-amber-100 text-amber-800 border-amber-200'
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default IntegrationCard;
