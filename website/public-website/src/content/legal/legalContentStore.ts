import { LEGAL_CONFIG } from '../../data/legal/legalConfig';

export interface LegalHeading {
  id: string;
  title: string;
  level: number;
}

export interface LegalVersionRecord {
  version: string;
  publishedDate: string;
  summary: string;
  reviewedBy: string;
}

export interface LegalDocumentMetadata {
  id: string;
  slug: string;
  title: string;
  summary: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  readingTimeMinutes: number;
  category: 'Platform & Agreements' | 'Privacy & Data' | 'Payments & Financial' | 'Safety & Compliance';
  tags: string[];
  status: 'Published' | 'Draft' | 'Archived';
  reviewedBy: string;
  changelog: LegalVersionRecord[];
}

export interface LegalDocumentContent extends LegalDocumentMetadata {
  sections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

export const LEGAL_CONTENT_STORE: LegalDocumentContent[] = [
  // ── 1. TERMS OF SERVICE ───────────────────────────────────────────────────
  {
    id: 'terms',
    slug: 'terms',
    title: 'Terms of Service',
    summary: 'The master binding agreement governing use of ApnaTrip marketplace, bookings, accounts, and services.',
    version: '1.2.0',
    effectiveDate: LEGAL_CONFIG.effectiveDate,
    lastUpdated: LEGAL_CONFIG.lastUpdated,
    readingTimeMinutes: 14,
    category: 'Platform & Agreements',
    tags: ['contract', 'marketplace', 'bookings', 'intermediary', 'governance'],
    status: 'Published',
    reviewedBy: 'Legal Advisory Board & Compliance Team',
    changelog: [
      {
        version: '1.2.0',
        publishedDate: 'October 1, 2026',
        summary: 'Updated Section 79 Intermediary liabilities and milestone escrow clauses.',
        reviewedBy: 'Legal Team',
      },
      {
        version: '1.0.0',
        publishedDate: 'January 15, 2026',
        summary: 'Initial release of ApnaTrip Public Platform Terms.',
        reviewedBy: 'Legal Advisory',
      },
    ],
    sections: [
      {
        id: 'introduction',
        title: '1. Introduction & Company Identity',
        content: `Welcome to ${LEGAL_CONFIG.brandName}, an integrated technology platform operated by ${LEGAL_CONFIG.companyName} ("ApnaTrip", "we", "us", or "our"). These Terms of Service ("Terms") constitute a legally binding agreement between you and ApnaTrip regarding your access to and use of ${LEGAL_CONFIG.platformDomain}, ${LEGAL_CONFIG.appDomain}, related mobile applications, and web services (collectively, the "Platform").
By creating an account, browsing, or completing a booking, you affirm that you have read, understood, and agree to be bound by these Terms, our [Privacy Policy](/legal/privacy), and [Community Guidelines](/legal/community).`
      },
      {
        id: 'eligibility',
        title: '2. Eligibility & Account Creation',
        content: `You must be at least 18 years of age and legally competent to enter into binding contracts under the Indian Contract Act, 1872. To access key features including booking tour packages, reserving intercity routes, renting self-drive vehicles, or operating as an agency partner, you must register for an account.
You agree to provide accurate, current, and complete information, and promptly update your profile. You are solely responsible for maintaining the confidentiality of your credentials and for all activities under your account.`
      },
      {
        id: 'marketplace-nature',
        title: '3. Marketplace Nature & Platform Role',
        content: `ApnaTrip is an online technology intermediary and marketplace under Section 79 of the Information Technology Act, 2000. ApnaTrip does not own, manage, or operate travel agencies, private vehicle fleets, or public bus services unless explicitly designated as an ApnaTrip-operated service.
Independent third-party travel agencies, licensed commercial vehicle operators, and peer fleet partners ("Partners") list itineraries and vehicles. While ApnaTrip conducts rigorous document audits (GST, PAN, tourism ministry registrations), the contractual relationship for travel execution exists between the traveler and the confirmed Partner.`
      },
      {
        id: 'booking-terms',
        title: '4. Booking Terms (Packages, Routes & Rentals)',
        content: `• Tour Packages: Tour itineraries, inclusions, exclusions, and departure slots are defined by registered agencies. Vouchers issued upon booking confirmation serve as valid trip permits.
• Intercity Route Booking: Route transport operates on scheduled departure slots with transparent flat fares. Travelers must report to designated pickup hubs 15 minutes before departure.
• Self-Drive Rentals: Rentals are subject to digital vehicle inspection, valid Indian driving license or International Driving Permit (IDP) verification, and adherence to our [Vehicle Handover Terms](/legal/vehicle-handover).
All bookings require successful payment authorization via our approved gateway.`
      },
      {
        id: 'payments-escrow',
        title: '5. Payments, Razorpay & Milestone Escrow',
        content: `All payments on the Platform are processed securely through ${LEGAL_CONFIG.paymentGateway.name} (${LEGAL_CONFIG.paymentGateway.role}).
To protect travelers and agencies alike, ApnaTrip employs a milestone payment escrow framework:
1. Traveler deposits booking funds into an escrow-backed account.
2. Advance payouts are limited to confirmed logistics readiness (e.g. hotel room block confirmations).
3. The remaining balance is released to the agency or fleet operator only after successful passenger check-in and trip commencement as detailed in our [Milestone Escrow Rules](/legal/escrow).`
      },
      {
        id: 'kyc-identity',
        title: '6. User KYC, Identity & Travel Profile',
        content: `To ensure passenger safety, prevent fraud, and comply with state permit guidelines for protected tribal or border areas (e.g., Inner Line Permits in Arunachal Pradesh, Ladakh LAC access), travelers must complete a one-time Digital KYC profile.
You agree that all submitted government IDs (Aadhaar, Passport, Driving License, Voter ID) are genuine. Submitting forged or impersonated credentials constitutes a criminal violation under applicable Indian penal statutes and results in immediate permanent bans.`
      },
      {
        id: 'intellectual-property',
        title: '7. Intellectual Property & Community Content',
        content: `All trademarks, logos, UI designs, codebases, audio-visual elements, and proprietary algorithms on ApnaTrip are the exclusive property of ApnaTrip or its licensors.
Content uploaded by users (reviews, travel photos, trip tips) remains your intellectual property; however, you grant ApnaTrip an irrevocable, royalty-free, worldwide license to display, index, distribute, and promote such content within the ecosystem.`
      },
      {
        id: 'limitation-liability',
        title: '8. Limitation of Liability & Force Majeure',
        content: `ApnaTrip is not liable for indirect, incidental, punitive, or consequential damages resulting from trip delays, weather disasters, landslides, government road closures, wildlife sanctuary permit revocations, or partner service failures beyond reasonable control. In no event shall ApnaTrip's aggregate liability exceed the total platform facilitation fee collected from the user for the specific disputed transaction.`
      },
      {
        id: 'governing-law',
        title: '9. Governing Law & Dispute Jurisdiction',
        content: `These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or in connection with these Terms, if not resolved amicably through our [Grievance Redressal Mechanism](/legal/grievance) within 30 business days, shall be subject to the exclusive jurisdiction of the competent courts in Dibrugarh, Assam, India.`
      },
      {
        id: 'contact-notice',
        title: '10. Legal Notice & Inquiries',
        content: `Formal legal notices may be served electronically to ${LEGAL_CONFIG.contacts.legal} or physically to our registered address: ${LEGAL_CONFIG.registeredOffice.addressLine1}, ${LEGAL_CONFIG.registeredOffice.city}, ${LEGAL_CONFIG.registeredOffice.state} ${LEGAL_CONFIG.registeredOffice.postalCode}, ${LEGAL_CONFIG.registeredOffice.country}.`
      }
    ]
  },

  // ── 2. PRIVACY POLICY ─────────────────────────────────────────────────────
  {
    id: 'privacy',
    slug: 'privacy',
    title: 'Privacy Policy',
    summary: 'How ApnaTrip collects, processes, encrypts, and retains personal data under the DPDP Act 2023.',
    version: '2.0.1',
    effectiveDate: LEGAL_CONFIG.effectiveDate,
    lastUpdated: LEGAL_CONFIG.lastUpdated,
    readingTimeMinutes: 12,
    category: 'Privacy & Data',
    tags: ['dpdp', 'privacy', 'security', 'data-protection', 'consent'],
    status: 'Published',
    reviewedBy: 'Data Protection Officer (DPO)',
    changelog: [
      {
        version: '2.0.1',
        publishedDate: 'October 1, 2026',
        summary: 'Structured compliance alignment with Digital Personal Data Protection Act (DPDP) 2023 rules.',
        reviewedBy: 'Data Protection Officer',
      },
    ],
    sections: [
      {
        id: 'privacy-commitment',
        title: '1. Commitment to Data Protection & DPDP 2023',
        content: `At ${LEGAL_CONFIG.brandName}, privacy is built into our product architecture. This Privacy Policy outlines our practices regarding data fiduciary obligations under the Digital Personal Data Protection Act, 2023 (DPDP Act, 2023), the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.`
      },
      {
        id: 'data-collected',
        title: '2. Personal Data We Collect',
        content: `We collect only what is necessary to fulfill travel bookings and verify marketplace integrity:
• Identity Data: Full legal name, date of birth, gender, nationality, emergency contact details.
• Contact Details: Verified mobile phone number and primary email address.
• KYC & Government Credentials: Driving license (for self-drive), Passport/Aadhaar details (for regional border permits and KYC verification). Documents are stored in encrypted vaults.
• Financial Information: Payment tokens, transaction histories, Razorpay billing reference IDs. ApnaTrip does not store raw credit/debit card CVVs or net banking passwords.
• Location & Device Data: IP address, device fingerprints, browser telemetry, and live trip GPS coordinates (only when active vehicle tracking is granted). For cookie telemetry, refer to our [Cookie Policy](/legal/cookies).`
      },
      {
        id: 'purpose-usage',
        title: '3. Purpose & Legal Basis of Processing',
        content: `We process personal data for:
1. Facilitating and executing tour packages, intercity cab seats, and vehicle handovers.
2. Generating passenger manifests required by regional transport authorities and security checkposts.
3. Milestone escrow reconciliation and fraud prevention as per [Milestone Escrow Rules](/legal/escrow).
4. Emergency SOS response and 24×7 concierge coordination during active journeys.
5. Compliance with statutory tax, GST invoice issuance, and regulatory disclosures.`
      },
      {
        id: 'data-sharing',
        title: '4. Third-Party Data Sharing & Sub-processors',
        content: `We share data strictly on a need-to-know basis with vetted infrastructure partners:
• Payment Aggregator: ${LEGAL_CONFIG.paymentGateway.name} for payment collection and bank reconciliations.
• Fulfilment Partners: The specific tour agency or vehicle owner assigned to your booking receives only necessary passenger manifest details.
• Cloud Storage & Infrastructure: Encrypted cloud datacenters in India compliant with data localization guidelines.
• Notification Services: SMS, transactional email, and WhatsApp dispatch providers for vouchers and emergency notifications.`
      },
      {
        id: 'data-principal-rights',
        title: '5. Your Rights as a Data Principal',
        content: `Under the DPDP Act 2023, you have the right to:
• Access a summary of personal data held about you and processing activities.
• Request correction, completion, or updating of inaccurate personal data.
• Request erasure of personal data, subject to mandatory statutory tax and accounting retention periods (e.g. GST records for 6 years).
• Nominate a representative in the event of death or incapacity.
• Withdraw consent at any time via your account settings or by emailing ${LEGAL_CONFIG.contacts.privacy}.`
      },
      {
        id: 'security-measures',
        title: '6. Security Safeguards & Encryption',
        content: `We implement defense-in-depth security: AES-256 encryption for data at rest, TLS 1.3 encryption in transit, role-based access control (RBAC), and automated threat detection as outlined in our [Security Policy](/legal/security). Regular penetration testing and code audits are conducted.`
      },
      {
        id: 'grievance-officer',
        title: '7. Data Protection & Grievance Officer',
        content: `If you have concerns or wish to exercise your statutory privacy rights:
Name: ${LEGAL_CONFIG.officers.grievanceOfficer.name}
Role: ${LEGAL_CONFIG.officers.grievanceOfficer.designation}
Email: ${LEGAL_CONFIG.contacts.privacy}
Address: ${LEGAL_CONFIG.officers.grievanceOfficer.address}
We acknowledge privacy grievances within 24 hours and resolve them within 15 working days as detailed in our [Grievance Redressal Mechanism](/legal/grievance).`
      }
    ]
  },

  // ── 3. COOKIE POLICY ──────────────────────────────────────────────────────
  {
    id: 'cookies',
    slug: 'cookies',
    title: 'Cookie Policy',
    summary: 'Transparent breakdown of essential, preference, and performance cookies used on ApnaTrip.',
    version: '1.1.0',
    effectiveDate: LEGAL_CONFIG.effectiveDate,
    lastUpdated: LEGAL_CONFIG.lastUpdated,
    readingTimeMinutes: 6,
    category: 'Privacy & Data',
    tags: ['cookies', 'local-storage', 'analytics', 'preferences'],
    status: 'Published',
    reviewedBy: 'Product & Privacy Council',
    changelog: [
      {
        version: '1.1.0',
        publishedDate: 'October 1, 2026',
        summary: 'Clarified zero dark patterns policy and local storage token management.',
        reviewedBy: 'Engineering & Legal',
      },
    ],
    sections: [
      {
        id: 'what-are-cookies',
        title: '1. What Are Cookies?',
        content: `Cookies and local storage tokens are small text fragments stored on your device when you visit ${LEGAL_CONFIG.platformDomain}. They allow us to remember authentication states, keep you signed in, preserve search filters, and enhance performance.`
      },
      {
        id: 'cookie-types',
        title: '2. Categories of Cookies We Use',
        content: `• Strictly Essential Cookies: Necessary for core security, session management, CSRF prevention, and Razorpay checkout tokenization. Cannot be disabled.
• Preference Cookies: Store your preferred theme (Dark/Light mode), language, and currency formats.
• Analytics & Performance Cookies: Anonymous telemetry measuring page load timings, component interactions, and error rates to optimize the portal.
ApnaTrip does NOT sell your browsing data or use deceptive dark patterns.`
      },
      {
        id: 'control-cookies',
        title: '3. Managing Your Cookie Preferences',
        content: `You can block or delete cookies through your browser preferences (Chrome, Safari, Firefox, Edge). Note that disabling essential session cookies will prevent login and checkout functionalities.`
      }
    ]
  },

  // ── 4. COMMUNITY GUIDELINES ───────────────────────────────────────────────
  {
    id: 'community',
    slug: 'community',
    title: 'Community Guidelines',
    summary: 'Standards of conduct for the ApnaTrip explorer network, reviews, and agency interactions.',
    version: '1.0.0',
    effectiveDate: LEGAL_CONFIG.effectiveDate,
    lastUpdated: LEGAL_CONFIG.lastUpdated,
    readingTimeMinutes: 7,
    category: 'Safety & Compliance',
    tags: ['community', 'trust', 'conduct', 'moderation', 'reviews'],
    status: 'Published',
    reviewedBy: 'Community Trust Director',
    changelog: [
      {
        version: '1.0.0',
        publishedDate: 'January 15, 2026',
        summary: 'Baseline guidelines for community explorer interactions and review authenticity.',
        reviewedBy: 'Community Ops',
      },
    ],
    sections: [
      {
        id: 'explorer-code',
        title: '1. The ApnaTrip Explorer Code',
        content: `The ApnaTrip community is founded on mutual respect, cultural sensitivity, environmental stewardship, and factual reporting. We encourage travelers to share genuine trek conditions, road alerts, and honest local feedback.`
      },
      {
        id: 'prohibited-behavior',
        title: '2. Prohibited Conduct',
        content: `We strictly prohibit:
• Harassment, hate speech, caste/religious slurs, or intimidation against travelers, guides, or drivers.
• Fake reviews, incentivized testimonials, or competitor sabotage.
• Solicitations, spamming WhatsApp links, or unauthorized agency advertising in traveler circles.
• Posting illicit content, drug promotion, or trespassing into restricted ecological zones.`
      },
      {
        id: 'moderation-sanctions',
        title: '3. Moderation & Sanctions',
        content: `Violations trigger warnings, immediate post removal, temporary suspension, or permanent banning of both the user profile and associated verified identity in accordance with our [Trust & Safety Framework](/legal/trust-safety).`
      }
    ]
  },

  // ── 5. REFUND POLICY ──────────────────────────────────────────────────────
  {
    id: 'refunds',
    slug: 'refunds',
    title: 'Refund Policy',
    summary: 'Refund timelines, milestone protections, duplicate transaction returns, and processing channels.',
    version: '1.3.0',
    effectiveDate: LEGAL_CONFIG.effectiveDate,
    lastUpdated: LEGAL_CONFIG.lastUpdated,
    readingTimeMinutes: 9,
    category: 'Payments & Financial',
    tags: ['refunds', 'escrow', 'payments', 'disputes'],
    status: 'Published',
    reviewedBy: 'Finance & Payments Lead',
    changelog: [
      {
        version: '1.3.0',
        publishedDate: 'October 1, 2026',
        summary: 'Integrated automated Razorpay refund reconciliations and escrow guarantees.',
        reviewedBy: 'Finance Team',
      },
    ],
    sections: [
      {
        id: 'escrow-refund-framework',
        title: '1. Escrow-Backed Refund Framework',
        content: `Because ApnaTrip holds traveler funds in milestone escrow accounts rather than releasing immediate unearned balances to operators, travelers enjoy guaranteed refund protection in cases of agency default, verified misrepresentation, or timely cancellation under our [Cancellation Policy](/legal/cancellation).`
      },
      {
        id: 'eligibility-scenarios',
        title: '2. Refund Eligibility Scenarios',
        content: `• Agency Cancellation: If an agency cancels a scheduled departure or fails to provide transportation without mutual rescheduling, travelers receive a 100% full refund with zero deductions.
• Duplicate or Failed Transactions: In case of bank network timeouts where money was debited but the voucher was not generated, funds auto-reverse within 48–72 hours via Razorpay.
• Traveler Cancellation: Subject to the tiered timelines specified in our [Cancellation Policy](/legal/cancellation).`
      },
      {
        id: 'refund-reversal-channels',
        title: '3. Timelines & Source Reversal',
        content: `Approved refunds are initiated within 2 business days. The actual credit to your original payment method (UPI, Net Banking, Credit/Debit Card) typically reflects within 5 to 7 banking days as per standard RBI clearing cycles.`
      }
    ]
  },

  // ── 6. CANCELLATION POLICY ────────────────────────────────────────────────
  {
    id: 'cancellation',
    slug: 'cancellation',
    title: 'Cancellation Policy',
    summary: 'Tiered cancellation windows for multi-day packages, intercity routes, and self-drive vehicles.',
    version: '1.2.0',
    effectiveDate: LEGAL_CONFIG.effectiveDate,
    lastUpdated: LEGAL_CONFIG.lastUpdated,
    readingTimeMinutes: 8,
    category: 'Payments & Financial',
    tags: ['cancellation', 'deadlines', 'fees', 'travel-packages'],
    status: 'Published',
    reviewedBy: 'Operations & Legal',
    changelog: [
      {
        version: '1.2.0',
        publishedDate: 'September 10, 2026',
        summary: 'Standardized route transport cancellation windows down to 4 hours.',
        reviewedBy: 'Logistics Ops',
      },
    ],
    sections: [
      {
        id: 'package-cancellations',
        title: '1. Tour Package Cancellation Windows',
        content: `• 15+ Days Before Departure: 90% refund (10% nominal partner administrative & processing fee).
• 7 to 14 Days Before Departure: 65% refund.
• 3 to 6 Days Before Departure: 40% refund.
• Less than 72 Hours or No-Show: No refund (funds released to operators who already locked non-refundable hotel rooms & transport).`
      },
      {
        id: 'route-cancellations',
        title: '2. Intercity Route Cabs & Shuttle Departures',
        content: `• 12+ Hours Before Scheduled Slot: 100% refund or free slot reschedule.
• 4 to 12 Hours Before Slot: 75% refund.
• Under 4 Hours or Failure to Report at Pickup Hub: Forfeiture of fare.`
      },
      {
        id: 'rental-cancellations',
        title: '3. Self-Drive Vehicle Rentals',
        content: `Cancellations up to 24 hours prior to handover receive a 90% refund. Security deposit holds are never debited if the booking is cancelled prior to vehicle dispatch as covered in [Vehicle Handover Terms](/legal/vehicle-handover).`
      }
    ]
  },

  // ── 7. MILESTONE ESCROW RULES ─────────────────────────────────────────────
  {
    id: 'escrow',
    slug: 'escrow',
    title: 'Milestone Escrow Rules',
    summary: 'The operational mechanics governing how platform payments are held, audited, and disbursed.',
    version: '1.4.0',
    effectiveDate: LEGAL_CONFIG.effectiveDate,
    lastUpdated: LEGAL_CONFIG.lastUpdated,
    readingTimeMinutes: 10,
    category: 'Payments & Financial',
    tags: ['escrow', 'settlement', 'dispute-freeze', 'transparency'],
    status: 'Published',
    reviewedBy: 'Escrow Operations Officer',
    changelog: [
      {
        version: '1.4.0',
        publishedDate: 'October 1, 2026',
        summary: 'Integrated traveler OTP check-in milestone verification triggers.',
        reviewedBy: 'Financial Architecture',
      },
    ],
    sections: [
      {
        id: 'escrow-architecture',
        title: '1. Purpose & Protection Architecture',
        content: `Traditional tourism in India suffers from advance-payment risk, where travelers pay upfront and operators lack accountability. ApnaTrip’s Milestone Escrow eliminates this friction by treating all payments as conditional balances until trip verification.`
      },
      {
        id: 'release-protocol',
        title: '2. Milestone Release Protocol',
        content: `• Milestone 1 (Booking Lock): Traveler pays full amount. Funds held in nodal escrow.
• Milestone 2 (Operational Readiness): Agency submits hotel vouchers and vehicle driver assignment 48 hours prior to trip. Limited advance (up to 30%) may be disbursed for fuel/permits.
• Milestone 3 (Passenger Check-In): Passenger verifies arrival via OTP/digital check-in. 50% released to agency.
• Milestone 4 (Trip Completion): Final settlement released 24 hours after tour conclusion, provided no dispute ticket is raised.`
      },
      {
        id: 'freeze-mechanism',
        title: '3. Dispute Freeze Mechanism',
        content: `If a traveler files a valid dispute (safety, missing vehicle, stranded itinerary) via the SOS or Support Portal before completion, remaining funds are frozen immediately pending admin mediation under our [Grievance Redressal Mechanism](/legal/grievance).`
      }
    ]
  },

  // ── 8. VEHICLE HANDOVER TERMS ─────────────────────────────────────────────
  {
    id: 'vehicle-handover',
    slug: 'vehicle-handover',
    title: 'Vehicle Handover Terms',
    summary: 'Checklists, fuel policies, insurance obligations, and security deposit terms for self-drive rentals.',
    version: '1.1.0',
    effectiveDate: LEGAL_CONFIG.effectiveDate,
    lastUpdated: LEGAL_CONFIG.lastUpdated,
    readingTimeMinutes: 9,
    category: 'Platform & Agreements',
    tags: ['self-drive', 'car-rental', 'inspection', 'security-deposit', 'insurance'],
    status: 'Published',
    reviewedBy: 'Fleet Operations Lead',
    changelog: [
      {
        version: '1.1.0',
        publishedDate: 'August 14, 2026',
        summary: 'Added 12-point digital checklist handover requirements and fuel policies.',
        reviewedBy: 'Fleet Team',
      },
    ],
    sections: [
      {
        id: 'digital-inspection',
        title: '1. Digital Handover & Inspection Checklist',
        content: `Prior to keys handover, both the vehicle fleet partner and renter must complete a 12-point digital checklist on the ApnaTrip mobile app, including 360° photographs of exterior body panels, tire tread, odometer reading, and fuel gauge level.`
      },
      {
        id: 'security-deposit',
        title: '2. Security Deposit Terms & Protection',
        content: `Security deposits are held as pre-authorization holds rather than non-refundable cash. Deposits are released automatically within 48 hours of vehicle return, minus documented toll charges or traffic e-challans generated during the rental window.`
      },
      {
        id: 'fuel-liability',
        title: '3. Fuel, Breakdown & Accident Liabilities',
        content: `Vehicles operate on a same-level fuel policy (return with the same fuel level as pickup). Standard comprehensive motor insurance applies; renter liability in minor accidental damage is capped at the pre-agreed deductible unless drunk driving, off-roading in prohibited zones, or unlicensed driving is established.`
      }
    ]
  },

  // ── 9. GRIEVANCE REDRESSAL ────────────────────────────────────────────────
  {
    id: 'grievance',
    slug: 'grievance',
    title: 'Grievance Redressal Mechanism',
    summary: 'Statutory grievance officer details, complaint escalation tiers, and resolution SLAs.',
    version: '1.1.0',
    effectiveDate: LEGAL_CONFIG.effectiveDate,
    lastUpdated: LEGAL_CONFIG.lastUpdated,
    readingTimeMinutes: 7,
    category: 'Safety & Compliance',
    tags: ['grievance', 'support', 'statutory', 'sla', 'consumer-rights'],
    status: 'Published',
    reviewedBy: 'Chief Legal Officer & Grievance Desk',
    changelog: [
      {
        version: '1.1.0',
        publishedDate: 'October 1, 2026',
        summary: 'Updated contact details and response timelines under Consumer Protection (E-Commerce) Rules 2020.',
        reviewedBy: 'Legal Compliance',
      },
    ],
    sections: [
      {
        id: 'grievance-escalation-tiers',
        title: '1. Escalation Tiers & Response SLA',
        content: `In compliance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and the Consumer Protection (E-Commerce) Rules, 2020:
• Level 1 (Customer Support): Live in-app chat & support@apnatrip.app (Acknowledge: 4 hrs, Target Resolution: 24–48 hrs).
• Level 2 (Operations Lead): Escalations regarding escrow holds or partner defaults (Resolution: 3–5 business days).
• Level 3 (Grievance Officer): Formal legal grievances regarding data protection or platform compliance.`
      },
      {
        id: 'grievance-designated-officer',
        title: '2. Designated Grievance Officer',
        content: `Officer: ${LEGAL_CONFIG.officers.grievanceOfficer.name}
Designation: ${LEGAL_CONFIG.officers.grievanceOfficer.designation}
Email: ${LEGAL_CONFIG.contacts.grievance}
Physical Office: ${LEGAL_CONFIG.officers.grievanceOfficer.address}
Statutory Acknowledgment Window: Within 24 hours. Resolution Target: Within 15 working days.`
      }
    ]
  },

  // ── 10. ACCEPTABLE USE POLICY ─────────────────────────────────────────────
  {
    id: 'acceptable-use',
    slug: 'acceptable-use',
    title: 'Acceptable Use Policy',
    summary: 'Prohibited activities, automated scraping bans, anti-fraud rules, and API integrity.',
    version: '1.0.0',
    effectiveDate: LEGAL_CONFIG.effectiveDate,
    lastUpdated: LEGAL_CONFIG.lastUpdated,
    readingTimeMinutes: 6,
    category: 'Safety & Compliance',
    tags: ['acceptable-use', 'anti-scraping', 'api-abuse', 'cyber-security'],
    status: 'Published',
    reviewedBy: 'Platform Security Director',
    changelog: [
      {
        version: '1.0.0',
        publishedDate: 'January 15, 2026',
        summary: 'Baseline network acceptable use terms and scraping bans.',
        reviewedBy: 'InfoSec',
      },
    ],
    sections: [
      {
        id: 'aup-prohibitions-list',
        title: '1. Prohibited System Activities',
        content: `Users, agencies, and automated clients must not:
• Reverse-engineer, decompile, or scrape platform data, route pricing matrices, or user databases using bots or crawlers without express written consent.
• Submit fraudulent KYC documentation, manipulated bank statements, or fake traveler identities.
• Attempt privilege escalation or probe platform endpoints for vulnerabilities without authorization.`
      },
      {
        id: 'aup-legal-consequences',
        title: '2. Sanctions & Legal Remedies',
        content: `Violators face immediate credential termination, blacklisting of phone/PAN/Aadhaar hashes across the ecosystem, and civil/criminal prosecution under Section 43 and Section 66 of the Information Technology Act, 2000.`
      }
    ]
  },

  // ── 11. SECURITY POLICY ───────────────────────────────────────────────────
  {
    id: 'security',
    slug: 'security',
    title: 'Security Policy',
    summary: 'Defense-in-depth infrastructure, encryption protocols, audit telemetry, and vulnerability disclosure.',
    version: '1.2.0',
    effectiveDate: LEGAL_CONFIG.effectiveDate,
    lastUpdated: LEGAL_CONFIG.lastUpdated,
    readingTimeMinutes: 8,
    category: 'Safety & Compliance',
    tags: ['infosec', 'encryption', 'vulnerability-disclosure', 'soc2-aligned'],
    status: 'Published',
    reviewedBy: 'Chief Information Security Officer',
    changelog: [
      {
        version: '1.2.0',
        publishedDate: 'October 1, 2026',
        summary: 'Added responsible disclosure protocol and TLS 1.3 telemetry standards.',
        reviewedBy: 'Security Team',
      },
    ],
    sections: [
      {
        id: 'security-architecture-overview',
        title: '1. Platform Infrastructure & Encryption',
        content: `ApnaTrip is engineered with defense-in-depth:
• Transport Layer: TLS 1.3 enforced across all public endpoints with strict HSTS.
• Data at Rest: Sensitive database columns, KYC documents, and auth tokens are encrypted with AES-256 GCM.
• Authentication: Bcrypt-hashed password credentials, JWTs with rotating HMAC keys, and optional biometric/two-factor prompts.`
      },
      {
        id: 'security-vulnerability-disclosure',
        title: '2. Responsible Vulnerability Disclosure',
        content: `We welcome responsible security research. If you discover a vulnerability, please report it privately to security@apnatrip.app with reproduction steps. Do not execute destructive attacks or compromise user privacy.`
      }
    ]
  },

  // ── 12. TRUST & SAFETY ────────────────────────────────────────────────────
  {
    id: 'trust-safety',
    slug: 'trust-safety',
    title: 'Trust & Safety Framework',
    summary: 'Agency vetting criteria, driver licensing checks, payment protection, and emergency escalation.',
    version: '1.1.0',
    effectiveDate: LEGAL_CONFIG.effectiveDate,
    lastUpdated: LEGAL_CONFIG.lastUpdated,
    readingTimeMinutes: 7,
    category: 'Safety & Compliance',
    tags: ['trust', 'partner-vetting', 'emergency-sos', 'safety'],
    status: 'Published',
    reviewedBy: 'Trust & Safety Lead',
    changelog: [
      {
        version: '1.1.0',
        publishedDate: 'September 5, 2026',
        summary: 'Updated live SOS telemetry and commercial driver verification standards.',
        reviewedBy: 'Trust Board',
      },
    ],
    sections: [
      {
        id: 'agency-driver-vetting',
        title: '1. Partner & Agency Vetting',
        content: `Every operator admitted to the ApnaTrip ecosystem undergoes manual verification:
• Document Audit: Valid GST certificate, PAN cross-verification, and state/central Ministry of Tourism accreditation.
• Fleet Inspection: Commercial registration (yellow plate), fitness certificate, and commercial passenger vehicle insurance.
• Driver Verification: Commercial driving license check and criminal background affirmation.`
      },
      {
        id: 'emergency-sos-telemetry',
        title: '2. On-Trip Passenger Safety & Emergency SOS',
        content: `Travelers can activate an emergency SOS directly from the mobile app during any active booking. This immediately alerts the nearest regional support coordinator, sends vehicle GPS telemetry to registered emergency contacts, and initiates rapid response protocols.`
      }
    ]
  }
];
