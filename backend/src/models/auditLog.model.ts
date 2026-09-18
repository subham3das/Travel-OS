import mongoose, { Schema, Document } from 'mongoose';

export type AuditSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type AuditStatus = 'Success' | 'Warning' | 'Failed';

export interface IAuditChange {
  field: string;
  before?: string;
  after?: string;
}

export interface IAuditActor {
  id?: string;
  name: string;
  email?: string;
  role?: string;
  profileImage?: string;
  isSystem?: boolean;
}

export interface IAuditLog extends Document {
  eventId: string;
  timestamp: string;
  date: string;
  actor: IAuditActor;
  sessionId?: string;
  module: string;
  action: string;
  eventType: string;
  description: string;
  severity: AuditSeverity;
  status: AuditStatus;
  ipAddress: string;
  country?: string;
  browser?: string;
  device?: string;
  os?: string;
  location?: string;
  changes?: IAuditChange[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    timestamp: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    actor: {
      id: { type: String, index: true },
      name: { type: String, required: true },
      email: { type: String },
      role: { type: String, default: 'Admin' },
      profileImage: { type: String },
      isSystem: { type: Boolean, default: false },
    },
    sessionId: {
      type: String,
      index: true,
    },
    module: {
      type: String,
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Low',
      index: true,
    },
    status: {
      type: String,
      enum: ['Success', 'Warning', 'Failed'],
      default: 'Success',
      index: true,
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
      index: true,
    },
    country: {
      type: String,
      default: '🇮🇳',
    },
    browser: {
      type: String,
      default: 'Google Chrome',
    },
    device: {
      type: String,
      default: 'Desktop',
    },
    os: {
      type: String,
      default: 'Windows 11',
    },
    location: {
      type: String,
      default: 'New Delhi, India',
    },
    changes: [
      {
        field: { type: String, required: true },
        before: { type: String, default: '-' },
        after: { type: String, default: '-' },
      },
    ],
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'audit_logs',
  }
);

// Compound indexes for query performance
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ module: 1, severity: 1, createdAt: -1 });
AuditLogSchema.index({ 'actor.id': 1, createdAt: -1 });

export const AuditLogModel =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
