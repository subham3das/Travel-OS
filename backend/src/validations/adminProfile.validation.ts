import { z } from 'zod';

export const UpdateAdminProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100).optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
  location: z.string().optional(),
  language: z.string().optional(),
  profileImage: z.string().url('Profile image must be a valid URL').optional().or(z.literal('')),
  recoveryEmail: z.string().email('Please provide a valid recovery email').optional().or(z.literal('')),
});

export const ChangeAdminPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters long')
      .regex(/[A-Z]/, 'New password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'New password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'New password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'New password must contain at least one special character (@$!%*?&#)'),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.confirmPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'New password and confirm password do not match',
      path: ['confirmPassword'],
    }
  );

export const UpdateAdminPreferencesSchema = z.object({
  theme: z
    .enum(['Light', 'Dark', 'System', 'light', 'dark', 'system'])
    .transform((val) => (val ? (val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() as 'Light' | 'Dark' | 'System') : undefined))
    .optional(),
  language: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  desktopNotifications: z.boolean().optional(),
});
