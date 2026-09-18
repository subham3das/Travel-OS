import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';
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

import { MOCK_CUSTOMERS, Customer } from '../../data/customers';
import { agencyCustomersService } from '../../services/agencyCustomers.service';

/**
 * Agency Customer Profile Detail Page
 * Route: /agency/customers/:customerId (Protected: APPROVED agencies only)
 */
export const AgencyCustomerProfilePage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer>(MOCK_CUSTOMERS[0]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomer = useCallback(async () => {
    if (!customerId) return;
    try {
      setIsLoading(true);
      const data = await agencyCustomersService.getCustomerById(customerId);
      setCustomer(data);
    } catch (err) {
      console.error('Failed to load customer dossier from backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  // Note Handlers
  const handleAddNote = async (noteText: string) => {
    if (!customerId) return;
    try {
      const newNote = await agencyCustomersService.addNote(customerId, noteText);
      setCustomer((prev) => ({
        ...prev,
        notes: [newNote, ...prev.notes],
      }));
    } catch (err) {
      console.error('Failed to add customer note in backend:', err);
    }
  };

  const handleEditNote = async (id: string, newText: string) => {
    if (!customerId) return;
    try {
      const updatedNotes = await agencyCustomersService.editNote(customerId, id, newText);
      setCustomer((prev) => ({
        ...prev,
        notes: updatedNotes,
      }));
    } catch (err) {
      console.error('Failed to edit customer note in backend:', err);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!customerId) return;
    try {
      await agencyCustomersService.deleteNote(customerId, id);
      setCustomer((prev) => ({
        ...prev,
        notes: prev.notes.filter((n) => n.id !== id),
      }));
    } catch (err) {
      console.error('Failed to delete customer note in backend:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-12">
        <DashboardHeader />

        {/* Sticky Page Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-[57px] sm:top-[65px] z-20 select-none">
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
          {isLoading ? (
            <div className="p-8 bg-white rounded-3xl border border-slate-100 animate-pulse space-y-4">
              <div className="h-6 bg-slate-100 rounded w-1/3" />
              <div className="h-4 bg-slate-100 rounded w-2/3" />
            </div>
          ) : (
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
          )}
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AgencyCustomerProfilePage;
