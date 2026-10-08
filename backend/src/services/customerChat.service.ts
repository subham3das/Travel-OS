import mongoose from 'mongoose';
import { ConversationModel, IConversation } from '../models/conversation.model.js';
import { MessageModel, IMessage } from '../models/message.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { BookingModel } from '../models/booking.model.js';
import { CarBookingModel } from '../models/carBooking.model.js';
import { CarModel } from '../models/car.model.js';
import { UserModel } from '../models/user.model.js';
import { socketService } from './socket.service.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';

export class CustomerChatService {
  /**
   * Helper to format a conversation for user panel
   */
  private formatConversation(conv: any, messages: any[] = [], carBooking?: any, car?: any): any {
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

    const agencyIdStr = agency._id ? agency._id.toString() : '';
    const isAgencyOnline = agencyIdStr ? socketService.isUserOnline(agencyIdStr) : false;
    const registeredPhone = agency.phone?.trim() || agency.profile?.phone?.trim() || null;
    const registeredWhatsApp = agency.whatsappNumber?.trim() || agency.profile?.phone?.trim() || agency.phone?.trim() || null;
    const isCarRental = conv.conversationType === 'CAR_RENTAL' || conv.businessType === 'car_rental' || Boolean(carBooking);

    if (isCarRental) {
      const vehicleName = car?.name || carBooking?.carName || 'Rental Vehicle';
      const vehicleImage = car?.thumbnail || car?.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800';
      const pickupDateStr = carBooking?.startDate ? new Date(carBooking.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Confirmed';
      const returnDateStr = carBooking?.endDate ? new Date(carBooking.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Confirmed';
      const pickupTimeStr = carBooking?.pickupTime || '10:00 AM';

      return {
        id: conv._id.toString(),
        agencyId: agency._id ? agency._id.toString() : 'support-desk',
        agencyName: agency.agencyDisplayName || agency.businessName || agency.name || 'ApnaTrip Car Rentals',
        agencyLogo: agency.logo || vehicleImage,
        isVerified: Boolean(agency.isVerified ?? true),
        isOnline: isAgencyOnline,
        onlineStatus: isAgencyOnline ? 'online' : 'offline',
        lastSeen: agency.updatedAt ? new Date(agency.updatedAt).toISOString() : null,
        conversationType: 'CAR_RENTAL',
        category: 'cars',
        lastMessage: conv.lastMessagePreview || 'Vehicle reservation initiated',
        lastMessageTime: conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
        unreadCount: conv.unreadCustomerCount || 0,
        hostPhone: registeredPhone,
        whatsappNumber: registeredWhatsApp,
        supportMessage: agency.supportMessage || null,
        messages: formattedMessages,
        vehicleBooking: {
          bookingId: carBooking?.bookingId || (conv.carBookingId ? conv.carBookingId.toString() : 'CB-PENDING'),
          vehicleName,
          vehicleImage,
          rentalProvider: agency.agencyDisplayName || agency.businessName || agency.name || 'ApnaTrip Car Rentals',
          providerPhone: registeredPhone,
          pickupLocation: carBooking?.pickupLocation || 'Pickup Location',
          dropLocation: carBooking?.dropLocation || 'Destination Drop',
          pickupDate: pickupDateStr,
          pickupTime: pickupTimeStr,
          returnDate: returnDateStr,
          bookingStatus: carBooking?.bookingStatus || 'CONFIRMED',
          paymentStatus: carBooking?.paymentStatus || 'DEPOSIT_PAID',
          depositPaid: carBooking?.depositPaid || 0,
          remainingAmount: carBooking?.remainingAmount || 0,
          totalAmount: carBooking?.totalAmount || 0,
          driverName: carBooking?.driverName || car?.driver?.name || null,
          driverPhone: carBooking?.driverPhone || car?.driver?.phone || registeredPhone,
          viewBookingRoute: `/car-bookings/${carBooking?.bookingId || carBooking?._id || conv._id.toString()}`,
        },
      };
    }

    return {
      id: conv._id.toString(),
      agencyId: agency._id ? agency._id.toString() : 'support-desk',
      agencyName: agency.agencyDisplayName || agency.businessName || agency.name || 'ApnaTrip Concierge Support',
      agencyLogo: agency.logo || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=200&auto=format&fit=crop',
      isVerified: Boolean(agency.isVerified ?? true),
      isOnline: isAgencyOnline,
      onlineStatus: isAgencyOnline ? 'online' : 'offline',
      lastSeen: agency.updatedAt ? new Date(agency.updatedAt).toISOString() : null,
      conversationType: 'PACKAGE',
      category: agency._id ? 'agencies' : 'support',
      lastMessage: conv.lastMessagePreview || 'Welcome to ApnaTrip Chat Support',
      lastMessageTime: conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
      unreadCount: conv.unreadCustomerCount || 0,
      bookingId: booking.bookingId || undefined,
      packageName: booking.packageName || undefined,
      destinationName: booking.destination || undefined,
      travelDates: booking.tripStartDate ? `${new Date(booking.tripStartDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} – ${new Date(booking.tripEndDate || booking.tripStartDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}` : undefined,
      tripId: conv.tripId ? conv.tripId.toString() : (booking.bookingId ? `TRIP-${booking.bookingId}` : undefined),
      hostPhone: registeredPhone,
      whatsappNumber: registeredWhatsApp,
      supportMessage: agency.supportMessage || null,
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
      .populate('agencyId', 'businessName name agencyDisplayName logo isVerified phone whatsappNumber supportMessage email profile updatedAt')
      .populate('bookingId', 'bookingId packageName destination tripStartDate tripEndDate')
      .sort({ lastMessageAt: -1 })
      .lean();

    // If no conversations exist, check if user has bookings and auto-seed initial chats
    if (conversations.length === 0) {
      const recentBooking = await BookingModel.findOne({ userId: userObjectId, isDeleted: false })
        .populate('agencyId', 'businessName name agencyDisplayName logo isVerified phone whatsappNumber supportMessage email profile updatedAt')
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
          conversationType: 'PACKAGE',
          businessType: 'agency',
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
          .populate('agencyId', 'businessName name agencyDisplayName logo isVerified phone whatsappNumber supportMessage email profile updatedAt')
          .populate('bookingId', 'bookingId packageName destination tripStartDate tripEndDate')
          .sort({ lastMessageAt: -1 })
          .lean();
      }
    }

    const formattedList: any[] = [];
    for (const c of conversations) {
      let carBooking: any = null;
      let car: any = null;

      if (c.conversationType === 'CAR_RENTAL' || c.businessType === 'car_rental') {
        if (c.carBookingId) {
          carBooking = await CarBookingModel.findById(c.carBookingId).lean();
        }
        if (!carBooking) {
          carBooking = await CarBookingModel.findOne({
            customerId: userObjectId,
            agencyId: c.agencyId?._id || c.agencyId,
            isDeleted: false,
          }).sort({ createdAt: -1 }).lean();
        }
        const carId = carBooking?.carId || c.carId;
        if (carId) {
          car = await CarModel.findById(carId).lean();
        }
      }

      const messages = await MessageModel.find({
        conversationId: c._id,
        isDeleted: false,
      })
        .sort({ createdAt: 1 })
        .limit(50)
        .lean();

      formattedList.push(this.formatConversation(c, messages, carBooking, car));
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
        .populate('agencyId', 'businessName name agencyDisplayName logo isVerified phone whatsappNumber supportMessage email profile updatedAt')
        .populate('bookingId', 'bookingId packageName destination tripStartDate tripEndDate')
        .lean();
    }

    if (!conv) {
      // Fallback: search conversations list
      const list = await this.getCustomerConversations(userId);
      const matched = list.find((c) => c.id === conversationId || c.bookingId === conversationId || c.vehicleBooking?.bookingId === conversationId);
      if (matched) return matched;
      if (list.length > 0) return list[0];
      throw new NotFoundError('Conversation not found');
    }

    // Mark customer unread as 0
    await ConversationModel.updateOne(
      { _id: conv._id },
      { $set: { unreadCustomerCount: 0 } }
    );

    let carBooking: any = null;
    let car: any = null;

    if (conv.conversationType === 'CAR_RENTAL' || conv.businessType === 'car_rental') {
      if (conv.carBookingId) {
        carBooking = await CarBookingModel.findById(conv.carBookingId).lean();
      }
      if (!carBooking) {
        carBooking = await CarBookingModel.findOne({
          customerId: userObjectId,
          agencyId: conv.agencyId?._id || conv.agencyId,
          isDeleted: false,
        }).sort({ createdAt: -1 }).lean();
      }
      const carId = carBooking?.carId || conv.carId;
      if (carId) {
        car = await CarModel.findById(carId).lean();
      }
    }

    const messages = await MessageModel.find({
      conversationId: conv._id,
      isDeleted: false,
    })
      .sort({ createdAt: 1 })
      .limit(100)
      .lean();

    return this.formatConversation(conv, messages, carBooking, car);
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
        conversationType: 'PACKAGE',
        businessType: 'agency',
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

  /**
   * 4. Initialize or Get Conversation with Agency Provider (e.g. for Car Rental or Package)
   */
  public async initOrGetConversation(
    userId: string,
    payload: { agencyId?: string; carId?: string; initialMessage?: string; conversationType?: 'PACKAGE' | 'CAR_RENTAL' }
  ): Promise<{ conversationId: string; id: string }> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    let agencyObjectId: mongoose.Types.ObjectId | null = null;

    if (payload.agencyId && mongoose.Types.ObjectId.isValid(payload.agencyId)) {
      agencyObjectId = new mongoose.Types.ObjectId(payload.agencyId);
    } else {
      const firstAgency = await AgencyModel.findOne().lean();
      if (firstAgency) agencyObjectId = firstAgency._id as any;
    }

    if (!agencyObjectId) {
      throw new BadRequestError('Agency provider not found');
    }

    const isCarRental = Boolean(payload.carId || payload.conversationType === 'CAR_RENTAL');
    const convType = isCarRental ? 'CAR_RENTAL' : 'PACKAGE';
    const bizType = isCarRental ? 'car_rental' : 'agency';

    let conv = await ConversationModel.findOne({
      agencyId: agencyObjectId,
      customerId: userObjectId,
      conversationType: convType,
      isDeleted: false,
    });

    if (!conv) {
      conv = await ConversationModel.create({
        agencyId: agencyObjectId,
        customerId: userObjectId,
        conversationType: convType,
        businessType: bizType,
        carId: payload.carId ? new mongoose.Types.ObjectId(payload.carId) : undefined,
        lastMessagePreview: payload.initialMessage || (isCarRental ? 'Vehicle reservation inquiry started' : 'Inquiry started'),
        lastMessageAt: new Date(),
        lastSender: 'customer',
        unreadAgencyCount: payload.initialMessage ? 1 : 0,
        unreadCustomerCount: 0,
      });
    }

    if (payload.initialMessage && payload.initialMessage.trim()) {
      await MessageModel.create({
        conversationId: conv._id,
        senderType: 'customer',
        senderId: userObjectId,
        receiverId: agencyObjectId,
        text: payload.initialMessage.trim(),
        messageType: 'text',
        status: 'sent',
      });
      conv.lastMessagePreview = payload.initialMessage.trim();
      conv.lastMessageAt = new Date();
      conv.lastSender = 'customer';
      conv.unreadAgencyCount = (conv.unreadAgencyCount || 0) + 1;
      await conv.save();
    }

    return {
      conversationId: conv._id.toString(),
      id: conv._id.toString(),
    };
  }

  /**
   * 4. Get Agency Contact info for communication actions (Call & WhatsApp)
   * Resolves targetId which can be a bookingId, conversationId, carBookingId, or agencyId.
   * Returns registered MongoDB phone, WhatsApp, real-time socket presence, and dynamic support message.
   */
  public async getAgencyContact(userId: string, targetId: string): Promise<any> {
    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : null;

    let targetAgencyId: any = null;
    let bookingRefId: string | null = null;
    let packageName: string | null = null;

    // 1. Try finding by Booking (bookingId string or _id)
    if (targetId) {
      const bookingQuery: any = { isDeleted: false };
      if (mongoose.Types.ObjectId.isValid(targetId)) {
        bookingQuery.$or = [{ _id: new mongoose.Types.ObjectId(targetId) }, { bookingId: targetId }];
      } else {
        bookingQuery.bookingId = targetId;
      }
      const booking = await BookingModel.findOne(bookingQuery).lean();
      if (booking) {
        targetAgencyId = booking.agencyId;
        bookingRefId = booking.bookingId;
        packageName = booking.packageName;
      }
    }

    // 2. Try finding by CarBooking
    if (!targetAgencyId && targetId) {
      const carBookingQuery: any = { isDeleted: false };
      if (mongoose.Types.ObjectId.isValid(targetId)) {
        carBookingQuery.$or = [{ _id: new mongoose.Types.ObjectId(targetId) }, { bookingId: targetId }];
      } else {
        carBookingQuery.bookingId = targetId;
      }
      const carBooking = await CarBookingModel.findOne(carBookingQuery).lean();
      if (carBooking) {
        targetAgencyId = carBooking.agencyId;
        bookingRefId = carBooking.bookingId;
        packageName = (carBooking as any).carName || 'Vehicle Rental';
      }
    }

    // 3. Try finding by Conversation
    if (!targetAgencyId && targetId && mongoose.Types.ObjectId.isValid(targetId)) {
      const conv = await ConversationModel.findOne({
        _id: new mongoose.Types.ObjectId(targetId),
        isDeleted: false,
      }).lean();

      if (conv) {
        targetAgencyId = conv.agencyId;
        if (conv.bookingId) {
          const linkedBooking = await BookingModel.findById(conv.bookingId).lean();
          if (linkedBooking) {
            bookingRefId = linkedBooking.bookingId;
            packageName = linkedBooking.packageName;
          }
        } else if (conv.carBookingId) {
          const linkedCarBooking = await CarBookingModel.findById(conv.carBookingId).lean();
          if (linkedCarBooking) {
            bookingRefId = linkedCarBooking.bookingId;
            packageName = (linkedCarBooking as any).carName || 'Vehicle Rental';
          }
        }
      }
    }

    // 4. Try finding directly by Agency ID
    if (!targetAgencyId && targetId) {
      if (mongoose.Types.ObjectId.isValid(targetId)) {
        const directAgency = await AgencyModel.findById(targetId).lean();
        if (directAgency) {
          targetAgencyId = directAgency._id;
        }
      } else {
        const directAgency = await AgencyModel.findOne({ agencyId: targetId }).lean();
        if (directAgency) {
          targetAgencyId = directAgency._id;
        }
      }
    }

    // 5. Fallback: If still not found and userObjectId exists, check recent user booking
    if (!targetAgencyId && userObjectId) {
      const recentBooking = await BookingModel.findOne({ userId: userObjectId, isDeleted: false })
        .sort({ createdAt: -1 })
        .lean();
      if (recentBooking) {
        targetAgencyId = recentBooking.agencyId;
        bookingRefId = recentBooking.bookingId;
        packageName = recentBooking.packageName;
      }
    }

    // 6. Last fallback: First available agency in system
    if (!targetAgencyId) {
      const anyAgency = await AgencyModel.findOne().lean();
      if (anyAgency) {
        targetAgencyId = anyAgency._id;
      }
    }

    if (!targetAgencyId) {
      throw new NotFoundError('Agency contact information not found');
    }

    const agency = await AgencyModel.findById(targetAgencyId).lean();
    if (!agency) {
      throw new NotFoundError('Agency not found in database');
    }

    // Real registered phone from MongoDB
    const registeredPhone = agency.phone?.trim() || agency.profile?.phone?.trim() || null;

    // Real registered WhatsApp number from MongoDB
    const registeredWhatsApp = agency.whatsappNumber?.trim() || agency.profile?.phone?.trim() || agency.phone?.trim() || null;

    // Real-time socket presence
    const isOnline = socketService.isUserOnline(agency._id.toString());
    const onlineStatus = isOnline ? 'online' : 'offline';

    // Support message dynamic formulation with booking ID
    const activeBookingCode = bookingRefId || 'BK-2026-10234';
    let supportMessage = agency.supportMessage?.trim() || '';
    if (supportMessage) {
      supportMessage = supportMessage.replace(/%BOOKING_ID%|\{bookingId\}|\{booking_id\}/gi, activeBookingCode);
    } else {
      supportMessage = bookingRefId
        ? `Hello, I have a question regarding my booking ${bookingRefId}.`
        : 'Hello, I have a question regarding my travel booking.';
    }

    return {
      agencyId: agency._id.toString(),
      agencyName: agency.agencyDisplayName || agency.businessName || agency.name || 'ApnaTrip Travel Agency',
      agencyLogo: agency.logo || agency.profile?.logoUrl || null,
      isVerified: Boolean(agency.isVerified ?? true),
      phoneNumber: registeredPhone,
      whatsappNumber: registeredWhatsApp,
      onlineStatus,
      isOnline,
      lastSeen: agency.updatedAt ? new Date(agency.updatedAt).toISOString() : null,
      supportMessage,
      bookingId: bookingRefId || null,
      packageName: packageName || null,
    };
  }
}

export const customerChatService = new CustomerChatService();

