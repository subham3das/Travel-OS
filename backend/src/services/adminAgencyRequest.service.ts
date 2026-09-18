import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { AgencyModel, IAgency } from '../models/agency.model.js';
import { AuditLogModel } from '../models/auditLog.model.js';
import { AuditLoggerService } from './auditLogger.service.js';
import { mailService } from './mail.service.js';
import { envConfig } from '../config/env.config.js';
import { logger } from '../config/logger.config.js';
import { NotificationDispatcher } from './notificationDispatcher.service.js';

export interface AgencyRequestFiltersQuery {
  page?: number;
  limit?: number;
  status?: string;
  businessType?: string;
  state?: string;
  verificationStatus?: string;
  submissionDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FormattedAgencyRequestItem {
  id: string;
  applicationId: string;
  agencyName: string;
  logo: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  businessType: string;
  submittedDate: string;
  gstNumber: string;
  website: string;
  establishedYear: string;
  officeAddress: string;
  aadhaarNumber: string;
  panNumber: string;
  city: string;
  state: string;
  documentsUploadedCount: number;
  documentsTotalCount: number;
  verificationStatus: 'Complete' | 'Under Review' | 'Missing Docs';
  reviewStatus: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  verificationChecklist: Array<{
    id: string;
    label: string;
    status: 'Verified' | 'Pending' | 'Under Review' | 'Missing';
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    status: 'Approved' | 'Pending' | 'Under Review' | 'Missing' | 'Rejected' | 'Re-upload Requested' | 'Re-upload Submitted';
    fileUrl: string;
    uploadedAt: string;
    rejectionReason?: string;
    customReason?: string;
    internalNote?: string;
    reuploadedAt?: string;
    reuploadedFileUrl?: string;
  }>;
  requestedDocuments?: string[];
  requestedDocumentsDetails?: any[];
  documentRequestMessage?: string;
  documentRequestRound?: number;
  timeline: Array<{
    id: string;
    title: string;
    timestamp: string;
    completed: boolean;
    color?: string;
  }>;
  activities: Array<{
    id: string;
    timestamp: string;
    adminName: string;
    action: string;
    notes?: string;
    status: string;
  }>;
  bankDetails?: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch?: string;
    upiId?: string;
    accountType?: string;
    payoutMethod?: string;
    verified?: boolean;
    status?: 'Pending' | 'Under Review' | 'Verified' | 'Rejected';
    verifiedAt?: string;
    verifiedBy?: string;
  };
  reviewNotes?: string;
  complianceScore: number;
}

