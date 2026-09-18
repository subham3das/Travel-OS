import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';

import { CustomerHeader } from '../../components/customers/CustomerHeader';
import { CustomerStatsCard } from '../../components/customers/CustomerStatsCard';
import { CustomerSearch } from '../../components/customers/CustomerSearch';
import { CustomerFilterBar, CustomerFilterChip } from '../../components/customers/CustomerFilterBar';
import { CustomerCard } from '../../components/customers/CustomerCard';

import { Customer } from '../../data/customers';
import { agencyCustomersService } from '../../services/agencyCustomers.service';

/**
 * Agency Customer CRM Page
 * Route: /agency/customers (Protected: APPROVED agencies only)
 */
export const AgencyCustomerCRMPage: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [activeChip, setActiveChip] = useState<CustomerFilterChip>('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await agencyCustomersService.getCustomers({
        page,
        limit: 20,
        search: searchTerm,
        statusFilter,
        typeFilter,
        activeChip,
      });
      setCustomers(res.customers);
      setTotalPages(res.totalPages);
      setTotalCount(res.total);
    } catch (err) {
      console.error('Failed to load agency customers from backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm, statusFilter, typeFilter, activeChip]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

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
            onSearchChange={(val) => {
              setSearchTerm(val);
              setPage(1);
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
            typeFilter={typeFilter}
            onTypeFilterChange={(val) => {
              setTypeFilter(val);
              setPage(1);
            }}
          />

          {/* 3. Horizontal Filter Chips */}
          <CustomerFilterBar
            activeChip={activeChip}
            onChangeChip={(chip) => {
              setActiveChip(chip);
              setPage(1);
            }}
          />

          {/* 4. Customer Cards List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse space-y-3">
                    <div className="h-5 bg-slate-100 rounded w-1/4" />
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : customers.length > 0 ? (
              customers.map((customer, idx) => (
                <CustomerCard
                  key={customer.id || idx}
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

          {/* 5. Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-400 select-none">
            <span>
              Showing 1 to {customers.length} of {totalCount} customers
            </span>

            <div className="flex items-center gap-1.5 font-black">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 disabled:opacity-40 flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                    page === p
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-700 hover:text-white disabled:opacity-40 flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AgencyCustomerCRMPage;
