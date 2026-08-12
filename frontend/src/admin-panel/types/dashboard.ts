// ─── Super Admin Dashboard Data Interfaces ──────────────────────────────────

export interface StatItem {
  id: string;
  title: string;
  value: string;
  growth: string;
  isPositive: boolean;
  comparisonText: string;
  iconName: 'revenue' | 'gmv' | 'agency' | 'users' | 'bookings' | 'trips' | 'approvals' | 'tickets';
  bgGradient: string;
  iconColor: string;
}

export interface DashboardStats {
  platformRevenue: StatItem;
  gmv: StatItem;
  activeAgencies: StatItem;
  totalUsers: StatItem;
  todaysBookings: StatItem;
  runningTrips: StatItem;
  pendingApprovals: StatItem;
  openSupportTickets: StatItem;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface RevenueMetric {
  title: string;
  currentValue: string;
  growthPct: string;
  dataPoints: ChartDataPoint[];
  footerText: string;
}

export interface BookingMetric {
  title: string;
  currentValue: string;
  growthPct: string;
  dataPoints: ChartDataPoint[];
  footerText: string;
}

export interface GrowthMetric {
  title: string;
  currentValue: string;
  growthPct: string;
  dataPoints: ChartDataPoint[];
  footerText: string;
}

export interface Activity {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  type: 'agency' | 'booking' | 'confirmation' | 'review' | 'payment';
  iconColor: string;
  bgColor: string;
}

export interface Transaction {
  id: string;
  transactionId: string;
  agencyName: string;
  amount: string;
  status: 'Success' | 'Pending' | 'Failed';
  statusColor: 'emerald' | 'amber' | 'rose';
  date: string;
}

export interface ApprovalRequest {
  id: string;
  name: string;
  type: 'Agency Registration' | 'Package Submission' | 'Verification Request';
  timeAgo: string;
  status: 'Pending' | 'Under Review';
  iconType: 'building' | 'package' | 'verification';
}

export interface ServiceHealthItem {
  id: string;
  name: string;
  status: 'Operational' | 'Degraded' | 'Down';
  uptimePct: string;
  iconType: 'api' | 'db' | 'gateway' | 'storage';
}

export interface SystemHealth {
  overallStatus: string;
  services: ServiceHealthItem[];
}

export interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'add_agency' | 'announcement' | 'report' | 'banner' | 'analytics';
  color: string;
  actionKey: string;
}
