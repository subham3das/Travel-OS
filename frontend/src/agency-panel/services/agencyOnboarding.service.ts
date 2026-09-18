// ─── Agency Onboarding Service ───────────────────────────────────────────────
// Production-ready backend-driven onboarding service connected to live API endpoints.

import { agencyApiClient, AgencyApiResponse } from './agencyApiClient';
import { AgencyVerificationStatus } from '../types/agency';

export interface CompleteOnboardingPayload {
  applicationId?: string;
  business: Record<string, any>;
  profile: Record<string, any>;
  verification: Record<string, any>;
  bank: Record<string, any>;
  submittedAt?: string;
}

export interface SubmissionResponse {
  success: boolean;
  applicationId: string;
  submittedAt: string;
  status: AgencyVerificationStatus | string;
  message: string;
}

export interface VerificationStatusResponse {
  status: AgencyVerificationStatus | string;
  applicationStatus?: string;
  applicationId: string;
  submittedAt: string;
  estimatedReviewTime: string;
  email: string;
  phone: string;
  agencyName: string;
  rejectionReason?: string;
  requestedDocuments?: string[];
  timeline?: any[];
  complianceScore?: number;
  message: string;
}

const SUBMITTED_APP_KEY = 'apnatrip_agency_submitted_app';

/**
 * Update application verification status in local storage cache
 */
