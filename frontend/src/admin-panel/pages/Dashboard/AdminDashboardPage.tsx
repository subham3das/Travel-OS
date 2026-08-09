import React from 'react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DashboardStatCard } from '../../components/dashboard/DashboardStatCard';
import { ApplicationsChart } from '../../components/dashboard/ApplicationsChart';
import { StatusDistributionChart } from '../../components/dashboard/StatusDistributionChart';
import { QuickActionsCard } from '../../components/dashboard/QuickActionsCard';
import { RecentApplicationsTable } from '../../components/dashboard/RecentApplicationsTable';
import { ActivityTimeline } from '../../components/dashboard/ActivityTimeline';
import { MOCK_KPI_STATS } from '../../data/dashboard';

/**
 * Phase 1 Super Admin Dashboard Component
 * Route: /admin/dashboard
 */
export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans select-none">
      {/* Dashboard Top Header */}
      <DashboardHeader />

      {/* Main Dashboard Content */}
      <main className="p-6 space-y-6 flex-1 max-w-[1600px] w-full mx-auto pb-16">
        {/* ── ROW 1: 4 KPI STAT CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_KPI_STATS.map((stat, idx) => (
            <DashboardStatCard key={stat.id} stat={stat} delay={idx * 0.05} />
          ))}
        </div>

        {/* ── ROW 2: OVERVIEW CHART, DONUT CHART & QUICK ACTIONS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Applications Overview Line Chart (7 cols) */}
          <div className="lg:col-span-6">
            <ApplicationsChart />
          </div>

          {/* Status Donut Chart (3 cols) */}
          <div className="lg:col-span-3">
            <StatusDistributionChart />
          </div>

          {/* Quick Actions (3 cols) */}
          <div className="lg:col-span-3">
            <QuickActionsCard />
          </div>
        </div>

        {/* ── ROW 3: RECENT APPLICATIONS TABLE & ACTIVITY TIMELINE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Applications Table (8 cols) */}
          <div className="lg:col-span-8">
            <RecentApplicationsTable />
          </div>

          {/* Activity Timeline (4 cols) */}
          <div className="lg:col-span-4">
            <ActivityTimeline />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
