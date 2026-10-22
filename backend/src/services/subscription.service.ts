import crypto from 'crypto';
import mongoose from 'mongoose';
import { PartnerSubscriptionModel, IPartnerSubscription } from '../models/partnerSubscription.model.js';
import { SubscriptionPaymentModel } from '../models/subscriptionPayment.model.js';
import { InvoiceModel } from '../models/invoice.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { RegistrationDraftModel } from '../models/registrationDraft.model.js';
import { PartnerUserModel } from '../models/partnerUser.model.js';
import { registrationService } from './registration.service.js';
import { couponService } from './coupon.service.js';
import { envConfig } from '../config/env.config.js';
import { logger } from '../config/logger.config.js';
import { AppError } from '../utils/errors.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';

export interface CreateSubscriptionOrderInput {
  businessType: 'agency' | 'car_rental';
  partnerName: string;
  email: string;
  phone: string;
  couponCode?: string;
  agencyId?: string;
  draftId?: string;
}

export interface VerifySubscriptionPaymentInput {
  subscriptionId: string;
  orderId: string;
  paymentId: string;
  signature: string;
  agencyId?: string;
  draftId?: string;
}

export class SubscriptionService {
  private readonly BASE_REGISTRATION_FEE = 1000;

  /**
   * Determine whether a partner has already paid the ₹1,000 one-time registration fee.
   * Checks across all shared account records:
   * 1. PartnerSubscriptionModel with status: 'active'
   * 2. SubscriptionPaymentModel with status: 'paid'
   * 3. AgencyModel with paymentStatus: 'PAID'
   * Identifies partner by ownerId, agencyId(s), email, or phone.
   */
  public async hasPartnerPaidRegistrationFee(params: {
    ownerId?: string | mongoose.Types.ObjectId;
    agencyId?: string | mongoose.Types.ObjectId;
    email?: string;
    phone?: string;
  }): Promise<{
    paid: boolean;
    reason?: string;
    priorSubscription?: any;
    priorPayment?: any;
    priorAgency?: any;
  }> {
    const cleanEmail = (params.email || '').trim().toLowerCase();
    const cleanPhone = (params.phone || '').trim();

    const ownerIds: mongoose.Types.ObjectId[] = [];
    const agencyIds: mongoose.Types.ObjectId[] = [];
    const emails = new Set<string>();
    const phones = new Set<string>();

    if (cleanEmail) emails.add(cleanEmail);
    if (cleanPhone) phones.add(cleanPhone);

    if (params.ownerId && mongoose.Types.ObjectId.isValid(String(params.ownerId))) {
      ownerIds.push(new mongoose.Types.ObjectId(String(params.ownerId)));
    }

    if (params.agencyId && mongoose.Types.ObjectId.isValid(String(params.agencyId))) {
      const targetAgencyId = new mongoose.Types.ObjectId(String(params.agencyId));
      agencyIds.push(targetAgencyId);
      const agency = await AgencyModel.findById(targetAgencyId).lean();
      if (agency) {
        if (agency.ownerId && mongoose.Types.ObjectId.isValid(String(agency.ownerId))) {
          ownerIds.push(new mongoose.Types.ObjectId(String(agency.ownerId)));
        }
        if (agency.email) emails.add(agency.email.trim().toLowerCase());
        if (agency.loginEmail) emails.add(agency.loginEmail.trim().toLowerCase());
        if (agency.owner?.email) emails.add(agency.owner.email.trim().toLowerCase());
        if (agency.phone) phones.add(agency.phone.trim());
        if (agency.owner?.phone) phones.add(agency.owner.phone.trim());
      }
    }

    // If email or phone is present, look up matching PartnerUser to get ownerId
    if (cleanEmail || cleanPhone) {
      const matchedUser = await PartnerUserModel.findOne({
        $or: [
          ...(cleanEmail ? [{ email: cleanEmail }] : []),
          ...(cleanPhone ? [{ phone: cleanPhone }] : []),
        ],
      }).lean();
      if (matchedUser && matchedUser._id) {
        ownerIds.push(matchedUser._id as mongoose.Types.ObjectId);
        if (matchedUser.email) emails.add(matchedUser.email.trim().toLowerCase());
        if (matchedUser.phone) phones.add(matchedUser.phone.trim());
      }
    }

    // If ownerId is known, find all sibling agencies owned by this partner
    if (ownerIds.length > 0) {
      const siblingAgencies = await AgencyModel.find({
        ownerId: { $in: ownerIds },
        isDeleted: false,
      }).lean();
      for (const sib of siblingAgencies) {
        agencyIds.push(sib._id as mongoose.Types.ObjectId);
        if (sib.email) emails.add(sib.email.trim().toLowerCase());
        if (sib.loginEmail) emails.add(sib.loginEmail.trim().toLowerCase());
        if (sib.owner?.email) emails.add(sib.owner.email.trim().toLowerCase());
        if (sib.phone) phones.add(sib.phone.trim());
      }
    }

    // Find all agencies matching resolved emails or phones
    const emailList = Array.from(emails).filter(Boolean);
    const phoneList = Array.from(phones).filter(Boolean);

    if (emailList.length > 0 || phoneList.length > 0) {
      const matchedAgencies = await AgencyModel.find({
        $or: [
          ...(emailList.length > 0
            ? [
                { email: { $in: emailList } },
                { loginEmail: { $in: emailList } },
                { 'owner.email': { $in: emailList } },
              ]
            : []),
          ...(phoneList.length > 0
            ? [
                { phone: { $in: phoneList } },
                { 'owner.phone': { $in: phoneList } },
              ]
            : []),
        ],
        isDeleted: false,
      }).lean();
      for (const ag of matchedAgencies) {
        agencyIds.push(ag._id as mongoose.Types.ObjectId);
        if (ag.ownerId && mongoose.Types.ObjectId.isValid(String(ag.ownerId))) {
          ownerIds.push(new mongoose.Types.ObjectId(String(ag.ownerId)));
        }
      }
    }

    // 1. Check for Active Partner Subscription (status: 'active' strictly)
    const activeSub = await PartnerSubscriptionModel.findOne({
      status: 'active',
      $or: [
        ...(agencyIds.length > 0
          ? [{ agencyId: { $in: agencyIds } }, { partnerId: { $in: agencyIds } }]
          : []),
        ...(emailList.length > 0 ? [{ email: { $in: emailList } }] : []),
        ...(phoneList.length > 0 ? [{ phone: { $in: phoneList } }] : []),
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    if (activeSub) {
      return {
        paid: true,
        reason: `Active subscription verified (${activeSub.businessType}, ID: ${activeSub._id})`,
        priorSubscription: activeSub,
      };
    }

    // 2. Check for Verified Subscription Payment (status: 'paid' strictly)
    const verifiedPayment = await SubscriptionPaymentModel.findOne({
      status: 'paid',
      $or: [
        ...(emailList.length > 0 ? [{ email: { $in: emailList } }] : []),
        ...(phoneList.length > 0 ? [{ phone: { $in: phoneList } }] : []),
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    if (verifiedPayment) {
      return {
        paid: true,
        reason: `Verified gateway payment found (Payment ID: ${verifiedPayment.paymentId}, Business: ${verifiedPayment.businessType})`,
        priorPayment: verifiedPayment,
      };
    }

    // 3. Check for Verified Paid Agency (paymentStatus: 'PAID' strictly)
    const paidAgency = await AgencyModel.findOne({
      paymentStatus: 'PAID',
      $or: [
        ...(ownerIds.length > 0 ? [{ ownerId: { $in: ownerIds } }] : []),
        ...(agencyIds.length > 0 ? [{ _id: { $in: agencyIds } }] : []),
        ...(emailList.length > 0
          ? [{ email: { $in: emailList } }, { loginEmail: { $in: emailList } }]
          : []),
        ...(phoneList.length > 0 ? [{ phone: { $in: phoneList } }] : []),
      ],
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (paidAgency) {
      return {
        paid: true,
        reason: `Verified paid partner account found (Business: "${paidAgency.name}", ID: ${paidAgency._id})`,
        priorAgency: paidAgency,
      };
    }

    return { paid: false };
  }

  /**
   * Get registration fee status for a partner / business type
   */
  public async getFeeStatus(query: {
    ownerId?: string | mongoose.Types.ObjectId;
    agencyId?: string | mongoose.Types.ObjectId;
    email?: string;
    phone?: string;
    businessType?: 'agency' | 'car_rental';
  }) {
    const feeCheck = await this.hasPartnerPaidRegistrationFee(query);
    return {
      feeWaived: feeCheck.paid,
      alreadyPaid: feeCheck.paid,
      baseFee: this.BASE_REGISTRATION_FEE,
      amountDue: feeCheck.paid ? 0 : this.BASE_REGISTRATION_FEE,
      discount: feeCheck.paid ? this.BASE_REGISTRATION_FEE : 0,
      reason: feeCheck.reason || null,
      priorPayment: feeCheck.priorPayment
        ? {
            paymentId: feeCheck.priorPayment.paymentId,
            paidAt: feeCheck.priorPayment.paidAt,
            businessType: feeCheck.priorPayment.businessType,
          }
        : feeCheck.priorSubscription
        ? {
            paymentId: feeCheck.priorSubscription.paymentId,
            paidAt: feeCheck.priorSubscription.startedAt || feeCheck.priorSubscription.createdAt,
            businessType: feeCheck.priorSubscription.businessType,
          }
        : null,
      message: feeCheck.paid
        ? 'Registration fee waived: partner has previously paid ₹1,000 on the ApnaTrip Partner Network.'
        : 'One-time registration fee of ₹1,000 applies.',
    };
  }

  /**
   * Create Razorpay Order for Partner Subscription Checkout
   * If partner has already paid the ₹1,000 one-time fee on any vertical,
   * waives fee (₹0 charge) and auto-activates subscription for admin review.
   */
  public async createSubscriptionOrder(input: CreateSubscriptionOrderInput) {
    const businessType = input.businessType === 'car_rental' ? 'car_rental' : 'agency';
    const partnerName = (input.partnerName || '').trim();
    const email = (input.email || '').trim().toLowerCase();
    const phone = (input.phone || '').trim();

    if (!partnerName) {
      throw new AppError('Partner full name is required', HTTP_STATUS.BAD_REQUEST);
    }
    if (!email) {
      throw new AppError('Valid email address is required', HTTP_STATUS.BAD_REQUEST);
    }
    if (!phone) {
      throw new AppError('Contact phone number is required', HTTP_STATUS.BAD_REQUEST);
    }

    // ── ONE-TIME REGISTRATION FEE CHECK ──
    const feeStatus = await this.hasPartnerPaidRegistrationFee({
      ownerId: input.agencyId
        ? (await AgencyModel.findById(input.agencyId).select('ownerId').lean())?.ownerId
        : undefined,
      agencyId: input.agencyId,
      email,
      phone,
    });

    // If partner has already paid the ₹1,000 fee on either panel, waive fee completely
    if (feeStatus.paid) {
      logger.info(
        '🎉 One-Time Registration Fee Rule: Partner already paid (%s). Waiving ₹1,000 fee for businessType=%s, email=%s',
        feeStatus.reason,
        businessType,
        email
      );

      const now = new Date();
      const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      const invoiceNum = `INV-${now.getFullYear()}-WAIVED-${Math.floor(10000 + Math.random() * 90000)}`;
      const waivedOrderId = `order_waived_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const waivedPaymentId =
        feeStatus.priorPayment?.paymentId ||
        feeStatus.priorSubscription?.paymentId ||
        `pay_waived_${Date.now()}`;

      // 1. Generate Official Tax Invoice with 100% network waiver
      const invoice = await InvoiceModel.create({
        invoiceNumber: invoiceNum,
        businessType,
        partnerName,
        userEmail: email,
        userPhone: phone,
        paymentId: waivedPaymentId,
        subtotal: this.BASE_REGISTRATION_FEE,
        discount: this.BASE_REGISTRATION_FEE,
        tax: 0,
        total: 0,
        currency: 'INR',
        status: 'paid',
        issuedAt: now,
      });

      // 2. Create Active Subscription Record with zero charge
      const subDoc: any = {
        businessType,
        partnerName,
        email,
        phone,
        plan: 'one_time_registration',
        amount: this.BASE_REGISTRATION_FEE,
        discount: this.BASE_REGISTRATION_FEE,
        amountPaid: 0,
        orderId: waivedOrderId,
        paymentId: waivedPaymentId,
        status: 'active',
        startedAt: now,
        expiresAt: oneYearLater,
        invoiceId: invoice._id,
        invoiceNumber: invoiceNum,
        notes: `Registration fee waived: partner previously paid one-time fee on ApnaTrip Partner Network (${feeStatus.reason}).`,
      };

      if (input.draftId) {
        subDoc.draftId = input.draftId.trim();
      }

      if (input.agencyId && mongoose.Types.ObjectId.isValid(input.agencyId)) {
        subDoc.agencyId = new mongoose.Types.ObjectId(input.agencyId);
      }

      const subscription = await PartnerSubscriptionModel.create(subDoc);

      // 3. Record in SubscriptionPaymentModel as paid (amount: 0)
      await SubscriptionPaymentModel.create({
        orderId: waivedOrderId,
        paymentId: waivedPaymentId,
        subscriptionId: subscription._id,
        businessType,
        amount: 0,
        currency: 'INR',
        status: 'paid',
        method: 'One-Time Fee Network Waiver',
        gateway: 'Internal',
        email,
        phone,
        discountAmount: this.BASE_REGISTRATION_FEE,
        paidAt: now,
      });

      // 4. Auto submit registration draft if incomplete draft exists
      let targetDraft = null;
      if (input.draftId) {
        targetDraft = await RegistrationDraftModel.findOne({
          draftId: input.draftId.trim(),
          isCompleted: false,
        });
      }
      if (!targetDraft && input.agencyId) {
        targetDraft = await RegistrationDraftModel.findOne({
          $or: [{ userId: input.agencyId }, { 'businessDetails.agencyId': input.agencyId }],
          isCompleted: false,
        }).sort({ updatedAt: -1 });
      }
      if (!targetDraft && email) {
        targetDraft = await RegistrationDraftModel.findOne({
          $or: [{ 'businessDetails.email': email }, { 'businessDetails.loginEmail': email }],
          isCompleted: false,
        }).sort({ updatedAt: -1 });
      }

      if (targetDraft) {
        try {
          await registrationService.submitRegistration({
            draftId: targetDraft.draftId,
            subscriptionId: subscription._id.toString(),
            paymentId: waivedPaymentId,
            orderId: waivedOrderId,
          });
        } catch (submitErr: any) {
          logger.warn(
            'Auto submitRegistration for waived subscription encountered: %s',
            submitErr?.message || submitErr
          );
        }
      }

      // 5. Update agency record (paymentStatus = PAID, but preserve PENDING admin approval)
      const targetAgencyId = (subscription as any).agencyId || input.agencyId;
      let agency = null;
      if (targetAgencyId && mongoose.Types.ObjectId.isValid(String(targetAgencyId))) {
        agency = await AgencyModel.findOne({ _id: targetAgencyId, isDeleted: false });
      }
      if (!agency && email) {
        agency = await AgencyModel.findOne({
          $or: [{ email }, { loginEmail: email }, { 'owner.email': email }],
          isDeleted: false,
        });
      }

      if (agency) {
        agency.paymentStatus = 'PAID';
        if (agency.onboardingStatus === 'PAYMENT_PENDING' || !agency.onboardingStatus) {
          agency.onboardingStatus = 'UNDER_REVIEW';
        }
        if (businessType === 'car_rental') {
          if (
            !agency.carRentalVerificationStatus ||
            agency.carRentalVerificationStatus === 'NOT_REGISTERED' ||
            agency.carRentalVerificationStatus === 'PENDING'
          ) {
            agency.carRentalVerificationStatus = 'PENDING';
          }
        } else {
          if (
            agency.verificationStatus === 'PENDING' ||
            (agency.verificationStatus as any) === 'MISSING_DOCS'
          ) {
            agency.verificationStatus = 'UNDER_REVIEW';
          }
        }
        // Approval status MUST remain PENDING for admin review
        if (!agency.approvalStatus || agency.approvalStatus !== 'APPROVED') {
          agency.approvalStatus = 'PENDING';
        }
        agency.timeline.push({
          id: `t-waive-${Date.now()}`,
          title: 'Registration Fee Waived & Application Submitted',
          timestamp: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          completed: true,
          desc: `One-time registration fee waived (Partner previously paid on network: ${feeStatus.reason}). Application queued for Super Admin review.`,
        });
        await agency.save();
      }

      return {
        feeWaived: true,
        alreadyPaid: true,
        subscriptionId: subscription._id.toString(),
        orderId: waivedOrderId,
        paymentId: waivedPaymentId,
        amount: 0,
        originalAmount: this.BASE_REGISTRATION_FEE,
        discount: this.BASE_REGISTRATION_FEE,
        currency: 'INR',
        partnerName,
        email,
        phone,
        businessType,
        invoiceNumber: invoiceNum,
        invoiceId: invoice._id.toString(),
        message:
          'One-time registration fee waived: ₹1,000 previously paid on ApnaTrip Partner Network.',
      };
    }

    let discount = 0;
    let finalAmount = this.BASE_REGISTRATION_FEE;
    let appliedCoupon: any = null;

    // Validate Coupon if provided
    if (input.couponCode && input.couponCode.trim()) {
      const platform = businessType === 'car_rental' ? 'car_rental_subscription' : 'agency_subscription';
      appliedCoupon = await couponService.validateAndApply({
        code: input.couponCode.trim(),
        platform,
        amount: this.BASE_REGISTRATION_FEE,
        userEmail: email,
        businessType,
      });
      discount = appliedCoupon.discount;
      finalAmount = appliedCoupon.finalAmount;
    }

    // Generate Razorpay order ID or standard cryptographic reference
    const orderRef = `order_sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let razorpayOrderId = orderRef;

    // If real Razorpay keys are configured and not test samples, attempt live Razorpay order creation
    if (
      envConfig.RAZORPAY_KEY_ID &&
      envConfig.RAZORPAY_KEY_SECRET &&
      envConfig.RAZORPAY_KEY_ID !== 'rzp_test_sample'
    ) {
      try {
        const authHeader = Buffer.from(
          `${envConfig.RAZORPAY_KEY_ID}:${envConfig.RAZORPAY_KEY_SECRET}`
        ).toString('base64');

        const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${authHeader}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: finalAmount * 100, // paise
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
            notes: {
              businessType,
              partnerName,
              email,
              phone,
              couponCode: appliedCoupon?.code || '',
            },
          }),
        });

        if (rzpResponse.ok) {
          const rzpData: any = await rzpResponse.json();
          if (rzpData?.id) {
            razorpayOrderId = rzpData.id;
          }
        }
      } catch (err) {
        console.warn('Razorpay live order API failed, using standard order reference:', err);
      }
    }

    // Create pending subscription record in MongoDB
    const subDoc: any = {
      businessType,
      partnerName,
      email,
      phone,
      plan: 'one_time_registration',
      amount: this.BASE_REGISTRATION_FEE,
      discount,
      amountPaid: finalAmount,
      orderId: razorpayOrderId,
      status: 'pending_payment',
    };

    if (input.draftId) {
      subDoc.draftId = input.draftId.trim();
    }

    if (input.agencyId && mongoose.Types.ObjectId.isValid(input.agencyId)) {
      subDoc.agencyId = new mongoose.Types.ObjectId(input.agencyId);
    }

    if (appliedCoupon) {
      subDoc.couponId = new mongoose.Types.ObjectId(appliedCoupon.couponId);
      subDoc.couponCode = appliedCoupon.code;
    }

    const subscription = await PartnerSubscriptionModel.create(subDoc);

    return {
      subscriptionId: subscription._id.toString(),
      orderId: razorpayOrderId,
      amount: finalAmount,
      originalAmount: this.BASE_REGISTRATION_FEE,
      discount,
      currency: 'INR',
      keyId: envConfig.RAZORPAY_KEY_ID || 'rzp_test_sample',
      partnerName,
      email,
      phone,
      businessType,
      couponApplied: appliedCoupon
        ? {
            code: appliedCoupon.code,
            type: appliedCoupon.type,
            discount: appliedCoupon.discount,
          }
        : null,
    };
  }

  /**
   * Verify Razorpay Payment Signature & Activate Partner Subscription
   */
  public async verifySubscriptionPayment(input: VerifySubscriptionPaymentInput) {
    const { subscriptionId, orderId, paymentId, signature } = input;

    if (!subscriptionId || !orderId || !paymentId) {
      throw new AppError('Missing subscription or payment identification details', HTTP_STATUS.BAD_REQUEST);
    }

    const subscription = await PartnerSubscriptionModel.findById(subscriptionId);
    if (!subscription) {
      throw new AppError('Subscription record not found', HTTP_STATUS.NOT_FOUND);
    }

    if (subscription.status === 'active') {
      return {
        success: true,
        alreadyActive: true,
        subscription,
        message: 'Subscription has already been activated and verified.',
      };
    }

    // Verify Razorpay HMAC-SHA256 Signature if live secret is available
    if (
      envConfig.RAZORPAY_KEY_SECRET &&
      envConfig.RAZORPAY_KEY_SECRET !== 'sample_secret' &&
      signature
    ) {
      const generatedSignature = crypto
        .createHmac('sha256', envConfig.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (generatedSignature !== signature) {
        throw new AppError('Invalid payment gateway signature verification failed', HTTP_STATUS.BAD_REQUEST);
      }
    }

    const now = new Date();
    const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    // 1. Create Official Tax Invoice
    const invoiceNum = `INV-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const invoice = await InvoiceModel.create({
      invoiceNumber: invoiceNum,
      businessType: subscription.businessType,
      partnerName: subscription.partnerName,
      userEmail: subscription.email,
      userPhone: subscription.phone,
      subscriptionId: subscription._id,
      paymentId,
      subtotal: subscription.amount,
      discount: subscription.discount,
      tax: 0,
      total: subscription.amountPaid,
      currency: 'INR',
      status: 'paid',
      issuedAt: now,
    });

    // 2. Record Subscription Payment
    const paymentDoc: any = {
      orderId,
      paymentId,
      subscriptionId: subscription._id,
      businessType: subscription.businessType,
      amount: subscription.amountPaid,
      currency: 'INR',
      status: 'paid',
      method: 'Razorpay',
      gateway: 'Razorpay',
      email: subscription.email,
      phone: subscription.phone,
      discountAmount: subscription.discount || 0,
      paidAt: now,
    };

    if (signature) {
      paymentDoc.signature = signature;
    }
    if (subscription.couponCode) {
      paymentDoc.couponCode = subscription.couponCode;
    }

    await SubscriptionPaymentModel.create(paymentDoc);

    // 3. Record Coupon Usage in MongoDB if coupon was applied
    if (subscription.couponId && subscription.couponCode) {
      await couponService.recordUsage({
        couponId: subscription.couponId,
        couponCode: subscription.couponCode,
        userEmail: subscription.email,
        subscriptionId: subscription._id,
        discount: subscription.discount,
        amount: subscription.amount,
        finalAmount: subscription.amountPaid,
        businessType: subscription.businessType,
      });
    }

    // 4. Update and Activate Subscription
    subscription.status = 'active';
    subscription.paymentId = paymentId;
    subscription.startedAt = now;
    subscription.expiresAt = oneYearLater;
    subscription.invoiceId = invoice._id as any;
    subscription.invoiceNumber = invoiceNum;
    await subscription.save();

    // 5. Connect and submit registration draft if available
    let updatedOnboardingStatus = 'UNDER_REVIEW';
    const cleanSubEmail = subscription.email ? subscription.email.trim().toLowerCase() : '';

    let draft = null;
    const targetDraftId = input.draftId || subscription.draftId;
    if (targetDraftId) {
      draft = await RegistrationDraftModel.findOne({ draftId: targetDraftId, isCompleted: false });
    }
    if (!draft && input.agencyId) {
      draft = await RegistrationDraftModel.findOne({
        $or: [
          { userId: input.agencyId },
          { 'businessDetails.agencyId': input.agencyId },
        ],
        isCompleted: false,
      }).sort({ updatedAt: -1 });
    }
    if (!draft && cleanSubEmail) {
      draft = await RegistrationDraftModel.findOne({
        $or: [
          { 'businessDetails.email': cleanSubEmail },
          { 'businessDetails.loginEmail': cleanSubEmail },
        ],
        isCompleted: false,
      }).sort({ updatedAt: -1 });
    }

    if (draft) {
      try {
        await registrationService.submitRegistration({
          draftId: draft.draftId,
          subscriptionId: subscription._id.toString(),
          paymentId,
          orderId,
        });
      } catch (submitErr: any) {
        logger.error('❌ Error during auto submitRegistration in verifySubscriptionPayment: %s', submitErr?.message || submitErr);
        throw submitErr;
      }
    } else {
      logger.warn('⚠️ No incomplete draft found in verifySubscriptionPayment for draftId=%s, subEmail=%s', targetDraftId, cleanSubEmail);
    }

    // Prefer partnerId or agencyId from subscription doc for reliable lookup
    const subAgencyId = (subscription as any).partnerId || (subscription as any).agencyId || input.agencyId;
    let agency = null;

    if (subAgencyId && mongoose.Types.ObjectId.isValid(String(subAgencyId))) {
      agency = await AgencyModel.findOne({ _id: subAgencyId, isDeleted: false });
    }

    // Fallback: email-based lookup
    if (!agency && cleanSubEmail) {
      agency = await AgencyModel.findOne({
        $or: [{ email: cleanSubEmail }, { loginEmail: cleanSubEmail }, { 'owner.email': cleanSubEmail }],
        isDeleted: false,
      });
    }

    if (agency) {
      agency.paymentStatus = 'PAID';
      agency.onboardingStatus = 'UNDER_REVIEW';
      agency.verificationStatus = 'UNDER_REVIEW';
      agency.timeline.push({
        id: `t-pay-${Date.now()}`,
        title: 'Registration Fee Paid & Application Submitted',
        timestamp: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        completed: true,
        desc: `One-time registration fee verified (Payment ID: ${paymentId}, Invoice: ${invoiceNum}). Application moved to Under Review.`,
      });
      await agency.save();
      updatedOnboardingStatus = agency.onboardingStatus;
    }

    return {
      success: true,
      onboardingStatus: updatedOnboardingStatus,
      subscriptionId: subscription._id.toString(),
      businessType: subscription.businessType,
      partnerName: subscription.partnerName,
      email: subscription.email,
      invoiceNumber: invoiceNum,
      invoiceId: invoice._id.toString(),
      amountPaid: subscription.amountPaid,
      discount: subscription.discount,
      status: 'active',
      startedAt: now,
      expiresAt: oneYearLater,
      message: 'Subscription payment verified and activated successfully!',
    };
  }

  /**
   * Get Subscription by ID
   */
  public async getSubscriptionById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid subscription identifier', HTTP_STATUS.BAD_REQUEST);
    }

    const subscription = await PartnerSubscriptionModel.findById(id).lean();
    if (!subscription) {
      throw new AppError('Subscription not found', HTTP_STATUS.NOT_FOUND);
    }

    const invoice = subscription.invoiceId
      ? await InvoiceModel.findById(subscription.invoiceId).lean()
      : null;

    return {
      ...subscription,
      invoice,
    };
  }

  /**
   * Get Invoice details
   */
  public async getInvoice(invoiceId: string) {
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      throw new AppError('Invalid invoice identifier', HTTP_STATUS.BAD_REQUEST);
    }

    const invoice = await InvoiceModel.findById(invoiceId).lean();
    if (!invoice) {
      throw new AppError('Invoice not found', HTTP_STATUS.NOT_FOUND);
    }

    return invoice;
  }

  /**
   * Admin: Overall Subscription Statistics
   */
  public async adminGetSubscriptionStats() {
    const [totalSubscriptions, activeCount, revenueData, agencyCount, carRentalCount] =
      await Promise.all([
        PartnerSubscriptionModel.countDocuments(),
        PartnerSubscriptionModel.countDocuments({ status: 'active' }),
        PartnerSubscriptionModel.aggregate([
          { $match: { status: 'active' } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$amountPaid' },
              totalDiscount: { $sum: '$discount' },
            },
          },
        ]),
        PartnerSubscriptionModel.countDocuments({ businessType: 'agency', status: 'active' }),
        PartnerSubscriptionModel.countDocuments({ businessType: 'car_rental', status: 'active' }),
      ]);

    const revenue = revenueData[0] || { totalRevenue: 0, totalDiscount: 0 };

    return {
      totalSubscriptions,
      activeSubscriptions: activeCount,
      totalRevenue: revenue.totalRevenue,
      totalDiscountGiven: revenue.totalDiscount,
      agencySubscriptions: agencyCount,
      carRentalSubscriptions: carRentalCount,
    };
  }
}

export const subscriptionService = new SubscriptionService();
