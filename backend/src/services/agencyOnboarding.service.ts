import mongoose from 'mongoose';
import { AgencyModel, IAgencyDocumentItem, IVerificationChecklistItem, ITimelineEvent } from '../models/agency.model.js';
import { AuditLogModel } from '../models/auditLog.model.js';
import { AdminModel } from '../models/admin.model.js';
import { mailService } from './mail.service.js';
import { envConfig } from '../config/env.config.js';
import { logger } from '../config/logger.config.js';
import { BadRequestError, NotFoundError, ConflictError } from '../utils/errors.util.js';
import { NotificationDispatcher } from './notificationDispatcher.service.js';
import {
  AgencySaveDraftInput,
  AgencySubmitOnboardingInput,
  AgencyReuploadDocumentsInput,
} from '../validations/agencyOnboarding.validation.js';

export interface RequestContext {
  ip?: string;
  userAgent?: string;
}

export class AgencyOnboardingService {
  /**
   * Helper to calculate completion percentage across registration sections
   */
  private calculateCompletionPercentage(step: number, business?: any, profile?: any, verification?: any, bank?: any): number {
    let score = 0;
    if (business && business.legalBusinessName && business.email && business.phone && business.city) score += 25;
    if (profile && (profile.tagline || profile.about || profile.logoUrl)) score += 25;
    if (verification && verification.ownerName && verification.ownerEmail && (verification.panCard || verification.registrationCert)) score += 25;
    if (bank && bank.accountNumber && bank.ifscCode) score += 25;
    return Math.min(100, Math.max(score, step * 20));
  }

