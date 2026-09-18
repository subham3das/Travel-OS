import mongoose from 'mongoose';
import { PaymentModel, IPayment } from '../models/payment.model.js';
import { BookingModel } from '../models/booking.model.js';
import { PackageModel } from '../models/package.model.js';
import { AgencyModel } from '../models/agency.model.js';

export interface GetTransactionsQuery {
  page?: number;
  limit?: number;
  paymentStatus?: string;
  paymentMethod?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export class AgencyFinanceService {
  /**
   * Auto-seed demo payments for agency if none exist
   */
  private static async ensureInitialPayments(agencyId: string): Promise<void> {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const count = await PaymentModel.countDocuments({ agencyId: aid, isDeleted: false });
    if (count > 0) return;

    const agency = await AgencyModel.findById(aid);
    const agencyName = agency?.businessName || agency?.name || 'ApnaTrip Partner Agency';

    const agencyBookings = await BookingModel.find({ agencyId: aid, isDeleted: false }).limit(5);

    const now = new Date();
    const demoPayments = [
      {
        paymentId: 'PAY-2025-00123',
        bookingId: agencyBookings[0]?.bookingId || 'BK-2025-0012',
        agencyId: aid,
        agencyName,
        userName: 'Subham Das',
        userEmail: 'subhamdas@gmail.com',
        userPhone: '+91 98765 43210',
        packageName: agencyBookings[0]?.packageName || 'Ladakh Expedition & High Pass Trail',
        amount: 48000,
        platformFee: 4800,
        gstAmount: 2400,
        agencyEarnings: 40800,
        netAmount: 40800,
        currency: 'INR',
        gateway: 'Razorpay' as const,
        paymentMethod: 'UPI',
        status: 'SUCCESS' as const,
        settlementStatus: 'Settled' as const,
        settlementAccount: 'HDFC Bank - 1234',
        transactionRef: 'UPI-REF-8921829',
        paidAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        paymentId: 'PAY-2025-00124',
        bookingId: 'BK-2025-0015',
        agencyId: aid,
        agencyName,
        userName: 'Priya Sharma',
        userEmail: 'priya.sharma@gmail.com',
        userPhone: '+91 91234 56789',
        packageName: 'Kashmir Paradise Tour',
        amount: 36000,
        platformFee: 3600,
        gstAmount: 1800,
        agencyEarnings: 30600,
        netAmount: 30600,
        currency: 'INR',
        gateway: 'Razorpay' as const,
        paymentMethod: 'Credit Card',
        status: 'SUCCESS' as const,
        settlementStatus: 'Pending' as const,
        settlementAccount: 'HDFC Bank - 1234',
        transactionRef: 'CC-REF-492810',
        paidAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        paymentId: 'PAY-2025-00125',
        bookingId: 'BK-2025-0018',
        agencyId: aid,
        agencyName,
        userName: 'Rahul Verma',
        userEmail: 'rahul.verma@gmail.com',
        userPhone: '+91 99887 76655',
        packageName: 'Spiti Valley Circuit',
        amount: 28000,
        platformFee: 2800,
        gstAmount: 1400,
        agencyEarnings: 23800,
        netAmount: 23800,
        currency: 'INR',
        gateway: 'Razorpay' as const,
        paymentMethod: 'NetBanking',
        status: 'SUCCESS' as const,
        settlementStatus: 'Pending' as const,
        settlementAccount: 'HDFC Bank - 1234',
        transactionRef: 'NB-REF-389102',
        paidAt: now,
      },
      {
        paymentId: 'PAY-2025-00126',
        bookingId: 'BK-2025-0021',
        agencyId: aid,
        agencyName,
        userName: 'Neha Singh',
        userEmail: 'neha.singh@gmail.com',
        userPhone: '+91 98111 00000',
        packageName: 'Meghalaya Backpacking',
        amount: 18600,
        platformFee: 1860,
        gstAmount: 930,
        agencyEarnings: 15810,
        netAmount: 15810,
        currency: 'INR',
        gateway: 'Razorpay' as const,
        paymentMethod: 'UPI',
        status: 'PENDING' as const,
        settlementStatus: 'Pending' as const,
        paidAt: now,
      },
      {
        paymentId: 'PAY-2025-00127',
        bookingId: 'BK-2025-0024',
        agencyId: aid,
        agencyName,
        userName: 'Vikram Joshi',
        userEmail: 'vikram.j@gmail.com',
        userPhone: '+91 88776 55443',
        packageName: 'Kerala Backwaters 5D',
        amount: 15200,
        platformFee: 1520,
        gstAmount: 760,
        agencyEarnings: 0,
        netAmount: 0,
        currency: 'INR',
        gateway: 'Razorpay' as const,
        paymentMethod: 'UPI',
        status: 'REFUNDED' as const,
        settlementStatus: 'Settled' as const,
        paidAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
    ];

    await PaymentModel.insertMany(demoPayments);
  }

  /**
   * Get full agency finance command center overview
   */
  static async getAgencyFinanceOverview(agencyId: string) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    await this.ensureInitialPayments(agencyId);

    const payments = await PaymentModel.find({ agencyId: aid, isDeleted: false })
      .sort({ createdAt: -1 })
      .lean();

    let totalRevenue = 0;
    let totalAgencyEarnings = 0;
    let pendingSettlement = 0;
    let totalRefunds = 0;
    let platformCommission = 0;
    let gstCollected = 0;

    let successfulCount = 0;
    let pendingCount = 0;
    let failedCount = 0;
    let refundedCount = 0;

    let successfulAmount = 0;
    let pendingAmount = 0;
    let failedAmount = 0;
    let refundedAmount = 0;

    payments.forEach((p) => {
      const amt = p.amount || 0;
      const earnings = p.agencyEarnings || amt * 0.85;
      const fee = p.platformFee || amt * 0.1;
      const gst = p.gstAmount || amt * 0.05;

      if (p.status === 'SUCCESS') {
        successfulCount++;
        successfulAmount += amt;
        totalRevenue += amt;
        totalAgencyEarnings += earnings;
        platformCommission += fee;
        gstCollected += gst;

        if (p.settlementStatus === 'Pending') {
          pendingSettlement += earnings;
        }
      } else if (p.status === 'PENDING') {
        pendingCount++;
        pendingAmount += amt;
      } else if (p.status === 'REFUNDED') {
        refundedCount++;
        refundedAmount += amt;
        totalRefunds += amt;
      } else if (p.status === 'FAILED') {
        failedCount++;
        failedAmount += amt;
      }
    });

    const availableBalance = Math.max(0, totalAgencyEarnings - pendingSettlement);
    const totalPaymentsCount = payments.length || 1;

    const summary = [
      {
        id: 'm1',
        title: 'Total Revenue',
        amount: totalRevenue,
        formattedAmount: `₹${totalRevenue.toLocaleString('en-IN')}`,
        growth: '↑ 18.6% vs last month',
        isPositive: true,
        type: 'revenue' as const,
      },
      {
        id: 'm2',
        title: 'Available Balance',
        amount: availableBalance,
        formattedAmount: `₹${availableBalance.toLocaleString('en-IN')}`,
        growth: '↑ 12.4% vs last month',
        isPositive: true,
        type: 'balance' as const,
      },
      {
        id: 'm3',
        title: 'Pending Settlement',
        amount: pendingSettlement,
        formattedAmount: `₹${pendingSettlement.toLocaleString('en-IN')}`,
        growth: '↑ 7.8% scheduled',
        isPositive: true,
        type: 'settlement' as const,
      },
      {
        id: 'm4',
        title: 'Total Refunds',
        amount: totalRefunds,
        formattedAmount: `₹${totalRefunds.toLocaleString('en-IN')}`,
        growth: '↓ 5.6% vs last month',
        isPositive: false,
        type: 'refunds' as const,
      },
      {
        id: 'm5',
        title: 'Platform Commission',
        amount: platformCommission,
        formattedAmount: `₹${platformCommission.toLocaleString('en-IN')}`,
        growth: '↑ 10.3% standard',
        isPositive: true,
        type: 'commission' as const,
      },
      {
        id: 'm6',
        title: 'Net Earnings',
        amount: totalAgencyEarnings,
        formattedAmount: `₹${totalAgencyEarnings.toLocaleString('en-IN')}`,
        growth: '↑ 16.2% net profit',
        isPositive: true,
        type: 'earnings' as const,
      },
    ];

    const paymentBreakdown = [
      {
        status: 'Successful' as const,
        percentage: Math.round((successfulCount / totalPaymentsCount) * 100),
        amount: successfulAmount,
        formattedAmount: `₹${successfulAmount.toLocaleString('en-IN')}`,
        color: '#10B981',
      },
      {
        status: 'Pending' as const,
        percentage: Math.round((pendingCount / totalPaymentsCount) * 100),
        amount: pendingAmount,
        formattedAmount: `₹${pendingAmount.toLocaleString('en-IN')}`,
        color: '#F59E0B',
      },
      {
        status: 'Failed' as const,
        percentage: Math.round((failedCount / totalPaymentsCount) * 100),
        amount: failedAmount,
        formattedAmount: `₹${failedAmount.toLocaleString('en-IN')}`,
        color: '#EF4444',
      },
      {
        status: 'Refunded' as const,
        percentage: Math.round((refundedCount / totalPaymentsCount) * 100),
        amount: refundedAmount,
        formattedAmount: `₹${refundedAmount.toLocaleString('en-IN')}`,
        color: '#3B82F6',
      },
    ];

    const recentTransactions = payments.slice(0, 5).map((p: any) => ({
      id: p._id.toString(),
      bookingId: p.bookingId ? `#${p.bookingId}` : `#${p.paymentId}`,
      packageName: p.packageName || 'Expedition Package',
      travelerName: p.userName || 'Traveler',
      amount: p.amount,
      formattedAmount: `₹${(p.amount || 0).toLocaleString('en-IN')}`,
      paymentMethod: (p.paymentMethod === 'Credit Card' ? 'Credit Card' : p.paymentMethod === 'NetBanking' ? 'Net Banking' : 'UPI') as any,
      paymentStatus: (p.status === 'SUCCESS' ? 'Paid' : p.status === 'REFUNDED' ? 'Refunded' : p.status === 'FAILED' ? 'Failed' : 'Pending') as any,
      transactionDate: new Date(p.paidAt || p.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      iconType: (p.packageName?.toLowerCase().includes('kerala') ? 'palm' : p.status === 'PENDING' ? 'hourglass' : 'mountain') as any,
    }));

    const revenueTrend30D = [
      { date: '1 May', revenue: 35000, bookings: 2, netProfit: 28000, formattedRevenue: '₹35,000' },
      { date: '6 May', revenue: 98000, bookings: 5, netProfit: 78000, formattedRevenue: '₹98,000' },
      { date: '11 May', revenue: 150000, bookings: 8, netProfit: 120000, formattedRevenue: '₹1,50,000' },
      { date: '16 May', revenue: 245800, bookings: 12, netProfit: 196000, formattedRevenue: '₹2,45,800' },
      { date: '21 May', revenue: 110000, bookings: 6, netProfit: 88000, formattedRevenue: '₹1,10,000' },
      { date: '26 May', revenue: 175000, bookings: 9, netProfit: 140000, formattedRevenue: '₹1,75,000' },
      { date: '31 May', revenue: totalRevenue, bookings: successfulCount, netProfit: totalAgencyEarnings, formattedRevenue: `₹${totalRevenue.toLocaleString('en-IN')}` },
    ];

    const settlement = {
      lastSettlement: {
        amount: availableBalance,
        formattedAmount: `₹${availableBalance.toLocaleString('en-IN')}`,
        date: '28 May 2025',
        status: 'Completed' as const,
      },
      nextSettlement: {
        amount: pendingSettlement,
        formattedAmount: `₹${pendingSettlement.toLocaleString('en-IN')}`,
        date: '04 Jun 2025',
        status: 'Upcoming' as const,
      },
      settlementFrequency: 'Weekly',
      bankAccountLast4: '1234',
      bankName: 'HDFC Bank',
    };

    const refundSummary = {
      approvedCount: 12,
      pendingCount: 2,
      rejectedCount: 1,
      totalCount: 15,
      recentRequest: {
        id: 'rf-501',
        bookingId: '#BK-2025-0024',
        packageName: 'Kerala Backwaters 5D',
        travelerName: 'Vikram Joshi',
        refundAmount: 15200,
        formattedAmount: '₹15,200',
        reason: 'Trip Cancelled by Traveler',
        status: 'Pending' as const,
        requestDate: '29 May 2025',
      },
    };

    const taxInfo = {
      gstCollected,
      formattedGstCollected: `₹${gstCollected.toLocaleString('en-IN')}`,
      platformFees: platformCommission,
      formattedPlatformFees: `₹${platformCommission.toLocaleString('en-IN')}`,
      netTaxableRevenue: totalAgencyEarnings,
      formattedNetTaxableRevenue: `₹${totalAgencyEarnings.toLocaleString('en-IN')}`,
      gstPercentage: 18,
    };

    return {
      summary,
      revenueTrend30D,
      paymentBreakdown,
      recentTransactions,
      settlement,
      refundSummary,
      taxInfo,
    };
  }

  /**
   * Get filtered transactions list
   */
  static async getAgencyTransactions(agencyId: string, query: GetTransactionsQuery) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    await this.ensureInitialPayments(agencyId);

    const filter: Record<string, any> = {
      agencyId: aid,
      isDeleted: false,
    };

    if (query.paymentStatus && query.paymentStatus !== 'All') {
      const statusMap: Record<string, string> = {
        Paid: 'SUCCESS',
        Pending: 'PENDING',
        Failed: 'FAILED',
        Refunded: 'REFUNDED',
      };
      filter.status = statusMap[query.paymentStatus] || query.paymentStatus;
    }

    if (query.paymentMethod && query.paymentMethod !== 'All') {
      filter.paymentMethod = query.paymentMethod;
    }

    if (query.search) {
      const q = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { bookingId: q },
        { paymentId: q },
        { userName: q },
        { packageName: q },
        { transactionRef: q },
      ];
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      PaymentModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      PaymentModel.countDocuments(filter),
    ]);

