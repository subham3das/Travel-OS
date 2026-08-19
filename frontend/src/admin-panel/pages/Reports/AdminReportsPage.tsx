import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from '../../types/reportsManagement';
import { adminReportsManagementService } from '../../services/adminReportsManagement.service';
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
} from '../../data/reportsData';
import { AdminReportsHeader } from '../../components/super-admin/reports/AdminReportsHeader';
import { ReportKPIStatsCards } from '../../components/super-admin/reports/ReportKPIStats';
import { ReportLibrary } from '../../components/super-admin/reports/ReportLibrary';
import { ReportsAnalyticsWorkspace } from '../../components/super-admin/reports/ReportsAnalyticsWorkspace';
import { ExecutiveInsightsSidebar } from '../../components/super-admin/reports/ExecutiveInsightsSidebar';
import { CreateCustomReportModal } from '../../components/super-admin/reports/CreateCustomReportModal';

export const AdminReportsPage: React.FC = () => {
  // ── 1. STATE MANAGEMENT ──
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ReportCategory>('All');
  const [activeTab, setActiveTab] = useState('All Reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Data States
  const [kpiStats, setKpiStats] = useState<ReportKPIStats>(initialReportKPIStats);
  const [reports, setReports] = useState<ReportItem[]>(initialReportLibraryData);
  const [selectedReport, setSelectedReport] = useState<ReportItem>(initialReportLibraryData[0]);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrendDataPoint[]>(initialRevenueTrend);
  const [heatmapMatrix, setHeatmapMatrix] = useState<number[][]>(initialBookingHeatmapMatrix);
  const [geographicData, setGeographicData] = useState<GeographicRegionData[]>(initialGeographicData);
  const [topDestinations, setTopDestinations] = useState<TopDestinationReportItem[]>(initialTopDestinations);
  const [agencyBubbles, setAgencyBubbles] = useState<AgencyMatrixBubble[]>(initialAgencyMatrixBubbles);
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformanceItem[]>(initialCategoryPerformance);
  const [aiInsights, setAiInsights] = useState<AIInsightItem[]>(initialAIInsights);
  const [quickStats, setQuickStats] = useState<QuickStatisticsData>(initialQuickStatistics);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReportItem[]>(initialScheduledReports);
  const [recentExports, setRecentExports] = useState<RecentExportItem[]>(initialRecentExports);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 2. DATA FETCHING ──
  const loadReportsData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [
        stats,
        reportList,
        trend,
        heatmap,
        geo,
        destinations,
        bubbles,
        cats,
        insights,
        statsObj,
        scheduled,
        exportsList,
      ] = await Promise.all([
        adminReportsManagementService.getKPIStats(),
        adminReportsManagementService.getReports(activeCategory, activeTab, searchQuery),
        adminReportsManagementService.getRevenueTrend('Daily'),
        adminReportsManagementService.getBookingHeatmap(),
        adminReportsManagementService.getGeographicData(),
        adminReportsManagementService.getTopDestinations(),
        adminReportsManagementService.getAgencyMatrix(),
        adminReportsManagementService.getCategoryPerformance(),
        adminReportsManagementService.getAIInsights(),
        adminReportsManagementService.getQuickStats(),
        adminReportsManagementService.getScheduledReports(),
        adminReportsManagementService.getRecentExports(),
      ]);

      setKpiStats(stats);
      setReports(reportList);
      setRevenueTrend(trend);
      setHeatmapMatrix(heatmap);
      setGeographicData(geo);
      setTopDestinations(destinations);
      setAgencyBubbles(bubbles);
      setCategoryPerformance(cats);
      setAiInsights(insights);
      setQuickStats(statsObj);
      setScheduledReports(scheduled);
      setRecentExports(exportsList);

      if (reportList.length > 0 && !reportList.some((r: ReportItem) => r.id === selectedReport?.id)) {
        setSelectedReport(reportList[0]);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load reports and analytics data', 'error');
    } finally {
      setIsRefreshing(false);
    }
  }, [activeCategory, activeTab, searchQuery, selectedReport]);

  useEffect(() => {
    loadReportsData();
  }, [loadReportsData]);

  // ── 3. OPERATIONAL ACTIONS ──
  const handleCreateReport = async (name: string, category: ReportCategory) => {
    const created = await adminReportsManagementService.createReport(name, category);
    loadReportsData();
    showToast(`New custom report "${created.name}" generated in library`, 'success');
  };

  const handleExportFormat = async (format: 'PDF' | 'Excel' | 'CSV') => {
    const reportName = selectedReport?.name || 'Platform Revenue Report';
    await adminReportsManagementService.recordExport(reportName, format);

    // Trigger dummy download
    const headers = ['Metric', 'Value', 'Growth', 'Date Range'];
    const rows = [
      ['Gross Revenue', '₹12,48,75,890', '+18.6%', 'Jun 1 - Jun 12, 2024'],
      ['Total Bookings', '24,875', '+15.3%', 'Jun 1 - Jun 12, 2024'],
      ['Active Users', '1,24,856', '+11.2%', 'Jun 1 - Jun 12, 2024'],
      ['Top Destination', 'Ladakh (₹2.48 Cr)', '+22.4%', 'Jun 1 - Jun 12, 2024'],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.${format.toLowerCase() === 'excel' ? 'csv' : format.toLowerCase()}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    loadReportsData();
    showToast(`${reportName} exported successfully as ${format}`, 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5 select-none"
    >
      {/* ── TOAST NOTIFICATIONS ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 shadow-xl"
          >
            <div
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg ${
                toast.type === 'success'
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : toast.type === 'error'
                  ? 'bg-rose-600 text-white shadow-rose-500/20'
                  : 'bg-[#6356E5] text-white shadow-[#6356E5]/20'
              }`}
            >
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. PAGE HEADER ── */}
      <AdminReportsHeader
        onRefresh={loadReportsData}
        onCreateCustomReport={() => setIsCreateModalOpen(true)}
        isRefreshing={isRefreshing}
      />

      {/* ── 2. 8 EXECUTIVE KPI CARDS ── */}
      <ReportKPIStatsCards
        stats={kpiStats}
        onCardClick={(id) => {
          if (id === 'grossRevenue') setActiveCategory('Financial');
          else if (id === 'totalBookings') setActiveCategory('Bookings');
          else if (id === 'activeUsers') setActiveCategory('Users');
          else if (id === 'activeAgencies') setActiveCategory('Agencies');
          else setActiveCategory('All');
        }}
      />

      {/* ── 3. MAIN 3-PANEL BI WORKSPACE (LIBRARY | WORKSPACE | EXECUTIVE INSIGHTS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Panel: Report Library (≈22% / lg:col-span-3) */}
        <div className="lg:col-span-3">
          <ReportLibrary
            reports={reports}
            selectedReportId={selectedReport?.id}
            onSelectReport={(r) => {
              setSelectedReport(r);
              showToast(`Loaded ${r.name} analytics workspace`, 'info');
            }}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCreateReport={() => setIsCreateModalOpen(true)}
            onViewAllReports={() => showToast('Opening comprehensive report directory', 'info')}
          />
        </div>

        {/* Center Panel: Analytics Workspace (≈53% / lg:col-span-6) */}
        <div className="lg:col-span-6">
          <ReportsAnalyticsWorkspace
            revenueTrend={revenueTrend}
            heatmapMatrix={heatmapMatrix}
            geographicData={geographicData}
            topDestinations={topDestinations}
            agencyBubbles={agencyBubbles}
            categoryPerformance={categoryPerformance}
            onViewAllDestinations={() => showToast('Displaying full destination analytics matrix', 'info')}
          />
        </div>

        {/* Right Panel: Executive Insights Sidebar (≈25% / lg:col-span-3) */}
        <div className="lg:col-span-3 sticky top-20">
          <ExecutiveInsightsSidebar
            insights={aiInsights}
            quickStats={quickStats}
            scheduledReports={scheduledReports}
            recentExports={recentExports}
            onExportPDF={() => handleExportFormat('PDF')}
            onExportExcel={() => handleExportFormat('Excel')}
            onExportCSV={() => handleExportFormat('CSV')}
            onScheduleReport={() => showToast('Opening report automation schedule manager', 'info')}
            onEmailReport={() => showToast('Dispatched executive summary to admin email', 'success')}
            onViewDetailedInsights={() => showToast('Displaying deep-dive AI narrative model', 'info')}
            onViewAllScheduled={() => showToast('Opening recurring scheduled dispatch calendar', 'info')}
            onViewAllExports={() => showToast('Viewing export archives', 'info')}
          />
        </div>
      </div>

      {/* ── 4. CREATE CUSTOM REPORT MODAL ── */}
      <CreateCustomReportModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateReport}
      />
    </motion.div>
  );
};

export default AdminReportsPage;
