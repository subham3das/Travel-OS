import { SystemSettingsModel } from '../models/systemSettings.model.js';
import { envConfig } from '../config/env.config.js';
import { AuditLoggerService } from './auditLogger.service.js';
import { logger } from '../config/logger.config.js';

export interface CommissionCalculationResult {
  bookingAmount: number;
  platformCommissionRate: number;
  platformCommissionType: 'PERCENTAGE' | 'FIXED';
  platformCommissionAmount: number;
  agencyReceivable: number;
  netAmount: number;
  taxRate: number;
  taxAmount: number;
}

export class CommissionService {
  /**
   * Get Active Platform Commission Settings from Database (Fallback to .env)
   */
  public async getCommissionSettings() {
    try {
      const settings = await SystemSettingsModel.findOne({ key: 'GLOBAL_SETTINGS' }).lean();
      if (settings?.commission) {
        return {
          type: settings.commission.type || 'PERCENTAGE',
          rate: typeof settings.commission.rate === 'number' ? settings.commission.rate : envConfig.PLATFORM_COMMISSION_DEFAULT,
          minFee: settings.commission.minFee || 0,
          maxFee: settings.commission.maxFee || 100000,
          taxRate: settings.commission.taxRate || 18,
          isAutoTransferEnabled: settings.commission.isAutoTransferEnabled ?? true,
          settlementCycle: settings.commission.settlementCycle || 'T+2',
          updatedAt: settings.commission.updatedAt,
          updatedBy: settings.commission.updatedBy,
        };
      }
    } catch (err: any) {
      logger.warn('Failed to load commission settings from DB, using env default: %s', err.message);
    }

    return {
      type: 'PERCENTAGE' as const,
      rate: envConfig.PLATFORM_COMMISSION_DEFAULT || 10,
      minFee: 0,
      maxFee: 100000,
      taxRate: 18,
      isAutoTransferEnabled: true,
      settlementCycle: 'T+2',
      updatedAt: new Date(),
      updatedBy: 'System Environment Default',
    };
  }

  /**
   * Calculate Platform Commission and Agency Receivable
   * Always reads dynamic settings, never hardcodes.
   */
  public async calculateCommission(totalAmount: number): Promise<CommissionCalculationResult> {
    const config = await this.getCommissionSettings();
    const amount = Math.max(0, totalAmount);

    let commission = 0;
    if (config.type === 'PERCENTAGE') {
      commission = (amount * config.rate) / 100;
    } else {
      commission = config.rate;
    }

    // Apply min/max bounds
    if (config.minFee && commission < config.minFee) {
      commission = config.minFee;
    }
    if (config.maxFee && commission > config.maxFee) {
      commission = config.maxFee;
    }

    commission = Math.min(amount, Math.round(commission * 100) / 100);
    const agencyReceivable = Math.max(0, Math.round((amount - commission) * 100) / 100);

    const taxAmount = Math.round(((commission * (config.taxRate || 18)) / 100) * 100) / 100;

    return {
      bookingAmount: amount,
      platformCommissionRate: config.rate,
      platformCommissionType: config.type,
      platformCommissionAmount: commission,
      agencyReceivable,
      netAmount: agencyReceivable,
      taxRate: config.taxRate || 18,
      taxAmount,
    };
  }

  /**
   * Phase 2: Calculate proportional refund split between platform commission and seller receivable
   * Uses integer paise arithmetic to guarantee accurate financial reconciliation.
   */
  public calculateRefundSplit(params: {
    originalGrossAmount: number;
    platformCommissionAmount: number;
    sellerReceivable: number;
    refundAmount: number;
  }): {
    refundAmountPaise: number;
    refundAmount: number;
    refundedCommissionPaise: number;
    refundedCommission: number;
    refundedSellerSharePaise: number;
    refundedSellerShare: number;
  } {
    const originalGrossPaise = Math.round(Math.max(1, params.originalGrossAmount) * 100);
    const refundPaise = Math.round(Math.max(0, params.refundAmount) * 100);
    const originalCommissionPaise = Math.round(params.platformCommissionAmount * 100);

    if (refundPaise <= 0) {
      return {
        refundAmountPaise: 0,
        refundAmount: 0,
        refundedCommissionPaise: 0,
        refundedCommission: 0,
        refundedSellerSharePaise: 0,
        refundedSellerShare: 0,
      };
    }

    // Exact proportional refund of commission
    const refundRatio = Math.min(1, refundPaise / originalGrossPaise);
    const refundedCommissionPaise = Math.round(originalCommissionPaise * refundRatio);
    // Remainder of refund comes from seller receivable
    const refundedSellerSharePaise = Math.max(0, refundPaise - refundedCommissionPaise);

    return {
      refundAmountPaise: refundPaise,
      refundAmount: refundPaise / 100,
      refundedCommissionPaise,
      refundedCommission: refundedCommissionPaise / 100,
      refundedSellerSharePaise,
      refundedSellerShare: refundedSellerSharePaise / 100,
    };
  }

  /**
   * Admin: Update Platform Commission Configuration
   */
  public async updateCommissionSettings(
    payload: {
      type?: 'PERCENTAGE' | 'FIXED';
      rate?: number;
      minFee?: number;
      maxFee?: number;
      taxRate?: number;
      isAutoTransferEnabled?: boolean;
      settlementCycle?: string;
    },
    admin?: any
  ) {
    let settings = await SystemSettingsModel.findOne({ key: 'GLOBAL_SETTINGS' });
    if (!settings) {
      settings = new SystemSettingsModel({ key: 'GLOBAL_SETTINGS' });
    }

    const currentComm = settings.commission || {
      type: 'PERCENTAGE',
      rate: 10,
      minFee: 0,
      maxFee: 100000,
      taxRate: 18,
      isAutoTransferEnabled: true,
      settlementCycle: 'T+2',
    };

    settings.commission = {
      ...currentComm,
      ...payload,
      updatedBy: admin?.name || admin?.email || 'Super Admin',
      updatedAt: new Date(),
    };

    await settings.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'SETTINGS',
      action: 'UPDATE_PLATFORM_COMMISSION',
      eventType: 'UPDATE',
      description: `Updated platform commission to ${settings.commission.rate}${settings.commission.type === 'PERCENTAGE' ? '%' : ' INR'}`,
      severity: 'High',
    });

    return settings.commission;
  }
}

export const commissionService = new CommissionService();
