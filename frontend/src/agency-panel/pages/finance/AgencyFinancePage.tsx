import React, { useState } from 'react';
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
import { MOCK_FINANCE_DATA, TransactionItem } from '../../data/finance';

/**
 * Full Finance Page for Agency Panel
 * Route: /agency/finance
 * Accessed via: Analytics Page -> Financial Overview -> View Full Finance
 */
export const AgencyFinancePage: React.FC = () => {
  const [dateRange, setDateRange] = useState('01 May - 31 May 2025');
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);

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
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* 1. Financial Summary Grid (6 Cards) */}
            <FinanceSummaryGrid summary={MOCK_FINANCE_DATA.summary} />

            {/* 2. Revenue Trend Chart */}
            <RevenueChartCard trendData={MOCK_FINANCE_DATA.revenueTrend30D} />

            {/* 3. Payment Breakdown & Recent Transactions (2 Columns on Desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PaymentBreakdownCard breakdown={MOCK_FINANCE_DATA.paymentBreakdown} />
              <RecentTransactionsCard
                transactions={MOCK_FINANCE_DATA.recentTransactions}
                onSelectTransaction={setSelectedTx}
              />
            </div>

            {/* 4. Payouts & Refunds (2 Columns on Desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PayoutsCard settlement={MOCK_FINANCE_DATA.settlement} />
              <RefundsCard refundSummary={MOCK_FINANCE_DATA.refundSummary} />
            </div>

            {/* 5. Tax Information & Export Reports (2 Columns on Desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TaxInfoCard taxInfo={MOCK_FINANCE_DATA.taxInfo} />
              <ExportReportsCard />
            </div>
          </motion.div>
        </main>
      </div>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
};

export default AgencyFinancePage;
