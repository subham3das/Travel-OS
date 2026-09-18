import { Request, Response } from 'express';
import { customerChatService } from '../services/customerChat.service.js';

export class CustomerChatController {
  public async getConversations(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const conversations = await customerChatService.getCustomerConversations(userId);
    res.status(200).json({
      success: true,
      data: { conversations },
    });
  }

  public async getConversationById(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const conversationId = String(req.params.id || '');
    const conversation = await customerChatService.getConversationById(userId, conversationId);
    res.status(200).json({
      success: true,
      data: { conversation },
    });
  }

  public async sendMessage(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const conversationId = String(req.params.id || req.body.conversationId || '');
    const { text, attachments } = req.body;

    const message = await customerChatService.sendMessage(userId, {
      conversationId,
      text: text || '',
      attachments,
    });

    res.status(201).json({
      success: true,
      data: { message },
    });
  }
}

export const customerChatController = new CustomerChatController();
