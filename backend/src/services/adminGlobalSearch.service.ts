import { AgencyModel } from '../models/agency.model.js';
import { UserModel } from '../models/user.model.js';
import { PackageModel } from '../models/package.model.js';
import { DepartureModel } from '../models/departure.model.js';
import { BookingModel } from '../models/booking.model.js';
import { CarModel } from '../models/car.model.js';
import { CouponModel } from '../models/coupon.model.js';
import { CMSBannerModel } from '../models/cmsBanner.model.js';
import { SupportTicketModel } from '../models/supportTicket.model.js';

export class AdminGlobalSearchService {
  async search(query: string) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const regex = new RegExp(query.trim(), 'i');

    const [
      packages,
      departures,
      bookings,
      agencies,
      cars,
      users,
      coupons,
      cmsBanners,
      tickets,
    ] = await Promise.all([
      // 1. Packages
      PackageModel.find({
        isDeleted: false,
        $or: [{ title: regex }, { destination: regex }, { agencyName: regex }, { category: regex }],
      })
        .limit(4)
        .lean(),

      // 2. Departures
      DepartureModel.find({
        $or: [{ departureId: regex }, { notes: regex }],
      })
        .populate('packageId', 'title destination coverImage')
        .populate('agencyId', 'name agencyDisplayName')
        .limit(4)
        .lean(),

      // 3. Bookings
      BookingModel.find({
        isDeleted: false,
        $or: [
          { bookingId: regex },
          { customerName: regex },
          { customerEmail: regex },
          { packageName: regex },
          { agencyName: regex },
        ],
      })
        .limit(4)
        .lean(),

      // 4. Agencies
      AgencyModel.find({
        isDeleted: false,
        $or: [{ name: regex }, { agencyDisplayName: regex }, { email: regex }, { phone: regex }, { city: regex }],
      })
        .limit(4)
        .lean(),

      // 5. Car Rentals
      CarModel.find({
        $or: [{ brand: regex }, { name: regex }, { registrationNumber: regex }, { city: regex }],
      })
        .limit(4)
        .lean(),

      // 6. Users
      UserModel.find({
        isDeleted: false,
        $or: [{ name: regex }, { email: regex }, { phone: regex }],
      })
        .limit(4)
        .lean(),

      // 7. Coupons
      CouponModel.find({
        $or: [{ code: regex }, { description: regex }],
      })
        .limit(4)
        .lean(),

      // 8. CMS Content
      CMSBannerModel.find({
        $or: [{ title: regex }, { subtitle: regex }, { ctaText: regex }],
      })
        .limit(4)
        .lean(),

      // 9. Support Tickets
      SupportTicketModel.find({
        $or: [{ ticketId: regex }, { subject: regex }, { customerEmail: regex }, { customerName: regex }],
      })
        .limit(4)
        .lean(),
    ]);

    const results: any[] = [];

    // Packages
    packages.forEach((p: any) => {
      results.push({
        id: p._id.toString(),
        category: 'packages',
        title: p.title,
        subtitle: `Destination: ${p.destination || ''} • Agency: ${p.agencyName || ''}`,
        amount: `₹${(p.price || 0).toLocaleString('en-IN')}`,
        status: p.status || 'Active',
        statusColor: 'emerald',
        targetRoute: '/admin/packages',
        actionLabel: 'View Package',
        keywords: [p.title, p.destination, 'package'],
      });
    });

    // Departures
    departures.forEach((d: any) => {
      const pkg = d.packageId || {};
      const ag = d.agencyId || {};
      results.push({
        id: d._id.toString(),
        category: 'departures',
        title: d.departureId,
        subtitle: `${pkg.title || 'Tour'} • ${new Date(d.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • ${ag.agencyDisplayName || ag.name || 'Agency'}`,
        amount: `${d.bookedSeats || 0} / ${d.capacity || 20} Seats`,
        status: d.status || 'OPEN',
        statusColor: d.status === 'OPEN' ? 'emerald' : 'purple',
        targetRoute: '/admin/departures',
        actionLabel: 'View Departure',
        keywords: [d.departureId, pkg.title, 'departure'],
      });
    });

