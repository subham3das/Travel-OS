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
  ChevronLeft,
  CheckCircle2,
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
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Drawer Sliding Panel from Right Edge */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full sm:w-[480px] md:w-[500px] h-full bg-[#F8F9FC] shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* ── 1. DRAWER HEADER ── */}
            <div className="p-6 bg-white border-b border-slate-100/90 relative shrink-0 shadow-2xs">
              {/* Action Buttons Top Row */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Close Drawer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User Profile Avatar & Header Info */}
              <div className="flex flex-col items-center text-center">
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

                <h2 className="text-lg font-black text-[#0F172A] mt-2.5 tracking-tight">
                  {user.name}
                </h2>

                <p className="text-[11px] font-mono font-bold text-slate-500">{user.userId}</p>

                <div className="flex items-center gap-1.5 text-xs font-black text-amber-600 mt-1">
                  <Crown className="w-3.5 h-3.5" />
                  <span>{user.membership} Member</span>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{user.city}, {user.country}</span>
                </div>

                <p className="text-[10px] font-semibold text-slate-400 mt-1">
                  Joined on {user.joinDate} • {user.joinTime || '10:30 AM'}
                </p>
              </div>
            </div>

            {/* ── 2. DRAWER NAVIGATION TABS ── */}
            <div className="flex items-center border-b border-slate-200/80 bg-white px-5 shrink-0 overflow-x-auto scrollbar-none">
              {(['Overview', 'Bookings', 'Trips', 'Payments', 'Activity'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-3 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-px whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-[#6356E5] text-[#6356E5] font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* ── 3. DRAWER SCROLLABLE CONTENT BODY ── */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'Overview' && (
                <>
                  {/* Two Column Grid: Personal Info & Verification */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-2.5">
                      <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                        Personal Information
                      </h4>
                      <div className="space-y-2 text-xs">
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

                    {/* Verification & Membership */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-2.5">
                      <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                        Verification & Membership
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block">KYC Verification</span>
                          <span className="inline-flex items-center gap-1 font-extrabold text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
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

                  {/* Travel Statistics (6 Cards) */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
                    <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                      Travel Statistics
                    </h4>
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="bg-purple-50/60 rounded-xl p-2.5 border border-purple-100 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-[#6356E5] shrink-0">
                          <Compass className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400">Trips Done</p>
                          <p className="text-xs font-black text-[#0F172A]">{user.tripsCompleted}</p>
                        </div>
                      </div>

                      <div className="bg-emerald-50/60 rounded-xl p-2.5 border border-emerald-100 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                          <CalendarCheck className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400">Bookings</p>
                          <p className="text-xs font-black text-[#0F172A]">{user.totalBookings}</p>
                        </div>
                      </div>

                      <div className="bg-blue-50/60 rounded-xl p-2.5 border border-blue-100 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400">Countries</p>
                          <p className="text-xs font-black text-[#0F172A]">{user.countriesVisited}</p>
                        </div>
                      </div>

                      <div className="bg-pink-50/60 rounded-xl p-2.5 border border-pink-100 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400">Reviews</p>
                          <p className="text-xs font-black text-[#0F172A]">{user.reviewsGiven}</p>
                        </div>
                      </div>

                      <div className="bg-amber-50/60 rounded-xl p-2.5 border border-amber-100 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400">Rating</p>
                          <p className="text-xs font-black text-[#0F172A]">{user.averageRating} ★</p>
                        </div>
                      </div>

                      <div className="bg-rose-50/60 rounded-xl p-2.5 border border-rose-100 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                          <AlertCircle className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400">Cancel Rate</p>
                          <p className="text-xs font-black text-[#0F172A]">{user.cancellationRate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Overview Card */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
                    <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                      Financial Summary
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 rounded-xl p-3 border border-slate-100">
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
                    <p className="text-[10px] font-semibold text-slate-400 text-center">
                      Last Transaction: <span className="font-bold text-slate-700">{user.lastTransactionDate}</span>
                    </p>
                  </div>

                  {/* Profile Action Buttons */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
                    <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                      Quick Admin Actions
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </button>

                      <button
                        onClick={() => onVerify(user)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-700 text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify User</span>
                      </button>

                      {user.status === 'Active' ? (
                        <button
                          onClick={() => onSuspend(user)}
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-700 text-xs font-extrabold transition-colors cursor-pointer"
                        >
                          <PauseCircle className="w-3.5 h-3.5" />
                          <span>Suspend User</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onActivate(user)}
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-700 text-xs font-extrabold transition-colors cursor-pointer"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Activate User</span>
                        </button>
                      )}

                      <button
                        onClick={() => onSendNotification(user)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-700 text-xs font-extrabold transition-colors cursor-pointer"
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
                  <h4 className="text-xs font-black text-[#0F172A]">All Bookings ({user.bookings.length})</h4>
                  {user.bookings.length === 0 ? (
                    <div className="bg-white rounded-2xl p-6 text-center text-xs font-bold text-slate-400 border border-slate-100">
                      No active or past bookings found for this user.
                    </div>
                  ) : (
                    user.bookings.map((b) => (
                      <div
                        key={b.id}
                        className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs space-y-2 hover:border-[#6356E5]/30 transition-all"
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

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
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
                  <h4 className="text-xs font-black text-[#0F172A]">Trips History ({user.trips.length})</h4>
                  {user.trips.length === 0 ? (
                    <div className="bg-white rounded-2xl p-6 text-center text-xs font-bold text-slate-400 border border-slate-100">
                      No trips recorded.
                    </div>
                  ) : (
                    user.trips.map((t) => (
                      <div
                        key={t.id}
                        className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs space-y-2 hover:border-blue-300 transition-all"
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

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
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
                  <h4 className="text-xs font-black text-[#0F172A]">Payment Invoices ({user.payments.length})</h4>
                  {user.payments.length === 0 ? (
                    <div className="bg-white rounded-2xl p-6 text-center text-xs font-bold text-slate-400 border border-slate-100">
                      No invoices recorded.
                    </div>
                  ) : (
                    user.payments.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs space-y-2 hover:border-emerald-300 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-extrabold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-md">
                              {p.invoiceNumber}
                            </span>
                            <h5 className="text-xs font-black text-[#0F172A] mt-1">{p.amount}</h5>
                            <p className="text-[10px] font-semibold text-slate-400">Via {p.paymentMethod}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200">
                            {p.paymentStatus}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
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
                <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black text-[#0F172A]">Recent Activity Log</h4>
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
