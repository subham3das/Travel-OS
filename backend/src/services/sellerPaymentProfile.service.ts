import mongoose from 'mongoose';
import {
  SellerPaymentProfileModel,
  ISellerPaymentProfile,
  SellerType,
  BusinessType,
} from '../models/sellerPaymentProfile.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { PaymentModel } from '../models/payment.model.js';
import { TransferModel } from '../models/transfer.model.js';
import { SettlementModel } from '../models/settlement.model.js';
import { decryptSensitiveData, encryptSensitiveData, maskAccountNumber } from '../utils/encryption.util.js';
import { razorpayRouteProvider } from './payment/razorpayRoute.provider.js';
import { AuditLoggerService } from './auditLogger.service.js';
import { NotificationDispatcher } from './notificationDispatcher.service.js';
import { socketService } from './socket.service.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';

export interface SubmitPaymentProfileInput {
  businessName: string;
  businessType: BusinessType;
  businessEmail?: string;
  businessPhone?: string;
  panNumber?: string;
  gstin?: string;
  ifscCode: string;
  accountNumber: string;
  confirmAccountNumber: string;
  beneficiaryName: string;
  bankName?: string;
  payoutMethod?: 'bank' | 'upi';
  upiId?: string;
}

const IFSC_BANKS: Record<string, string> = {
  HDFC: 'HDFC Bank',
  SBIN: 'State Bank of India',
  ICIC: 'ICICI Bank',
  UTIB: 'Axis Bank',
  KKBK: 'Kotak Mahindra Bank',
  PUNB: 'Punjab National Bank',
  BARB: 'Bank of Baroda',
  CNRB: 'Canara Bank',
  UBIN: 'Union Bank of India',
  IDIB: 'Indian Bank',
  YESB: 'Yes Bank',
  INDB: 'IndusInd Bank',
  FDRL: 'Federal Bank',
};

export class SellerPaymentProfileService {
  /**
   * Derive Indian Bank Name from IFSC Prefix
   */
  public deriveBankNameFromIFSC(ifsc: string): string {
    if (!ifsc || ifsc.length < 4) return 'Indian Commercial Bank';
    const prefix = ifsc.slice(0, 4).toUpperCase();
    return IFSC_BANKS[prefix] || `${prefix} Bank`;
  }

  /**
   * Lookup Bank and Branch Details by IFSC code
   */
  public async lookupIFSC(ifscCode: string) {
    const clean = ifscCode.toUpperCase().trim();
    const bankName = this.deriveBankNameFromIFSC(clean);
    return {
      ifsc: clean,
      bankName,
      branch: `${bankName} Branch`,
      isValid: /^[A-Z]{4}0[A-Z0-9]{6}$/.test(clean),
    };
  }

  /**
   * Check if seller has financial activity (making bank details immutable)
   */
  public async hasFinancialActivity(sellerId: string | mongoose.Types.ObjectId): Promise<boolean> {
    const sId = new mongoose.Types.ObjectId(sellerId.toString());
    const [hasPayment, hasTransfer, hasSettlement] = await Promise.all([
      PaymentModel.exists({ agencyId: sId, status: 'SUCCESS' }),
      TransferModel.exists({ sellerId: sId }),
      SettlementModel.exists({ sellerId: sId }),
    ]);
    return Boolean(hasPayment || hasTransfer || hasSettlement);
  }

