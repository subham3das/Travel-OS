import React from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  MapPin,
  Calendar,
  Users,
  User,
  MessageSquare,
  Star,
  Bell,
  Wallet,
  BarChart2,
  Shield,
  Truck,
  Plus,
  ArrowRight,
} from 'lucide-react';

export type EmptyStateVariant =
  | 'no-packages'
  | 'no-trips'
  | 'no-bookings'
  | 'no-travelers'
  | 'no-customers'
  | 'no-messages'
  | 'no-reviews'
  | 'no-notifications'
  | 'no-finance'
  | 'no-analytics'
  | 'no-team'
  | 'no-vehicles'
  | 'generic';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'generic',
  icon,
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  const getDefaultContent = () => {
    switch (variant) {
      case 'no-packages':
        return {
          icon: <Package className="w-8 h-8 text-[#583BE8]" />,
          title: 'No Tour Packages Found',
          description: 'You have not published any travel packages yet. Create your first itinerary package to start attracting travelers.',
          primaryLabel: 'Create Package',
        };
      case 'no-trips':
        return {
          icon: <MapPin className="w-8 h-8 text-[#583BE8]" />,
          title: 'No Active Trips Found',
          description: 'There are no operational trips scheduled currently. Move eligible booking departures into Trips to start live operations.',
          primaryLabel: 'View Bookings',
        };
      case 'no-bookings':
        return {
          icon: <Calendar className="w-8 h-8 text-purple-600" />,
          title: 'No Bookings Logged',
          description: 'No traveler reservations match your active filter criteria. Check back later or create a manual booking.',
          primaryLabel: 'Refresh Roster',
        };
      case 'no-travelers':
        return {
          icon: <Users className="w-8 h-8 text-sky-600" />,
          title: 'No Travelers Assigned',
          description: 'No individual travelers are assigned to this trip departure roster yet.',
          primaryLabel: 'Add Traveler',
        };
      case 'no-customers':
        return {
          icon: <User className="w-8 h-8 text-blue-600" />,
          title: 'No Customers Found',
          description: 'No customer profiles match your search query or filter chips.',
          primaryLabel: 'Clear Filters',
        };
      case 'no-messages':
        return {
          icon: <MessageSquare className="w-8 h-8 text-[#583BE8]" />,
          title: 'No Message Conversations',
          description: 'You have no active message threads with enrolled travelers.',
          primaryLabel: 'Start Chat',
        };
      case 'no-reviews':
        return {
          icon: <Star className="w-8 h-8 text-amber-500" />,
          title: 'No Customer Reviews',
          description: 'No ratings or reviews have been submitted by travelers yet.',
          primaryLabel: 'Request Reviews',
        };
      case 'no-notifications':
        return {
          icon: <Bell className="w-8 h-8 text-rose-500" />,
          title: 'No Unread Notifications',
          description: 'You are all caught up! There are no new alerts or system updates right now.',
          primaryLabel: 'View All Alerts',
        };
      case 'no-finance':
        return {
          icon: <Wallet className="w-8 h-8 text-emerald-600" />,
          title: 'No Financial Records',
          description: 'No transactions, payouts or settlements match your active period selection.',
          primaryLabel: 'Export Report',
        };
      case 'no-analytics':
        return {
          icon: <BarChart2 className="w-8 h-8 text-indigo-600" />,
          title: 'No Performance Data',
          description: 'Insufficient performance metrics recorded for the selected date range.',
          primaryLabel: 'Reset Date Range',
        };
      case 'no-team':
        return {
          icon: <Shield className="w-8 h-8 text-[#583BE8]" />,
          title: 'No Team Members Assigned',
          description: 'No tour hosts, guides, or drivers assigned to this agency operations team.',
          primaryLabel: 'Add Team Member',
        };
      case 'no-vehicles':
        return {
          icon: <Truck className="w-8 h-8 text-amber-600" />,
          title: 'No Vehicles Registered',
          description: 'No transport vehicles registered in your fleet inventory.',
          primaryLabel: 'Add Vehicle',
        };
      case 'generic':
      default:
        return {
          icon: <Package className="w-8 h-8 text-slate-400" />,
          title: 'No Data Available',
          description: 'There are no records matching your current selection.',
          primaryLabel: 'Refresh',
        };
    }
  };

  const defaults = getDefaultContent();
  const finalIcon = icon || defaults.icon;
  const finalTitle = title || defaults.title;
  const finalDesc = description || defaults.description;
  const finalPrimaryLabel = primaryActionLabel || defaults.primaryLabel;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-3xl p-8 sm:p-12 border border-slate-100/90 text-center space-y-4 shadow-2xs select-none ${className}`}
    >
      <div className="w-16 h-16 rounded-3xl bg-purple-50 flex items-center justify-center mx-auto shadow-xs">
        {finalIcon}
      </div>

      <div className="space-y-1 max-w-md mx-auto">
        <h3 className="text-base sm:text-lg font-black text-[#0F172A]">{finalTitle}</h3>
        <p className="text-xs font-semibold text-slate-400 leading-relaxed">{finalDesc}</p>
      </div>

      {(onPrimaryAction || onSecondaryAction) && (
        <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
          {onPrimaryAction && (
            <button
              type="button"
              onClick={onPrimaryAction}
              className="px-5 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#472bd1] text-white text-xs font-black shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{finalPrimaryLabel}</span>
            </button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-extrabold transition-all cursor-pointer inline-flex items-center gap-1"
            >
              <span>{secondaryActionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
