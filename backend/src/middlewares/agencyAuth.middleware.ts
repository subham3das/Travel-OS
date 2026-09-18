import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { TokenUtil, JwtTokenPayload } from '../utils/token.util.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.util.js';
import { AgencyModel, IAgency } from '../models/agency.model.js';

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

    if (agencyIdOrUserId && mongoose.Types.ObjectId.isValid(agencyIdOrUserId)) {
      agency = await AgencyModel.findOne({ _id: agencyIdOrUserId, isDeleted: false });
    }

    if (!agency && email) {
      agency = await AgencyModel.findOne({
        $or: [{ email: email.toLowerCase() }, { 'owner.email': email.toLowerCase() }],
        isDeleted: false,
      });
    }

    if (!agency) {
      return next(new UnauthorizedError('Agency account not found or has been deactivated.'));
    }

    // Strict status enforcement: only APPROVED/ACTIVE agencies can access protected agency endpoints
    const isApproved =
      agency.verificationStatus === 'APPROVED' ||
      agency.verificationStatus === 'VERIFIED' ||
      agency.status === 'ACTIVE';

    if (!isApproved) {
      return next(
        new ForbiddenError(
          `Your agency application status is "${agency.verificationStatus}". Only verified and approved agencies can access the operational dashboard.`
        )
      );
    }

    if (agency.status === 'SUSPENDED') {
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

    // Attach authenticated agency and token payload to Request context
    req.agency = agency;
    req.agencyUser = decoded;

    next();
  } catch (error) {
    next(error);
  }
};
