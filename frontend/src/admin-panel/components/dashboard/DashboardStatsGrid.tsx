import React from 'react';
import { DashboardStats } from '../../types/dashboard';
import { StatCard } from './StatCard';

interface DashboardStatsGridProps {
  stats: DashboardStats;
}

export const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({ stats }) => {
  const statList = [
    stats.platformRevenue,
    stats.gmv,
    stats.activeAgencies,
    stats.totalUsers,
    stats.todaysBookings,
    stats.runningTrips,
    stats.pendingApprovals,
    stats.openSupportTickets,
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {statList.map((stat, idx) => (
        <StatCard key={stat.id} stat={stat} delay={idx * 0.04} />
      ))}
    </div>
  );
};
