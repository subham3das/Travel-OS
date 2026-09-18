import { z } from 'zod';

export const AdminPaymentQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  paymentStatus: z.string().optional(),
  settlementStatus: z.string().optional(),
  gateway: z.string().optional(),
  paymentMethod: z.string().optional(),
  agency: z.string().optional(),
  destination: z.string().optional(),
  dateRange: z.string().optional(),
  amountRange: z.string().optional(),
  sortBy: z.enum(['transactionId', 'amount', 'date', 'status', 'settlement', 'agency', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const AdminRefundPaymentSchema = z.object({
  refundAmount: z.number().optional(),
  reason: z.string().optional(),
});

export const AdminBulkPaymentActionSchema = z.object({
  paymentIds: z.array(z.string()).min(1, 'At least one payment must be selected'),
  action: z.enum(['settle', 'refund', 'reconcile']),
});
