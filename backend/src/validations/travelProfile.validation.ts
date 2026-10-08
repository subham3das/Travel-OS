import { z } from 'zod';

export const TravelProfileEmergencyContactSchema = z.object({
  name: z.string().max(100).optional().default(''),
  phone: z.string().max(20).optional().default(''),
  relationship: z.string().max(50).optional().default(''),
});

export const AadhaarDocumentSchema = z.object({
  number: z.string().max(50).optional().default(''),
  frontUrl: z.string().url().or(z.literal('')).optional().default(''),
  backUrl: z.string().url().or(z.literal('')).optional().default(''),
});

export const VoterIdDocumentSchema = z.object({
  number: z.string().max(50).optional().default(''),
  frontUrl: z.string().url().or(z.literal('')).optional().default(''),
});

export const DrivingLicenceDocumentSchema = z.object({
  number: z.string().max(50).optional().default(''),
  frontUrl: z.string().url().or(z.literal('')).optional().default(''),
  backUrl: z.string().url().or(z.literal('')).optional().default(''),
});

export const PassportDocumentSchema = z.object({
  number: z.string().max(50).optional().default(''),
  expiryDate: z
    .string()
    .or(z.date())
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : undefined)),
  documentUrl: z.string().url().or(z.literal('')).optional().default(''),
});

export const TravelProfilePreferencesSchema = z.object({
  seatPreference: z.string().max(50).optional().default('Any'),
  mealPreference: z.string().max(50).optional().default('Standard'),
  specialAssistance: z.string().max(200).optional().default(''),
});

export const UpdateTravelProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100).optional(),
  dob: z
    .string()
    .or(z.date())
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : undefined)),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  nationality: z.string().max(50).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional(),

  // Address
  address: z.string().max(250).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  pin: z.string().max(20).optional(),

  // Emergency Contact
  emergencyContact: TravelProfileEmergencyContactSchema.optional(),

  // Medical
  bloodGroup: z.string().max(10).optional(),
  medicalConditions: z.string().max(500).optional(),
  allergies: z.string().max(500).optional(),

  // Identity Documents
  aadhaar: AadhaarDocumentSchema.optional(),
  voterId: VoterIdDocumentSchema.optional(),
  drivingLicence: DrivingLicenceDocumentSchema.optional(),
  passport: PassportDocumentSchema.optional(),

  // Preferences
  travelPreferences: TravelProfilePreferencesSchema.optional(),
});
