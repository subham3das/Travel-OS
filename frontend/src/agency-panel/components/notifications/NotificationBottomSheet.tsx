import React from 'react';
import { X, ArrowRight, CheckCircle, Clock, User, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AgencyNotification } from '../../data/notifications';
import { NotificationIcon } from './NotificationIcon';

interface NotificationBottomSheetProps {
  notification: AgencyNotification | null;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

export const NotificationBottomSheet: React.FC<NotificationBottomSheetProps> = ({
  notification,
  onClose,
  onMarkAsRead,
}) => {
  const navigate = useNavigate();

  if (!notification) return null;

  const handleAction = () => {
    onMarkAsRead(notification.id);
    onClose();
    if (notification.ctaLink) {
      navigate(notification.ctaLink);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end md:items-center justify-center md:justify-end select-none">
      {/* Container: Bottom sheet on mobile, Right drawer on desktop */}
      <div className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-l-3xl md:rounded-r-none h-[85vh] md:h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-bottom md:slide-in-from-right duration-200 border-l border-slate-100">
        
        {/* Top Handle / Close Bar */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">
              Notification Details
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Card Header */}
          <div className="flex items-start gap-4">
            <NotificationIcon category={notification.category} className="w-12 h-12 rounded-2xl" />
            <div className="space-y-1 min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-black text-[#0F172A] leading-snug">
                {notification.title}
              </h3>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{notification.timestamp}</span>
                {notification.isUnread && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#583BE8] text-[10px] font-black">
                    Unread
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
              {notification.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Related Context
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              {notification.relatedEntityId && (
                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Entity ID</span>
                  <span className="text-[#583BE8] font-black">{notification.relatedEntityId}</span>
                </div>
              )}

              {notification.relatedEntityName && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Entity Name</span>
                  <span className="text-[#0F172A] font-black truncate block">
                    {notification.relatedEntityName}
                  </span>
                </div>
              )}

              {notification.triggeredBy && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 col-span-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Triggered By</span>
                    <span className="text-[#0F172A] font-black">{notification.triggeredBy}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-6 border-t border-slate-100 space-y-2">
          {notification.ctaText && (
            <button
              type="button"
              onClick={handleAction}
              className="w-full py-3.5 rounded-2xl bg-[#583BE8] hover:bg-[#472dbf] text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#583BE8]/25 transition-all cursor-pointer"
            >
              <span>{notification.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {notification.isUnread && (
            <button
              type="button"
              onClick={() => onMarkAsRead(notification.id)}
              className="w-full py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-extrabold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Mark as Read</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBottomSheet;
