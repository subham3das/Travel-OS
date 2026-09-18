import { AccessRequestModel, IAccessRequest } from '../models/accessRequest.model.js';
import mongoose from 'mongoose';

export class AccessRequestRepository {
  public async findAll(): Promise<IAccessRequest[]> {
    return AccessRequestModel.find().sort({ createdAt: -1 }).exec();
  }

  public async findById(id: string | mongoose.Types.ObjectId): Promise<IAccessRequest | null> {
    return AccessRequestModel.findById(id).exec();
  }

  public async updateStatus(
    id: string | mongoose.Types.ObjectId,
    status: 'Approved' | 'Rejected',
    reviewedBy?: mongoose.Types.ObjectId
  ): Promise<IAccessRequest | null> {
    return AccessRequestModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
          reviewedBy,
          reviewedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    ).exec();
  }

  public async countPending(): Promise<number> {
    return AccessRequestModel.countDocuments({ status: 'Pending' }).exec();
  }
}

export const accessRequestRepository = new AccessRequestRepository();
