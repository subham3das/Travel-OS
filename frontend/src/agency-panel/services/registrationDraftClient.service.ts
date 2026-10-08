import { agencyApiClient, AgencyApiResponse } from './agencyApiClient';

export interface SaveRegistrationDraftPayload {
  draftId?: string;
  userId?: string;
  serviceType: 'agency' | 'car_rental';
  businessDetails?: Record<string, any>;
  profileDetails?: Record<string, any>;
  documents?: any[];
  bank?: Record<string, any>;
  currentStep?: number;
  coupon?: any;
}

export interface RegistrationDraftData {
  draftId: string;
  serviceType: 'agency' | 'car_rental';
  currentStep: number;
  businessDetails: Record<string, any>;
  profileDetails: Record<string, any>;
  documents: any[];
  bank: Record<string, any>;
  coupon?: any;
  paymentPending: boolean;
  lastSaved: string;
}

export interface SubmitRegistrationPayload {
  draftId: string;
  subscriptionId: string;
  paymentId: string;
  orderId?: string;
}

export interface SubmitRegistrationResponse {
  success: boolean;
  referenceNumber: string;
  applicationId: string;
  serviceType: string;
  businessName: string;
  email: string;
  paymentId: string;
  amountPaid: number;
  invoiceNumber?: string;
  status: string;
  message: string;
  estimatedReviewTime: string;
}

const ACTIVE_DRAFT_KEY = 'apnatrip_active_registration_draft_id';

class RegistrationDraftClientService {
  /**
   * Get active local draft ID cache
   */
  public getStoredDraftId(): string | null {
    try {
      return localStorage.getItem(ACTIVE_DRAFT_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Set active local draft ID cache
   */
  public setStoredDraftId(draftId: string): void {
    try {
      localStorage.setItem(ACTIVE_DRAFT_KEY, draftId);
    } catch {
      // ignore
    }
  }

  /**
   * Clear active local draft ID cache
   */
  public clearStoredDraftId(): void {
    try {
      localStorage.removeItem(ACTIVE_DRAFT_KEY);
    } catch {
      // ignore
    }
  }

  /**
   * Save or update ongoing registration draft in MongoDB
   */
  public async saveDraft(payload: SaveRegistrationDraftPayload): Promise<{
    draftId: string;
    serviceType: string;
    currentStep: number;
    lastSaved: string;
  }> {
    const activeDraftId = payload.draftId || this.getStoredDraftId() || undefined;

    const res = await agencyApiClient.post<any>(
      '/registration/draft',
      {
        ...payload,
        draftId: activeDraftId,
      },
      { requiresAuth: false }
    );

    const data = res.data;
    if (data?.draftId) {
      this.setStoredDraftId(data.draftId);
    }

    return data as any;
  }

  /**
   * Retrieve active draft from MongoDB by draftId or email
   */
  public async getDraft(draftIdOrEmail?: string): Promise<RegistrationDraftData | null> {
    const identifier = draftIdOrEmail || this.getStoredDraftId();
    if (!identifier) return null;

    try {
      const res = await agencyApiClient.get<RegistrationDraftData>('/registration/draft', {
        requiresAuth: false,
        params: { draftId: identifier },
      });

      if (res.data?.draftId) {
        this.setStoredDraftId(res.data.draftId);
      }

      return res.data || null;
    } catch (err) {
      console.warn('Could not fetch registration draft:', err);
      return null;
    }
  }

  /**
   * Execute transactional post-payment submission into MongoDB approval queue
   */
  public async submitRegistration(payload: SubmitRegistrationPayload): Promise<SubmitRegistrationResponse> {
    const res = await agencyApiClient.post<SubmitRegistrationResponse>(
      '/registration/submit',
      payload,
      { requiresAuth: false }
    );

    if (res.data?.success) {
      this.clearStoredDraftId();
    }

    return res.data as any;
  }
}

export const registrationDraftClient = new RegistrationDraftClientService();
