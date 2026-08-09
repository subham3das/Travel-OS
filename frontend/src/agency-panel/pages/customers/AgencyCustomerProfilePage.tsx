import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Phone, Mail, ChevronRight } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';

import { CustomerOverviewCard } from '../../components/customers/CustomerOverviewCard';
import { LoyaltyCard } from '../../components/customers/LoyaltyCard';
import { TripHistoryCard } from '../../components/customers/TripHistoryCard';
import { BookingHistoryCard } from '../../components/customers/BookingHistoryCard';
import { ReviewCard } from '../../components/customers/ReviewCard';
import { AgencyNotesCard } from '../../components/customers/AgencyNotesCard';
import { EmergencyContactCard } from '../../components/customers/EmergencyContactCard';
import { TravelPreferenceCard } from '../../components/customers/TravelPreferenceCard';
import { CustomerQuickActionsBar } from '../../components/customers/CustomerQuickActionsBar';

import { MOCK_CUSTOMERS, Customer, AgencyNoteItem } from '../../data/customers';

/**
 * Agency Customer Profile Detail Page
 * Route: /agency/customers/:customerId (Protected: APPROVED agencies only)
 *
 * Displays full 360-degree profile for a customer:
 * 1. Overview
 * 2. Loyalty Summary
 * 3. Trip History
 * 4. Booking History
 * 5. Customer Reviews
 * 6. Agency Private Notes (Add / Edit / Delete)
 * 7. Emergency Contact
 * 8. Travel Preferences
 * 9. Quick Actions
 */
export const AgencyCustomerProfilePage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();

  const foundCustomer = MOCK_CUSTOMERS.find((c) => c.id === customerId) || MOCK_CUSTOMERS[0];
  const [customer, setCustomer] = useState<Customer>(foundCustomer);

  // Note Handlers
  const handleAddNote = (noteText: string) => {
    const newNote: AgencyNoteItem = {
      id: `n-${Date.now()}`,
      noteText,
      author: 'Agency Staff',
      createdAt: 'Just now',
    };
    setCustomer((prev) => ({
      ...prev,
      notes: [newNote, ...prev.notes],
    }));
  };

  const handleEditNote = (id: string, newText: string) => {
    setCustomer((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === id ? { ...n, noteText: newText } : n)),
    }));
  };

  const handleDeleteNote = (id: string) => {
    setCustomer((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
    }));
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-12">
        <DashboardHeader />

        {/* Sticky Page Header */}
        <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-[3.5rem] z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/agency/customers')}
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Back to Customer List"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#583BE8] font-bold">Customers</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <h2 className="text-base sm:text-lg font-black text-[#0F172A]">{customer.name}</h2>
              </div>
              <p className="text-[11px] font-semibold text-slate-400">360-Degree Customer Profile & Travel History</p>
            </div>
          </div>
        </div>

        {/* Main Content Body */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* 1. Customer Overview Section */}
            <CustomerOverviewCard customer={customer} />

            {/* 2. Loyalty Summary Section */}
            <LoyaltyCard customer={customer} />

            {/* 3. Quick Actions */}
            <CustomerQuickActionsBar customer={customer} />

            {/* 4. Trip History Section */}
            <TripHistoryCard tripHistory={customer.tripHistory} />

            {/* 5. Booking History Section */}
            <BookingHistoryCard bookingHistory={customer.bookingHistory} />

            {/* 6. Reviews Section */}
            <ReviewCard reviews={customer.reviews} />

            {/* 7. Agency Private Notes Section (Editable) */}
            <AgencyNotesCard
              notes={customer.notes}
              onAddNote={handleAddNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
            />

            {/* 8. Emergency Contact Section */}
            <EmergencyContactCard contact={customer.emergencyContact} />

            {/* 9. Travel Preferences Section */}
            <TravelPreferenceCard preferences={customer.travelPreferences} />
          </motion.div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AgencyCustomerProfilePage;
