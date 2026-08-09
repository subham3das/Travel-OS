import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { NotificationSettingsData } from '../../../data/profile';

interface NotificationSettingsCardProps {
  data: NotificationSettingsData;
  isEditing: boolean;
  onChange: (updated: Partial<NotificationSettingsData>) => void;
}

export const NotificationSettingsCard: React.FC<NotificationSettingsCardProps> = ({
  data,
  isEditing,
  onChange,
}) => {
  const toggleItems: { key: keyof NotificationSettingsData; label: string; desc: string }[] = [
    { key: 'bookingNotifications', label: 'Booking Notifications', desc: 'Instant alerts on new, confirmed or canceled bookings' },
    { key: 'tripNotifications', label: 'Trip Notifications', desc: 'Alerts on trip status transitions & live operations' },
    { key: 'paymentNotifications', label: 'Payment Notifications', desc: 'Payout confirmations & customer payment receipts' },
    { key: 'refundNotifications', label: 'Refund Notifications', desc: 'Alerts when customer refund requests are initiated' },
    { key: 'pushNotifications', label: 'Push Notifications', desc: 'Real-time desktop & mobile browser push popups' },
    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Daily digests & transactional confirmation emails' },
    { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Urgent mobile SMS alerts for high-priority trip events' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Bell className="w-5 h-5 text-amber-500" />
        <div>
          <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Notification Preferences</h3>
          <p className="text-[11px] font-semibold text-slate-400">Configure multi-channel alert delivery preferences</p>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        {toggleItems.map((item) => {
          const isChecked = data[item.key];

          return (
            <div
              key={item.key}
              className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-3"
            >
              <div>
                <h4 className="font-extrabold text-[#0F172A]">{item.label}</h4>
                <p className="text-[11px] font-medium text-slate-400">{item.desc}</p>
              </div>

              <button
                type="button"
                disabled={!isEditing}
                onClick={() => isEditing && onChange({ [item.key]: !isChecked })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  isChecked ? 'bg-[#583BE8]' : 'bg-slate-300'
                } ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-xs ${
                    isChecked ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default NotificationSettingsCard;
