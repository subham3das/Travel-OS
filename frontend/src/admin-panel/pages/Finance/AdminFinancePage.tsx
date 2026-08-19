import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FinanceKPIStats,
  RevenueChartPoint,
  CommissionBreakdownItem,
  DestinationRevenueItem,
  TopPerformingAgencyItem,
  FinancialSummaryData,
  RefundAnalyticsData,
  SettlementRecord,
  FinancialTimelineEvent,
  AgencySidebarProfileData,
} from '../../types/financeManagement';
import {
  adminFinanceManagementService,
  initialFinanceKPIStats,
  initialCommissionBreakdown,
  initialDestinationRevenues,
  initialTopAgencies,
  initialFinancialSummary,
  initialRefundAnalytics,
  initialSettlementRows,
  initialFinancialTimeline,
  initialAgencySidebarData,
} from '../../services/adminFinanceManagement.service';
import { AdminFinanceHeader } from '../../components/super-admin/finance/AdminFinanceHeader';
import { FinanceStats } from '../../components/super-admin/finance/FinanceStats';
import { RevenueOverviewChart } from '../../components/super-admin/finance/RevenueOverviewChart';
import { CommissionBreakdown } from '../../components/super-admin/finance/CommissionBreakdown';
import { RevenueDestinationChart } from '../../components/super-admin/finance/RevenueDestinationChart';
import { TopPerformingAgencies } from '../../components/super-admin/finance/TopPerformingAgencies';
import { FinancialSummary } from '../../components/super-admin/finance/FinancialSummary';
import { RefundAnalytics } from '../../components/super-admin/finance/RefundAnalytics';
import { SettlementTable } from '../../components/super-admin/finance/SettlementTable';
import { FinancialTimeline } from '../../components/super-admin/finance/FinancialTimeline';
import { AgencyFinanceSidebar } from '../../components/super-admin/finance/AgencyFinanceSidebar';
import { SettlementDetailModal } from '../../components/super-admin/finance/SettlementDetailModal';

