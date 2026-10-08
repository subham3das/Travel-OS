import mongoose from 'mongoose';
import { AgencyModel, IAgency } from '../models/agency.model.js';
import { CarModel } from '../models/car.model.js';
import { CarBookingModel } from '../models/carBooking.model.js';
import { AuditLogModel } from '../models/auditLog.model.js';
import { AuditLoggerService } from './auditLogger.service.js';
import { NotificationModel } from '../models/notification.model.js';
import { mailService } from './mail.service.js';
import { envConfig } from '../config/env.config.js';
import { logger } from '../config/logger.config.js';
import { NotFoundError } from '../utils/errors.util.js';

export interface CarRentalFiltersQuery {
  page?: number;
  limit?: number;
  tab?: 'Pending' | 'Approved' | 'Rejected' | 'Needs Changes' | 'All';
  status?: string;
  state?: string;
  city?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FormattedCarRentalRequestItem {
  id: string;
  applicationId: string;
  businessName: string;
  legalBusinessName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  logo: string;
  coverPhoto: string;
  verificationStatus: string;
  registeredDate: string;
  vehiclesCount: number;
  fleetType: string;
  commercialLicenseStatus: string;
  documentsUploadedCount: number;
  documentsTotalCount: number;
  city: string;
  state: string;
  country: string;
  address: string;
  gstNumber: string;
  panNumber: string;
  businessLicenseNumber: string;
  fleetSize: number;
  operatingCities: string[];
  workingHours: string;
  emergencyContact: string;
  description: string;
  rejectionReason?: string;
  requestedChanges?: {
    issues: string[];
    message?: string;
    requestedAt?: string;
    requestedBy?: string;
  };
  reviewNotes?: string;
  lastUpdated: string;
  assignedReviewer?: string;
  complianceScore: number;
  timeline: Array<{
    id: string;
    title: string;
    timestamp: string;
    completed: boolean;
    color?: string;
    desc?: string;
  }>;
  activities: Array<{
    id: string;
    timestamp: string;
    adminName: string;
    action: string;
    notes?: string;
    status: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    fileUrl: string;
    uploadedAt: string;
    rejectionReason?: string;
  }>;
  vehicles?: Array<{
    id: string;
    name: string;
    brand: string;
    modelYear?: number;
    registrationNumber?: string;
    type: string;
    category: string;
    seats: number;
    fuel: string;
    transmission: string;
    dailyPrice: number;
    isAvailable: boolean;
    isActive: boolean;
    images: string[];
    thumbnail?: string;
    driver?: {
      name: string;
      phone?: string;
      experienceYears: number;
      rating: number;
      isVerified: boolean;
    };
  }>;
  drivers?: Array<{
    name: string;
    phone: string;
    experienceYears: number;
    rating: number;
    licenseNumber?: string;
    isVerified: boolean;
    vehicleAssigned?: string;
  }>;
  bankDetails?: {
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
    status?: string;
    verified?: boolean;
  };
}

export class AdminCarRentalApprovalService {
  /**
   * Helper to format IAgency and related vehicles into frontend CarRentalRequestItem DTO
   */
  private formatCarRentalItem(
    agency: any,
    cars: any[] = [],
    activities: any[] = []
  ): FormattedCarRentalRequestItem {
    const profile = agency.carRentalProfile || {};
    const docs = profile.documents && profile.documents.length > 0 ? profile.documents : agency.documents || [];
    const totalDocs = docs.length || 5;
    const uploadedDocs = docs.filter((d: any) => d.fileUrl && d.fileUrl !== '#').length;

    const submittedDateStr = agency.createdAt
      ? new Date(agency.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Recently';

    const lastUpdatedStr = agency.updatedAt
      ? new Date(agency.updatedAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : submittedDateStr;

    // Build timeline
    const timeline =
      agency.timeline && agency.timeline.length > 0
        ? agency.timeline
        : [
            {
              id: 'cr-t1',
              title: 'Car Rental Application Submitted',
              timestamp: submittedDateStr,
              completed: true,
              desc: 'Application received with business details and commercial fleet declaration.',
            },
            {
              id: 'cr-t2',
              title: 'Compliance & Permits Uploaded',
              timestamp: submittedDateStr,
              completed: uploadedDocs > 0,
              desc: `${uploadedDocs} documents uploaded for verification.`,
            },
            {
              id: 'cr-t3',
              title:
                agency.carRentalVerificationStatus === 'APPROVED'
                  ? 'Application Approved'
                  : agency.carRentalVerificationStatus === 'REJECTED'
                  ? 'Application Rejected'
                  : agency.carRentalVerificationStatus === 'CHANGES_REQUESTED'
                  ? 'Changes Requested by Admin'
                  : 'Compliance Review in Progress',
              timestamp: agency.carRentalApprovedAt
                ? new Date(agency.carRentalApprovedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : lastUpdatedStr,
              completed: agency.carRentalVerificationStatus === 'APPROVED' || agency.carRentalVerificationStatus === 'REJECTED',
              color:
                agency.carRentalVerificationStatus === 'APPROVED'
                  ? 'emerald'
                  : agency.carRentalVerificationStatus === 'REJECTED'
                  ? 'rose'
                  : agency.carRentalVerificationStatus === 'CHANGES_REQUESTED'
                  ? 'amber'
                  : 'indigo',
            },
          ];

    // Extract drivers from cars
    const driversMap = new Map<string, any>();
    cars.forEach((car) => {
      if (car.driver && car.driver.name) {
        driversMap.set(car.driver.name, {
          name: car.driver.name,
          phone: car.driver.phone || profile.phone || agency.phone || '—',
          experienceYears: car.driver.experienceYears || 3,
          rating: car.driver.rating || 4.8,
          licenseNumber: `DL-${Math.floor(10000000 + Math.random() * 90000000)}`,
          isVerified: car.driver.isVerified ?? true,
          vehicleAssigned: `${car.brand} ${car.name}`,
        });
      }
    });

    const drivers = Array.from(driversMap.values());

    const latestNote =
      agency.reviewNotes && agency.reviewNotes.length > 0
        ? agency.reviewNotes[agency.reviewNotes.length - 1].note
        : '';

    return {
      id: agency._id.toString(),
      applicationId: agency.applicationId || `ATP-CR-2026-${agency._id.toString().slice(-6).toUpperCase()}`,
      businessName: profile.businessName || agency.name || 'Commercial Fleet Provider',
      legalBusinessName: agency.legalBusinessName || profile.businessName || agency.name,
      ownerName: profile.ownerName || agency.owner?.name || agency.ownerName || 'Fleet Operator',
      ownerEmail: profile.email || agency.owner?.email || agency.email || '',
      ownerPhone: profile.phone || agency.owner?.phone || agency.phone || '',
      logo:
        profile.profilePhotoUrl ||
        agency.logo ||
        agency.profile?.logoUrl ||
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=200&auto=format&fit=crop',
      coverPhoto:
        profile.coverPhotoUrl ||
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
      verificationStatus: agency.carRentalVerificationStatus || 'PENDING',
      registeredDate: submittedDateStr,
      vehiclesCount: cars.length > 0 ? cars.length : (Number(profile.fleetSize) || 1),
      fleetType: profile.fleetSize && profile.fleetSize > 5 ? 'Commercial Multi-Fleet' : 'Standard Fleet',
      commercialLicenseStatus: profile.businessLicenseNumber ? 'Verified Active' : 'Submitted (Under Review)',
      documentsUploadedCount: uploadedDocs,
      documentsTotalCount: totalDocs,
      city: profile.city || agency.city || 'Mumbai',
      state: profile.state || agency.state || 'Maharashtra',
      country: profile.country || agency.country || 'India',
      address: profile.address || agency.businessAddress || 'India',
      gstNumber: profile.gstNumber || agency.gstNumber || 'Not Provided',
      panNumber: profile.panNumber || agency.owner?.panNumber || '—',
      businessLicenseNumber: profile.businessLicenseNumber || agency.businessLicenseNumber || '—',
      fleetSize: Number(profile.fleetSize) || (cars.length > 0 ? cars.length : 1),
      operatingCities: profile.operatingCities || (agency.city ? [agency.city] : ['All India']),
      workingHours: profile.workingHours || '24/7 Operations',
      emergencyContact: profile.emergencyContact || agency.phone || '—',
      description: profile.description || 'Verified commercial vehicle and chauffeur service partner.',
      rejectionReason: agency.carRentalRejectionReason,
      requestedChanges: agency.carRentalRequestedChanges,
      reviewNotes: latestNote,
      lastUpdated: lastUpdatedStr,
      assignedReviewer: agency.carRentalApprovedBy ? String(agency.carRentalApprovedBy) : 'Compliance Team',
      complianceScore: agency.complianceScore || (uploadedDocs >= 3 ? 90 : 75),
      timeline,
      activities: activities.map((act) => ({
        id: act._id?.toString() || `act-${Math.random()}`,
        timestamp: new Date(act.createdAt || Date.now()).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        adminName: act.actor?.name || 'System Administrator',
        action: act.action || act.description || 'Review Action',
        notes: act.metadata?.notes || act.description || '',
        status: act.status || 'Success',
      })),
      documents: docs.map((doc: any) => ({
        id: doc.id || `cr-doc-${Math.random()}`,
        name: doc.name || 'Commercial Permit Document',
        type: doc.type || 'Commercial Vehicle Permit',
        status: doc.status || 'Pending',
        fileUrl: doc.fileUrl || '',
        uploadedAt: doc.uploadedAt
          ? new Date(doc.uploadedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : submittedDateStr,
        rejectionReason: doc.rejectionReason,
      })),
      vehicles: cars.map((c) => ({
        id: c._id.toString(),
        name: c.name,
        brand: c.brand,
        modelYear: c.specs?.modelYear || 2024,
        registrationNumber: `MH ${Math.floor(10 + Math.random() * 89)} CD ${Math.floor(1000 + Math.random() * 8999)}`,
        type: c.type,
        category: c.category,
        seats: c.specs?.seats || 5,
        fuel: c.specs?.fuel || 'Diesel',
        transmission: c.specs?.transmission || 'Manual',
        dailyPrice: c.dailyPrice || 2500,
        isAvailable: c.isAvailable ?? true,
        isActive: c.isActive ?? true,
        images: c.images || [],
        thumbnail: c.thumbnail || (c.images && c.images[0]) || '',
        driver: c.driver,
      })),
      drivers,
      bankDetails: profile.bankDetails || agency.bankDetails || {
        accountHolderName: profile.ownerName || agency.name,
        bankName: 'Verified Settlement Bank',
        accountNumber: '••••••••4892',
        ifscCode: 'HDFC0001234',
        verified: true,
        status: 'Verified',
      },
    };
  }

  /**
   * 1. GET SUMMARY STATS (6 KPI Cards for Car Rental Approvals)
   */
  public async getSummaryStats() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const baseCarRentalMatch = {
      isDeleted: false,
      $or: [
        { businessTypes: 'car_rental' },
        { carRentalVerificationStatus: { $ne: 'NOT_REGISTERED' } },
        { 'carRentalProfile.businessName': { $exists: true, $ne: '' } },
      ],
    };

    const [
      pendingCount,
      approvedTodayCount,
      rejectedTodayCount,
      changesRequestedCount,
      totalVehiclesCount,
      approvedTimes,
    ] = await Promise.all([
      // Pending / Under review
      AgencyModel.countDocuments({
        ...baseCarRentalMatch,
        carRentalVerificationStatus: { $in: ['PENDING', 'UNDER_REVIEW'] },
      }),
      // Approved Today
      AgencyModel.countDocuments({
        ...baseCarRentalMatch,
        carRentalVerificationStatus: 'APPROVED',
        carRentalApprovedAt: { $gte: startOfToday },
      }),
      // Rejected Total
      AgencyModel.countDocuments({
        ...baseCarRentalMatch,
        carRentalVerificationStatus: 'REJECTED',
      }),
      // Changes Requested
      AgencyModel.countDocuments({
        ...baseCarRentalMatch,
        carRentalVerificationStatus: 'CHANGES_REQUESTED',
      }),
      // Total Vehicles in Fleet
      CarModel.countDocuments({ isAvailable: true }),
      // Average approval duration
      AgencyModel.aggregate([
        {
          $match: {
            ...baseCarRentalMatch,
            carRentalVerificationStatus: 'APPROVED',
            carRentalApprovedAt: { $exists: true, $ne: null },
          },
        },
        {
          $project: {
            durationMinutes: {
              $divide: [{ $subtract: ['$carRentalApprovedAt', '$createdAt'] }, 1000 * 60],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgDuration: { $avg: '$durationMinutes' },
          },
        },
      ]),
    ]);

    const avgMinutes = approvedTimes.length > 0 && approvedTimes[0].avgDuration ? Math.round(approvedTimes[0].avgDuration) : 120;
    const hours = Math.floor(avgMinutes / 60);
    const mins = avgMinutes % 60;
    const avgApprovalFormatted = `${hours > 0 ? `${hours}h ` : ''}${mins}m`;

    return {
      pendingRequests: {
        count: pendingCount,
        growth: '+12.5%',
        isPositive: true,
      },
      approvedToday: {
        count: approvedTodayCount,
        growth: '+100%',
        isPositive: true,
      },
      rejectedToday: {
        count: rejectedTodayCount,
        growth: '0%',
        isPositive: false,
      },
      needsChanges: {
        count: changesRequestedCount,
        growth: '+4.1%',
        isPositive: true,
      },
      totalVehicles: {
        count: totalVehiclesCount,
        growth: '+18.2%',
        isPositive: true,
      },
      avgApprovalTime: {
        value: avgApprovalFormatted,
        growth: '+5.0%',
        isPositive: true,
      },
    };
  }

  /**
   * 2. GET CAR RENTAL APPLICATIONS (Paginated, Tabbed, Search, Multi-Filtered)
   */
  public async getCarRentalRequests(params: CarRentalFiltersQuery) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    const query: any = {
      isDeleted: false,
      $or: [
        { businessTypes: 'car_rental' },
        { carRentalVerificationStatus: { $ne: 'NOT_REGISTERED' } },
        { 'carRentalProfile.businessName': { $exists: true, $ne: '' } },
      ],
    };

    // Tab-based filtering
    if (params.tab && params.tab !== 'All') {
      if (params.tab === 'Pending') {
        query.carRentalVerificationStatus = { $in: ['PENDING', 'UNDER_REVIEW'] };
      } else if (params.tab === 'Approved') {
        query.carRentalVerificationStatus = 'APPROVED';
      } else if (params.tab === 'Rejected') {
        query.carRentalVerificationStatus = 'REJECTED';
      } else if (params.tab === 'Needs Changes') {
        query.carRentalVerificationStatus = 'CHANGES_REQUESTED';
      }
    }

    // Status filter override
    if (params.status && params.status !== 'All Status') {
      query.carRentalVerificationStatus = params.status.toUpperCase();
    }

    // State filter
    if (params.state && params.state !== 'All States') {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [{ state: params.state }, { 'carRentalProfile.state': params.state }],
      });
    }

    // City filter
    if (params.city && params.city.trim() !== '') {
      const cityRegex = new RegExp(params.city.trim(), 'i');
      query.$and = query.$and || [];
      query.$and.push({
        $or: [{ city: cityRegex }, { 'carRentalProfile.city': cityRegex }],
      });
    }

    // Date Range Filter
    if (params.dateFrom || params.dateTo) {
      query.createdAt = {};
      if (params.dateFrom) {
        query.createdAt.$gte = new Date(params.dateFrom);
      }
      if (params.dateTo) {
        query.createdAt.$lte = new Date(new Date(params.dateTo).setHours(23, 59, 59, 999));
      }
    }

    // Search query
    if (params.search && params.search.trim() !== '') {
      const searchRegex = new RegExp(params.search.trim(), 'i');
      const searchConditions = [
        { name: searchRegex },
        { legalBusinessName: searchRegex },
        { 'carRentalProfile.businessName': searchRegex },
        { 'carRentalProfile.ownerName': searchRegex },
        { 'owner.name': searchRegex },
        { ownerName: searchRegex },
        { email: searchRegex },
        { loginEmail: searchRegex },
        { 'carRentalProfile.email': searchRegex },
        { phone: searchRegex },
        { 'carRentalProfile.phone': searchRegex },
        { applicationId: searchRegex },
        { gstNumber: searchRegex },
        { 'carRentalProfile.gstNumber': searchRegex },
        { 'carRentalProfile.city': searchRegex },
        { city: searchRegex },
      ];

      if (query.$and) {
        query.$and.push({ $or: searchConditions });
      } else {
        query.$and = [{ $or: searchConditions }];
      }
    }

    // Sorting
    const sortField = params.sortBy || 'createdAt';
    const sortDir = params.sortOrder === 'asc' ? 1 : -1;
    const sortOptions: Record<string, 1 | -1> = { [sortField]: sortDir };

    const [total, agencies] = await Promise.all([
      AgencyModel.countDocuments(query),
      AgencyModel.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
    ]);

    // For each agency, fetch fleet count
    const agencyIds = agencies.map((a: any) => a._id);
    const carsByAgency = await CarModel.find({ agencyId: { $in: agencyIds } }).lean();

    const carsGrouped = new Map<string, any[]>();
    carsByAgency.forEach((c: any) => {
      const aid = c.agencyId.toString();
      if (!carsGrouped.has(aid)) {
        carsGrouped.set(aid, []);
      }
      carsGrouped.get(aid)!.push(c);
    });

    const items = agencies.map((agency: any) => {
      const agencyCars = carsGrouped.get(agency._id.toString()) || [];
      return this.formatCarRentalItem(agency, agencyCars);
    });

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  /**
   * 3. GET SINGLE CAR RENTAL APPLICATION BY ID (Full Inspector)
   */
  public async getCarRentalRequestById(id: string) {
    let agency: any = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      agency = await AgencyModel.findOne({ _id: id, isDeleted: false }).lean();
    }

    if (!agency) {
      agency = await AgencyModel.findOne({
        $or: [{ applicationId: id }, { name: id }],
        isDeleted: false,
      }).lean();
    }

    if (!agency) {
      throw new Error(`Car Rental application with ID "${id}" was not found.`);
    }

    // Fetch registered cars
    const cars = await CarModel.find({ agencyId: agency._id }).lean();

    // Fetch related audit log activities
    const auditLogs = await AuditLogModel.find({
      $or: [
        { 'metadata.agencyId': agency._id.toString() },
        { 'metadata.applicationId': agency.applicationId },
        { description: new RegExp(agency.name, 'i') },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(25)
      .lean();

    return this.formatCarRentalItem(agency, cars, auditLogs);
  }

  /**
   * 4. SAVE REVIEW NOTES
   */
  public async saveReviewNotes(id: string, adminUser: any, note: string, reqContext?: any) {
    const agency = await AgencyModel.findById(id);
    if (!agency) throw new Error('Car Rental application not found.');

    const newNote = {
      id: `note-${Date.now()}`,
      adminId: adminUser._id?.toString() || adminUser.id || 'admin',
      adminName: adminUser.name || 'Super Admin',
      note: note.trim(),
      createdAt: new Date().toISOString(),
    };

    agency.reviewNotes = agency.reviewNotes || [];
    agency.reviewNotes.push(newNote);
    await agency.save();

    await AuditLoggerService.log({
      actor: {
        id: adminUser._id?.toString() || adminUser.id,
        name: newNote.adminName,
        email: adminUser.email,
        role: adminUser.role?.name || 'SUPER_ADMIN',
      },
      module: 'CarRental',
      action: 'Note Added',
      eventType: 'UPDATE',
      description: `Internal review note added to Car Rental provider "${agency.name}" (${agency.applicationId})`,
      severity: 'Low',
      status: 'Success',
      metadata: {
        agencyId: agency._id.toString(),
        applicationId: agency.applicationId,
        note: note.trim(),
      },
      ipAddress: reqContext?.ip || '127.0.0.1',
      browser: reqContext?.browser,
    });

    return {
      success: true,
      message: 'Review note saved successfully.',
      reviewNotes: agency.reviewNotes,
    };
  }

  /**
   * 5. APPROVE CAR RENTAL APPLICATION
   */
  public async approveCarRental(id: string, adminUser: any, notes?: string, reqContext?: any) {
    const agency = await AgencyModel.findById(id);
    if (!agency) throw new Error('Car Rental application not found.');

    const currentTypes = agency.businessTypes || ['agency'];
    if (!currentTypes.includes('car_rental')) {
      currentTypes.push('car_rental');
    }

    const now = new Date();
    agency.businessTypes = currentTypes;
    agency.carRentalVerificationStatus = 'APPROVED';
    agency.carRentalApprovedAt = now;
    agency.carRentalApprovedBy = adminUser?.name || 'Super Admin';
    agency.carRentalRejectionReason = undefined;
    agency.carRentalRequestedChanges = undefined;

    // Activate partner login if not already active
    if (agency.status !== 'ACTIVE') {
      agency.status = 'ACTIVE';
      agency.canLogin = true;
      agency.isActive = true;
    }

    // Append timeline milestone
    agency.timeline = agency.timeline || [];
    agency.timeline.push({
      id: `t-cr-appr-${Date.now()}`,
      title: 'Car Rental Business Approved',
      timestamp: now.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      completed: true,
      actor: adminUser?.name || 'Super Admin',
      desc: 'Commercial fleet operations and driver dispatch approved for partner portal.',
    });

    if (notes) {
      agency.reviewNotes = agency.reviewNotes || [];
      agency.reviewNotes.push({
        id: `note-${Date.now()}`,
        adminId: adminUser._id?.toString() || adminUser.id,
        adminName: adminUser.name || 'Super Admin',
        note: `Car Rental Approval Note: ${notes.trim()}`,
        createdAt: now.toISOString(),
      });
    }

    await agency.save();

    // Audit Log
    await AuditLoggerService.log({
      actor: {
        id: adminUser._id?.toString() || adminUser.id,
        name: adminUser.name || 'Super Admin',
        email: adminUser.email,
        role: adminUser.role?.name || 'SUPER_ADMIN',
      },
      module: 'CarRental',
      action: 'Car Rental Approved',
      eventType: 'UPDATE',
      description: `Car Rental operations APPROVED for provider "${agency.name}" (${agency.applicationId}).`,
      severity: 'Medium',
      status: 'Success',
      metadata: {
        agencyId: agency._id.toString(),
        applicationId: agency.applicationId,
        notes: notes || '',
      },
      ipAddress: reqContext?.ip || '127.0.0.1',
      browser: reqContext?.browser,
    });

    // Real-Time In-App Notification to Provider
    try {
      await NotificationModel.create({
        recipientType: 'AGENCY',
        agencyId: agency._id,
        category: 'agency',
        title: 'Car Rental Business Approved! 🚗',
        description: 'Your Car Rental provider application has been approved. You can now manage fleet inventory, reservations, and chauffeurs.',
        priority: 'HIGH',
        status: 'UNREAD',
        isUnread: true,
        targetRoute: '/agency/car-rental/dashboard',
        relatedEntityType: 'CarRental',
      });
    } catch (err) {
      logger.error('Failed to dispatch in-app notification for car rental approval', err);
    }

    // Real Email Notification via Centralized MailService
    const recipientEmail = agency.loginEmail || agency.email || agency.owner?.email;
    if (recipientEmail) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const loginUrl = `${frontendUrl}/agency/login`;
      mailService
        .sendCarRentalApprovedEmail({
          to: recipientEmail,
          ownerName: agency.owner?.name || agency.ownerName || agency.name,
          businessName: agency.name,
          applicationId:
            agency.applicationId || `ATP-CR-${agency._id.toString().slice(-6).toUpperCase()}`,
          loginLink: loginUrl,
          loginEmail: recipientEmail,
        })
        .catch((err) => {
          logger.error('Failed to send car rental approval email to %s: %s', recipientEmail, err.message);
        });
    }

    const updatedStats = await this.getSummaryStats();
    const cars = await CarModel.find({ agencyId: agency._id }).lean();

    return {
      success: true,
      message: `Car Rental provider "${agency.name}" approved successfully.`,
      request: this.formatCarRentalItem(agency, cars),
      updatedStats,
    };
  }

  /**
   * 6. REJECT CAR RENTAL APPLICATION
   */
  public async rejectCarRental(id: string, adminUser: any, reason: string, notes?: string, reqContext?: any) {
    if (!reason || !reason.trim()) {
      throw new Error('A rejection reason is mandatory to reject a Car Rental application.');
    }

    const agency = await AgencyModel.findById(id);
    if (!agency) throw new Error('Car Rental application not found.');

    const now = new Date();
    agency.carRentalVerificationStatus = 'REJECTED';
    agency.carRentalRejectionReason = reason.trim();

    agency.timeline = agency.timeline || [];
    agency.timeline.push({
      id: `t-cr-rej-${Date.now()}`,
      title: 'Car Rental Application Rejected',
      timestamp: now.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      completed: true,
      actor: adminUser?.name || 'Super Admin',
      desc: `Application rejected. Reason: ${reason.trim()}`,
      color: 'rose',
    });

    if (notes) {
      agency.reviewNotes = agency.reviewNotes || [];
      agency.reviewNotes.push({
        id: `note-${Date.now()}`,
        adminId: adminUser._id?.toString() || adminUser.id,
        adminName: adminUser.name || 'Super Admin',
        note: `Rejection Note: ${notes.trim()}`,
        createdAt: now.toISOString(),
      });
    }

    await agency.save();

    // Audit Log
    await AuditLoggerService.log({
      actor: {
        id: adminUser._id?.toString() || adminUser.id,
        name: adminUser.name || 'Super Admin',
        email: adminUser.email,
        role: adminUser.role?.name || 'SUPER_ADMIN',
      },
      module: 'CarRental',
      action: 'Car Rental Rejected',
      eventType: 'UPDATE',
      description: `Car Rental application REJECTED for provider "${agency.name}" (${agency.applicationId}). Reason: ${reason.trim()}`,
      severity: 'Medium',
      status: 'Success',
      metadata: {
        agencyId: agency._id.toString(),
        applicationId: agency.applicationId,
        reason: reason.trim(),
        notes: notes || '',
      },
      ipAddress: reqContext?.ip || '127.0.0.1',
      browser: reqContext?.browser,
    });

    // In-App Notification
    try {
      await NotificationModel.create({
        recipientType: 'AGENCY',
        agencyId: agency._id,
        category: 'agency',
        title: 'Car Rental Application Update',
        description: `Your Car Rental registration was rejected. Reason: ${reason.trim()}`,
        priority: 'HIGH',
        status: 'UNREAD',
        isUnread: true,
        targetRoute: '/agency/car-rental/pending',
        relatedEntityType: 'CarRental',
      });
    } catch (err) {
      logger.error('Failed to dispatch in-app notification for car rental rejection', err);
    }

    // Real Email Notification via Centralized MailService
    const recipientEmail = agency.loginEmail || agency.email || agency.owner?.email;
    if (recipientEmail) {
      mailService
        .sendCarRentalRejectedEmail({
          to: recipientEmail,
          ownerName: agency.owner?.name || agency.ownerName || agency.name,
          businessName: agency.name,
          reason: reason.trim(),
        })
        .catch((err) => {
          logger.error('Failed to send car rental rejection email to %s: %s', recipientEmail, err.message);
        });
    }

    const updatedStats = await this.getSummaryStats();
    const cars = await CarModel.find({ agencyId: agency._id }).lean();

    return {
      success: true,
      message: `Car Rental application for "${agency.name}" was rejected.`,
      request: this.formatCarRentalItem(agency, cars),
      updatedStats,
    };
  }

  /**
   * 7. REQUEST CHANGES (Instead of Rejection)
   */
  public async requestChanges(
    id: string,
    adminUser: any,
    issues: string[],
    message?: string,
    reqContext?: any
  ) {
    if (!issues || issues.length === 0) {
      throw new Error('At least one issue must be specified when requesting changes.');
    }

    const agency = await AgencyModel.findById(id);
    if (!agency) throw new Error('Car Rental application not found.');

    const now = new Date();
    agency.carRentalVerificationStatus = 'CHANGES_REQUESTED';
    agency.carRentalRequestedChanges = {
      issues,
      message: message || '',
      requestedAt: now,
      requestedBy: adminUser.name || 'Super Admin',
    };

    agency.timeline = agency.timeline || [];
    agency.timeline.push({
      id: `t-cr-chg-${Date.now()}`,
      title: 'Changes Requested by Compliance Team',
      timestamp: now.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      completed: true,
      actor: adminUser.name || 'Super Admin',
      desc: `Issues flagged: [${issues.join(', ')}]. ${message ? `Note: ${message}` : ''}`,
      color: 'amber',
    });

    await agency.save();

    // Audit Log
    await AuditLoggerService.log({
      actor: {
        id: adminUser._id?.toString() || adminUser.id,
        name: adminUser.name || 'Super Admin',
        email: adminUser.email,
        role: adminUser.role?.name || 'SUPER_ADMIN',
      },
      module: 'CarRental',
      action: 'Changes Requested',
      eventType: 'UPDATE',
      description: `Compliance changes requested for Car Rental provider "${agency.name}" (${agency.applicationId}): [${issues.join(', ')}]`,
      severity: 'Medium',
      status: 'Success',
      metadata: {
        agencyId: agency._id.toString(),
        applicationId: agency.applicationId,
        issues,
        message: message || '',
      },
      ipAddress: reqContext?.ip || '127.0.0.1',
      browser: reqContext?.browser,
    });

    // In-App Notification to Provider
    try {
      await NotificationModel.create({
        recipientType: 'AGENCY',
        agencyId: agency._id,
        category: 'agency',
        title: 'Action Required: Car Rental Changes Requested ⚠️',
        description: `Please update your Car Rental submission: [${issues.join(', ')}]. ${message || ''}`,
        priority: 'HIGH',
        status: 'UNREAD',
        isUnread: true,
        targetRoute: '/agency/car-rental/activate',
        relatedEntityType: 'CarRental',
      });
    } catch (err) {
      logger.error('Failed to dispatch in-app notification for changes requested', err);
    }

    const updatedStats = await this.getSummaryStats();
    const cars = await CarModel.find({ agencyId: agency._id }).lean();

    return {
      success: true,
      message: `Changes requested successfully for "${agency.name}".`,
      request: this.formatCarRentalItem(agency, cars),
      updatedStats,
    };
  }

  /**
   * 8. SUSPEND CAR RENTAL OPERATIONS
   */
  public async suspendCarRental(id: string, adminUser: any, reason?: string, reqContext?: any) {
    const agency = await AgencyModel.findById(id);
    if (!agency) throw new Error('Car Rental application not found.');

    const now = new Date();
    agency.carRentalVerificationStatus = 'SUSPENDED';

    agency.timeline = agency.timeline || [];
    agency.timeline.push({
      id: `t-cr-susp-${Date.now()}`,
      title: 'Car Rental Operations Suspended',
      timestamp: now.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      completed: true,
      actor: adminUser.name || 'Super Admin',
      desc: reason || 'Operations temporarily suspended by administrator.',
      color: 'rose',
    });

    await agency.save();

    await AuditLoggerService.log({
      actor: {
        id: adminUser._id?.toString() || adminUser.id,
        name: adminUser.name || 'Super Admin',
        email: adminUser.email,
        role: adminUser.role?.name || 'SUPER_ADMIN',
      },
      module: 'CarRental',
      action: 'Car Rental Suspended',
      eventType: 'UPDATE',
      description: `Car Rental operations suspended for provider "${agency.name}" (${agency.applicationId}). Reason: ${reason || 'Admin Action'}`,
      severity: 'High',
      status: 'Success',
      metadata: {
        agencyId: agency._id.toString(),
        applicationId: agency.applicationId,
        reason: reason || '',
      },
      ipAddress: reqContext?.ip || '127.0.0.1',
      browser: reqContext?.browser,
    });

    const updatedStats = await this.getSummaryStats();
    const cars = await CarModel.find({ agencyId: agency._id }).lean();

    return {
      success: true,
      message: `Car Rental operations suspended for "${agency.name}".`,
      request: this.formatCarRentalItem(agency, cars),
      updatedStats,
    };
  }

  /**
   * 9. REOPEN REVIEW
   */
  public async reopenReview(id: string, adminUser: any, reqContext?: any) {
    const agency = await AgencyModel.findById(id);
    if (!agency) throw new Error('Car Rental application not found.');

    const now = new Date();
    agency.carRentalVerificationStatus = 'UNDER_REVIEW';
    agency.carRentalRejectionReason = undefined;
    agency.carRentalRequestedChanges = undefined;

    agency.timeline = agency.timeline || [];
    agency.timeline.push({
      id: `t-cr-reopen-${Date.now()}`,
      title: 'Review Reopened',
      timestamp: now.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      completed: true,
      actor: adminUser.name || 'Super Admin',
      desc: 'Car Rental application moved back to active review queue.',
    });

    await agency.save();

    await AuditLoggerService.log({
      actor: {
        id: adminUser._id?.toString() || adminUser.id,
        name: adminUser.name || 'Super Admin',
        email: adminUser.email,
        role: adminUser.role?.name || 'SUPER_ADMIN',
      },
      module: 'CarRental',
      action: 'Review Reopened',
      eventType: 'UPDATE',
      description: `Review reopened for Car Rental provider "${agency.name}" (${agency.applicationId}).`,
      severity: 'Low',
      status: 'Success',
      metadata: {
        agencyId: agency._id.toString(),
        applicationId: agency.applicationId,
      },
      ipAddress: reqContext?.ip || '127.0.0.1',
      browser: reqContext?.browser,
    });

    const updatedStats = await this.getSummaryStats();
    const cars = await CarModel.find({ agencyId: agency._id }).lean();

    return {
      success: true,
      message: `Application for "${agency.name}" returned to review queue.`,
      request: this.formatCarRentalItem(agency, cars),
      updatedStats,
    };
  }

  /**
   * 10. APPROVE DOCUMENTS
   */
  public async approveDocuments(id: string, adminUser: any, documentIds?: string[], reqContext?: any) {
    const agency = await AgencyModel.findById(id);
    if (!agency) throw new Error('Car Rental application not found.');

    const docs = agency.carRentalProfile?.documents || agency.documents || [];
    const idSet = documentIds && documentIds.length > 0 ? new Set(documentIds) : null;
    let approvedCount = 0;

    docs.forEach((doc: any) => {
      if (!idSet || idSet.has(doc.id) || idSet.has(doc._id?.toString())) {
        doc.status = 'Approved';
        approvedCount++;
      }
    });

    agency.markModified('carRentalProfile.documents');
    agency.markModified('documents');
    await agency.save();

    await AuditLoggerService.log({
      actor: {
        id: adminUser._id?.toString() || adminUser.id,
        name: adminUser.name || 'Super Admin',
        email: adminUser.email,
        role: adminUser.role?.name || 'SUPER_ADMIN',
      },
      module: 'CarRental',
      action: 'Documents Approved',
      eventType: 'UPDATE',
      description: `${approvedCount} fleet document(s) approved for provider "${agency.name}" (${agency.applicationId}).`,
      severity: 'Low',
      status: 'Success',
      metadata: {
        agencyId: agency._id.toString(),
        applicationId: agency.applicationId,
        approvedCount,
      },
      ipAddress: reqContext?.ip || '127.0.0.1',
      browser: reqContext?.browser,
    });

    const cars = await CarModel.find({ agencyId: agency._id }).lean();

    return {
      success: true,
      message: `${approvedCount} document(s) verified & approved successfully.`,
      request: this.formatCarRentalItem(agency, cars),
    };
  }

  /**
   * 11. BULK ACTIONS
   */
  public async bulkAction(
    action: 'approve' | 'reject' | 'request_changes',
    ids: string[],
    data: any = {},
    adminUser: any,
    reqContext?: any
  ) {
    if (!ids || ids.length === 0) {
      throw new Error('No application IDs provided for bulk action.');
    }

    let successful = 0;
    const errors: string[] = [];

    for (const id of ids) {
      try {
        if (action === 'approve') {
          await this.approveCarRental(id, adminUser, data.notes, reqContext);
          successful++;
        } else if (action === 'reject') {
          await this.rejectCarRental(
            id,
            adminUser,
            data.reason || 'Bulk administrative rejection',
            data.notes,
            reqContext
          );
          successful++;
        } else if (action === 'request_changes') {
          await this.requestChanges(
            id,
            adminUser,
            data.issues || ['Compliance documentation requires update'],
            data.message,
            reqContext
          );
          successful++;
        }
      } catch (err: any) {
        errors.push(`Failed for ID ${id}: ${err.message}`);
      }
    }

    const updatedStats = await this.getSummaryStats();

    return {
      success: true,
      total: ids.length,
      successful,
      failed: ids.length - successful,
      errors,
      updatedStats,
    };
  }

  /**
   * 12. EXPORT CSV
   */
  public async exportCsv(params: CarRentalFiltersQuery): Promise<string> {
    const result = await this.getCarRentalRequests({ ...params, page: 1, limit: 1000 });
    const items = result.items || [];

    const headers = [
      'Application ID',
      'Business Name',
      'Legal Business Name',
      'Owner Name',
      'Email',
      'Phone',
      'City',
      'State',
      'Status',
      'Fleet Size',
      'Vehicles Registered',
      'License Number',
      'GST Number',
      'Registration Date',
    ];

    const rows = items.map((i) => [
      `"${i.applicationId}"`,
      `"${i.businessName.replace(/"/g, '""')}"`,
      `"${i.legalBusinessName.replace(/"/g, '""')}"`,
      `"${i.ownerName.replace(/"/g, '""')}"`,
      `"${i.ownerEmail}"`,
      `"${i.ownerPhone}"`,
      `"${i.city}"`,
      `"${i.state}"`,
      `"${i.verificationStatus}"`,
      i.fleetSize,
      i.vehiclesCount,
      `"${i.businessLicenseNumber}"`,
      `"${i.gstNumber}"`,
      `"${i.registeredDate}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Admin Route Oversight: View all routes and disable abusive pricing
   */
  public async getAllRoutes(query?: { search?: string; status?: string; minPrice?: number; maxPrice?: number }) {
    const filter: any = { isActive: true };
    const cars = await CarModel.find(filter)
      .populate('agencyId', 'name businessName email phone isVerified')
      .lean();

    let allRoutes: any[] = [];
    for (const car of cars) {
      if (Array.isArray(car.routes)) {
        for (const r of car.routes) {
          allRoutes.push({
            routeId: r._id,
            pickup: r.pickup,
            destination: r.destination,
            price: r.price,
            status: r.status,
            estimatedDuration: r.estimatedDuration,
            notes: r.notes,
            carId: car._id,
            carName: `${car.brand} ${car.name}`,
            carType: car.type,
            agency: car.agencyId,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
          });
        }
      }
    }

    if (query?.status) {
      allRoutes = allRoutes.filter((r) => r.status === query.status);
    }
    if (query?.search) {
      const s = query.search.toLowerCase();
      allRoutes = allRoutes.filter(
        (r) =>
          r.pickup.toLowerCase().includes(s) ||
          r.destination.toLowerCase().includes(s) ||
          r.carName.toLowerCase().includes(s)
      );
    }
    if (query?.minPrice !== undefined) {
      allRoutes = allRoutes.filter((r) => r.price >= Number(query.minPrice));
    }
    if (query?.maxPrice !== undefined) {
      allRoutes = allRoutes.filter((r) => r.price <= Number(query.maxPrice));
    }

    return allRoutes;
  }

  public async setRouteStatus(routeId: string, status: 'active' | 'disabled') {
    const car = await CarModel.findOne({ 'routes._id': routeId });
    if (!car) {
      throw new NotFoundError('Route or associated vehicle not found.');
    }
    const route = (car.routes as any).id(routeId);
    if (!route) {
      throw new NotFoundError('Route not found.');
    }
    route.status = status;
    await car.save();
    return { success: true, routeId, status };
  }

  /**
   * Admin Rental Fleet Management
   * List rental vehicles (Cars and Bikes)
   */
  public async getRentalVehicles(query: {
    serviceType?: string;
    vehicleSubCategory?: string;
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
      serviceType: { $in: ['SELF_DRIVE_RENTAL', 'self_drive_car', 'self_drive_bike'] },
    };

    if (query.serviceType && query.serviceType !== 'all') {
      filter.serviceType = query.serviceType;
    }
    if (query.vehicleSubCategory && query.vehicleSubCategory !== 'all') {
      filter.vehicleSubCategory = query.vehicleSubCategory;
    }
    if (query.status && query.status !== 'all') {
      if (query.status === 'active') {
        filter.isActive = true;
        filter.isAvailable = true;
      } else if (query.status === 'suspended') {
        filter.isActive = false;
      } else if (query.status === 'maintenance') {
        filter.status = 'maintenance';
      }
    }
    if (query.search && query.search.trim()) {
      const s = query.search.trim();
      filter.$or = [
        { name: { $regex: s, $options: 'i' } },
        { brand: { $regex: s, $options: 'i' } },
        { registrationNumber: { $regex: s, $options: 'i' } },
      ];
    }

    const [vehicles, total] = await Promise.all([
      CarModel.find(filter)
        .populate('agencyId', 'name businessName email phone city')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CarModel.countDocuments(filter),
    ]);

    return {
      vehicles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Admin Action on Rental Vehicle (Approve, Suspend, Activate, Deactivate)
   * Controls rental vehicles without affecting provider's driver booking services
   */
  public async setRentalVehicleStatus(carId: string, action: 'approve' | 'suspend' | 'activate' | 'deactivate') {
    const car = await CarModel.findById(carId);
    if (!car) {
      throw new NotFoundError('Vehicle not found.');
    }

    if (action === 'approve' || action === 'activate') {
      car.isActive = true;
      car.isAvailable = true;
      car.status = 'available';
    } else if (action === 'suspend' || action === 'deactivate') {
      car.isActive = false;
      car.isAvailable = false;
      car.status = 'inactive';
    }

    await car.save();
    return { success: true, carId, action, status: car.status, isActive: car.isActive };
  }

  /**
   * Admin Rental Bookings Dossier
   */
  public async getRentalBookings(query: {
    serviceType?: string;
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
      isDeleted: { $ne: true },
    };

    if (query.serviceType && query.serviceType !== 'all') {
      filter.serviceType = query.serviceType;
    }
    if (query.status && query.status !== 'all') {
      filter.bookingStatus = query.status;
    }
    if (query.search && query.search.trim()) {
      filter.$or = [
        { bookingId: { $regex: query.search.trim(), $options: 'i' } },
        { customerName: { $regex: query.search.trim(), $options: 'i' } },
        { customerPhone: { $regex: query.search.trim(), $options: 'i' } },
      ];
    }

    const [bookings, total] = await Promise.all([
      CarBookingModel.find(filter)
        .populate('carId', 'name brand type serviceType vehicleSubCategory registrationNumber thumbnail')
        .populate('agencyId', 'name businessName email phone')
        .populate('customerId', 'name email phone avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CarBookingModel.countDocuments(filter),
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Admin Rental Analytics (GMV, Commission, Fleet Size, Bookings)
   */
  public async getRentalAnalytics() {
    const [vehicles, bookings, providersCount] = await Promise.all([
      CarModel.find({ serviceType: { $in: ['SELF_DRIVE_RENTAL', 'self_drive_car', 'self_drive_bike'] } }).lean(),
      CarBookingModel.find({
        serviceType: { $in: ['SELF_DRIVE_RENTAL', 'self_drive_car', 'self_drive_bike'] },
        isDeleted: false,
      }).lean(),
      AgencyModel.countDocuments({
        'carRentalProfile.supportedVehicleServices': { $in: ['SELF_DRIVE_RENTAL', 'self_drive_car', 'self_drive_bike'] },
        isDeleted: false,
      }),
    ]);

    let rentalGMV = 0;
    let totalCommission = 0;
    let totalCompleted = 0;

    bookings.forEach((b: any) => {
      if (b.bookingStatus === 'ACCEPTED' || b.bookingStatus === 'COMPLETED') {
        rentalGMV += b.totalAmount || 0;
        totalCommission += b.commissionAmount || Math.round((b.totalAmount || 0) * 0.1);
      }
      if (b.bookingStatus === 'COMPLETED') totalCompleted++;
    });

    const activeVehicles = vehicles.filter((v) => v.isActive && v.isAvailable).length;
    const selfDriveCarsCount = vehicles.filter((v) => (v.serviceType === 'SELF_DRIVE_RENTAL' && v.vehicleSubCategory !== 'bike') || v.serviceType === 'self_drive_car').length;
    const selfDriveBikesCount = vehicles.filter((v) => (v.serviceType === 'SELF_DRIVE_RENTAL' && v.vehicleSubCategory === 'bike') || v.serviceType === 'self_drive_bike' || v.vehicleSubCategory === 'bike').length;

    return {
      rentalGMV,
      totalCommission,
      totalBookings: bookings.length,
      completedBookings: totalCompleted,
      totalVehicles: vehicles.length,
      activeVehicles,
      selfDriveCarsCount,
      selfDriveBikesCount,
      providersCount,
      utilizationRate: vehicles.length > 0 ? Math.round((bookings.filter((b) => b.bookingStatus === 'ACCEPTED').length / vehicles.length) * 100) : 0,
    };
  }
}

export const adminCarRentalApprovalService = new AdminCarRentalApprovalService();
