import mongoose, { Document, Schema } from 'mongoose';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED' | 'ASSIGNED' | 'ESCALATED';

export interface ISupportMessageAttachment {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
}

export interface ISupportMessage {
  id: string;
  senderType: 'customer' | 'agent' | 'internal_note' | 'system';
  senderName: string;
  senderAvatar?: string;
  senderRole?: string;
  text: string;
  timestamp: string;
  isRead?: boolean;
  attachments?: ISupportMessageAttachment[];
}

export interface ISupportTicket extends Document {
  ticketId: string;
  subject: string;
  description: string;
  userId?: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userAvatar?: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: string;
  assignedTo?: string;
  assignedAgentName?: string;
  targetRoute?: string;
  messages: ISupportMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true, lowercase: true },
    userPhone: { type: String, default: '+91 98765 43210' },
    userAvatar: { type: String, default: '' },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
      index: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED', 'ASSIGNED', 'ESCALATED'],
      default: 'OPEN',
      index: true,
    },
    category: { type: String, default: 'General Support', index: true },
    assignedTo: { type: String },
    assignedAgentName: { type: String, default: 'Support Team' },
    targetRoute: { type: String, default: '/admin/support' },
    messages: [
      {
        id: { type: String },
        senderType: { type: String, default: 'customer' },
        senderName: { type: String },
        senderAvatar: { type: String },
        senderRole: { type: String },
        text: { type: String },
        timestamp: { type: String },
        isRead: { type: Boolean, default: true },
        attachments: [
          {
            id: { type: String },
            name: { type: String },
            url: { type: String },
            size: { type: String },
            type: { type: String },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

SupportTicketSchema.index({ createdAt: -1 });
SupportTicketSchema.index({ status: 1, priority: 1 });
SupportTicketSchema.index({ userId: 1, status: 1 });

export const SupportTicketModel =
  mongoose.models.SupportTicket ||
  mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema, 'support_tickets');