  /**
   * Auto-save or update in-progress registration draft
   */
  public async saveDraft(payload: AgencySaveDraftInput, context: RequestContext = {}) {
    const email = payload.email || payload.business?.email;
    const applicationId = payload.applicationId;

    let agency: any = null;

    if (applicationId) {
      agency = await AgencyModel.findOne({ applicationId });
    } else if (email) {
      agency = await AgencyModel.findOne({
        email: email.toLowerCase().trim(),
        verificationStatus: { $in: ['PENDING', 'MISSING_DOCS'] },
      });
    }

    const currentStep = payload.step || 1;
    const completionPercentage =
      payload.completionPercentage ||
      this.calculateCompletionPercentage(currentStep, payload.business, payload.profile, payload.verification, payload.bank);

    const generatedAppId =
      agency?.applicationId ||
      applicationId ||
      `ATP-AGY-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const agencyData: Record<string, any> = {
      applicationId: generatedAppId,
      name: payload.business?.agencyDisplayName || payload.business?.legalBusinessName || agency?.name || 'Draft Agency',
      legalBusinessName: payload.business?.legalBusinessName || agency?.legalBusinessName,
      agencyDisplayName: payload.business?.agencyDisplayName || agency?.agencyDisplayName,
      email: (email || agency?.email || `draft_${Date.now()}@apnatrip.com`).toLowerCase().trim(),
      phone: payload.business?.phone || agency?.phone || '+91 00000 00000',
      ownerName: payload.verification?.ownerName || agency?.ownerName || 'Draft Owner',
      businessType: payload.business?.businessType || agency?.businessType,
      yearEstablished: payload.business?.yearEstablished || agency?.yearEstablished,
      registrationNumber: payload.business?.businessRegistrationNumber || agency?.registrationNumber,
      gstNumber: payload.business?.gstNumber || agency?.gstNumber,
      businessAddress: payload.business?.streetAddress || agency?.businessAddress,
      city: payload.business?.city || agency?.city,
      state: payload.business?.state || agency?.state,
      pinCode: payload.business?.pinCode || agency?.pinCode,
      country: payload.business?.country || agency?.country || 'India',
      website: payload.business?.website || agency?.website,
      onboardingStep: currentStep,
      completionPercentage,
      submissionIp: context.ip,
      submissionBrowser: context.userAgent,
      draftData: {
        ...(agency?.draftData || {}),
        ...(payload.draftData || {}),
        business: payload.business || agency?.draftData?.business,
        profile: payload.profile || agency?.draftData?.profile,
        verification: payload.verification || agency?.draftData?.verification,
        bank: payload.bank || agency?.draftData?.bank,
        lastSaved: new Date().toISOString(),
      },
    };

    if (payload.profile) {
      agencyData.profile = {
        ...(agency?.profile || {}),
        ...payload.profile,
      };
      if (payload.profile.logoUrl) agencyData.logo = payload.profile.logoUrl;
      if (payload.profile.coverUrl) agencyData.banner = payload.profile.coverUrl;
    }

    if (payload.verification) {
      agencyData.owner = {
        ...(agency?.owner || {}),
        name: payload.verification.ownerName || agency?.owner?.name,
        email: payload.verification.ownerEmail || agency?.owner?.email,
        phone: payload.verification.ownerPhone || agency?.owner?.phone,
        panNumber: payload.verification.ownerPanNumber || agency?.owner?.panNumber,
        aadhaarNumber: payload.verification.ownerAadhaarNumber || agency?.owner?.aadhaarNumber,
        governmentIdType: payload.verification.governmentIdType || agency?.owner?.governmentIdType,
      };
    }

    if (payload.bank) {
      agencyData.bankDetails = {
        ...(agency?.bankDetails || {}),
        ...payload.bank,
      };
    }

    if (agency) {
      Object.assign(agency, agencyData);
      await agency.save();
    } else {
      agency = await AgencyModel.create({
        ...agencyData,
        verificationStatus: 'PENDING',
        status: 'PENDING',
        complianceScore: 75,
      });
    }

    logger.info('💾 Agency onboarding draft saved: %s (App ID: %s, Step: %d)', agency.email, agency.applicationId, currentStep);

    return {
      applicationId: agency.applicationId,
      step: agency.onboardingStep,
      completionPercentage: agency.completionPercentage,
      lastSaved: new Date().toISOString(),
    };
  }

  /**
   * Retrieve saved draft state
   */
  public async getDraft(idOrEmail: string) {
    const query: any = {
      $or: [
        { applicationId: idOrEmail },
        { email: idOrEmail.toLowerCase().trim() },
      ],
    };

    const agency = await AgencyModel.findOne(query).lean();
    if (!agency) {
      return null;
    }

    return {
      applicationId: agency.applicationId,
      onboardingStep: agency.onboardingStep || 1,
      completionPercentage: agency.completionPercentage || 0,
      business: agency.draftData?.business || {
        legalBusinessName: agency.legalBusinessName,
        agencyDisplayName: agency.agencyDisplayName,
        businessType: agency.businessType,
        yearEstablished: agency.yearEstablished,
        businessRegistrationNumber: agency.registrationNumber,
        gstNumber: agency.gstNumber,
        phone: agency.phone,
        email: agency.email,
        website: agency.website,
        streetAddress: agency.businessAddress,
        city: agency.city,
        state: agency.state,
        pinCode: agency.pinCode,
        country: agency.country,
      },
      profile: agency.draftData?.profile || agency.profile || {},
      verification: agency.draftData?.verification || {
        ownerName: agency.owner?.name,
        ownerEmail: agency.owner?.email,
        ownerPhone: agency.owner?.phone,
        ownerPanNumber: agency.owner?.panNumber,
        ownerAadhaarNumber: agency.owner?.aadhaarNumber,
        governmentIdType: agency.owner?.governmentIdType,
      },
      bank: agency.draftData?.bank || agency.bankDetails || {},
      verificationStatus: agency.verificationStatus,
      status: agency.status,
    };
  }

  /**
   * Finalize and submit completed agency registration application
   */
  public async submitOnboarding(payload: AgencySubmitOnboardingInput, context: RequestContext = {}) {
    const business = payload.business || ({} as any);
    const profile = payload.profile || ({} as any);
    const verification = payload.verification || ({} as any);
    const bank = payload.bank || ({} as any);

    const email = (business.email || profile.email || verification.ownerEmail || 'partner@apnatrip.com').toLowerCase().trim();
    const phone = business.phone || profile.phone || verification.ownerPhone || '+91 98765 43210';
    const ownerName = verification.ownerName || business.agencyDisplayName || business.legalBusinessName || 'Agency Partner';
    const businessAddress = business.businessAddress || business.streetAddress || '';

    // 1. Duplicate active agency check
    const existingActive = await AgencyModel.findOne({
      email,
      status: { $in: ['ACTIVE', 'APPROVED'] },
    });

    if (existingActive) {
      throw new ConflictError('An active travel agency is already registered with this email address.');
    }

    // 2. Check if updating an existing draft by applicationId or email
    let agency = null;
    if (payload.applicationId) {
      agency = await AgencyModel.findOne({ applicationId: payload.applicationId });
    }
    if (!agency) {
      agency = await AgencyModel.findOne({ email, verificationStatus: 'PENDING' });
    }

    const applicationId =
      agency?.applicationId ||
      payload.applicationId ||
      `ATP-AGY-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const submittedAt = new Date();

    // 3. Format Documents Array
    const documents: IAgencyDocumentItem[] = [];

    const addDoc = (name: string, type: string, fileObj?: any) => {
      if (!fileObj) return;
      const fileUrl = typeof fileObj === 'string' ? fileObj : fileObj.dataUrl || fileObj.url || fileObj.secureUrl;
      if (!fileUrl) return;

      documents.push({
        id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name,
        type,
        status: 'Pending',
        fileUrl,
        size: typeof fileObj === 'object' ? fileObj.size : undefined,
        sizeFormatted: typeof fileObj === 'object' ? fileObj.sizeFormatted : undefined,
        uploadedAt: submittedAt.toISOString(),
      });
    };

    addDoc('Business Registration Certificate', 'Registration Certificate', verification.registrationCert);
    addDoc('GST Registration Certificate', 'GST Certificate', verification.gstCert);
    addDoc('Business PAN Card', 'Business PAN', verification.panCard);
    addDoc(`${verification.governmentIdType || 'Government ID'}`, 'Identity Proof', verification.governmentIdFile);
    addDoc('Owner Identity Selfie', 'Selfie Verification', verification.selfieFile);
    addDoc('Office Address Proof', 'Address Proof', verification.addressProofFile);

    // 4. Build Verification Checklist
    const verificationChecklist: IVerificationChecklistItem[] = [
      { id: 'chk_1', label: 'Business Entity & Registration Certificate', status: verification.registrationCert ? 'Under Review' : 'Pending' },
      { id: 'chk_2', label: 'GST Tax Certificate & GSTIN Format', status: business.gstNumber ? 'Under Review' : 'Pending' },
      { id: 'chk_3', label: 'Business PAN & Legal Tax Validation', status: verification.panCard ? 'Under Review' : 'Pending' },
      { id: 'chk_4', label: 'Primary Owner ID & Face Match Selfie', status: verification.governmentIdFile && verification.selfieFile ? 'Under Review' : 'Pending' },
      { id: 'chk_5', label: 'Commercial Office Physical Address Proof', status: verification.addressProofFile ? 'Under Review' : 'Pending' },
      { id: 'chk_6', label: 'Bank Settlement Account & IFSC Verification', status: bank.accountNumber && bank.ifscCode ? 'Under Review' : 'Pending' },
    ];

    // 5. Build Timeline Event
    const initialTimeline: ITimelineEvent[] = [
      {
        id: `tl_${Date.now()}_1`,
        title: 'Application Submitted',
        timestamp: submittedAt.toISOString(),
        completed: true,
        desc: `Onboarding registration submitted by ${ownerName}. Pending Super Admin review.`,
        actor: ownerName,
        color: 'emerald',
      },
    ];

    // 6. Dynamic Compliance Score Calculation
    let complianceScore = 50;
    if (documents.length >= 4) complianceScore += 25;
    if (business.gstNumber) complianceScore += 10;
    if (bank.ifscCode && bank.accountNumber) complianceScore += 10;
    if (profile.logoUrl && profile.coverUrl) complianceScore += 5;

    // 7. Assemble Document Fields
    const agencyPayload: Partial<any> = {
      applicationId,
      name: business.agencyDisplayName || business.legalBusinessName || 'Partner Agency',
      legalBusinessName: business.legalBusinessName || business.agencyDisplayName,
      agencyDisplayName: business.agencyDisplayName || business.legalBusinessName,
      email,
      phone,
      ownerName,
      businessType: business.businessType || 'Travel Agency',
      yearEstablished: business.yearEstablished,
      registrationNumber: business.businessRegistrationNumber || business.registrationNumber,
      gstNumber: business.gstNumber,
      businessAddress,
      city: business.city || 'India',
      state: business.state || '',
      pinCode: business.pinCode || '',
      country: business.country || 'India',
      website: business.website || profile.website,
      logo: profile.logoUrl,
      banner: profile.coverUrl,
      owner: {
        name: ownerName,
        email: verification.ownerEmail || email,
        phone: verification.ownerPhone || phone,
        panNumber: verification.ownerPanNumber,
        aadhaarNumber: verification.ownerAadhaarNumber,
        governmentIdType: verification.governmentIdType,
        governmentIdUrl: typeof verification.governmentIdFile === 'string' ? verification.governmentIdFile : verification.governmentIdFile?.dataUrl,
        selfieUrl: typeof verification.selfieFile === 'string' ? verification.selfieFile : verification.selfieFile?.dataUrl,
        addressProofUrl: typeof verification.addressProofFile === 'string' ? verification.addressProofFile : verification.addressProofFile?.dataUrl,
      },
      profile: {
        logoUrl: profile.logoUrl,
        coverUrl: profile.coverUrl,
        tagline: profile.tagline,
        about: profile.about,
        yearsOfExperience: profile.yearsOfExperience,
        teamSize: profile.teamSize,
        selectedServices: profile.selectedServices || [],
        destinations: profile.destinations || [],
        languages: profile.languages || ['English', 'Hindi'],
        phone: profile.phone || phone,
        email: profile.email || email,
        website: profile.website || business.website,
        instagram: profile.instagram,
        facebook: profile.facebook,
      },
      bankDetails: {
        accountHolderName: bank.accountHolderName || ownerName,
        bankName: bank.bankName || '',
        accountNumber: bank.accountNumber || '',
        ifscCode: bank.ifscCode || '',
        upiId: bank.upiId,
        payoutMethod: bank.payoutMethod || 'bank',
        branch: bank.branch,
      },
      documents,
      verificationChecklist,
      complianceScore,
      timeline: initialTimeline,
      verificationStatus: 'PENDING',
      status: 'PENDING',
      onboardingStep: 6,
      completionPercentage: 100,
      submissionIp: context.ip,
      submissionBrowser: context.userAgent,
      draftData: {
        business,
        profile,
        verification,
        bank,
        finalSubmittedAt: submittedAt.toISOString(),
      },
    };

    let savedAgency: any;
    if (agency) {
      Object.assign(agency, agencyPayload);
      savedAgency = await agency.save();
    } else {
      savedAgency = await AgencyModel.create(agencyPayload);
    }

    // 8. Create Audit Log
    const nowIso = submittedAt.toISOString();
    await AuditLogModel.create({
      eventId: `EVT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: nowIso,
      date: nowIso.split('T')[0],
      actor: {
        id: savedAgency._id.toString(),
        name: savedAgency.ownerName || savedAgency.name,
        email: savedAgency.email,
        role: 'Agency',
      },
      module: 'Agency',
      action: 'Application Submitted',
      eventType: 'AGENCY_APPLICATION_SUBMITTED',
      description: `New agency registration application [${applicationId}] submitted for ${savedAgency.name}`,
      severity: 'Medium',
      status: 'Success',
      ipAddress: context.ip || '127.0.0.1',
      browser: context.userAgent || 'TravelOS Client',
      metadata: {
        agencyId: savedAgency._id.toString(),
        applicationId,
      },
    });

    // 9. Send Confirmation Email to Agency
    const trackLink = `${envConfig.FRONTEND_URL || 'http://localhost:5173'}/agency/verification-pending`;
    try {
      await mailService.sendAgencyApplicationReceivedEmail(
        email,
        savedAgency.name,
        applicationId,
        trackLink
      );
    } catch (err: any) {
      logger.warn('⚠️ Could not dispatch confirmation email to %s: %s', email, err.message);
    }

    // 10. Send Alert Email to Super Admin
    try {
      const superAdmin = await AdminModel.findOne({ isDeleted: false }).sort({ createdAt: 1 }).lean();
      const adminEmail = superAdmin?.email || 'admin@apnatrip.com';
      const reviewLink = `${envConfig.FRONTEND_URL || 'http://localhost:5173'}/admin/verification-pending`;
      await mailService.sendSuperAdminNewAgencyAlertEmail(
        adminEmail,
        savedAgency.name,
        applicationId,
        reviewLink
      );
    } catch (err: any) {
      logger.warn('⚠️ Could not dispatch admin alert email: %s', err.message);
    }

    // 11. Real-time In-App Notification to Admin
    try {
      await NotificationDispatcher.notifyAdmin({
        category: 'agency',
        title: 'Agency Approval Needed',
        description: `${savedAgency.name} submitted registration & KYC documents for agency verification.`,
        priority: 'HIGH',
        targetRoute: '/admin/verification-pending',
        actions: [
          { label: 'Approve', actionType: 'approve_agency', variant: 'primary' },
          { label: 'Reject', actionType: 'reject_agency', variant: 'danger' },
          { label: 'View', actionType: 'view', variant: 'secondary' },
        ],
        relatedEntityType: 'AGENCY',
        relatedEntityId: savedAgency._id.toString(),
        relatedEntityName: savedAgency.name,
        triggeredBy: savedAgency.ownerName || savedAgency.name,
      });
    } catch (err: any) {
      logger.warn('⚠️ Could not dispatch admin real-time notification: %s', err.message);
    }

    logger.info('🚀 Agency registration application submitted successfully: %s [ID: %s]', savedAgency.name, applicationId);

    return {
      success: true,
      applicationId: savedAgency.applicationId,
      submittedAt: submittedAt.toISOString(),
      status: savedAgency.verificationStatus,
      message: 'Agency onboarding application submitted successfully.',
    };
  }

  /**
   * Get real-time verification status tracker data
   */
  public async getVerificationStatus(idOrEmail: string) {
    const cleanId = (idOrEmail || '').trim();
    const isObjectId = mongoose.Types.ObjectId.isValid(cleanId) && cleanId.length === 24;

    const query: any = {
      $or: [
        ...(isObjectId ? [{ _id: new mongoose.Types.ObjectId(cleanId) }] : []),
        { applicationId: cleanId },
        { email: cleanId.toLowerCase() },
        { ownerEmail: cleanId.toLowerCase() },
      ],
      isDeleted: false,
    };

    let agency = await AgencyModel.findOne(query).lean();
    if (!agency) {
      agency = await AgencyModel.findOne({ isDeleted: false }).sort({ updatedAt: -1 }).lean();
    }

    if (!agency) {
      return {
        status: 'PENDING',
        applicationStatus: 'DRAFT',
        applicationId: cleanId || 'ATP-AGY-2026-PENDING',
        submittedAt: new Date().toISOString(),
        estimatedReviewTime: '24–48 Hours',
        email: '',
        phone: '',
        agencyName: 'Partner Agency',
        rejectionReason: '',
        requestedDocuments: [],
        timeline: [],
        complianceScore: 85,
        message: 'Your agency application is currently under verification.',
      };
    }

    return {
      status: agency.verificationStatus || 'PENDING',
      applicationStatus: (agency as any).status || 'PENDING',
      applicationId: agency.applicationId,
      submittedAt: agency.submittedAt?.toISOString() || agency.createdAt?.toISOString() || new Date().toISOString(),
      estimatedReviewTime: '24–48 Hours',
      email: agency.email || agency.ownerEmail,
      phone: agency.phone || agency.ownerPhone,
      agencyName: agency.agencyDisplayName || agency.legalBusinessName || agency.name,
      rejectionReason: agency.rejectionReason,
      requestedDocuments: agency.requestedDocuments || [],
      timeline: agency.approvalTimeline || [],
      complianceScore: 85,
      message:
        agency.verificationStatus === 'APPROVED'
          ? 'Your agency application has been approved!'
          : agency.verificationStatus === 'REJECTED'
          ? 'Your agency application was not approved.'
          : agency.verificationStatus === 'MISSING_DOCS'
          ? 'Additional documents are required to complete your verification.'
          : 'Your agency application is currently under verification.',
    };
  }

  /**
   * Get documents specifically requested for re-upload by Super Admin
   */
  public async getRequestedDocuments(idOrEmail: string) {
    const cleanId = (idOrEmail || '').trim();
    const isObjectId = mongoose.Types.ObjectId.isValid(cleanId) && cleanId.length === 24;

    const query: any = {
      $or: [
        ...(isObjectId ? [{ _id: new mongoose.Types.ObjectId(cleanId) }] : []),
        { applicationId: cleanId },
        { email: cleanId.toLowerCase() },
        { ownerEmail: cleanId.toLowerCase() },
      ],
      isDeleted: false,
    };

    let agency = await AgencyModel.findOne(query);
    if (!agency) {
      agency = await AgencyModel.findOne({ isDeleted: false }).sort({ updatedAt: -1 });
    }

    if (!agency) {
      return {
        success: true,
        applicationId: cleanId,
        agencyName: 'Partner Agency',
        verificationStatus: 'PENDING',
        documentRequestMessage: '',
        documentRequestRound: 0,
        requestedDocuments: [],
        allDocuments: [],
      };
    }

    // Only return active requested documents if verificationStatus is MISSING_DOCS
    let normalizedRequestedList: any[] = [];

    if (agency.verificationStatus === 'MISSING_DOCS') {
      const requestedDetails = agency.requestedDocumentsDetails || [];
      const pendingAgencyItems = requestedDetails.filter(
        (d: any) => d.status === 'PENDING_AGENCY_UPLOAD'
      );

      if (pendingAgencyItems.length > 0) {
        normalizedRequestedList = pendingAgencyItems;
      } else if (agency.requestedDocuments && agency.requestedDocuments.length > 0) {
        normalizedRequestedList = agency.requestedDocuments.map((name: string) => ({
          documentId: `doc_${name.toLowerCase().replace(/\s+/g, '_')}`,
          documentName: name,
          documentType: 'KYC Document',
          reason: 'Verification Failed',
          status: 'PENDING_AGENCY_UPLOAD',
        }));
      }
    }

    return {
      success: true,
      applicationId: agency.applicationId,
      agencyName: agency.agencyDisplayName || agency.name,
      verificationStatus: agency.verificationStatus,
      documentRequestMessage: agency.verificationStatus === 'MISSING_DOCS' ? (agency.documentRequestMessage || '') : '',
      documentRequestRound: agency.documentRequestRound || 0,
      requestedDocuments: normalizedRequestedList,
      allDocuments: (agency.documents || []).map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        status: doc.status,
        fileUrl: doc.fileUrl,
        rejectionReason: doc.rejectionReason,
        customReason: doc.customReason,
        reuploadedAt: doc.reuploadedAt,
      })),
    };
  }

  /**
   * Re-upload requested missing documents
   */
  public async reuploadDocuments(payload: AgencyReuploadDocumentsInput, context: RequestContext = {}) {
    const agency = await AgencyModel.findOne({ applicationId: payload.applicationId });
    if (!agency) {
      throw new NotFoundError('Agency application not found');
    }

    const nowIso = new Date().toISOString();
    const existingDocs = agency.documents || [];
    const requestedDetails = agency.requestedDocumentsDetails || [];
    const reuploadedNames: string[] = [];

    // Security Check: Verify that each submitted document was actually requested
    const requestedNamesSet = new Set([
      ...(agency.requestedDocuments || []),
      ...requestedDetails.map((r: any) => r.documentName),
      ...requestedDetails.map((r: any) => r.documentType),
    ]);

    for (const newDoc of payload.documents) {
      const isAllowed =
        requestedNamesSet.size === 0 || // If no specific list, allow
        requestedNamesSet.has(newDoc.name) ||
        requestedNamesSet.has(newDoc.type) ||
        requestedDetails.some((r: any) => r.documentId === newDoc.documentId || r.documentId === newDoc.id);

      if (!isAllowed) {
        throw new BadRequestError(`Document "${newDoc.name}" was not requested for re-upload.`);
      }
    }

    // Process each document update
    payload.documents.forEach((newDoc) => {
      reuploadedNames.push(newDoc.name);

      // 1. Update agency.documents
      const existingIdx = existingDocs.findIndex(
        (d: any) =>
          (newDoc.documentId && d.id === newDoc.documentId) ||
          d.type === newDoc.type ||
          d.name === newDoc.name
      );

      if (existingIdx !== -1) {
        existingDocs[existingIdx].fileUrl = newDoc.fileUrl;
        existingDocs[existingIdx].status = 'Re-upload Submitted';
        existingDocs[existingIdx].uploadedAt = nowIso;
        existingDocs[existingIdx].reuploadedAt = nowIso;
        existingDocs[existingIdx].reuploadedFileUrl = newDoc.fileUrl;
      } else {
        existingDocs.push({
          id: newDoc.documentId || newDoc.id || `doc_${Date.now()}`,
          name: newDoc.name,
          type: newDoc.type,
          fileUrl: newDoc.fileUrl,
          status: 'Re-upload Submitted',
          uploadedAt: nowIso,
          reuploadedAt: nowIso,
          reuploadedFileUrl: newDoc.fileUrl,
        });
      }

      // 2. Update matching items in requestedDocumentsDetails
      const reqIdx = requestedDetails.findIndex(
        (r: any) =>
          (newDoc.documentId && r.documentId === newDoc.documentId) ||
          r.documentName === newDoc.name ||
          r.documentType === newDoc.type
      );
      if (reqIdx !== -1) {
        requestedDetails[reqIdx].status = 'REUPLOAD_SUBMITTED';
        requestedDetails[reqIdx].reuploadedFileUrl = newDoc.fileUrl;
        requestedDetails[reqIdx].reuploadedAt = nowIso;
      }
    });

    agency.documents = existingDocs;
    agency.requestedDocumentsDetails = requestedDetails;

    // Check if any requested documents remain in PENDING_AGENCY_UPLOAD
    const hasRemainingPendingUploads = requestedDetails.some(
      (r: any) => r.status === 'PENDING_AGENCY_UPLOAD'
    );

    if (!hasRemainingPendingUploads) {
      agency.verificationStatus = 'PENDING';
      agency.status = 'PENDING';
      agency.requestedDocuments = [];
      agency.documentRequestMessage = '';
    }

    // Append Timeline Event
    agency.timeline.push({
      id: `tl_${Date.now()}`,
      title: 'Requested Documents Re-uploaded',
      timestamp: nowIso,
      completed: true,
      desc: `Agency re-uploaded: ${reuploadedNames.join(', ')}. ${payload.notes ? `Note: ${payload.notes}` : ''}`,
      actor: agency.name,
      color: 'blue',
    });

    agency.markModified('documents');
    agency.markModified('requestedDocumentsDetails');
    agency.markModified('timeline');

    await agency.save();

    // Audit Log
    await AuditLogModel.create({
      eventId: `EVT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: nowIso,
      date: nowIso.split('T')[0],
      actor: {
        id: agency._id.toString(),
        name: agency.ownerName || agency.name,
        email: agency.email,
        role: 'Agency',
      },
      module: 'Agency',
      action: 'Documents Re-uploaded',
      eventType: 'AGENCY_DOCUMENTS_REUPLOADED',
      description: `Re-uploaded documents [${reuploadedNames.join(', ')}] for agency [${agency.applicationId}]`,
      severity: 'Medium',
      status: 'Success',
      ipAddress: context.ip || '127.0.0.1',
      browser: context.userAgent || 'TravelOS Client',
      metadata: {
        agencyId: agency._id.toString(),
        applicationId: agency.applicationId,
        reuploadedDocuments: reuploadedNames,
        notes: payload.notes || '',
      },
    });

    // Send Alert Email to Super Admin
    const adminReviewLink = `${envConfig.FRONTEND_URL || 'http://localhost:5173'}/admin/verification-pending`;
    try {
      await mailService.sendSuperAdminAgencyReuploadAlertEmail(
        envConfig.EMAIL_FROM_ADDRESS || 'das01subhamj@gmail.com',
        agency.agencyDisplayName || agency.name,
        agency.applicationId,
        payload.documents.length,
        adminReviewLink
      );
    } catch (err: any) {
      logger.warn('Failed to send Super Admin agency re-upload alert email: %s', err.message);
    }

    // Dispatch Real-time Admin Notification
    try {
      await NotificationDispatcher.notifyAdmin({
        category: 'agency',
        title: 'Documents Re-uploaded',
        description: `${agency.agencyDisplayName || agency.name} re-uploaded ${payload.documents.length} requested KYC documents.`,
        priority: 'HIGH',
        targetRoute: '/admin/verification-pending',
        actions: [
          { label: 'Review', actionType: 'review_agency', variant: 'primary' },
          { label: 'View', actionType: 'view', variant: 'secondary' },
        ],
        relatedEntityType: 'AGENCY',
        relatedEntityId: agency._id.toString(),
        relatedEntityName: agency.agencyDisplayName || agency.name,
        triggeredBy: agency.ownerName || agency.name,
      });
    } catch (err: any) {
      logger.warn('Failed to send Admin re-upload notification: %s', err.message);
    }

    logger.info('🔄 Agency %s re-uploaded missing documents. Application review updated.', agency.applicationId);

    return {
      success: true,
      applicationId: agency.applicationId,
      status: agency.verificationStatus,
      reuploadedCount: payload.documents.length,
      message: 'Requested documents submitted successfully. Application returned to review.',
    };
  }
}

export const agencyOnboardingService = new AgencyOnboardingService();
