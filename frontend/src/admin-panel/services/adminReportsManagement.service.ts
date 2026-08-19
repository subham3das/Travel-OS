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
import {
  initialReportKPIStats,
  initialReportLibraryData,
  initialRevenueTrend,
  initialBookingHeatmapMatrix,
  initialGeographicData,
  initialTopDestinations,
  initialAgencyMatrixBubbles,
  initialCategoryPerformance,
  initialAIInsights,
  initialQuickStatistics,
  initialScheduledReports,
  initialRecentExports,
} from '../data/reportsData';

class AdminReportsManagementService {
  private kpiStats: ReportKPIStats = initialReportKPIStats;
  private reports: ReportItem[] = initialReportLibraryData;
  private revenueTrend: RevenueTrendDataPoint[] = initialRevenueTrend;
  private heatmapMatrix: number[][] = initialBookingHeatmapMatrix;
  private geographicData: GeographicRegionData[] = initialGeographicData;
  private topDestinations: TopDestinationReportItem[] = initialTopDestinations;
  private agencyBubbles: AgencyMatrixBubble[] = initialAgencyMatrixBubbles;
  private categoryPerformance: CategoryPerformanceItem[] = initialCategoryPerformance;
  private aiInsights: AIInsightItem[] = initialAIInsights;
  private quickStats = initialQuickStatistics;
  private scheduledReports: ScheduledReportItem[] = initialScheduledReports;
  private recentExports: RecentExportItem[] = initialRecentExports;

  public async getKPIStats(): Promise<ReportKPIStats> {
    return new Promise((resolve) => setTimeout(() => resolve(this.kpiStats), 40));
  }

  public async getReports(
    category?: ReportCategory,
    tab?: string,
    searchQuery?: string
  ): Promise<ReportItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...this.reports];

        if (category && category !== 'All') {
          result = result.filter((r) => r.category.toLowerCase() === category.toLowerCase());
        }

        if (tab === 'Scheduled') {
          result = result.filter((r) => r.scheduleStatus && r.scheduleStatus !== 'On Demand');
        }

        if (searchQuery && searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          result = result.filter(
            (r) =>
              r.name.toLowerCase().includes(q) ||
              r.category.toLowerCase().includes(q) ||
              r.owner.toLowerCase().includes(q)
          );
        }

        resolve(result);
      }, 40);
    });
  }

  public async getRevenueTrend(interval: 'Daily' | 'Weekly' | 'Monthly'): Promise<RevenueTrendDataPoint[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.revenueTrend), 40));
  }

  public async getBookingHeatmap(): Promise<number[][]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.heatmapMatrix), 40));
  }

  public async getGeographicData(): Promise<GeographicRegionData[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.geographicData), 40));
  }

  public async getTopDestinations(): Promise<TopDestinationReportItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.topDestinations), 40));
  }

  public async getAgencyMatrix(): Promise<AgencyMatrixBubble[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.agencyBubbles), 40));
  }

  public async getCategoryPerformance(): Promise<CategoryPerformanceItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.categoryPerformance), 40));
  }

  public async getAIInsights(): Promise<AIInsightItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.aiInsights), 40));
  }

  public async getQuickStats(): Promise<QuickStatisticsData> {
    return new Promise((resolve) => setTimeout(() => resolve(this.quickStats), 40));
  }

  public async getScheduledReports(): Promise<ScheduledReportItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.scheduledReports), 40));
  }

  public async getRecentExports(): Promise<RecentExportItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.recentExports), 40));
  }

  public async createReport(name: string, category: ReportCategory): Promise<ReportItem> {
    const newReport: ReportItem = {
      id: `REP-${Date.now().toString().slice(-4)}`,
      name,
      category,
      lastGenerated: 'Just now',
      owner: 'Super Admin',
      availableFormats: ['PDF', 'Excel', 'CSV'],
      scheduleStatus: 'On Demand',
    };
    this.reports = [newReport, ...this.reports];
    return newReport;
  }

  public async recordExport(name: string, format: 'PDF' | 'Excel' | 'CSV'): Promise<RecentExportItem> {
    const newExport: RecentExportItem = {
      id: `exp-${Date.now()}`,
      name,
      date: 'Just now',
      format,
    };
    this.recentExports = [newExport, ...this.recentExports];
    return newExport;
  }
}

export const adminReportsManagementService = new AdminReportsManagementService();
