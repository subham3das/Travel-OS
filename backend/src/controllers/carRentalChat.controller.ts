import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ConversationModel } from '../models/conversation.model.js';
import { MessageModel } from '../models/message.model.js';
import { CarBookingModel } from '../models/carBooking.model.js';
import { CarModel } from '../models/car.model.js';
import { socketService } from '../services/socket.service.js';
import { cloudinaryStorage } from '../storage/cloudinary.storage.js';
import { CLOUDINARY_FOLDERS } from '../config/cloudinary.config.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';
import { BadRequestError, NotFoundError } from '../utils/errors.util.js';

/**
 * Car Rental Chat Controller
 * All queries are scoped to: { agencyId, conversationType: 'CAR_RENTAL' / businessType: 'car_rental' }
 * Conversations are strictly between Car Rental Provider (agency) and Customers who made vehicle bookings.
 */
export class CarRentalChatController {
  /**
   * GET /api/agencies/car-rental/conversations
   */
  public async getConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agencyId = new mongoose.Types.ObjectId(req.agency!._id.toString());
      const filter = String(req.query.filter || 'All');
      const search = req.query.search ? String(req.query.search).trim() : '';

      const query: any = {
        agencyId,
        $or: [{ businessType: 'car_rental' }, { conversationType: 'CAR_RENTAL' }],
        isDeleted: false,
        isArchived: filter === 'Archived',
      };

      if (filter === 'Unread') query.unreadAgencyCount = { $gt: 0 };
      if (filter === 'Bookings') query.$or = [{ carBookingId: { $ne: null } }, { bookingId: { $ne: null } }];

      const conversations = await ConversationModel.find(query)
        .populate({ path: 'customerId', select: 'fullName email phone avatar profileImage' })
        .sort({ lastMessageAt: -1 })
        .lean();

      const totalUnread = await ConversationModel.countDocuments({
        agencyId,
        $or: [{ businessType: 'car_rental' }, { conversationType: 'CAR_RENTAL' }],
        isDeleted: false,
        unreadAgencyCount: { $gt: 0 },
      });

      const filtered = conversations.filter((conv: any) => {
        if (!search) return true;
        const customerName = (conv.customerId as any)?.fullName || '';
        return customerName.toLowerCase().includes(search.toLowerCase());
      });

