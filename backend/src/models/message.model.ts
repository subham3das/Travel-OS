import mongoose, { Document, Schema } from 'mongoose';

export type MessageSenderType = 'agency' | 'customer';
export type MessageType = 'text' | 'image' | 'pdf' | 'document' | 'location';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface IMessageAttachment {
  secureUrl: string;
  publicId?: string;
  fileName?: string;
  fileSize?: string;
  mimeType?: string;
  fileType: 'image' | 'pdf' | 'document';
  uploadedAt: Date;
}

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  senderType: MessageSenderType;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  text: string;
  attachments?: IMessageAttachment[];
  messageType: MessageType;
  status: MessageStatus;
  readAt?: Date | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageAttachmentSchema = new Schema<IMessageAttachment>(
  {
    secureUrl: { type: String, required: true },
    publicId: { type: String },
    fileName: { type: String },
    fileSize: { type: String },
    mimeType: { type: String },
    fileType: { type: String, enum: ['image', 'pdf', 'document'], default: 'document' },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    senderType: {
      type: String,
      enum: ['agency', 'customer'],
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    text: {
      type: String,
      default: '',
      trim: true,
      maxlength: 4000,
    },
    attachments: [MessageAttachmentSchema],
    messageType: {
      type: String,
      enum: ['text', 'image', 'pdf', 'document', 'location'],
      default: 'text',
      index: true,
    },
    status: {
      type: String,
      enum: ['sending', 'sent', 'delivered', 'read'],
      default: 'sent',
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast message retrieval
MessageSchema.index({ conversationId: 1, isDeleted: 1, createdAt: 1 });
MessageSchema.index({ conversationId: 1, isDeleted: 1, createdAt: -1 });

export const MessageModel =
  mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema, 'messages');
