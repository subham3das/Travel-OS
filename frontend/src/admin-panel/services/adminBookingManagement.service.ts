import {
  AdminBookingItem,
  BookingKPIStats,
  BookingFilters,
  BookingSortConfig,
} from '../types/bookingManagement';

const STORAGE_KEY_BOOKINGS = 'apnatrip_admin_bookings_list';
const STORAGE_KEY_BOOKING_STATS = 'apnatrip_admin_bookings_kpi_stats';

export const initialBookingKPIStats: BookingKPIStats = {
  totalBookings: { count: 18642, growth: '15.4%', isPositive: true },
  confirmedBookings: { count: 13782, growth: '12.8%', isPositive: true },
  pendingBookings: { count: 1236, growth: '8.3%', isPositive: true },
  cancelledBookings: { count: 1842, growth: '6.7%', isPositive: false },
  totalRevenue: { value: '₹24.68 Cr', growth: '18.6%', isPositive: true },
  refundedAmount: { value: '₹1.32 Cr', growth: '4.3%', isPositive: false },
};

export const initialAdminBookings: AdminBookingItem[] = [
  {
    id: 'BK-1',
    bookingId: 'BK-2024-0001',
    bookedAtDate: 'May 1, 2024',
    bookedAtTime: '10:30 AM',
    bookingStatus: 'Confirmed',
    paymentStatus: 'Paid',
    bookingSource: 'Web',
    travelerName: 'Arjun Mehta',
    travelerEmail: 'arjun.mehta@email.com',
    travelerPhone: '+91 98765 43210',
    travelerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    additionalTravelersCount: 1,
    travelersSummary: '2 Adults',
    packageId: 'PKG-2024-0001',
    packageName: 'Swiss Alps Explorer',
    packageThumbnail: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=400&auto=format&fit=crop',
    destinationCountry: 'Switzerland',
    destinationRegion: 'Interlaken',
    durationText: '6D / 5N',
    travelStartDate: 'May 20, 2024',
    travelEndDate: 'May 27, 2024',
    travelDatesText: 'May 20 – May 27, 2024',
    agencyName: 'Wanderlust Holidays',
    agencyLogo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
    isAgencyVerified: true,
    totalAmount: '₹89,999',
    basePrice: '₹82,000',
    taxesAndFees: '₹5,999',
    platformFee: '₹2,000',
    discountAmount: '- ₹8,000',
    discountCode: 'EARLY10',
    insuranceFee: '₹0',
    grandTotal: '₹89,999',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN7845123654',
    paidAmount: '₹89,999',
    paidDate: 'May 1, 2024 • 10:32 AM',
    travelers: [
      { id: 'trv-1', name: 'Arjun Mehta', age: 29, gender: 'Male', passportNumber: 'P12345678', phone: '+91 98765 43210', email: 'arjun.mehta@email.com', isPrimary: true },
      { id: 'trv-2', name: 'Pooja Mehta', age: 27, gender: 'Female', passportNumber: 'P87654321', isPrimary: false },
    ],
    activities: [
      { id: 'act-1', actor: 'Arjun Mehta', role: 'Traveler', action: 'Created Booking', details: 'Selected Swiss Alps Explorer for 2 adults', timestamp: 'May 1, 2024 • 10:30 AM' },
      { id: 'act-2', actor: 'Payment Gateway', role: 'System', action: 'Payment Processed', details: 'Transaction TXN7845123654 captured ₹89,999', timestamp: 'May 1, 2024 • 10:32 AM' },
      { id: 'act-3', actor: 'Wanderlust Holidays', role: 'Agency', action: 'Booking Confirmed', details: 'Hotel and alpine train seats confirmed', timestamp: 'May 1, 2024 • 11:15 AM' },
    ],
    timeline: [
      { id: 'tl-1', title: 'Booking Created', subtitle: 'Trip reserved on platform', timestamp: 'May 1, 2024 • 10:30 AM', status: 'completed' },
      { id: 'tl-2', title: 'Payment Received', subtitle: 'Paid via Credit Card', timestamp: 'May 1, 2024 • 10:32 AM', status: 'completed' },
      { id: 'tl-3', title: 'Agency Confirmed', subtitle: 'Wanderlust Holidays confirmed reservation', timestamp: 'May 1, 2024 • 11:15 AM', status: 'completed' },
      { id: 'tl-4', title: 'Documents Shared', subtitle: 'Flight & Hotel Vouchers sent', timestamp: 'May 5, 2024 • 04:00 PM', status: 'completed' },
      { id: 'tl-5', title: 'Trip Started', subtitle: 'Arrival in Zurich', timestamp: 'May 20, 2024', status: 'current' },
      { id: 'tl-6', title: 'Trip Completed', subtitle: 'Departure back to India', timestamp: 'May 27, 2024', status: 'upcoming' },
      { id: 'tl-7', title: 'Review Submitted', subtitle: 'Awaiting traveler review', timestamp: '—', status: 'upcoming' },
    ],
  },
  {
    id: 'BK-2',
    bookingId: 'BK-2024-0002',
    bookedAtDate: 'May 1, 2024',
    bookedAtTime: '11:15 AM',
    bookingStatus: 'Confirmed',
    paymentStatus: 'Paid',
    bookingSource: 'Mobile App',
    travelerName: 'Diya Sharma',
    travelerEmail: 'diya.sharma@email.com',
    travelerPhone: '+91 91234 56789',
    travelerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    additionalTravelersCount: 1,
    travelersSummary: '2 Adults',
    packageId: 'PKG-2024-0002',
    packageName: 'Bali Paradise',
    packageThumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=400&auto=format&fit=crop',
    destinationCountry: 'Indonesia',
    destinationRegion: 'Bali',
    durationText: '5D / 4N',
    travelStartDate: 'May 10, 2024',
    travelEndDate: 'May 16, 2024',
    travelDatesText: 'May 10 – May 16, 2024',
    agencyName: 'Himalayan Treks',
    agencyLogo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=200&auto=format&fit=crop',
    isAgencyVerified: true,
    totalAmount: '₹59,999',
    basePrice: '₹55,000',
    taxesAndFees: '₹3,999',
    platformFee: '₹1,000',
    discountAmount: '₹0',
    grandTotal: '₹59,999',
    paymentMethod: 'UPI',
    transactionId: 'TXN8912345671',
    paidAmount: '₹59,999',
    paidDate: 'May 1, 2024 • 11:17 AM',
    travelers: [
      { id: 'trv-3', name: 'Diya Sharma', age: 26, gender: 'Female', passportNumber: 'P99887766', phone: '+91 91234 56789', email: 'diya.sharma@email.com', isPrimary: true },
      { id: 'trv-4', name: 'Kabir Singhania', age: 28, gender: 'Male', passportNumber: 'P66778899', isPrimary: false },
    ],
    activities: [
      { id: 'act-4', actor: 'Diya Sharma', role: 'Traveler', action: 'Created Booking', details: 'Booked Bali Paradise honeymoon package', timestamp: 'May 1, 2024 • 11:15 AM' },
    ],
    timeline: [
      { id: 'tl-1', title: 'Booking Created', subtitle: 'Trip reserved on platform', timestamp: 'May 1, 2024 • 11:15 AM', status: 'completed' },
      { id: 'tl-2', title: 'Payment Received', subtitle: 'Paid via UPI', timestamp: 'May 1, 2024 • 11:17 AM', status: 'completed' },
      { id: 'tl-3', title: 'Agency Confirmed', subtitle: 'Himalayan Treks confirmed', timestamp: 'May 1, 2024 • 12:00 PM', status: 'completed' },
      { id: 'tl-4', title: 'Documents Shared', subtitle: 'Vouchers issued', timestamp: 'May 3, 2024', status: 'completed' },
      { id: 'tl-5', title: 'Trip Started', subtitle: 'Flight to Denpasar', timestamp: 'May 10, 2024', status: 'current' },
      { id: 'tl-6', title: 'Trip Completed', subtitle: 'Return journey', timestamp: 'May 16, 2024', status: 'upcoming' },
      { id: 'tl-7', title: 'Review Submitted', subtitle: 'Pending completion', timestamp: '—', status: 'upcoming' },
    ],
  },
  {
    id: 'BK-3',
    bookingId: 'BK-2024-0003',
    bookedAtDate: 'May 1, 2024',
    bookedAtTime: '01:22 PM',
    bookingStatus: 'Pending',
    paymentStatus: 'Pending',
    bookingSource: 'Web',
    travelerName: 'Rohit Verma',
    travelerEmail: 'rohit.verma@email.com',
    travelerPhone: '+91 98111 22233',
    travelerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    additionalTravelersCount: 2,
    travelersSummary: '3 Adults',
    packageId: 'PKG-2024-0003',
    packageName: 'Rajasthan Royal Tour',
    packageThumbnail: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=400&auto=format&fit=crop',
    destinationCountry: 'India',
    destinationRegion: 'Rajasthan',
    durationText: '7D / 6N',
    travelStartDate: 'May 22, 2024',
    travelEndDate: 'May 29, 2024',
    travelDatesText: 'May 22 – May 29, 2024',
    agencyName: 'Goa Getaways',
    agencyLogo: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=200&auto=format&fit=crop',
    isAgencyVerified: false,
    totalAmount: '₹32,999',
    basePrice: '₹30,000',
    taxesAndFees: '₹1,999',
    platformFee: '₹1,000',
    discountAmount: '₹0',
    grandTotal: '₹32,999',
    paymentMethod: 'Net Banking',
    transactionId: 'TXN pending',
    paidAmount: '₹0',
    paidDate: 'Awaiting Payment',
    travelers: [
      { id: 'trv-5', name: 'Rohit Verma', age: 34, gender: 'Male', phone: '+91 98111 22233', email: 'rohit.verma@email.com', isPrimary: true },
    ],
    activities: [
      { id: 'act-5', actor: 'Rohit Verma', role: 'Traveler', action: 'Initiated Booking', details: 'Awaiting payment confirmation via Net Banking', timestamp: 'May 1, 2024 • 01:22 PM' },
    ],
    timeline: [
      { id: 'tl-1', title: 'Booking Created', subtitle: 'Hold placed for 24h', timestamp: 'May 1, 2024 • 01:22 PM', status: 'completed' },
      { id: 'tl-2', title: 'Payment Pending', subtitle: 'Awaiting bank transfer', timestamp: 'Pending', status: 'current' },
      { id: 'tl-3', title: 'Agency Confirmed', subtitle: 'Pending payment', timestamp: '—', status: 'upcoming' },
      { id: 'tl-4', title: 'Documents Shared', subtitle: 'Pending', timestamp: '—', status: 'upcoming' },
      { id: 'tl-5', title: 'Trip Started', subtitle: 'May 22, 2024', timestamp: '—', status: 'upcoming' },
      { id: 'tl-6', title: 'Trip Completed', subtitle: 'May 29, 2024', timestamp: '—', status: 'upcoming' },
      { id: 'tl-7', title: 'Review Submitted', subtitle: '—', timestamp: '—', status: 'upcoming' },
    ],
  },
  {
    id: 'BK-4',
    bookingId: 'BK-2024-0004',
    bookedAtDate: 'May 1, 2024',
    bookedAtTime: '02:45 PM',
    bookingStatus: 'Confirmed',
    paymentStatus: 'Paid',
    bookingSource: 'Web',
    travelerName: 'Neha Kapoor',
    travelerEmail: 'neha.kapoor@email.com',
    travelerPhone: '+91 97777 88899',
    travelerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    additionalTravelersCount: 1,
    travelersSummary: '2 Adults',
    packageId: 'PKG-2024-0004',
    packageName: 'Maldives Escape',
    packageThumbnail: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=400&auto=format&fit=crop',
    destinationCountry: 'Maldives',
    destinationRegion: 'Malé',
    durationText: '4D / 3N',
    travelStartDate: 'May 15, 2024',
    travelEndDate: 'May 19, 2024',
    travelDatesText: 'May 15 – May 19, 2024',
    agencyName: 'Kerala Backwaters',
    agencyLogo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    isAgencyVerified: true,
    totalAmount: '₹1,29,999',
    basePrice: '₹1,20,000',
    taxesAndFees: '₹7,999',
    platformFee: '₹2,000',
    discountAmount: '₹0',
    grandTotal: '₹1,29,999',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN4455667788',
    paidAmount: '₹1,29,999',
    paidDate: 'May 1, 2024 • 02:47 PM',
    travelers: [
      { id: 'trv-6', name: 'Neha Kapoor', age: 31, gender: 'Female', passportNumber: 'P33221100', phone: '+91 97777 88899', email: 'neha.kapoor@email.com', isPrimary: true },
    ],
    activities: [
      { id: 'act-6', actor: 'Neha Kapoor', role: 'Traveler', action: 'Created Booking', details: 'Paid for Maldives Overwater Villa', timestamp: 'May 1, 2024 • 02:45 PM' },
    ],
    timeline: [
      { id: 'tl-1', title: 'Booking Created', subtitle: 'Completed', timestamp: 'May 1, 2024 • 02:45 PM', status: 'completed' },
      { id: 'tl-2', title: 'Payment Received', subtitle: 'Credit Card Approved', timestamp: 'May 1, 2024 • 02:47 PM', status: 'completed' },
      { id: 'tl-3', title: 'Agency Confirmed', subtitle: 'Speedboat & Villa booked', timestamp: 'May 1, 2024 • 03:30 PM', status: 'completed' },
      { id: 'tl-4', title: 'Documents Shared', subtitle: 'Resort voucher shared', timestamp: 'May 2, 2024', status: 'completed' },
      { id: 'tl-5', title: 'Trip Started', subtitle: 'May 15, 2024', timestamp: 'May 15, 2024', status: 'current' },
      { id: 'tl-6', title: 'Trip Completed', subtitle: 'May 19, 2024', timestamp: 'May 19, 2024', status: 'upcoming' },
      { id: 'tl-7', title: 'Review Submitted', subtitle: '—', timestamp: '—', status: 'upcoming' },
    ],
  },
  {
    id: 'BK-5',
    bookingId: 'BK-2024-0005',
    bookedAtDate: 'May 2, 2024',
    bookedAtTime: '09:10 AM',
    bookingStatus: 'Confirmed',
    paymentStatus: 'Paid',
    bookingSource: 'Mobile App',
    travelerName: 'Karan Singh',
    travelerEmail: 'karan.singh@email.com',
    travelerPhone: '+91 96543 21098',
    travelerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    additionalTravelersCount: 3,
    travelersSummary: '4 Adults',
    packageId: 'PKG-2024-0005',
    packageName: 'Manali Adventure',
    packageThumbnail: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=400&auto=format&fit=crop',
    destinationCountry: 'India',
    destinationRegion: 'Himachal Pradesh',
    durationText: '5D / 4N',
    travelStartDate: 'May 12, 2024',
    travelEndDate: 'May 16, 2024',
    travelDatesText: 'May 12 – May 16, 2024',
    agencyName: 'Adventure India',
    agencyLogo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    isAgencyVerified: true,
    totalAmount: '₹24,999',
    basePrice: '₹23,000',
    taxesAndFees: '₹1,499',
    platformFee: '₹500',
    discountAmount: '₹0',
    grandTotal: '₹24,999',
    paymentMethod: 'UPI',
    transactionId: 'TXN1122334455',
    paidAmount: '₹24,999',
    paidDate: 'May 2, 2024 • 09:12 AM',
    travelers: [
      { id: 'trv-7', name: 'Karan Singh', age: 25, gender: 'Male', phone: '+91 96543 21098', email: 'karan.singh@email.com', isPrimary: true },
    ],
    activities: [
      { id: 'act-7', actor: 'Karan Singh', role: 'Traveler', action: 'Created Booking', details: 'Booked Solang Valley camping package', timestamp: 'May 2, 2024 • 09:10 AM' },
    ],
    timeline: [
      { id: 'tl-1', title: 'Booking Created', subtitle: 'Completed', timestamp: 'May 2, 2024 • 09:10 AM', status: 'completed' },
      { id: 'tl-2', title: 'Payment Received', subtitle: 'UPI Verified', timestamp: 'May 2, 2024 • 09:12 AM', status: 'completed' },
      { id: 'tl-3', title: 'Agency Confirmed', subtitle: 'Campsite confirmed', timestamp: 'May 2, 2024 • 10:00 AM', status: 'completed' },
      { id: 'tl-4', title: 'Documents Shared', subtitle: 'Shared', timestamp: 'May 4, 2024', status: 'completed' },
      { id: 'tl-5', title: 'Trip Started', subtitle: 'May 12, 2024', timestamp: 'May 12, 2024', status: 'current' },
      { id: 'tl-6', title: 'Trip Completed', subtitle: 'May 16, 2024', timestamp: 'May 16, 2024', status: 'upcoming' },
      { id: 'tl-7', title: 'Review Submitted', subtitle: '—', timestamp: '—', status: 'upcoming' },
    ],
  },
  {
    id: 'BK-6',
    bookingId: 'BK-2024-0006',
    bookedAtDate: 'May 2, 2024',
    bookedAtTime: '10:05 AM',
    bookingStatus: 'Cancelled',
    paymentStatus: 'Paid',
    bookingSource: 'Web',
    travelerName: 'Priya Nair',
    travelerEmail: 'priya.nair@email.com',
    travelerPhone: '+91 94321 09876',
    travelerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    additionalTravelersCount: 1,
    travelersSummary: '2 Adults',
    packageId: 'PKG-2024-0006',
    packageName: 'Dubai Luxury Tour',
    packageThumbnail: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=400&auto=format&fit=crop',
    destinationCountry: 'UAE',
    destinationRegion: 'Dubai',
    durationText: '6D / 5N',
    travelStartDate: 'May 18, 2024',
    travelEndDate: 'May 22, 2024',
    travelDatesText: 'May 18 – May 22, 2024',
    agencyName: 'Holiday Hub Agency',
    agencyLogo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    isAgencyVerified: true,
    totalAmount: '₹74,999',
    basePrice: '₹70,000',
    taxesAndFees: '₹3,999',
    platformFee: '₹1,000',
    discountAmount: '₹0',
    grandTotal: '₹74,999',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN9988776655',
    paidAmount: '₹74,999',
    paidDate: 'May 2, 2024 • 10:07 AM',
    travelers: [
      { id: 'trv-8', name: 'Priya Nair', age: 30, gender: 'Female', passportNumber: 'P55443322', phone: '+91 94321 09876', email: 'priya.nair@email.com', isPrimary: true },
    ],
    activities: [
      { id: 'act-8', actor: 'Priya Nair', role: 'Traveler', action: 'Cancelled Booking', details: 'Traveler requested cancellation due to personal emergency', timestamp: 'May 3, 2024 • 03:00 PM' },
      { id: 'act-9', actor: 'Super Admin', role: 'Super Admin', action: 'Cancellation Processed', details: 'Full refund initiated to original payment source', timestamp: 'May 3, 2024 • 03:30 PM' },
    ],
    timeline: [
      { id: 'tl-1', title: 'Booking Created', subtitle: 'Completed', timestamp: 'May 2, 2024 • 10:05 AM', status: 'completed' },
      { id: 'tl-2', title: 'Payment Received', subtitle: 'Completed', timestamp: 'May 2, 2024 • 10:07 AM', status: 'completed' },
      { id: 'tl-3', title: 'Booking Cancelled', subtitle: 'Cancelled by Traveler', timestamp: 'May 3, 2024 • 03:00 PM', status: 'completed' },
      { id: 'tl-4', title: 'Refund Queued', subtitle: 'Refund under process', timestamp: 'May 3, 2024 • 03:30 PM', status: 'current' },
    ],
  },
  {
    id: 'BK-7',
    bookingId: 'BK-2024-0007',
    bookedAtDate: 'May 2, 2024',
    bookedAtTime: '11:30 AM',
    bookingStatus: 'Refunded',
    paymentStatus: 'Refunded',
    bookingSource: 'Web',
    travelerName: 'Vikram Joshi',
    travelerEmail: 'vikram.joshi@email.com',
    travelerPhone: '+91 91234 98765',
    travelerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    additionalTravelersCount: 1,
    travelersSummary: '2 Adults',
    packageId: 'PKG-2024-0007',
    packageName: 'Kerala Backwaters',
    packageThumbnail: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=400&auto=format&fit=crop',
    destinationCountry: 'India',
    destinationRegion: 'Kerala',
    durationText: '6D / 5N',
    travelStartDate: 'May 20, 2024',
    travelEndDate: 'May 24, 2024',
    travelDatesText: 'May 20 – May 24, 2024',
    agencyName: 'Explore NorthEast',
    agencyLogo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    isAgencyVerified: false,
    totalAmount: '₹28,999',
    basePrice: '₹27,000',
    taxesAndFees: '₹1,499',
    platformFee: '₹500',
    discountAmount: '₹0',
    grandTotal: '₹28,999',
    paymentMethod: 'UPI',
    transactionId: 'TXNREF123456',
    paidAmount: '₹28,999',
    paidDate: 'May 2, 2024 • 11:32 AM',
    travelers: [
      { id: 'trv-9', name: 'Vikram Joshi', age: 38, gender: 'Male', phone: '+91 91234 98765', email: 'vikram.joshi@email.com', isPrimary: true },
    ],
    activities: [
      { id: 'act-10', actor: 'Super Admin', role: 'Super Admin', action: 'Refund Processed', details: 'Full refund of ₹28,999 credited back to UPI handle', timestamp: 'May 4, 2024 • 11:00 AM' },
    ],
    timeline: [
      { id: 'tl-1', title: 'Booking Created', subtitle: 'Completed', timestamp: 'May 2, 2024', status: 'completed' },
      { id: 'tl-2', title: 'Payment Received', subtitle: 'Completed', timestamp: 'May 2, 2024', status: 'completed' },
      { id: 'tl-3', title: 'Booking Refunded', subtitle: '₹28,999 Refunded', timestamp: 'May 4, 2024', status: 'completed' },
    ],
  },
  {
    id: 'BK-8',
    bookingId: 'BK-2024-0008',
    bookedAtDate: 'May 2, 2024',
    bookedAtTime: '12:40 PM',
    bookingStatus: 'Confirmed',
    paymentStatus: 'Paid',
    bookingSource: 'Mobile App',
    travelerName: 'Ananya Reddy',
    travelerEmail: 'ananya.reddy@email.com',
    travelerPhone: '+91 98888 77766',
    travelerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    additionalTravelersCount: 1,
    travelersSummary: '2 Adults',
    packageId: 'PKG-2024-0008',
    packageName: 'Bali Volcano Trek',
    packageThumbnail: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=400&auto=format&fit=crop',
    destinationCountry: 'Indonesia',
    destinationRegion: 'Bali',
    durationText: '3D / 2N',
    travelStartDate: 'Jun 5, 2024',
    travelEndDate: 'Jun 12, 2024',
    travelDatesText: 'Jun 5 – Jun 12, 2024',
    agencyName: 'Desert Dunes Travels',
    agencyLogo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    isAgencyVerified: true,
    totalAmount: '₹18,999',
    basePrice: '₹17,500',
    taxesAndFees: '₹999',
    platformFee: '₹500',
    discountAmount: '₹0',
    grandTotal: '₹18,999',
    paymentMethod: 'Debit Card',
    transactionId: 'TXN5566778899',
    paidAmount: '₹18,999',
    paidDate: 'May 2, 2024 • 12:42 PM',
    travelers: [
      { id: 'trv-10', name: 'Ananya Reddy', age: 24, gender: 'Female', phone: '+91 98888 77766', email: 'ananya.reddy@email.com', isPrimary: true },
    ],
    activities: [
      { id: 'act-11', actor: 'Ananya Reddy', role: 'Traveler', action: 'Created Booking', details: 'Mount Batur sunrise trek reserved', timestamp: 'May 2, 2024 • 12:40 PM' },
    ],
    timeline: [
      { id: 'tl-1', title: 'Booking Created', subtitle: 'Completed', timestamp: 'May 2, 2024', status: 'completed' },
      { id: 'tl-2', title: 'Payment Received', subtitle: 'Completed', timestamp: 'May 2, 2024', status: 'completed' },
      { id: 'tl-3', title: 'Agency Confirmed', subtitle: 'Confirmed', timestamp: 'May 2, 2024', status: 'completed' },
      { id: 'tl-4', title: 'Trip Started', subtitle: 'Jun 5, 2024', timestamp: 'Jun 5, 2024', status: 'upcoming' },
    ],
  },
  {
    id: 'BK-9',
    bookingId: 'BK-2024-0009',
    bookedAtDate: 'May 2, 2024',
    bookedAtTime: '01:15 PM',
    bookingStatus: 'Confirmed',
    paymentStatus: 'Paid',
    bookingSource: 'Web',
    travelerName: 'Siddharth Rao',
    travelerEmail: 'siddharth.rao@email.com',
    travelerPhone: '+91 99999 11122',
    travelerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    additionalTravelersCount: 2,
    travelersSummary: '3 Adults',
    packageId: 'PKG-2024-0009',
    packageName: 'Leh Ladakh Road Trip',
    packageThumbnail: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=400&auto=format&fit=crop',
    destinationCountry: 'India',
    destinationRegion: 'Ladakh',
    durationText: '6D / 5N',
    travelStartDate: 'Jun 2, 2024',
    travelEndDate: 'Jun 8, 2024',
    travelDatesText: 'Jun 2 – Jun 8, 2024',
    agencyName: 'Ladakh Diaries',
    agencyLogo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
    isAgencyVerified: true,
    totalAmount: '₹26,999',
    basePrice: '₹25,000',
    taxesAndFees: '₹1,499',
    platformFee: '₹500',
    discountAmount: '₹0',
    grandTotal: '₹26,999',
    paymentMethod: 'UPI',
    transactionId: 'TXN6677889900',
    paidAmount: '₹26,999',
    paidDate: 'May 2, 2024 • 01:18 PM',
    travelers: [
      { id: 'trv-11', name: 'Siddharth Rao', age: 28, gender: 'Male', phone: '+91 99999 11122', email: 'siddharth.rao@email.com', isPrimary: true },
    ],
    activities: [],
    timeline: [
      { id: 'tl-1', title: 'Booking Created', subtitle: 'Completed', timestamp: 'May 2, 2024', status: 'completed' },
      { id: 'tl-2', title: 'Payment Received', subtitle: 'Completed', timestamp: 'May 2, 2024', status: 'completed' },
      { id: 'tl-3', title: 'Agency Confirmed', subtitle: 'Confirmed', timestamp: 'May 2, 2024', status: 'completed' },
    ],
  },
  {
    id: 'BK-10',
    bookingId: 'BK-2024-0010',
    bookedAtDate: 'May 2, 2024',
    bookedAtTime: '02:05 PM',
    bookingStatus: 'Pending',
    paymentStatus: 'Pending',
    bookingSource: 'Web',
    travelerName: 'Meera Iyer',
    travelerEmail: 'meera.iyer@email.com',
    travelerPhone: '+91 95555 44433',
    travelerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    additionalTravelersCount: 1,
    travelersSummary: '2 Adults',
    packageId: 'PKG-2024-0010',
    packageName: 'Singapore Getaway',
    packageThumbnail: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=400&auto=format&fit=crop',
    destinationCountry: 'Singapore',
    destinationRegion: 'Singapore City',
    durationText: '5D / 4N',
    travelStartDate: 'Jun 10, 2024',
    travelEndDate: 'Jun 14, 2024',
    travelDatesText: 'Jun 10 – Jun 14, 2024',
    agencyName: 'Global Holidays',
    agencyLogo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
    isAgencyVerified: true,
    totalAmount: '₹64,999',
    basePrice: '₹60,000',
    taxesAndFees: '₹3,999',
    platformFee: '₹1,000',
    discountAmount: '₹0',
    grandTotal: '₹64,999',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN pending',
    paidAmount: '₹0',
    paidDate: 'Awaiting Authorization',
    travelers: [
      { id: 'trv-12', name: 'Meera Iyer', age: 32, gender: 'Female', phone: '+91 95555 44433', email: 'meera.iyer@email.com', isPrimary: true },
    ],
    activities: [],
    timeline: [
      { id: 'tl-1', title: 'Booking Created', subtitle: 'Hold on seats', timestamp: 'May 2, 2024', status: 'completed' },
      { id: 'tl-2', title: 'Payment Pending', subtitle: 'Pending authorization', timestamp: 'Pending', status: 'current' },
    ],
  },
];

