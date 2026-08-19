import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Building2,
  Package,
  CalendarCheck,
  CreditCard,
  UserCheck,
  Star,
  MessageSquare,
  Headphones,
  Server,
  ShieldAlert,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  HeaderNotificationItem,
  HeaderNotificationCategory,
  HeaderNotificationTab,
  HeaderNotificationPriority,
} from '../../../types/headerNotification';
import { adminHeaderNotificationsService } from '../../../services/adminHeaderNotifications.service';
import { HeaderNotificationQuickReplyModal } from './HeaderNotificationQuickReplyModal';

interface AdminNotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminNotificationDropdown: React.FC<AdminNotificationDropdownProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<HeaderNotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<HeaderNotificationTab>('all');
  const [replyTicketItem, setReplyTicketItem] = useState<HeaderNotificationItem | null>(null);

  // Subscribe to real-time notification store
  useEffect(() => {
    const unsubscribe = adminHeaderNotificationsService.subscribe((items) => {
      setNotifications(items);
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Filter based on activeTab
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !item.isRead;
    if (activeTab === 'approvals') {
      return item.category === 'agency' || item.category === 'package' || item.category === 'review';
    }
    if (activeTab === 'support') return item.category === 'support';
    if (activeTab === 'payments') return item.category === 'payment';
    if (activeTab === 'security') return item.category === 'security';
    if (activeTab === 'system') return item.category === 'system';
    return true;
  });

  // Group filtered items by timeGroup
  const todayItems = filteredNotifications.filter((n) => n.timeGroup === 'Today');
  const yesterdayItems = filteredNotifications.filter((n) => n.timeGroup === 'Yesterday');
  const earlierItems = filteredNotifications.filter((n) => n.timeGroup === 'Earlier');

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    adminHeaderNotificationsService.markAllAsRead();
    onShowToast('All notifications marked as read', 'success');
  };

  const handleCardClick = (item: HeaderNotificationItem) => {
    adminHeaderNotificationsService.markAsRead(item.id);
    onClose();
    if (item.targetRoute) {
      navigate(item.targetRoute);
    }
  };

  const handleActionClick = (
    e: React.MouseEvent,
    item: HeaderNotificationItem,
    actionType: string
  ) => {
    e.stopPropagation();

    if (actionType === 'view') {
      adminHeaderNotificationsService.markAsRead(item.id);
      onClose();
      navigate(item.targetRoute);
      return;
    }

    if (actionType === 'reply_ticket') {
      setReplyTicketItem(item);
      return;
    }

    const result = adminHeaderNotificationsService.executeAction(item.id, actionType);
    onShowToast(result.message, result.success ? 'success' : 'error');
  };

  const handleSendTicketReply = (replyText: string) => {
    if (replyTicketItem) {
      adminHeaderNotificationsService.executeAction(replyTicketItem.id, 'reply_ticket');
      onShowToast(`Reply dispatched: "${replyText.slice(0, 35)}..."`, 'success');
      setReplyTicketItem(null);
    }
  };

  const handleViewAllNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    navigate('/admin/notifications');
  };

  const handleResetNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    adminHeaderNotificationsService.resetToDefault();
    onShowToast('Notifications refreshed to latest system state', 'info');
  };

  const getCategoryIcon = (category: HeaderNotificationCategory) => {
    switch (category) {
      case 'agency':
        return <Building2 className="w-4 h-4 text-[#6356E5]" />;
      case 'package':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'booking':
        return <CalendarCheck className="w-4 h-4 text-amber-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-rose-600" />;
      case 'user':
        return <UserCheck className="w-4 h-4 text-indigo-600" />;
      case 'review':
        return <Star className="w-4 h-4 text-amber-500" />;
      case 'community':
        return <MessageSquare className="w-4 h-4 text-violet-600" />;
      case 'support':
        return <Headphones className="w-4 h-4 text-emerald-600" />;
      case 'system':
        return <Server className="w-4 h-4 text-slate-600" />;
      case 'security':
      default:
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
    }
  };

  const getCategoryBg = (category: HeaderNotificationCategory) => {
    switch (category) {
      case 'agency':
        return 'bg-purple-50 border-purple-100';
      case 'package':
        return 'bg-blue-50 border-blue-100';
      case 'booking':
        return 'bg-amber-50 border-amber-100';
      case 'payment':
        return 'bg-rose-50 border-rose-100';
      case 'user':
        return 'bg-indigo-50 border-indigo-100';
      case 'review':
        return 'bg-amber-50 border-amber-100';
      case 'community':
        return 'bg-violet-50 border-violet-100';
      case 'support':
        return 'bg-emerald-50 border-emerald-100';
      case 'system':
        return 'bg-slate-100 border-slate-200';
      case 'security':
      default:
        return 'bg-rose-50 border-rose-100';
    }
  };

  const getPriorityBadge = (priority: HeaderNotificationPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'LOW':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const renderNotificationCard = (item: HeaderNotificationItem) => {
    const isUnread = !item.isRead;

    return (
      <div
        key={item.id}
        onClick={() => handleCardClick(item)}
        className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer group select-none ${
          isUnread
            ? 'bg-purple-50/30 hover:bg-purple-50/60 border-purple-200/80 shadow-2xs border-l-4 border-l-[#6356E5]'
            : 'bg-white hover:bg-slate-50 border-slate-100'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Category Icon Badge */}
          <div
            className={`w-9 h-9 rounded-2xl border flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${getCategoryBg(
              item.category
            )}`}
          >
            {getCategoryIcon(item.category)}
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <h4
                  className={`text-xs truncate ${
                    isUnread
                      ? 'font-black text-[#0F172A]'
                      : 'font-bold text-slate-700'
                  }`}
                >
                  {item.title}
                </h4>
                {isUnread && (
                  <span className="w-2 h-2 rounded-full bg-[#6356E5] shrink-0" />
                )}
              </div>

              <span
                className={`px-1.5 py-0.2 rounded-md text-[8px] font-black border uppercase shrink-0 ${getPriorityBadge(
                  item.priority
                )}`}
              >
                {item.priority}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              {item.description}
            </p>

            {/* Bottom Row: Timestamp + Quick Action Buttons */}
            <div className="flex items-center justify-between pt-1.5 flex-wrap gap-2">
              <span className="text-[9px] font-mono font-bold text-slate-400">
                {item.timestamp}
              </span>

              {/* Action Buttons */}
              {item.actions && item.actions.length > 0 && (
                <div className="flex items-center gap-1.5">
                  {item.actions.map((act, idx) => {
                    if (act.variant === 'primary') {
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={(e) => handleActionClick(e, item, act.actionType)}
                          className="px-2.5 py-1 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-[10px] font-black transition-all cursor-pointer shadow-2xs"
                        >
                          {act.label}
                        </button>
                      );
                    }
                    if (act.variant === 'danger') {
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={(e) => handleActionClick(e, item, act.actionType)}
                          className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold border border-rose-200 transition-all cursor-pointer"
                        >
                          {act.label}
                        </button>
                      );
                    }
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => handleActionClick(e, item, act.actionType)}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-all cursor-pointer"
                      >
                        {act.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.98 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="absolute right-0 top-full mt-2 w-[340px] sm:w-[420px] max-h-[620px] bg-white rounded-3xl shadow-2xl border border-slate-100 z-[999] flex flex-col overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 1. STICKY HEADER ── */}
        <div className="p-4 pb-3 border-b border-slate-100 bg-white/95 backdrop-blur-md shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#6356E5] flex items-center justify-center border border-purple-100 shadow-2xs">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#0F172A]">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#6356E5] text-white text-[10px] font-black">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Real-time operational alerts & tasks
                </p>
              </div>
            </div>

            {/* Header Controls: Mark All Read & Refresh */}
            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-extrabold transition-all cursor-pointer"
                  title="Mark all notifications as read"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-[#6356E5]" />
                  <span className="hidden sm:inline">Mark Read</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleResetNotifications}
                className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                title="Refresh notifications"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── 2. FILTER TABS ── */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: `Unread (${unreadCount})` },
              { id: 'approvals', label: 'Approvals' },
              { id: 'support', label: 'Support' },
              { id: 'payments', label: 'Payments' },
              { id: 'security', label: 'Security' },
              { id: 'system', label: 'System' },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as HeaderNotificationTab)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#6356E5] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3. SCROLLABLE NOTIFICATION FEED ── */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3.5 scrollbar-thin">
          {filteredNotifications.length === 0 ? (
            /* Empty State */
            <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-purple-50 text-[#6356E5] flex items-center justify-center border border-purple-100 shadow-sm">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-[#0F172A]">You're all caught up!</h4>
                <p className="text-[11px] text-slate-400 font-medium max-w-[200px]">
                  No operational alerts pending in this view.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetNotifications}
                className="px-3.5 py-1.5 rounded-xl bg-purple-50 text-[#6356E5] hover:bg-purple-100 text-[10px] font-black transition-all cursor-pointer"
              >
                Reload Alerts
              </button>
            </div>
          ) : (
            <>
              {/* Today Section */}
              {todayItems.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Today
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 font-mono">
                      {todayItems.length} alerts
                    </span>
                  </div>
                  <div className="space-y-2">
                    {todayItems.map((item) => renderNotificationCard(item))}
                  </div>
                </div>
              )}

              {/* Yesterday Section */}
              {yesterdayItems.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Yesterday
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 font-mono">
                      {yesterdayItems.length} alerts
                    </span>
                  </div>
                  <div className="space-y-2">
                    {yesterdayItems.map((item) => renderNotificationCard(item))}
                  </div>
                </div>
              )}

              {/* Earlier Section */}
              {earlierItems.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Earlier
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 font-mono">
                      {earlierItems.length} alerts
                    </span>
                  </div>
                  <div className="space-y-2">
                    {earlierItems.map((item) => renderNotificationCard(item))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── 4. STICKY FOOTER ── */}
        <div className="p-2.5 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md flex items-center justify-between shrink-0">
          <span className="text-[10px] font-bold text-slate-400 pl-2">
            Showing {filteredNotifications.length} items
          </span>

          <button
            type="button"
            onClick={handleViewAllNotifications}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 hover:bg-[#EEF2FF] hover:text-[#6356E5] text-slate-700 text-[10px] font-black transition-all cursor-pointer shadow-2xs"
          >
            <span>View All Notifications</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </motion.div>

      {/* Quick Reply Modal */}
      <HeaderNotificationQuickReplyModal
        isOpen={!!replyTicketItem}
        notification={replyTicketItem}
        onClose={() => setReplyTicketItem(null)}
        onSendReply={handleSendTicketReply}
      />
    </>
  );
};
