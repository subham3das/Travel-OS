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
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.25 }}
        className="w-full xl:w-[410px] shrink-0 bg-white rounded-3xl border border-slate-100/90 shadow-sm flex flex-col h-auto max-h-[calc(100vh-140px)] overflow-hidden sticky top-24 select-none"
      >
        {/* ── 1. DRAWER COVER IMAGE & HEADER ── */}
        <div className="relative h-48 w-full shrink-0">
          <img
            src={pkg.coverImage}
            alt={pkg.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

          {/* Top floating controls */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
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

            <div className="flex items-center gap-1">
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Title & Badges on Cover */}
          <div className="absolute bottom-3 left-4 right-4 z-10">
            <h2 className="text-lg font-black text-white tracking-tight drop-shadow-md truncate">
              {pkg.title}
            </h2>
            <div className="flex items-center justify-between text-xs text-white/90 font-bold mt-0.5">
              <span className="font-mono text-[11px] text-white/80">{pkg.packageId}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/90 text-white backdrop-blur-xs">
                {pkg.approvalStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Agency + Location Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <img
              src={pkg.agencyLogo}
              alt={pkg.agencyName}
              className="w-5 h-5 rounded-full object-cover border border-slate-200"
            />
            <span className="font-extrabold text-[#0F172A] truncate max-w-[120px]">{pkg.agencyName}</span>
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
        <div className="flex items-center border-b border-slate-100 px-4 bg-white shrink-0 overflow-x-auto scrollbar-none">
          {(['Overview', 'Itinerary', 'Pricing', 'Bookings', 'Activity'] as const).map((tab) => (
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <>
              {/* Package Summary Box */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-3">
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

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-center text-xs">
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
              <div className="space-y-2">
                <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                  Quick Stats
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-blue-50/60 rounded-2xl p-2.5 border border-blue-100 text-center">
                    <Eye className="w-3.5 h-3.5 text-blue-600 mx-auto" />
                    <p className="text-[9px] font-bold text-slate-400 mt-1">Views</p>
                    <p className="text-xs font-black text-[#0F172A]">{pkg.viewsCount}</p>
                  </div>

                  <div className="bg-pink-50/60 rounded-2xl p-2.5 border border-pink-100 text-center">
                    <Bookmark className="w-3.5 h-3.5 text-pink-600 mx-auto" />
                    <p className="text-[9px] font-bold text-slate-400 mt-1">Wishlist</p>
                    <p className="text-xs font-black text-[#0F172A]">{pkg.wishlistCount}</p>
                  </div>

                  <div className="bg-emerald-50/60 rounded-2xl p-2.5 border border-emerald-100 text-center">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600 mx-auto" />
                    <p className="text-[9px] font-bold text-slate-400 mt-1">Conversion</p>
                    <p className="text-xs font-black text-[#0F172A]">{pkg.conversionRate}</p>
                  </div>

                  <div className="bg-rose-50/60 rounded-2xl p-2.5 border border-rose-100 text-center">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 mx-auto" />
                    <p className="text-[9px] font-bold text-slate-400 mt-1">Cancellation</p>
                    <p className="text-xs font-black text-[#0F172A]">{pkg.cancellationRate}</p>
                  </div>
                </div>
              </div>

              {/* Package Description */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                  Package Description
                </h4>
                <p className="text-xs font-semibold text-slate-600 leading-relaxed">
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
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onEdit(pkg)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Package</span>
                  </button>

                  <button
                    onClick={() => onApprove(pkg)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-700 text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Package</span>
                  </button>

                  <button
                    onClick={() => onFeature(pkg)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Feature Package</span>
                  </button>

                  <button
                    onClick={() => onHide(pkg)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-700 text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Package</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onDelete(pkg)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Package</span>
                  </button>

                  <button
                    onClick={() => onEdit(pkg)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer"
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
                <div className="bg-slate-50 rounded-2xl p-6 text-center text-xs font-bold text-slate-400">
                  Standard {pkg.durationDays} days itinerary configured by {pkg.agencyName}.
                </div>
              ) : (
                pkg.itinerary.map((day) => (
                  <div
                    key={day.day}
                    className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-1.5"
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
              <div className="space-y-2">
                <h4 className="text-xs font-black text-[#0F172A]">Inclusions</h4>
                <div className="space-y-1.5">
                  {pkg.inclusions.map((inc, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exclusions */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-black text-[#0F172A]">Exclusions</h4>
                <div className="space-y-1.5">
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
                <div className="bg-slate-50 rounded-2xl p-6 text-center text-xs font-bold text-slate-400">
                  No traveler bookings recorded yet for this package.
                </div>
              ) : (
                pkg.recentBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 space-y-2"
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
                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/60">
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
            <div className="space-y-3">
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
      </motion.aside>
    </AnimatePresence>
  );
};
