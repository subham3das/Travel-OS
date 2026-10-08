import mongoose from 'mongoose';
import { DisputeModel, IDispute, DisputeStatus } from '../models/dispute.model.js';
import { PaymentModel } from '../models/payment.model.js';
import { SettlementEventModel } from '../models/settlementEvent.model.js';
import { NotificationDispatcher } from './notificationDispatcher.service.js';
import { AuditLoggerService } from './auditLogger.service.js';
import { logger } from '../config/logger.config.js';
import { NotFoundError, BadRequestError } from '../utils/errors.util.js';

export interface OpenDisputeParams {
  paymentId: string;
  bookingId?: string;
  razorpayDisputeId?: string;
  amount: number;
  reason: string;
  category?: string;
  deadline?: Date;
  notes?: string;
  idempotencyKey?: string;
}

export class DisputeService {
  /**
   * Phase 3: Open Dispute / Chargeback Record
   */
  public async openDispute(params: OpenDisputeParams): Promise<IDispute> {
    const { paymentId, razorpayDisputeId, amount, reason, category, deadline, notes } = params;

    // Locate payment
    const payment = await PaymentModel.findOne({
      $or: [
        { paymentId },
        { gatewayTransactionId: paymentId },
        ...(mongoose.Types.ObjectId.isValid(paymentId) ? [{ _id: paymentId }] : []),
      ],
    });

    if (!payment) {
      throw new NotFoundError(`Payment not found for dispute: ${paymentId}`);
    }

    const idempotencyKey =
      params.idempotencyKey ||
      razorpayDisputeId ||
      `DISP_${payment.bookingId}_${Math.round(amount * 100)}_${Date.now()}`;

    const existing = await DisputeModel.findOne({ idempotencyKey });
    if (existing) {
      logger.info('♻️ Idempotent dispute detected for key: %s (ID: %s)', idempotencyKey, existing.disputeId);
      return existing;
    }

    const disputeRef = `DISP-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const disputeDoc = await DisputeModel.create({
      disputeId: disputeRef,
      razorpayDisputeId,
      paymentId: payment._id,
      razorpayPaymentId: payment.gatewayTransactionId || payment.paymentId,
      bookingId: payment.bookingId || params.bookingId || 'UNKNOWN_BOOKING',
      sellerId: payment.agencyId || new mongoose.Types.ObjectId(),
      sellerType: 'Agency',
      sellerName: payment.agencyName || 'ApnaTrip Partner',

      amount,
      amountPaise: Math.round(amount * 100),
      currency: payment.currency || 'INR',

      reason,
      category: category || 'chargeback',
      evidence: [],
      status: 'DISPUTE_OPENED',
      deadline: deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
      notes: notes || '',
      idempotencyKey,
    });

    // Append to Immutable Audit Ledger
    await SettlementEventModel.create({
      paymentId: payment._id,
      paymentReferenceId: payment.paymentId,
      disputeId: disputeRef,
      bookingId: payment.bookingId,
      sellerId: payment.agencyId,
      actor: { id: 'GATEWAY', name: 'Razorpay / Bank', role: 'Gateway' },
      eventType: 'DISPUTE_OPENED',
      previousStatus: payment.status,
      newStatus: 'DISPUTE_OPENED',
      eventSource: 'DISPUTE_LIFECYCLE',
      amount,
      notes: `Dispute opened for ₹${amount}. Reason: ${reason}`,
      metadata: { razorpayDisputeId, deadline },
    });

    // Notify Admin
    await NotificationDispatcher.notifyAdmin({
      category: 'Payments',
      title: `Dispute Opened: ₹${amount} (${disputeRef})`,
      description: `A dispute has been opened for booking ${payment.bookingId}. Evidence deadline: ${deadline?.toISOString() || 'N/A'}.`,
      priority: 'HIGH',
      metadata: { disputeId: disputeRef, bookingId: payment.bookingId, amount },
    });

    // Notify Agency
    if (payment.agencyId) {
      await NotificationDispatcher.notifyAgency(payment.agencyId, {
        category: 'Bookings',
        title: `Action Required: Dispute Opened (₹${amount})`,
        description: `A chargeback dispute was initiated for booking ${payment.bookingId}. Please provide evidence before the deadline.`,
        priority: 'HIGH',
        metadata: { disputeId: disputeRef, bookingId: payment.bookingId },
      });
    }

    return disputeDoc;
  }

  /**
   * Submit Evidence for a Dispute
   */
  public async submitEvidence(
    disputeId: string,
    evidenceList: Array<{ documentType: string; documentUrl: string; description?: string }>,
    actor?: { id?: string; name?: string; role?: string }
  ): Promise<IDispute> {
    const dispute = await DisputeModel.findOne({ disputeId, isDeleted: false });
    if (!dispute) {
      throw new NotFoundError(`Dispute not found: ${disputeId}`);
    }

    if (dispute.status === 'WON' || dispute.status === 'LOST' || dispute.status === 'CLOSED') {
      throw new BadRequestError(`Cannot submit evidence for dispute in status: ${dispute.status}`);
    }

    const newEvidenceItems = evidenceList.map((item) => ({
      documentType: item.documentType,
      documentUrl: item.documentUrl,
      description: item.description,
      submittedAt: new Date(),
      submittedBy: actor?.name || 'Super Admin',
    }));

    dispute.evidence.push(...newEvidenceItems);
    dispute.status = 'EVIDENCE_SUBMITTED';
    await dispute.save();

    await SettlementEventModel.create({
      paymentId: dispute.paymentId,
      disputeId,
      bookingId: dispute.bookingId,
      sellerId: dispute.sellerId,
      actor: { id: actor?.id, name: actor?.name || 'Admin', role: actor?.role || 'Admin' },
      eventType: 'EVIDENCE_SUBMITTED',
      previousStatus: 'DISPUTE_OPENED',
      newStatus: 'EVIDENCE_SUBMITTED',
      eventSource: 'DISPUTE_LIFECYCLE',
      amount: dispute.amount,
      notes: `Evidence documents (${evidenceList.length}) submitted for dispute ${disputeId}`,
    });

    return dispute;
  }

  /**
   * Update Dispute Status (Under Review, Won, Lost, Closed)
   */
  public async updateDisputeStatus(
    disputeId: string,
    params: {
      status: DisputeStatus;
      result?: 'WON' | 'LOST' | 'CLOSED' | 'CANCELLED';
      notes?: string;
    },
    admin?: any
  ): Promise<IDispute> {
    const dispute = await DisputeModel.findOne({ disputeId, isDeleted: false });
    if (!dispute) {
      throw new NotFoundError(`Dispute not found: ${disputeId}`);
    }

    const previousStatus = dispute.status;
    dispute.status = params.status;
    if (params.result) dispute.result = params.result;
    if (params.notes) dispute.notes = `${dispute.notes || ''}\n${params.notes}`;

    if (['WON', 'LOST', 'CLOSED'].includes(params.status)) {
      dispute.closedAt = new Date();
    }

    await dispute.save();

    await SettlementEventModel.create({
      paymentId: dispute.paymentId,
      disputeId,
      bookingId: dispute.bookingId,
      sellerId: dispute.sellerId,
      actor: { id: admin?._id?.toString(), name: admin?.name || 'Admin', role: 'Super Admin' },
      eventType: `DISPUTE_${params.status}`,
      previousStatus,
      newStatus: params.status,
      eventSource: 'DISPUTE_LIFECYCLE',
      amount: dispute.amount,
      notes: `Dispute ${disputeId} status updated to ${params.status}. Result: ${params.result || 'N/A'}`,
    });

    // Log admin action
    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString() || 'ADMIN',
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'PAYMENT',
      action: 'UPDATE_DISPUTE',
      eventType: 'UPDATE',
      description: `Dispute ${disputeId} updated to ${params.status} (${params.result || ''})`,
      severity: 'Medium',
    });

    return dispute;
  }

  /**
   * List Disputes for Admin Workspace
   */
  public async listDisputes(filters: {
    status?: string;
    search?: string;
    limit?: number;
    skip?: number;
  }) {
    const query: any = { isDeleted: false };
    if (filters.status && filters.status !== 'ALL') {
      query.status = filters.status;
    }
    if (filters.search) {
      const regex = new RegExp(filters.search, 'i');
      query.$or = [
        { disputeId: regex },
        { bookingId: regex },
        { razorpayDisputeId: regex },
        { sellerName: regex },
      ];
    }

    const limit = filters.limit || 20;
    const skip = filters.skip || 0;

    const [items, total] = await Promise.all([
      DisputeModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      DisputeModel.countDocuments(query),
    ]);

    return { items, total, page: Math.floor(skip / limit) + 1, totalPages: Math.ceil(total / limit) };
  }
}

export const disputeService = new DisputeService();
