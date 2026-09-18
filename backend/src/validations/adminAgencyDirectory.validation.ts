import { z } from 'zod';

export const AdminAgencyDirectoryQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10) || 1) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10) || 10)) : 10)),
  search: z.string().optional().default(''),
  status: z.string().optional().default('All Status'),
  verification: z.string().optional().default('All Verification'),
  businessType: z.string().optional().default('All Types'),
  state: z.string().optional().default('All States'),
  city: z.string().optional().default('All Cities'),
  rating: z.string().optional().default('All Ratings'),
  dateJoined: z.string().optional().default(''),
  sortBy: z.string().optional().default('newest'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const AdminUpdateAgencyStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'INACTIVE', 'REJECTED', 'PENDING']).optional(),
  verificationStatus: z.enum(['APPROVED', 'VERIFIED', 'UNDER_REVIEW', 'PENDING', 'REJECTED', 'MISSING_DOCS']).optional(),
  action: z.enum(['activate', 'suspend', 'verify', 'reject', 'delete', 'update']).optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export const AdminBulkAgencyActionSchema = z.object({
  action: z.enum(['verify', 'suspend', 'activate', 'delete']),
  agencyIds: z.array(z.string()).min(1, 'At least one agency must be selected'),
  reason: z.string().optional(),
});

export type AdminAgencyDirectoryQueryInput = z.infer<typeof AdminAgencyDirectoryQuerySchema>;
export type AdminUpdateAgencyStatusInput = z.infer<typeof AdminUpdateAgencyStatusSchema>;
export type AdminBulkAgencyActionInput = z.infer<typeof AdminBulkAgencyActionSchema>;
