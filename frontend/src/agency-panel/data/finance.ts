// ─── Agency Finance Data Model & Mock Data ──────────────────────────────────────

export interface FinancialMetric {
  id: string;
  title: string;
  amount: number;
  formattedAmount: string;
  growth: string;
  isPositive: boolean;
  type: 'revenue' | 'balance' | 'settlement' | 'refunds' | 'commission' | 'earnings';
}

export interface RevenueTrendPoint {
  date: string;
  revenue: number;
  bookings: number;
  netProfit: number;
  formattedRevenue: string;
}

export interface PaymentStatusBreakdown {
  status: 'Successful' | 'Pending' | 'Failed' | 'Refunded';
  percentage: number;
  amount: number;
  formattedAmount: string;
  color: string;
}

export interface TransactionItem {
  id: string;
  bookingId: string;
  packageName: string;
  travelerName: string;
  amount: number;
  formattedAmount: string;
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking';
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  transactionDate: string;
  iconType: 'mountain' | 'hourglass' | 'palm';
}

export interface SettlementOverview {
  lastSettlement: {
    amount: number;
    formattedAmount: string;
    date: string;
    status: 'Completed';
  };
  nextSettlement: {
    amount: number;
    formattedAmount: string;
    date: string;
    status: 'Upcoming';
  };
  settlementFrequency: string;
  bankAccountLast4: string;
  bankName: string;
}

export interface RefundRequestItem {
  id: string;
  bookingId: string;
  packageName: string;
  travelerName: string;
  refundAmount: number;
  formattedAmount: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  requestDate: string;
}

export interface TaxInfo {
  gstCollected: number;
  formattedGstCollected: string;
  platformFees: number;
  formattedPlatformFees: string;
  netTaxableRevenue: number;
  formattedNetTaxableRevenue: string;
  gstPercentage: number;
}

export interface CompleteFinanceData {
  summary: FinancialMetric[];
  revenueTrend30D: RevenueTrendPoint[];
  paymentBreakdown: PaymentStatusBreakdown[];
  recentTransactions: TransactionItem[];
  settlement: SettlementOverview;
  refundSummary: {
    approvedCount: number;
    pendingCount: number;
    rejectedCount: number;
    totalCount: number;
    recentRequest: RefundRequestItem;
  };
  taxInfo: TaxInfo;
}

