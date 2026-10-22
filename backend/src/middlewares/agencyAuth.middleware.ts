import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { TokenUtil, JwtTokenPayload } from '../utils/token.util.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.util.js';
import { AgencyModel, IAgency } from '../models/agency.model.js';
import { PartnerUserModel } from '../models/partnerUser.model.js';

// Extend Express Request type with authenticated agency context
declare global {
  namespace Express {
    interface Request {
      agency?: IAgency;
      agencyUser?: JwtTokenPayload;
    }
  }
}

/**
 * Middleware to authenticate and authorize verified Agency partners.
 * Extracts agency identity strictly from verified JWT token.
 * Prevents unauthorized access or access by pending/rejected/suspended agencies.
 */
export const authenticateAgency = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(
        new UnauthorizedError('Missing or invalid Authorization header. Expected: Bearer <token>')
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token || token.trim() === '') {
      return next(new UnauthorizedError('Access token is required.'));
    }

    let decoded: JwtTokenPayload;
    try {
      decoded = TokenUtil.verifyAccessToken(token);
    } catch (err: any) {
      return next(new UnauthorizedError(`Invalid or expired session token: ${err.message}`));
    }

    const agencyIdOrUserId = decoded.agencyId || decoded.userId;
    const email = decoded.email;

    let agency: IAgency | null = null;
    const businessIdHeader = (req.headers['x-business-id'] || req.headers['x-agency-id']) as string;
    if (businessIdHeader && mongoose.Types.ObjectId.isValid(businessIdHeader)) {
      const ownerConditions: any[] = [];
      if (decoded.agencyId && mongoose.Types.ObjectId.isValid(decoded.agencyId)) {
        ownerConditions.push({ _id: new mongoose.Types.ObjectId(decoded.agencyId) });
      }
      if (decoded.userId && mongoose.Types.ObjectId.isValid(decoded.userId)) {
        ownerConditions.push({ ownerId: new mongoose.Types.ObjectId(decoded.userId) });
      }
      if (ownerConditions.length > 0) {
        agency = await AgencyModel.findOne({
          _id: new mongoose.Types.ObjectId(businessIdHeader),
          $or: ownerConditions,
          isDeleted: false,
        });
      }
    }

    if (!agency && decoded.agencyId && mongoose.Types.ObjectId.isValid(decoded.agencyId)) {
      agency = await AgencyModel.findOne({ _id: new mongoose.Types.ObjectId(decoded.agencyId), isDeleted: false });
    }

    if (!agency && decoded.userId && mongoose.Types.ObjectId.isValid(decoded.userId)) {
      agency = await AgencyModel.findOne({
        $or: [
          { _id: new mongoose.Types.ObjectId(decoded.userId) },
          { ownerId: new mongoose.Types.ObjectId(decoded.userId) },
        ],
        isDeleted: false,
      });
    }

    if (!agency) {
      let partnerUser: any = null;
      if (decoded.userId && mongoose.Types.ObjectId.isValid(decoded.userId)) {
        partnerUser = await PartnerUserModel.findById(decoded.userId);
      }
      if (!partnerUser && decoded.email) {
        partnerUser = await PartnerUserModel.findOne({ email: decoded.email.toLowerCase().trim() });
      }
      if (partnerUser) {
        req.agencyUser = {
          ...decoded,
          userId: partnerUser._id.toString(),
          name: decoded.name || partnerUser.name,
          email: decoded.email || partnerUser.email,
          phone: decoded.phone || partnerUser.phone,
        };
        return next();
      }
      return next(new UnauthorizedError('Authenticated partner account not found. Please log in again.'));
    }

    // Attach token payload to Request context
    req.agencyUser = decoded;

    if (agency) {
      if (agency.status === 'SUSPENDED' || agency.onboardingStatus === 'SUSPENDED') {
        return next(
          new ForbiddenError('Your agency account has been suspended. Please contact Super Admin support.')
        );
      }

      // Invalidate JWT sessions issued prior to recent password resets
      if (agency.passwordChangedAt && decoded.iat) {
        const changedTimestamp = Math.floor(agency.passwordChangedAt.getTime() / 1000);
        if (decoded.iat < changedTimestamp) {
          return next(
            new UnauthorizedError('Password was recently changed. Please log in again with your new credentials.')
          );
        }
      }
      req.agency = agency;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware strictly protecting operational endpoints (bookings, packages, finance, fleet publish)
 * Locks access until registration fee is verified and status is APPROVED.
 */
export const requireApprovedAgency = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const agency = req.agency;
  if (!agency) {
    return next(new UnauthorizedError('Agency context not found.'));
  }

  const isApproved =
    agency.onboardingStatus === 'APPROVED' ||
    agency.verificationStatus === 'APPROVED' ||
    agency.verificationStatus === 'VERIFIED' ||
    agency.status === 'ACTIVE';

  if (!isApproved) {
    return next(
      new ForbiddenError(
        `Operational access locked. Current onboarding status: "${agency.onboardingStatus || agency.verificationStatus}". Registration fee and approval required.`
      )
    );
  }
  next();
};

