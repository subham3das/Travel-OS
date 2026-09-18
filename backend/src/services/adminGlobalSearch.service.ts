import { AgencyModel } from '../models/agency.model.js';
import { UserModel } from '../models/user.model.js';
import { PackageModel } from '../models/package.model.js';
import { BookingModel } from '../models/booking.model.js';
import { SupportTicketModel } from '../models/supportTicket.model.js';
import { PaymentModel } from '../models/payment.model.js';

export class AdminGlobalSearchService {
  async search(query: string) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const regex = new RegExp(query.trim(), 'i');

    const [agencies, users, packages, bookings, tickets, payments] = await Promise.all([
      AgencyModel.find({
        $or: [{ name: regex }, { agencyName: regex }, { email: regex }, { phone: regex }],
      }).limit(4).lean(),

      UserModel.find({
        $or: [{ name: regex }, { email: regex }, { phone: regex }],
      }).limit(4).lean(),

      PackageModel.find({
        isDeleted: false,
        $or: [{ title: regex }, { destination: regex }, { agencyName: regex }],
      }).limit(4).lean(),

      BookingModel.find({
        isDeleted: false,
        $or: [{ bookingId: regex }, { userName: regex }, { packageName: regex }],
      }).limit(4).lean(),

      SupportTicketModel.find({
        $or: [{ ticketId: regex }, { subject: regex }, { userName: regex }],
      }).limit(4).lean(),

      PaymentModel.find({
        isDeleted: false,
        $or: [{ paymentId: regex }, { bookingId: regex }, { userName: regex }],
      }).limit(4).lean(),
    ]);

    const results: any[] = [];

    // Agencies
    agencies.forEach((a: any) => {
      results.push({
        id: a._id.toString(),
        category: 'agencies',
        title: a.agencyName || a.name || 'Travel Agency',
        subtitle: `Agency • ${a.email || ''}`,
        status: a.status === 'APPROVED' ? 'Approved' : 'Pending Approval',
        statusColor: a.status === 'APPROVED' ? 'emerald' : 'amber',
        avatar: a.logo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
        targetRoute: a.status === 'APPROVED' ? '/admin/agencies' : '/admin/verification-pending',
        actionLabel: 'View Agency',
        keywords: [a.name, a.email, 'agency'],
      });
    });

    // Users
    users.forEach((u: any) => {
      results.push({
        id: u._id.toString(),
        category: 'users',
        title: u.name || 'Traveler',
        subtitle: `Traveler • ${u.email || ''}`,
        status: 'Active',
        statusColor: 'emerald',
        avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        targetRoute: '/admin/users',
        actionLabel: 'View User',
        keywords: [u.name, u.email, 'traveler'],
      });
    });

    // Packages
    packages.forEach((p: any) => {
      results.push({
        id: p._id.toString(),
        category: 'packages',
        title: p.title,
        subtitle: `Destination: ${p.destination || ''} • Agency: ${p.agencyName || ''}`,
        amount: `₹${(p.price || 0).toLocaleString('en-IN')}`,
        status: p.status || 'Published',
        statusColor: 'emerald',
        targetRoute: '/admin/packages',
        actionLabel: 'View Package',
        keywords: [p.title, p.destination, 'package'],
      });
    });

    // Bookings
    bookings.forEach((b: any) => {
      results.push({
        id: b._id.toString(),
        category: 'bookings',
        title: b.bookingId,
        subtitle: `${b.packageName || 'Trip'} • ${b.userName || 'Traveler'}`,
        details: b.packageName,
        amount: `₹${(b.totalAmount || 0).toLocaleString('en-IN')}`,
        status: b.status,
        statusColor: b.status === 'CONFIRMED' ? 'emerald' : 'amber',
        targetRoute: '/admin/bookings',
        actionLabel: 'View Booking',
        keywords: [b.bookingId, b.userName, 'booking'],
      });
    });

    // Support
    tickets.forEach((t: any) => {
      results.push({
        id: t._id.toString(),
        category: 'support',
        title: t.ticketId,
        subtitle: `${t.subject} • ${t.userName}`,
        status: t.status,
        statusColor: t.status === 'OPEN' ? 'amber' : 'purple',
        targetRoute: '/admin/support',
        actionLabel: 'View Ticket',
        keywords: [t.ticketId, t.subject, 'support'],
      });
    });

    // Payments
    payments.forEach((py: any) => {
      results.push({
        id: py._id.toString(),
        category: 'payments',
        title: py.paymentId,
        subtitle: `${py.gateway || 'Payment'} • ${py.userName || ''}`,
        amount: `₹${(py.amount || 0).toLocaleString('en-IN')}`,
        status: py.status,
        statusColor: py.status === 'COMPLETED' ? 'emerald' : 'rose',
        targetRoute: '/admin/payments',
        actionLabel: 'View Payment',
        keywords: [py.paymentId, 'payment'],
      });
    });

    return results;
  }
}

export const adminGlobalSearchService = new AdminGlobalSearchService();
