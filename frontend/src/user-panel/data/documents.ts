export interface TravelDocument {
  id: string;
  tripId: string;
  title: string;
  type: 'booking' | 'invoice' | 'hotel' | 'flight' | 'contact' | 'transport' | 'insurance';
  status: 'Confirmed' | 'Issued' | 'Ready' | 'Pending';
  issueDate: string;
  expiryDate?: string;
  downloadUrl: string;
  fileType: 'PDF' | 'ZIP';
  fileSize: string;
  category: string;
  subtitle: string;
  available: boolean;
  iconType: string;
}

export const DOCUMENTS_DATA: TravelDocument[] = [
  {
    id: 'doc-001',
    tripId: 'trip-001',
    title: 'Booking Confirmation',
    type: 'booking',
    status: 'Confirmed',
    issueDate: '12 May, 2025',
    downloadUrl: '#',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    category: 'Booking',
    subtitle: 'Booking ID: AT-784512 • Issued on 12 May, 2025',
    available: true,
    iconType: 'booking',
  },
  {
    id: 'doc-002',
    tripId: 'trip-001',
    title: 'Invoice',
    type: 'invoice',
    status: 'Issued',
    issueDate: '12 May, 2025',
    downloadUrl: '#',
    fileType: 'PDF',
    fileSize: '480 KB',
    category: 'Billing',
    subtitle: 'Total Amount: ₹45,000 • Issued on 12 May, 2025',
    available: true,
    iconType: 'invoice',
  },
  {
    id: 'doc-003',
    tripId: 'trip-001',
    title: 'Hotel Voucher',
    type: 'hotel',
    status: 'Ready',
    issueDate: '15 May, 2025',
    downloadUrl: '#',
    fileType: 'PDF',
    fileSize: '850 KB',
    category: 'Accommodation',
    subtitle: 'Pine Brook Resort, Shillong • Check-in: 20 May • Check-out: 26 May',
    available: true,
    iconType: 'hotel',
  },
  {
    id: 'doc-004',
    tripId: 'trip-001',
    title: 'Flight E-Ticket',
    type: 'flight',
    status: 'Issued',
    issueDate: '14 May, 2025',
    downloadUrl: '#',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    category: 'Transport',
    subtitle: 'Guwahati (GAU) → Shillong (SHL) • 20 May, 08:00 AM',
    available: true,
    iconType: 'flight',
  },
  {
    id: 'doc-005',
    tripId: 'trip-001',
    title: 'Emergency Contact Sheet',
    type: 'contact',
    status: 'Ready',
    issueDate: '12 May, 2025',
    downloadUrl: '#',
    fileType: 'PDF',
    fileSize: '320 KB',
    category: 'Safety',
    subtitle: 'Important contacts during your trip',
    available: true,
    iconType: 'contact',
  },
  {
    id: 'doc-006',
    tripId: 'trip-001',
    title: 'Pickup Details',
    type: 'transport',
    status: 'Ready',
    issueDate: '16 May, 2025',
    downloadUrl: '#',
    fileType: 'PDF',
    fileSize: '510 KB',
    category: 'Transport',
    subtitle: 'Pickup: Guwahati Airport (GAU) • 20 May, 08:00 AM',
    available: true,
    iconType: 'transport',
  },
];

export const getDocumentsByTripId = (tripId: string): TravelDocument[] => {
  return DOCUMENTS_DATA.filter((d) => d.tripId === tripId || tripId === 'trip-001');
};
