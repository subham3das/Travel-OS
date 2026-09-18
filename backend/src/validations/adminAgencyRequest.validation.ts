import { z } from 'zod';

export const AgencyRequestQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.string().optional().default('All Status'),
  businessType: z.string().optional().default('All Types'),
  state: z.string().optional().default('All States'),
  verificationStatus: z.string().optional().default('All Status'),
  submissionDate: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'name', 'complianceScore', 'submittedDate']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const ApproveAgencyRequestSchema = z.object({
  notes: z.string().optional(),
});

export const RejectAgencyRequestSchema = z.object({
  reason: z.string().min(5, 'Rejection reason must be at least 5 characters long').max(500),
  notes: z.string().optional(),
});

export const RequestDocumentsSchema = z.object({
  missingDocuments: z.union([z.array(z.string().min(1)), z.string().min(2)]),
  notes: z.string().optional(),
});

export const SaveReviewNotesSchema = z.object({
  note: z.string().min(1, 'Review note cannot be empty').max(1000),
});

export const BulkAgencyActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'request_docs']),
  agencyIds: z.array(z.string()).min(1, 'At least one agency ID must be provided'),
  reason: z.string().optional(),
  notes: z.string().optional(),
  missingDocuments: z.array(z.string()).optional(),
});
