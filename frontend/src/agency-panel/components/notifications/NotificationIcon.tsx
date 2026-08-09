import React from 'react';
import {
  ShoppingBag,
  CheckSquare,
  Flag,
  Megaphone,
  FileText,
  Star,
  Wallet,
  Shield,
  Users,
  Bell,
} from 'lucide-react';
import { NotificationCategory } from '../../data/notifications';

interface NotificationIconProps {
  category: NotificationCategory;
  className?: string;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({ category, className = '' }) => {
  switch (category) {
    case 'Bookings':
      return (
        <div className={`w-10 h-10 rounded-2xl bg-purple-100 text-[#583BE8] flex items-center justify-center shrink-0 ${className}`}>
          <ShoppingBag className="w-5 h-5" />
        </div>
      );

    case 'Payments':
      return (
        <div className={`w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 ${className}`}>
          <CheckSquare className="w-5 h-5" />
        </div>
      );

    case 'Trips':
      return (
        <div className={`w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 ${className}`}>
          <Flag className="w-5 h-5" />
        </div>
      );

    case 'Announcements':
      return (
        <div className={`w-10 h-10 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0 ${className}`}>
          <Megaphone className="w-5 h-5" />
        </div>
      );

    case 'Traveler':
      return (
        <div className={`w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 ${className}`}>
          <FileText className="w-5 h-5" />
        </div>
      );

    case 'Reviews':
      return (
        <div className={`w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 ${className}`}>
          <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
        </div>
      );

    case 'Refunds':
      return (
        <div className={`w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 ${className}`}>
          <Wallet className="w-5 h-5" />
        </div>
      );

    case 'Admin':
      return (
        <div className={`w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 ${className}`}>
          <Shield className="w-5 h-5" />
        </div>
      );

    case 'Team':
      return (
        <div className={`w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 ${className}`}>
          <Users className="w-5 h-5" />
        </div>
      );

    case 'System':
    default:
      return (
        <div className={`w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 ${className}`}>
          <Bell className="w-5 h-5" />
        </div>
      );
  }
};

export default NotificationIcon;
