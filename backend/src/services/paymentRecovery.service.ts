import { SellerPaymentProfileModel } from '../models/sellerPaymentProfile.model.js';
import { TransferModel } from '../models/transfer.model.js';
import { SettlementModel } from '../models/settlement.model.js';
import { razorpayRouteProvider } from './payment/razorpayRoute.provider.js';
import { settlementEngineService } from './settlementEngine.service.js';
import { NotificationDispatcher } from './notificationDispatcher.service.js';
import { decryptSensitiveData } from '../utils/encryption.util.js';
import { logger } from '../config/logger.config.js';

export class PaymentRecoveryService {
  private recoveryInterval: NodeJS.Timeout | null = null;
  private isRecovering = false;

  private readonly RETRY_DELAYS_MS = [
    30 * 1000, // Retry 1: 30s
    2 * 60 * 1000, // Retry 2: 2m
    10 * 60 * 1000, // Retry 3: 10m
    30 * 60 * 1000, // Retry 4: 30m
    2 * 60 * 60 * 1000, // Retry 5: 2h
  ];

  constructor() {
    this.startRecoveryDaemon();
  }

  public startRecoveryDaemon(): void {
    if (this.recoveryInterval) return;
    this.recoveryInterval = setInterval(() => {
      this.runRecoveryIteration().catch((err) => {
        logger.error('Error in PaymentRecoveryService daemon:', err);
      });
    }, 15000); // Check every 15 seconds
  }

  public stopRecoveryDaemon(): void {
    if (this.recoveryInterval) {
      clearInterval(this.recoveryInterval);
      this.recoveryInterval = null;
    }
  }

  /**
   * Run automated recovery sweep for failed seller profiles and failed transfers
   */
  public async runRecoveryIteration(): Promise<void> {
    if (this.isRecovering) return;
    this.isRecovering = true;

    try {
      const now = new Date();

      // 1. Recover failed seller payment profiles
      const failedProfiles = await SellerPaymentProfileModel.find({
        isDeleted: false,
        recoveryStatus: 'SCHEDULED',
        nextRetryAt: { $lte: now },
        retryCount: { $lt: 5 },
      }).limit(5);

      for (const profile of failedProfiles) {
        await this.retrySellerProfile(profile);
      }

      // 2. Scan delayed settlements and flag SLA delay
      await this.flagDelayedSettlements();
    } finally {
      this.isRecovering = false;
    }
  }

