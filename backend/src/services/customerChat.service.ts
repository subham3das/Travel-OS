import mongoose from 'mongoose';
import { ConversationModel, IConversation } from '../models/conversation.model.js';
import { MessageModel, IMessage } from '../models/message.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { BookingModel } from '../models/booking.model.js';
import { UserModel } from '../models/user.model.js';
import { socketService } from './socket.service.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';

export class CustomerChatService {
  /**
   * Helper to format a conversation for user panel
   */
  private formatConversation(conv: any, messages: any[] = []): any {
    const agency = conv.agencyId || {};
    const booking = conv.bookingId || {};

    const formattedMessages = messages.map((m) => ({
      id: m._id.toString(),
      senderId: m.senderId ? m.senderId.toString() : 'support',
      senderName: m.senderType === 'customer' ? 'You' : (agency.businessName || agency.name || 'ApnaTrip Support'),
      type: m.messageType === 'image' ? 'image' : (m.messageType === 'pdf' || m.messageType === 'document' ? 'document' : 'text'),
      text: m.text || '',
      attachmentUrl: m.attachments?.[0]?.secureUrl,
      timestamp: new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: m.status || 'read',
    }));

    return {
      id: conv._id.toString(),
      agencyId: agency._id ? agency._id.toString() : 'support-desk',
      agencyName: agency.businessName || agency.name || 'ApnaTrip Concierge Support',
      agencyLogo: agency.logo || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=200&auto=format&fit=crop',
      isVerified: Boolean(agency.isVerified ?? true),
      isOnline: true,
      category: agency._id ? 'agencies' : 'support',
      lastMessage: conv.lastMessagePreview || 'Welcome to ApnaTrip Chat Support',
      lastMessageTime: conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
      unreadCount: conv.unreadCustomerCount || 0,
      bookingId: booking.bookingId || undefined,
      packageName: booking.packageName || undefined,
      destinationName: booking.destination || undefined,
      travelDates: booking.tripStartDate ? `${new Date(booking.tripStartDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} – ${new Date(booking.tripEndDate || booking.tripStartDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}` : undefined,
      tripId: conv.tripId ? conv.tripId.toString() : (booking.bookingId ? `TRIP-${booking.bookingId}` : undefined),
      hostPhone: agency.phone || '+91 98765 43210',
      messages: formattedMessages,
    };
  }

  /**
   * 1. Get all conversations for logged-in customer
   */
  public async getCustomerConversations(userId: string): Promise<any[]> {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    let conversations = await ConversationModel.find({
      customerId: userObjectId,
      isDeleted: false,
    })
      .populate('agencyId', 'businessName name logo isVerified phone email')
      .populate('bookingId', 'bookingId packageName destination tripStartDate tripEndDate')
      .sort({ lastMessageAt: -1 })
      .lean();

    // If no conversations exist, check if user has bookings and auto-seed initial chats
    if (conversations.length === 0) {
      const recentBooking = await BookingModel.findOne({ userId: userObjectId, isDeleted: false })
        .populate('agencyId', 'businessName name logo isVerified phone email')
        .lean();

      let targetAgencyId = recentBooking?.agencyId?._id;
      if (!targetAgencyId) {
        const anyAgency = await AgencyModel.findOne().lean();
        if (anyAgency) targetAgencyId = anyAgency._id;
      }

      if (targetAgencyId) {
        const newConv = await ConversationModel.create({
          agencyId: targetAgencyId,
          customerId: userObjectId,
          bookingId: recentBooking?._id || undefined,
          lastMessagePreview: recentBooking ? `Trip confirmed for ${recentBooking.packageName}. How can we assist you?` : 'Hello! How can we assist you with your travels?',
          lastMessageAt: new Date(),
          lastSender: 'agency',
          unreadCustomerCount: 0,
          unreadAgencyCount: 0,
        });

        // Seed welcome message
        await MessageModel.create({
          conversationId: newConv._id,
          senderType: 'agency',
          senderId: targetAgencyId,
          receiverId: userObjectId,
          text: recentBooking
            ? `Welcome! Your booking for ${recentBooking.packageName} is confirmed. Our support and ground coordination team is here 24/7.`
            : 'Welcome to ApnaTrip! Reach out anytime if you have any questions regarding your itinerary or bookings.',
          messageType: 'text',
          status: 'delivered',
        });

        conversations = await ConversationModel.find({
          customerId: userObjectId,
          isDeleted: false,
        })
          .populate('agencyId', 'businessName name logo isVerified phone email')
          .populate('bookingId', 'bookingId packageName destination tripStartDate tripEndDate')
          .sort({ lastMessageAt: -1 })
          .lean();
      }
    }

    const formattedList: any[] = [];
    for (const c of conversations) {
      const messages = await MessageModel.find({
        conversationId: c._id,
        isDeleted: false,
      })
        .sort({ createdAt: 1 })
        .limit(50)
        .lean();

      formattedList.push(this.formatConversation(c, messages));
    }

    return formattedList;
  }