    // Bookings
    bookings.forEach((b: any) => {
      results.push({
        id: b._id.toString(),
        category: 'bookings',
        title: b.bookingId,
        subtitle: `${b.customerName || 'Traveler'} • ${b.packageName || 'Package'}`,
        amount: `₹${(b.totalAmount || 0).toLocaleString('en-IN')}`,
        status: b.status || 'Confirmed',
        statusColor: b.status === 'CONFIRMED' ? 'emerald' : b.status === 'CANCELLED' ? 'rose' : 'amber',
        targetRoute: '/admin/bookings',
        actionLabel: 'View Booking',
        keywords: [b.bookingId, b.customerName, 'booking'],
      });
    });

    // Agencies
    agencies.forEach((a: any) => {
      results.push({
        id: a._id.toString(),
        category: 'agencies',
        title: a.agencyDisplayName || a.name || 'Travel Agency',
        subtitle: `Agency • ${a.city || ''} • ${a.email || ''}`,
        status: a.status === 'ACTIVE' ? 'Active' : a.verificationStatus || 'Pending',
        statusColor: a.status === 'ACTIVE' ? 'emerald' : 'amber',
        avatar: a.logo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
        targetRoute: `/admin/agencies/${a._id.toString()}`,
        actionLabel: 'View Agency',
        keywords: [a.name, a.email, 'agency'],
      });
    });

    // Car Rentals
    cars.forEach((c: any) => {
      results.push({
        id: c._id.toString(),
        category: 'car-rentals',
        title: `${c.brand || ''} ${c.name || ''}`.trim() || 'Rental Vehicle',
        subtitle: `${c.category || c.type || 'Vehicle'} • ${c.registrationNumber || ''} • ${c.city || ''}`,
        amount: `₹${(c.dailyPrice || 0).toLocaleString('en-IN')}/day`,
        status: c.status || 'available',
        statusColor: c.status === 'available' ? 'emerald' : 'amber',
        targetRoute: '/admin/car-rental-approvals',
        actionLabel: 'View Fleet',
        keywords: [c.brand, c.name, c.registrationNumber, 'car'],
      });
    });

    // Users
    users.forEach((u: any) => {
      results.push({
        id: u._id.toString(),
        category: 'users',
        title: u.name || 'Traveler',
        subtitle: `User • ${u.email || ''}`,
        status: 'Active',
        statusColor: 'emerald',
        avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        targetRoute: '/admin/users',
        actionLabel: 'View User',
        keywords: [u.name, u.email, 'traveler'],
      });
    });

    // Coupons
    coupons.forEach((cp: any) => {
      results.push({
        id: cp._id.toString(),
        category: 'coupons',
        title: cp.code,
        subtitle: cp.description || 'Promotional Coupon',
        amount: cp.discountType === 'PERCENTAGE' ? `${cp.discountValue}% OFF` : `₹${cp.discountValue} OFF`,
        status: cp.isActive ? 'Active' : 'Inactive',
        statusColor: cp.isActive ? 'emerald' : 'slate',
        targetRoute: '/admin/coupons',
        actionLabel: 'View Coupon',
        keywords: [cp.code, 'coupon'],
      });
    });

    // CMS Content
    cmsBanners.forEach((b: any) => {
      results.push({
        id: b._id.toString(),
        category: 'cms',
        title: b.title,
        subtitle: `Hero Banner • ${b.position || 'Homepage'}`,
        status: b.status || 'ACTIVE',
        statusColor: b.status === 'ACTIVE' ? 'emerald' : 'slate',
        targetRoute: '/admin/cms',
        actionLabel: 'View CMS Banner',
        keywords: [b.title, 'banner', 'cms'],
      });
    });

    // Support Tickets
    tickets.forEach((t: any) => {
      results.push({
        id: t._id.toString(),
        category: 'support',
        title: t.ticketId,
        subtitle: `${t.subject || 'Ticket'} • ${t.customerName || ''}`,
        status: t.status || 'OPEN',
        statusColor: t.status === 'RESOLVED' ? 'emerald' : 'amber',
        targetRoute: '/admin/support',
        actionLabel: 'View Ticket',
        keywords: [t.ticketId, t.subject, 'support'],
      });
    });

    return results;
  }
}

export const adminGlobalSearchService = new AdminGlobalSearchService();