export const AdminFinancePage: React.FC = () => {
  const navigate = useNavigate();

  // ── 1. STATE MANAGEMENT ──
  const [dateRange] = useState('Jun 1, 2024 - Jun 12, 2024');
  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data states
  const [kpiStats, setKpiStats] = useState<FinanceKPIStats>(initialFinanceKPIStats);
  const [revenueChartData, setRevenueChartData] = useState<RevenueChartPoint[]>([]);
  const [commissionItems, setCommissionItems] = useState<CommissionBreakdownItem[]>(initialCommissionBreakdown);
  const [destinationRevenues, setDestinationRevenues] = useState<DestinationRevenueItem[]>(initialDestinationRevenues);
  const [topAgencies, setTopAgencies] = useState<TopPerformingAgencyItem[]>(initialTopAgencies);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummaryData>(initialFinancialSummary);
  const [refundAnalytics, setRefundAnalytics] = useState<RefundAnalyticsData>(initialRefundAnalytics);
  const [settlements, setSettlements] = useState<SettlementRecord[]>(initialSettlementRows);
  const [timelineItems, setTimelineItems] = useState<FinancialTimelineEvent[]>(initialFinancialTimeline);
  const [sidebarData, setSidebarData] = useState<AgencySidebarProfileData | null>(initialAgencySidebarData);

  // Modals & feedback
  const [selectedSettlementForModal, setSelectedSettlementForModal] = useState<SettlementRecord | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 2. DATA FETCHING ──
  const loadFinanceData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [
        stats,
        revPoints,
        commissions,
        destinations,
        agencies,
        summary,
        refunds,
        settles,
        timeline,
      ] = await Promise.all([
        adminFinanceManagementService.getKPIStats(),
        adminFinanceManagementService.getRevenueOverview(timeframe),
        adminFinanceManagementService.getCommissionBreakdown(),
        adminFinanceManagementService.getDestinationRevenues(),
        adminFinanceManagementService.getTopAgencies(),
        adminFinanceManagementService.getFinancialSummary(),
        adminFinanceManagementService.getRefundAnalytics(),
        adminFinanceManagementService.getSettlements(),
        adminFinanceManagementService.getFinancialTimeline(),
      ]);

      setKpiStats(stats);
      setRevenueChartData(revPoints);
      setCommissionItems(commissions);
      setDestinationRevenues(destinations);
      setTopAgencies(agencies);
      setFinancialSummary(summary);
      setRefundAnalytics(refunds);
      setSettlements(settles);
      setTimelineItems(timeline);
    } catch (err) {
      console.error(err);
      showToast('Failed to refresh finance data', 'error');
    } finally {
      setIsRefreshing(false);
    }
  }, [timeframe]);

  useEffect(() => {
    loadFinanceData();
  }, [loadFinanceData]);

  // ── 3. HANDLERS ──
  const handleSelectAgencyForSidebar = async (agency: TopPerformingAgencyItem) => {
    const updated = await adminFinanceManagementService.getAgencySidebarData(agency.agencyName);
    setSidebarData({
      ...updated,
      agencyName: agency.agencyName,
      agencyLogo: agency.agencyLogo,
      rating: agency.rating,
      revenueOverview: {
        totalRevenue: agency.revenue,
        bookings: agency.bookings,
        avgBookingValue: '₹21,474',
        totalCommission: agency.commission,
      },
    });
    setIsSidebarOpen(true);
    showToast(`Viewing ${agency.agencyName} finance drawer`, 'info');
  };

  const handleApproveSettlement = async (settlement: SettlementRecord) => {
    await adminFinanceManagementService.approveSettlement(settlement.id);
    setSettlements((prev) =>
      prev.map((s) => (s.id === settlement.id ? { ...s, status: 'Settled' } : s))
    );
    showToast(`Settlement ${settlement.id} approved and disbursed!`, 'success');
  };

  const handleRejectSettlement = async (settlement: SettlementRecord) => {
    await adminFinanceManagementService.rejectSettlement(settlement.id);
    setSettlements((prev) =>
      prev.map((s) => (s.id === settlement.id ? { ...s, status: 'Failed' } : s))
    );
    showToast(`Settlement ${settlement.id} rejected / placed on hold`, 'error');
  };

  const handleExportReport = () => {
    const csvRows = [
      ['Metric', 'Value'],
      ['Gross Merchandise Value', '₹24.68 Cr'],
      ['Platform Revenue', '₹3.74 Cr'],
      ['Platform Profit', '₹2.18 Cr'],
      ['Pending Agency Payouts', '₹8.73 Cr'],
      ['Completed Settlements', '₹15.95 Cr'],
      ['Refund Amount', '₹1.32 Cr'],
      ['Taxes Collected', '₹1.85 Cr'],
      ['Net Earnings', '₹2.52 Cr'],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `travelos_financial_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Financial report exported successfully', 'success');
  };

  const handleDownloadStatement = () => {
    handleExportReport();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5 select-none"
    >
      {/* ── TOAST NOTIFICATION ── */}
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
      <AdminFinanceHeader
        dateRange={dateRange}
        onDateRangeClick={() => showToast('Date range: June 1 – June 12, 2024', 'info')}
        onExportReport={handleExportReport}
        onDownloadStatement={handleDownloadStatement}
        onRefresh={loadFinanceData}
        isRefreshing={isRefreshing}
      />

      {/* ── 2. KPI STATS (8 CARDS) ── */}
      <FinanceStats
        stats={kpiStats}
        onCardClick={(id) => showToast(`Filtered analytics for ${id.toUpperCase()}`, 'info')}
      />

      {/* ── 3. MAIN WORKSPACE: 3-ROW ANALYTICS GRID ── */}
      <div className="space-y-5 w-full">
        {/* ── FIRST ANALYTICS ROW (3 CARDS) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 items-stretch">
          {/* Revenue Overview */}
          <div className="h-full min-w-0 md:col-span-2 2xl:col-span-1">
            <RevenueOverviewChart
              data={revenueChartData}
              timeframe={timeframe}
              onTimeframeChange={(tf) => setTimeframe(tf)}
            />
          </div>

          {/* Commission Breakdown */}
          <div className="h-full min-w-0">
            <CommissionBreakdown items={commissionItems} />
          </div>

          {/* Revenue by Destination */}
          <div className="h-full min-w-0">
            <RevenueDestinationChart destinations={destinationRevenues} />
          </div>
        </div>

        {/* ── SECOND ANALYTICS ROW (3 CARDS) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 items-stretch">
          {/* Top Performing Agencies */}
          <div className="h-full min-w-0 md:col-span-2 2xl:col-span-1">
            <TopPerformingAgencies
              agencies={topAgencies}
              selectedAgencyName={sidebarData?.agencyName}
              onSelectAgency={handleSelectAgencyForSidebar}
              onViewAll={() => navigate('/admin/agencies')}
            />
          </div>

          {/* Monthly Financial Summary */}
          <div className="h-full min-w-0">
            <FinancialSummary summary={financialSummary} />
          </div>

          {/* Refund Analytics */}
          <div className="h-full min-w-0">
            <RefundAnalytics refunds={refundAnalytics} />
          </div>
        </div>

        {/* ── THIRD ANALYTICS ROW ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Agency Settlement Overview (7 cols) */}
          <div className="lg:col-span-7 h-full min-w-0">
            <SettlementTable
              settlements={settlements}
              onViewDetails={(s) => setSelectedSettlementForModal(s)}
              onDownloadStatement={(s) => handleDownloadStatement()}
              onApprove={handleApproveSettlement}
              onReject={handleRejectSettlement}
            />
          </div>

          {/* Financial Timeline (5 cols) */}
          <div className="lg:col-span-5 h-full min-w-0">
            <FinancialTimeline
              events={timelineItems}
              onViewAll={() => showToast('Full financial audit timeline loaded', 'info')}
            />
          </div>
        </div>
      </div>

      {/* ── 4. RIGHT SIDE SLIDE-OVER DRAWER (LIKE AGENCIES PAGE) ── */}
      <AgencyFinanceSidebar
        agency={sidebarData}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onDownloadReport={handleExportReport}
        onExportStatement={handleDownloadStatement}
        onViewAgencyProfile={() => navigate('/admin/agencies')}
      />

      {/* ── 5. SETTLEMENT MODAL ── */}
      <SettlementDetailModal
        settlement={selectedSettlementForModal}
        isOpen={!!selectedSettlementForModal}
        onClose={() => setSelectedSettlementForModal(null)}
        onApprove={handleApproveSettlement}
        onReject={handleRejectSettlement}
        onDownload={handleDownloadStatement}
      />
    </motion.div>
  );
};

export default AdminFinancePage;