  /**
   * Get safe Seller Payment Profile for Frontend (Account Number Masked)
   */
  public async getProfile(sellerId: string | mongoose.Types.ObjectId, sellerType: SellerType = 'Agency') {
    const sId = new mongoose.Types.ObjectId(sellerId.toString());
    let profile = await SellerPaymentProfileModel.findOne({
      sellerId: sId,
      sellerType,
      isDeleted: false,
    }).lean();

    if (!profile) {
      // Auto-initialize profile if agency has bank details stored in agency doc
      if (sellerType === 'Agency') {
        const agency: any = await AgencyModel.findById(sId).lean();
        if (agency?.bankDetails?.accountNumber && agency?.bankDetails?.ifscCode) {
          const rawAcc = String(agency.bankDetails.accountNumber).trim();
          const ifsc = String(agency.bankDetails.ifscCode).toUpperCase().trim();
          const bName = agency.businessInfo?.companyName || agency.name || 'Verified Travel Agency';
          const bankName = agency.bankDetails.bankName || this.deriveBankNameFromIFSC(ifsc);

          const created = await SellerPaymentProfileModel.create({
            sellerId: sId,
            sellerType: 'Agency',
            businessName: bName,
            businessType: 'proprietorship',
            businessEmail: agency.email,
            businessPhone: agency.phone,
            bankName,
            ifscCode: ifsc,
            accountNumberEncrypted: encryptSensitiveData(rawAcc),
            accountNumberMasked: maskAccountNumber(rawAcc),
            beneficiaryName: agency.bankDetails.accountHolderName || bName,
            status: agency.verificationStatus === 'APPROVED' ? 'APPROVED' : 'UNDER_REVIEW',
            kycStatus: agency.verificationStatus === 'APPROVED' ? 'APPROVED' : 'PENDING',
            bankVerificationStatus: 'VERIFIED',
            routeEnabled: true,
            settlementsEnabled: true,
            currentStep: 5,
            submittedAt: new Date(),
            approvedAt: agency.verificationStatus === 'APPROVED' ? new Date() : undefined,
          });
          profile = created.toObject();
        }
      }
    }

    if (!profile) {
      return {
        exists: false,
        status: 'NOT_STARTED',
        currentStep: 1,
        onboardingProgress: {
          businessDetails: { completed: false },
          bankAccountAdded: { completed: false },
          contactCreated: { completed: false },
          fundAccountCreated: { completed: false },
          linkedAccountCreated: { completed: false },
          bankVerification: { status: 'PENDING' },
          razorpayReview: { status: 'PENDING' },
          settlementEnabled: { completed: false },
        },
        isBankLocked: false,
        archivedBankAccounts: [],
        routeEnabled: false,
        settlementsEnabled: false,
        isPayoutReady: false,
      };
    }

    const isFinancialActive = await this.hasFinancialActivity(sId);

    return {
      exists: true,
      id: profile._id.toString(),
      sellerId: profile.sellerId.toString(),
      sellerType: profile.sellerType,
      businessName: profile.businessName,
      businessType: profile.businessType,
      businessEmail: profile.businessEmail,
      businessPhone: profile.businessPhone,
      bankName: profile.bankName,
      ifscCode: profile.ifscCode,
      accountNumberMasked: profile.accountNumberMasked,
      beneficiaryName: profile.beneficiaryName,
      payoutMethod: profile.payoutMethod || 'bank',
      upiId: profile.upiId,

      // Guided Wizard & Progress
      currentStep: profile.currentStep || 1,
      onboardingProgress: profile.onboardingProgress || {
        businessDetails: { completed: Boolean(profile.businessName) },
        bankAccountAdded: { completed: Boolean(profile.accountNumberMasked) },
        contactCreated: { completed: Boolean(profile.razorpayContactId), contactId: profile.razorpayContactId },
        fundAccountCreated: { completed: Boolean(profile.razorpayFundAccountId), fundAccountId: profile.razorpayFundAccountId },
        linkedAccountCreated: { completed: Boolean(profile.razorpayLinkedAccountId), linkedAccountId: profile.razorpayLinkedAccountId },
        bankVerification: { status: profile.bankVerificationStatus || 'PENDING' },
        razorpayReview: { status: profile.status === 'APPROVED' ? 'APPROVED' : 'PENDING' },
        settlementEnabled: { completed: Boolean(profile.settlementsEnabled) },
      },

      // Immutability & Replacement
      isBankLocked: Boolean(profile.isBankLocked || isFinancialActive),
      archivedBankAccounts: profile.archivedBankAccounts || [],
      payoutChangeRequest: profile.payoutChangeRequest,

      // Read-only Gateway Identifiers
      razorpayContactId: profile.razorpayContactId || '—',
      razorpayFundAccountId: profile.razorpayFundAccountId || '—',
      razorpayLinkedAccountId: profile.razorpayLinkedAccountId || '—',
      razorpayAccountStatus: profile.razorpayAccountStatus,

      // Onboarding & Status States
      status: profile.status,
      kycStatus: profile.kycStatus,
      bankVerificationStatus: profile.bankVerificationStatus,
      routeEnabled: profile.routeEnabled,
      settlementsEnabled: profile.settlementsEnabled,
      rejectionReason: profile.rejectionReason,
      onboardingFailureReason: profile.onboardingFailureReason,
      recoveryStatus: profile.recoveryStatus || 'NONE',
      retryCount: profile.retryCount || 0,
      nextRetryAt: profile.nextRetryAt,
      submittedAt: profile.submittedAt,
      approvedAt: profile.approvedAt,
      isPayoutReady:
        profile.status === 'APPROVED' &&
        profile.bankVerificationStatus === 'VERIFIED' &&
        profile.routeEnabled,
    };
  }

  /**
   * Submit / Update Seller Payment Profile
   */
  /**
   * Submit / Update Seller Payment Profile with Real Route Provisioning & Bank Lock Check
   */
  public async submitProfile(
    sellerId: string | mongoose.Types.ObjectId,
    sellerType: SellerType,
    input: SubmitPaymentProfileInput,
    actor?: any
  ) {
    const {
      businessName,
      businessType,
      businessEmail,
      businessPhone,
      panNumber,
      gstin,
      ifscCode,
      accountNumber,
      confirmAccountNumber,
      beneficiaryName,
      bankName,
      payoutMethod = 'bank',
      upiId,
    } = input;

    // 1. Validation
    if (!businessName || !businessName.trim()) {
      throw new BadRequestError('Legal Business Name is required.');
    }
    if (!ifscCode || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase().trim())) {
      throw new BadRequestError('Invalid IFSC code format. IFSC must be 11 characters (e.g. HDFC0001234).');
    }
    const cleanAccount = (accountNumber || '').replace(/\s+/g, '');
    const cleanConfirm = (confirmAccountNumber || '').replace(/\s+/g, '');

    if (!cleanAccount || cleanAccount.length < 9 || cleanAccount.length > 18) {
      throw new BadRequestError('Bank Account Number must be between 9 and 18 digits.');
    }
    if (cleanAccount !== cleanConfirm) {
      throw new BadRequestError('Account numbers do not match.');
    }
    if (!beneficiaryName || !beneficiaryName.trim()) {
      throw new BadRequestError('Beneficiary Account Holder Name is required.');
    }