class AdminBookingManagementService {
  private bookings: AdminBookingItem[];
  private kpiStats: BookingKPIStats;

  constructor() {
    this.bookings = this.loadStorage(STORAGE_KEY_BOOKINGS, initialAdminBookings);
    this.kpiStats = this.loadStorage(STORAGE_KEY_BOOKING_STATS, initialBookingKPIStats);
  }

  private loadStorage<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return fallback;
  }

  private saveStorage(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  public async getKPIStats(): Promise<BookingKPIStats> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...this.kpiStats }), 100);
    });
  }

  public async getBookings(
    filters?: Partial<BookingFilters>,
    sort?: BookingSortConfig
  ): Promise<AdminBookingItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...this.bookings];

        if (filters?.search) {
          const q = filters.search.toLowerCase().trim();
          result = result.filter(
            (b) =>
              b.bookingId.toLowerCase().includes(q) ||
              b.travelerName.toLowerCase().includes(q) ||
              b.travelerEmail.toLowerCase().includes(q) ||
              b.packageName.toLowerCase().includes(q) ||
              b.agencyName.toLowerCase().includes(q) ||
              b.destinationCountry.toLowerCase().includes(q)
          );
        }

        if (filters?.user) {
          const u = filters.user.toLowerCase().trim();
          result = result.filter(
            (b) =>
              b.travelerName.toLowerCase().includes(u) ||
              b.travelerEmail.toLowerCase().includes(u) ||
              b.travelerPhone.includes(u)
          );
        }

        if (filters?.bookingStatus && filters.bookingStatus !== 'All Status') {
          result = result.filter((b) => b.bookingStatus === filters.bookingStatus);
        }

        if (filters?.paymentStatus && filters.paymentStatus !== 'All Payment Status') {
          result = result.filter((b) => b.paymentStatus === filters.paymentStatus);
        }

        if (filters?.package && filters.package !== 'All Packages') {
          result = result.filter((b) => b.packageName === filters.package);
        }

        if (filters?.agency && filters.agency !== 'All Agencies') {
          result = result.filter((b) => b.agencyName === filters.agency);
        }

        if (filters?.destination && filters.destination !== 'All Destinations') {
          result = result.filter(
            (b) =>
              b.destinationCountry.toLowerCase() === filters.destination?.toLowerCase() ||
              b.destinationRegion.toLowerCase().includes(filters.destination?.toLowerCase() || '')
          );
        }

        if (sort) {
          result.sort((a, b) => {
            let valA: any = a.bookingId;
            let valB: any = b.bookingId;

            if (sort.key === 'bookingId') {
              valA = a.bookingId;
              valB = b.bookingId;
            } else if (sort.key === 'traveler') {
              valA = a.travelerName;
              valB = b.travelerName;
            } else if (sort.key === 'package') {
              valA = a.packageName;
              valB = b.packageName;
            } else if (sort.key === 'amount') {
              valA = parseInt(a.totalAmount.replace(/[^0-9]/g, '') || '0', 10);
              valB = parseInt(b.totalAmount.replace(/[^0-9]/g, '') || '0', 10);
            } else if (sort.key === 'bookingDate') {
              valA = a.bookedAtDate;
              valB = b.bookedAtDate;
            } else if (sort.key === 'status') {
              valA = a.bookingStatus;
              valB = b.bookingStatus;
            }

            if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
            return 0;
          });
        }

        resolve(result);
      }, 100);
    });
  }

  public async getBookingById(id: string): Promise<AdminBookingItem | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = this.bookings.find((b) => b.id === id || b.bookingId === id);
        resolve(found || this.bookings[0] || null);
      }, 100);
    });
  }

  public async confirmBooking(id: string): Promise<boolean> {
    const idx = this.bookings.findIndex((b) => b.id === id || b.bookingId === id);
    if (idx === -1) return false;

    this.bookings[idx] = {
      ...this.bookings[idx],
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid',
      activities: [
        {
          id: `act-${Date.now()}`,
          actor: 'Super Admin',
          role: 'Super Admin',
          action: 'Manually Confirmed Booking',
          details: 'Super Admin verified payment and confirmed booking with agency',
          timestamp: 'Just now',
        },
        ...this.bookings[idx].activities,
      ],
    };
    this.saveStorage(STORAGE_KEY_BOOKINGS, this.bookings);
    return true;
  }

  public async cancelBooking(id: string): Promise<boolean> {
    const idx = this.bookings.findIndex((b) => b.id === id || b.bookingId === id);
    if (idx === -1) return false;

    this.bookings[idx] = {
      ...this.bookings[idx],
      bookingStatus: 'Cancelled',
      activities: [
        {
          id: `act-${Date.now()}`,
          actor: 'Super Admin',
          role: 'Super Admin',
          action: 'Cancelled Booking',
          details: 'Admin cancelled booking per customer/agency request',
          timestamp: 'Just now',
        },
        ...this.bookings[idx].activities,
      ],
    };
    this.saveStorage(STORAGE_KEY_BOOKINGS, this.bookings);
    return true;
  }

  public async refundBooking(id: string): Promise<boolean> {
    const idx = this.bookings.findIndex((b) => b.id === id || b.bookingId === id);
    if (idx === -1) return false;

    this.bookings[idx] = {
      ...this.bookings[idx],
      bookingStatus: 'Refunded',
      paymentStatus: 'Refunded',
      activities: [
        {
          id: `act-${Date.now()}`,
          actor: 'Super Admin',
          role: 'Super Admin',
          action: 'Processed Refund',
          details: `Full refund of ${this.bookings[idx].totalAmount} credited to traveler`,
          timestamp: 'Just now',
        },
        ...this.bookings[idx].activities,
      ],
    };
    this.saveStorage(STORAGE_KEY_BOOKINGS, this.bookings);
    return true;
  }

  public async modifyBooking(id: string, updates: Partial<AdminBookingItem>): Promise<AdminBookingItem | null> {
    const idx = this.bookings.findIndex((b) => b.id === id || b.bookingId === id);
    if (idx === -1) return null;

    this.bookings[idx] = {
      ...this.bookings[idx],
      ...updates,
      activities: [
        {
          id: `act-${Date.now()}`,
          actor: 'Super Admin',
          role: 'Super Admin',
          action: 'Modified Booking',
          details: 'Updated traveler / travel date / status details',
          timestamp: 'Just now',
        },
        ...this.bookings[idx].activities,
      ],
    };
    this.saveStorage(STORAGE_KEY_BOOKINGS, this.bookings);
    return this.bookings[idx];
  }

  public async bulkConfirm(ids: string[]): Promise<boolean> {
    this.bookings = this.bookings.map((b) =>
      ids.includes(b.id) ? { ...b, bookingStatus: 'Confirmed' as const, paymentStatus: 'Paid' as const } : b
    );
    this.saveStorage(STORAGE_KEY_BOOKINGS, this.bookings);
    return true;
  }

  public async bulkCancel(ids: string[]): Promise<boolean> {
    this.bookings = this.bookings.map((b) =>
      ids.includes(b.id) ? { ...b, bookingStatus: 'Cancelled' as const } : b
    );
    this.saveStorage(STORAGE_KEY_BOOKINGS, this.bookings);
    return true;
  }

  public async bulkRefund(ids: string[]): Promise<boolean> {
    this.bookings = this.bookings.map((b) =>
      ids.includes(b.id)
        ? { ...b, bookingStatus: 'Refunded' as const, paymentStatus: 'Refunded' as const }
        : b
    );
    this.saveStorage(STORAGE_KEY_BOOKINGS, this.bookings);
    return true;
  }
}

export const adminBookingManagementService = new AdminBookingManagementService();
