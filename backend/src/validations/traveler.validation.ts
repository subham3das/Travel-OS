import { z } from 'zod';

export const SavedTravelerAadhaarSchema = z.object({
  number: z.string().max(50).optional().default(''),
  frontUrl: z.string().url().or(z.literal('')).optional().default(''),
  backUrl: z.string().url().or(z.literal('')).optional().default(''),
});

export const SavedTravelerVoterIdSchema = z.object({
  number: z.string().max(50).optional().default(''),
  frontUrl: z.string().url().or(z.literal('')).optional().default(''),
});

export const SavedTravelerDrivingLicenceSchema = z.object({
  number: z.string().max(50).optional().default(''),
  frontUrl: z.string().url().or(z.literal('')).optional().default(''),
  backUrl: z.string().url().or(z.literal('')).optional().default(''),
});

export const SavedTravelerPassportSchema = z.object({
  number: z.string().max(50).optional().default(''),
  expiryDate: z
    .string()
    .or(z.date())
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : undefined)),
  documentUrl: z.string().url().or(z.literal('')).optional().default(''),
});

export const SavedTravelerEmergencyContactSchema = z.object({
  name: z.string().max(100).optional().default(''),
  phone: z.string().max(20).optional().default(''),
  relationship: z.string().max(50).optional().default(''),
});

export const SavedTravelerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100).trim(),
  dob: z
    .string()
    .or(z.date())
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : undefined))
    .refine((d) => !d || d < new Date(), 'Date of birth must be in the past'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  relationship: z.enum(['self', 'spouse', 'child', 'parent', 'sibling', 'friend', 'other']),
  nationality: z.string().min(2).default('Indian'),
  phone: z.string().max(25).optional().default(''),
  email: z.string().email().or(z.literal('')).optional().default(''),
  address: z.string().max(250).optional().default(''),
  emergencyContact: SavedTravelerEmergencyContactSchema.optional(),
  medicalNotes: z.string().max(500).optional().default(''),
  bloodGroup: z.string().max(10).optional().default(''),
  aadhaar: SavedTravelerAadhaarSchema.optional(),
  voterId: SavedTravelerVoterIdSchema.optional(),
  drivingLicence: SavedTravelerDrivingLicenceSchema.optional(),
  passport: SavedTravelerPassportSchema.optional(),
  photoUrl: z.string().url().or(z.literal('')).optional().default(''),
  isArchived: z.boolean().optional().default(false),
});

export const UpdateSavedTravelerSchema = SavedTravelerSchema.partial();