    return {
      transactions: transactions.map((p: any) => ({
        id: p._id.toString(),
        bookingId: p.bookingId ? `#${p.bookingId}` : `#${p.paymentId}`,
        packageName: p.packageName || 'Expedition Package',
        travelerName: p.userName || 'Traveler',
        amount: p.amount,
        formattedAmount: `₹${(p.amount || 0).toLocaleString('en-IN')}`,
        paymentMethod: p.paymentMethod,
        paymentStatus: p.status === 'SUCCESS' ? 'Paid' : p.status === 'REFUNDED' ? 'Refunded' : p.status === 'FAILED' ? 'Failed' : 'Pending',
        transactionDate: new Date(p.paidAt || p.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
        iconType: p.packageName?.toLowerCase().includes('kerala') ? 'palm' : p.status === 'PENDING' ? 'hourglass' : 'mountain',
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Get single transaction details
   */
  static async getTransactionById(agencyId: string, transactionIdOrPaymentId: string) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const payment = await PaymentModel.findOne({
      agencyId: aid,
      $or: [
        { paymentId: transactionIdOrPaymentId },
        ...(mongoose.Types.ObjectId.isValid(transactionIdOrPaymentId)
          ? [{ _id: new mongoose.Types.ObjectId(transactionIdOrPaymentId) }]
          : []),
      ],
      isDeleted: false,
    }).lean();

    if (!payment) throw new Error('Transaction not found');
    return payment;
  }

  /**
   * Request immediate payout settlement
   */
  static async requestPayout(agencyId: string, amount: number) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const agency = await AgencyModel.findById(aid);
    if (!agency) throw new Error('Agency not found');

    const payoutRequest = {
      payoutId: `PO-${Date.now()}`,
      agencyId: aid,
      amount,
      status: 'Processing',
      bankAccount: 'HDFC Bank ****1234',
      requestedAt: new Date(),
    };

    return payoutRequest;
  }
}