  /**
   * 2. Get Single Conversation by ID with messages
   */
  public async getConversationById(userId: string, conversationId: string): Promise<any> {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    let conv: any = null;
    if (mongoose.Types.ObjectId.isValid(conversationId)) {
      conv = await ConversationModel.findOne({
        _id: new mongoose.Types.ObjectId(conversationId),
        customerId: userObjectId,
        isDeleted: false,
      })
        .populate('agencyId', 'businessName name logo isVerified phone email')
        .populate('bookingId', 'bookingId packageName destination tripStartDate tripEndDate')
        .lean();
    }

    if (!conv) {
      // Fallback: search conversations list
      const list = await this.getCustomerConversations(userId);
      const matched = list.find((c) => c.id === conversationId || c.bookingId === conversationId);
      if (matched) return matched;
      if (list.length > 0) return list[0];
      throw new NotFoundError('Conversation not found');
    }

    // Mark customer unread as 0
    await ConversationModel.updateOne(
      { _id: conv._id },
      { $set: { unreadCustomerCount: 0 } }
    );

    const messages = await MessageModel.find({
      conversationId: conv._id,
      isDeleted: false,
    })
      .sort({ createdAt: 1 })
      .limit(100)
      .lean();

    return this.formatConversation(conv, messages);
  }

  /**
   * 3. Send Message from Customer
   */
  public async sendMessage(
    userId: string,
    payload: { conversationId: string; text: string; attachments?: any[] }
  ): Promise<any> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const { conversationId, text, attachments } = payload;

    if (!text && (!attachments || attachments.length === 0)) {
      throw new BadRequestError('Message cannot be empty');
    }

    let conv: any = null;
    if (mongoose.Types.ObjectId.isValid(conversationId)) {
      conv = await ConversationModel.findOne({
        _id: new mongoose.Types.ObjectId(conversationId),
        customerId: userObjectId,
      });
    }

    if (!conv) {
      // Find first available conversation for user
      conv = await ConversationModel.findOne({
        customerId: userObjectId,
        isDeleted: false,
      });
    }

    if (!conv) {
      const anyAgency = await AgencyModel.findOne().lean();
      conv = await ConversationModel.create({
        agencyId: anyAgency?._id || userObjectId,
        customerId: userObjectId,
        lastMessagePreview: text,
        lastMessageAt: new Date(),
        lastSender: 'customer',
        unreadAgencyCount: 1,
        unreadCustomerCount: 0,
      });
    }

    const newMessage = await MessageModel.create({
      conversationId: conv._id,
      senderType: 'customer',
      senderId: userObjectId,
      receiverId: conv.agencyId,
      text: text.trim(),
      attachments: attachments || [],
      messageType: attachments && attachments.length > 0 ? attachments[0].fileType : 'text',
      status: 'sent',
    });

    conv.lastMessagePreview = text.trim();
    conv.lastMessageAt = new Date();
    conv.lastSender = 'customer';
    conv.unreadAgencyCount = (conv.unreadAgencyCount || 0) + 1;
    await conv.save();

    const formattedMessage = {
      id: newMessage._id.toString(),
      senderId: userObjectId.toString(),
      senderName: 'You',
      type: newMessage.messageType === 'image' ? 'image' : (newMessage.messageType === 'pdf' ? 'document' : 'text'),
      text: newMessage.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    // Emit real-time Socket.IO events
    if (conv.agencyId) {
      socketService.emitToAgency(conv.agencyId.toString(), 'message:new', {
        conversationId: conv._id.toString(),
        message: formattedMessage,
      });
    }
    socketService.emitToUser(userId, 'message:new', {
      conversationId: conv._id.toString(),
      message: formattedMessage,
    });

    logger.info('💬 Customer %s sent message in conversation %s', userId, conv._id.toString());

    return formattedMessage;
  }
}

export const customerChatService = new CustomerChatService();
