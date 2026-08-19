import { EmailVerificationModel, IEmailVerification } from '../models/emailVerification.model.js';
import mongoose from 'mongoose';

export class EmailVerificationRepository {
  public async create(data: {
    userId: mongoose.Types.ObjectId;
    email: string;
    token: string;
    expiresAt: Date;
  }): Promise<IEmailVerification> {
    // Delete any old pending verification tokens for this user
    await EmailVerificationModel.deleteMany({ userId: data.userId }).exec();
    const doc = new EmailVerificationModel(data);
    return doc.save();
  }

  public async findByToken(token: string): Promise<IEmailVerification | null> {
    return EmailVerificationModel.findOne({ token }).exec();
  }

  public async deleteByToken(token: string): Promise<void> {
    await EmailVerificationModel.deleteOne({ token }).exec();
  }
}

export const emailVerificationRepository = new EmailVerificationRepository();
