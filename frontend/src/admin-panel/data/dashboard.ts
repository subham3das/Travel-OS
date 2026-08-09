// ─── Super Admin Dashboard Mock Data ─────────────────────────────────────────

import { AgencyVerificationStatus } from '../../agency-panel/types/agency';

export interface KPIStatItem {
  id: string;
  title: string;
  count: number;
  trend: string;
  isPositive: boolean;
  type: AgencyVerificationStatus;
}

export const MOCK_KPI_STATS: KPIStatItem[] = [
  {
    id: 'kpi-pending',
    title: 'Pending Applications',
    count: 28,
    trend: '↑ 12% from yesterday',
    isPositive: true,
    type: AgencyVerificationStatus.PENDING,
  },
  {
    id: 'kpi-review',
    title: 'Under Review',
    count: 46,
    trend: '↑ 8% from yesterday',
    isPositive: true,
    type: AgencyVerificationStatus.UNDER_REVIEW,
  },
  {
    id: 'kpi-approved',
    title: 'Approved Agencies',
    count: 152,
    trend: '↑ 15% from last month',
    isPositive: true,
    type: AgencyVerificationStatus.APPROVED,
  },
  {
    id: 'kpi-rejected',
    title: 'Rejected Agencies',
    count: 18,
    trend: '↓ 3% from last month',
    isPositive: false,
    type: AgencyVerificationStatus.REJECTED,
  },
];

export interface ChartDataPoint {
  date: string;
  applications: number;
}

export const MOCK_CHART_7_DAYS: ChartDataPoint[] = [
  { date: 'May 2', applications: 24 },
  { date: 'May 3', applications: 40 },
  { date: 'May 4', applications: 28 },
  { date: 'May 5', applications: 48 },
  { date: 'May 6', applications: 30 },
  { date: 'May 7', applications: 56 },
  { date: 'May 8', applications: 68 },
];

export const MOCK_CHART_30_DAYS: ChartDataPoint[] = [
  { date: 'Week 1', applications: 180 },
  { date: 'Week 2', applications: 240 },
  { date: 'Week 3', applications: 310 },
  { date: 'Week 4', applications: 420 },
];

export interface StatusDistributionItem {
  status: AgencyVerificationStatus;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export const MOCK_STATUS_DISTRIBUTION: StatusDistributionItem[] = [
  {
    status: AgencyVerificationStatus.PENDING,
    label: 'Pending',
    count: 28,
    percentage: 11.5,
    color: '#583BE8', // Purple
  },
  {
    status: AgencyVerificationStatus.UNDER_REVIEW,
    label: 'Under Review',
    count: 46,
    percentage: 18.8,
    color: '#F59E0B', // Amber
  },
  {
    status: AgencyVerificationStatus.APPROVED,
    label: 'Approved',
    count: 152,
    percentage: 62.3,
    color: '#10B981', // Emerald
  },
  {
    status: AgencyVerificationStatus.REJECTED,
    label: 'Rejected',
    count: 18,
    percentage: 7.4,
    color: '#EF4444', // Rose
  },
];

export interface ActivityTimelineItem {
  id: string;
  title: string;
  target: string;
  timestamp: string;
  type: AgencyVerificationStatus | 'USER';
}

export const MOCK_RECENT_ACTIVITIES: ActivityTimelineItem[] = [
  {
    id: 'act-1',
    title: 'New agency application submitted',
    target: 'Wanderlust Holidays',
    timestamp: '10:30 AM',
    type: AgencyVerificationStatus.PENDING,
  },
  {
    id: 'act-2',
    title: 'Agency moved to under review',
    target: 'NorthEast Explorers',
    timestamp: '09:15 AM',
    type: AgencyVerificationStatus.UNDER_REVIEW,
  },
  {
    id: 'act-3',
    title: 'Agency approved',
    target: 'Himalayan Trails',
    timestamp: 'Yesterday',
    type: AgencyVerificationStatus.APPROVED,
  },
  {
    id: 'act-4',
    title: 'Agency application rejected',
    target: 'Travel With Us',
    timestamp: 'Yesterday',
    type: AgencyVerificationStatus.REJECTED,
  },
  {
    id: 'act-5',
    title: 'New admin user added',
    target: 'admin@apnatrip.com',
    timestamp: 'May 7, 2026',
    type: 'USER',
  },
];
