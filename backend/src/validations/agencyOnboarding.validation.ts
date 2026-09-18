import { z } from 'zod';

/**
 * Flexible Step / Draft Validation Schema
 */
export const AgencySaveDraftSchema = z.object({
  applicationId: z.string().optional(),
  email: z.string().optional(),
  step: z.number().int().min(1).max(6).optional(),
  completionPercentage: z.number().min(0).max(100).optional(),
  business: z
    .object({
      legalBusinessName: z.string().optional(),
      agencyDisplayName: z.string().optional(),
      businessType: z.string().optional(),
      yearEstablished: z.string().optional(),
      businessRegistrationNumber: z.string().optional(),
      gstNumber: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      website: z.string().optional(),
      businessAddress: z.string().optional(),
      streetAddress: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pinCode: z.string().optional(),
      country: z.string().optional(),
    })
    .passthrough()
    .optional(),
  profile: z
    .object({
      logoUrl: z.string().optional(),
      coverUrl: z.string().optional(),
      tagline: z.string().optional(),
      about: z.string().optional(),
      yearsOfExperience: z.string().optional(),
      teamSize: z.string().optional(),
      selectedServices: z.array(z.string()).optional(),
      destinations: z.array(z.string()).optional(),
      languages: z.array(z.string()).optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      website: z.string().optional(),
      instagram: z.string().optional(),
      facebook: z.string().optional(),
    })
    .passthrough()
    .optional(),
  verification: z
    .object({
      ownerName: z.string().optional(),
      ownerEmail: z.string().optional(),
      ownerPhone: z.string().optional(),
      ownerPanNumber: z.string().optional(),
      ownerAadhaarNumber: z.string().optional(),
      governmentIdType: z.string().optional(),
      registrationCert: z.any().optional(),
      gstCert: z.any().optional(),
      panCard: z.any().optional(),
      governmentIdFile: z.any().optional(),
      selfieFile: z.any().optional(),
      addressProofFile: z.any().optional(),
    })
    .passthrough()
    .optional(),
  bank: z
    .object({
      accountHolderName: z.string().optional(),
      bankName: z.string().optional(),
      accountNumber: z.string().optional(),
      confirmAccountNumber: z.string().optional(),
      ifscCode: z.string().optional(),
      upiId: z.string().optional(),
      payoutMethod: z.string().optional(),
      branch: z.string().optional(),
    })
    .passthrough()
    .optional(),
  draftData: z.record(z.string(), z.any()).optional(),
});

/**
 * Onboarding Final Submission Validation Schema
 */
export const AgencySubmitOnboardingSchema = z.object({
  applicationId: z.string().optional(),
  business: z
    .object({
      legalBusinessName: z.string().min(1, 'Legal business name is required'),
      agencyDisplayName: z.string().optional(),
      businessType: z.string().optional(),
      yearEstablished: z.string().optional(),
      businessRegistrationNumber: z.string().optional(),
      gstNumber: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      website: z.string().optional(),
      businessAddress: z.string().optional(),
      streetAddress: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pinCode: z.string().optional(),
      country: z.string().default('India'),
    })
    .passthrough(),
  profile: z
    .object({
      logoUrl: z.string().optional(),
      coverUrl: z.string().optional(),
      tagline: z.string().optional(),
      about: z.string().optional(),
      yearsOfExperience: z.string().optional(),
      teamSize: z.string().optional(),
      selectedServices: z.array(z.string()).default([]),
      destinations: z.array(z.string()).default([]),
      languages: z.array(z.string()).optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      website: z.string().optional(),
      instagram: z.string().optional(),
      facebook: z.string().optional(),
    })
    .passthrough()
    .optional(),
  verification: z
    .object({
      ownerName: z.string().optional(),
      ownerEmail: z.string().optional(),
      ownerPhone: z.string().optional(),
      ownerPanNumber: z.string().optional(),
      ownerAadhaarNumber: z.string().optional(),
      governmentIdType: z.string().default('Aadhaar Card'),
      registrationCert: z.any().optional(),
      gstCert: z.any().optional(),
      panCard: z.any().optional(),
      governmentIdFile: z.any().optional(),
      selfieFile: z.any().optional(),
      addressProofFile: z.any().optional(),
    })
    .passthrough()
    .optional(),
  bank: z
    .object({
      accountHolderName: z.string().optional(),
      bankName: z.string().optional(),
      accountNumber: z.string().optional(),
      confirmAccountNumber: z.string().optional(),
      ifscCode: z.string().optional(),
      upiId: z.string().optional(),
      payoutMethod: z.string().default('bank'),
      branch: z.string().optional(),
    })
    .passthrough()
    .optional(),
  submittedAt: z.string().optional(),
});

/**
 * Super Admin Document-Specific Re-upload Request Schema
 */
export const AdminRequestDocumentsSchema = z.object({
  requestedDocuments: z
    .array(
      z.object({
        documentId: z.string().min(1, 'Document ID is required'),
        documentName: z.string().min(1, 'Document Name is required'),
        documentType: z.string().min(1, 'Document Type is required'),
        reason: z.string().min(1, 'Rejection reason is required'),
        customReason: z.string().optional(),
        internalNote: z.string().optional(),
      })
    )
    .min(1, 'At least one document must be selected for re-upload request'),
  agencyMessage: z.string().optional(),
});

/**
 * Re-upload Missing Documents Schema
 */
export const AgencyReuploadDocumentsSchema = z.object({
  applicationId: z.string().min(5, 'Application ID is required'),
  documents: z
    .array(
      z.object({
        id: z.string().optional(),
        documentId: z.string().optional(),
        name: z.string(),
        type: z.string(),
        fileUrl: z.string().url('Valid file URL required'),
        size: z.number().optional(),
        sizeFormatted: z.string().optional(),
      })
    )
    .min(1, 'At least one document file is required'),
  notes: z.string().optional(),
});

export type AgencySaveDraftInput = z.infer<typeof AgencySaveDraftSchema>;
export type AgencySubmitOnboardingInput = z.infer<typeof AgencySubmitOnboardingSchema>;
export type AgencyReuploadDocumentsInput = z.infer<typeof AgencyReuploadDocumentsSchema>;
export type AdminRequestDocumentsInput = z.infer<typeof AdminRequestDocumentsSchema>;
