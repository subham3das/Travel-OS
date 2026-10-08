import { z } from 'zod';

export const AgencyForgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid registered agency email address')
    .toLowerCase()
    .trim(),
});

export const AgencyResetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Password reset token is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least 1 lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least 1 number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least 1 special character'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const AgencyChangePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters long')
      .regex(/[A-Z]/, 'New password must contain at least 1 uppercase letter')
      .regex(/[a-z]/, 'New password must contain at least 1 lowercase letter')
      .regex(/[0-9]/, 'New password must contain at least 1 number')
      .regex(/[^A-Za-z0-9]/, 'New password must contain at least 1 special character'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and confirmation do not match',
    path: ['confirmPassword'],
  });

export const PartnerRegisterAccountSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'Owner full name must be at least 3 characters')
      .max(80, 'Owner full name cannot exceed 80 characters'),
    email: z
      .string()
      .email('Please enter a valid business email address')
      .toLowerCase()
      .trim(),
    phone: z
      .string()
      .trim()
      .regex(/^(\+91[\-\s]?)?[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least 1 lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least 1 number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least 1 special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the Terms & Privacy Policy to create an account',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const PartnerVerifyOtpSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  otp: z.string().length(6, 'Verification code must be exactly 6 digits'),
});

export const PartnerResendOtpSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

export const PartnerLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const PartnerCreateBusinessSchema = z.object({
  businessType: z.enum(['agency', 'car_rental']),
  name: z.string().trim().min(2, 'Business name is required').max(100),
  agencyDisplayName: z.string().trim().optional(),
  legalBusinessName: z.string().trim().optional(),
  businessAddress: z.string().trim().min(5, 'Office / business address is required'),
  city: z.string().trim().min(2, 'City is required'),
  state: z.string().trim().min(2, 'State is required'),
  pinCode: z.string().trim().regex(/^\d{6}$/, 'Please enter a valid 6-digit PIN code'),
  country: z.string().trim().optional(),
  yearEstablished: z.string().trim().optional(),
  registrationNumber: z.string().trim().optional(),
  gstNumber: z.string().trim().optional(),
  panNumber: z.string().trim().optional(),
  website: z.string().trim().optional(),
  fleetSize: z.number().optional(),
  supportedVehicleServices: z.array(z.string()).optional(),
});

