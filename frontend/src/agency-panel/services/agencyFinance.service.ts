import { agencyApiClient } from './agencyApiClient';
import {
  CompleteFinanceData,
  TransactionItem,
} from '../data/finance';

export interface GetTransactionsParams {
  page?: number;
  limit?: number;
  paymentStatus?: string;
  paymentMethod?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface TransactionsResponse {
  transactions: TransactionItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class AgencyFinanceService {
  /**
   * Fetch complete finance command center overview & metrics
   */
  static async getFinanceOverview(): Promise<CompleteFinanceData> {
    const response = await agencyApiClient.get<CompleteFinanceData>('/agency/finance');
    if (!response.data) throw new Error(response.message || 'Failed to fetch finance overview');
    return response.data;
  }

  /**
   * Fetch filtered transactions
   */
  static async getTransactions(params: GetTransactionsParams = {}): Promise<TransactionsResponse> {
    const queryParams: Record<string, any> = {};
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.paymentStatus) queryParams.paymentStatus = params.paymentStatus;
    if (params.paymentMethod) queryParams.paymentMethod = params.paymentMethod;
    if (params.search) queryParams.search = params.search;
    if (params.startDate) queryParams.startDate = params.startDate;
    if (params.endDate) queryParams.endDate = params.endDate;

    const response = await agencyApiClient.get<TransactionsResponse>('/agency/finance/transactions', { params: queryParams });
    if (!response.data) throw new Error(response.message || 'Failed to fetch transactions');
    return response.data;
  }

  /**
   * Get single transaction details
   */
  static async getTransactionById(transactionId: string): Promise<any> {
    const response = await agencyApiClient.get(`/agency/finance/transactions/${transactionId}`);
    if (!response.data) throw new Error(response.message || 'Failed to fetch transaction details');
    return response.data;
  }

  /**
   * Request payout settlement
   */
  static async requestPayout(amount: number): Promise<any> {
    const response = await agencyApiClient.post('/agency/finance/request-payout', { amount });
    if (!response.data) throw new Error(response.message || 'Failed to request payout');
    return response.data;
  }

  /**
   * Fetch Seller Payment Profile (Masked)
   */
  static async getPaymentProfile(sellerType: string = 'Agency'): Promise<any> {
    const response = await agencyApiClient.get('/agency/payment-profile', { params: { sellerType } });
    return response.data;
  }

  /**
   * Submit Payout Account Details (IFSC & Bank Account)
   */
  static async submitPaymentProfile(data: any): Promise<any> {
    const response = await agencyApiClient.post('/agency/payment-profile', data);
    return response.data;
  }

  /**
   * Skip Payment Setup For Now
   */
  static async skipPaymentProfile(sellerType: string = 'Agency'): Promise<any> {
    const response = await agencyApiClient.post('/agency/payment-profile/skip', { sellerType });
    return response.data;
  }

  /**
   * Lookup Bank & Branch by IFSC
   */
  static async lookupIFSC(code: string): Promise<any> {
    const response = await agencyApiClient.get(`/agency/payment-profile/ifsc/${code.toUpperCase().trim()}`);
    return response.data;
  }

  /**
   * Fetch Razorpay Route Marketplace Settlements (Phase 11 Dashboard)
   */
  static async getSettlementDashboard(params: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<any> {
    const response = await agencyApiClient.get('/agency/settlements', { params });
    return response.data;
  }

  /**
   * Save Step Draft for Multi-step Wizard
   */
  static async saveDraftStep(step: number, data: any): Promise<any> {
    const response = await agencyApiClient.post('/agency/payment-profile/draft', { step, ...data });
    return response.data;
  }

  /**
   * Request Payout Account Replacement (Controlled workflow when bank is locked)
   */
  static async requestAccountReplacement(data: any): Promise<any> {
    const response = await agencyApiClient.post('/agency/payment-profile/replace-request', data);
    return response.data;
  }

  /**
   * Retry Route Entity Provisioning
   */
  static async retryProvisioning(): Promise<any> {
    const response = await agencyApiClient.post('/agency/payment-profile/retry', {});
    return response.data;
  }
}

export const agencyFinanceService = AgencyFinanceService;
