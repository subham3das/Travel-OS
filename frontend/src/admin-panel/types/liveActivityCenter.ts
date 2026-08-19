// ─── Super Admin Live Activity Center Types ─────────────────────────

export type LiveEventType =
  | 'booking_created'
  | 'booking_cancelled'
  | 'booking_modified'
  | 'payment_success'
  | 'payment_failed'
  | 'refund_requested'
  | 'agency_registered'
  | 'agency_approved'
  | 'package_submitted'
  | 'package_approved'
  | 'user_registered'
  | 'review_reported'
  | 'support_ticket_raised'
  | 'cms_published'
  | 'admin_login'
  | 'security_alert';

export interface LiveEventItem {
  id: string;
  type: LiveEventType;
  title: string;
  subtitle: string;
  description: string;
  amount?: string;
  time: string;
  status: string;
  statusColor: 'emerald' | 'purple' | 'blue' | 'amber' | 'rose' | 'slate';
  targetRoute: string;
  timestamp: number;
}

export interface PlatformServiceStatus {
  id: string;
  name: string;
  status: 'Operational' | 'Healthy' | 'Connected' | 'Running' | 'Active' | 'Online';
  statusColor: 'emerald' | 'blue' | 'amber';
  lastChecked: string;
  latency?: string;
  uptime?: string;
}

export interface LiveMetricsData {
  onlineUsers: number;
  liveAgencies: number;
  bookingsToday: number;
  tripsRunning: number;
  paymentsProcessing: number;
  supportQueue: number;
}

export interface ActiveTripItem {
  id: string;
  title: string;
  agency: string;
  travelers: number;
  status: 'In Progress' | 'Boarding' | 'Departed' | 'Returning';
  destination: string;
  targetRoute: string;
}

export interface PaymentQueueItem {
  id: string;
  bookingId: string;
  amount: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  time: string;
  method: string;
  targetRoute: string;
}

export interface SupportQueueItem {
  id: string;
  subject: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Waiting Response' | 'Assigned';
  user: string;
  time: string;
  targetRoute: string;
}
