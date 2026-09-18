import {
  AdminPaymentItem,
  PaymentKPIStats,
  PaymentFilters,
  PaymentSortConfig,
} from '../types/paymentManagement';
import { adminApiClient } from './adminApiClient';

export const initialPaymentKPIStats: PaymentKPIStats = {
  totalTransactions: { count: 0, growth: '0%', isPositive: true },
  todayRevenue: { value: '₹0', growth: '0%', isPositive: true, comparison: 'from yesterday' },
  pendingSettlements: { value: '₹0', growth: '0%', isPositive: true },
  successfulPayments: { count: 0, growth: '0%', isPositive: true },
  failedPayments: { count: 0, growth: '0%', isPositive: false },
  completedRefunds: { count: 0, growth: '0%', isPositive: true },
  platformCommission: { value: '₹0', growth: '0%', isPositive: true },
};

class AdminPaymentManagementService {
  /**
   * 1. Live KPI Telemetry from MongoDB
   */
  public async getKPIStats(): Promise<PaymentKPIStats> {
    try {
      const res = await adminApiClient.get<PaymentKPIStats>('/admin/payments/stats');
      return res.data || initialPaymentKPIStats;
    } catch {
      return initialPaymentKPIStats;
    }
  }

  /**
   * 2. Live Paginated Payments from MongoDB
   */
  public async getPayments(
    filters?: Partial<PaymentFilters>,
    sort?: PaymentSortConfig,
    pagination?: { page: number; limit: number }
  ): Promise<AdminPaymentItem[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      page: pagination?.page || 1,
      limit: pagination?.limit || 100,
      search: filters?.search || undefined,
      paymentStatus: filters?.paymentStatus && filters.paymentStatus !== 'All Status' && filters.paymentStatus !== 'All' ? filters.paymentStatus : undefined,
      settlementStatus: filters?.settlementStatus && filters.settlementStatus !== 'All Settlements' && filters.settlementStatus !== '—' ? filters.settlementStatus : undefined,
      gateway: filters?.gateway && filters.gateway !== 'All Gateways' && filters.gateway !== 'All' ? filters.gateway : undefined,
      paymentMethod: filters?.paymentMethod && filters.paymentMethod !== 'All Methods' && filters.paymentMethod !== 'All' ? filters.paymentMethod : undefined,
      agency: filters?.agency && filters.agency !== 'All Agencies' && filters.agency !== 'All' ? filters.agency : undefined,
      destination: filters?.destination && filters.destination !== 'All Destinations' && filters.destination !== 'All' ? filters.destination : undefined,
      sortBy: sort?.key || 'createdAt',
      sortOrder: sort?.direction || 'desc',
    };

    const res = await adminApiClient.get<{ payments: AdminPaymentItem[]; pagination: any }>('/admin/payments', {
      params,
    });

    return res.data?.payments || [];
  }

  /**
   * 3. Single Payment Detail
   */
  public async getPaymentById(id: string): Promise<AdminPaymentItem | null> {
    const res = await adminApiClient.get<AdminPaymentItem>(`/admin/payments/${id}`);
    return res.data || null;
  }

  /**
   * 4. Process Refund
   */
  public async refundPayment(id: string, amount?: number, reason?: string): Promise<boolean> {
    const res = await adminApiClient.post(`/admin/payments/${id}/refund`, {
      refundAmount: amount,
      reason: reason || 'Admin Initiated Refund',
    });
    return res.success;
  }

  public async processRefund(id: string, reason?: string): Promise<boolean> {
    return this.refundPayment(id, undefined, reason);
  }

  /**
   * 5. Approve Settlement
   */
  public async approveSettlement(id: string): Promise<boolean> {
    const res = await adminApiClient.post('/admin/payments/bulk-action', {
      paymentIds: [id],
      action: 'settle',
    });
    return res.success;
  }

  public async settlePayment(id: string): Promise<boolean> {
    return this.approveSettlement(id);
  }

  /**
   * 6. Retry / Reconcile Payment
   */
  public async retryPayment(id: string): Promise<boolean> {
    const res = await adminApiClient.post('/admin/payments/bulk-action', {
      paymentIds: [id],
      action: 'reconcile',
    });
    return res.success;
  }

  /**
   * 7. Bulk Actions
   */
  public async bulkSettle(ids: string[]): Promise<boolean> {
    const res = await adminApiClient.post('/admin/payments/bulk-action', {
      paymentIds: ids,
      action: 'settle',
    });
    return res.success;
  }

  public async bulkRefund(ids: string[]): Promise<boolean> {
    const res = await adminApiClient.post('/admin/payments/bulk-action', {
      paymentIds: ids,
      action: 'refund',
    });
    return res.success;
  }
}

export const adminPaymentManagementService = new AdminPaymentManagementService();
