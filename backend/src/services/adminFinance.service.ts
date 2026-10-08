import mongoose from 'mongoose';
import { PaymentModel } from '../models/payment.model.js';
import { BookingModel } from '../models/booking.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { SettlementModel } from '../models/settlement.model.js';
import { SettlementEventModel } from '../models/settlementEvent.model.js';
import { RefundModel } from '../models/refund.model.js';
import { AuditLogModel } from '../models/auditLog.model.js';
import { PackageModel } from '../models/package.model.js';
import { AuditLoggerService } from './auditLogger.service.js';

export class AdminFinanceService {
  private formatRupees(val: number): string {
    if (val === 0) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  }

  /**
   * 1. Live Aggregated Financial KPI Statistics
   */
  async getKPIStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [currentPayments, prevPayments, currentRefunds, pendingSettlements, settledSettlements] = await Promise.all([
      PaymentModel.aggregate([
        { $match: { isDeleted: false, status: 'SUCCESS', createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: null, gmv: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      PaymentModel.aggregate([
        { $match: { isDeleted: false, status: 'SUCCESS', createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } } },
        { $group: { _id: null, gmv: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      RefundModel.aggregate([
        { $match: { isDeleted: false, status: { $in: ['PROCESSED', 'FULLY_REFUNDED'] } } },
        { $group: { _id: null, totalRefund: { $sum: '$refundAmount' } } },
      ]),
      SettlementModel.aggregate([
        { $match: { status: { $in: ['PENDING', 'PROCESSING'] } } },
        { $group: { _id: null, pending: { $sum: '$netSettledAmount' } } },
      ]),
      SettlementModel.aggregate([
        { $match: { status: 'SETTLED' } },
        { $group: { _id: null, settled: { $sum: '$netSettledAmount' } } },
      ]),
    ]);

    const currGmv = currentPayments[0]?.gmv || 0;
    const prevGmv = prevPayments[0]?.gmv || 0;

    const gmvGrowthPct = prevGmv > 0 ? (((currGmv - prevGmv) / prevGmv) * 100).toFixed(1) : currGmv > 0 ? '+100%' : '0%';
    const gmvGrowth = prevGmv > 0 && currGmv >= prevGmv ? `+${gmvGrowthPct}%` : `${gmvGrowthPct}%`;

    const platformRevenue = Math.round(currGmv * 0.15);
    const platformProfit = Math.round(platformRevenue * 0.65);
    const gstCollected = Math.round(platformRevenue * 0.18);
    const netRetained = Math.max(0, platformProfit - gstCollected);

    const pendingPayoutVal = pendingSettlements[0]?.pending || 0;
    const completedSettlementsVal = settledSettlements[0]?.settled || 0;
    const totalRefundVal = currentRefunds[0]?.totalRefund || 0;

    return {
      gmv: {
        id: 'gmv',
        title: 'Gross Merchandise Value',
        value: this.formatRupees(currGmv),
        growth: gmvGrowth,
        isPositive: currGmv >= prevGmv,
        comparison: 'from last 30 days',
        iconType: 'gmv' as const,
      },
      revenue: {
        id: 'revenue',
        title: 'Platform Revenue',
        value: this.formatRupees(platformRevenue),
        growth: gmvGrowth,
        isPositive: currGmv >= prevGmv,
        comparison: 'from last 30 days',
        iconType: 'revenue' as const,
      },
      profit: {
        id: 'profit',
        title: 'Platform Profit',
        value: this.formatRupees(platformProfit),
        growth: gmvGrowth,
        isPositive: currGmv >= prevGmv,
        comparison: 'from last 30 days',
        iconType: 'profit' as const,
      },
      pendingPayouts: {
        id: 'payouts',
        title: 'Pending Agency Payouts',
        value: this.formatRupees(pendingPayoutVal),
        growth: '0%',
        isPositive: pendingPayoutVal === 0,
        comparison: 'awaiting clearance',
        iconType: 'payouts' as const,
      },
      completedSettlements: {
        id: 'settlements',
        title: 'Completed Settlements',
        value: this.formatRupees(completedSettlementsVal),
        growth: '0%',
        isPositive: true,
        comparison: 'all time disbursed',
        iconType: 'settlements' as const,
      },
      refundAmount: {
        id: 'refund',
        title: 'Total Refunds',
        value: this.formatRupees(totalRefundVal),
        growth: '0%',
        isPositive: totalRefundVal === 0,
        comparison: 'disbursed refunds',
        iconType: 'refund' as const,
      },
      taxesCollected: {
        id: 'taxes',
        title: 'GST & Taxes Collected',
        value: this.formatRupees(gstCollected),
        growth: gmvGrowth,
        isPositive: true,
        comparison: 'from last 30 days',
        iconType: 'taxes' as const,
      },
      netEarnings: {
        id: 'earnings',
        title: 'Net Retained Earnings',
        value: this.formatRupees(netRetained),
        growth: gmvGrowth,
        isPositive: true,
        comparison: 'from last 30 days',
        iconType: 'earnings' as const,
      },
    };
  }

  /**
   * 2. Live Revenue Overview Chart Data (Aggregation by real payments)
   */
  async getRevenueOverview(range: string = '30d') {
    const days = range === '7d' ? 7 : range === '90d' ? 90 : 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const payments = await PaymentModel.aggregate([
      {
        $match: {
          isDeleted: false,
          status: 'SUCCESS',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          gmv: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    if (!payments || payments.length === 0) {
      return [];
    }

    return payments.map((p: any) => {
      const gmv = p.gmv || 0;
      const rev = Math.round(gmv * 0.15);
      const prof = Math.round(rev * 0.65);
      return {
        date: p._id,
        label: p._id,
        revenue: rev,
        gmv: gmv,
        profit: prof,
        formattedRevenue: this.formatRupees(rev),
        formattedGmv: this.formatRupees(gmv),
        formattedProfit: this.formatRupees(prof),
      };
    });
  }

  /**
   * 3. Commission Breakdown (Aggregation by booking categories)
   */
  async getCommissionBreakdown() {
    const breakdown = await BookingModel.aggregate([
      { $match: { isDeleted: false, status: { $in: ['CONFIRMED', 'COMPLETED'] } } },
      {
        $lookup: {
          from: 'packages',
          localField: 'packageId',
          foreignField: '_id',
          as: 'pkg',
        },
      },
      { $unwind: { path: '$pkg', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ['$pkg.category', 'General Tour'] },
          totalAmount: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    if (!breakdown || breakdown.length === 0) {
      return [];
    }

    const totalSum = breakdown.reduce((sum, item) => sum + (item.totalAmount || 0), 0) || 1;
    const colors = ['#6356E5', '#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'];

    return breakdown.map((item, idx) => {
      const pct = Math.round(((item.totalAmount || 0) / totalSum) * 100);
      return {
        name: item._id,
        amount: this.formatRupees(item.totalAmount || 0),
        percentage: `${pct}%`,
        color: colors[idx % colors.length],
        value: pct,
      };
    });
  }

  /**
   * 4. Destination Revenue (Aggregation by booking destination)
   */
  async getDestinationRevenue() {
    const destinations = await BookingModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$destination',
          totalAmount: { $sum: '$totalAmount' },
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 8 },
    ]);

    if (!destinations || destinations.length === 0) {
      return [];
    }

    const maxAmount = Math.max(...destinations.map((d) => d.totalAmount || 0), 1);

    return destinations.map((d) => ({
      destination: d._id || 'Unknown',
      amount: this.formatRupees(d.totalAmount || 0),
      heightPercent: Math.round(((d.totalAmount || 0) / maxAmount) * 100),
    }));
  }

  /**
   * 5. Top Performing Agencies (Aggregation from real bookings/agencies)
   */
  async getTopAgencies() {
    const top = await BookingModel.aggregate([
      { $match: { isDeleted: false, status: { $in: ['CONFIRMED', 'COMPLETED'] } } },
      {
        $group: {
          _id: '$agencyId',
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'agencies',
          localField: '_id',
          foreignField: '_id',
          as: 'agency',
        },
      },
      { $unwind: { path: '$agency', preserveNullAndEmptyArrays: true } },
    ]);

    if (!top || top.length === 0) {
      return [];
    }

    return top.map((t: any, idx: number) => {
      const rev = t.revenue || 0;
      const comm = Math.round(rev * 0.15);
      const agencyName = t.agency?.businessInfo?.companyName || t.agency?.name || 'Partner Agency';
      const agencyLogo = t.agency?.branding?.logo || '';
      const rating = t.agency?.rating || 0;

      return {
        id: t._id ? String(t._id) : `ag-${idx + 1}`,
        rank: idx + 1,
        agencyName,
        agencyLogo,
        revenue: this.formatRupees(rev),
        bookings: t.bookings || 0,
        commission: this.formatRupees(comm),
        growth: '0%',
        isGrowthPositive: true,
        rating: rating > 0 ? rating : 0.0,
      };
    });
  }

  /**
   * 6. Financial Summary Data
   */
  async getFinancialSummary() {
    const [paymentsSum, refundsSum] = await Promise.all([
      PaymentModel.aggregate([
        { $match: { isDeleted: false, status: 'SUCCESS' } },
        { $group: { _id: null, gmv: { $sum: '$amount' } } },
      ]),
      RefundModel.aggregate([
        { $match: { isDeleted: false, status: { $in: ['PROCESSED', 'FULLY_REFUNDED'] } } },
        { $group: { _id: null, refunds: { $sum: '$refundAmount' } } },
      ]),
    ]);

    const gmv = paymentsSum[0]?.gmv || 0;
    const refunds = refundsSum[0]?.refunds || 0;
    const netRevenue = Math.round(gmv * 0.15);
    const taxesPaid = Math.round(netRevenue * 0.18);
    const gatewayCharges = Math.round(gmv * 0.02);

    return {
      grossRevenue: { value: this.formatRupees(gmv), growth: '0%', isPositive: true },
      netRevenue: { value: this.formatRupees(netRevenue), growth: '0%', isPositive: true },
      totalRefunds: { value: this.formatRupees(refunds), growth: '0%', isPositive: refunds === 0 },
      totalDiscounts: { value: '₹0', growth: '0%', isPositive: true },
      taxesPaid: { value: this.formatRupees(taxesPaid), growth: '0%', isPositive: true },
      gatewayCharges: { value: this.formatRupees(gatewayCharges), growth: '0%', isPositive: true },
    };
  }

  /**
   * 7. Refund Analytics
   */
  async getRefundAnalytics() {
    const [counts, trends] = await Promise.all([
      RefundModel.aggregate([
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
      RefundModel.aggregate([
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            requests: { $sum: 1 },
            approved: {
              $sum: {
                $cond: [{ $in: ['$status', ['PROCESSED', 'FULLY_REFUNDED']] }, 1, 0],
              },
            },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 6 },
      ]),
    ]);

    let total = 0;
    let approved = 0;
    let pending = 0;
    let rejected = 0;

    for (const c of counts) {
      total += c.count;
      if (['PROCESSED', 'FULLY_REFUNDED'].includes(c._id)) approved += c.count;
      else if (['REQUESTED', 'PROCESSING'].includes(c._id)) pending += c.count;
      else if (['FAILED', 'REVERSED'].includes(c._id)) rejected += c.count;
    }

    return {
      totalRequests: total,
      approved,
      pending,
      rejected,
      trends: trends.map((t) => ({
        month: t._id,
        requests: t.requests || 0,
        approved: t.approved || 0,
      })),
    };
  }

  /**
   * 8. Agency Settlements Queue (Aggregation across Settlement, Agency, Payment, Booking)
   */
  async getSettlements() {
    const settlements = await SettlementModel.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 50 },
      {
        $lookup: {
          from: 'agencies',
          localField: 'sellerId',
          foreignField: '_id',
          as: 'agency',
        },
      },
      { $unwind: { path: '$agency', preserveNullAndEmptyArrays: true } },
    ]);

    if (!settlements || settlements.length === 0) {
      return [];
    }

    return settlements.map((s: any) => {
      const agencyName = s.sellerName || s.agency?.businessInfo?.companyName || s.agency?.name || 'Partner Agency';
      const agencyLogo = s.agency?.branding?.logo || '';
      const bankName = s.bankName || s.agency?.bankDetails?.bankName || 'N/A';
      const accNumber = s.bankAccountMasked || (s.agency?.bankDetails?.accountNumber ? `•••• ${s.agency.bankDetails.accountNumber.slice(-4)}` : 'N/A');
      const ifsc = s.ifscCode || s.agency?.bankDetails?.ifscCode || 'N/A';
      const gross = s.amount || 0;
      const commission = s.commissionDeducted || 0;
      const net = s.netSettledAmount || gross - commission;

      let status = 'Pending';
      if (s.status === 'SETTLED') status = 'Settled';
      else if (s.status === 'PROCESSING' || s.status === 'TRANSFERRED') status = 'Processing';
      else if (s.status === 'FAILED') status = 'Failed';
      else if (s.status === 'REVERSED') status = 'Refunded';

      return {
        id: s.settlementId || (s._id ? `SETT-${String(s._id).slice(-6).toUpperCase()}` : 'SETT-000000'),
        agencyId: s.sellerId ? String(s.sellerId) : '',
        agencyName,
        agencyLogo,
        bankName,
        accountNumber: accNumber,
        ifscCode: ifsc,
        totalBookings: 1,
        grossAmount: this.formatRupees(gross),
        platformFee: this.formatRupees(commission),
        tdsAmount: '₹0',
        netPayout: this.formatRupees(net),
        status,
        cycle: s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
        scheduledDate: s.expectedSettlementDate ? new Date(s.expectedSettlementDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
        utr: s.utr || 'N/A',
      };
    });
  }

  /**
   * 9. Financial Timeline Events
   */
  async getFinancialTimeline() {
    const events = await SettlementEventModel.find().sort({ createdAt: -1 }).limit(25).lean();

    if (events && events.length > 0) {
      return events.map((ev: any) => ({
        id: ev._id ? String(ev._id) : (ev.requestId || 'ev-0'),
        type: ev.eventType || 'payout',
        title: ev.notes || 'Settlement Event',
        description: `Source: ${ev.eventSource || 'SYSTEM'} • Status: ${ev.newStatus || 'UPDATED'}`,
        time: ev.createdAt ? new Date(ev.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent',
        amount: ev.amount ? this.formatRupees(ev.amount) : undefined,
        badge: ev.newStatus || 'Event',
        utr: ev.utr,
      }));
    }

    // Fallback: check AuditLog for financial events
    const auditLogs = await AuditLogModel.find({
      module: { $in: ['FINANCE', 'PAYMENT', 'SETTLEMENT'] },
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    if (!auditLogs || auditLogs.length === 0) {
      return [];
    }

    return auditLogs.map((log: any) => ({
      id: log._id ? String(log._id) : 'ev-0',
      type: 'payout',
      title: log.action || 'Financial Operation',
      description: log.description || 'System log recorded',
      time: log.createdAt ? new Date(log.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent',
      amount: undefined,
      badge: log.status || 'Complete',
    }));
  }

  /**
   * 10. Agency Sidebar Profile
   */
  async getAgencySidebarData(agencyId: string) {
    const agency = await AgencyModel.findById(agencyId).lean();
    if (!agency) {
      return null;
    }

    const [bookingsAgg, settlements] = await Promise.all([
      BookingModel.aggregate([
        { $match: { agencyId: new mongoose.Types.ObjectId(agencyId), isDeleted: false } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            count: { $sum: 1 },
          },
        },
      ]),
      SettlementModel.find({ sellerId: new mongoose.Types.ObjectId(agencyId) })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const totalRev = bookingsAgg[0]?.totalRevenue || 0;
    const totalBookings = bookingsAgg[0]?.count || 0;
    const avgBooking = totalBookings > 0 ? Math.round(totalRev / totalBookings) : 0;
    const commission = Math.round(totalRev * 0.15);

    return {
      agencyId,
      agencyName: (agency as any).businessInfo?.companyName || (agency as any).name || 'Partner Agency',
      agencyLogo: (agency as any).branding?.logo || '',
      verified: (agency as any).verificationStatus === 'APPROVED',
      rating: (agency as any).rating || 0.0,
      revenueOverview: {
        totalRevenue: this.formatRupees(totalRev),
        bookings: totalBookings,
        avgBookingValue: this.formatRupees(avgBooking),
        totalCommission: this.formatRupees(commission),
      },
      settlementHistory: settlements.map((s: any) => ({
        id: s.settlementId || String(s._id),
        date: s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
        amount: this.formatRupees(s.netSettledAmount || 0),
        status: s.status === 'SETTLED' ? 'Settled' : s.status,
      })),
      monthlyTrends: [],
    };
  }

  /**
   * 11. Process Settlement Payout
   */
  async processSettlement(settlementId: string, admin: any) {
    const settlement = await SettlementModel.findOne({
      $or: [{ settlementId }, { _id: mongoose.Types.ObjectId.isValid(settlementId) ? settlementId : undefined }],
    });

    if (settlement) {
      settlement.status = 'SETTLED';
      settlement.settledAt = new Date();
      await settlement.save();

      await SettlementEventModel.create({
        settlementId: settlement._id,
        settlementReferenceId: settlement.settlementId,
        actor: {
          id: admin?._id?.toString(),
          name: admin?.name || 'Super Admin',
          role: 'Super Admin',
          email: admin?.email,
        },
        eventType: 'SETTLEMENT_PROCESSED',
        previousStatus: 'PROCESSING',
        newStatus: 'SETTLED',
        eventSource: 'MANUAL_ADMIN',
        amount: settlement.netSettledAmount,
        notes: `Admin approved settlement ${settlement.settlementId}`,
        timestamp: new Date(),
      });
    }

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'FINANCE',
      action: 'PROCESS_SETTLEMENT',
      eventType: 'UPDATE',
      description: `Disbursed settlement payout "${settlementId}"`,
      severity: 'High',
    });

    return { success: true, message: `Payout for ${settlementId} initiated successfully` };
  }
}

export const adminFinanceService = new AdminFinanceService();