  /**
   * Retry failed onboarding step for seller profile
   */
  public async retrySellerProfile(profile: any): Promise<boolean> {
    const nextAttempt = (profile.retryCount || 0) + 1;
    profile.recoveryStatus = 'IN_PROGRESS';
    await profile.save();

    logger.info(
      '🔄 Executing automated recovery attempt %d/5 for seller profile %s (%s)',
      nextAttempt,
      profile._id,
      profile.businessName
    );

    try {
      const rawAccount = decryptSensitiveData(profile.accountNumberEncrypted);

      // Contact creation retry if needed
      if (!profile.razorpayContactId) {
        const contact = await razorpayRouteProvider.createContact({
          name: profile.beneficiaryName,
          email: profile.businessEmail,
          phone: profile.businessPhone,
          type: 'vendor',
          referenceId: profile.sellerId.toString(),
          notes: { sellerType: profile.sellerType, businessName: profile.businessName },
        });
        profile.razorpayContactId = contact.id;
        if (!profile.onboardingProgress) profile.onboardingProgress = {};
        profile.onboardingProgress.contactCreated = { completed: true, contactId: contact.id, updatedAt: new Date() };
      }

      // Fund Account creation retry if needed
      if (!profile.razorpayFundAccountId && profile.razorpayContactId) {
        const fundAcc = await razorpayRouteProvider.createFundAccount({
          contactId: profile.razorpayContactId,
          accountType: 'bank_account',
          bankAccount: {
            name: profile.beneficiaryName,
            ifsc: profile.ifscCode,
            account_number: rawAccount,
          },
        });
        profile.razorpayFundAccountId = fundAcc.id;
        if (!profile.onboardingProgress) profile.onboardingProgress = {};
        profile.onboardingProgress.fundAccountCreated = { completed: true, fundAccountId: fundAcc.id, updatedAt: new Date() };
      }

      // Linked Account creation retry if needed
      if (!profile.razorpayLinkedAccountId) {
        const linkedAcc = await razorpayRouteProvider.createLinkedAccount({
          email: profile.businessEmail || 'seller@apnatrip.com',
          phone: profile.businessPhone,
          legalBusinessName: profile.businessName,
          businessType: profile.businessType || 'proprietorship',
          contactName: profile.beneficiaryName,
          notes: { sellerId: profile.sellerId.toString(), sellerType: profile.sellerType },
        });
        profile.razorpayLinkedAccountId = linkedAcc.id;
        if (!profile.onboardingProgress) profile.onboardingProgress = {};
        profile.onboardingProgress.linkedAccountCreated = { completed: true, linkedAccountId: linkedAcc.id, updatedAt: new Date() };
      }

      // If all created successfully, put into UNDER_REVIEW waiting for webhook verification
      profile.status = 'UNDER_REVIEW';
      profile.bankVerificationStatus = 'PENDING';
      profile.recoveryStatus = 'RESOLVED';
      profile.lastError = undefined;
      profile.onboardingFailureReason = undefined;
      await profile.save();

      await settlementEngineService.appendLedgerEvent({
        sellerId: profile.sellerId,
        previousStatus: 'FAILED',
        newStatus: 'UNDER_REVIEW',
        eventSource: 'RECOVERY_WORKER',
        notes: `Automated recovery attempt ${nextAttempt} succeeded. Route entities provisioned.`,
        metadata: {
          contactId: profile.razorpayContactId,
          fundAccountId: profile.razorpayFundAccountId,
          linkedAccountId: profile.razorpayLinkedAccountId,
        },
      });

      logger.info('✅ Automated recovery succeeded for seller profile %s', profile._id);
      return true;
    } catch (err: any) {
      const isExhausted = nextAttempt >= 5;
      const delay = this.RETRY_DELAYS_MS[nextAttempt - 1] || 7200000;

      profile.retryCount = nextAttempt;
      profile.lastError = err.message;
      profile.onboardingFailureReason = err.message;
      profile.recoveryStatus = isExhausted ? 'MANUAL_INTERVENTION_REQUIRED' : 'SCHEDULED';
      profile.nextRetryAt = isExhausted ? undefined : new Date(Date.now() + delay);
      await profile.save();

      logger.error(
        '❌ Recovery attempt %d/5 failed for seller profile %s: %s',
        nextAttempt,
        profile._id,
        err.message
      );

      if (isExhausted) {
        await NotificationDispatcher.notifyAdmin({
          title: `Action Required: Seller Onboarding Retries Exhausted`,
          description: `Seller "${profile.businessName}" (${profile.sellerType}) reached maximum onboarding retries (5/5). Error: ${err.message}`,
          category: 'Payments',
          priority: 'HIGH',
          targetRoute: '/admin/payments',
          actionUrl: '/admin/payments',
        });
      }

      return false;
    }
  }

  /**
   * Monitor delayed settlements and trigger SLA alerts
   */
  public async flagDelayedSettlements(): Promise<void> {
    const now = new Date();
    const delayedDocs = await SettlementModel.find({
      isDeleted: false,
      status: { $in: ['TRANSFERRED', 'PROCESSING', 'PENDING'] },
      expectedSettlementDate: { $lt: now },
      isDelayed: false,
    });

    for (const sett of delayedDocs) {
      const diffHours = Math.round((now.getTime() - sett.expectedSettlementDate!.getTime()) / (1000 * 60 * 60));
      sett.isDelayed = true;
      sett.currentStage = 'DELAYED';
      sett.delayDurationHours = diffHours;
      sett.delayedNotifiedAt = now;
      await sett.save();

      // Notify agency
      if (sett.sellerId) {
        await NotificationDispatcher.notifyAgency(sett.sellerId.toString(), {
          title: `Settlement Delayed (#${sett.settlementId})`,
          description: `Your payout of ₹${sett.netSettledAmount.toLocaleString('en-IN')} is experiencing banking network delays (+${diffHours}h).`,
          category: 'Payments',
          priority: 'MEDIUM',
          targetRoute: '/agency/finance',
        }).catch(() => {});
      }

      // Notify Admin
      await NotificationDispatcher.notifyAdmin({
        title: `Settlement SLA Breached: #${sett.settlementId}`,
        description: `Settlement to ${sett.sellerName} (₹${sett.netSettledAmount.toLocaleString('en-IN')}) delayed by ${diffHours}h past expected date.`,
        category: 'Payments',
        priority: 'MEDIUM',
        targetRoute: '/admin/payments',
      }).catch(() => {});

      await settlementEngineService.appendLedgerEvent({
        settlementId: sett._id,
        settlementReferenceId: sett.settlementId,
        bookingId: sett.bookingId,
        sellerId: sett.sellerId,
        previousStatus: sett.status,
        newStatus: 'DELAYED',
        eventSource: 'SYSTEM_CRON',
        notes: `Settlement delayed by ${diffHours} hours past banking SLA date.`,
      });
    }
  }
}

export const paymentRecoveryService = new PaymentRecoveryService();
