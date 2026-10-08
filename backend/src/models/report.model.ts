import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  name: string;
  generatedBy: string;
  createdDate: Date;
  status: 'Ready' | 'Processing' | 'Failed' | 'Scheduled';
  type: string;
  downloadUrl?: string;
  schedule: string;
  fileSize?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    name: { type: String, required: true, trim: true },
    generatedBy: { type: String, required: true, default: 'System' },
    createdDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Ready', 'Processing', 'Failed', 'Scheduled'],
      default: 'Ready',
    },
    type: { type: String, required: true, default: 'Financial' },
    downloadUrl: { type: String },
    schedule: { type: String, default: 'None' },
    fileSize: { type: String, default: '0 KB' },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

ReportSchema.index({ isDeleted: 1, createdAt: -1 });

export const ReportModel = mongoose.model<IReport>('Report', ReportSchema);
