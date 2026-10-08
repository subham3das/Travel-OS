import mongoose from 'mongoose';
import { RegistrationDraftModel, IRegistrationDraft } from '../models/registrationDraft.model.js';
import { ApprovalRequestModel } from '../models/approvalRequest.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { PartnerSubscriptionModel } from '../models/partnerSubscription.model.js';
import { SubscriptionPaymentModel } from '../models/subscriptionPayment.model.js';
import { InvoiceModel } from '../models/invoice.model.js';
import { mailService } from './mail.service.js';
import { AuditLoggerService } from './auditLogger.service.js';
import { envConfig } from '../config/env.config.js';
import { logger } from '../config/logger.config.js';
import { AppError } from '../utils/errors.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';

export interface SaveDraftInput {
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

export interface SubmitRegistrationInput {
  draftId: string;
  subscriptionId: string;
  paymentId: string;
  orderId?: string;
}

export function extractAndNormalizeDocuments(rawDocs: any): Array<{
  id: string;
  name: string;
  type: string;
  status: 'Pending';
  fileUrl: string;
  size?: number;
  uploadedAt: string;
}> {
  if (!rawDocs) return [];
  const list: any[] = [];
  const seenTypes = new Set<string>();

  const addDoc = (type: string, defaultName: string, item: any, id: string) => {
    if (!item) return;
    const url = item.fileUrl || item.url || item.dataUrl || item.documentUrl || item.secureUrl || item.secure_url;
    if (!url || url === '#' || typeof url !== 'string') return;
    const name = item.name || item.title || defaultName;
    const docType = item.type || type;
    if (seenTypes.has(docType.toLowerCase())) return;
    seenTypes.add(docType.toLowerCase());
    list.push({
      id: item.id || id,
      name,
      type: docType,
      status: item.status || 'Pending',
      fileUrl: url,
      url,
      size: Number(item.size) || 0,
      uploadedAt: item.uploadedAt || new Date().toISOString(),
    });
  };

  if (Array.isArray(rawDocs)) {
    for (let i = 0; i < rawDocs.length; i++) {
      const doc = rawDocs[i];
      if (!doc) continue;
      // If it's a wrapper object containing document keys:
      if (
        doc.registrationCert ||
        doc.panCard ||
        doc.governmentIdFile ||
        doc.selfieFile ||
        doc.addressProofFile ||
        doc.gstCert
      ) {
        addDoc('Business Registration', 'Business Registration Certificate', doc.registrationCert, 'doc-reg-cert');
        addDoc('GST Certificate', 'GST Certificate', doc.gstCert, 'doc-gst-cert');
        addDoc('PAN Card', 'Company PAN Card', doc.panCard, 'doc-pan-card');
        addDoc(
          'Government ID',
          `Owner Government ID (${doc.governmentIdType || 'Aadhaar'})`,
          doc.governmentIdFile,
          'doc-gov-id'
        );
        addDoc('Owner Photo', 'Owner Photo / Selfie', doc.selfieFile, 'doc-selfie');
        addDoc('Address Proof', 'Office Address Proof', doc.addressProofFile, 'doc-address-proof');
      } else {
        const url = doc.fileUrl || doc.url || doc.dataUrl || doc.documentUrl || doc.secureUrl || doc.secure_url;
        if (url && url !== '#' && typeof url === 'string') {
          list.push({
            id: doc.id || `doc-${Date.now()}-${i}`,
            name: doc.name || doc.title || 'KYC Document',
            type: doc.type || 'Identity Proof',
            status: doc.status || 'Pending',
            fileUrl: url,
            url,
            size: Number(doc.size) || 0,
            uploadedAt: doc.uploadedAt || new Date().toISOString(),
          });
        }
      }
    }
  } else if (typeof rawDocs === 'object') {
    addDoc('Business Registration', 'Business Registration Certificate', rawDocs.registrationCert, 'doc-reg-cert');
    addDoc('GST Certificate', 'GST Certificate', rawDocs.gstCert, 'doc-gst-cert');
    addDoc('PAN Card', 'Company PAN Card', rawDocs.panCard, 'doc-pan-card');
    addDoc(
      'Government ID',
      `Owner Government ID (${rawDocs.governmentIdType || 'Aadhaar'})`,
      rawDocs.governmentIdFile,
      'doc-gov-id'
    );
    addDoc('Owner Photo', 'Owner Photo / Selfie', rawDocs.selfieFile, 'doc-selfie');
    addDoc('Address Proof', 'Office Address Proof', rawDocs.addressProofFile, 'doc-address-proof');
  }

  return list;
}

export class RegistrationService {
  /**
   * 1. Save or Update Registration Draft in MongoDB
   */
  public async saveDraft(input: SaveDraftInput) {
    const serviceType = input.serviceType === 'car_rental' ? 'car_rental' : 'agency';
    const draftId = input.draftId?.trim() || `DFT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const existingDraft = await RegistrationDraftModel.findOne({ draftId }).lean();

    const updateDoc: any = {
      serviceType,
      updatedAt: new Date(),
    };

    if (input.userId) updateDoc.userId = input.userId;

    // Merge businessDetails instead of blind overwrite
    if (input.businessDetails && typeof input.businessDetails === 'object') {
      updateDoc.businessDetails = {
        ...(existingDraft?.businessDetails || {}),
        ...input.businessDetails,
      };
    } else if (existingDraft?.businessDetails) {
      updateDoc.businessDetails = existingDraft.businessDetails;
    }

    // Merge profileDetails instead of blind overwrite
    if (input.profileDetails && typeof input.profileDetails === 'object') {
      updateDoc.profileDetails = {
        ...(existingDraft?.profileDetails || {}),
        ...input.profileDetails,
      };
    } else if (existingDraft?.profileDetails) {
      updateDoc.profileDetails = existingDraft.profileDetails;
    }

    // Documents: Only overwrite if a non-empty array is provided; never wipe out with empty []
    if (Array.isArray(input.documents) && input.documents.length > 0) {
      updateDoc.documents = input.documents;
    } else if (existingDraft?.documents && existingDraft.documents.length > 0) {
      updateDoc.documents = existingDraft.documents;
    }

    // Bank: Merge non-empty fields to preserve bankName, accountNumber, ifscCode, branch
    const incomingBank = input.bank || (input as any).bankDetails;
    if (incomingBank && typeof incomingBank === 'object') {
      const existingBank = existingDraft?.bank || {};
      updateDoc.bank = {
        accountHolderName: incomingBank.accountHolderName || existingBank.accountHolderName || '',
        bankName: incomingBank.bankName || existingBank.bankName || '',
        accountNumber: incomingBank.accountNumber || existingBank.accountNumber || '',
        ifscCode: incomingBank.ifscCode || existingBank.ifscCode || '',
        branch: incomingBank.branch || existingBank.branch || '',
        upiId: incomingBank.upiId || existingBank.upiId || '',
        accountType: incomingBank.accountType || existingBank.accountType || 'Current Account',
        payoutMethod: incomingBank.payoutMethod || existingBank.payoutMethod || 'bank',
      };
    } else if (existingDraft?.bank) {
      updateDoc.bank = existingDraft.bank;
    }

    if (input.currentStep !== undefined) updateDoc.currentStep = input.currentStep;
    if (input.coupon !== undefined) updateDoc.coupon = input.coupon;

    const draft = await RegistrationDraftModel.findOneAndUpdate(
      { draftId },
      {
        $set: updateDoc,
        $setOnInsert: {
          draftId,
          createdAt: new Date(),
          isCompleted: false,
          paymentPending: true,
        },
      },
      { upsert: true, new: true }
    );

    logger.info('📝 [DRAFT DEBUG] saveDraft %s (step %d): docs=%d, bankName="%s", accNum="%s"',
      draft.draftId,
      draft.currentStep,
      draft.documents?.length || 0,
      draft.bank?.bankName || '',
      draft.bank?.accountNumber ? '***' + draft.bank.accountNumber.slice(-4) : ''
    );

    return {
      success: true,
      draftId: draft.draftId,
      serviceType: draft.serviceType,
      currentStep: draft.currentStep,
      lastSaved: draft.updatedAt.toISOString(),
      businessDetails: draft.businessDetails,
      profileDetails: draft.profileDetails,
      documents: draft.documents,
      bank: draft.bank,
      coupon: draft.coupon,
    };
  }

  /**
   * 2. Retrieve Saved Draft from MongoDB
   */
  public async getDraft(draftIdOrEmail: string) {
    if (!draftIdOrEmail?.trim()) {
      throw new AppError('Draft identifier or email is required', HTTP_STATUS.BAD_REQUEST);
    }

    const clean = draftIdOrEmail.trim();
    const draft = await RegistrationDraftModel.findOne({
      $or: [
        { draftId: clean },
        { 'businessDetails.email': clean.toLowerCase() },
        { 'businessDetails.loginEmail': clean.toLowerCase() },
      ],
      isCompleted: false,
    })
      .sort({ updatedAt: -1 })
      .lean();

    if (!draft) {
      return null;
    }

    return {
      draftId: draft.draftId,
      serviceType: draft.serviceType,
      currentStep: draft.currentStep,
      businessDetails: draft.businessDetails || {},
      profileDetails: draft.profileDetails || {},
      documents: draft.documents || [],
      bank: draft.bank || {},
      coupon: draft.coupon || null,
      paymentPending: draft.paymentPending,
      lastSaved: draft.updatedAt ? new Date(draft.updatedAt).toISOString() : new Date().toISOString(),
    };
  }

  /**
   * 3. Final Submission After Successful Payment (MongoDB Transaction-Safe)
   */
  public async submitRegistration(input: SubmitRegistrationInput) {
    const { draftId, subscriptionId, paymentId, orderId } = input;

    if (!draftId || !subscriptionId || !paymentId) {
      throw new AppError('Missing draftId, subscriptionId, or paymentId for registration submission', HTTP_STATUS.BAD_REQUEST);
    }

    // A. Retrieve Draft
    const draft = await RegistrationDraftModel.findOne({ draftId });
    if (!draft) {
      throw new AppError('Registration draft not found', HTTP_STATUS.NOT_FOUND);
    }

    // B. Retrieve & Verify Subscription
    const subscription = await PartnerSubscriptionModel.findById(subscriptionId);
    if (!subscription) {
      throw new AppError('Subscription record not found for this application', HTTP_STATUS.NOT_FOUND);
    }

    if (draft.isCompleted) {
      const existingAgency = await AgencyModel.findOne({
        $or: [
          ...(subscription.agencyId ? [{ _id: subscription.agencyId }] : []),
          ...(subscription.partnerId ? [{ _id: subscription.partnerId }] : []),
          { email: (draft.businessDetails?.email || subscription.email || '').trim().toLowerCase() },
          { loginEmail: (draft.businessDetails?.email || subscription.email || '').trim().toLowerCase() },
        ],
        isDeleted: false,
      });

      return {
        success: true,
        alreadySubmitted: true,
        agencyId: existingAgency?._id?.toString(),
        applicationId: existingAgency?.applicationId || subscription.applicationId,
        message: 'Registration was already successfully submitted and processed.',
      };
    }

    if (subscription.status !== 'active') {
      throw new AppError('Subscription payment has not been verified or is not active yet', HTTP_STATUS.BAD_REQUEST);
    }

    const bDetails = draft.businessDetails || {};
    const pDetails = draft.profileDetails || {};
    const bankDetails = draft.bank || {};
    const docs = draft.documents || [];

    logger.info('🔍 [SUBMIT DEBUG] Starting submitRegistration: draftId=%s, subId=%s, paymentId=%s', draftId, subscriptionId, paymentId);
    logger.info('🔍 [SUBMIT DEBUG] Draft Snapshot: docs=%d, bank=%o, bDetails=%o, pDetails=%o',
      docs.length,
      bankDetails,
      { name: bDetails.legalBusinessName || bDetails.businessName, gst: bDetails.gstNumber },
      { logoUrl: pDetails.logoUrl, coverUrl: pDetails.coverUrl }
    );

    const isCarRental = draft.serviceType === 'car_rental';
    const businessName = (bDetails.businessName || bDetails.agencyDisplayName || bDetails.legalBusinessName || 'Partner Business').trim();
    const ownerName = (bDetails.ownerName || bDetails.fullName || 'Partner Owner').trim();
    const email = (bDetails.email || bDetails.loginEmail || subscription.email || '').trim().toLowerCase();
    const phone = (bDetails.phone || subscription.phone || '').trim();

    if (!email) {
      throw new AppError('A valid email address is required in the registration data', HTTP_STATUS.BAD_REQUEST);
    }

    // Generate Standard Reference Number: AGY-REQ-2026-XXXXX or CR-REQ-2026-XXXXX
    const year = new Date().getFullYear();
    const prefix = isCarRental ? 'CR-REQ' : 'AGY-REQ';
    let refNum = `${prefix}-${year}-${Math.floor(10000 + Math.random() * 90000)}`;

    // Normalize documents from draft.documents or fallback to bDetails/pDetails
    const docSource = (Array.isArray(docs) && docs.length > 0)
      ? docs
      : (bDetails.documents || bDetails.verificationData || pDetails.documents || docs);
    const normalizedDocs = extractAndNormalizeDocuments(docSource);
    const govIdDoc = normalizedDocs.find(
      (d: any) =>
        d.type === 'Government ID' ||
        d.type.toLowerCase().includes('gov') ||
        d.type.toLowerCase().includes('aadhaar') ||
        d.type.toLowerCase().includes('passport')
    );
    const selfieDoc = normalizedDocs.find(
      (d: any) =>
        d.type === 'Owner Photo' ||
        d.type.toLowerCase().includes('selfie') ||
        d.type.toLowerCase().includes('photo')
    );
    const addrDoc = normalizedDocs.find(
      (d: any) =>
        d.type === 'Address Proof' ||
        d.type.toLowerCase().includes('address')
    );

    logger.info('🔍 [SUBMIT DEBUG] Normalized Documents Count: %d, URLs: %o',
      normalizedDocs.length,
      normalizedDocs.map((d: any) => ({ name: d.name, type: d.type, fileUrl: d.fileUrl }))
    );

    const session = await mongoose.startSession();
    let transactionCommitted = false;

    try {
      session.startTransaction();

      // 1. Create / Update Business Record (Status: PENDING, Verification: PENDING, canLogin: true)
      const agencyDoc: any = {
        applicationId: refNum,
        name: businessName,
        legalBusinessName: bDetails.legalBusinessName || businessName,
        agencyDisplayName: bDetails.agencyDisplayName || businessName,
        email,
        loginEmail: email,
        phone,
        ownerName,
        businessType: isCarRental ? 'Car Rental' : (bDetails.businessType || 'Travel Agency'),
        businessTypes: [isCarRental ? 'car_rental' : 'agency'],
        activeBusiness: isCarRental ? 'car_rental' : 'agency',
        yearEstablished: bDetails.yearEstablished || bDetails.establishedYear || pDetails.yearsOfExperience || '',
        registrationNumber: bDetails.registrationNumber || bDetails.businessRegistrationNumber || '',
        gstNumber: bDetails.gstNumber || '',
        panNumber: bDetails.panNumber || bDetails.ownerPanNumber || '',
        businessAddress: bDetails.businessAddress || bDetails.streetAddress || bDetails.address || '',
        city: bDetails.city || '',
        state: bDetails.state || '',
        pinCode: bDetails.pinCode || '',
        country: bDetails.country || 'India',
        website: bDetails.website || pDetails.website || '',
        description: bDetails.description || pDetails.about || pDetails.description || '',
        logo: pDetails.logoUrl || '',
        banner: pDetails.coverUrl || '',
        owner: {
          name: ownerName,
          email,
          phone,
          panNumber: bDetails.ownerPanNumber || bDetails.panNumber || '',
          aadhaarNumber: bDetails.aadhaarNumber || '',
          governmentIdType: bDetails.governmentIdType || 'Aadhaar',
          governmentIdUrl: govIdDoc?.fileUrl || bDetails.governmentIdUrl || '',
          selfieUrl: selfieDoc?.fileUrl || bDetails.selfieUrl || '',
          addressProofUrl: addrDoc?.fileUrl || bDetails.addressProofUrl || '',
        },
        profile: {
          logoUrl: pDetails.logoUrl || '',
          coverUrl: pDetails.coverUrl || '',
          tagline: pDetails.tagline || '',
          about: pDetails.about || bDetails.description || '',
          yearsOfExperience: pDetails.yearsOfExperience || bDetails.yearEstablished || '',
          teamSize: pDetails.teamSize || '',
          selectedServices: pDetails.selectedServices || [],
          destinations: pDetails.destinations || [],
          languages: pDetails.languages || [],
          phone: pDetails.phone || phone,
          email: pDetails.email || email,
          website: pDetails.website || bDetails.website || '',
          instagram: pDetails.instagram || '',
          facebook: pDetails.facebook || '',
        },
        bankDetails: {
          accountHolderName: (bankDetails.accountHolderName || bDetails.accountHolderName || ownerName || '').trim(),
          bankName: (bankDetails.bankName || bDetails.bankName || '').trim(),
          accountNumber: (bankDetails.accountNumber || bDetails.accountNumber || '').trim(),
          ifscCode: (bankDetails.ifscCode || bDetails.ifscCode || '').trim().toUpperCase(),
          branch: (bankDetails.branch || bDetails.branch || (bankDetails.ifscCode ? 'Valid IFSC format' : '')).trim(),
          upiId: (bankDetails.upiId || bDetails.upiId || '').trim(),
          accountType: bankDetails.accountType || bDetails.accountType || 'Current Account',
          payoutMethod: bankDetails.payoutMethod || bDetails.payoutMethod || 'bank',
          verified: false,
          status: 'Pending',
        },
        documents: normalizedDocs,
        verificationStatus: 'UNDER_REVIEW',
        status: 'PENDING',
        onboardingStatus: 'UNDER_REVIEW',
        paymentStatus: 'PAID',
        approvalStatus: 'PENDING',
        canLogin: true,
        isActive: true,
        complianceScore: 80,
        timeline: [
          {
            id: `t1-${Date.now()}`,
            title: 'Application Submitted & Fee Paid',
            timestamp: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            completed: true,
            desc: `One-time registration payment verified (Payment ID: ${paymentId}). Queued for Super Admin review.`,
          },
        ],
      };

      if (isCarRental) {
        agencyDoc.carRentalVerificationStatus = 'PENDING';
        agencyDoc.carRentalProfile = {
          businessName,
          ownerName,
          phone,
          email,
          address: agencyDoc.businessAddress,
          city: agencyDoc.city,
          state: agencyDoc.state,
          country: agencyDoc.country,
          pinCode: agencyDoc.pinCode,
          fleetSize: Number(bDetails.fleetSize || pDetails.fleetSize) || 1,
          operatingCities: bDetails.operatingCities || pDetails.operatingCities || [agencyDoc.city],
          workingHours: bDetails.workingHours || '24/7 Operations',
          emergencyContact: bDetails.emergencyContact || phone,
          description: agencyDoc.description,
          documents: agencyDoc.documents,
          bankDetails: agencyDoc.bankDetails,
        };
      }

      let newAgency = await AgencyModel.findOne({
        $or: [
          ...(subscription.agencyId && mongoose.Types.ObjectId.isValid(String(subscription.agencyId))
            ? [{ _id: new mongoose.Types.ObjectId(String(subscription.agencyId)) }]
            : []),
          ...(subscription.partnerId && mongoose.Types.ObjectId.isValid(String(subscription.partnerId))
            ? [{ _id: new mongoose.Types.ObjectId(String(subscription.partnerId)) }]
            : []),
          ...(draft.userId && mongoose.Types.ObjectId.isValid(String(draft.userId))
            ? [
                { _id: new mongoose.Types.ObjectId(String(draft.userId)) },
                { ownerId: new mongoose.Types.ObjectId(String(draft.userId)) },
              ]
            : []),
          { email },
          { loginEmail: email },
          { 'owner.email': email },
        ],
        isDeleted: false,
      }).session(session);

      if (newAgency) {
        // Retain existing password, credentials, and original applicationId if present
        delete agencyDoc.passwordHash;
        if (newAgency.applicationId) {
          agencyDoc.applicationId = newAgency.applicationId;
          refNum = newAgency.applicationId;
        }

        // Apply every finalized field onto existing Agency document
        newAgency.set(agencyDoc);
        newAgency.documents = agencyDoc.documents;
        newAgency.owner = agencyDoc.owner;
        newAgency.profile = agencyDoc.profile;
        newAgency.bankDetails = agencyDoc.bankDetails;
        newAgency.logo = agencyDoc.logo;
        newAgency.banner = agencyDoc.banner;
        newAgency.paymentStatus = 'PAID';
        newAgency.onboardingStatus = 'UNDER_REVIEW';
        newAgency.verificationStatus = 'UNDER_REVIEW';
        newAgency.status = 'PENDING';
        newAgency.approvalStatus = 'PENDING';
        if (agencyDoc.carRentalProfile) {
          newAgency.carRentalProfile = agencyDoc.carRentalProfile;
        }

        // Explicitly mark modified for nested subdocuments so Mongoose writes to MongoDB
        newAgency.markModified('documents');
        newAgency.markModified('owner');
        newAgency.markModified('profile');
        newAgency.markModified('bankDetails');
        newAgency.markModified('logo');
        newAgency.markModified('banner');
        newAgency.markModified('timeline');
        if (agencyDoc.carRentalProfile) {
          newAgency.markModified('carRentalProfile');
        }

        await newAgency.save({ session });
      } else {
        agencyDoc.paymentStatus = 'PAID';
        const [created] = await AgencyModel.create([agencyDoc], { session });
        newAgency = created;
      }

      // PHASE 5: Immediately verify MongoDB persistence after save
      const persistedCheck = await AgencyModel.findById(newAgency._id).session(session).lean();
      logger.info('🔍 [SUBMIT DEBUG] PHASE 5 MongoDB Agency Saved: docs=%d, bankName="%s", accNum="%s", ownerEmail="%s"',
        persistedCheck?.documents?.length || 0,
        persistedCheck?.bankDetails?.bankName || '',
        persistedCheck?.bankDetails?.accountNumber || '',
        persistedCheck?.owner?.email || ''
      );

      // 2. Upsert Formal Approval Request using finalized Agency snapshot
      const approvalDoc = {
        applicationId: newAgency.applicationId || refNum,
        agencyId: newAgency._id,
        userId: newAgency.ownerId || draft.userId,
        serviceType: isCarRental ? 'carRental' : 'agency',
        businessName: newAgency.name || businessName,
        ownerName: newAgency.ownerName || ownerName,
        email: newAgency.email || email,
        phone: newAgency.phone || phone,
        city: newAgency.city || agencyDoc.city,
        state: newAgency.state || agencyDoc.state,
        businessDetails: bDetails,
        profileDetails: pDetails,
        documents: newAgency.documents || agencyDoc.documents,
        bank: newAgency.bankDetails || agencyDoc.bankDetails,
        subscriptionId: subscription._id,
        subscriptionPlan: isCarRental ? 'Car Rental Partner Registration (₹1000)' : 'Travel Agency Registration (₹1000)',
        subscriptionAmount: subscription.amountPaid || 1000,
        paymentId,
        paymentStatus: 'SUCCESS',
        registrationStatus: 'Pending Approval',
        submittedAt: new Date(),
      };

      // Upsert by agencyId or email — strictly one approval record per agency, no duplicates
      await ApprovalRequestModel.findOneAndUpdate(
        { $or: [{ agencyId: newAgency._id }, { email: newAgency.email || email }] },
        { $set: approvalDoc },
        { upsert: true, session }
      );

      logger.info('🔍 [SUBMIT DEBUG] PHASE 6 ApprovalRequest Upserted: %o', {
        applicationId: approvalDoc.applicationId,
        agencyId: approvalDoc.agencyId,
        documentsCount: approvalDoc.documents?.length || 0,
        bank: approvalDoc.bank,
      });

      // 3. Link Subscription to newly created Agency
      subscription.partnerId = newAgency._id as any;
      subscription.applicationId = refNum;
      await subscription.save({ session });

      // 4. Mark Registration Draft as Completed
      draft.isCompleted = true;
      draft.paymentPending = false;
      draft.paymentId = paymentId;
      draft.paymentStatus = 'SUCCESS';
      await draft.save({ session });

      await session.commitTransaction();
      transactionCommitted = true;

      // 5. Send Professional Notification Emails (Asynchronously)
      mailService
        .sendPartnerRegistrationReceivedEmail({
          to: email,
          businessName,
          serviceType: isCarRental ? 'Car Rental' : 'Travel Agency',
          referenceNumber: refNum,
          paymentId,
          amountPaid: subscription.amountPaid || 1000,
          trackLink: `${envConfig.FRONTEND_URL || 'http://localhost:5173'}/agency/verification-pending?appId=${refNum}`,
        })
        .catch((err) => logger.warn('Failed to send registration confirmation email: %s', err.message));

      mailService
        .sendSuperAdminNewAgencyAlertEmail(
          (envConfig as any).ADMIN_ALERT_EMAIL || envConfig.EMAIL_FROM_ADDRESS || 'admin@apnatrip.com',
          businessName,
          refNum,
          `${envConfig.FRONTEND_URL || 'http://localhost:5173'}/admin/agencies?search=${refNum}`
        )
        .catch((err) => logger.warn('Failed to send admin application alert email: %s', err.message));

      // 6. Record Audit Log
      await AuditLoggerService.log({
        actor: {
          id: newAgency._id.toString(),
          name: businessName,
          email,
          role: 'Agency',
        },
        module: 'Registration',
        action: 'Partner Registration Submitted',
        eventType: 'CREATE',
        description: `New partner application submitted for ${businessName} (${refNum}) with verified payment (${paymentId}).`,
        severity: 'Medium',
        status: 'Success',
        metadata: {
          agencyId: newAgency._id.toString(),
          applicationId: refNum,
          serviceType: draft.serviceType,
          paymentId,
          amount: subscription.amountPaid,
        },
      });

      return {
        success: true,
        referenceNumber: refNum,
        applicationId: refNum,
        serviceType: draft.serviceType,
        businessName,
        email,
        paymentId,
        amountPaid: subscription.amountPaid,
        invoiceNumber: subscription.invoiceNumber,
        status: 'Pending Approval',
        message: 'Your payment has been received and your registration has been submitted for review.',
        estimatedReviewTime: '24–48 Hours',
      };
    } catch (error: any) {
      if (!transactionCommitted) {
        await session.abortTransaction();
      }
      logger.error('Registration submission transaction failed: %s', error.message);
      throw error;
    } finally {
      session.endSession();
    }
  }
}

export const registrationService = new RegistrationService();