export const MOCK_FINANCE_DATA: CompleteFinanceData = {
  summary: [
    {
      id: 'm1',
      title: 'Total Revenue',
      amount: 1245800,
      formattedAmount: '₹12,45,800',
      growth: '↑ 18.6% vs Apr',
      isPositive: true,
      type: 'revenue',
    },
    {
      id: 'm2',
      title: 'Available Balance',
      amount: 342250,
      formattedAmount: '₹3,42,250',
      growth: '↑ 12.4% vs Apr',
      isPositive: true,
      type: 'balance',
    },
    {
      id: 'm3',
      title: 'Pending Settlement',
      amount: 215600,
      formattedAmount: '₹2,15,600',
      growth: '↑ 7.8% vs Apr',
      isPositive: true,
      type: 'settlement',
    },
    {
      id: 'm4',
      title: 'Total Refunds',
      amount: 48750,
      formattedAmount: '₹48,750',
      growth: '↓ 5.6% vs Apr',
      isPositive: false,
      type: 'refunds',
    },
    {
      id: 'm5',
      title: 'Platform Commission',
      amount: 125480,
      formattedAmount: '₹1,25,480',
      growth: '↑ 10.3% vs Apr',
      isPositive: true,
      type: 'commission',
    },
    {
      id: 'm6',
      title: 'Net Earnings',
      amount: 874670,
      formattedAmount: '₹8,74,670',
      growth: '↑ 16.2% vs Apr',
      isPositive: true,
      type: 'earnings',
    },
  ],
  revenueTrend30D: [
    { date: '1 May', revenue: 35000, bookings: 2, netProfit: 28000, formattedRevenue: '₹35,000' },
    { date: '6 May', revenue: 98000, bookings: 5, netProfit: 78000, formattedRevenue: '₹98,000' },
    { date: '11 May', revenue: 150000, bookings: 8, netProfit: 120000, formattedRevenue: '₹1,50,000' },
    { date: '16 May', revenue: 245800, bookings: 12, netProfit: 196000, formattedRevenue: '₹2,45,800' },
    { date: '21 May', revenue: 110000, bookings: 6, netProfit: 88000, formattedRevenue: '₹1,10,000' },
    { date: '26 May', revenue: 175000, bookings: 9, netProfit: 140000, formattedRevenue: '₹1,75,000' },
    { date: '31 May', revenue: 232000, bookings: 11, netProfit: 185000, formattedRevenue: '₹2,32,000' },
  ],
  paymentBreakdown: [
    { status: 'Successful', percentage: 65, amount: 809770, formattedAmount: '₹8,09,770', color: '#10B981' },
    { status: 'Pending', percentage: 20, amount: 248650, formattedAmount: '₹2,48,650', color: '#F59E0B' },
    { status: 'Failed', percentage: 5, amount: 61250, formattedAmount: '₹61,250', color: '#EF4444' },
    { status: 'Refunded', percentage: 10, amount: 126130, formattedAmount: '₹1,26,130', color: '#3B82F6' },
  ],
  recentTransactions: [
    {
      id: 'tx-101',
      bookingId: '#TRP12345',
      packageName: 'Kashmir Paradise',
      travelerName: 'Aman Verma',
      amount: 24800,
      formattedAmount: '₹24,800',
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      transactionDate: 'Today, 09:30 AM',
      iconType: 'mountain',
    },
    {
      id: 'tx-102',
      bookingId: '#TRP12344',
      packageName: 'Spiti Valley Adventure',
      travelerName: 'Neha Singh',
      amount: 18600,
      formattedAmount: '₹18,600',
      paymentMethod: 'Credit Card',
      paymentStatus: 'Pending',
      transactionDate: 'Today, 08:15 AM',
      iconType: 'hourglass',
    },
    {
      id: 'tx-103',
      bookingId: '#TRP12343',
      packageName: 'Kerala Backwaters',
      travelerName: 'Rohit Sharma',
      amount: 15200,
      formattedAmount: '₹15,200',
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      transactionDate: 'Yesterday, 07:45 PM',
      iconType: 'palm',
    },
    {
      id: 'tx-104',
      bookingId: '#TRP12342',
      packageName: 'Leh Ladakh Expedition',
      travelerName: 'Priya Patel',
      amount: 22500,
      formattedAmount: '₹22,500',
      paymentMethod: 'Net Banking',
      paymentStatus: 'Failed',
      transactionDate: 'Yesterday, 05:20 PM',
      iconType: 'mountain',
    },
  ],
  settlement: {
    lastSettlement: {
      amount: 285600,
      formattedAmount: '₹2,85,600',
      date: '28 May 2025',
      status: 'Completed',
    },
    nextSettlement: {
      amount: 215600,
      formattedAmount: '₹2,15,600',
      date: '04 Jun 2025',
      status: 'Upcoming',
    },
    settlementFrequency: 'Weekly',
    bankAccountLast4: '1234',
    bankName: 'HDFC Bank',
  },
  refundSummary: {
    approvedCount: 12,
    pendingCount: 7,
    rejectedCount: 3,
    totalCount: 22,
    recentRequest: {
      id: 'rf-501',
      bookingId: '#TRP12341',
      packageName: 'Himachal Explorer',
      travelerName: 'Vikram Joshi',
      refundAmount: 12400,
      formattedAmount: '₹12,400',
      reason: 'Trip Cancelled by Traveler',
      status: 'Pending',
      requestDate: '29 May 2025',
    },
  },
  taxInfo: {
    gstCollected: 112450,
    formattedGstCollected: '₹1,12,450',
    platformFees: 125480,
    formattedPlatformFees: '₹1,25,480',
    netTaxableRevenue: 1007870,
    formattedNetTaxableRevenue: '₹10,07,870',
    gstPercentage: 18,
  },
};
