import { agencyApiClient } from './agencyApiClient';
import { Customer, AgencyNoteItem } from '../data/customers';

export interface GetCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  statusFilter?: string;
  typeFilter?: string;
  activeChip?: string;
}

export interface CustomerStatsResponse {
  totalCustomers: number;
  vipCustomers: number;
  repeatBookingRate: string;
  avgLifetimeValue: string;
}

export interface CustomersListResponse {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class AgencyCustomersService {
  /**
   * Fetch all agency customers with filters and pagination
   */
  static async getCustomers(params: GetCustomersParams = {}): Promise<CustomersListResponse> {
    const queryParams: Record<string, any> = {};
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.search) queryParams.search = params.search;
    if (params.statusFilter) queryParams.statusFilter = params.statusFilter;
    if (params.typeFilter) queryParams.typeFilter = params.typeFilter;
    if (params.activeChip) queryParams.activeChip = params.activeChip;

    const response = await agencyApiClient.get<CustomersListResponse>('/agency/customers', { params: queryParams });
    if (!response.data) throw new Error(response.message || 'Failed to fetch customers');
    return response.data;
  }

  /**
   * Fetch CRM KPIs
   */
  static async getStats(): Promise<CustomerStatsResponse> {
    const response = await agencyApiClient.get<CustomerStatsResponse>('/agency/customers/stats');
    if (!response.data) throw new Error(response.message || 'Failed to fetch customer stats');
    return response.data;
  }

  /**
   * Get single customer dossier by ID or email
   */
  static async getCustomerById(customerId: string): Promise<Customer> {
    const response = await agencyApiClient.get<Customer>(`/agency/customers/${customerId}`);
    if (!response.data) throw new Error(response.message || 'Failed to fetch customer dossier');
    return response.data;
  }

  /**
   * Add private note for customer
   */
  static async addNote(customerId: string, noteText: string): Promise<AgencyNoteItem> {
    const response = await agencyApiClient.post<AgencyNoteItem>(`/agency/customers/${customerId}/notes`, { noteText });
    if (!response.data) throw new Error(response.message || 'Failed to add note');
    return response.data;
  }

  /**
   * Edit private note
   */
  static async editNote(customerId: string, noteId: string, noteText: string): Promise<AgencyNoteItem[]> {
    const response = await agencyApiClient.put<AgencyNoteItem[]>(`/agency/customers/${customerId}/notes/${noteId}`, { noteText });
    if (!response.data) throw new Error(response.message || 'Failed to edit note');
    return response.data;
  }

  /**
   * Delete private note
   */
  static async deleteNote(customerId: string, noteId: string): Promise<any> {
    const response = await agencyApiClient.delete(`/agency/customers/${customerId}/notes/${noteId}`);
    return response.data;
  }
}

export const agencyCustomersService = AgencyCustomersService;