      const enriched = await Promise.all(
        filtered.map(async (conv: any) => {
          const customer = conv.customerId as any;
          const customerIdStr: string = customer?._id?.toString() || (conv.customerId ? conv.customerId.toString() : '');
          const isOnline = customerIdStr ? socketService.isUserOnline(customerIdStr) : false;

          let carBooking: any = null;
          let car: any = null;

          if (conv.carBookingId) {
            carBooking = await CarBookingModel.findById(conv.carBookingId).lean();
          }
          if (!carBooking && customerIdStr) {
            carBooking = await CarBookingModel.findOne({
              agencyId,
              customerId: customer?._id || new mongoose.Types.ObjectId(customerIdStr),
              isDeleted: false,
            }).sort({ createdAt: -1 }).lean();
          }

          const carId = carBooking?.carId || conv.carId;
          if (carId) {
            car = await CarModel.findById(carId).lean();
          }

          const vehicleName = car?.name || carBooking?.carName || 'Rental Vehicle';
          const vehicleImage = car?.thumbnail || car?.images?.[0] || '';

          return {
            id: conv._id.toString(),
            customerId: customerIdStr,
            customerName: customer?.fullName || 'Customer',
            customerAvatar:
              customer?.avatar ||
              customer?.profileImage ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(customer?.fullName || 'Customer')}`,
            bookingId: carBooking?.bookingId || (conv.carBookingId ? conv.carBookingId.toString() : 'DIRECT'),
            tripName: vehicleName,
            lastMessage: conv.lastMessagePreview || 'No messages yet',
            lastMessageTime: conv.lastMessageAt ? formatTimeAgo(conv.lastMessageAt) : 'Now',
            unreadCount: conv.unreadAgencyCount || 0,
            isOnline,
            conversationType: 'CAR_RENTAL',
            vehicleBooking: {
              bookingId: carBooking?.bookingId || 'DIRECT',
              vehicleName,
              vehicleImage,
              pickupLocation: carBooking?.pickupLocation || 'Pickup Hub',
              dropLocation: carBooking?.dropLocation || 'Drop Hub',
              pickupDate: carBooking?.startDate ? new Date(carBooking.startDate).toLocaleDateString('en-IN') : '',
              pickupTime: carBooking?.pickupTime || '10:00 AM',
              returnDate: carBooking?.endDate ? new Date(carBooking.endDate).toLocaleDateString('en-IN') : '',
              depositPaid: carBooking?.depositPaid || 0,
              remainingAmount: carBooking?.remainingAmount || 0,
              totalAmount: carBooking?.totalAmount || 0,
              driverName: carBooking?.driverName || car?.driver?.name || 'Assigned Chauffeur',
              driverPhone: carBooking?.driverPhone || car?.driver?.phone || '',
              paymentStatus: carBooking?.paymentStatus || 'DEPOSIT_PAID',
              bookingStatus: carBooking?.bookingStatus || 'CONFIRMED',
              specialNotes: carBooking?.specialNotes || '',
            },
            customerInfo: {
              customerId: customerIdStr,
              name: customer?.fullName || 'Customer',
              avatar: customer?.avatar || customer?.profileImage || '',
              phone: customer?.phone || '',
              email: customer?.email || '',
              bookingId: carBooking?.bookingId || 'DIRECT',
              vehicleName,
              vehicleImage,
              packageName: vehicleName,
              departureDate: carBooking?.startDate ? new Date(carBooking.startDate).toLocaleDateString('en-IN') : '',
              pickupLocation: carBooking?.pickupLocation || '',
              dropLocation: carBooking?.dropLocation || '',
              pickupTime: carBooking?.pickupTime || '10:00 AM',
              returnDate: carBooking?.endDate ? new Date(carBooking.endDate).toLocaleDateString('en-IN') : '',
              depositPaid: carBooking?.depositPaid || 0,
              remainingAmount: carBooking?.remainingAmount || 0,
              totalAmount: carBooking?.totalAmount || 0,
              driverName: carBooking?.driverName || car?.driver?.name || 'Assigned Chauffeur',
              driverPhone: carBooking?.driverPhone || car?.driver?.phone || '',
              paymentStatus: carBooking?.paymentStatus === 'FULL_PAID' ? 'Full Paid' : (carBooking?.paymentStatus === 'DEPOSIT_PAID' ? 'Deposit Paid' : 'Pending'),
              bookingStatus: carBooking?.bookingStatus || 'CONFIRMED',
              isVIP: false,
              tripStatus: 'Upcoming',
              emergencyContact: { name: '', relationship: '', phone: '' },
              companions: [],
              privateNotes: [],
            },
          };
        })
      );

      ResponseUtil.success(res, enriched, 'Car Rental conversations fetched', HTTP_STATUS.OK, {
        pagination: { total: enriched.length, page: 1, limit: 50, totalPages: 1 },
        unreadCount: totalUnread,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/agencies/car-rental/conversations/:conversationId
   */
  public async getConversationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agencyId = new mongoose.Types.ObjectId(req.agency!._id.toString());
      const convId = String(req.params.conversationId);

      const conv = await ConversationModel.findOne({
        _id: new mongoose.Types.ObjectId(convId),
        agencyId,
        $or: [{ businessType: 'car_rental' }, { conversationType: 'CAR_RENTAL' }],
        isDeleted: false,
      })
        .populate({ path: 'customerId', select: 'fullName email phone avatar profileImage' })
        .lean();

      if (!conv) throw new NotFoundError('Conversation not found');

      let carBooking: any = null;
      let car: any = null;

      if (conv.carBookingId) {
        carBooking = await CarBookingModel.findById(conv.carBookingId).lean();
      }
      if (!carBooking && conv.customerId) {
        const custId = (conv.customerId as any)._id || conv.customerId;
        carBooking = await CarBookingModel.findOne({
          agencyId,
          customerId: custId,
          isDeleted: false,
        }).sort({ createdAt: -1 }).lean();
      }

      const carId = carBooking?.carId || conv.carId;
      if (carId) {
        car = await CarModel.findById(carId).lean();
      }

      ResponseUtil.success(res, { ...conv, carBooking, car }, 'Conversation retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/agencies/car-rental/conversations/:conversationId/messages
   */
  public async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agencyId = new mongoose.Types.ObjectId(req.agency!._id.toString());
      const convId = String(req.params.conversationId);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 50;

      // Verify ownership with businessType guard
      const conv = await ConversationModel.findOne({
        _id: new mongoose.Types.ObjectId(convId),
        agencyId,
        businessType: 'car_rental',
        isDeleted: false,
      }).lean();
      if (!conv) throw new NotFoundError('Conversation not found');

      const skip = (page - 1) * limit;
      const convObjectId = new mongoose.Types.ObjectId(convId);

      const messages = await MessageModel.find({ conversationId: convObjectId })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await MessageModel.countDocuments({ conversationId: convObjectId });

      const mapped = messages.map((m: any) => ({
        id: m._id.toString(),
        conversationId: convId,
        sender:
          m.senderType === 'agency' || m.senderType === 'car_rental' ? 'agency' : 'customer',
        text: m.text || m.content || '',
        timestampText: m.createdAt ? formatTimeAgo(m.createdAt) : 'Now',
        status: m.status || 'delivered',
        type: m.messageType || m.type || 'text',
        attachment:
          m.attachments?.[0]
            ? {
                type: m.attachments[0].fileType || 'document',
                url: m.attachments[0].secureUrl,
                fileName: m.attachments[0].fileName,
              }
            : undefined,
      }));

      ResponseUtil.success(res, mapped, 'Messages retrieved', HTTP_STATUS.OK, {
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/agencies/car-rental/conversations/:conversationId/messages
   */
  public async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agencyId = new mongoose.Types.ObjectId(req.agency!._id.toString());
      const convId = String(req.params.conversationId);
      const { text, messageType, attachments } = req.body;

      const conv = await ConversationModel.findOne({
        _id: new mongoose.Types.ObjectId(convId),
        agencyId,
        businessType: 'car_rental',
        isDeleted: false,
      });
      if (!conv) throw new NotFoundError('Conversation not found');

      const message = await MessageModel.create({
        conversationId: conv._id,
        senderId: req.agency!._id,
        senderType: 'car_rental',
        senderName:
          req.agency!.agencyDisplayName || req.agency!.name || 'Car Rental Provider',
        text: text || '',
        content: text || '',
        messageType: messageType || 'text',
        type: messageType || 'text',
        attachments: attachments || [],
        status: 'delivered',
      });

      conv.lastMessageAt = new Date();
      conv.lastMessagePreview = text || (messageType === 'image' ? 'Photo' : 'Attachment');
      conv.lastSender = 'car_rental' as any;
      conv.unreadCustomerCount = (conv.unreadCustomerCount || 0) + 1;
      await conv.save();

      // Emit via socket
      const io = (global as any).io;
      if (io) {
        io.to(`conversation_${convId}`).emit('new_message', {
          id: message._id.toString(),
          conversationId: convId,
          sender: 'agency',
          text: text || '',
          timestampText: 'Just now',
          status: 'delivered',
          type: messageType || 'text',
          attachments,
        });
      }

      ResponseUtil.success(
        res,
        {
          id: message._id.toString(),
          conversationId: convId,
          sender: 'agency',
          text: text || '',
          timestampText: 'Just now',
          status: 'delivered',
          type: messageType || 'text',
        },
        'Message sent',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/agencies/car-rental/conversations/:conversationId/read
   */
  public async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agencyId = new mongoose.Types.ObjectId(req.agency!._id.toString());
      const convId = String(req.params.conversationId);

      await ConversationModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(convId),
          agencyId,
          businessType: 'car_rental',
          isDeleted: false,
        },
        { $set: { unreadAgencyCount: 0 } }
      );

      ResponseUtil.success(res, { unreadCount: 0 }, 'Marked as read');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/agencies/car-rental/messages/upload
   * Uses cloudinaryStorage.uploadImage (same as agencyChat controller)
   */
  public async uploadAttachment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;
      if (!file) throw new BadRequestError('No file provided');

      let fileType: 'image' | 'pdf' | 'document' = 'document';
      if (file.mimetype.startsWith('image/')) fileType = 'image';
      else if (file.mimetype.includes('pdf')) fileType = 'pdf';

      const result = await cloudinaryStorage.uploadImage(file.buffer, {
        folder: CLOUDINARY_FOLDERS.MISC,
      });

      const sizeInKB = `${(file.size / 1024).toFixed(1)} KB`;

      ResponseUtil.success(
        res,
        {
          secureUrl: result.secureUrl,
          publicId: result.publicId,
          fileName: file.originalname,
          fileSize: sizeInKB,
          mimeType: file.mimetype,
          fileType,
        },
        'File uploaded',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export const carRentalChatController = new CarRentalChatController();
