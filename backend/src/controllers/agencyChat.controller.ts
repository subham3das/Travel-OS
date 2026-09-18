import { Request, Response, NextFunction } from 'express';
import { agencyChatService } from '../services/agencyChat.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';
import { BadRequestError } from '../utils/errors.util.js';

export class AgencyChatController {
  /**
   * 1. GET /api/agency/conversations
   */
  public async getConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agencyId = req.agency!._id.toString();
      const result = await agencyChatService.getConversations(agencyId, req.query as any);

      ResponseUtil.success(
        res,
        result.conversations,
        'Conversations fetched successfully',
        HTTP_STATUS.OK,
        {
          pagination: result.pagination,
          unreadCount: result.unreadCount,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * 2. GET /api/agency/conversations/:conversationId
   */
  public async getConversationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agencyId = req.agency!._id.toString();
      const conversationId = String(req.params.conversationId);

      const conversation = await agencyChatService.getConversationById(agencyId, conversationId);

      ResponseUtil.success(res, conversation, 'Conversation details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 3. GET /api/agency/conversations/:conversationId/messages
   */
  public async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agencyId = req.agency!._id.toString();
      const conversationId = String(req.params.conversationId);
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 50;

      const result = await agencyChatService.getMessages(agencyId, conversationId, page, limit);

      ResponseUtil.success(
        res,
        result.messages,
        'Messages retrieved successfully',
        HTTP_STATUS.OK,
        {
          pagination: result.pagination,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * 4. POST /api/agency/conversations/:conversationId/messages
   */
  public async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agencyId = req.agency!._id.toString();
      const conversationId = String(req.params.conversationId);

      const author = {
        id: req.agencyUser?.userId || req.agency!._id.toString(),
        name: req.agency!.agencyDisplayName || req.agency!.name || 'Agency Staff',
        email: req.agency!.email,
      };

      const message = await agencyChatService.sendMessage(agencyId, conversationId, author, req.body);

      ResponseUtil.success(res, message, 'Message sent successfully', HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 5. POST /api/agency/conversations/:conversationId/read
   */
  public async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agencyId = req.agency!._id.toString();
      const conversationId = String(req.params.conversationId);

      const result = await agencyChatService.markAsRead(agencyId, conversationId);

      ResponseUtil.success(res, result, 'Conversation marked as read');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 6. POST /api/agency/customers/:customerId/private-notes
   */
  public async createPrivateNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agencyId = req.agency!._id.toString();
      const customerId = String(req.params.customerId);

      const author = {
        id: req.agencyUser?.userId || req.agency!._id.toString(),
        name: req.agency!.agencyDisplayName || req.agency!.name || 'Agency Staff',
        email: req.agency!.email,
      };

      const note = await agencyChatService.createPrivateNote(agencyId, customerId, author, req.body);

      ResponseUtil.success(res, note, 'Staff private note saved successfully', HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 7. PUT /api/agency/customers/:customerId/private-notes/:id
   */
  public async updatePrivateNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agencyId = req.agency!._id.toString();
      const id = String(req.params.id);
      const { note } = req.body;

      const updated = await agencyChatService.updatePrivateNote(agencyId, id, note);

      ResponseUtil.success(res, updated, 'Staff note updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 8. DELETE /api/agency/customers/:customerId/private-notes/:id
   */
  public async deletePrivateNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agencyId = req.agency!._id.toString();
      const id = String(req.params.id);

      const result = await agencyChatService.deletePrivateNote(agencyId, id);

      ResponseUtil.success(res, result, 'Staff note deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 9. POST /api/agency/messages/upload
   */
  public async uploadAttachment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        throw new BadRequestError('No attachment file provided');
      }

      const uploaded = await agencyChatService.uploadAttachment(
        file.buffer,
        file.originalname,
        file.mimetype
      );

      ResponseUtil.success(res, uploaded, 'Attachment uploaded successfully', HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }
}

export const agencyChatController = new AgencyChatController();
