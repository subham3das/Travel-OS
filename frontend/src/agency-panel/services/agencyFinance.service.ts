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
}

export const agencyFinanceService = AgencyFinanceService;
