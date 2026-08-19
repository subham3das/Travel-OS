import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SupportKPIStats,
  SupportTicketItem,
  SupportAnalyticsData,
  SupportTicketStatus,
  SupportMessageSenderType,
} from '../../types/supportManagement';
import { adminSupportManagementService } from '../../services/adminSupportManagement.service';
import {
  initialSupportKPIStats,
  initialSupportTickets,
  initialSupportAnalytics,
} from '../../data/supportData';
import { AdminSupportHeader } from '../../components/super-admin/support/AdminSupportHeader';
import { SupportKPIStatsCards } from '../../components/super-admin/support/SupportKPIStats';
import { SupportTicketQueue } from '../../components/super-admin/support/SupportTicketQueue';
import { SupportAnalyticsDashboard } from '../../components/super-admin/support/SupportAnalyticsDashboard';
import { SupportConversationWorkspace } from '../../components/super-admin/support/SupportConversationWorkspace';
import { CreateAnnouncementModal } from '../../components/super-admin/community/CreateAnnouncementModal';
import { AnnouncementPayload } from '../../types/communityManagement';

export const AdminSupportPage: React.FC = () => {
  // ── 1. STATE MANAGEMENT ──
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');

  // Modals state
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);

  // Data States
  const [kpiStats, setKpiStats] = useState<SupportKPIStats>(initialSupportKPIStats);
  const [tickets, setTickets] = useState<SupportTicketItem[]>(initialSupportTickets);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketItem>(initialSupportTickets[0]);
  const [analytics, setAnalytics] = useState<SupportAnalyticsData>(initialSupportAnalytics);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 2. DATA FETCHING ──
  const loadSupportData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [stats, ticketList, analyticsData] = await Promise.all([
        adminSupportManagementService.getKPIStats(),
        adminSupportManagementService.getTickets({
          status: statusFilter as any,
          search: searchQuery,
          sortBy: sortBy as any,
        }),
        adminSupportManagementService.getAnalytics(),
      ]);

      setKpiStats(stats);
      setTickets(ticketList);
      setAnalytics(analyticsData);

      if (ticketList.length > 0 && (!selectedTicket || !ticketList.some((t: SupportTicketItem) => t.id === selectedTicket.id))) {
        setSelectedTicket(ticketList[0]);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load support dashboard data', 'error');
    } finally {
      setIsRefreshing(false);
    }
  }, [statusFilter, searchQuery, sortBy, selectedTicket]);

  useEffect(() => {
    loadSupportData();
  }, [loadSupportData]);

  // ── 3. OPERATIONAL ACTIONS ──
  const handleStatusChange = async (status: SupportTicketStatus) => {
    if (!selectedTicket) return;
    const updated = await adminSupportManagementService.updateTicketStatus(selectedTicket.id, status);
    setSelectedTicket(updated);
    loadSupportData();
    showToast(`Ticket ${selectedTicket.id} status updated to ${status}`, 'success');
  };

  const handleSendMessage = async (text: string, senderType: SupportMessageSenderType) => {
    if (!selectedTicket) return;
    const updated = await adminSupportManagementService.addMessage(selectedTicket.id, {
      senderType,
      senderName: senderType === 'internal_note' ? 'Neha Sharma' : 'Super Admin',
      senderRole: senderType === 'agent' ? 'Support Agent' : undefined,
      text,
    });
    setSelectedTicket(updated);
    loadSupportData();
    showToast(
      senderType === 'internal_note' ? 'Internal note added to staff log' : 'Reply sent to customer',
      'success'
    );
  };

  const handleCreateAnnouncementSubmit = (payload: AnnouncementPayload) => {
    showToast(`Announcement "${payload.title}" dispatched to ${payload.audience}`, 'success');
  };

  // ── 4. EXPORT ──
  const handleExport = () => {
    const headers = ['Ticket ID', 'Customer', 'Category', 'Priority', 'Status', 'Channel', 'Created At'];
    const rows = tickets.map((t) => [
      t.id,
      `"${t.customer.name}"`,
      `"${t.category}"`,
      t.priority,
      t.status,
      t.channel,
      `"${t.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `travelos_support_tickets_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Support ticket report exported to CSV', 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5 select-none"
    >
      {/* ── TOAST NOTIFICATIONS ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 shadow-xl"
          >
            <div
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg ${
                toast.type === 'success'
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : toast.type === 'error'
                  ? 'bg-rose-600 text-white shadow-rose-500/20'
                  : 'bg-[#6356E5] text-white shadow-[#6356E5]/20'
              }`}
            >
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. PAGE HEADER ── */}
      <AdminSupportHeader
        onExport={handleExport}
        onRefresh={loadSupportData}
        onCreateAnnouncement={() => setIsAnnouncementOpen(true)}
        isRefreshing={isRefreshing}
      />

      {/* ── 2. 6 KPI SUMMARY CARDS ── */}
      <SupportKPIStatsCards
        stats={kpiStats}
        onCardClick={(id) => {
          if (id === 'criticalTickets') setStatusFilter('Escalated');
          else if (id === 'openTickets') setStatusFilter('Open');
          else setStatusFilter('All');
        }}
      />

      {/* ── 3. MAJOR 3-COLUMN LAYOUT (TICKET QUEUE | SUPPORT ANALYTICS | CONVERSATION) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column (Ticket Queue ≈22%) */}
        <div className="lg:col-span-3">
          <SupportTicketQueue
            tickets={tickets}
            selectedTicketId={selectedTicket?.id}
            onSelectTicket={(t) => setSelectedTicket(t)}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onLoadMore={() => showToast('Loaded additional ticket backlog', 'info')}
          />
        </div>

        {/* Center Column (Support Analytics Dashboard ≈43%) */}
        <div className="lg:col-span-5">
          <SupportAnalyticsDashboard
            analytics={analytics}
            onViewAllAgents={() => showToast('Opening complete support agent directory', 'info')}
          />
        </div>

        {/* Right Column (Conversation Workspace ≈35%) */}
        <div className="lg:col-span-4 sticky top-20">
          {selectedTicket ? (
            <SupportConversationWorkspace
              ticket={selectedTicket}
              onStatusChange={handleStatusChange}
              onSendMessage={handleSendMessage}
              onClose={() => setSelectedTicket(tickets[0])}
            />
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-100/90 text-center text-slate-400 font-bold text-xs">
              Select a ticket from the queue to start conversation
            </div>
          )}
        </div>
      </div>

      {/* ── 4. CREATE ANNOUNCEMENT MODAL ── */}
      <CreateAnnouncementModal
        isOpen={isAnnouncementOpen}
        onClose={() => setIsAnnouncementOpen(false)}
        onPublish={handleCreateAnnouncementSubmit}
      />
    </motion.div>
  );
};

export default AdminSupportPage;
