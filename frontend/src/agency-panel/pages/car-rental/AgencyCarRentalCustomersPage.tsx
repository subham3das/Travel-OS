import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Car,
  ChevronRight,
  UserCheck,
  Star,
  Clock,
} from 'lucide-react';
import { agencyCarRentalService } from '../../services/agencyCarRental.service';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { useToast } from '../../../user-panel/context/ToastContext';

export const AgencyCarRentalCustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await agencyCarRentalService.getCustomers();
      setCustomers(data);
    } catch (err: any) {
      console.error('Failed to load rental customers:', err);
      showToast(err.message || 'Failed to load customers', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastVehicleName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F8F9FC] overflow-hidden font-sans select-none">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">👥</span>
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                  Rental Customers CRM
                </h1>
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Track repeat rental clients, total spend, booking cadence, and vehicle preferences.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700">
                <span>Total Clients: </span>
                <span className="font-black text-[#583BE8]">{customers.length}</span>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, mobile number, email, or vehicle..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] transition-colors shadow-2xs"
            />
          </div>

          {/* Customers Table / List */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-full border-2 border-[#583BE8]/20 border-t-[#583BE8] animate-spin" />
                <span className="text-xs font-bold text-slate-400">Loading rental CRM data...</span>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black text-[#0F172A]">No rental customers yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  As travelers reserve your fleet vehicles, their CRM records, loyalty tier, and lifetime spend will populate here automatically.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4 text-center">Bookings</th>
                      <th className="py-3.5 px-4">Lifetime Spend</th>
                      <th className="py-3.5 px-4">Last Rental</th>
                      <th className="py-3.5 px-4">Last Vehicle</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredCustomers.map((c, idx) => (
                      <tr key={c.customerId || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#583BE8] to-purple-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                              {c.name?.[0] || 'U'}
                            </div>
                            <span className="font-extrabold text-[#0F172A] block">{c.name}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-[#0F172A] block">{c.phone}</span>
                            <span className="text-[11px] text-slate-400 font-medium block">{c.email}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-[#583BE8] font-black text-xs">
                            {c.bookingsCount} Trip{c.bookingsCount > 1 ? 's' : ''}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-black text-[#0F172A] block">
                            ₹{(c.totalSpent || 0).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold block">Cleared</span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-[#0F172A] block">
                            {c.lastRentalDate
                              ? new Date(c.lastRentalDate).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : 'Recently'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-700 truncate max-w-[160px] block">
                            {c.lastVehicleName || 'Fleet Car'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {c.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default AgencyCarRentalCustomersPage;
