export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  type: 'text' | 'image' | 'document' | 'system';
  text: string;
  attachmentUrl?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  systemMessageType?: 'booking' | 'documents' | 'pickup' | 'hotel' | 'reminder';
}

export interface VehicleBookingContext {
  bookingId: string;
  vehicleName: string;
  vehicleImage: string;
  rentalProvider: string;
  providerPhone?: string;
  pickupLocation: string;
  dropLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  bookingStatus: string;
  paymentStatus: string;
  depositPaid: number;
  remainingAmount: number;
  totalAmount: number;
  driverName?: string;
  driverPhone?: string;
  specialNotes?: string;
  viewBookingRoute: string;
}

export interface ChatConversation {
  id: string;
  agencyId: string;
  agencyName: string;
  agencyLogo: string;
  isVerified: boolean;
  isOnline: boolean;
  conversationType?: 'PACKAGE' | 'CAR_RENTAL';
  category: 'agencies' | 'support' | 'bookings' | 'hosts' | 'cars';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  // Package specific
  bookingId?: string;
  packageName?: string;
  destinationName?: string;
  travelDates?: string;
  tripId?: string;
  hostPhone?: string;
  whatsappNumber?: string;
  supportMessage?: string;
  onlineStatus?: 'online' | 'offline';
  lastSeen?: string;
  // Car rental specific
  vehicleBooking?: VehicleBookingContext;
  messages: ChatMessage[];
}

export interface AgencyContactInfo {
  agencyId: string;
  agencyName: string;
  agencyLogo?: string | null;
  isVerified?: boolean;
  phoneNumber: string | null;
  whatsappNumber: string | null;
  onlineStatus: 'online' | 'offline';
  isOnline?: boolean;
  lastSeen: string | null;
  supportMessage: string;
  bookingId?: string | null;
  packageName?: string | null;
}

