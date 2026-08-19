import { RefreshTokenModel, IRefreshToken } from '../models/refreshToken.model.js';
import mongoose from 'mongoose';

export class RefreshTokenRepository {
  public async create(data: {
    userId: mongoose.Types.ObjectId;
    tokenHash: string;
    device?: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
  }): Promise<IRefreshToken> {
    const token = new RefreshTokenModel(data);
    return token.save();
  }

  public async findByTokenHash(tokenHash: string): Promise<IRefreshToken | null> {
    return RefreshTokenModel.findOne({ tokenHash, isRevoked: false }).exec();
  }

  public async revokeToken(tokenHash: string): Promise<boolean> {
    const res = await RefreshTokenModel.updateOne(
      { tokenHash },
      { $set: { isRevoked: true } }
    ).exec();
    return res.modifiedCount > 0;
  }

  public async revokeAllUserTokens(userId: string | mongoose.Types.ObjectId): Promise<number> {
    const res = await RefreshTokenModel.updateMany(
      { userId },
      { $set: { isRevoked: true } }
    ).exec();
    return res.modifiedCount;
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
