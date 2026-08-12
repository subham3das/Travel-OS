import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Filter, ChevronDown } from 'lucide-react';
import { useToast } from '../../../user-panel/context/ToastContext';

// Import Admin Dashboard Components
import { DashboardStatsGrid } from '../../components/dashboard/DashboardStatsGrid';
import { RevenueChartCard } from '../../components/dashboard/RevenueChartCard';
import { BookingTrendCard } from '../../components/dashboard/BookingTrendCard';
import { UserGrowthCard } from '../../components/dashboard/UserGrowthCard';
import { AgencyGrowthCard } from '../../components/dashboard/AgencyGrowthCard';
import { RecentActivityCard } from '../../components/dashboard/RecentActivityCard';
import { TransactionCard } from '../../components/dashboard/TransactionCard';
import { ApprovalCard } from '../../components/dashboard/ApprovalCard';
import { SystemHealthCard } from '../../components/dashboard/SystemHealthCard';
import { QuickActionsCard } from '../../components/dashboard/QuickActionsCard';

// Import Admin Dashboard Service & Mock Data Types
import { adminDashboardService } from '../../services/adminDashboard.service';
import {
  DashboardStats,
  RevenueMetric,
  BookingMetric,
  GrowthMetric,
  Activity,
  Transaction,
  ApprovalRequest,
  SystemHealth,
  QuickAction,
} from '../../types/dashboard';

/**
 * Super Admin Dashboard Page Component
 * Single Source of Truth matching reference image super-dashboard.png
 * Route: /admin
 */
export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);

  // Dashboard Data States
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenue, setRevenue] = useState<RevenueMetric | null>(null);
  const [bookingTrend, setBookingTrend] = useState<BookingMetric | null>(null);
  const [userGrowth, setUserGrowth] = useState<GrowthMetric | null>(null);
  const [agencyGrowth, setAgencyGrowth] = useState<GrowthMetric | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [
          statsData,
          revData,
          bookingData,
          uGrowthData,
          aGrowthData,
          actData,
          txData,
          appData,
          healthData,
          actionsData,
        ] = await Promise.all([
          adminDashboardService.getStats(),
          adminDashboardService.getRevenueOverview(),
          adminDashboardService.getBookingTrend(),
          adminDashboardService.getUserGrowth(),
          adminDashboardService.getAgencyGrowth(),
          adminDashboardService.getRecentActivities(),
          adminDashboardService.getLatestTransactions(),
          adminDashboardService.getPendingApprovals(),
          adminDashboardService.getSystemHealth(),
          adminDashboardService.getQuickActions(),
        ]);

        if (isMounted) {
          setStats(statsData);
          setRevenue(revData);
          setBookingTrend(bookingData);
          setUserGrowth(uGrowthData);
          setAgencyGrowth(aGrowthData);
          setActivities(actData);
          setTransactions(txData);
          setApprovals(appData);
          setSystemHealth(healthData);
          setQuickActions(actionsData);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard data', err);
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleQuickActionClick = (actionKey: string) => {
    switch (actionKey) {
      case 'add_agency':
        navigate('/admin/verification-pending');
        showToast('Navigating to Agency Registration Request queue...', 'info');
        break;
      case 'create_announcement':
        showToast('Announcement composer opened', 'info');
        break;
      case 'generate_report':
        showToast('Generating platform analytics report PDF...', 'success');
        break;
      case 'manage_banners':
        navigate('/admin/cms');
        showToast('Navigating to Homepage Banners CMS...', 'info');
        break;
      case 'view_analytics':
        navigate('/admin/reports');
        showToast('Opening platform analytics panel...', 'info');
        break;
      default:
        break;
    }
  };

  if (loading || !stats || !revenue || !bookingTrend || !userGrowth || !agencyGrowth || !systemHealth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#6356E5]/20 border-t-[#6356E5] animate-spin" />
        <p className="text-xs font-black text-slate-500 tracking-wider uppercase">
          Loading Super Admin Dashboard...
        </p>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12 select-none"
    >
      {/* Page Title & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Overview of your platform performance and key metrics
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>May 21 – Jun 21, 2025</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Custom Filter</span>
          </button>
        </div>
      </div>

      {/* ── ROW 1: 8 KPI SUMMARY CARDS ── */}
      <DashboardStatsGrid stats={stats} />

      {/* ── ROW 2: 4 ANALYTICS CHARTS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RevenueChartCard metric={revenue} />
        <BookingTrendCard metric={bookingTrend} />
        <UserGrowthCard metric={userGrowth} />
        <AgencyGrowthCard metric={agencyGrowth} />
      </div>

      {/* ── ROW 3: 3 ACTIVITY & TRANSACTION CARDS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentActivityCard
          activities={activities}
          onViewAll={() => navigate('/admin/audit-logs')}
        />
        <TransactionCard
          transactions={transactions}
          onViewAll={() => navigate('/admin/payments')}
        />
        <ApprovalCard
          approvals={approvals}
          onViewAll={() => navigate('/admin/verification-pending')}
          onReview={(id) => {
            navigate('/admin/verification-pending');
            showToast(`Opening review details for ${id}`, 'info');
          }}
        />
      </div>

      {/* ── ROW 4: SYSTEM HEALTH & QUICK ACTIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <SystemHealthCard
            health={systemHealth}
            onViewDetails={() => showToast('Opening detailed platform system health diagnostics...', 'info')}
          />
        </div>
        <div className="lg:col-span-8">
          <QuickActionsCard
            actions={quickActions}
            onActionClick={handleQuickActionClick}
          />
        </div>
      </div>
    </motion.main>
  );
};

export default AdminDashboardPage;