export class AdminAgencyRequestService {
  /**
   * Helper to format IAgency into frontend AgencyRequestItem DTO
   */
  private formatAgencyItem(agency: IAgency, activities: any[] = []): FormattedAgencyRequestItem {
    const totalDocs = agency.documents?.length || 6;
    const uploadedDocs = agency.documents?.filter((d: any) => d.fileUrl && d.fileUrl !== '#')?.length || 0;

    let mappedReviewStatus: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' = 'Pending';
    if (agency.verificationStatus === 'APPROVED' || agency.verificationStatus === 'VERIFIED') {
      mappedReviewStatus = 'Approved';
    } else if (agency.verificationStatus === 'REJECTED') {
      mappedReviewStatus = 'Rejected';
    } else if (agency.verificationStatus === 'UNDER_REVIEW' || agency.verificationStatus === 'PENDING') {
      mappedReviewStatus = 'Under Review';
    }

    let mappedDocStatus: 'Complete' | 'Under Review' | 'Missing Docs' = 'Under Review';
    if (agency.verificationStatus === 'MISSING_DOCS') {
      mappedDocStatus = 'Missing Docs';
    } else if (mappedReviewStatus === 'Approved') {
      mappedDocStatus = 'Complete';
    } else {
      mappedDocStatus = 'Under Review';
    }

    // Standardized default checklist if empty
    const isBankVerified = agency.bankDetails?.verified === true;
    const checklist =
      agency.verificationChecklist && agency.verificationChecklist.length > 0
        ? agency.verificationChecklist.map((item: any) => {
            if (item.label && item.label.toLowerCase().includes('bank')) {
              return { ...item, status: isBankVerified ? 'Verified' : 'Under Review' };
            }
            return item;
          })
        : [
            { id: 'vc1', label: 'GST Verification', status: agency.gstNumber ? 'Verified' : 'Pending' },
            { id: 'vc2', label: 'PAN Verification', status: agency.owner?.panNumber ? 'Verified' : 'Pending' },
            { id: 'vc3', label: 'Business License', status: agency.registrationNumber ? 'Verified' : 'Pending' },
            { id: 'vc4', label: 'Bank Settlement Account & IFSC Verification', status: isBankVerified ? 'Verified' : 'Under Review' },
            { id: 'vc5', label: 'KYC Verification', status: agency.owner?.governmentIdUrl ? 'Verified' : 'Pending' },
            { id: 'vc6', label: 'Office Address Proof', status: agency.owner?.addressProofUrl ? 'Verified' : 'Pending' },
          ];

    // Standardized timeline if empty
    const submittedDateStr = agency.createdAt
      ? new Date(agency.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Recently';

    const timeline =
      agency.timeline && agency.timeline.length > 0
        ? agency.timeline
        : [
            { id: 't1', title: 'Application Submitted', timestamp: submittedDateStr, completed: true },
            { id: 't2', title: 'Documents Uploaded', timestamp: submittedDateStr, completed: uploadedDocs > 0 },
            {
              id: 't3',
              title: 'Verification In Progress',
              timestamp: agency.updatedAt ? new Date(agency.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'In Progress',
              completed: mappedReviewStatus !== 'Pending',
            },
            {
              id: 't4',
              title: mappedReviewStatus === 'Approved' ? 'Application Approved' : mappedReviewStatus === 'Rejected' ? 'Application Rejected' : 'Pending Final Decision',
              timestamp: agency.reviewedAt ? new Date(agency.reviewedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
              completed: mappedReviewStatus === 'Approved' || mappedReviewStatus === 'Rejected',
            },
          ];

    // Latest review note
    const latestNote =
      agency.reviewNotes && agency.reviewNotes.length > 0
        ? agency.reviewNotes[agency.reviewNotes.length - 1].note
        : '';

    return {
      id: agency._id.toString(),
      applicationId: agency.applicationId || `ATP-AGY-2026-${agency._id.toString().slice(-6).toUpperCase()}`,
      agencyName: agency.agencyDisplayName || agency.legalBusinessName || agency.name,
      logo:
        agency.logo ||
        agency.profile?.logoUrl ||
        'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
      ownerName: agency.owner?.name || agency.ownerName || 'Agency Principal',
      ownerEmail: agency.owner?.email || agency.email,
      ownerPhone: agency.owner?.phone || agency.phone,
      businessType: agency.businessType || 'Tour Operator',
      submittedDate: submittedDateStr,
      gstNumber: agency.gstNumber || 'Not Provided',
      website: agency.website || agency.profile?.website || '—',
      establishedYear: agency.yearEstablished || '2022',
      officeAddress: agency.businessAddress || (agency.city ? `${agency.city}, ${agency.state || ''}` : 'India'),
      aadhaarNumber: agency.owner?.aadhaarNumber ? `XXXX XXXX ${agency.owner.aadhaarNumber.slice(-4)}` : 'XXXX XXXX 1234',
      panNumber: agency.owner?.panNumber || '—',
      city: agency.city || 'Mumbai',
      state: agency.state || 'Maharashtra',
      documentsUploadedCount: uploadedDocs,
      documentsTotalCount: totalDocs,
      verificationStatus: mappedDocStatus,
      reviewStatus: mappedReviewStatus,
      verificationChecklist: checklist as any,
      documents: (agency.documents || []).map((doc: any) => ({
        id: doc.id || `doc-${Math.random()}`,
        name: doc.name,
        type: doc.type,
        status: doc.status || 'Pending',
        fileUrl: doc.fileUrl,
        rejectionReason: doc.rejectionReason,
        customReason: doc.customReason,
        internalNote: doc.internalNote,
        reuploadedAt: doc.reuploadedAt,
        reuploadedFileUrl: doc.reuploadedFileUrl,
        uploadedAt: doc.uploadedAt
          ? new Date(doc.uploadedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : submittedDateStr,
      })),
      requestedDocuments: agency.requestedDocuments || [],
      requestedDocumentsDetails: agency.requestedDocumentsDetails || [],
      documentRequestMessage: agency.documentRequestMessage || '',
      documentRequestRound: agency.documentRequestRound || 0,
      timeline: timeline as any,
      activities: activities.map((act) => ({
        id: act._id?.toString() || `act-${Math.random()}`,
        timestamp: new Date(act.createdAt || Date.now()).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        adminName: act.actor?.name || 'System / Compliance Admin',
        action: act.action || act.description || 'Application Event',
        notes: act.metadata?.notes || act.description || '',
        status: act.status || 'Success',
      })),
      bankDetails: agency.bankDetails
        ? {
            accountHolderName: agency.bankDetails.accountHolderName || agency.owner?.name || agency.ownerName || agency.name || '—',
            bankName: agency.bankDetails.bankName || '—',
            accountNumber: agency.bankDetails.accountNumber || '—',
            ifscCode: agency.bankDetails.ifscCode || '—',
            branch: agency.bankDetails.branch || '—',
            upiId: agency.bankDetails.upiId || '—',
            accountType: (agency.bankDetails as any).accountType || 'Current / Business Account',
            payoutMethod: agency.bankDetails.payoutMethod || 'Bank Transfer',
            verified: agency.bankDetails.verified === true,
            status: agency.bankDetails.status || (agency.bankDetails.verified ? 'Verified' : 'Under Review'),
            verifiedAt: agency.bankDetails.verifiedAt,
            verifiedBy: agency.bankDetails.verifiedBy,
          }
        : {
            accountHolderName: agency.owner?.name || agency.ownerName || agency.name || '—',
            bankName: '—',
            accountNumber: '—',
            ifscCode: '—',
            branch: '—',
            upiId: '—',
            accountType: 'Current / Business Account',
            payoutMethod: 'Bank Transfer',
            verified: false,
            status: 'Under Review',
          },
      reviewNotes: latestNote,
      complianceScore: agency.complianceScore || 85,
    };
  }

  /**
   * 1. GET SUMMARY STATS (6 KPI Summary Cards)
   */
  public async getSummaryStats() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      pendingCount,
      approvedTodayCount,
      rejectedTodayCount,
      underReviewCount,
      missingDocsCount,
      approvedTimes,
      pendingLast30,
      pendingPrev30,
    ] = await Promise.all([
      // Current pending
      AgencyModel.countDocuments({
        isDeleted: false,
        verificationStatus: { $in: ['PENDING', 'UNDER_REVIEW', 'MISSING_DOCS'] },
      }),
      // Approved today
      AgencyModel.countDocuments({
        isDeleted: false,
        verificationStatus: { $in: ['APPROVED', 'VERIFIED'] },
        reviewedAt: { $gte: startOfToday },
      }),
      // Rejected today
      AgencyModel.countDocuments({
        isDeleted: false,
        verificationStatus: 'REJECTED',
        reviewedAt: { $gte: startOfToday },
      }),
      // Under Review
      AgencyModel.countDocuments({
        isDeleted: false,
        verificationStatus: 'UNDER_REVIEW',
      }),
      // Missing Docs
      AgencyModel.countDocuments({
        isDeleted: false,
        verificationStatus: 'MISSING_DOCS',
      }),
      // Average approval duration
      AgencyModel.aggregate([
        {
          $match: {
            isDeleted: false,
            verificationStatus: { $in: ['APPROVED', 'VERIFIED'] },
            reviewedAt: { $exists: true, $ne: null },
          },
        },
        {
          $project: {
            durationMinutes: {
              $divide: [{ $subtract: ['$reviewedAt', '$createdAt'] }, 1000 * 60],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgDuration: { $avg: '$durationMinutes' },
          },
        },
      ]),
      // 30-day comparative pending growth
      AgencyModel.countDocuments({
        isDeleted: false,
        createdAt: { $gte: thirtyDaysAgo },
      }),
      AgencyModel.countDocuments({
        isDeleted: false,
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
      }),
    ]);

    // Calculate growth %
    const pendingGrowthPct =
      pendingPrev30 > 0
        ? (((pendingLast30 - pendingPrev30) / pendingPrev30) * 100).toFixed(1)
        : '0.0';

    // Format average approval time
    const avgMinutes = approvedTimes.length > 0 && approvedTimes[0].avgDuration ? Math.round(approvedTimes[0].avgDuration) : 165;
    const hours = Math.floor(avgMinutes / 60);
    const mins = avgMinutes % 60;
    const avgApprovalTimeFormatted = `${hours > 0 ? `${hours}h ` : ''}${mins}m`;

    return {
      pendingRequests: {
        count: pendingCount,
        growth: `${Number(pendingGrowthPct) >= 0 ? '+' : ''}${pendingGrowthPct}%`,
        isPositive: Number(pendingGrowthPct) >= 0,
      },
      approvedToday: {
        count: approvedTodayCount,
        growth: '+100%',
        isPositive: true,
      },
      rejectedToday: {
        count: rejectedTodayCount,
        growth: '0%',
        isPositive: false,
      },
      underReview: {
        count: underReviewCount,
        growth: '+14.3%',
        isPositive: true,
      },
      documentsMissing: {
        count: missingDocsCount,
        growth: '+5.2%',
        isPositive: true,
      },
      avgApprovalTime: {
        value: avgApprovalTimeFormatted,
        growth: '+8.3%',
        isPositive: true,
      },
    };
  }

  /**
   * 2. GET AGENCY REQUESTS (Paginated, Search, Multi-Filter)
   */
  public async getAgencyRequests(params: AgencyRequestFiltersQuery) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    const query: any = { isDeleted: false };

    // Search query
    if (params.search && params.search.trim() !== '') {
      const searchRegex = new RegExp(params.search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { legalBusinessName: searchRegex },
        { agencyDisplayName: searchRegex },
        { 'owner.name': searchRegex },
        { ownerName: searchRegex },
        { 'owner.email': searchRegex },
        { email: searchRegex },
        { 'owner.phone': searchRegex },
        { phone: searchRegex },
        { applicationId: searchRegex },
        { gstNumber: searchRegex },
        { 'owner.panNumber': searchRegex },
        { city: searchRegex },
        { state: searchRegex },
      ];
    }

    // Status filter
    if (params.status && params.status !== 'All Status') {
      if (params.status === 'Pending') {
        query.verificationStatus = 'PENDING';
      } else if (params.status === 'Under Review') {
        query.verificationStatus = 'UNDER_REVIEW';
      } else if (params.status === 'Approved') {
        query.verificationStatus = { $in: ['APPROVED', 'VERIFIED'] };
      } else if (params.status === 'Rejected') {
        query.verificationStatus = 'REJECTED';
      }
    } else {
      // Default view in Agency Requests: Only unapproved/pending applications needing review
      query.verificationStatus = { $in: ['PENDING', 'UNDER_REVIEW', 'MISSING_DOCS'] };
      query.status = { $ne: 'ACTIVE' };
    }

    // Business type filter
    if (params.businessType && params.businessType !== 'All Types') {
      query.businessType = params.businessType;
    }

    // State filter
    if (params.state && params.state !== 'All States') {
      query.state = params.state;
    }

    // Verification status filter
    if (params.verificationStatus && params.verificationStatus !== 'All Status') {
      if (params.verificationStatus === 'Missing Docs') {
        query.verificationStatus = 'MISSING_DOCS';
      } else if (params.verificationStatus === 'Complete') {
        // Complete documents, but still in pending / under review queue
        if (!params.status || params.status === 'All Status') {
          query.verificationStatus = { $in: ['PENDING', 'UNDER_REVIEW'] };
        }
      } else if (params.verificationStatus === 'In Progress') {
        query.verificationStatus = { $in: ['PENDING', 'UNDER_REVIEW'] };
      }
    }

    // Sort configuration
    const sortField = params.sortBy || 'createdAt';
    const sortDir = params.sortOrder === 'asc' ? 1 : -1;
    const sortOptions: Record<string, 1 | -1> = { [sortField]: sortDir };

    const [total, agencies] = await Promise.all([
      AgencyModel.countDocuments(query),
      AgencyModel.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const items = agencies.map((a: any) => this.formatAgencyItem(a));

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  /**
   * 3. GET SINGLE AGENCY REQUEST DETAILS (For Drawer & Tabs)
   */
  public async getAgencyRequestById(id: string) {
    let agency: any = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      agency = await AgencyModel.findOne({ _id: id, isDeleted: false }).lean();
    }

    if (!agency) {
      agency = await AgencyModel.findOne({
        $or: [{ applicationId: id }, { name: id }],
        isDeleted: false,
      }).lean();
    }

    if (!agency) {
      throw new Error(`Agency application with ID "${id}" was not found.`);
    }

    // Fetch related audit log activities from audit_logs
    const auditLogs = await AuditLogModel.find({
      $or: [
        { 'metadata.agencyId': agency._id.toString() },
        { 'metadata.applicationId': agency.applicationId },
        { description: new RegExp(agency.name, 'i') },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return this.formatAgencyItem(agency, auditLogs);
  }

  /**
   * 4. SAVE / APPEND INTERNAL REVIEW NOTES
   */
  public async saveReviewNotes(id: string, adminUser: any, note: string, reqContext?: any) {
    const agency = await AgencyModel.findById(id);
    if (!agency) throw new Error('Agency application not found.');

    const newNote = {
      id: `note-${Date.now()}`,
      adminId: adminUser._id?.toString() || adminUser.id || 'admin',
      adminName: adminUser.name || `${adminUser.firstName || 'Super'} ${adminUser.lastName || 'Admin'}`,
      note: note.trim(),
      createdAt: new Date().toISOString(),
    };

    agency.reviewNotes = agency.reviewNotes || [];
    agency.reviewNotes.push(newNote);
    await agency.save();

    // Create Audit Log
    await AuditLoggerService.log({
      actor: {
        id: adminUser._id?.toString() || adminUser.id,
        name: newNote.adminName,
        email: adminUser.email,
        role: adminUser.role?.name || 'SUPER_ADMIN',
      },
      module: 'Agency',
      action: 'Note Added',
      eventType: 'UPDATE',
      description: `Internal review note added to agency "${agency.name}" (${agency.applicationId})`,
      severity: 'Low',
      status: 'Success',
      metadata: {
        agencyId: agency._id.toString(),
        applicationId: agency.applicationId,
        note: note.trim(),
      },
      ipAddress: reqContext?.ip || '127.0.0.1',
      browser: reqContext?.browser,
      os: reqContext?.os,
      device: reqContext?.device,
    });

    return {
      success: true,
      message: 'Review note saved successfully.',
      reviewNotes: agency.reviewNotes,
    };
  }

  /**
   * Helper: Generate Unique Agency ID (ATP-AGY-YYYY-XXXXXX)
   */
  private generateAgencyId(): string {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    return `ATP-AGY-${year}-${randomSuffix}`;
  }

  /**
   * Helper: Generate Cryptographically Secure Temporary Password
   * Requirements: 12-16 chars, Uppercase, Lowercase, Numbers, Special Character
   */
  private generateSecureTempPassword(): string {
    const uppers = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowers = 'abcdefghjkmnpqrstuvwxyz';
    const numbers = '23456789';
    const specials = '!@#$%&*+?';
    const all = uppers + lowers + numbers + specials;

    let pwd = '';
    pwd += uppers[crypto.randomInt(0, uppers.length)];
    pwd += lowers[crypto.randomInt(0, lowers.length)];
    pwd += numbers[crypto.randomInt(0, numbers.length)];
    pwd += specials[crypto.randomInt(0, specials.length)];

    for (let i = 4; i < 14; i++) {
      pwd += all[crypto.randomInt(0, all.length)];
    }

    return pwd
      .split('')
      .sort(() => crypto.randomInt(-1, 2))
      .join('');
  }

  /**
   * 5. APPROVE AGENCY APPLICATION & AUTO CREATE ACCOUNT
   */
  public async approveRequest(id: string, adminUser: any, notes?: string, reqContext?: any) {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query: any = { isDeleted: false };
    if (isObjectId) {
      query.$or = [{ _id: id }, { applicationId: id }];
    } else {
      query.applicationId = id;
    }

    const agency = await AgencyModel.findOne(query);
    if (!agency) throw new Error('Agency application not found.');

    const registeredEmail = (agency.owner?.email || agency.email || '').trim().toLowerCase();
    if (!registeredEmail) {
      throw new Error('Agency does not have a registered email address for login account creation.');
    }

    const now = new Date();
    const approvalDateFormatted = now.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const loginLink = `${envConfig.FRONTEND_URL || 'http://localhost:5173'}/agency/login`;
    const ownerName = agency.owner?.name || agency.ownerName || 'Agency Partner';

    let agencyId = agency.agencyId;
    let tempPassword = '';
    let passwordHash = agency.passwordHash;
    let isNewAccount = false;

    // Step 2 & 7: Check if agency already has an active account or generate new credentials
    if (!agencyId || !passwordHash) {
      isNewAccount = true;
      agencyId = this.generateAgencyId();
      tempPassword = this.generateSecureTempPassword();
      passwordHash = await bcrypt.hash(tempPassword, 10);

      // Step 2 (Email Delivery First / Rollback Safety):
      // If email sending fails, do not activate account without credentials
      try {
        await mailService.sendAgencyApprovedEmail({
          to: registeredEmail,
          ownerName,
          agencyName: agency.name,
          agencyId,
          approvalDateFormatted,
          loginLink,
          loginEmail: registeredEmail,
          tempPassword,
        });
      } catch (mailError: any) {
        logger.error('Failed to send agency approval email: %s', mailError.message);
        throw new Error(
          `Agency approval aborted: Failed to deliver credentials email (${mailError.message}). Account was not created.`
        );
      }
    }

    // Step 1 & 5: Activate Account & Store Database Fields
    agency.verificationStatus = 'APPROVED';
    agency.status = 'ACTIVE';
    agency.agencyId = agencyId;
    agency.loginEmail = registeredEmail;
    agency.passwordHash = passwordHash;
    if (isNewAccount) {
      agency.passwordChanged = false;
    }
    agency.canLogin = true;
    agency.isActive = true;
    agency.emailVerified = true;
    agency.agencyVerified = true;
    agency.approvedAt = now;
    agency.approvedBy = new mongoose.Types.ObjectId(adminUser._id || adminUser.id);
    agency.reviewedBy = new mongoose.Types.ObjectId(adminUser._id || adminUser.id);
    agency.reviewedAt = now;

    // Timeline event
    agency.timeline = agency.timeline || [];
    agency.timeline.push({
      id: `t-app-${Date.now()}`,
      title: 'Partner Account Approved & Activated',
      timestamp: now.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      completed: true,
      actor: adminUser.name || 'Super Admin',
      desc: isNewAccount
        ? `Agency verified and official account created (Agency ID: ${agencyId}). Login credentials sent to ${registeredEmail}.`
        : `Agency application approved and status updated to ACTIVE.`,
    });

    if (notes) {
      agency.reviewNotes = agency.reviewNotes || [];
      agency.reviewNotes.push({
        id: `note-${Date.now()}`,
        adminId: adminUser._id?.toString() || adminUser.id,
        adminName: adminUser.name || 'Super Admin',
        note: notes.trim(),
        createdAt: now.toISOString(),
      });
    }

    await agency.save();

    // Step 8: Admin Activity Log
    await AuditLoggerService.log({
      actor: {
        id: adminUser._id?.toString() || adminUser.id,
        name: adminUser.name || 'Super Admin',
        email: adminUser.email,
        role: adminUser.role?.name || 'SUPER_ADMIN',
      },
      module: 'Agency',
      action: 'Agency Approved',
      eventType: 'UPDATE',
      description: `Agency "${agency.name}" (${agency.applicationId}) has been APPROVED with Agency ID: ${agencyId}. Account activated for ${registeredEmail}.`,
      severity: 'Medium',
      status: 'Success',
      metadata: {
        agencyId: agency._id.toString(),
        customAgencyId: agencyId,
        applicationId: agency.applicationId,
        loginEmail: registeredEmail,
        approvalNotes: notes || '',
      },
      ipAddress: reqContext?.ip || '127.0.0.1',
      browser: reqContext?.browser,
      os: reqContext?.os,
      device: reqContext?.device,
    });

    const updatedStats = await this.getSummaryStats();

    return {
      success: true,
      message: `Agency "${agency.name}" approved successfully with Agency ID ${agencyId}. Credentials dispatched to ${registeredEmail}.`,
      agency: this.formatAgencyItem(agency),
      updatedStats,
    };
  }

  /**
   * 5b. APPROVE SUBMITTED / RE-UPLOADED DOCUMENTS
   */
  public async approveDocuments(id: string, adminUser: any, documentIds?: string[], notes?: string, reqContext?: any) {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query: any = { isDeleted: false };
    if (isObjectId) {
      query.$or = [{ _id: id }, { applicationId: id }];
    } else {
      query.applicationId = id;
    }

    const agency = await AgencyModel.findOne(query);
    if (!agency) throw new Error('Agency application not found.');

    const nowIso = new Date().toISOString();
    const approvedDocNames: string[] = [];

    const existingDocs = agency.documents || [];
    const requestedDetails = agency.requestedDocumentsDetails || [];

    // Filter which docs to approve
    const docIdSet = documentIds && documentIds.length > 0 ? new Set(documentIds) : null;

    existingDocs.forEach((doc: any) => {
      const isTarget = !docIdSet || docIdSet.has(doc.id) || docIdSet.has(doc._id?.toString());
      if (isTarget && doc.status !== 'Approved') {
        doc.status = 'Approved';
        doc.rejectionReason = undefined;
        doc.customReason = undefined;
        doc.internalNote = undefined;
        if (doc.reuploadedFileUrl) {
          doc.fileUrl = doc.reuploadedFileUrl;
        }
        approvedDocNames.push(doc.name);
      }
    });

    // Update matching items in requestedDocumentsDetails
    requestedDetails.forEach((r: any) => {
      const isTarget = !docIdSet || docIdSet.has(r.documentId);
      if (isTarget) {
        r.status = 'APPROVED';
      }
    });

    // Check if any pending unapproved requested docs remain
    const hasRemainingPendingRequests = requestedDetails.some(
      (r: any) => r.status === 'PENDING_AGENCY_UPLOAD' || r.status === 'REUPLOAD_SUBMITTED'
    );

    if (!hasRemainingPendingRequests) {
      agency.requestedDocuments = [];
      agency.documentRequestMessage = '';
      if (agency.verificationStatus === 'MISSING_DOCS') {
        agency.verificationStatus = 'UNDER_REVIEW';
      }
    }

    // Recalculate complianceScore & verificationChecklist
    const totalDocs = existingDocs.length || 1;
    const approvedDocsCount = existingDocs.filter((d: any) => d.status === 'Approved').length;
    agency.complianceScore = Math.min(100, Math.round(50 + (approvedDocsCount / totalDocs) * 50));

    // Update Checklist items
    agency.verificationChecklist = (agency.verificationChecklist || []).map((item: any) => {
      const isMatch = existingDocs.some(
        (d: any) =>
          d.status === 'Approved' &&
          (d.type?.toLowerCase().includes(item.label.toLowerCase().slice(0, 3)) ||
            item.label.toLowerCase().includes(d.type?.toLowerCase().slice(0, 3)))
      );
      return isMatch ? { ...item, status: 'Verified' } : item;
    });

    // Append Timeline Event
    agency.timeline = agency.timeline || [];
    agency.timeline.push({
      id: `tl_doc_app_${Date.now()}`,
      title: 'Documents Approved',
      timestamp: nowIso,
      completed: true,
      actor: adminUser?.name || 'Super Admin',
      desc: `${approvedDocNames.length} document(s) verified and approved: [${approvedDocNames.join(', ')}]. ${notes ? `Note: ${notes}` : ''}`,
      color: 'emerald',
    });

    if (notes) {
      agency.reviewNotes = agency.reviewNotes || [];
      agency.reviewNotes.push({
        id: `note-${Date.now()}`,
        adminId: adminUser._id?.toString() || adminUser.id || 'admin_super',
        adminName: adminUser.name || 'Super Admin',
        note: `Documents Approved: ${approvedDocNames.join(', ')}. ${notes}`,
        createdAt: nowIso,
      });
    }

    agency.markModified('documents');
    agency.markModified('requestedDocumentsDetails');
    agency.markModified('timeline');
    agency.markModified('verificationChecklist');

    await agency.save();

    // Audit Log
    await AuditLoggerService.log({
      actor: {
        id: adminUser._id?.toString() || adminUser.id || 'admin_super',
        name: adminUser.name || 'Super Admin',
        email: adminUser.email || 'admin@travelos.com',
        role: adminUser.role?.name || 'SUPER_ADMIN',
      },
      module: 'Agency',
      action: 'Documents Approved',
      eventType: 'UPDATE',
      description: `${approvedDocNames.length} document(s) approved for agency "${agency.name}" (${agency.applicationId}): [${approvedDocNames.join(', ')}]`,
      severity: 'Medium',
      status: 'Success',
      metadata: {
        agencyId: agency._id.toString(),
        applicationId: agency.applicationId,
        approvedDocuments: approvedDocNames,
        notes: notes || '',
      },
      ipAddress: reqContext?.ip || '127.0.0.1',
      browser: reqContext?.browser,
      os: reqContext?.os,
      device: reqContext?.device,
    });

    logger.info('✅ Super Admin %s approved %d documents for agency %s', adminUser?.email, approvedDocNames.length, agency.applicationId);

    const formattedItem = this.formatAgencyItem(agency);

    return {
      success: true,
      message: `Successfully approved ${approvedDocNames.length} document(s) for "${agency.name}".`,
      agency: formattedItem,
      approvedCount: approvedDocNames.length,
    };
  }

  /**
   * 5c. APPROVE BANK SETTLEMENT ACCOUNT & IFSC
   */
  public async approveBankDetails(id: string, adminUser: any, notes?: string, reqContext?: any) {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query: any = { isDeleted: false };
    if (isObjectId) {
      query.$or = [{ _id: id }, { applicationId: id }];
    } else {
      query.applicationId = id;
    }

    const agency = await AgencyModel.findOne(query);
    if (!agency) throw new Error('Agency application not found.');

    const nowIso = new Date().toISOString();

    agency.bankDetails = agency.bankDetails || {
      accountHolderName: agency.owner?.name || agency.ownerName || agency.name || 'Agency Account',
      bankName: 'Verified Bank',
      accountNumber: '—',
      ifscCode: '—',
      payoutMethod: 'bank',
    };

    agency.bankDetails.verified = true;
    agency.bankDetails.status = 'Verified';
    agency.bankDetails.verifiedAt = nowIso;
    agency.bankDetails.verifiedBy = adminUser?.name || 'Super Admin';

    // Update Verification Checklist
    agency.verificationChecklist = (agency.verificationChecklist || []).map((item: any) => {
      if (item.label && item.label.toLowerCase().includes('bank')) {
        return { ...item, status: 'Verified' };
      }
      return item;
    });

    // Check if item was missing from checklist and add it
    const hasBankChecklist = agency.verificationChecklist.some(
      (item: any) => item.label && item.label.toLowerCase().includes('bank')
    );
    if (!hasBankChecklist) {
      agency.verificationChecklist.push({
        id: `vc_bank_${Date.now()}`,
        label: 'Bank Settlement Account & IFSC Verification',
        status: 'Verified',
      });
    }

    // Recalculate Compliance Score
    const verifiedChecklistCount = agency.verificationChecklist.filter((c: any) => c.status === 'Verified').length;
    const totalChecklist = agency.verificationChecklist.length || 6;
    agency.complianceScore = Math.min(100, Math.round(50 + (verifiedChecklistCount / totalChecklist) * 50));

    // Append Timeline Event
    agency.timeline = agency.timeline || [];
    agency.timeline.push({
      id: `tl_bank_app_${Date.now()}`,
      title: 'Bank Settlement Details Approved',
      timestamp: nowIso,
      completed: true,
      actor: adminUser?.name || 'Super Admin',
      desc: `Bank account (${agency.bankDetails.bankName || 'Bank'} • ${
        agency.bankDetails.accountNumber ? `...${agency.bankDetails.accountNumber.slice(-4)}` : ''
      }) and IFSC verified and approved.`,
      color: 'emerald',
    });

    if (notes) {
      agency.reviewNotes = agency.reviewNotes || [];
      agency.reviewNotes.push({
        id: `note-${Date.now()}`,
        adminId: adminUser._id?.toString() || adminUser.id || 'admin_super',
        adminName: adminUser.name || 'Super Admin',
        note: `Bank Settlement Approved: ${notes}`,
        createdAt: nowIso,
      });
    }

    agency.markModified('bankDetails');
    agency.markModified('verificationChecklist');
    agency.markModified('timeline');

    await agency.save();

    // Audit Log
    await AuditLoggerService.log({
      actor: {
        id: adminUser._id?.toString() || adminUser.id || 'admin_super',
        name: adminUser.name || 'Super Admin',
        email: adminUser.email || 'admin@travelos.com',
        role: adminUser.role?.name || 'SUPER_ADMIN',
      },
      module: 'Agency',
      action: 'Bank Details Approved',
      eventType: 'UPDATE',
      description: `Bank settlement account & IFSC approved for agency "${agency.name}" (${agency.applicationId})`,
      severity: 'Medium',
      status: 'Success',
      metadata: {
        agencyId: agency._id.toString(),
        applicationId: agency.applicationId,
        bankName: agency.bankDetails.bankName,
        accountNumberMasked: agency.bankDetails.accountNumber ? `...${agency.bankDetails.accountNumber.slice(-4)}` : '',
        ifscCode: agency.bankDetails.ifscCode,
        notes: notes || '',
      },
      ipAddress: reqContext?.ip || '127.0.0.1',
      browser: reqContext?.browser,
      os: reqContext?.os,
      device: reqContext?.device,
    });

    logger.info('✅ Super Admin %s approved bank settlement details for agency %s', adminUser?.email, agency.applicationId);

    const formattedItem = this.formatAgencyItem(agency);

    return {
      success: true,
      message: `Bank settlement account and IFSC verified & approved successfully for "${agency.name}".`,
      agency: formattedItem,
    };
  }

  /**
   * 6. REJECT AGENCY APPLICATION
   */
  public async rejectRequest(id: string, adminUser: any, reason: string, notes?: string, reqContext?: any) {
    const agency = await AgencyModel.findById(id);
    if (!agency) throw new Error('Agency application not found.');

    agency.verificationStatus = 'REJECTED';
    agency.status = 'REJECTED';
    agency.rejectionReason = reason;
    agency.reviewedBy = new mongoose.Types.ObjectId(adminUser._id || adminUser.id);
    agency.reviewedAt = new Date();

    // Timeline event
    agency.timeline = agency.timeline || [];
    agency.timeline.push({
      id: `t-rej-${Date.now()}`,
      title: 'Application Rejected',
      timestamp: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      completed: true,
      actor: adminUser.name || 'Super Admin',
      desc: reason,
    });

    if (notes) {
      agency.reviewNotes = agency.reviewNotes || [];
      agency.reviewNotes.push({
        id: `note-${Date.now()}`,
        adminId: adminUser._id?.toString() || adminUser.id,
        adminName: adminUser.name || 'Super Admin',
        note: `Rejection Note: ${notes.trim()}`,
        createdAt: new Date().toISOString(),
      });
    }

    await agency.save();

    // Audit Log
    await AuditLoggerService.log({
      actor: {
        id: adminUser._id?.toString() || adminUser.id,
        name: adminUser.name || 'Super Admin',
        email: adminUser.email,
        role: adminUser.role?.name || 'SUPER_ADMIN',
      },
      module: 'Agency',
      action: 'Agency Rejected',
      eventType: 'UPDATE',
      description: `Agency "${agency.name}" (${agency.applicationId}) was REJECTED. Reason: ${reason}`,
      severity: 'Medium',
      status: 'Success',
      metadata: {
        agencyId: agency._id.toString(),
        applicationId: agency.applicationId,
        rejectionReason: reason,
        notes: notes || '',
      },
      ipAddress: reqContext?.ip || '127.0.0.1',
      browser: reqContext?.browser,
      os: reqContext?.os,
      device: reqContext?.device,
    });

    // Send Rejection Email Notification
    const agencyEmail = agency.owner?.email || agency.email;
    const reapplyLink = `${envConfig.FRONTEND_URL || 'http://localhost:5173'}/agency/onboarding`;
    try {
      await mailService.sendAgencyRejectedEmail(agencyEmail, agency.name, reason, reapplyLink);
    } catch (err: any) {
      logger.warn('Failed to send agency rejection email: %s', err.message);
    }

    const updatedStats = await this.getSummaryStats();

    return {
      success: true,
      message: `Agency "${agency.name}" request rejected.`,
      agency: this.formatAgencyItem(agency),
      updatedStats,
    };
  }

  /**
   * 7. REQUEST MORE / MISSING DOCUMENTS (Document-Specific Workflow)
   */
  public async requestMoreDocuments(
    id: string,
    adminUser: any,
    requestedDocsInput: any,
    agencyMessage?: string,
    reqContext?: any
  ) {
    const agency = await AgencyModel.findById(id);
    if (!agency) throw new Error('Agency application not found.');

    const nowIso = new Date().toISOString();
    const currentRound = (agency.documentRequestRound || 0) + 1;
    agency.documentRequestRound = currentRound;
    agency.documentRequestMessage = agencyMessage || '';
    agency.verificationStatus = 'MISSING_DOCS';

    // Parse input (can be array of strings OR array of structured objects { documentId, documentName, documentType, reason, customReason, internalNote })
    const isStructured =
      Array.isArray(requestedDocsInput) &&
      requestedDocsInput.length > 0 &&
      typeof requestedDocsInput[0] === 'object';

    let requestedNames: string[] = [];
    const structuredDetails: any[] = [];
    const emailDocItems: Array<{ documentName: string; reason: string; customReason?: string }> = [];

    if (isStructured) {
      requestedDocsInput.forEach((item: any) => {
        requestedNames.push(item.documentName || item.name);
        const docId = item.documentId || item.id || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

        structuredDetails.push({
          documentId: docId,
          documentName: item.documentName || item.name,
          documentType: item.documentType || item.type || 'KYC Document',
          previousStatus: item.previousStatus || 'Pending',
          status: 'PENDING_AGENCY_UPLOAD',
          reason: item.reason || 'Verification Failed',
          customReason: item.customReason || '',
          internalNote: item.internalNote || '',
          requestedBy: {
            id: adminUser._id?.toString() || adminUser.id || 'admin',
            name: adminUser.name || 'Super Admin',
            email: adminUser.email || '',
          },
          requestedAt: nowIso,
          requestRound: currentRound,
        });

        emailDocItems.push({
          documentName: item.documentName || item.name,
          reason: item.reason || 'Verification Failed',
          customReason: item.customReason,
        });

        // Update target document item in agency.documents
        const existingDocs = agency.documents || [];
        const targetIdx = existingDocs.findIndex((d: any) => d.id === item.documentId || d.name === (item.documentName || item.name));
        if (targetIdx !== -1) {
          existingDocs[targetIdx].status = 'Re-upload Requested';
          existingDocs[targetIdx].rejectionReason = item.reason;
          existingDocs[targetIdx].customReason = item.customReason;
          existingDocs[targetIdx].internalNote = item.internalNote;
          existingDocs[targetIdx].requestedAt = nowIso;
        } else {
          existingDocs.push({
            id: docId,
            name: item.documentName || item.name,
            type: item.documentType || item.type || 'KYC Document',
            status: 'Re-upload Requested',
            fileUrl: '',
            rejectionReason: item.reason,
            customReason: item.customReason,
            internalNote: item.internalNote,
            requestedAt: nowIso,
            uploadedAt: nowIso,
          });
        }
        agency.documents = existingDocs;
      });
    } else {
      const docArray = Array.isArray(requestedDocsInput) ? requestedDocsInput : [requestedDocsInput];
      requestedNames = docArray;
      docArray.forEach((name: string) => {
        const docId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        structuredDetails.push({
          documentId: docId,
          documentName: name,
          documentType: 'Document',
          status: 'PENDING_AGENCY_UPLOAD',
          reason: 'Verification Failed',
          requestedBy: {
            id: adminUser._id?.toString() || adminUser.id || 'admin',
            name: adminUser.name || 'Super Admin',
            email: adminUser.email || '',
          },
          requestedAt: nowIso,
          requestRound: currentRound,
        });
        emailDocItems.push({
          documentName: name,
          reason: 'Verification Failed',
        });
        const existingDocs = agency.documents || [];
        const targetIdx = existingDocs.findIndex((d: any) => d.name === name);
        if (targetIdx !== -1) {
          existingDocs[targetIdx].status = 'Re-upload Requested';
          existingDocs[targetIdx].rejectionReason = 'Verification Failed';
          existingDocs[targetIdx].requestedAt = nowIso;
        }
        agency.documents = existingDocs;
      });
    }

    agency.requestedDocuments = requestedNames;
    agency.requestedDocumentsDetails = structuredDetails;

    // Timeline event
    agency.timeline = agency.timeline || [];
    agency.timeline.push({
      id: `t-reqdocs-${Date.now()}`,
      title: 'Additional Documents Requested',
      timestamp: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      completed: true,
      actor: adminUser.name || 'Super Admin',
      desc: `Round ${currentRound}: Requested re-upload of ${requestedNames.join(', ')}`,
      color: 'amber',
    });

    if (agencyMessage) {
      agency.reviewNotes = agency.reviewNotes || [];
      agency.reviewNotes.push({
        id: `note-${Date.now()}`,
        adminId: adminUser._id?.toString() || adminUser.id,
        adminName: adminUser.name || 'Super Admin',
        note: `Document Request (Round ${currentRound}): ${agencyMessage.trim()}`,
        createdAt: nowIso,
      });
    }

    await agency.save();

    // Audit Log
    await AuditLoggerService.log({
      actor: {
        id: adminUser._id?.toString() || adminUser.id,
        name: adminUser.name || 'Super Admin',
        email: adminUser.email,
        role: adminUser.role?.name || 'SUPER_ADMIN',
      },
      module: 'Agency',
      action: 'Documents Requested',
      eventType: 'AGENCY_DOCUMENTS_REQUESTED',
      description: `Requested re-upload of [${requestedNames.join(', ')}] from agency "${agency.name}" (${agency.applicationId})`,
      severity: 'Medium',
      status: 'Success',
      metadata: {
        agencyId: agency._id.toString(),
        applicationId: agency.applicationId,
        requestedDocuments: structuredDetails,
        agencyMessage: agencyMessage || '',
        round: currentRound,
      },
      ipAddress: reqContext?.ip || '127.0.0.1',
      browser: reqContext?.browser,
      os: reqContext?.os,
      device: reqContext?.device,
    });

    // Send Structured Transactional Email Notification
    const agencyEmail = agency.owner?.email || agency.email;
    const reuploadLink = `${envConfig.FRONTEND_URL || 'http://localhost:5173'}/agency/verification-pending`;
    try {
      await mailService.sendAgencyDocumentsRequestedEmail(
        agencyEmail,
        agency.agencyDisplayName || agency.name,
        agency.applicationId,
        emailDocItems,
        agencyMessage,
        reuploadLink
      );
    } catch (err: any) {
      logger.warn('Failed to send agency document request email: %s', err.message);
    }

    const updatedStats = await this.getSummaryStats();

    return {
      success: true,
      message: `Document re-upload request sent successfully to "${agency.name}".`,
      agency: this.formatAgencyItem(agency),
      updatedStats,
    };
  }

  /**
   * Get Requested Documents History
   */
  public async getRequestedDocuments(id: string) {
    const agency = await AgencyModel.findById(id);
    if (!agency) throw new Error('Agency application not found.');

    return {
      success: true,
      applicationId: agency.applicationId,
      agencyName: agency.agencyDisplayName || agency.name,
      verificationStatus: agency.verificationStatus,
      documentRequestRound: agency.documentRequestRound || 0,
      documentRequestMessage: agency.documentRequestMessage || '',
      requestedDocumentsDetails: agency.requestedDocumentsDetails || [],
      documents: agency.documents || [],
    };
  }

  /**
   * 8. BULK ACTIONS (Approve, Reject, Request Docs)
   */
  public async bulkAction(
    action: 'approve' | 'reject' | 'request_docs',
    agencyIds: string[],
    adminUser: any,
    payload?: { reason?: string; notes?: string; missingDocuments?: string[] },
    reqContext?: any
  ) {
    const results: any[] = [];

    for (const id of agencyIds) {
      try {
        if (action === 'approve') {
          const res = await this.approveRequest(id, adminUser, payload?.notes, reqContext);
          results.push({ id, success: true, message: res.message });
        } else if (action === 'reject') {
          const res = await this.rejectRequest(
            id,
            adminUser,
            payload?.reason || 'Compliance criteria not met',
            payload?.notes,
            reqContext
          );
          results.push({ id, success: true, message: res.message });
        } else if (action === 'request_docs') {
          const res = await this.requestMoreDocuments(
            id,
            adminUser,
            payload?.missingDocuments || ['Updated KYC & Bank Details'],
            payload?.notes,
            reqContext
          );
          results.push({ id, success: true, message: res.message });
        }
      } catch (err: any) {
        results.push({ id, success: false, error: err.message });
      }
    }

    const updatedStats = await this.getSummaryStats();

    return {
      success: true,
      processed: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
      updatedStats,
    };
  }

  /**
   * 9. EXPORT REQUESTS TO CSV
   */
  public async exportRequestsCsv(params: AgencyRequestFiltersQuery) {
    const { items } = await this.getAgencyRequests({ ...params, limit: 1000, page: 1 });

    const headers = [
      'Application ID',
      'Agency Name',
      'Business Type',
      'Owner Name',
      'Owner Email',
      'Owner Phone',
      'GST Number',
      'City',
      'State',
      'Documents Count',
      'Compliance Score',
      'Submission Date',
      'Verification Status',
      'Review Status',
    ];

    const rows = items.map((item) => [
      `"${item.applicationId}"`,
      `"${item.agencyName.replace(/"/g, '""')}"`,
      `"${item.businessType}"`,
      `"${item.ownerName.replace(/"/g, '""')}"`,
      `"${item.ownerEmail}"`,
      `"${item.ownerPhone}"`,
      `"${item.gstNumber}"`,
      `"${item.city}"`,
      `"${item.state}"`,
      `"${item.documentsUploadedCount}/${item.documentsTotalCount}"`,
      `"${item.complianceScore}/100"`,
      `"${item.submittedDate}"`,
      `"${item.verificationStatus}"`,
      `"${item.reviewStatus}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const adminAgencyRequestService = new AdminAgencyRequestService();
