import React from 'react';
import { DashboardStats } from '../../types/dashboard';
import { StatCard } from './StatCard';

interface DashboardStatsGridProps {
  stats: DashboardStats;
}

export const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({ stats }) => {
  const statList = [
    stats.platformRevenue,
    stats.todaysBookings,
    stats.upcomingDepartures,
    stats.packagesPublished,
    stats.packagesPendingApproval,
    stats.agencyApprovalRequests,
    stats.carRentalApprovalRequests,
    stats.couponsUsedToday,
    stats.activeAgencies,
    stats.activeCarRentals,
    stats.registeredTravelers,
  ].filter(Boolean);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 w-full">
      {statList.map((stat, idx) => (
        <StatCard key={stat.id || idx} stat={stat} delay={idx * 0.03} />
      ))}
    </div>
  );
};
