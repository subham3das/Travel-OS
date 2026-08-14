import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Calendar,
  Crown,
  Edit,
  ShieldCheck,
  PauseCircle,
  PlayCircle,
  Bell,
  Compass,
  CalendarCheck,
  CreditCard,
  History,
  ExternalLink,
  Download,
  Star,
  AlertCircle,
  Globe,
  MessageSquare,
  Sparkles,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import { TravelerUser } from '../../../types/userManagement';

interface UserDetailsDrawerProps {
  user: TravelerUser | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: TravelerUser) => void;
  onVerify: (user: TravelerUser) => void;
  onSuspend: (user: TravelerUser) => void;
  onActivate: (user: TravelerUser) => void;
  onSendNotification: (user: TravelerUser) => void;
}

export const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({
  user,
  isOpen,
  onClose,
  onEdit,
  onVerify,
  onSuspend,
  onActivate,
  onSendNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Bookings' | 'Trips' | 'Payments' | 'Activity'>('Overview');

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.25 }}
        className="w-full xl:w-[430px] shrink-0 bg-white rounded-3xl border border-slate-100/90 shadow-sm flex flex-col h-auto max-h-[calc(100vh-140px)] overflow-hidden sticky top-24 select-none"
      >
        {/* ── 1. DRAWER HEADER ── */}
        <div className="p-5 border-b border-slate-100 relative bg-gradient-to-b from-slate-50/50 to-white">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-xl hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-xl hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Info */}
          <div className="flex flex-col items-center text-center mt-1">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
              />
              <span
                className={`absolute bottom-0 right-0 px-2 py-0.5 rounded-full text-[9px] font-black border uppercase shadow-2xs ${
                  user.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : user.status === 'Suspended'
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {user.status}
              </span>
            </div>

            <h2 className="text-lg font-black text-[#0F172A] mt-2.5 tracking-tight flex items-center gap-1.5">
              <span>{user.name}</span>
            </h2>

            <p className="text-[11px] font-mono font-bold text-slate-500">{user.userId}</p>

            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 mt-1">
              <Crown className="w-3.5 h-3.5" />
              <span>{user.membership} Member</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{user.city}, {user.country}</span>
              </span>
            </div>

            <p className="text-[10px] font-semibold text-slate-400 mt-1">
              Joined on {user.joinDate} • {user.joinTime || '10:30 AM'}
            </p>
          </div>
        </div>

        {/* ── 2. DRAWER TABS ── */}
        <div className="flex items-center border-b border-slate-100 px-5 bg-white shrink-0 overflow-x-auto scrollbar-none">
          {(['Overview', 'Bookings', 'Trips', 'Payments', 'Activity'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-2.5 text-xs font-black border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[#6356E5] text-[#6356E5]'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── 3. DRAWER CONTENT AREA (SCROLLABLE) ── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <>
              {/* Personal Information & Verification Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Column 1: Personal Info */}
                <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-100 space-y-2.5">
                  <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                    Personal Information
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Full Name</span>
                      <span className="font-extrabold text-slate-700">{user.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Email</span>
                      <span className="font-bold text-slate-700 break-all">{user.email}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Phone</span>
                      <span className="font-bold text-slate-700">{user.phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Gender</span>
                      <span className="font-bold text-slate-700">{user.gender}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Date of Birth</span>
                      <span className="font-bold text-slate-700">{user.dob}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Nationality</span>
                      <span className="font-bold text-slate-700">{user.nationality}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Passport Status</span>
                      <span className="font-extrabold text-emerald-600">{user.passportStatus}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Emergency Contact</span>
                      <span className="font-bold text-slate-700">{user.emergencyContact}</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Verification & Membership */}
                <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-100 space-y-2.5">
                  <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                    Verification & Membership
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">KYC Verification</span>
                      <span className="inline-flex items-center gap-1 font-extrabold text-emerald-600">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{user.kycVerification}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Email Verification</span>
                      <span className="font-extrabold text-emerald-600">{user.emailVerification}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Phone Verification</span>
                      <span className="font-extrabold text-emerald-600">{user.phoneVerification}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Membership</span>
                      <span className="font-black text-amber-600">{user.membership} Member</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Membership Since</span>
                      <span className="font-bold text-slate-700">{user.membershipSince}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Membership Valid Till</span>
                      <span className="font-bold text-slate-700">{user.membershipValidTill}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Travel Statistics Grid (6 Cards) */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                  Travel Statistics
                </h4>
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-purple-50/60 rounded-2xl p-2.5 border border-purple-100 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-purple-100 flex items-center justify-center text-[#6356E5] shrink-0">
                      <Compass className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400">Trips Completed</p>
                      <p className="text-xs font-black text-[#0F172A]">{user.tripsCompleted}</p>
                    </div>
                  </div>

                  <div className="bg-emerald-50/60 rounded-2xl p-2.5 border border-emerald-100 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <CalendarCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400">Total Bookings</p>
                      <p className="text-xs font-black text-[#0F172A]">{user.totalBookings}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50/60 rounded-2xl p-2.5 border border-blue-100 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400">Countries Visited</p>
                      <p className="text-xs font-black text-[#0F172A]">{user.countriesVisited}</p>
                    </div>
                  </div>

                  <div className="bg-pink-50/60 rounded-2xl p-2.5 border border-pink-100 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400">Reviews Given</p>
                      <p className="text-xs font-black text-[#0F172A]">{user.reviewsGiven}</p>
                    </div>
                  </div>

                  <div className="bg-amber-50/60 rounded-2xl p-2.5 border border-amber-100 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400">Average Rating</p>
                      <p className="text-xs font-black text-[#0F172A]">{user.averageRating} ★</p>
                    </div>
                  </div>

                  <div className="bg-rose-50/60 rounded-2xl p-2.5 border border-rose-100 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                      <AlertCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400">Cancellation</p>
                      <p className="text-xs font-black text-[#0F172A]">{user.cancellationRate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Overview */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                  Financial Overview
                </h4>
                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400">Total Spend</p>
                      <p className="text-sm font-black text-[#0F172A] mt-0.5">{user.totalSpend}</p>
                    </div>
                    <div className="border-x border-slate-200/70">
                      <p className="text-[10px] font-bold text-slate-400">Wallet Balance</p>
                      <p className="text-sm font-black text-emerald-600 mt-0.5">{user.walletBalance}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400">Pending Refunds</p>
                      <p className="text-sm font-black text-amber-600 mt-0.5">{user.pendingRefunds}</p>
                    </div>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-400 text-center mt-2.5 pt-2 border-t border-slate-200/60">
                    Last Transaction: <span className="font-bold text-slate-700">{user.lastTransactionDate}</span>
                  </p>
                </div>
              </div>

              {/* Profile Action Buttons */}
              <div className="space-y-2 pt-1">
                <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                  Profile Actions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => onVerify(user)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-700 text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verify User</span>
                  </button>

                  {user.status === 'Active' ? (
                    <button
                      onClick={() => onSuspend(user)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-700 text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      <PauseCircle className="w-3.5 h-3.5" />
                      <span>Suspend User</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onActivate(user)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-700 text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Activate User</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSendNotification(user)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-700 text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Send Notification</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: BOOKINGS */}
          {activeTab === 'Bookings' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#0F172A]">Booking History ({user.bookings.length})</h4>
              </div>
              {user.bookings.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-6 text-center text-xs font-bold text-slate-400">
                  No active or past bookings found for this user.
                </div>
              ) : (
                user.bookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-2 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-extrabold text-[#6356E5] bg-purple-50 px-1.5 py-0.5 rounded-md">
                          {b.bookingId}
                        </span>
                        <h5 className="text-xs font-extrabold text-[#0F172A] mt-1">{b.packageName}</h5>
                        <p className="text-[10px] font-semibold text-slate-400">Agency: {b.agencyName}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200">
                        {b.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                      <span className="font-extrabold text-[#0F172A]">{b.amount}</span>
                      <span className="text-[10px] font-semibold text-slate-400">{b.travelDate}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: TRIPS */}
          {activeTab === 'Trips' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#0F172A]">Trips Timeline ({user.trips.length})</h4>
              </div>
              {user.trips.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-6 text-center text-xs font-bold text-slate-400">
                  No upcoming or completed trips recorded.
                </div>
              ) : (
                user.trips.map((t) => (
                  <div
                    key={t.id}
                    className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-2 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                          {t.tripId}
                        </span>
                        <h5 className="text-xs font-extrabold text-[#0F172A] mt-1">{t.destination}</h5>
                        <p className="text-[10px] font-semibold text-slate-400">Operated by {t.agencyName}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-200">
                        {t.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                      <span className="font-extrabold text-[#0F172A]">{t.amount} ({t.travelersCount} travelers)</span>
                      <span className="text-[10px] font-semibold text-slate-400">{t.startDate} - {t.endDate}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: PAYMENTS */}
          {activeTab === 'Payments' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#0F172A]">Payment Invoices ({user.payments.length})</h4>
              </div>
              {user.payments.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-6 text-center text-xs font-bold text-slate-400">
                  No payment invoices or receipts recorded.
                </div>
              ) : (
                user.payments.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-2 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-extrabold text-slate-700 bg-slate-200/70 px-1.5 py-0.5 rounded-md">
                          {p.invoiceNumber}
                        </span>
                        <h5 className="text-xs font-black text-[#0F172A] mt-1">{p.amount}</h5>
                        <p className="text-[10px] font-semibold text-slate-400">Via {p.paymentMethod}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200">
                        {p.paymentStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                      <span className="text-[10px] font-semibold text-slate-400">{p.date}</span>
                      <button className="flex items-center gap-1 text-[10px] font-extrabold text-[#6356E5] hover:underline cursor-pointer">
                        <Download className="w-3 h-3" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: ACTIVITY */}
          {activeTab === 'Activity' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#0F172A]">Recent Activity</h4>
              </div>
              <div className="relative pl-4 space-y-4 border-l-2 border-slate-100">
                {user.activities.map((a) => (
                  <div key={a.id} className="relative space-y-0.5">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#6356E5] ring-4 ring-white" />
                    <p className="text-xs font-black text-[#0F172A]">{a.title}</p>
                    <p className="text-[11px] font-semibold text-slate-500">{a.description}</p>
                    <p className="text-[10px] font-semibold text-slate-400">{a.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
