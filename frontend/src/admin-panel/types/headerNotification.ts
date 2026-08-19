// ─── Super Admin Header Notification Center Types ───────────────────────────

export type HeaderNotificationCategory =
  | 'agency'
  | 'package'
  | 'booking'
  | 'payment'
  | 'user'
  | 'review'
  | 'community'
  | 'support'
  | 'system'
  | 'security';

export type HeaderNotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type HeaderNotificationTab =
  | 'all'
  | 'unread'
  | 'approvals'
  | 'support'
  | 'payments'
  | 'security'
  | 'system';

export interface HeaderNotificationAction {
  label: string;
  actionType:
    | 'approve_agency'
    | 'reject_agency'
    | 'approve_package'
    | 'reject_package'
    | 'verify_booking'
    | 'retry_payment'
    | 'refund_payment'
    | 'reply_ticket'
    | 'assign_ticket'
    | 'approve_review'
    | 'reject_review'
    | 'take_down_post'
    | 'dismiss_post'
    | 'investigate_security'
    | 'view';
  variant?: 'primary' | 'danger' | 'secondary';
}

export interface HeaderNotificationItem {
  id: string;
  category: HeaderNotificationCategory;
  title: string;
  description: string;
  timestamp: string;
  timeGroup: 'Today' | 'Yesterday' | 'Earlier';
  priority: HeaderNotificationPriority;
  isRead: boolean;
  targetRoute: string;
  actions?: HeaderNotificationAction[];
  meta?: {
    entityId?: string;
    entityName?: string;
    amount?: string;
    userEmail?: string;
  };
}
