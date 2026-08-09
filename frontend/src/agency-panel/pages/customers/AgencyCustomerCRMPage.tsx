import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Users, Sparkles } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';

import { CustomerHeader } from '../../components/customers/CustomerHeader';
import { CustomerStatsCard } from '../../components/customers/CustomerStatsCard';
import { CustomerSearch } from '../../components/customers/CustomerSearch';
import { CustomerFilterBar, CustomerFilterChip } from '../../components/customers/CustomerFilterBar';
import { CustomerCard } from '../../components/customers/CustomerCard';

import { MOCK_CUSTOMERS, Customer } from '../../data/customers';

/**
 * Agency Customer CRM Page
 * Route: /agency/customers (Protected: APPROVED agencies only)
 *
 * Full Customer Database & CRM matching customer-crm-mobile.png design language exactly.
 * Instant search by Customer Name, Phone Number, Email, or Booking ID.
 * Filter by VIP, Returning, Solo Travelers, Group Travelers, Recently Joined, Inactive.
 * Note: Customer CRM page is NOT included in mobile bottom navigation bar per design directive.
 */
export const AgencyCustomerCRMPage: React.FC = () => {
  const navigate = useNavigate();
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [activeChip, setActiveChip] = useState<CustomerFilterChip>('All');

  // Filter & Search Logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // 1. Instant Search matching Name, Phone, Email, Booking ID
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesPhone = c.phone.includes(q);
        const matchesEmail = c.email.toLowerCase().includes(q);
        const matchesBooking = c.bookingHistory.some((b) => b.bookingId.toLowerCase().includes(q));
        if (!matchesName && !matchesPhone && !matchesEmail && !matchesBooking) {
          return false;
        }
      }

      // 2. Dropdown Status filter
      if (statusFilter !== 'All') {
        if (c.status !== statusFilter) return false;
      }

      // 3. Dropdown Type filter
      if (typeFilter !== 'All') {
        if (c.travelerType !== typeFilter) return false;
      }

      // 4. Filter Chips logic
      if (activeChip === 'VIP') return c.loyaltyBadge === 'VIP Traveler' || c.status === 'VIP';
      if (activeChip === 'Returning') return c.loyaltyBadge === 'Returning Traveler' || c.totalTrips >= 2;
      if (activeChip === 'Solo Travelers') return c.travelerType === 'Solo Traveler';
      if (activeChip === 'Group Travelers') return c.travelerType === 'Group Traveler';
      if (activeChip === 'Recently Joined') return c.loyaltyBadge === 'New Traveler' || c.memberSince.includes('2025');
      if (activeChip === 'Inactive') return c.status === 'Inactive' || c.loyaltyBadge === 'Inactive';

      return true;
    });
  }, [customers, searchTerm, statusFilter, typeFilter, activeChip]);

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Shell */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-12">
        <DashboardHeader />

        {/* Header Bar */}
        <CustomerHeader
          onAddCustomer={() => alert('Add Customer Modal coming soon!')}
          onSearchClick={() => {}}
          onFilterClick={() => {}}
        />

        {/* Main Body */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-5xl mx-auto w-full">
          {/* 1. Summary Cards (4 compact stats cards) */}
          <CustomerStatsCard />

          {/* 2. Instant Search & Filter Dropdowns */}
          <CustomerSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
          />

          {/* 3. Horizontal Filter Chips */}
          <CustomerFilterBar
            activeChip={activeChip}
            onChangeChip={setActiveChip}
          />

          {/* 4. Customer Cards List */}
          <div className="space-y-3">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, idx) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  index={idx}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-10 border border-slate-100/90 text-center space-y-2 shadow-2xs"
              >
                <div className="w-12 h-12 rounded-full bg-purple-50 text-[#583BE8] flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-sm font-extrabold text-slate-400">No customers found</p>
                <p className="text-xs font-semibold text-slate-300">
                  Try adjusting your search query or active filter chips
                </p>
              </motion.div>
            )}
          </div>

          {/* 5. Pagination Footer matching reference image */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-400 select-none">
            <span>
              Showing 1 to {filteredCustomers.length} of 1,248 customers
            </span>

            <div className="flex items-center gap-1.5 font-black">
              <button
                type="button"
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center cursor-pointer shadow-sm"
              >
                1
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors"
              >
                2
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors"
              >
                3
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-700 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Note: Per design spec, this page is NOT included in mobile bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default AgencyCustomerCRMPage;
