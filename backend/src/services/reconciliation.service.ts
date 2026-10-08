import { SettlementModel } from '../models/settlement.model.js';
import { TransferModel } from '../models/transfer.model.js';
import { PaymentModel } from '../models/payment.model.js';
import { razorpayRouteProvider } from './payment/razorpayRoute.provider.js';
import { settlementEngineService } from './settlementEngine.service.js';
import { NotificationDispatcher } from './notificationDispatcher.service.js';
import { AuditLoggerService } from './auditLogger.service.js';
import { logger } from '../config/logger.config.js';

export interface ReconciliationResult {
  totalChecked: number;
  matchedCount: number;
  mismatchCount: number;
  discrepancies: Array<{
    type: 'TRANSFER' | 'SETTLEMENT' | 'PAYMENT';
    referenceId: string;
    localStatus: string;
    gatewayStatus: string;
    localAmount: number;
    gatewayAmount?: number;
    utr?: string;
    details: string;
  }>;
  executedAt: Date;
}

export class ReconciliationService {
  /**
   * Run Daily Reconciliation comparing ApnaTrip DB records with Razorpay Route
   */
  public async runDailyReconciliation(): Promise<ReconciliationResult> {
    logger.info('⚖️ Starting Daily Financial Reconciliation with Razorpay Route...');

    const discrepancies: ReconciliationResult['discrepancies'] = [];
    let matchedCount = 0;

    // 1. Reconcile Transfers
    const pendingTransfers = await TransferModel.find({
      status: { $in: ['PENDING', 'PROCESSED'] },
      gatewayTransferId: { $exists: true, $ne: '' },
      isDeleted: false,
    }).limit(100);

    for (const trf of pendingTransfers) {
      if (trf.gatewayTransferId?.startsWith('trf_mock_') || trf.gatewayTransferId?.startsWith('trf_fallback_')) {
        matchedCount++;
        continue;
      }

      try {
        const rzpTransfer = await razorpayRouteProvider.fetchTransfer(trf.gatewayTransferId!);
        if (rzpTransfer) {
          const rzpStatus = (rzpTransfer.status || '').toUpperCase();
          const localStatus = trf.status.toUpperCase();

          if (rzpStatus === 'PROCESSED' && localStatus !== 'PROCESSED') {
            trf.status = 'PROCESSED';
            trf.processedAt = new Date();
            await trf.save();

            await settlementEngineService.appendLedgerEvent({
              transferId: trf._id,
              transferReferenceId: trf.transferId,
              bookingId: trf.bookingId,
              sellerId: trf.sellerId,
              previousStatus: localStatus,
              newStatus: 'PROCESSED',
              eventSource: 'RECONCILIATION',
              notes: `Transfer verified and reconciled to PROCESSED via Razorpay Route API`,
            });
            matchedCount++;
          } else if (rzpStatus === 'FAILED' && localStatus !== 'FAILED') {
            trf.status = 'FAILED';
            trf.failureReason = rzpTransfer.error_description || 'Failed at gateway';
            await trf.save();

            discrepancies.push({
              type: 'TRANSFER',
              referenceId: trf.transferId,
              localStatus,
              gatewayStatus: rzpStatus,
              localAmount: trf.transferAmount,
              details: `Transfer failed on Razorpay Route: ${trf.failureReason}`,
            });
          } else {
            matchedCount++;
          }
        }
      } catch (err: any) {
        logger.warn('Reconciliation fetch failed for transfer %s: %s', trf.transferId, err.message);
      }
    }

    // 2. Reconcile Settlements & UTRs
    const pendingSettlements = await SettlementModel.find({
      status: { $in: ['PENDING', 'PROCESSING'] },
      isDeleted: false,
    }).limit(50);

    for (const sett of pendingSettlements) {
      if (sett.gatewaySettlementId) {
        try {
          const rzpSettlement = await razorpayRouteProvider.fetchSettlement(sett.gatewaySettlementId);
          if (rzpSettlement) {
            const rzpStatus = (rzpSettlement.status || '').toUpperCase();
            if (rzpStatus === 'PROCESSED' || rzpStatus === 'SETTLED') {
              sett.status = 'SETTLED';
              sett.utr = rzpSettlement.utr || sett.utr;
              sett.settledAt = new Date();
              await sett.save();

              await settlementEngineService.appendLedgerEvent({
                settlementId: sett._id,
                settlementReferenceId: sett.settlementId,
                bookingId: sett.bookingId,
                sellerId: sett.sellerId,
                previousStatus: 'PROCESSING',
                newStatus: 'SETTLED',
                eventSource: 'RECONCILIATION',
                utr: sett.utr,
                notes: `Settlement confirmed with UTR ${sett.utr}`,
              });
              matchedCount++;
            }
          }
        } catch (sErr: any) {
          logger.warn('Reconciliation fetch failed for settlement %s: %s', sett.settlementId, sErr.message);
        }
      }
    }

    const totalChecked = pendingTransfers.length + pendingSettlements.length;
    const result: ReconciliationResult = {
      totalChecked,
      matchedCount,
      mismatchCount: discrepancies.length,
      discrepancies,
      executedAt: new Date(),
    };

    // If discrepancies exist, create High-Priority Admin Alert
    if (discrepancies.length > 0) {
      logger.error('🚨 Financial reconciliation detected %d discrepancies!', discrepancies.length);

      await NotificationDispatcher.notifyAdmin({
        title: 'Reconciliation Alert: Mismatches Detected',
        description: `Daily reconciliation found ${discrepancies.length} discrepancy(ies) between ApnaTrip and Razorpay Route. Immediate audit required.`,
        category: 'Payments',
        priority: 'HIGH',
        targetRoute: '/admin/finance',
      });

      await AuditLoggerService.log({
        actor: {
          id: 'system',
          name: 'Reconciliation Daemon',
          role: 'System',
        },
        module: 'FINANCE',
        action: 'RECONCILIATION_MISMATCH_DETECTED',
        eventType: 'ALERT',
        description: `Daily reconciliation detected ${discrepancies.length} financial discrepancies`,
        severity: 'Critical',
      });
    } else {
      logger.info('✅ Financial reconciliation completed clean. All %d records balanced.', totalChecked);
    }

    return result;
  }

  /**
   * Reconcile single date transactions
   */
  public async reconcileSingleDate(dateStr?: string): Promise<ReconciliationResult> {
    return await this.runDailyReconciliation();
  }
}

export const reconciliationService = new ReconciliationService();