export let INITIAL_CHATS: ChatConversation[] = [
  // ─── 1. Car Rentals: Confirmed Booking ───
  {
    id: 'chat-car-001',
    agencyId: 'agency-car-001',
    agencyName: 'Himalayan Wheels & Fleet',
    agencyLogo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=300&auto=format&fit=crop',
    isVerified: true,
    isOnline: true,
    conversationType: 'CAR_RENTAL',
    category: 'cars',
    lastMessage: 'Your Toyota Innova Crysta is fueled and ready. Driver Rohit will arrive at 08:30 AM.',
    lastMessageTime: '11:15 AM',
    unreadCount: 1,
    hostPhone: '+91 98765 12345',
    vehicleBooking: {
      bookingId: 'CB-2026-0042',
      vehicleName: 'Toyota Innova Crysta (7-Seater)',
      vehicleImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop',
      rentalProvider: 'Himalayan Wheels & Fleet',
      providerPhone: '+91 98765 12345',
      pickupLocation: 'Guwahati Airport Gate 2',
      dropLocation: 'Police Bazar, Shillong',
      pickupDate: '24 May 2026',
      pickupTime: '08:30 AM',
      returnDate: '28 May 2026',
      bookingStatus: 'CONFIRMED',
      paymentStatus: 'DEPOSIT_PAID',
      depositPaid: 3500,
      remainingAmount: 10500,
      totalAmount: 14000,
      driverName: 'Rohit Sangma (Verified Chauffeur)',
      driverPhone: '+91 98765 44321',
      specialNotes: 'Child seat requested. Clean sanitized vehicle.',
      viewBookingRoute: '/car-bookings/CB-2026-0042',
    },
    messages: [
      {
        id: 'cm1',
        senderId: 'agency-car-001',
        senderName: 'Himalayan Wheels',
        type: 'text',
        text: 'Hello Subham! Your reservation for Toyota Innova Crysta is confirmed under Booking ID CB-2026-0042.',
        timestamp: '11:00 AM',
        status: 'read',
      },
      {
        id: 'cm2',
        senderId: 'agency-car-001',
        senderName: 'Himalayan Wheels',
        type: 'text',
        text: 'Your Toyota Innova Crysta is fueled and ready. Driver Rohit will arrive at 08:30 AM.',
        timestamp: '11:15 AM',
        status: 'delivered',
      },
    ],
  },

  // ─── 2. Packages: Confirmed Booking ───
  {
    id: 'chat-001',
    agencyId: 'agency-001',
    agencyName: 'Wander North Travel',
    agencyLogo: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    isOnline: true,
    conversationType: 'PACKAGE',
    category: 'agencies',
    lastMessage: 'Pickup point confirmed at Guwahati Airport Gate 3 at 08:30 AM.',
    lastMessageTime: '10:42 AM',
    unreadCount: 2,
    bookingId: 'BK-2025-0012',
    packageName: 'Magical Meghalaya Tour',
    destinationName: 'Meghalaya',
    travelDates: '20 May – 26 May, 2025',
    tripId: 'trip-001',
    hostPhone: '+91 98765 43210',
    messages: [
      {
        id: 'm1',
        senderId: 'agency-001',
        senderName: 'Wander North Travel',
        type: 'text',
        text: 'Hello Subham! Your Meghalaya trip is confirmed. Our lead host Subham Das and guide Ramesh Sangma will accompany your group.',
        timestamp: '10:30 AM',
        status: 'read',
      },
      {
        id: 'm2',
        senderId: 'agency-001',
        senderName: 'Wander North Travel',
        type: 'text',
        text: 'Pickup point confirmed at Guwahati Airport Gate 3 at 08:30 AM.',
        timestamp: '10:42 AM',
        status: 'read',
      },
    ],
  },

  // ─── 3. Car Rentals: Confirmed Self-Drive SUV ───
  {
    id: 'chat-car-002',
    agencyId: 'agency-car-002',
    agencyName: 'NorthEast 4x4 Expedition Hub',
    agencyLogo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=300&auto=format&fit=crop',
    isVerified: true,
    isOnline: true,
    conversationType: 'CAR_RENTAL',
    category: 'cars',
    lastMessage: 'Your Mahindra Thar 4x4 Hardtop is prepped. Security deposit pre-authorization completed.',
    lastMessageTime: '10:10 AM',
    unreadCount: 0,
    hostPhone: '+91 98765 67890',
    vehicleBooking: {
      bookingId: 'CB-2026-0078',
      vehicleName: 'Mahindra Thar 4x4 Hardtop (Self-Drive)',
      vehicleImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop',
      rentalProvider: 'NorthEast 4x4 Expedition Hub',
      providerPhone: '+91 98765 67890',
      pickupLocation: 'Police Bazar Hub, Shillong',
      dropLocation: 'Guwahati Airport Gate 1',
      pickupDate: '28 May 2026',
      pickupTime: '09:00 AM',
      returnDate: '31 May 2026',
      bookingStatus: 'CONFIRMED',
      paymentStatus: 'DEPOSIT_PAID',
      depositPaid: 4500,
      remainingAmount: 9000,
      totalAmount: 13500,
      driverName: 'Self-Drive (KYC & DL Verified)',
      driverPhone: '+91 98765 67890',
      specialNotes: 'Includes off-road recovery kit and roof rack.',
      viewBookingRoute: '/car-bookings/CB-2026-0078',
    },
    messages: [
      {
        id: 'cm3',
        senderId: 'agency-car-002',
        senderName: 'NorthEast 4x4 Hub',
        type: 'text',
        text: 'Hi Subham! Your self-drive Thar 4x4 is confirmed under CB-2026-0078. All vehicle inspection documents are ready.',
        timestamp: '09:45 AM',
        status: 'read',
      },
      {
        id: 'cm4',
        senderId: 'agency-car-002',
        senderName: 'NorthEast 4x4 Hub',
        type: 'text',
        text: 'Your Mahindra Thar 4x4 Hardtop is prepped. Security deposit pre-authorization completed.',
        timestamp: '10:10 AM',
        status: 'read',
      },
    ],
  },

  // ─── 4. Packages: Lead Trip Host Chat ───
  {
    id: 'chat-002',
    agencyId: 'host-001',
    agencyName: 'Subham Das (Lead Trip Host)',
    agencyLogo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    isOnline: true,
    conversationType: 'PACKAGE',
    category: 'hosts',
    lastMessage: 'Hi Subham, I will meet you tomorrow morning at Guwahati Airport.',
    lastMessageTime: '09:15 AM',
    unreadCount: 0,
    bookingId: 'BK-2025-0012',
    packageName: 'Magical Meghalaya Tour',
    destinationName: 'Shillong & Cherrapunji',
    travelDates: '20 May – 26 May, 2025',
    tripId: 'trip-001',
    hostPhone: '+91 98765 43210',
    messages: [
      {
        id: 'hm1',
        senderId: 'host-001',
        senderName: 'Subham Das',
        type: 'text',
        text: 'Hi Subham, I will meet you tomorrow morning at Guwahati Airport.',
        timestamp: '09:15 AM',
        status: 'read',
      },
    ],
  },

  // ─── 5. Packages: Pre-Booking Inquiry (No Booking ID) ───
  {
    id: 'chat-004',
    agencyId: 'agency-004',
    agencyName: 'Brahmaputra Expeditions & Safaris',
    agencyLogo: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    isOnline: true,
    conversationType: 'PACKAGE',
    category: 'agencies',
    lastMessage: 'Elephant safari slots for Central Range Kohora are confirmed for Saturday morning. Shall we finalize the booking?',
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
    packageName: 'Kaziranga Safari & River Cruise',
    destinationName: 'Kaziranga & Majuli Island',
    travelDates: 'Available Daily',
    hostPhone: '+91 98765 33221',
    messages: [
      {
        id: 'bm1',
        senderId: 'agency-004',
        senderName: 'Brahmaputra Expeditions',
        type: 'text',
        text: 'Welcome to Brahmaputra Expeditions! We specialize in private jeep and elephant safaris in Kaziranga National Park.',
        timestamp: 'Yesterday',
        status: 'read',
      },
      {
        id: 'bm2',
        senderId: 'agency-004',
        senderName: 'Brahmaputra Expeditions',
        type: 'text',
        text: 'Elephant safari slots for Central Range Kohora are confirmed for Saturday morning. Shall we finalize the booking?',
        timestamp: 'Yesterday',
        status: 'delivered',
      },
    ],
  },

  // ─── 6. Car Rentals: Fleet Pre-Booking Inquiry (No Booking ID) ───
  {
    id: 'chat-car-003',
    agencyId: 'agency-car-003',
    agencyName: 'Guwahati Luxury Airport Fleet',
    agencyLogo: 'https://images.unsplash.com/photo-1555353540-64580b51c258?q=80&w=300&auto=format&fit=crop',
    isVerified: true,
    isOnline: true,
    conversationType: 'CAR_RENTAL',
    category: 'cars',
    lastMessage: 'We have reserved your Mercedes E-Class airport transfer quotation. Chauffeur meets at arrival gate with name placard.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    hostPhone: '+91 98765 88990',
    vehicleBooking: {
      bookingId: '',
      vehicleName: 'Mercedes-Benz E-Class Luxury Chauffeur',
      vehicleImage: 'https://images.unsplash.com/photo-1555353540-64580b51c258?q=80&w=800&auto=format&fit=crop',
      rentalProvider: 'Guwahati Luxury Airport Fleet',
      providerPhone: '+91 98765 88990',
      pickupLocation: 'Guwahati International Airport (GAU)',
      dropLocation: 'Vivanta Guwahati',
      pickupDate: '2 June 2026',
      pickupTime: '02:00 PM',
      returnDate: '2 June 2026',
      bookingStatus: 'INQUIRY_ACTIVE',
      paymentStatus: 'QUOTE_SENT',
      depositPaid: 0,
      remainingAmount: 4500,
      totalAmount: 4500,
      driverName: 'Executive Uniformed Chauffeur',
      driverPhone: '+91 98765 88990',
      specialNotes: 'Flight tracking and terminal meet-and-greet included.',
      viewBookingRoute: '/cars',
    },
    messages: [
      {
        id: 'cm5',
        senderId: 'agency-car-003',
        senderName: 'Guwahati Luxury Fleet',
        type: 'text',
        text: 'Greetings! Thank you for inquiring about executive airport transfers in Guwahati.',
        timestamp: 'Yesterday',
        status: 'read',
      },
      {
        id: 'cm6',
        senderId: 'agency-car-003',
        senderName: 'Guwahati Luxury Fleet',
        type: 'text',
        text: 'We have reserved your Mercedes E-Class airport transfer quotation. Chauffeur meets at arrival gate with name placard.',
        timestamp: 'Yesterday',
        status: 'read',
      },
    ],
  },

  // ─── 7. Packages: Luxury Explorer Inquiry (No Booking ID) ───
  {
    id: 'chat-005',
    agencyId: 'agency-005',
    agencyName: 'Denzong Himalayan Retreats',
    agencyLogo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    isOnline: false,
    conversationType: 'PACKAGE',
    category: 'agencies',
    lastMessage: 'The luxury valley-view tea estate suites have been placed on 24-hour courtesy hold for your travel dates.',
    lastMessageTime: '2 days ago',
    unreadCount: 0,
    packageName: 'Sikkim & Darjeeling Luxury Explorer',
    destinationName: 'Gangtok & Darjeeling',
    travelDates: 'June 2026',
    hostPhone: '+91 98765 11223',
    messages: [
      {
        id: 'dm1',
        senderId: 'agency-005',
        senderName: 'Denzong Retreats',
        type: 'text',
        text: 'Hello Subham! We received your inquiry regarding private tea estate villa stays in Darjeeling.',
        timestamp: '2 days ago',
        status: 'read',
      },
      {
        id: 'dm2',
        senderId: 'agency-005',
        senderName: 'Denzong Retreats',
        type: 'text',
        text: 'The luxury valley-view tea estate suites have been placed on 24-hour courtesy hold for your travel dates.',
        timestamp: '2 days ago',
        status: 'read',
      },
    ],
  },

  // ─── 8. Support: 24x7 Customer Desk ───
  {
    id: 'chat-003',
    agencyId: 'support-001',
    agencyName: 'Travel OS 24x7 Customer Support',
    agencyLogo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    isOnline: true,
    category: 'support',
    lastMessage: 'Hi Subham, our concierge team is available 24/7 if you need itinerary assistance or trip adjustments.',
    lastMessageTime: '2 days ago',
    unreadCount: 0,
    packageName: 'Travel OS Concierge Support',
    destinationName: 'Global Support Desk',
    travelDates: '24x7 Online',
    hostPhone: '+91 98765 99999',
    messages: [
      {
        id: 'sm1',
        senderId: 'support-001',
        senderName: 'Travel OS Support',
        type: 'text',
        text: 'Hello Subham! Welcome to ApnaTrip customer support. How can we assist you today?',
        timestamp: '2 days ago',
        status: 'read',
      },
      {
        id: 'sm2',
        senderId: 'support-001',
        senderName: 'Travel OS Support',
        type: 'text',
        text: 'Hi Subham, our concierge team is available 24/7 if you need itinerary assistance or trip adjustments.',
        timestamp: '2 days ago',
        status: 'read',
      },
    ],
  },

  // ─── 9. Support: Payments & Billing ───
  {
    id: 'chat-support-002',
    agencyId: 'support-billing',
    agencyName: 'ApnaTrip Payment & Billing Desk',
    agencyLogo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    isOnline: true,
    category: 'support',
    lastMessage: 'Your payment invoice and GST credit tax certificate for reservation BK-2025-0012 have been emailed.',
    lastMessageTime: '3 days ago',
    unreadCount: 0,
    packageName: 'Billing & Invoice Verification',
    destinationName: 'Payment Portal',
    travelDates: 'Financial Services',
    hostPhone: '+91 98765 77777',
    messages: [
      {
        id: 'bm1',
        senderId: 'support-billing',
        senderName: 'Payment Desk',
        type: 'text',
        text: 'Your payment invoice and GST credit tax certificate for reservation BK-2025-0012 have been emailed.',
        timestamp: '3 days ago',
        status: 'read',
      },
    ],
  },
];

export const getChats = (): ChatConversation[] => INITIAL_CHATS;
export const getChatById = (id: string): ChatConversation =>
  INITIAL_CHATS.find((c) => c.id === id) || INITIAL_CHATS[0];

export const sendMessage = (chatId: string, text: string) => {
  const newMsg: ChatMessage = {
    id: `m-${Date.now()}`,
    senderId: 'user-001',
    senderName: 'Subham Das',
    type: 'text',
    text,
    timestamp: 'Just now',
    status: 'sent',
  };

  INITIAL_CHATS = INITIAL_CHATS.map((c) => {
    if (c.id === chatId) {
      return {
        ...c,
        lastMessage: text,
        lastMessageTime: 'Just now',
        messages: [...c.messages, newMsg],
      };
    }
    return c;
  });
};

export const markChatRead = (chatId: string) => {
  INITIAL_CHATS = INITIAL_CHATS.map((c) => {
    if (c.id === chatId) {
      return { ...c, unreadCount: 0 };
    }
    return c;
  });
};