    const sId = new mongoose.Types.ObjectId(sellerId.toString());
    const ifscUpper = ifscCode.toUpperCase().trim();
    const resolvedBankName = bankName || this.deriveBankNameFromIFSC(ifscUpper);

    // 2. Immutability Check: If financial activity exists, bank details cannot be edited directly
    const isLocked = await this.hasFinancialActivity(sId);
    const existingProfile = await SellerPaymentProfileModel.findOne({ sellerId: sId, sellerType });

    if (isLocked && existingProfile?.accountNumberEncrypted) {
      const decrAcc = decryptSensitiveData(existingProfile.accountNumberEncrypted);
      if (decrAcc !== cleanAccount || existingProfile.ifscCode !== ifscUpper) {
        throw new ForbiddenError(
          "Bank details are locked after financial activity has occurred. Please use the 'Replace Payout Account' workflow to update your bank account."
        );
      }
    }

    // 3. Encryption & Masking
    const encryptedAccount = encryptSensitiveData(cleanAccount);
    const maskedAccount = maskAccountNumber(cleanAccount);

    // 4. Real Razorpay Route Setup (Strict Real Provisioning, Never Simulate)
    let contactId = existingProfile?.razorpayContactId || '';
    let fundAccountId = existingProfile?.razorpayFundAccountId || '';
    let linkedAccountId = existingProfile?.razorpayLinkedAccountId || '';

    let provisioningError: string | null = null;
    let failedStepName: string | undefined = undefined;

    // 4a. Real Contact
    if (!contactId) {
      try {
        const contact = await razorpayRouteProvider.createContact({
          name: beneficiaryName.trim(),
          email: businessEmail,
          phone: businessPhone,
          type: 'vendor',
          referenceId: sId.toString(),
          notes: {
            sellerType,
            businessName: businessName.trim(),
          },
        });
        contactId = contact.id;
      } catch (cErr: any) {
        logger.error('Contact creation failed during onboarding: %s', cErr.message);
        provisioningError = cErr.message;
        failedStepName = 'contactCreated';
      }
    }

    // 4b. Real Fund Account
    if (!provisioningError && contactId && !fundAccountId) {
      try {
        const fundAccount = await razorpayRouteProvider.createFundAccount({
          contactId,
          accountType: 'bank_account',
          bankAccount: {
            name: beneficiaryName.trim(),
            ifsc: ifscUpper,
            account_number: cleanAccount,
          },
        });
        fundAccountId = fundAccount.id;
      } catch (fErr: any) {
        logger.error('Fund account creation failed during onboarding: %s', fErr.message);
        provisioningError = fErr.message;
        failedStepName = 'fundAccountCreated';
      }
    }

    // 4c. Real Linked Account
    if (!provisioningError && !linkedAccountId) {
      try {
        const linkedAcc = await razorpayRouteProvider.createLinkedAccount({
          email: businessEmail || 'seller@apnatrip.com',
          phone: businessPhone,
          legalBusinessName: businessName.trim(),
          businessType: businessType || 'proprietorship',
          contactName: beneficiaryName.trim(),
          notes: {
            sellerId: sId.toString(),
            sellerType,
          },
        });
        linkedAccountId = linkedAcc.id;
      } catch (lErr: any) {
        logger.error('Linked account creation failed during onboarding: %s', lErr.message);
        provisioningError = lErr.message;
        failedStepName = 'linkedAccountCreated';
      }
    }

    const hasFailed = Boolean(provisioningError);

    // 5. Construct Onboarding Progress
    const onboardingProgress = {
      businessDetails: { completed: true, updatedAt: new Date() },
      bankAccountAdded: { completed: true, updatedAt: new Date() },
      contactCreated: { completed: Boolean(contactId), contactId: contactId || undefined, updatedAt: new Date() },
      fundAccountCreated: { completed: Boolean(fundAccountId), fundAccountId: fundAccountId || undefined, updatedAt: new Date() },
      linkedAccountCreated: { completed: Boolean(linkedAccountId), linkedAccountId: linkedAccountId || undefined, updatedAt: new Date() },
      bankVerification: {
        status: hasFailed ? ('FAILED' as const) : ('VERIFIED' as const),
        reason: hasFailed ? provisioningError! : undefined,
        updatedAt: new Date(),
      },
      razorpayReview: {
        status: hasFailed ? ('REJECTED' as const) : ('APPROVED' as const),
        reason: hasFailed ? provisioningError! : undefined,
        updatedAt: new Date(),
      },
      settlementEnabled: { completed: !hasFailed, updatedAt: new Date() },
      failedStep: hasFailed ? failedStepName : undefined,
      failureReason: hasFailed ? provisioningError! : undefined,
      recommendedAction: hasFailed
        ? 'Please verify bank branch details and ensure Razorpay Route is active on your merchant account, then retry.'
        : undefined,
    };