/**
 * Optional authentication middleware for agency partner endpoints.
 * Populates req.agency and req.agencyUser if a valid Bearer token is provided,
 * but allows requests to proceed without error if unauthenticated.
 */
export const optionalAuthenticateAgency = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token || token.trim() === '') {
      return next();
    }

    let decoded: JwtTokenPayload;
    try {
      decoded = TokenUtil.verifyAccessToken(token);
    } catch {
      return next();
    }

    req.agencyUser = decoded;
    const agencyIdOrUserId = decoded.agencyId || decoded.userId;
    const email = decoded.email;

    let agency: IAgency | null = null;
    const businessIdHeader = req.headers['x-business-id'] as string;
    if (businessIdHeader && mongoose.Types.ObjectId.isValid(businessIdHeader)) {
      const ownerConditions: any[] = [];
      if (decoded.agencyId && mongoose.Types.ObjectId.isValid(decoded.agencyId)) {
        ownerConditions.push({ _id: new mongoose.Types.ObjectId(decoded.agencyId) });
      }
      if (decoded.userId && mongoose.Types.ObjectId.isValid(decoded.userId)) {
        ownerConditions.push({ ownerId: new mongoose.Types.ObjectId(decoded.userId) });
      }
      if (ownerConditions.length > 0) {
        agency = await AgencyModel.findOne({
          _id: new mongoose.Types.ObjectId(businessIdHeader),
          $or: ownerConditions,
          isDeleted: false,
        });
      }
    }

    if (!agency && decoded.agencyId && mongoose.Types.ObjectId.isValid(decoded.agencyId)) {
      agency = await AgencyModel.findOne({ _id: new mongoose.Types.ObjectId(decoded.agencyId), isDeleted: false });
    }

    if (!agency && decoded.userId && mongoose.Types.ObjectId.isValid(decoded.userId)) {
      agency = await AgencyModel.findOne({
        $or: [{ _id: new mongoose.Types.ObjectId(decoded.userId) }, { ownerId: new mongoose.Types.ObjectId(decoded.userId) }],
        isDeleted: false,
      });
    }

    if (agency && agency.status !== 'SUSPENDED' && agency.onboardingStatus !== 'SUSPENDED') {
      req.agency = agency;
    }

    next();
  } catch {
    next();
  }
};

/**
 * Middleware to authenticate SaaS Partner users.
 * Supports Partner users creating or managing Travel Agency or Car Rental businesses
 * without requiring an existing Travel Agency record.
 */
export const authenticatePartner = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(
        new UnauthorizedError('Missing or invalid Authorization header. Expected: Bearer <token>')
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token || token.trim() === '') {
      return next(new UnauthorizedError('Access token is required.'));
    }

    let decoded: JwtTokenPayload;
    try {
      decoded = TokenUtil.verifyAccessToken(token);
    } catch (err: any) {
      return next(new UnauthorizedError(`Invalid or expired session token: ${err.message}`));
    }

    let partnerUser: any = null;
    const partnerId = decoded.userId || decoded.partnerId;
    if (partnerId && mongoose.Types.ObjectId.isValid(partnerId)) {
      partnerUser = await PartnerUserModel.findById(partnerId);
    }
    if (!partnerUser && decoded.email) {
      partnerUser = await PartnerUserModel.findOne({ email: decoded.email.toLowerCase().trim() });
    }

    let agency: IAgency | null = null;
    const businessIdHeader = (req.headers['x-business-id'] || req.headers['x-agency-id']) as string;
    if (businessIdHeader && mongoose.Types.ObjectId.isValid(businessIdHeader)) {
      agency = await AgencyModel.findOne({ _id: new mongoose.Types.ObjectId(businessIdHeader), isDeleted: false });
    }
    if (!agency && decoded.agencyId && mongoose.Types.ObjectId.isValid(decoded.agencyId)) {
      agency = await AgencyModel.findOne({ _id: new mongoose.Types.ObjectId(decoded.agencyId), isDeleted: false });
    }
    if (!agency && partnerId && mongoose.Types.ObjectId.isValid(partnerId)) {
      agency = await AgencyModel.findOne({
        $or: [
          { _id: new mongoose.Types.ObjectId(partnerId) },
          { ownerId: new mongoose.Types.ObjectId(partnerId) },
        ],
        isDeleted: false,
      });
    }

    if (!partnerUser && !agency) {
      return next(new UnauthorizedError('Authenticated partner account not found. Please log in again.'));
    }

    req.agencyUser = {
      ...decoded,
      userId: (partnerUser?._id || agency?.ownerId || agency?._id || decoded.userId).toString(),
      name: decoded.name || partnerUser?.name || agency?.ownerName || agency?.name,
      email: decoded.email || partnerUser?.email || agency?.email,
      phone: decoded.phone || partnerUser?.phone || agency?.phone,
    };
    if (agency) {
      req.agency = agency;
    }

    return next();
  } catch (err: any) {
    return next(err);
  }
};

