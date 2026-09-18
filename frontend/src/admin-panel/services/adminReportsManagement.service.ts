import {
  ReportKPIStats,
  ReportItem,
  ReportCategory,
  RevenueTrendDataPoint,
  GeographicRegionData,
  TopDestinationReportItem,
  AgencyMatrixBubble,
  CategoryPerformanceItem,
  AIInsightItem,
  ScheduledReportItem,
  RecentExportItem,
  QuickStatisticsData,
} from '../types/reportsManagement';
import { adminApiClient } from './adminApiClient';

// ─── Empty defaults (zero-value, no dummy data) ─────────────────────────────

const emptyKPICard = {
  id: '', title: '', value: '₹0', growth: '0%',
  isPositive: true, comparison: 'vs last 30 days', iconType: 'revenue' as const, sparklineColor: '#6356E5',
};

export const emptyReportKPIStats: ReportKPIStats = {
  grossRevenue: { ...emptyKPICard, id: 'grossRevenue', title: 'Gross Revenue', iconType: 'revenue' },
  totalBookings: { ...emptyKPICard, id: 'totalBookings', title: 'Total Bookings', value: '0', iconType: 'bookings', sparklineColor: '#10B981' },
  platformGrowth: { ...emptyKPICard, id: 'platformGrowth', title: 'Platform Growth', value: '0%', iconType: 'growth', sparklineColor: '#10B981' },
  activeUsers: { ...emptyKPICard, id: 'activeUsers', title: 'Active Users', value: '0', iconType: 'users', sparklineColor: '#3B82F6' },
  activeAgencies: { ...emptyKPICard, id: 'activeAgencies', title: 'Active Agencies', value: '0', iconType: 'agencies' },
  avgBookingValue: { ...emptyKPICard, id: 'avgBookingValue', title: 'Avg. Booking Value', iconType: 'abv', sparklineColor: '#F97316' },
  customerSatisfaction: { ...emptyKPICard, id: 'customerSatisfaction', title: 'Customer Satisfaction', value: 'N/A', iconType: 'csat', sparklineColor: '#F59E0B' },
  netProfit: { ...emptyKPICard, id: 'netProfit', title: 'Net Profit', iconType: 'profit', sparklineColor: '#8B5CF6' },
};

// ─── Service ─────────────────────────────────────────────────────────────────

class AdminReportsManagementService {
  public async getKPIStats(): Promise<ReportKPIStats> {
    try {
      const response = await adminApiClient.get<ReportKPIStats>('/admin/reports/stats');
      if (response.success && response.data) return response.data;
      return emptyReportKPIStats;
    } catch {
      return emptyReportKPIStats;
    }
  }

  public async getReports(
    category?: ReportCategory,
    tab?: string,
    searchQuery?: string
  ): Promise<ReportItem[]> {
    try {
      const response = await adminApiClient.get<ReportItem[]>('/admin/reports/library');
      if (response.success && response.data) {
        let result = response.data;
        if (category && category !== 'All') {
          result = result.filter((r) => r.category.toLowerCase() === category.toLowerCase());
        }
        if (searchQuery && searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          result = result.filter((r) => r.name.toLowerCase().includes(q));
        }
        return result;
      }
      return [];
    } catch {
      return [];
    }
  }

  public async getRevenueTrend(interval: 'Daily' | 'Weekly' | 'Monthly'): Promise<RevenueTrendDataPoint[]> {
    try {
      const response = await adminApiClient.get<RevenueTrendDataPoint[]>('/admin/reports/revenue-trend', {
        params: { interval },
      });
      if (response.success && response.data) return response.data;
      return [];
    } catch {
      return [];
    }
  }

  public async getBookingHeatmap(): Promise<number[][]> {
    try {
      const response = await adminApiClient.get<number[][]>('/admin/reports/booking-heatmap');
      if (response.success && response.data) return response.data;
      return Array.from({ length: 7 }, () => Array(7).fill(0));
    } catch {
      return Array.from({ length: 7 }, () => Array(7).fill(0));
    }
  }

  public async getGeographicData(): Promise<GeographicRegionData[]> {
    try {
      const response = await adminApiClient.get<GeographicRegionData[]>('/admin/reports/geographic');
      if (response.success && response.data) return response.data;
      return [];
    } catch {
      return [];
    }
  }

  public async getTopDestinations(): Promise<TopDestinationReportItem[]> {
    try {
      const response = await adminApiClient.get<TopDestinationReportItem[]>('/admin/reports/top-destinations');
      if (response.success && response.data) return response.data;
      return [];
    } catch {
      return [];
    }
  }

  public async getAgencyMatrix(): Promise<AgencyMatrixBubble[]> {
    try {
      const response = await adminApiClient.get<AgencyMatrixBubble[]>('/admin/reports/agency-matrix');
      if (response.success && response.data) return response.data;
      return [];
    } catch {
      return [];
    }
  }

  public async getCategoryPerformance(): Promise<CategoryPerformanceItem[]> {
    try {
      const response = await adminApiClient.get<CategoryPerformanceItem[]>('/admin/reports/category-performance');
      if (response.success && response.data) return response.data;
      return [];
    } catch {
      return [];
    }
  }

  public async getAIInsights(): Promise<AIInsightItem[]> {
    try {
      const response = await adminApiClient.get<AIInsightItem[]>('/admin/reports/ai-insights');
      if (response.success && response.data) return response.data;
      return [];
    } catch {
      return [];
    }
  }

  public async getQuickStats(): Promise<QuickStatisticsData> {
    try {
      const response = await adminApiClient.get<QuickStatisticsData>('/admin/reports/quick-stats');
      if (response.success && response.data) return response.data;
      return emptyQuickStats;
    } catch {
      return emptyQuickStats;
    }
  }

  // Client-side only — no backing collection
  public async getScheduledReports(): Promise<ScheduledReportItem[]> {
    return [];
  }

  // Client-side only — no backing collection
  public async getRecentExports(): Promise<RecentExportItem[]> {
    return [];
  }

  public async createReport(name: string, category: ReportCategory): Promise<ReportItem> {
    return {
      id: `REP-${Date.now().toString().slice(-4)}`,
      name,
      category,
      lastGenerated: 'Just now',
      owner: 'Super Admin',
      availableFormats: ['PDF', 'Excel', 'CSV'],
      scheduleStatus: 'On Demand',
    };
  }

  public async recordExport(name: string, format: 'PDF' | 'Excel' | 'CSV'): Promise<RecentExportItem> {
    return {
      id: `exp-${Date.now()}`,
      name,
      date: 'Just now',
      format,
    };
  }
}

const emptyQuickStats: QuickStatisticsData = {
  cancellationRate: { value: '0%', change: '0%', isPositive: true },
  refundsProcessed: { value: '₹0', change: '0%', isPositive: true },
  successfulPayments: { value: '0%', change: '0%', isPositive: true },
  chargebackRate: { value: '0%', change: '0%', isPositive: true },
};

export const adminReportsManagementService = new AdminReportsManagementService();
