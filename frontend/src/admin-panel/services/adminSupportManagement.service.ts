import {
  SupportKPIStats,
  SupportTicketItem,
  SupportAnalyticsData,
  SupportFilters,
  SupportMessage,
  SupportTicketStatus,
} from '../types/supportManagement';
import {
  initialSupportKPIStats,
  initialSupportTickets,
  initialSupportAnalytics,
} from '../data/supportData';

class AdminSupportManagementService {
  private kpiStats: SupportKPIStats = initialSupportKPIStats;
  private tickets: SupportTicketItem[] = initialSupportTickets;
  private analytics: SupportAnalyticsData = initialSupportAnalytics;

  public async getKPIStats(): Promise<SupportKPIStats> {
    return new Promise((resolve) => setTimeout(() => resolve(this.kpiStats), 40));
  }

  public async getTickets(filters?: Partial<SupportFilters>): Promise<SupportTicketItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...this.tickets];

        if (filters?.status && filters.status !== 'All') {
          result = result.filter(
            (t) => t.status.toLowerCase() === filters.status!.toLowerCase()
          );
        }

        if (filters?.priority && filters.priority !== 'All') {
          result = result.filter(
            (t) => t.priority.toLowerCase() === filters.priority!.toLowerCase()
          );
        }

        if (filters?.search && filters.search.trim() !== '') {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (t) =>
              t.id.toLowerCase().includes(q) ||
              t.customer.name.toLowerCase().includes(q) ||
              t.subject.toLowerCase().includes(q) ||
              t.category.toLowerCase().includes(q)
          );
        }

        resolve(result);
      }, 40);
    });
  }

  public async getTicketById(id: string): Promise<SupportTicketItem | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = this.tickets.find((t) => t.id === id);
        resolve(found || this.tickets[0]);
      }, 30);
    });
  }

  public async getAnalytics(): Promise<SupportAnalyticsData> {
    return new Promise((resolve) => setTimeout(() => resolve(this.analytics), 40));
  }

  public async addMessage(
    ticketId: string,
    message: Omit<SupportMessage, 'id' | 'timestamp'>
  ): Promise<SupportTicketItem> {
    const newMessage: SupportMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    this.tickets = this.tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          messages: [...t.messages, newMessage],
          commentsCount: t.commentsCount + 1,
        };
      }
      return t;
    });

    const updated = this.tickets.find((t) => t.id === ticketId);
    return updated || this.tickets[0];
  }

  public async updateTicketStatus(
    ticketId: string,
    status: SupportTicketStatus
  ): Promise<SupportTicketItem> {
    this.tickets = this.tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          status,
          activityLog: [
            ...(t.activityLog || []),
            {
              id: `act-${Date.now()}`,
              action: `Status changed to ${status}`,
              actor: 'Super Admin',
              time: 'Just now',
            },
          ],
        };
      }
      return t;
    });

    const updated = this.tickets.find((t) => t.id === ticketId);
    return updated || this.tickets[0];
  }
}

export const adminSupportManagementService = new AdminSupportManagementService();