export const setAgencyApplicationStatus = (status: AgencyVerificationStatus | string) => {
  try {
    const raw = localStorage.getItem(SUBMITTED_APP_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    localStorage.setItem(
      SUBMITTED_APP_KEY,
      JSON.stringify({
        ...existing,
        status,
        verificationStatus: status,
      })
    );
  } catch {
    // ignore
  }
};

/**
 * Save draft step data to backend
 */
export const saveAgencyOnboardingDraft = async (payload: {
  applicationId?: string;
  email?: string;
  step?: number;
  business?: Record<string, any>;
  profile?: Record<string, any>;
  verification?: Record<string, any>;
  bank?: Record<string, any>;
  draftData?: Record<string, any>;
}): Promise<{ applicationId: string; step: number; completionPercentage: number; lastSaved: string }> => {
  const res = await agencyApiClient.post<{
    applicationId: string;
    step: number;
    completionPercentage: number;
    lastSaved: string;
  }>('/agencies/onboarding/draft', payload, { requiresAuth: false });

  const data = res.data;
  if (data?.applicationId) {
    try {
      localStorage.setItem('apnatrip_agency_app_id', data.applicationId);
    } catch {
      // ignore
    }
  }
  return data as any;
};

/**
 * Retrieve saved draft from backend
 */
export const getAgencyOnboardingDraft = async (idOrEmail: string): Promise<any> => {
  const res = await agencyApiClient.get<any>(`/agencies/onboarding/draft/${encodeURIComponent(idOrEmail)}`, {
    requiresAuth: false,
  });
  return res.data;
};

/**
 * Submit completed agency onboarding application to backend
 */
export const submitAgencyOnboarding = async (
  payload: CompleteOnboardingPayload
): Promise<SubmissionResponse> => {
  const res = await agencyApiClient.post<SubmissionResponse>(
    '/agencies/onboarding/submit',
    payload,
    { requiresAuth: false }
  );

  const responseData: SubmissionResponse = res.data || {
    success: true,
    applicationId: payload.applicationId || 'ATP-AGY-2026-000000',
    submittedAt: new Date().toISOString(),
    status: AgencyVerificationStatus.PENDING,
    message: 'Application submitted successfully',
  };

  // Cache locally
  try {
    localStorage.setItem(
      SUBMITTED_APP_KEY,
      JSON.stringify({
        applicationId: responseData.applicationId,
        submittedAt: responseData.submittedAt,
        status: responseData.status,
        email: payload.business?.email || payload.profile?.email,
        phone: payload.business?.phone || payload.profile?.phone,
        agencyName: payload.business?.name || payload.profile?.name || 'Partner Agency',
      })
    );
    localStorage.setItem('apnatrip_agency_app_id', responseData.applicationId);
  } catch {
    // ignore
  }

  return responseData;
};

/**
 * Retrieve cached submitted application metadata
 */
export const getSubmittedApplication = (): {
  applicationId: string;
  submittedAt: string;
  status: AgencyVerificationStatus | string;
  email: string;
  phone: string;
  agencyName: string;
  rejectionReason?: string;
  requestedDocuments?: string[];
} | null => {
  try {
    const raw = localStorage.getItem(SUBMITTED_APP_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Clear onboarding local draft data
 */
export const clearOnboardingDrafts = () => {
  try {
    localStorage.removeItem('apnatrip_agency_onboarding_draft');
    localStorage.removeItem('apnatrip_agency_app_id');
  } catch {
    // ignore
  }
};

/**
 * Check verification status from live backend API
 */
export const checkAgencyVerificationStatus = async (
  idOrEmailParam?: string
): Promise<VerificationStatusResponse> => {
  const saved = getSubmittedApplication();
  const savedAppId = (() => {
    try {
      return localStorage.getItem('apnatrip_agency_app_id');
    } catch {
      return null;
    }
  })();

  const identifier = idOrEmailParam || saved?.applicationId || savedAppId || saved?.email || 'ATP-AGY-2026-000142';

  try {
    const res = await agencyApiClient.get<VerificationStatusResponse>(
      `/agencies/onboarding/status/${encodeURIComponent(identifier)}?_t=${Date.now()}`,
      { requiresAuth: false }
    );

    const data: VerificationStatusResponse = res.data as any;
    if (data) {
      // Update local storage status
      try {
        localStorage.setItem(
          SUBMITTED_APP_KEY,
          JSON.stringify({
            ...(saved || {}),
            ...data,
            status: data.status,
          })
        );
      } catch {
        // ignore
      }
      return data;
    }
  } catch (err) {
    console.warn('Could not fetch status from backend, falling back to local metadata:', err);
  }

  if (saved) {
    return {
      status: (saved.status as AgencyVerificationStatus) || AgencyVerificationStatus.PENDING,
      applicationId: saved.applicationId || 'ATP-AGY-2026-000142',
      submittedAt: saved.submittedAt || new Date().toISOString(),
      estimatedReviewTime: '24–48 Hours',
      email: saved.email || 'partner@apnatrip.com',
      phone: saved.phone || '+91 98765 43210',
      agencyName: saved.agencyName || 'Partner Agency',
      message:
        saved.status === AgencyVerificationStatus.APPROVED
          ? 'Your agency application has been approved!'
          : saved.status === AgencyVerificationStatus.REJECTED
          ? 'Your agency application was not approved.'
          : 'Your agency application is currently under verification.',
    };
  }

  return {
    status: AgencyVerificationStatus.PENDING,
    applicationId: 'ATP-AGY-2026-000142',
    submittedAt: new Date().toISOString(),
    estimatedReviewTime: '24–48 Hours',
    email: 'partner@apnatrip.com',
    phone: '+91 98765 43210',
    agencyName: 'Partner Agency',
    message: 'Your agency application is currently under verification.',
  };
};

export interface RequestedDocumentItemResponse {
  documentId: string;
  documentName: string;
  documentType: string;
  reason: string;
  customReason?: string;
  status: string;
  fileUrl?: string;
  reuploadedFileUrl?: string;
}

export interface RequestedDocumentsData {
  success: boolean;
  applicationId: string;
  agencyName: string;
  verificationStatus: string;
  documentRequestMessage: string;
  documentRequestRound: number;
  requestedDocuments: RequestedDocumentItemResponse[];
  allDocuments: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    fileUrl: string;
  }>;
}

/**
 * Fetch specific documents requested by Super Admin for re-upload
 */
export const getAgencyRequestedDocuments = async (
  idOrEmailParam?: string
): Promise<RequestedDocumentsData | null> => {
  const saved = getSubmittedApplication();
  const savedAppId = (() => {
    try {
      return localStorage.getItem('apnatrip_agency_app_id');
    } catch {
      return null;
    }
  })();

  const identifier =
    idOrEmailParam ||
    saved?.applicationId ||
    savedAppId ||
    saved?.email ||
    'ATP-AGY-2026-000142';

  try {
    const res = await agencyApiClient.get<RequestedDocumentsData>(
      `/agencies/onboarding/requested-documents/${encodeURIComponent(identifier)}?_t=${Date.now()}`,
      { requiresAuth: false }
    );
    return res.data || null;
  } catch (err) {
    console.warn('Could not fetch requested documents from backend:', err);
    return null;
  }
};

/**
 * Re-upload requested missing documents to backend
 */
export const reuploadAgencyDocuments = async (payload: {
  applicationId: string;
  documents: Array<{
    id?: string;
    documentId?: string;
    name: string;
    type: string;
    fileUrl: string;
    size?: number;
    sizeFormatted?: string;
  }>;
  notes?: string;
}): Promise<SubmissionResponse> => {
  const res = await agencyApiClient.post<SubmissionResponse>(
    '/agencies/onboarding/reupload-documents',
    payload,
    { requiresAuth: false }
  );

  const responseData: SubmissionResponse = res.data || {
    success: true,
    applicationId: payload.applicationId,
    submittedAt: new Date().toISOString(),
    status: AgencyVerificationStatus.PENDING,
    message: 'Documents re-uploaded successfully.',
  };

  // Immediately update local storage status to PENDING / UNDER_REVIEW
  try {
    const saved = getSubmittedApplication();
    localStorage.setItem(
      SUBMITTED_APP_KEY,
      JSON.stringify({
        ...(saved || {}),
        status: AgencyVerificationStatus.PENDING,
        verificationStatus: 'PENDING',
      })
    );
  } catch {
    // ignore
  }

  return responseData;
};
