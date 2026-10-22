/**
 * WhatsApp & Phone Contact Helper for User Panel
 * Opens WhatsApp with prefilled message format:
 * 
 * Hello,
 * 
 * Booking ID: <id>
 * 
 * My Name: <name>
 * 
 * I have a question regarding my booking.
 * 
 * Thank you.
 */

export interface WhatsAppContactParams {
  phone?: string;
  bookingId?: string;
  userName?: string;
}

export function openWhatsAppContact({ phone, bookingId, userName }: WhatsAppContactParams) {
  const rawPhone = (phone || '+91 98765 00000').replace(/[^0-9]/g, '');
  const targetPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

  let displayBookingId = 'N/A';
  if (bookingId) {
    displayBookingId = bookingId.startsWith('BK-') ? bookingId : `BK-${bookingId}`;
  }

  const displayName = userName && userName.trim() ? userName.trim() : 'Rahul Sharma';

  const message = `Hello,\n\nBooking ID: ${displayBookingId}\n\nMy Name: ${displayName}\n\nI have a question regarding my booking.\n\nThank you.`;

  const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function makePhoneCall(phone?: string) {
  const rawPhone = (phone || '+919876500000').replace(/[^0-9+]/g, '');
  window.location.href = `tel:${rawPhone}`;
}
