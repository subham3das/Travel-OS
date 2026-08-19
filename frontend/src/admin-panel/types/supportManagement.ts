// ─── Super Admin Support Management Types ─────────────────────────────────────

export type SupportTicketPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type SupportTicketStatus = 'Open' | 'Assigned' | 'Pending' | 'Escalated' | 'Closed';
export type SupportMessageSenderType = 'customer' | 'agent' | 'internal_note' | 'system';

export interface SupportKPICardItem {
  id: string;
  title: string;
  value: string;
  growth: string;
  isPositive: boolean;
  comparison: string;
  iconType: 'open' | 'critical' | 'response_time' | 'resolution' | 'agents' | 'csat';
  sparklineColor: string;
}

export interface SupportKPIStats {
  openTickets: SupportKPICardItem;
  criticalTickets: SupportKPICardItem;
  avgResponseTime: SupportKPICardItem;
  resolutionRate: SupportKPICardItem;
  activeAgents: SupportKPICardItem;
  customerSatisfaction: SupportKPICardItem;
}

export interface SupportMessageAttachment {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
}

export interface SupportMessage {
  id: string;
  senderType: SupportMessageSenderType;
  senderName: string;
  senderAvatar?: string;
  senderRole?: string;
  text: string;
  timestamp: string;
  isRead?: boolean;
  attachments?: SupportMessageAttachment[];
}

export interface SupportCustomerInfo {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  userType: 'Traveler' | 'Agency Partner' | 'Guide';
  totalBookings: number;
  totalTickets: number;
  verified: boolean;
  memberSince: string;
}

export interface SupportActivityLogItem {
  id: string;
  action: string;
  actor: string;
  time: string;
}

export interface SupportTicketItem {
  id: string; // e.g. #TKT-98213
  customer: SupportCustomerInfo;
  subject: string;
  category: 'Refund' | 'Check-in' | 'Package' | 'Payment' | 'Invoice' | 'Technical' | 'Account' | 'Other';
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  assignedAgent?: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  timeAgo: string;
  createdAt: string;
  channel: 'Email' | 'Chat' | 'Phone' | 'Web Portal';
  unreadCount: number;
  commentsCount: number;
  messages: SupportMessage[];
  activityLog?: SupportActivityLogItem[];
  bookingId?: string;
}

export interface SupportCategoryDistributionItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface SupportResolutionTimeItem {
  range: string;
  percentage: number;
  color: string;
}

export interface SupportAgentPerformanceItem {
  id: string;
  name: string;
  avatar: string;
  assigned: number;
  resolved: number;
  resolutionTime: string;
  slaCompliance: number;
  rating: number;
}

export interface SupportIssueTagItem {
  tag: string;
  count: number;
  size: 'large' | 'medium' | 'small';
  color: string;
  bgColor: string;
}

export interface SupportStatusDistributionItem {
  name: SupportTicketStatus;
  count: number;
  percentage: number;
  color: string;
}

export interface SupportAnalyticsData {
  volumeTrend: { date: string; label: string; tickets: number }[];
  categories: SupportCategoryDistributionItem[];
  overallResolutionTime: {
    average: string;
    change: string;
    isPositive: boolean;
    distribution: SupportResolutionTimeItem[];
  };
  slaCompliance: {
    rate: number;
    statusText: string;
    withinSLA: number;
    breached: number;
  };
  agentLeaderboard: SupportAgentPerformanceItem[];
  issueTags: SupportIssueTagItem[];
  statusDistribution: SupportStatusDistributionItem[];
  csatTrend: { label: string; date: string; score: number }[];
}

export interface SupportFilters {
  status: 'All' | SupportTicketStatus;
  priority: 'All' | SupportTicketPriority;
  category: string;
  search: string;
  sortBy: 'Newest' | 'Oldest' | 'Priority' | 'Unread';
}
