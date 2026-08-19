export const UserTypeEnum = {
  CUSTOMER: 'CUSTOMER',
  AGENCY: 'AGENCY',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export const UserStatusEnum = {
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  DISABLED: 'Disabled',
  PENDING: 'Pending',
} as const;

export const AgencyStatusEnum = {
  PENDING_KYC: 'Pending_KYC',
  UNDER_REVIEW: 'Under_Review',
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  REJECTED: 'Rejected',
} as const;

export const PackageStatusEnum = {
  DRAFT: 'Draft',
  PENDING_APPROVAL: 'Pending_Approval',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
  REJECTED: 'Rejected',
} as const;

export const TripStatusEnum = {
  UPCOMING: 'Upcoming',
  REGISTRATION_OPEN: 'Registration_Open',
  FULLY_BOOKED: 'Fully_Booked',
  IN_PROGRESS: 'In_Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;

export const BookingStatusEnum = {
  PENDING_PAYMENT: 'Pending_Payment',
  CONFIRMED: 'Confirmed',
  IN_PROGRESS: 'In_Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
} as const;

export const PaymentStatusEnum = {
  SUCCESS: 'Success',
  PROCESSING: 'Processing',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
  DISPUTED: 'Disputed',
} as const;

export const SettlementStatusEnum = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  PROCESSING: 'Processing',
  SETTLED: 'Settled',
  REJECTED: 'Rejected',
} as const;

export const SupportTicketPriorityEnum = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
} as const;

export const SupportTicketStatusEnum = {
  OPEN: 'Open',
  IN_PROGRESS: 'In_Progress',
  WAITING_RESPONSE: 'Waiting_Response',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
} as const;

export const AdminAccountStatusEnum = {
  ACTIVE: 'Active',
  PENDING_INVITATION: 'Pending Invitation',
  SUSPENDED: 'Suspended',
  DISABLED: 'Disabled',
} as const;
