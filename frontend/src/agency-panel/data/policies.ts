// ─── Package Policies, FAQs & Booking Rules Data ──────────────────────────────

export type CancellationPolicyType = 'Flexible' | 'Moderate' | 'Strict' | 'Custom';

export type RefundProcessingType =
  | 'Instant Refund'
  | '3-5 Business Days'
  | '7-10 Business Days'
  | 'Manual Processing';

export interface CustomCancellationRule {
  id: string;
  daysBeforeDeparture: string;
  refundPercentage: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const BOOKING_TERMS_CONFIG = [
  'Valid Government ID Required',
  'Booking is Non-transferable',
  'Package Subject to Weather',
  'Schedule may change due to local conditions',
  'Travelers must follow guide instructions',
  'No Illegal Activities',
  'Respect Local Culture',
  'Photography Restrictions',
];

export const REQUIRED_DOCUMENTS_CONFIG = [
  { id: 'aadhaar_card', label: 'Aadhaar Card' },
  { id: 'passport', label: 'Passport' },
  { id: 'driving_license', label: 'Driving License' },
  { id: 'pan_card', label: 'PAN Card' },
  { id: 'medical_certificate', label: 'Medical Certificate' },
  { id: 'student_id', label: 'Student ID' },
  { id: 'visa', label: 'Visa' },
  { id: 'passport_photos', label: 'Passport Photos' },
];

export const HEALTH_SAFETY_CONFIG = [
  'High Altitude Warning',
  'Fitness Required',
  'Oxygen Available',
  'Emergency Support',
  'Travel Insurance Recommended',
  'Medical Disclosure Required',
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Is network available?',
    answer: 'Postpaid BSNL and Airtel SIMs work best in Leh town. Limited connectivity in Nubra and Pangong.',
  },
  {
    id: 'faq-2',
    question: 'What is the best time to visit?',
    answer: 'May to September is ideal for pleasant weather and open mountain passes.',
  },
  {
    id: 'faq-3',
    question: 'What should I pack?',
    answer: 'Heavy woolen clothes, jackets, thermal wear, sunscreen, sunglasses, and personal medications.',
  },
];
