import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { FinanceHeader } from '../../components/finance/FinanceHeader';
import { FinanceSummaryGrid } from '../../components/finance/FinanceSummaryGrid';
import { RevenueChartCard } from '../../components/finance/RevenueChartCard';
import { PaymentBreakdownCard } from '../../components/finance/PaymentBreakdownCard';
import { RecentTransactionsCard } from '../../components/finance/RecentTransactionsCard';
import { PayoutsCard } from '../../components/finance/PayoutsCard';
import { RefundsCard } from '../../components/finance/RefundsCard';
import { TaxInfoCard } from '../../components/finance/TaxInfoCard';
import { ExportReportsCard } from '../../components/finance/ExportReportsCard';
import { TransactionDetailsModal } from '../../components/finance/TransactionDetailsModal';
import { MarketplaceSettlementsView } from '../../components/finance/MarketplaceSettlementsView';
import { PaymentSetupReminderModal } from '../../components/payment/PaymentSetupReminderModal';
import { TransactionItem, CompleteFinanceData } from '../../data/finance';
import { agencyFinanceService } from '../../services/agencyFinance.service';

const ZERO_FINANCE_DATA: CompleteFinanceData = {
  summary: [
    { id: 'revenue', title: 'Total Revenue', amount: 0, formattedAmount: '₹0', growth: '0%', isPositive: true, type: 'revenue' },
    { id: 'balance', title: 'Available Balance', amount: 0, formattedAmount: '₹0', growth: '0%', isPositive: true, type: 'balance' },
    { id: 'settlement', title: 'Pending Settlement', amount: 0, formattedAmount: '₹0', growth: '0%', isPositive: true, type: 'settlement' },
    { id: 'refunds', title: 'Total Refunds', amount: 0, formattedAmount: '₹0', growth: '0%', isPositive: false, type: 'refunds' },
    { id: 'commission', title: 'Platform Fee (10%)', amount: 0, formattedAmount: '₹0', growth: '0%', isPositive: false, type: 'commission' },
    { id: 'earnings', title: 'Net Earnings', amount: 0, formattedAmount: '₹0', growth: '0%', isPositive: true, type: 'earnings' },
  ],
  revenueTrend30D: [],
  paymentBreakdown: [],
  recentTransactions: [],
  settlement: {
    lastSettlement: { amount: 0, formattedAmount: '₹0', date: 'N/A', status: 'Completed' },
    nextSettlement: { amount: 0, formattedAmount: '₹0', date: 'N/A', status: 'Upcoming' },
    settlementFrequency: 'Weekly',
    bankAccountLast4: '0000',
    bankName: 'N/A',
  },
  refundSummary: {
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
    totalCount: 0,
    recentRequest: {
      id: '',
      bookingId: '',
      packageName: '',
      travelerName: '',
      refundAmount: 0,
      formattedAmount: '₹0',
      reason: '',
      status: 'Pending',
      requestDate: '',
    },
  },
  taxInfo: {
    gstCollected: 0,
    formattedGstCollected: '₹0',
    platformFees: 0,
    formattedPlatformFees: '₹0',
    netTaxableRevenue: 0,
    formattedNetTaxableRevenue: '₹0',
    gstPercentage: 18,
  },
};

/**
 * Full Finance Page for Agency Panel
 * Route: /agency/finance
 * Accessed via: Analytics Page -> Financial Overview -> View Full Finance
 */
export const AgencyFinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'settlements' | 'overview'>('settlements');
  const [dateRange, setDateRange] = useState('01 May - 31 May 2025');
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);
  const [financeData, setFinanceData] = useState<CompleteFinanceData>(ZERO_FINANCE_DATA);
  const [isLoading, setIsLoading] = useState(true);

  const loadFinance = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await agencyFinanceService.getFinanceOverview();
      setFinanceData(data);
    } catch (err) {
      console.error('Failed to load agency finance overview:', err);
      setFinanceData(ZERO_FINANCE_DATA);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFinance();
  }, [loadFinance]);

  const handleOpenFilter = () => {
    alert('Filter panel: Filter by Package, Payment Status, Payment Method, Settlement Status.');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-12 md:pb-16">
        <DashboardHeader />

        {/* Finance Sticky Header Bar */}
        <FinanceHeader
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onOpenFilterModal={handleOpenFilter}
        />

        {/* Main Body Grid */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-5xl mx-auto w-full">
          {/* View Mode Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('settlements')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'settlements'
                  ? 'bg-white text-[#583BE8] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Marketplace Settlements (Razorpay Route)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-[#583BE8] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Revenue & Financial Analytics
            </button>
          </div>

          {activeTab === 'settlements' ? (
            <MarketplaceSettlementsView />
          ) : isLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-24 bg-white rounded-3xl border border-slate-100 p-4" />
                ))}
              </div>
              <div className="h-64 bg-white rounded-3xl border border-slate-100" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* 1. Financial Summary Grid (6 Cards) */}
              <FinanceSummaryGrid summary={financeData.summary} />

              {/* 2. Revenue Trend Chart */}
              <RevenueChartCard trendData={financeData.revenueTrend30D} />

              {/* 3. Payment Breakdown & Recent Transactions (2 Columns on Desktop) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PaymentBreakdownCard breakdown={financeData.paymentBreakdown} />
                <RecentTransactionsCard
                  transactions={financeData.recentTransactions}
                  onSelectTransaction={setSelectedTx}
                />
              </div>

              {/* 4. Payouts & Refunds (2 Columns on Desktop) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PayoutsCard settlement={financeData.settlement} />
                <RefundsCard refundSummary={financeData.refundSummary} />
              </div>

              {/* 5. Tax Information & Export Reports (2 Columns on Desktop) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TaxInfoCard taxInfo={financeData.taxInfo} />
                <ExportReportsCard />
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />

      {/* Login / Payout Account Reminder Modal */}
      <PaymentSetupReminderModal />
    </div>
  );
};

export default AgencyFinancePage;
