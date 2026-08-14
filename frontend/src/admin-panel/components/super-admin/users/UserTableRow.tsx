import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MoreVertical,
  CheckCircle2,
  Eye,
  Edit,
  ShieldCheck,
  PauseCircle,
  PlayCircle,
  KeyRound,
  Bell,
  Compass,
  CalendarCheck,
  Trash2,
} from 'lucide-react';
import { TravelerUser } from '../../../types/userManagement';

interface UserTableRowProps {
  user: TravelerUser;
  isSelected: boolean;
  isDrawerSelected: boolean;
  onToggleSelect: (id: string) => void;
  onSelectUser: (user: TravelerUser) => void;
  onRowAction: (actionType: string, user: TravelerUser) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isSelected,
  isDrawerSelected,
  onToggleSelect,
  onSelectUser,
  onRowAction,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getMembershipStyle = () => {
    switch (user.membership) {
      case 'Gold':
        return 'bg-amber-50 text-amber-700 border-amber-200/80 font-black';
      case 'Silver':
        return 'bg-slate-100 text-slate-700 border-slate-200/80 font-bold';
      case 'Platinum':
        return 'bg-purple-50 text-[#6356E5] border-purple-200/80 font-black';
      case 'Free':
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200/60 font-semibold';
    }
  };

  const getVerificationStyle = () => {
    switch (user.verificationStatus) {
      case 'Verified':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100 font-extrabold';
      case 'Pending':
      default:
        return 'bg-amber-50 text-amber-600 border-amber-100 font-extrabold';
    }
  };

  const getStatusStyle = () => {
    switch (user.status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100 font-extrabold';
      case 'Inactive':
        return 'bg-slate-100 text-slate-600 border-slate-200 font-bold';
      case 'Suspended':
        return 'bg-rose-50 text-rose-600 border-rose-100 font-extrabold';
      case 'Blocked':
      default:
        return 'bg-rose-100 text-rose-700 border-rose-200 font-black';
    }
  };

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.25 }}
      onClick={() => onSelectUser(user)}
      className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors text-xs font-semibold text-[#0F172A] cursor-pointer group select-none ${
        isDrawerSelected ? 'bg-[#EEF2FF]/60 hover:bg-[#EEF2FF]/80' : isSelected ? 'bg-[#EEF2FF]/40' : ''
      }`}
    >
      {/* Checkbox */}
      <td
        className="py-3 pl-4 pr-2 w-10"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect(user.id);
        }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(user.id)}
          className="w-4 h-4 rounded text-[#6356E5] focus:ring-0 cursor-pointer"
        />
      </td>

      {/* User (Avatar + Name + Verified Check) */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-2.5 min-w-[170px]">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
            />
            {user.verificationStatus === 'Verified' && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-white" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1 font-extrabold text-[#0F172A] group-hover:text-[#6356E5] transition-colors">
              <span>{user.name}</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">{user.gender}</span>
          </div>
        </div>
      </td>

      {/* User ID */}
      <td className="py-3 px-3 font-mono text-[11px] font-bold text-slate-600">
        {user.userId}
      </td>

      {/* Email */}
      <td className="py-3 px-3 text-slate-600 max-w-[150px] truncate" title={user.email}>
        {user.email}
      </td>

      {/* Phone */}
      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
        {user.phone}
      </td>

      {/* Location */}
      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
        {user.city}, {user.country}
      </td>

      {/* Trips */}
      <td className="py-3 px-3 font-bold text-[#0F172A] text-center">
        {user.tripsCompleted}
      </td>

      {/* Bookings */}
      <td className="py-3 px-3 font-bold text-[#0F172A] text-center">
        {user.totalBookings}
      </td>

      {/* Total Spend */}
      <td className="py-3 px-3 font-extrabold text-[#0F172A] whitespace-nowrap">
        {user.totalSpend}
      </td>

      {/* Membership Badge */}
      <td className="py-3 px-3">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border shadow-2xs ${getMembershipStyle()}`}
        >
          {user.membership}
        </span>
      </td>

      {/* Verification Badge */}
      <td className="py-3 px-3">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border shadow-2xs ${getVerificationStyle()}`}
        >
          {user.verificationStatus}
        </span>
      </td>

      {/* Status Badge */}
      <td className="py-3 px-3">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border shadow-2xs ${getStatusStyle()}`}
        >
          {user.status}
        </span>
      </td>

      {/* Join Date */}
      <td className="py-3 px-3 text-slate-500 whitespace-nowrap text-[11px]">
        {user.joinDate}
      </td>

      {/* Actions */}
      <td
        className="py-3 pr-4 pl-2 text-right relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative inline-block text-left" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-7 h-7 rounded-xl hover:bg-slate-200/70 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-40 text-left select-none">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('view', user);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>View Profile</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('edit', user);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 text-slate-400" />
                <span>Edit User</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('verify', user);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-emerald-50 text-emerald-600 text-xs font-bold transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verify User</span>
              </button>

              {user.status === 'Active' ? (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRowAction('suspend', user);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-amber-50 text-amber-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  <PauseCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Suspend User</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRowAction('activate', user);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-emerald-50 text-emerald-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Activate User</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('reset_password', user);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Password</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('send_notification', user);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-slate-400" />
                <span>Send Notification</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('view_trips', user);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                <span>View Trips</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('view_bookings', user);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>View Bookings</span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('delete', user);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Delete User</span>
              </button>
            </div>
          )}
        </div>
      </td>
    </motion.tr>
  );
};
