import mongoose from 'mongoose';
import { ConversationModel, IConversation } from '../models/conversation.model.js';
import { MessageModel, IMessage } from '../models/message.model.js';
import { AgencyPrivateNoteModel, IAgencyPrivateNote } from '../models/agencyPrivateNote.model.js';
import { UserModel, IUser } from '../models/user.model.js';
import { BookingModel, IBooking } from '../models/booking.model.js';
import { SavedTravelerModel } from '../models/savedTraveler.model.js';
import { socketService } from './socket.service.js';
import { AuditLoggerService } from './auditLogger.service.js';
import { cloudinaryStorage } from '../storage/cloudinary.storage.js';
import { CLOUDINARY_FOLDERS } from '../config/cloudinary.config.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';

export interface GetConversationsFilterOptions {
  search?: string;
  filter?: string;
  page?: number;
  limit?: number;
}

export interface SendMessagePayload {
  text?: string;
  messageType?: 'text' | 'image' | 'pdf' | 'document' | 'location';
  attachments?: Array<{
    secureUrl: string;
    publicId?: string;
    fileName?: string;
    fileSize?: string;
    mimeType?: string;
    fileType: 'image' | 'pdf' | 'document';
  }>;
}

export class AgencyChatService {
  /**
   * 1. Get all conversations belonging to the logged-in agency with filtering & search
   */
  public async getConversations(agencyId: string, options: GetConversationsFilterOptions) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(options.limit) || 20));
    const skip = (page - 1) * limit;

    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);
    const isArchivedFilter = options.filter === 'Archived';

    // Base query
    const query: any = {
      agencyId: agencyObjectId,
      isDeleted: false,
      isArchived: isArchivedFilter,
    };

    if (options.filter === 'Unread') {
      query.unreadAgencyCount = { $gt: 0 };
    } else if (options.filter === 'Bookings') {
      query.bookingId = { $ne: null };
    }

    // Fetch conversations with populations
    const conversations = await ConversationModel.find(query)
      .populate({
        path: 'customerId',
        select: 'fullName email phone avatar profileImage dateOfBirth gender homeCity',
      })
      .populate({
        path: 'bookingId',
        select: 'bookingId packageName status paymentStatus totalAmount paidAmount travelersCount destination tripStartDate tripEndDate',
      })
      .sort({ lastMessageAt: -1 })
      .lean();

    const now = new Date();

    // Map and enrich with real customer & booking data
    let enrichedList = await Promise.all(
      conversations.map(async (conv: any) => {
        const customer = conv.customerId as any;
        const booking = conv.bookingId as any;

        const customerIdStr = customer?._id ? customer._id.toString() : conv.customerId?.toString() || '';
        const isOnline = customerIdStr ? socketService.isUserOnline(customerIdStr) : false;

        // Fetch companions for this customer
        let companions: any[] = [];
        if (customerIdStr) {
          const savedTravelers = await SavedTravelerModel.find({
            userId: customer._id,
            isDeleted: false,
          }).limit(5).lean();

          companions = savedTravelers.map((st) => ({
            id: st._id.toString(),
            name: st.fullName,
            relationship: st.relationship.charAt(0).toUpperCase() + st.relationship.slice(1),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(st.fullName)}`,
          }));
        }

        // Fetch private staff notes
        let privateNotes: string[] = [];
        if (customerIdStr) {
          const notesDocs = await AgencyPrivateNoteModel.find({
            agencyId: agencyObjectId,
            customerId: customer._id,
            isDeleted: false,
          })
            .sort({ createdAt: -1 })
            .lean();

          privateNotes = notesDocs.map((n) => n.note);
        }

        // Determine trip status
        let tripStatus: 'Upcoming' | 'Ongoing' | 'Completed' = 'Upcoming';
        if (booking?.tripStartDate && booking?.tripEndDate) {
          const start = new Date(booking.tripStartDate);
          const end = new Date(booking.tripEndDate);
          if (now < start) tripStatus = 'Upcoming';
          else if (now > end) tripStatus = 'Completed';
          else tripStatus = 'Ongoing';
        } else if (booking?.status === 'COMPLETED') {
          tripStatus = 'Completed';
        }

        // VIP status check
        const isVIP = (booking?.totalAmount && booking.totalAmount >= 50000) || false;

        // Emergency Contact
        const emergencyContact = {
          name: customer?.fullName ? `${customer.fullName} Emergency Contact` : 'Next of Kin',
          relationship: 'Family Member',
          phone: customer?.phone || '+91 98765 00000',
        };

        const customerInfo = {
          customerId: customerIdStr,
          name: customer?.fullName || 'Traveler',
          avatar:
            customer?.avatar ||
            customer?.profileImage ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(customer?.fullName || 'User')}`,
          phone: customer?.phone || 'Not Provided',
          email: customer?.email || 'traveler@apnatrip.in',
          bookingId: booking?.bookingId || 'BK-DIRECT',
          packageName: booking?.packageName || booking?.destination || 'Custom Tour',
          departureDate: booking?.tripStartDate
            ? new Date(booking.tripStartDate).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : 'Date TBD',
          paymentStatus:
            booking?.paymentStatus === 'PAID'
              ? ('Paid' as const)
              : booking?.paymentStatus === 'PARTIAL'
              ? ('Partial' as const)
              : ('Pending' as const),
          isVIP,
          tripStatus,
          emergencyContact,
          companions,
          privateNotes,
        };

        return {
          id: conv._id.toString(),
          customerId: customerIdStr,
          customerName: customerInfo.name,
          customerAvatar: customerInfo.avatar,
          bookingId: customerInfo.bookingId,
          tripName: customerInfo.packageName,
          lastMessage: conv.lastMessagePreview || 'No messages yet',
          lastMessageTime: conv.lastMessageAt
            ? this.formatMessageTime(new Date(conv.lastMessageAt))
            : 'Just now',
          unreadCount: conv.unreadAgencyCount || 0,
          isOnline,
          customerInfo,
        };
      })
    );

    // Apply specific filters that rely on joined attributes
    if (options.filter === 'Upcoming Trips') {
      enrichedList = enrichedList.filter((c) => c.customerInfo.tripStatus === 'Upcoming');
    } else if (options.filter === 'Completed Trips') {
      enrichedList = enrichedList.filter((c) => c.customerInfo.tripStatus === 'Completed');
    } else if (options.filter === 'VIP Customers' || options.filter === 'VIP') {
      enrichedList = enrichedList.filter((c) => c.customerInfo.isVIP);
    }

    // Apply Search Query filter across name, bookingId, tripName, phone, and email
    if (options.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      enrichedList = enrichedList.filter(
        (c) =>
          c.customerName.toLowerCase().includes(q) ||
          c.bookingId.toLowerCase().includes(q) ||
          c.tripName.toLowerCase().includes(q) ||
          c.customerInfo.phone.toLowerCase().includes(q) ||
          c.customerInfo.email.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
      );
    }

    const total = enrichedList.length;
    const paginatedConversations = enrichedList.slice(skip, skip + limit);

    // Calculate overall unread count for the agency
    const totalUnreadCount = await ConversationModel.aggregate([
      { $match: { agencyId: agencyObjectId, isDeleted: false } },
      { $group: { _id: null, total: { $sum: '$unreadAgencyCount' } } },
    ]);

    const agencyTotalUnread = totalUnreadCount[0]?.total || 0;

    return {
      conversations: paginatedConversations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
      unreadCount: agencyTotalUnread,
    };
  }

  /**
   * 2. Get single conversation detail by ID with strict agency ownership check
   */
  public async getConversationById(agencyId: string, conversationId: string) {
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      throw new BadRequestError('Invalid conversation ID format');
    }

    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      agencyId: new mongoose.Types.ObjectId(agencyId),
      isDeleted: false,
    })
      .populate({
        path: 'customerId',
        select: 'fullName email phone avatar profileImage dateOfBirth gender homeCity',
      })
      .populate({
        path: 'bookingId',
        select: 'bookingId packageName status paymentStatus totalAmount paidAmount travelersCount destination tripStartDate tripEndDate',
      })
      .lean();

    if (!conversation) {
      throw new NotFoundError('Conversation not found or access denied');
    }

    const customer = conversation.customerId as any;
    const booking = conversation.bookingId as any;
    const customerIdStr = customer?._id ? customer._id.toString() : '';

    const isOnline = customerIdStr ? socketService.isUserOnline(customerIdStr) : false;

    // Fetch companions
    let companions: any[] = [];
    if (customerIdStr) {
      const savedTravelers = await SavedTravelerModel.find({
        userId: customer._id,
        isDeleted: false,
      }).lean();

      companions = savedTravelers.map((st) => ({
        id: st._id.toString(),
        name: st.fullName,
        relationship: st.relationship.charAt(0).toUpperCase() + st.relationship.slice(1),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(st.fullName)}`,
      }));
    }

    // Fetch private staff notes
    let privateNotes: string[] = [];
    if (customerIdStr) {
      const notesDocs = await AgencyPrivateNoteModel.find({
        agencyId: new mongoose.Types.ObjectId(agencyId),
        customerId: customer._id,
        isDeleted: false,
      })
        .sort({ createdAt: -1 })
        .lean();

      privateNotes = notesDocs.map((n) => n.note);
    }

    const now = new Date();
    let tripStatus: 'Upcoming' | 'Ongoing' | 'Completed' = 'Upcoming';
    if (booking?.tripStartDate && booking?.tripEndDate) {
      const start = new Date(booking.tripStartDate);
      const end = new Date(booking.tripEndDate);
      if (now < start) tripStatus = 'Upcoming';
      else if (now > end) tripStatus = 'Completed';
      else tripStatus = 'Ongoing';
    }

    const isVIP = (booking?.totalAmount && booking.totalAmount >= 50000) || false;

    const customerInfo = {
      customerId: customerIdStr,
      name: customer?.fullName || 'Traveler',
      avatar:
        customer?.avatar ||
        customer?.profileImage ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(customer?.fullName || 'User')}`,
      phone: customer?.phone || 'Not Provided',
      email: customer?.email || 'traveler@apnatrip.in',
      bookingId: booking?.bookingId || 'BK-DIRECT',
      packageName: booking?.packageName || booking?.destination || 'Custom Tour',
      departureDate: booking?.tripStartDate
        ? new Date(booking.tripStartDate).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Date TBD',
      paymentStatus:
        booking?.paymentStatus === 'PAID'
          ? ('Paid' as const)
          : booking?.paymentStatus === 'PARTIAL'
          ? ('Partial' as const)
          : ('Pending' as const),
      isVIP,
      tripStatus,
      emergencyContact: {
        name: customer?.fullName ? `${customer.fullName} Contact` : 'Emergency Contact',
        relationship: 'Family Member',
        phone: customer?.phone || '+91 98765 00000',
      },
      companions,
      privateNotes,
    };

    return {
      id: conversation._id.toString(),
      customerId: customerIdStr,
      customerName: customerInfo.name,
      customerAvatar: customerInfo.avatar,
      bookingId: customerInfo.bookingId,
      tripName: customerInfo.packageName,
      lastMessage: conversation.lastMessagePreview || '',
      lastMessageTime: conversation.lastMessageAt
        ? this.formatMessageTime(new Date(conversation.lastMessageAt))
        : 'Just now',
      unreadCount: conversation.unreadAgencyCount || 0,
      isOnline,
      customerInfo,
    };
  }

  /**
   * 3. Get paginated messages for a conversation
   */
  public async getMessages(agencyId: string, conversationId: string, page = 1, limit = 50) {
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      throw new BadRequestError('Invalid conversation ID format');
    }

    // Verify agency ownership
    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      agencyId: new mongoose.Types.ObjectId(agencyId),
      isDeleted: false,
    });

    if (!conversation) {
      throw new NotFoundError('Conversation not found or unauthorized');
    }

    const skip = (page - 1) * limit;

    const messages = await MessageModel.find({
      conversationId: new mongoose.Types.ObjectId(conversationId),
      isDeleted: false,
    })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await MessageModel.countDocuments({
      conversationId: new mongoose.Types.ObjectId(conversationId),
      isDeleted: false,
    });

    const formattedMessages = messages.map((m) => {
      let attachment: any = undefined;
      if (m.attachments && m.attachments.length > 0) {
        const att = m.attachments[0];
        attachment = {
          type: att.fileType,
          url: att.secureUrl,
          fileName: att.fileName || (att.fileType === 'pdf' ? 'Document.pdf' : 'Image.jpg'),
          fileSize: att.fileSize || '1.0 MB',
        };
      }

      return {
        id: m._id.toString(),
        conversationId: m.conversationId.toString(),
        sender: m.senderType,
        text: m.text || '',
        timestampText: this.formatMessageTime(new Date(m.createdAt)),
        status: m.status,
        type: m.messageType,
        attachment,
      };
    });

    return {
      messages: formattedMessages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * 4. Send message from Agency to Customer
   */
  public async sendMessage(
    agencyId: string,
    conversationId: string,
    author: { id: string; name: string; email?: string },
    payload: SendMessagePayload
  ) {
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      throw new BadRequestError('Invalid conversation ID format');
    }

    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      agencyId: new mongoose.Types.ObjectId(agencyId),
      isDeleted: false,
    });

    if (!conversation) {
      throw new NotFoundError('Conversation not found or unauthorized');
    }

    const textContent = payload.text ? payload.text.trim() : '';
    const messageType = payload.messageType || (payload.attachments?.length ? payload.attachments[0].fileType : 'text');

    if (!textContent && (!payload.attachments || payload.attachments.length === 0)) {
      throw new BadRequestError('Message cannot be empty without attachments');
    }

    // Create Message Document
    const message = await MessageModel.create({
      conversationId: conversation._id,
      senderType: 'agency',
      senderId: new mongoose.Types.ObjectId(agencyId),
      receiverId: conversation.customerId,
      text: textContent,
      messageType,
      attachments: payload.attachments || [],
      status: 'sent',
    });

    // Update Conversation metadata
    const previewText = textContent || (messageType === 'pdf' ? 'Attachment: PDF Document' : 'Attachment: Image');

    await ConversationModel.findByIdAndUpdate(conversation._id, {
      lastMessageId: message._id,
      lastMessageAt: message.createdAt,
      lastMessagePreview: previewText,
      lastSender: 'agency',
      $inc: { unreadCustomerCount: 1 },
    });

    let attachment: any = undefined;
    if (message.attachments && message.attachments.length > 0) {
      const att = message.attachments[0];
      attachment = {
        type: att.fileType,
        url: att.secureUrl,
        fileName: att.fileName || (att.fileType === 'pdf' ? 'Document.pdf' : 'Image.jpg'),
        fileSize: att.fileSize || '1.0 MB',
      };
    }

    const formattedMessage = {
      id: message._id.toString(),
      conversationId: message.conversationId.toString(),
      sender: message.senderType,
      text: message.text,
      timestampText: 'Just now',
      status: message.status,
      type: message.messageType,
      attachment,
    };

    // Real-Time Socket.IO Emissions
    socketService.emitToConversation(conversationId, 'new_message', formattedMessage);
    socketService.emitToAgency(agencyId, 'conversation_updated', {
      conversationId,
      lastMessage: previewText,
      lastMessageTime: 'Just now',
    });
    socketService.emitToUser(conversation.customerId.toString(), 'new_message', formattedMessage);

    // Audit Logging
    await AuditLoggerService.log({
      actor: {
        id: author.id,
        name: author.name,
        email: author.email,
        role: 'AGENCY_ADMIN',
      },
      module: 'AgencyMessages',
      action: 'SendMessage',
      eventType: 'COMMUNICATION',
      description: `Sent message to customer ${conversation.customerId} in conversation ${conversationId}`,
      metadata: {
        conversationId,
        messageId: message._id.toString(),
        messageType,
      },
    });

    return formattedMessage;
  }

  /**
   * 5. Mark conversation as read by Agency
   */
  public async markAsRead(agencyId: string, conversationId: string) {
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      throw new BadRequestError('Invalid conversation ID format');
    }

    const conversation = await ConversationModel.findOneAndUpdate(
      {
        _id: conversationId,
        agencyId: new mongoose.Types.ObjectId(agencyId),
        isDeleted: false,
      },
      {
        unreadAgencyCount: 0,
      },
      { new: true }
    );

    if (!conversation) {
      throw new NotFoundError('Conversation not found or unauthorized');
    }

    // Mark all customer messages in this conversation as read
    await MessageModel.updateMany(
      {
        conversationId: conversation._id,
        senderType: 'customer',
        status: { $ne: 'read' },
      },
      {
        status: 'read',
        readAt: new Date(),
      }
    );

    // Real-time notification
    socketService.emitToConversation(conversationId, 'message_read', {
      conversationId,
      readBy: 'agency',
    });
    socketService.emitToUser(conversation.customerId.toString(), 'message_read', {
      conversationId,
    });
    socketService.emitToAgency(agencyId, 'conversation_updated', {
      conversationId,
      unreadCount: 0,
    });

    return { success: true, conversationId, unreadCount: 0 };
  }

  /**
   * 6. Create Staff Private Note (Agency staff only)
   */
  public async createPrivateNote(
    agencyId: string,
    customerId: string,
    author: { id: string; name: string; email?: string },
    payload: { note: string; bookingId?: string }
  ) {
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      throw new BadRequestError('Invalid customer ID format');
    }

    const note = await AgencyPrivateNoteModel.create({
      agencyId: new mongoose.Types.ObjectId(agencyId),
      customerId: new mongoose.Types.ObjectId(customerId),
      bookingId: payload.bookingId ? new mongoose.Types.ObjectId(payload.bookingId) : null,
      authorAdmin: {
        id: new mongoose.Types.ObjectId(author.id),
        name: author.name,
        email: author.email || '',
      },
      note: payload.note.trim(),
    });

    // Audit Log
    await AuditLoggerService.log({
      actor: {
        id: author.id,
        name: author.name,
        email: author.email,
        role: 'AGENCY_ADMIN',
      },
      module: 'AgencyNotes',
      action: 'CreatePrivateNote',
      eventType: 'CREATE',
      description: `Created private note for customer ${customerId}`,
      metadata: { customerId, noteId: note._id.toString() },
    });

    return {
      id: note._id.toString(),
      note: note.note,
      authorName: note.authorAdmin.name,
      createdAt: note.createdAt,
    };
  }

  /**
   * 7. Update Staff Private Note
   */
  public async updatePrivateNote(agencyId: string, noteId: string, noteText: string) {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      throw new BadRequestError('Invalid note ID format');
    }

    const note = await AgencyPrivateNoteModel.findOneAndUpdate(
      {
        _id: noteId,
        agencyId: new mongoose.Types.ObjectId(agencyId),
        isDeleted: false,
      },
      {
        note: noteText.trim(),
      },
      { new: true }
    );

    if (!note) {
      throw new NotFoundError('Note not found or unauthorized');
    }

    return {
      id: note._id.toString(),
      note: note.note,
      updatedAt: note.updatedAt,
    };
  }

  /**
   * 8. Delete Staff Private Note (Soft delete)
   */
  public async deletePrivateNote(agencyId: string, noteId: string) {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      throw new BadRequestError('Invalid note ID format');
    }

    const note = await AgencyPrivateNoteModel.findOneAndUpdate(
      {
        _id: noteId,
        agencyId: new mongoose.Types.ObjectId(agencyId),
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      { new: true }
    );

    if (!note) {
      throw new NotFoundError('Note not found or unauthorized');
    }

    return { success: true, id: noteId };
  }

  /**
   * 9. Upload Chat Attachment to Cloudinary
   */
  public async uploadAttachment(fileBuffer: Buffer, originalFilename: string, mimeType: string) {
    let fileType: 'image' | 'pdf' | 'document' = 'document';
    if (mimeType.startsWith('image/')) {
      fileType = 'image';
    } else if (mimeType.includes('pdf')) {
      fileType = 'pdf';
    }

    const result = await cloudinaryStorage.uploadImage(fileBuffer, {
      folder: CLOUDINARY_FOLDERS.MISC,
    });

    const sizeInMB = (fileBuffer.length / (1024 * 1024)).toFixed(1) + ' MB';

    return {
      secureUrl: result.secureUrl,
      publicId: result.publicId,
      fileName: originalFilename,
      fileSize: sizeInMB,
      mimeType,
      fileType,
    };
  }

  /**
   * Helper to format friendly timestamp strings
   */
  private formatMessageTime(date: Date): string {
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    if (isToday) return timeStr;
    if (isYesterday) return `Yesterday ${timeStr}`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

export const agencyChatService = new AgencyChatService();
