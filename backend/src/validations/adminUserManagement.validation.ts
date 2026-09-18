import { z } from 'zod';

export const AdminUserQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10) || 1) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10) || 10)) : 10)),
  search: z.string().optional().default(''),
  userStatus: z.string().optional().default('All Status'),
  status: z.string().optional().default('All Status'),
  verification: z.string().optional().default('All Verification'),
  membership: z.string().optional().default('All Membership'),
  country: z.string().optional().default('All Countries'),
  state: z.string().optional().default('All States'),
  city: z.string().optional().default('All Cities'),
  registrationDate: z.string().optional().default(''),
  sortBy: z.string().optional().default('joinDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const AdminCreateUserSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(100),
  name: z.string().optional(),
  email: z.string().email('Valid email is required').toLowerCase(),
  phone: z.string().optional().default(''),
  city: z.string().optional().default('Mumbai'),
  state: z.string().optional().default('Maharashtra'),
  country: z.string().optional().default('India'),
  gender: z.enum(['Male', 'Female', 'Other', 'male', 'female', 'other', 'prefer_not_to_say']).optional().default('male'),
  dob: z.string().optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional().default('Indian'),
  passportStatus: z.enum(['Verified', 'Pending', 'Not Provided', 'Expired']).optional().default('Not Provided'),
  emergencyContact: z.string().optional().default(''),
  membership: z.enum(['Free', 'Silver', 'Gold', 'Platinum']).optional().default('Free'),
  status: z.enum(['Active', 'Inactive', 'Suspended', 'Blocked', 'Disabled', 'Pending']).optional().default('Active'),
  verificationStatus: z.enum(['Verified', 'Pending']).optional().default('Verified'),
});

export const AdminUpdateUserSchema = z.object({
  fullName: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  gender: z.string().optional(),
  dob: z.string().optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  emergencyContact: z.string().optional(),
  membership: z.enum(['Free', 'Silver', 'Gold', 'Platinum']).optional(),
  status: z.enum(['Active', 'Inactive', 'Suspended', 'Blocked', 'Disabled', 'Pending']).optional(),
  verificationStatus: z.enum(['Verified', 'Pending']).optional(),
  kycVerification: z.enum(['Verified', 'Pending']).optional(),
  emailVerification: z.enum(['Verified', 'Pending']).optional(),
  phoneVerification: z.enum(['Verified', 'Pending']).optional(),
  passportVerification: z.enum(['Verified', 'Pending']).optional(),
  passportStatus: z.enum(['Verified', 'Pending', 'Not Provided', 'Expired']).optional(),
  action: z.enum(['verify', 'suspend', 'activate', 'delete', 'reset_password', 'update']).optional(),
  reason: z.string().optional(),
});

export const AdminBulkUserActionSchema = z.object({
  action: z.enum(['verify', 'suspend', 'activate', 'delete', 'notification', 'reset_password']),
  userIds: z.array(z.string()).min(1, 'At least one user must be selected'),
  reason: z.string().optional(),
  title: z.string().optional(),
  message: z.string().optional(),
});

export const AdminSendNotificationSchema = z.object({
  title: z.string().min(1, 'Notification title is required'),
  message: z.string().min(1, 'Notification message is required'),
  type: z.string().optional().default('in_app'),
});

export type AdminUserQueryInput = z.infer<typeof AdminUserQuerySchema>;
export type AdminCreateUserInput = z.infer<typeof AdminCreateUserSchema>;
export type AdminUpdateUserInput = z.infer<typeof AdminUpdateUserSchema>;
export type AdminBulkUserActionInput = z.infer<typeof AdminBulkUserActionSchema>;
export type AdminSendNotificationInput = z.infer<typeof AdminSendNotificationSchema>;
