import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Clock,
  Building2,
  Star,
  Eye,
  Bookmark,
  TrendingUp,
  AlertCircle,
  Edit,
  CheckCircle2,
  EyeOff,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  ShieldCheck,
  Calendar,
  CreditCard,
  History,
  Check,
  Percent,
} from 'lucide-react';
import { AdminPackageItem } from '../../../types/packageManagement';

interface PackageDetailsDrawerProps {
  pkg: AdminPackageItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (pkg: AdminPackageItem) => void;
  onApprove: (pkg: AdminPackageItem) => void;
  onFeature: (pkg: AdminPackageItem) => void;
  onHide: (pkg: AdminPackageItem) => void;
  onDelete: (pkg: AdminPackageItem) => void;
}

export const PackageDetailsDrawer: React.FC<PackageDetailsDrawerProps> = ({
  pkg,
  isOpen,
  onClose,
  onEdit,
  onApprove,
  onFeature,
  onHide,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Itinerary' | 'Pricing' | 'Bookings' | 'Activity'>('Overview');
  const [isExpandedDesc, setIsExpandedDesc] = useState(false);

  if (!isOpen || !pkg) return null;

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
            {/* ── 1. DRAWER COVER IMAGE & HEADER ── */}
            <div className="relative h-48 w-full shrink-0">
              <img
                src={pkg.coverImage}
                alt={pkg.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30" />

              {/* Top floating controls */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-sm ${
                      pkg.status === 'Active'
                        ? 'bg-emerald-500 text-white'
                        : pkg.status === 'Sold Out'
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    {pkg.status}
                  </span>

                  {pkg.isFeatured && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#6356E5] text-white shadow-sm flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Title & Badges on Cover */}
              <div className="absolute bottom-3.5 left-4 right-4 z-10">
                <h2 className="text-lg font-black text-white tracking-tight drop-shadow-md truncate">
                  {pkg.title}
                </h2>
                <div className="flex items-center justify-between text-xs text-white/90 font-bold mt-1">
                  <span className="font-mono text-[11px] text-white/80">{pkg.packageId}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white backdrop-blur-xs shadow-xs">
                    {pkg.approvalStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Agency + Location Bar */}
            <div className="p-3.5 border-b border-slate-100 bg-white flex items-center justify-between text-xs text-slate-600 shadow-2xs">
              <div className="flex items-center gap-2">
                <img
                  src={pkg.agencyLogo}
                  alt={pkg.agencyName}
                  className="w-6 h-6 rounded-full object-cover border border-slate-200"
                />
                <span className="font-extrabold text-[#0F172A] truncate max-w-[140px]">{pkg.agencyName}</span>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                <span className="flex items-center gap-1 truncate max-w-[130px]">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{pkg.destinationCountry}, {pkg.destinationRegion}</span>
                </span>
                <span className="flex items-center gap-1 shrink-0 font-bold text-slate-700">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{pkg.durationText}</span>
                </span>
              </div>
            </div>

            {/* ── 2. DRAWER TABS ── */}
            <div className="flex items-center border-b border-slate-200/80 bg-white px-5 shrink-0 overflow-x-auto scrollbar-none">
              {(['Overview', 'Itinerary', 'Pricing', 'Bookings', 'Activity'] as const).map((tab) => (
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

            {/* ── 3. DRAWER CONTENT AREA (SCROLLABLE) ── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'Overview' && (
                <>
                  {/* Package Summary Box */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                        Package Summary
                      </h4>
                      {pkg.isFeatured && (
                        <span className="text-[10px] font-extrabold text-[#6356E5] flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-[#6356E5]" />
                          <span>Featured Package</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">Price</span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-base font-black text-[#0F172A]">{pkg.currentPrice}</span>
                          <span className="text-[10px] font-bold text-slate-400 line-through">{pkg.originalPrice}</span>
                        </div>
                        {pkg.discountPercent && (
                          <span className="inline-block mt-0.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                            {pkg.discountPercent}
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">Seats</span>
                        <div className="text-base font-black text-[#0F172A] mt-0.5">
                          {pkg.availableSeats} / {pkg.totalSeats}
                        </div>
                        <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-600">
                          ▲ Available
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-100 text-center text-xs">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400">Bookings</p>
                        <p className="text-sm font-black text-[#0F172A] mt-0.5">{pkg.bookingsCount}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400">Revenue</p>
                        <p className="text-sm font-black text-[#0F172A] mt-0.5">{pkg.totalRevenue}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400">Rating</p>
                        <p className="text-sm font-black text-[#0F172A] mt-0.5 flex items-center justify-center gap-0.5">
                          <span>{pkg.rating}</span>
                          <span className="text-amber-500">★</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats (4 Cards) */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-2.5">
                    <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                      Engagement & Conversion
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-blue-50/60 rounded-xl p-2 border border-blue-100 text-center">
                        <Eye className="w-3.5 h-3.5 text-blue-600 mx-auto" />
                        <p className="text-[9px] font-bold text-slate-400 mt-1">Views</p>
                        <p className="text-xs font-black text-[#0F172A]">{pkg.viewsCount}</p>
                      </div>

                      <div className="bg-pink-50/60 rounded-xl p-2 border border-pink-100 text-center">
                        <Bookmark className="w-3.5 h-3.5 text-pink-600 mx-auto" />
                        <p className="text-[9px] font-bold text-slate-400 mt-1">Wishlist</p>
                        <p className="text-xs font-black text-[#0F172A]">{pkg.wishlistCount}</p>
                      </div>

                      <div className="bg-emerald-50/60 rounded-xl p-2 border border-emerald-100 text-center">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600 mx-auto" />
                        <p className="text-[9px] font-bold text-slate-400 mt-1">Conversion</p>
                        <p className="text-xs font-black text-[#0F172A]">{pkg.conversionRate}</p>
                      </div>

                      <div className="bg-rose-50/60 rounded-xl p-2 border border-rose-100 text-center">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 mx-auto" />
                        <p className="text-[9px] font-bold text-slate-400 mt-1">Cancel Rate</p>
                        <p className="text-xs font-black text-[#0F172A]">{pkg.cancellationRate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Package Description */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-1.5">
                    <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                      Package Description
                    </h4>
                    <p className={`text-xs font-semibold text-slate-600 leading-relaxed ${!isExpandedDesc ? 'line-clamp-3' : ''}`}>
                      {pkg.description}
                    </p>
                    <button
                      onClick={() => setIsExpandedDesc(!isExpandedDesc)}
                      className="text-xs font-extrabold text-[#6356E5] hover:underline cursor-pointer"
                    >
                      {isExpandedDesc ? 'Show less' : 'Read more'}
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-2.5">
                    <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                      Admin Actions
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onEdit(pkg)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Package</span>
                      </button>

                      <button
                        onClick={() => onApprove(pkg)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-700 text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Package</span>
                      </button>

                      <button
                        onClick={() => onFeature(pkg)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>Feature Package</span>
                      </button>

                      <button
                        onClick={() => onHide(pkg)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-700 text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide Package</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onDelete(pkg)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Package</span>
                      </button>

                      <button
                        onClick={() => onEdit(pkg)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
                        <span>More Actions</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: ITINERARY */}
              {activeTab === 'Itinerary' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-[#0F172A]">Day-by-Day Itinerary</h4>
                  {pkg.itinerary.length === 0 ? (
                    <div className="bg-white rounded-2xl p-6 text-center text-xs font-bold text-slate-400 border border-slate-100">
                      Standard {pkg.durationDays} days itinerary configured by {pkg.agencyName}.
                    </div>
                  ) : (
                    pkg.itinerary.map((day) => (
                      <div
                        key={day.day}
                        className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-[#6356E5] text-white text-[10px] font-black">
                            Day {day.day}
                          </span>
                          {day.stay && (
                            <span className="text-[10px] font-bold text-slate-500">🏨 {day.stay}</span>
                          )}
                        </div>
                        <h5 className="text-xs font-black text-[#0F172A]">{day.title}</h5>
                        <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                          {day.description}
                        </p>
                        {day.meals && (
                          <p className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                            🍽️ {day.meals}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: PRICING & INCLUSIONS */}
              {activeTab === 'Pricing' && (
                <div className="space-y-4">
                  {/* Inclusions */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-2">
                    <h4 className="text-xs font-black text-[#0F172A]">Inclusions</h4>
                    <div className="space-y-2">
                      {pkg.inclusions.map((inc, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exclusions */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-2">
                    <h4 className="text-xs font-black text-[#0F172A]">Exclusions</h4>
                    <div className="space-y-2">
                      {pkg.exclusions.map((exc, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-500">
                          <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span>{exc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: BOOKINGS */}
              {activeTab === 'Bookings' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-[#0F172A]">
                    Recent Bookings ({pkg.recentBookings.length})
                  </h4>
                  {pkg.recentBookings.length === 0 ? (
                    <div className="bg-white rounded-2xl p-6 text-center text-xs font-bold text-slate-400 border border-slate-100">
                      No traveler bookings recorded yet for this package.
                    </div>
                  ) : (
                    pkg.recentBookings.map((b) => (
                      <div
                        key={b.id}
                        className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={b.travelerAvatar}
                              alt={b.travelerName}
                              className="w-7 h-7 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <p className="text-xs font-black text-[#0F172A]">{b.travelerName}</p>
                              <p className="text-[10px] font-semibold text-slate-400">{b.bookingId}</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200">
                            {b.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                          <span className="font-extrabold text-[#0F172A]">{b.amount} ({b.seatsBooked} seats)</span>
                          <span className="text-[10px] font-semibold text-slate-400">{b.bookingDate}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 5: ACTIVITY */}
              {activeTab === 'Activity' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black text-[#0F172A]">Activity Log</h4>
                  <div className="relative pl-4 space-y-4 border-l-2 border-slate-100">
                    {pkg.activities.map((a) => (
                      <div key={a.id} className="relative space-y-0.5">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#6356E5] ring-4 ring-white" />
                        <p className="text-xs font-black text-[#0F172A]">{a.action}</p>
                        <p className="text-[11px] font-semibold text-slate-500">{a.details}</p>
                        <p className="text-[10px] font-semibold text-slate-400">{a.timestamp} • by {a.adminName}</p>
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
