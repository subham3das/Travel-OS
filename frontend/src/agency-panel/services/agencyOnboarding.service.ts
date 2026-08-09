// ─── Agency Onboarding Service ───────────────────────────────────────────────
// Handles agency onboarding application payload submission, verification status, and state clearing.

import { AgencyVerificationStatus } from '../types/agency';

export interface CompleteOnboardingPayload {
  business: Record<string, any>;
  profile: Record<string, any>;
  verification: Record<string, any>;
  bank: Record<string, any>;
  submittedAt: string;
}

export interface SubmissionResponse {
  success: boolean;
  applicationId: string;
  submittedAt: string;
  status: AgencyVerificationStatus;
  message: string;
}

export interface VerificationStatusResponse {
  status: AgencyVerificationStatus;
  applicationId: string;
  submittedAt: string;
  estimatedReviewTime: string;
  email: string;
  phone: string;
  agencyName: string;
  message: string;
}

const SUBMITTED_APP_KEY = 'apnatrip_agency_submitted_app';

/**
 * Update application verification status in local storage service.
 */
export const setAgencyApplicationStatus = (status: AgencyVerificationStatus) => {
  try {
    const existing = getSubmittedApplication() || {
      applicationId: 'ATP-AGY-2026-000142',
      submittedAt: new Date().toISOString(),
      email: 'partner@apnatrip.com',
      phone: '+91 98765 43210',
      agencyName: 'Partner Agency',
    };

    localStorage.setItem(
      SUBMITTED_APP_KEY,
      JSON.stringify({
        ...existing,
        status,
        updatedAt: new Date().toISOString(),
      })
    );

    // Also update auth context saved agency if present
    const authRaw = localStorage.getItem('apnatrip_agency_auth');
    if (authRaw) {
      const parsed = JSON.parse(authRaw);
      if (parsed.agency) {
        parsed.agency.verificationStatus = status;
        localStorage.setItem('apnatrip_agency_auth', JSON.stringify(parsed));
      }
    }
  } catch (e) {
    // ignore
  }
};

/**
 * Submit agency onboarding application payload to backend / API service layer.
 * Sets application status to AgencyVerificationStatus.UNDER_REVIEW.
 */
export const submitAgencyOnboarding = async (
  payload: CompleteOnboardingPayload
): Promise<SubmissionResponse> => {
  // Simulate API network request delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const applicationId = `ATP-AGY-2026-${randomNum}`;
  const submittedAt = new Date().toISOString();

  const responseData: SubmissionResponse = {
    success: true,
    applicationId,
    submittedAt,
    status: AgencyVerificationStatus.UNDER_REVIEW,
    message: 'Agency onboarding application submitted successfully.',
  };

  // Persist submission record locally
  try {
    localStorage.setItem(
      SUBMITTED_APP_KEY,
      JSON.stringify({
        ...responseData,
        email: payload.profile?.email || payload.business?.email || 'partner@apnatrip.com',
        phone: payload.profile?.phone || payload.business?.phone || '+91 98765 43210',
        agencyName: payload.business?.agencyDisplayName || payload.business?.legalBusinessName || 'Partner Agency',
      })
    );
  } catch (e) {
    // ignore
  }

  return responseData;
};

/**
 * Fetch current agency verification status from backend service.
 */
export const checkAgencyVerificationStatus = async (): Promise<VerificationStatusResponse> => {
  // Simulate API network request delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const saved = getSubmittedApplication();

  if (!saved) {
    return {
      status: AgencyVerificationStatus.APPROVED,
      applicationId: 'ATP-AGY-2026-000142',
      submittedAt: new Date().toISOString(),
      estimatedReviewTime: '24–48 Hours',
      email: 'partner@apnatrip.com',
      phone: '+91 98765 43210',
      agencyName: 'Partner Agency',
      message: 'Your agency application has been approved!',
    };
  }

  return {
    status: (saved.status as AgencyVerificationStatus) || AgencyVerificationStatus.APPROVED,
    applicationId: saved.applicationId || 'ATP-AGY-2026-000142',
    submittedAt: saved.submittedAt || new Date().toISOString(),
    estimatedReviewTime: '24–48 Hours',
    email: saved.email || 'partner@apnatrip.com',
    phone: saved.phone || '+91 98765 43210',
    agencyName: saved.agencyName || 'Partner Agency',
    message:
      saved.status === AgencyVerificationStatus.APPROVED
        ? 'Your agency application has been approved!'
        : 'Your agency application is currently under verification.',
  };
};

/**
 * Clear all onboarding draft keys from local storage upon successful submission.
 */
export const clearOnboardingDrafts = () => {
  try {
    localStorage.removeItem('apnatrip_agency_onboarding_business');
    localStorage.removeItem('apnatrip_agency_onboarding_profile');
    localStorage.removeItem('apnatrip_agency_onboarding_verification');
    localStorage.removeItem('apnatrip_agency_onboarding_bank');
  } catch (e) {
    // ignore
  }
};

/**
 * Fetch submitted application status metadata.
 */
export const getSubmittedApplication = () => {
  try {
    const saved = localStorage.getItem(SUBMITTED_APP_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // ignore
  }
  return null;
};

// Set status to APPROVED immediately as requested
setAgencyApplicationStatus(AgencyVerificationStatus.APPROVED);
