import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  Plus,
  Search,
  Filter,
  Download,
  Percent,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  Tag,
  Copy,
  Check,
  Edit2,
  Trash2,
  PauseCircle,
  PlayCircle,
  X,
  Loader2,
  TrendingUp,
  Building2,
  Car,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  adminCouponService,
  AdminCouponItem,
  CouponKPIStats,
  CouponAnalyticsData,
} from '../../services/adminCoupon.service';

const ALL_PLATFORMS = [
  { id: 'agency_subscription', label: 'Agency Subscription' },
  { id: 'car_rental_subscription', label: 'Car Rental Subscription' },
  { id: 'travel_package_booking', label: 'Travel Package Booking' },
  { id: 'car_booking', label: 'Car Booking' },
  { id: 'hotels', label: 'Hotels' },
  { id: 'activities', label: 'Activities' },
  { id: 'future_services', label: 'Future Services' },
];

export const AdminCouponsPage: React.FC = () => {
  // Main Data States
  const [coupons, setCoupons] = useState<AdminCouponItem[]>([]);
  const [stats, setStats] = useState<CouponKPIStats | null>(null);
  const [analytics, setAnalytics] = useState<CouponAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });

  // Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Copy Feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<AdminCouponItem | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed',
    percentage: 20,
    fixedAmount: 200,
    minimumAmount: 0,
    maximumDiscount: 500,
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 1000,
    perUserLimit: 1,
    applicablePlatforms: ['agency_subscription', 'car_rental_subscription'],
    eligibility: 'all',
    status: 'active' as 'active' | 'paused' | 'expired' | 'draft',
    rules: {
      firstPurchaseOnly: false,
      canCombine: false,
      singleUse: true,
      recurring: false,
    },
  });

  // Load Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [couponsRes, statsRes, analyticsRes] = await Promise.all([
        adminCouponService.getCoupons({
          search: search.trim() || undefined,
          status: statusFilter,
          type: typeFilter,
          applicablePlatform: platformFilter,
          page: pagination.page,
          limit: pagination.limit,
        }),
        adminCouponService.getStats(),
        adminCouponService.getAnalytics(timeframe),
      ]);

      setCoupons(couponsRes.coupons);
      setPagination(couponsRes.pagination);
      setStats(statsRes);
      setAnalytics(analyticsRes);
    } catch (err) {
      console.warn('Failed to load coupon data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter, typeFilter, platformFilter, pagination.page, timeframe]);

  // Copy code helper
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      description: '',
      type: 'percentage',
      percentage: 20,
      fixedAmount: 200,
      minimumAmount: 0,
      maximumDiscount: 500,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: 1000,
      perUserLimit: 1,
      applicablePlatforms: ['agency_subscription', 'car_rental_subscription'],
      eligibility: 'all',
      status: 'active',
      rules: {
        firstPurchaseOnly: false,
        canCombine: false,
        singleUse: true,
        recurring: false,
      },
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (coupon: AdminCouponItem) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      percentage: coupon.percentage || 0,
      fixedAmount: coupon.fixedAmount || 0,
      minimumAmount: coupon.minimumAmount || 0,
      maximumDiscount: coupon.maximumDiscount || 0,
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
      usageLimit: coupon.usageLimit || 1000,
      perUserLimit: coupon.perUserLimit || 1,
      applicablePlatforms: coupon.applicablePlatforms || [],
      eligibility: coupon.eligibility || 'all',
      status: coupon.status,
      rules: {
        firstPurchaseOnly: Boolean(coupon.rules?.firstPurchaseOnly),
        canCombine: Boolean(coupon.rules?.canCombine),
        singleUse: coupon.rules?.singleUse !== undefined ? Boolean(coupon.rules.singleUse) : true,
        recurring: Boolean(coupon.rules?.recurring),
      },
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  // Toggle Platform selection in modal
  const handleTogglePlatform = (pId: string) => {
    setFormData((prev) => {
      const exists = prev.applicablePlatforms.includes(pId);
      return {
        ...prev,
        applicablePlatforms: exists
          ? prev.applicablePlatforms.filter((x) => x !== pId)
          : [...prev.applicablePlatforms, pId],
      };
    });
  };

  // Save / Update Form Submission
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      setModalError('Coupon Code is required');
      return;
    }
    if (formData.applicablePlatforms.length === 0) {
      setModalError('Select at least one applicable service platform');
      return;
    }

    setModalLoading(true);
    setModalError(null);

    try {
      if (editingCoupon) {
        await adminCouponService.updateCoupon(editingCoupon.id || editingCoupon._id, formData);
      } else {
        await adminCouponService.createCoupon(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setModalError(err?.response?.data?.message || err?.message || 'Failed to save coupon');
    } finally {
      setModalLoading(false);
    }
  };

  // Toggle Pause / Resume
  const handleToggleStatus = async (coupon: AdminCouponItem) => {
    const newStatus = coupon.status === 'active' ? 'paused' : 'active';
    try {
      await adminCouponService.updateCoupon(coupon.id || coupon._id, { status: newStatus });
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to update status');
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!window.confirm(`Are you sure you want to delete coupon code "${code}"?`)) return;
    try {
      await adminCouponService.deleteCoupon(id);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to delete coupon');
    }
  };

  // Export CSV
  const handleExport = async () => {
    try {
      const data = await adminCouponService.exportData();
      const csvRows = [
        ['Code', 'Description', 'Type', 'Value', 'Status', 'Usage Limit', 'Used Count', 'Start Date', 'Expiry Date'],
        ...data.coupons.map((c) => [
          c.code,
          `"${c.description.replace(/"/g, '""')}"`,
          c.type,
          c.type === 'percentage' ? `${c.percentage}%` : `₹${c.fixedAmount}`,
          c.status,
          c.usageLimit,
          c.usedCount,
          c.startDate,
          c.expiryDate,
        ]),
      ];

      const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `apnatrip_coupons_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Failed to export coupon data');
    }
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* ── Top Bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#6356E5] flex items-center justify-center">
              <Ticket className="w-4.5 h-4.5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              Coupon Management
            </h1>
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Configure promotional codes, track redemption counts, and view revenue discounts across services.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-[#6356E5] hover:bg-[#5244d4] text-white text-xs font-black shadow-md shadow-[#6356E5]/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* ── 7 KPI Metrics Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Total Coupons</span>
          <span className="text-xl font-black text-[#0F172A]">{stats?.totalCoupons ?? '—'}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">Active</span>
          <span className="text-xl font-black text-emerald-700">{stats?.activeCoupons ?? '—'}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Expired</span>
          <span className="text-xl font-black text-slate-600">{stats?.expiredCoupons ?? '—'}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#6356E5] block">Total Used</span>
          <span className="text-xl font-black text-[#6356E5]">{stats?.totalUsed ?? '—'}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">Total Discount</span>
          <span className="text-xl font-black text-amber-700">₹{(stats?.totalDiscountGiven || 0).toLocaleString('en-IN')}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 block">Expiring in 7d</span>
          <span className="text-xl font-black text-rose-600">{stats?.upcomingExpiry ?? '—'}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 block">Used in 24h</span>
          <span className="text-xl font-black text-indigo-600">{stats?.recentUsageCount ?? '—'}</span>
        </div>
      </div>

      {/* ── Analytics & Timeline Overview ── */}
      {analytics && (analytics.topCoupons.length > 0 || analytics.timeline.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Timeline Chart */}
          <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#6356E5]" />
                <h3 className="text-sm font-black text-[#0F172A]">Redemption & Discount Trends</h3>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[10px] font-black">
                {(['daily', 'weekly', 'monthly'] as const).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 rounded-lg capitalize cursor-pointer transition-all ${
                      timeframe === tf ? 'bg-white text-[#6356E5] shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {analytics.timeline.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-xs font-semibold text-slate-400">
                No redemption activity logged in the selected window.
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <div className="h-44 w-full flex items-end gap-2 border-b border-slate-100 pb-2">
                  {analytics.timeline.map((item, idx) => {
                    const maxR = Math.max(...analytics.timeline.map((x) => x.redemptions), 1);
                    const heightPct = Math.max(8, Math.round((item.redemptions / maxR) * 100));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] font-bold p-1 rounded-md pointer-events-none whitespace-nowrap z-10">
                          {item.date}: {item.redemptions} used (₹{item.discount})
                        </div>
                        <div
                          style={{ height: `${heightPct}%` }}
                          className="w-full bg-[#6356E5]/80 hover:bg-[#6356E5] rounded-t-md transition-all cursor-pointer"
                        />
                        <span className="text-[8px] font-bold text-slate-400 truncate w-full text-center">
                          {item.date.slice(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Top Coupons */}
          <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-3.5">
            <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Top Performing Coupons</span>
            </h3>

            <div className="space-y-2.5">
              {analytics.topCoupons.slice(0, 5).map((top, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="font-black text-[#6356E5] block">{top._id}</span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {top.redemptionCount} redemptions
                    </span>
                  </div>
                  <span className="font-extrabold text-slate-700">
                    -₹{top.totalDiscount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
              {analytics.topCoupons.length === 0 && (
                <p className="text-xs text-slate-400 py-6 text-center">No coupon usage recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Search & Filter Controls ── */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coupon code or description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="expired">Expired</option>
            <option value="draft">Draft</option>
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value="all">All Types</option>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </select>

          {/* Platform filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value="all">All Platforms</option>
            <option value="agency_subscription">Agency Subscriptions</option>
            <option value="car_rental_subscription">Car Rental Subscriptions</option>
            <option value="travel_package_booking">Travel Packages</option>
            <option value="car_booking">Car Bookings</option>
            <option value="hotels">Hotels</option>
            <option value="activities">Activities</option>
          </select>
        </div>
      </div>

      {/* ── Coupons Directory Table ── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Applies To</th>
                <th className="py-3.5 px-4">Usage (Used/Limit)</th>
                <th className="py-3.5 px-4">Eligibility</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Validity</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#6356E5]" />
                    <span>Loading coupon directory...</span>
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No coupons found matching your criteria.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => {
                  const isExpired = new Date(coupon.expiryDate) < new Date();
                  const progressPct = coupon.usageLimit
                    ? Math.min(100, Math.round((coupon.usedCount / coupon.usageLimit) * 100))
                    : 0;

                  return (
                    <tr key={coupon.id || coupon._id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Code */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-[#0F172A] bg-purple-50 text-[#6356E5] px-2 py-0.5 rounded-lg border border-purple-100">
                            {coupon.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(coupon.code)}
                            title="Copy code"
                            className="text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 font-normal truncate max-w-xs mt-0.5">
                          {coupon.description}
                        </p>
                      </td>

                      {/* Discount Value */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-[#0F172A]">
                          {coupon.type === 'percentage'
                            ? `${coupon.percentage}% OFF`
                            : `₹${coupon.fixedAmount?.toLocaleString('en-IN')} FLAT`}
                        </div>
                        {coupon.maximumDiscount && coupon.type === 'percentage' && (
                          <span className="text-[10px] text-slate-400 block font-normal">
                            Max ₹{coupon.maximumDiscount}
                          </span>
                        )}
                        {coupon.minimumAmount > 0 && (
                          <span className="text-[10px] text-slate-400 block font-normal">
                            Min ₹{coupon.minimumAmount}
                          </span>
                        )}
                      </td>

                      {/* Applies To */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {coupon.applicablePlatforms?.slice(0, 2).map((p, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md"
                            >
                              {p.replace(/_/g, ' ')}
                            </span>
                          ))}
                          {coupon.applicablePlatforms?.length > 2 && (
                            <span className="text-[9px] font-bold text-slate-400">
                              +{coupon.applicablePlatforms.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Redemptions */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1 min-w-[100px]">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span>{coupon.usedCount}</span>
                            <span className="text-slate-400">/ {coupon.usageLimit}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              style={{ width: `${progressPct}%` }}
                              className={`h-full rounded-full ${
                                progressPct > 85 ? 'bg-rose-500' : progressPct > 50 ? 'bg-amber-500' : 'bg-[#6356E5]'
                              }`}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Eligibility */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-bold text-slate-600 capitalize">
                          {coupon.eligibility?.replace(/_/g, ' ') || 'All'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isExpired || coupon.status === 'expired' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-500 border border-slate-200">
                            Expired
                          </span>
                        ) : coupon.status === 'active' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        ) : coupon.status === 'paused' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200">
                            Paused
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-50 text-[#6356E5] border border-purple-200">
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Validity */}
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] text-slate-500 font-semibold space-y-0.5">
                          <span>Till {new Date(coupon.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(coupon)}
                            title={coupon.status === 'active' ? 'Pause coupon' : 'Resume coupon'}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                          >
                            {coupon.status === 'active' ? (
                              <PauseCircle className="w-4 h-4 text-amber-600" />
                            ) : (
                              <PlayCircle className="w-4 h-4 text-emerald-600" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(coupon)}
                            title="Edit coupon rules"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4 text-[#6356E5]" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCoupon(coupon.id || coupon._id, coupon.code)}
                            title="Delete coupon"
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>
              Showing {coupons.length} of {pagination.total} coupons
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── CREATE / EDIT COUPON MODAL ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-2xl shadow-2xl border border-slate-100 space-y-5 my-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-[#0F172A]">
                    {editingCoupon ? 'Edit Promotional Coupon' : 'Create New Promotional Coupon'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400">
                    Define discount logic, platform restrictions, and redemption limits.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {modalError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  {modalError}
                </div>
              )}

              <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs font-bold">
                {/* Code & Description */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 uppercase tracking-wider block mb-1">Coupon Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. FESTIVAL20"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-black uppercase text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 uppercase tracking-wider block mb-1">Discount Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-semibold focus:outline-hidden"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-500 uppercase tracking-wider block mb-1">Description *</label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g. 20% discount on partner onboarding registrations"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                  />
                </div>

                {/* Values */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-500 uppercase tracking-wider block mb-1">
                      {formData.type === 'percentage' ? 'Percentage (%) *' : 'Fixed Amount (₹) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={formData.type === 'percentage' ? 100 : undefined}
                      value={formData.type === 'percentage' ? formData.percentage : formData.fixedAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [formData.type === 'percentage' ? 'percentage' : 'fixedAmount']: Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-black text-slate-800 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 uppercase tracking-wider block mb-1">Min Order (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.minimumAmount}
                      onChange={(e) => setFormData({ ...formData, minimumAmount: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 uppercase tracking-wider block mb-1">Max Cap (₹)</label>
                    <input
                      type="number"
                      min={0}
                      disabled={formData.type === 'fixed'}
                      value={formData.maximumDiscount}
                      onChange={(e) => setFormData({ ...formData, maximumDiscount: Number(e.target.value) })}
                      placeholder="Optional cap"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-hidden disabled:opacity-40"
                    />
                  </div>
                </div>

                {/* Dates & Limits */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-slate-500 uppercase tracking-wider block mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 uppercase tracking-wider block mb-1">Expiry Date</label>
                    <input
                      type="date"
                      required
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 uppercase tracking-wider block mb-1">Total Limit</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 uppercase tracking-wider block mb-1">Per User Limit</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.perUserLimit}
                      onChange={(e) => setFormData({ ...formData, perUserLimit: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Applicable Platforms Checkboxes */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-slate-500 uppercase tracking-wider block">
                    Applicable Platforms & Services *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    {ALL_PLATFORMS.map((platform) => (
                      <label
                        key={platform.id}
                        className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-[#6356E5]"
                      >
                        <input
                          type="checkbox"
                          checked={formData.applicablePlatforms.includes(platform.id)}
                          onChange={() => handleTogglePlatform(platform.id)}
                          className="rounded-md text-[#6356E5] focus:ring-0 cursor-pointer"
                        />
                        <span className="text-[11px] font-bold">{platform.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Eligibility & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 uppercase tracking-wider block mb-1">User Eligibility</label>
                    <select
                      value={formData.eligibility}
                      onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-hidden"
                    >
                      <option value="all">Everyone</option>
                      <option value="new_users">New Users</option>
                      <option value="existing_users">Existing Users</option>
                      <option value="partner_only">Partner Only</option>
                      <option value="agency_only">Travel Agency Only</option>
                      <option value="car_rental_only">Car Rental Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-500 uppercase tracking-wider block mb-1">Campaign Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-hidden"
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="draft">Draft</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>

                {/* Rules Toggles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={formData.rules.firstPurchaseOnly}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rules: { ...formData.rules, firstPurchaseOnly: e.target.checked },
                        })
                      }
                      className="rounded-md text-[#6356E5]"
                    />
                    <span className="text-[10px]">First purchase only</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={formData.rules.canCombine}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rules: { ...formData.rules, canCombine: e.target.checked },
                        })
                      }
                      className="rounded-md text-[#6356E5]"
                    />
                    <span className="text-[10px]">Can combine</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={formData.rules.singleUse}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rules: { ...formData.rules, singleUse: e.target.checked },
                        })
                      }
                      className="rounded-md text-[#6356E5]"
                    />
                    <span className="text-[10px]">Single use per acc</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={formData.rules.recurring}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rules: { ...formData.rules, recurring: e.target.checked },
                        })
                      }
                      className="rounded-md text-[#6356E5]"
                    />
                    <span className="text-[10px]">Recurring</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="px-6 py-2.5 rounded-xl bg-[#6356E5] hover:bg-[#5244d4] text-white font-black cursor-pointer shadow-md shadow-[#6356E5]/25 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {modalLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingCoupon ? 'Update Coupon' : 'Create Coupon'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCouponsPage;
