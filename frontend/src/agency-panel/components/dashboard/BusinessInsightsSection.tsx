import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, ArrowRight } from 'lucide-react';
import { RevenueChartCard } from './RevenueChartCard';
import { BookingOverviewCard } from './BookingOverviewCard';
import { OccupancyCard } from './OccupancyCard';
import { TopPackageCard } from './TopPackageCard';
import { UpcomingTripsCard } from './UpcomingTripsCard';
import { QuickInsightsCard } from './QuickInsightsCard';
import {
  RevenueData,
  BookingOverviewData,
  OccupancyData,
  TopPackageData,
  UpcomingTripSummaryItem,
  QuickInsightItem,
} from '../../data/dashboardInsights';

interface BusinessInsightsSectionProps {
  revenue: RevenueData;
  bookingOverview: BookingOverviewData;
  occupancy: OccupancyData;
  topPackage: TopPackageData;
  upcomingTrips: UpcomingTripSummaryItem[];
  quickInsights: QuickInsightItem[];
  selectedRange: string;
  onRangeChange: (range: any) => void;
  onViewFullAnalytics?: () => void;
}

export const BusinessInsightsSection: React.FC<BusinessInsightsSectionProps> = ({
  revenue,
  bookingOverview,
  occupancy,
  topPackage,
  upcomingTrips,
  quickInsights,
  selectedRange,
  onRangeChange,
  onViewFullAnalytics,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 }}
      className="space-y-4 select-none"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-100 text-[#583BE8] flex items-center justify-center">
            <LineChart className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
            Business Insights
          </h2>
        </div>

        {/* View Full Analytics CTA Button */}
        <button
          type="button"
          onClick={() => {
            if (onViewFullAnalytics) onViewFullAnalytics();
            else alert('Full Analytics page — coming soon in future release!');
          }}
          className="text-xs font-black text-[#583BE8] hover:text-[#472dbf] flex items-center gap-1 transition-colors cursor-pointer group"
        >
          <span>View Full Analytics</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Top Row: Revenue Chart Card & Bookings Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RevenueChartCard
          data={revenue}
          selectedRange={selectedRange}
          onRangeChange={onRangeChange}
        />
        <BookingOverviewCard
          data={bookingOverview}
          selectedRange={selectedRange}
          onRangeChange={onRangeChange}
        />
      </div>

      {/* Bottom Row: Occupancy, Top Package, Upcoming Trips & Quick Insights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <OccupancyCard data={occupancy} />
        <TopPackageCard data={topPackage} />
        <UpcomingTripsCard items={upcomingTrips} />
        <QuickInsightsCard items={quickInsights} />
      </div>
    </motion.section>
  );
};

export default BusinessInsightsSection;
