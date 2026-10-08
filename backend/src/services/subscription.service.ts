import crypto from 'crypto';
import mongoose from 'mongoose';
import { PartnerSubscriptionModel, IPartnerSubscription } from '../models/partnerSubscription.model.js';
import { SubscriptionPaymentModel } from '../models/subscriptionPayment.model.js';
import { InvoiceModel } from '../models/invoice.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { RegistrationDraftModel } from '../models/registrationDraft.model.js';
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
   * Create Razorpay Order for Partner Subscription Checkout
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

    // Guard against repeated payments for already paid business
    if (input.agencyId && mongoose.Types.ObjectId.isValid(input.agencyId)) {
      const existingAgency = await AgencyModel.findById(input.agencyId).lean();
      if (existingAgency && (existingAgency.paymentStatus === 'PAID' || existingAgency.onboardingStatus === 'APPROVED' || existingAgency.onboardingStatus === 'UNDER_REVIEW')) {
        throw new AppError('Registration fee has already been paid for this business.', HTTP_STATUS.BAD_REQUEST);
      }
      const existingActiveSub = await PartnerSubscriptionModel.findOne({
        agencyId: new mongoose.Types.ObjectId(input.agencyId),
        status: 'active',
      }).lean();
      if (existingActiveSub) {
        throw new AppError('An active subscription already exists for this business.', HTTP_STATUS.BAD_REQUEST);
      }
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
