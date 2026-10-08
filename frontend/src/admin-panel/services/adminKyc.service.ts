import { adminApiClient } from './adminApiClient';
import { UserKycDetailsResponse } from '../types/userKyc';

export class AdminKycService {
  /**
   * Fetch full KYC verification data and membership details for user
   */
  public async getKycAndMembership(userId: string): Promise<UserKycDetailsResponse> {
    const res = await adminApiClient.get<UserKycDetailsResponse>(`/admin/users/${userId}/kyc`);
    return res.data!;
  }

  /**
   * Approve KYC verification
   */
  public async approveKyc(userId: string, notes?: string): Promise<UserKycDetailsResponse> {
    const res = await adminApiClient.post<UserKycDetailsResponse>(
      `/admin/users/${userId}/kyc/approve`,
      { notes }
    );
    return res.data!;
  }

  /**
   * Reject KYC verification
   */
  public async rejectKyc(
    userId: string,
    reason: string,
    internalNote?: string,
    sendNotification: boolean = true
  ): Promise<UserKycDetailsResponse> {
    const res = await adminApiClient.post<UserKycDetailsResponse>(
      `/admin/users/${userId}/kyc/reject`,
      {
        reason,
        internalNote,
        sendNotification,
      }
    );
    return res.data!;
  }

  /**
   * Request re-upload of documents
   */
  public async requestReupload(
    userId: string,
    reason: string,
    internalNote?: string
  ): Promise<UserKycDetailsResponse> {
    const res = await adminApiClient.post<UserKycDetailsResponse>(
      `/admin/users/${userId}/kyc/request-reupload`,
      {
        reason,
        internalNote,
      }
    );
    return res.data!;
  }

  /**
   * Revoke KYC verification
   */
  public async revokeKyc(userId: string, reason: string): Promise<UserKycDetailsResponse> {
    const res = await adminApiClient.post<UserKycDetailsResponse>(
      `/admin/users/${userId}/kyc/revoke`,
      { reason }
    );
    return res.data!;
  }

  /**
   * Renew KYC verification
   */
  public async renewKyc(userId: string): Promise<UserKycDetailsResponse> {
    const res = await adminApiClient.post<UserKycDetailsResponse>(
      `/admin/users/${userId}/kyc/renew`,
      {}
    );
    return res.data!;
  }

  /**
   * Unsuspend KYC status
   */
  public async unsuspendKyc(userId: string): Promise<UserKycDetailsResponse> {
    const res = await adminApiClient.post<UserKycDetailsResponse>(
      `/admin/users/${userId}/kyc/unsuspend`,
      {}
    );
    return res.data!;
  }

  /**
   * Approve individual KYC document
   */
  public async approveDocument(userId: string, docId: string): Promise<UserKycDetailsResponse> {
    const res = await adminApiClient.post<UserKycDetailsResponse>(
      `/admin/users/${userId}/kyc/documents/${docId}/approve`,
      {}
    );
    return res.data!;
  }

  /**
   * Reject individual KYC document
   */
  public async rejectDocument(
    userId: string,
    docId: string,
    reason: string
  ): Promise<UserKycDetailsResponse> {
    const res = await adminApiClient.post<UserKycDetailsResponse>(
      `/admin/users/${userId}/kyc/documents/${docId}/reject`,
      { reason }
    );
    return res.data!;
  }

  /**
   * Request re-upload of individual KYC document
   */
  public async requestDocumentReupload(
    userId: string,
    docId: string,
    reason: string
  ): Promise<UserKycDetailsResponse> {
    const res = await adminApiClient.post<UserKycDetailsResponse>(
      `/admin/users/${userId}/kyc/documents/${docId}/request-reupload`,
      { reason }
    );
    return res.data!;
  }
}

export const adminKycService = new AdminKycService();