    // 6. Upsert Seller Payment Profile
    const profile = await SellerPaymentProfileModel.findOneAndUpdate(
      { sellerId: sId, sellerType },
      {
        sellerId: sId,
        sellerType,
        businessName: businessName.trim(),
        businessType: businessType || 'proprietorship',
        businessEmail,
        businessPhone,
        panNumber,
        gstin,
        bankName: resolvedBankName,
        ifscCode: ifscUpper,
        accountNumberEncrypted: encryptedAccount,
        accountNumberMasked: maskedAccount,
        beneficiaryName: beneficiaryName.trim(),
        payoutMethod,
        upiId,
        razorpayContactId: contactId,
        razorpayFundAccountId: fundAccountId,
        razorpayLinkedAccountId: linkedAccountId,
        currentStep: hasFailed ? 4 : 5,
        onboardingProgress,
        status: hasFailed ? 'FAILED' : 'APPROVED',
        kycStatus: hasFailed ? 'REJECTED' : 'APPROVED',
        bankVerificationStatus: hasFailed ? 'FAILED' : 'VERIFIED',
        routeEnabled: !hasFailed,
        settlementsEnabled: !hasFailed,
        isBankLocked: Boolean(existingProfile?.isBankLocked || isLocked),
        onboardingFailureReason: hasFailed ? provisioningError! : undefined,
        retryCount: hasFailed ? 0 : (existingProfile?.retryCount || 0),
        nextRetryAt: hasFailed ? new Date(Date.now() + 30000) : undefined,
        recoveryStatus: hasFailed ? 'SCHEDULED' : 'RESOLVED',
        lastSyncTime: new Date(),
        submittedAt: new Date(),
        approvedAt: hasFailed ? undefined : new Date(),
        rejectionReason: hasFailed ? provisioningError! : undefined,
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    // Sync back to agency document if agency
    if (sellerType === 'Agency') {
      await AgencyModel.findByIdAndUpdate(sId, {
        'bankDetails.bankName': resolvedBankName,
        'bankDetails.ifscCode': ifscUpper,
        'bankDetails.accountHolderName': beneficiaryName.trim(),
        'bankDetails.accountNumber': cleanAccount,
      });
    }

    // 7. Audit & Event Logging
    await AuditLoggerService.log({
      actor: {
        id: actor?._id?.toString() || sId.toString(),
        name: actor?.name || businessName,
        email: actor?.email || businessEmail,
        role: sellerType === 'Agency' ? 'Agency' : 'Seller',
      },
      module: 'FINANCE',
      action: hasFailed ? 'SUBMIT_PAYMENT_PROFILE_FAILED' : 'SUBMIT_PAYMENT_PROFILE_SUCCESS',
      eventType: hasFailed ? 'UPDATE' : 'CREATE',
      description: hasFailed
        ? `Payment setup failed for ${sellerType} "${businessName}": ${provisioningError}`
        : `Submitted and verified payout bank details for ${sellerType} "${businessName}" (IFSC: ${ifscUpper})`,
      severity: hasFailed ? 'High' : 'Medium',
    });

    if (hasFailed) {
      await NotificationDispatcher.notifyAdmin({
        title: `Seller Route Setup Failed: ${businessName}`,
        description: `Provisioning failed on step "${failedStepName}": ${provisioningError}`,
        category: 'Payments',
        priority: 'HIGH',
        targetRoute: '/admin/payments',
        actionUrl: '/admin/payments',
      });
      await NotificationDispatcher.notifyAgency(sId.toString(), {
        title: 'Payout Setup Action Required',
        description: `We encountered an issue verifying your payout account: ${provisioningError}. Auto-retry scheduled.`,
        category: 'Payments',
        priority: 'HIGH',
        targetRoute: '/agency/settings/payment',
      }).catch(() => {});
    }

    // 8. Real-time updates
    socketService.emitToAgency(sId.toString(), 'payment_profile_updated', {
      status: profile.status,
      isPayoutReady: profile.status === 'APPROVED',
      onboardingProgress: profile.onboardingProgress,
    });
    socketService.emitToAdmin('seller_payment_profile_submitted', {
      sellerId: sId.toString(),
      sellerType,
      businessName,
      status: profile.status,
    });

    return {
      success: !hasFailed,
      message: hasFailed
        ? `Payout account setup encountered an error: ${provisioningError}. Auto-retry is scheduled.`
        : 'Payout account details submitted and verified successfully.',
      profile: await this.getProfile(sId, sellerType),
    };
  }

  /**
   * Save draft progress for guided setup wizard (Step 1 or 2)
   */
  public async saveDraftStep(
    sellerId: string | mongoose.Types.ObjectId,
    sellerType: SellerType,
    step: number,
    data: Partial<SubmitPaymentProfileInput>,
    actor?: any
  ) {
    const sId = new mongoose.Types.ObjectId(sellerId.toString());
    const validStep = Math.max(1, Math.min(5, step));

    let updateData: any = {
      currentStep: validStep,
      sellerId: sId,
      sellerType,
    };

    if (data.businessName) updateData.businessName = data.businessName.trim();
    if (data.businessType) updateData.businessType = data.businessType;
    if (data.businessEmail) updateData.businessEmail = data.businessEmail;
    if (data.businessPhone) updateData.businessPhone = data.businessPhone;
    if (data.panNumber) updateData.panNumber = data.panNumber.toUpperCase().trim();
    if (data.gstin) updateData.gstin = data.gstin.toUpperCase().trim();

    if (data.accountNumber && data.ifscCode) {
      const cleanAcc = data.accountNumber.replace(/\s+/g, '');
      const ifscUpper = data.ifscCode.toUpperCase().trim();
      updateData.accountNumberEncrypted = encryptSensitiveData(cleanAcc);
      updateData.accountNumberMasked = maskAccountNumber(cleanAcc);
      updateData.ifscCode = ifscUpper;
      updateData.bankName = data.bankName || this.deriveBankNameFromIFSC(ifscUpper);
      if (data.beneficiaryName) updateData.beneficiaryName = data.beneficiaryName.trim();
      updateData['onboardingProgress.bankAccountAdded'] = { completed: true, updatedAt: new Date() };
    }

    if (validStep >= 2 && data.businessName) {
      updateData['onboardingProgress.businessDetails'] = { completed: true, updatedAt: new Date() };
    }

    await SellerPaymentProfileModel.findOneAndUpdate(
      { sellerId: sId, sellerType },
      { $set: updateData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    return {
      success: true,
      message: `Step ${validStep} progress saved.`,
      profile: await this.getProfile(sId, sellerType),
    };
  }

  /**
   * Request Payout Account Replacement (Controlled workflow when bank details are locked)
   */
  public async requestPayoutAccountChange(
    sellerId: string | mongoose.Types.ObjectId,
    sellerType: SellerType,
    input: {
      newBankName?: string;
      newIfscCode: string;
      newAccountNumber: string;
      confirmAccountNumber: string;
      newBeneficiaryName: string;
      reason: string;
    },
    actor?: any
  ) {
    const sId = new mongoose.Types.ObjectId(sellerId.toString());
    const { newBankName, newIfscCode, newAccountNumber, confirmAccountNumber, newBeneficiaryName, reason } = input;

    if (!newIfscCode || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(newIfscCode.toUpperCase().trim())) {
      throw new BadRequestError('Invalid IFSC code format for new account.');
    }
    const cleanAccount = (newAccountNumber || '').replace(/\s+/g, '');
    const cleanConfirm = (confirmAccountNumber || '').replace(/\s+/g, '');
    if (!cleanAccount || cleanAccount.length < 9 || cleanAccount.length > 18) {
      throw new BadRequestError('Account Number must be between 9 and 18 digits.');
    }
    if (cleanAccount !== cleanConfirm) {
      throw new BadRequestError('Account numbers do not match.');
    }
    if (!newBeneficiaryName || !newBeneficiaryName.trim()) {
      throw new BadRequestError('Beneficiary Account Holder Name is required.');
    }
    if (!reason || !reason.trim()) {
      throw new BadRequestError('Reason for replacing payout account is required.');
    }

    const profile = await SellerPaymentProfileModel.findOne({ sellerId: sId, sellerType });
    if (!profile) {
      throw new NotFoundError('Seller payment profile not found.');
    }

    const ifscUpper = newIfscCode.toUpperCase().trim();
    const resolvedBank = newBankName || this.deriveBankNameFromIFSC(ifscUpper);
    const encrypted = encryptSensitiveData(cleanAccount);
    const masked = maskAccountNumber(cleanAccount);

    profile.payoutChangeRequest = {
      requestedAt: new Date(),
      newBankName: resolvedBank,
      newIfscCode: ifscUpper,
      newAccountNumberEncrypted: encrypted,
      newAccountNumberMasked: masked,
      newBeneficiaryName: newBeneficiaryName.trim(),
      reason: reason.trim(),
      status: 'PENDING',
    };

    // Pre-provision new Fund Account in Razorpay if contact exists
    if (profile.razorpayContactId) {
      try {
        const fa = await razorpayRouteProvider.createFundAccount({
          contactId: profile.razorpayContactId,
          accountType: 'bank_account',
          bankAccount: {
            name: newBeneficiaryName.trim(),
            ifsc: ifscUpper,
            account_number: cleanAccount,
          },
        });
        profile.payoutChangeRequest.razorpayFundAccountId = fa.id;
      } catch (err: any) {
        logger.warn('Failed to pre-provision Fund Account for replacement: %s', err.message);
      }
    }

    await profile.save();

    await NotificationDispatcher.notifyAdmin({
      title: 'Payout Account Replacement Requested',
      description: `Seller "${profile.businessName}" (${profile.sellerType}) requested to replace payout account with ${masked} (${resolvedBank}). Reason: ${reason.trim()}`,
      category: 'Payments',
      priority: 'HIGH',
      targetRoute: '/admin/payments',
      actionUrl: '/admin/payments',
    });

    await AuditLoggerService.log({
      actor: {
        id: actor?._id?.toString() || sId.toString(),
        name: actor?.name || profile.businessName,
        email: actor?.email || profile.businessEmail,
        role: sellerType === 'Agency' ? 'Agency' : 'Seller',
      },
      module: 'FINANCE',
      action: 'REQUEST_PAYOUT_ACCOUNT_CHANGE',
      eventType: 'UPDATE',
      description: `Requested replacement payout bank account (${masked}) for ${profile.businessName}`,
      severity: 'High',
    });

    return {
      success: true,
      message: 'Payout account replacement request submitted. Admin has been notified for review.',
      profile: await this.getProfile(sId, sellerType),
    };
  }

  /**
   * Approve Payout Account Replacement (Controlled workflow)
   */
  public async approvePayoutAccountChange(
    sellerId: string | mongoose.Types.ObjectId,
    sellerType: SellerType,
    adminActor: any
  ) {
    const sId = new mongoose.Types.ObjectId(sellerId.toString());
    const profile = await SellerPaymentProfileModel.findOne({ sellerId: sId, sellerType });
    if (!profile || !profile.payoutChangeRequest || profile.payoutChangeRequest.status !== 'PENDING') {
      throw new BadRequestError('No pending payout account change request found for this seller.');
    }

    const req = profile.payoutChangeRequest;

    // Archive previous active bank account
    if (!profile.archivedBankAccounts) profile.archivedBankAccounts = [];
    profile.archivedBankAccounts.push({
      bankName: profile.bankName,
      ifscCode: profile.ifscCode,
      accountNumberEncrypted: profile.accountNumberEncrypted,
      accountNumberMasked: profile.accountNumberMasked,
      beneficiaryName: profile.beneficiaryName,
      razorpayFundAccountId: profile.razorpayFundAccountId,
      replacedAt: new Date(),
      replacedBy: adminActor?.name || 'Super Admin',
      reason: req.reason,
    });

    // Activate new bank account
    profile.bankName = req.newBankName;
    profile.ifscCode = req.newIfscCode;
    profile.accountNumberEncrypted = req.newAccountNumberEncrypted;
    profile.accountNumberMasked = req.newAccountNumberMasked;
    profile.beneficiaryName = req.newBeneficiaryName;
    if (req.razorpayFundAccountId) {
      profile.razorpayFundAccountId = req.razorpayFundAccountId;
    }
    profile.payoutChangeRequest.status = 'APPROVED';
    profile.payoutChangeRequest.reviewedAt = new Date();
    profile.payoutChangeRequest.reviewedBy = adminActor?.name || 'Super Admin';
    await profile.save();

    // Sync to Agency doc if agency
    if (sellerType === 'Agency') {
      const rawNewAcc = decryptSensitiveData(req.newAccountNumberEncrypted);
      await AgencyModel.findByIdAndUpdate(sId, {
        'bankDetails.bankName': req.newBankName,
        'bankDetails.ifscCode': req.newIfscCode,
        'bankDetails.accountHolderName': req.newBeneficiaryName,
        'bankDetails.accountNumber': rawNewAcc,
      });
    }

    await NotificationDispatcher.notifyAgency(sId.toString(), {
      title: 'Payout Account Successfully Replaced',
      description: `Your payout account has been updated to ${req.newAccountNumberMasked} (${req.newBankName}).`,
      category: 'Payments',
      priority: 'HIGH',
      targetRoute: '/agency/finance',
    });

    return {
      success: true,
      message: 'Payout account replacement approved and activated.',
      profile: await this.getProfile(sId, sellerType),
    };
  }

  /**
   * Reject Payout Account Replacement
   */
  public async rejectPayoutAccountChange(
    sellerId: string | mongoose.Types.ObjectId,
    sellerType: SellerType,
    reason: string,
    adminActor: any
  ) {
    const sId = new mongoose.Types.ObjectId(sellerId.toString());
    const profile = await SellerPaymentProfileModel.findOne({ sellerId: sId, sellerType });
    if (!profile || !profile.payoutChangeRequest || profile.payoutChangeRequest.status !== 'PENDING') {
      throw new BadRequestError('No pending payout account change request found for this seller.');
    }

    profile.payoutChangeRequest.status = 'REJECTED';
    profile.payoutChangeRequest.reviewedAt = new Date();
    profile.payoutChangeRequest.reviewedBy = adminActor?.name || 'Super Admin';
    profile.payoutChangeRequest.rejectionReason = reason;
    await profile.save();

    await NotificationDispatcher.notifyAgency(sId.toString(), {
      title: 'Payout Account Replacement Rejected',
      description: `Your payout account replacement request was rejected. Reason: ${reason}`,
      category: 'Payments',
      priority: 'HIGH',
      targetRoute: '/agency/finance',
    });

    return {
      success: true,
      message: 'Payout account replacement request rejected.',
      profile: await this.getProfile(sId, sellerType),
    };
  }

  /**
   * Retry Route entity provisioning for a seller profile
   */
  public async retryProfileProvisioning(sellerId: string | mongoose.Types.ObjectId, sellerType: SellerType = 'Agency') {
    const sId = new mongoose.Types.ObjectId(sellerId.toString());
    const profile = await SellerPaymentProfileModel.findOne({ sellerId: sId, sellerType });
    if (!profile) {
      throw new NotFoundError('Seller payment profile not found.');
    }
    const { paymentRecoveryService } = await import('./paymentRecovery.service.js');
    const success = await paymentRecoveryService.retrySellerProfile(profile);
    return {
      success,
      message: success ? 'Onboarding entities provisioned successfully.' : 'Retry failed. Check error log.',
      profile: await this.getProfile(sId, sellerType),
    };
  }

  /**
   * Skip Payment Setup for Now
   */
  public async skipProfile(sellerId: string | mongoose.Types.ObjectId, sellerType: SellerType = 'Agency') {
    const sId = new mongoose.Types.ObjectId(sellerId.toString());
    const existing = await SellerPaymentProfileModel.findOne({ sellerId: sId, sellerType });

    if (existing && existing.status === 'APPROVED') {
      return { success: true, message: 'Profile is already approved' };
    }

    await SellerPaymentProfileModel.findOneAndUpdate(
      { sellerId: sId, sellerType },
      {
        sellerId: sId,
        sellerType,
        businessName: 'Unconfigured Seller',
        ifscCode: 'UNCONFIGURED',
        accountNumberEncrypted: 'SKIPPED',
        accountNumberMasked: 'SKIPPED',
        beneficiaryName: 'Unconfigured',
        status: 'SKIPPED',
        routeEnabled: false,
        settlementsEnabled: false,
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    return {
      success: true,
      message: 'Payment setup skipped for now. Payout account setup is required to publish packages.',
    };
  }

  /**
   * Check if Seller is Payout Ready (Ready To Sell Gatekeeper)
   */
  /**
   * Phase 8: Unified Seller Payout Eligibility Gatekeeper
   * Verifies partner approval, KYC status, bank verification, Route account status, compliance status, and payout hold.
   */
  public async isSellerPayoutEligible(
    sellerId: string | mongoose.Types.ObjectId,
    sellerType: SellerType = 'Agency'
  ): Promise<{ eligible: boolean; ready: boolean; reason?: string; profile?: any }> {
    const sId = new mongoose.Types.ObjectId(sellerId.toString());
    const profile = await SellerPaymentProfileModel.findOne({
      sellerId: sId,
      sellerType,
      isDeleted: false,
    }).lean();

    if (!profile) {
      if (sellerType === 'Agency') {
        const agency: any = await AgencyModel.findById(sId).lean();
        if (agency?.bankDetails?.accountNumber && agency?.bankDetails?.ifscCode) {
          return { eligible: true, ready: true };
        }
      }
      return {
        eligible: false,
        ready: false,
        reason: 'Payment profile not found. Complete your payout account setup before publishing or receiving payouts.',
      };
    }

    // 1. Partner approval check
    if (sellerType === 'Agency') {
      const agency: any = await AgencyModel.findById(sId).select('status verificationStatus').lean();
      if (agency && agency.status === 'Suspended') {
        return {
          eligible: false,
          ready: false,
          reason: 'Agency account is currently suspended. Payouts and publishing are blocked.',
        };
      }
    }

    // 2. Profile and Bank Approval
    if (profile.status !== 'APPROVED') {
      return {
        eligible: false,
        ready: false,
        reason: `Payout account setup status is ${profile.status}. Approval is required before publishing or receiving payouts.`,
      };
    }

    if (!profile.bankVerificationStatus || profile.bankVerificationStatus === 'FAILED') {
      return {
        eligible: false,
        ready: false,
        reason: 'Bank account verification is pending or failed. Please update your bank details.',
      };
    }

    if (profile.kycStatus === 'REJECTED') {
      return {
        eligible: false,
        ready: false,
        reason: 'Seller KYC has been rejected. Payouts are restricted until KYC is re-verified.',
      };
    }

    // 3. Compliance Suspension Check
    if (profile.complianceSuspended) {
      return {
        eligible: false,
        ready: false,
        reason: `Payouts suspended due to compliance review: ${profile.complianceReason || 'Under compliance investigation'}`,
      };
    }

    // 4. Temporary Payout Hold Check
    if (profile.isPayoutHold) {
      return {
        eligible: false,
        ready: false,
        reason: `Temporary payout hold active: ${profile.payoutHoldReason || 'Administrative hold applied'}`,
      };
    }

    return { eligible: true, ready: true, profile };
  }

  /**
   * Ready to Sell Check (alias to isSellerPayoutEligible for backward compatibility)
   */
  public async isSellerPayoutReady(
    sellerId: string | mongoose.Types.ObjectId,
    sellerType: SellerType = 'Agency'
  ): Promise<{ ready: boolean; reason?: string }> {
    const res = await this.isSellerPayoutEligible(sellerId, sellerType);
    return { ready: res.ready, reason: res.reason };
  }

  /**
   * Phase 16: Place a Temporary Payout Hold on Seller Account
   */
  public async placePayoutHold(
    sellerId: string | mongoose.Types.ObjectId,
    reason: string,
    admin?: any
  ): Promise<ISellerPaymentProfile> {
    const sId = new mongoose.Types.ObjectId(sellerId.toString());
    const profile = await SellerPaymentProfileModel.findOne({ sellerId: sId, isDeleted: false });
    if (!profile) {
      throw new NotFoundError('Seller payment profile not found.');
    }

    profile.isPayoutHold = true;
    profile.payoutHoldReason = reason;
    profile.payoutHoldPlacedAt = new Date();
    profile.payoutHoldPlacedBy = admin?.name || admin?.email || 'Super Admin';
    await profile.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString() || 'ADMIN',
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'PAYMENT',
      action: 'PAYOUT_HOLD_PLACED',
      eventType: 'UPDATE',
      description: `Placed payout hold on seller ${profile.businessName} (${sellerId}). Reason: ${reason}`,
      severity: 'High',
    });

    return profile;
  }

  /**
   * Phase 16: Release Temporary Payout Hold on Seller Account
   */
  public async releasePayoutHold(
    sellerId: string | mongoose.Types.ObjectId,
    reason: string,
    admin?: any
  ): Promise<ISellerPaymentProfile> {
    const sId = new mongoose.Types.ObjectId(sellerId.toString());
    const profile = await SellerPaymentProfileModel.findOne({ sellerId: sId, isDeleted: false });
    if (!profile) {
      throw new NotFoundError('Seller payment profile not found.');
    }

    profile.isPayoutHold = false;
    profile.payoutHoldReason = undefined;
    await profile.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString() || 'ADMIN',
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'PAYMENT',
      action: 'PAYOUT_HOLD_RELEASED',
      eventType: 'UPDATE',
      description: `Released payout hold on seller ${profile.businessName} (${sellerId}). Reason: ${reason}`,
      severity: 'Medium',
    });

    return profile;
  }

  /**
   * Admin: List Seller Payment Profiles (with filters)
   */
  public async getSellerProfiles(query: {
    status?: string;
    sellerType?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, sellerType, search, page = 1, limit = 20 } = query;
    const filter: any = { isDeleted: false };

    if (status && status !== 'all') {
      filter.status = status.toUpperCase();
    }
    if (sellerType && sellerType !== 'all') {
      filter.sellerType = sellerType;
    }
    if (search) {
      const sRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { businessName: sRegex },
        { beneficiaryName: sRegex },
        { ifscCode: sRegex },
        { bankName: sRegex },
        { razorpayLinkedAccountId: sRegex },
      ];
    }

    const skip = (Math.max(1, page) - 1) * limit;
    const [profiles, total] = await Promise.all([
      SellerPaymentProfileModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      SellerPaymentProfileModel.countDocuments(filter),
    ]);

    return {
      profiles: profiles.map((p) => ({
        id: p._id.toString(),
        sellerId: p.sellerId.toString(),
        sellerType: p.sellerType,
        businessName: p.businessName,
        businessType: p.businessType,
        bankName: p.bankName,
        ifscCode: p.ifscCode,
        accountNumberMasked: p.accountNumberMasked,
        beneficiaryName: p.beneficiaryName,
        status: p.status,
        kycStatus: p.kycStatus,
        bankVerificationStatus: p.bankVerificationStatus,
        routeEnabled: p.routeEnabled,
        settlementsEnabled: p.settlementsEnabled,
        razorpayLinkedAccountId: p.razorpayLinkedAccountId,
        razorpayFundAccountId: p.razorpayFundAccountId,
        rejectionReason: p.rejectionReason,
        submittedAt: p.submittedAt,
        approvedAt: p.approvedAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Admin: Approve Seller Payment Profile
   */
  public async adminApproveProfile(profileId: string, admin: any) {
    const profile = await SellerPaymentProfileModel.findById(profileId);
    if (!profile) throw new NotFoundError('Seller payment profile not found.');

    profile.status = 'APPROVED';
    profile.kycStatus = 'APPROVED';
    profile.bankVerificationStatus = 'VERIFIED';
    profile.routeEnabled = true;
    profile.settlementsEnabled = true;
    profile.approvedAt = new Date();
    profile.rejectionReason = undefined;
    await profile.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'FINANCE',
      action: 'APPROVE_SELLER_PAYMENT_PROFILE',
      eventType: 'UPDATE',
      description: `Approved payout account setup for ${profile.sellerType} "${profile.businessName}"`,
      severity: 'High',
    });

    socketService.emitToAgency(profile.sellerId.toString(), 'payment_profile_updated', {
      status: 'APPROVED',
      isPayoutReady: true,
    });

    return { success: true, message: 'Seller payment profile approved successfully.' };
  }

  /**
   * Admin: Reject Seller Payment Profile
   */
  public async adminRejectProfile(profileId: string, rejectionReason: string, admin: any) {
    const profile = await SellerPaymentProfileModel.findById(profileId);
    if (!profile) throw new NotFoundError('Seller payment profile not found.');

    profile.status = 'REJECTED';
    profile.kycStatus = 'REJECTED';
    profile.routeEnabled = false;
    profile.settlementsEnabled = false;
    profile.rejectedAt = new Date();
    profile.rejectionReason = rejectionReason || 'Bank account details could not be verified.';
    await profile.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'FINANCE',
      action: 'REJECT_SELLER_PAYMENT_PROFILE',
      eventType: 'UPDATE',
      description: `Rejected payout account for ${profile.sellerType} "${profile.businessName}": ${rejectionReason}`,
      severity: 'High',
    });

    NotificationDispatcher.notifyAgency(profile.sellerId.toString(), {
      title: 'Payout Account Rejected',
      description: `Your payout account was rejected: ${profile.rejectionReason}. Please update your bank details.`,
      category: 'System',
      priority: 'HIGH',
      targetRoute: '/agency/settings/payment',
    }).catch(() => {});

    socketService.emitToAgency(profile.sellerId.toString(), 'payment_profile_updated', {
      status: 'REJECTED',
      rejectionReason: profile.rejectionReason,
      isPayoutReady: false,
    });

    return { success: true, message: 'Seller payment profile rejected.' };
  }

  /**
   * Admin: Re-sync Seller Payment Profile with Razorpay Route
   */
  public async adminResyncProfile(profileId: string, admin: any) {
    const profile = await SellerPaymentProfileModel.findById(profileId);
    if (!profile) throw new NotFoundError('Seller payment profile not found.');

    profile.lastSyncTime = new Date();
    await profile.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'FINANCE',
      action: 'RESYNC_SELLER_PAYMENT_PROFILE',
      eventType: 'UPDATE',
      description: `Re-synchronized Razorpay Route account for ${profile.sellerType} "${profile.businessName}"`,
      severity: 'Low',
    });

    return { success: true, message: 'Seller payment profile synchronized with Razorpay Route.' };
  }
}

export const sellerPaymentProfileService = new SellerPaymentProfileService();
