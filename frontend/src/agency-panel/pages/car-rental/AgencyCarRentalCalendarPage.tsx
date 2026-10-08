import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Car,
  Clock,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Filter,
} from 'lucide-react';
import { agencyCarRentalService } from '../../services/agencyCarRental.service';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { useToast } from '../../../user-panel/context/ToastContext';

export const AgencyCarRentalCalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [cars, setCars] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCarFilter, setSelectedCarFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const fetchSchedule = async () => {
    try {
      setIsLoading(true);
      const data = await agencyCarRentalService.getCalendar();
      setCars(data.cars || []);
      setBookings(data.bookings || []);
    } catch (err: any) {
      console.error('Failed to load calendar schedule:', err);
      showToast(err.message || 'Failed to load schedule', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Calendar math
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to check if a booking overlaps a specific day
  const getBookingsForDay = (day: number) => {
    const checkDate = new Date(year, month, day);
    checkDate.setHours(12, 0, 0, 0);

    return bookings.filter((b) => {
      if (selectedCarFilter !== 'all' && b.carId !== selectedCarFilter && b.carId?._id !== selectedCarFilter) {
        return false;
      }
      const start = new Date(b.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(b.endDate);
      end.setHours(23, 59, 59, 999);
      return checkDate >= start && checkDate <= end;
    });
  };

  const filteredCars = selectedCarFilter === 'all' 
    ? cars 
    : cars.filter((c) => c._id === selectedCarFilter);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Persistent Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader />

        <main className="p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-purple-100 text-[#583BE8] text-xs font-bold uppercase tracking-wider">
                  Operations
                </span>
                <span className="text-xs text-slate-400 font-medium">• Vehicle Availability Grid</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Fleet Calendar</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Monitor fleet occupancy, reservation windows, and return schedules in real time.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/agency/car-rental/bookings')}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors shadow-xs"
              >
                View Reservations
              </button>
              <button
                onClick={() => navigate('/agency/car-rental/cars')}
                className="px-4 py-2 bg-[#583BE8] hover:bg-[#472ecc] text-white font-bold text-xs rounded-xl shadow-md shadow-[#583BE8]/20 transition-all flex items-center gap-1.5"
              >
                <Car className="w-4 h-4" />
                <span>Manage Fleet</span>
              </button>
            </div>
          </div>

          {/* Controls Bar: Navigation & Vehicle Filter */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Month Nav */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg hover:bg-white text-slate-600 transition-colors"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={goToToday}
                  className="px-3 py-1 text-xs font-bold text-slate-700 hover:bg-white rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg hover:bg-white text-slate-600 transition-colors"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#583BE8]" />
                {monthNames[month]} {year}
              </h2>
            </div>

            {/* Filter by Vehicle */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-600">Filter Vehicle:</span>
              <select
                value={selectedCarFilter}
                onChange={(e) => setSelectedCarFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 outline-none focus:border-[#583BE8] transition-colors"
              >
                <option value="all">All Vehicles ({cars.length})</option>
                {cars.map((car) => (
                  <option key={car._id} value={car._id}>
                    {car.brand} {car.name} ({car.type.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 text-center text-xs font-black text-slate-500 py-3">
              <span>SUN</span>
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[500px]">
              {/* Empty leading days */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="bg-slate-50/40 min-h-[90px] p-2" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day = idx + 1;
                const isToday =
                  day === new Date().getDate() &&
                  month === new Date().getMonth() &&
                  year === new Date().getFullYear();

                const dayBookings = getBookingsForDay(day);

                return (
                  <div
                    key={`day-${day}`}
                    className={`min-h-[100px] p-2 transition-colors relative flex flex-col ${
                      isToday ? 'bg-purple-50/30 font-bold' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-xs font-bold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          isToday
                            ? 'bg-[#583BE8] text-white shadow-xs'
                            : 'text-slate-700'
                        }`}
                      >
                        {day}
                      </span>
                      {dayBookings.length > 0 && (
                        <span className="text-[10px] font-extrabold text-[#583BE8] bg-purple-100 px-1.5 py-0.5 rounded-full">
                          {dayBookings.length} {dayBookings.length === 1 ? 'trip' : 'trips'}
                        </span>
                      )}
                    </div>

                    {/* Booking Chips */}
                    <div className="space-y-1 flex-1 overflow-y-auto max-h-[90px] scrollbar-none">
                      {dayBookings.map((booking) => {
                        const isRequested = booking.bookingStatus === 'REQUESTED';
                        return (
                          <div
                            key={booking._id || booking.bookingId}
                            onClick={() => setSelectedBooking(booking)}
                            className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer truncate ${
                              isRequested
                                ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
                                : 'bg-purple-50 border-purple-200 text-[#583BE8] hover:bg-purple-100'
                            }`}
                          >
                            <div className="flex items-center gap-1 truncate">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isRequested ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                              <span className="truncate">{booking.customerName || 'Customer'}</span>
                            </div>
                            <div className="text-[9px] text-slate-500 truncate font-normal">
                              {booking.pickupLocation || 'Pickup'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Legend & Fleet Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">Available Fleet</p>
                <p className="text-lg font-black text-slate-900">
                  {cars.filter((c) => c.isAvailable).length} / {cars.length} Vehicles
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-[#583BE8]">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">Active Confirmed Trips</p>
                <p className="text-lg font-black text-slate-900">
                  {bookings.filter((b) => b.bookingStatus === 'ACCEPTED').length} Trips
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">Pending Requests</p>
                <p className="text-lg font-black text-slate-900">
                  {bookings.filter((b) => b.bookingStatus === 'REQUESTED').length} Requests
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Booking Detail Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative"
            >
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-full bg-purple-100 text-[#583BE8] text-xs font-black uppercase">
                  Reservation Detail
                </span>
                <span className="text-xs text-slate-400 font-mono">#{selectedBooking.bookingId || selectedBooking._id?.slice(-6)}</span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-4">
                {selectedBooking.customerName || 'Customer Trip'}
              </h3>

              <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className={`font-bold px-2 py-0.5 rounded-full ${
                    selectedBooking.bookingStatus === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedBooking.bookingStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Pickup Date</span>
                  <span className="font-bold text-slate-800">
                    {new Date(selectedBooking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Drop-off Date</span>
                  <span className="font-bold text-slate-800">
                    {new Date(selectedBooking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Location</span>
                  <span className="font-bold text-slate-800">{selectedBooking.pickupLocation || 'Pickup Point'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Payment Status</span>
                  <span className="font-bold text-slate-800">{selectedBooking.paymentStatus || 'PENDING'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedBooking(null);
                    navigate('/agency/car-rental/bookings');
                  }}
                  className="w-full py-2.5 bg-[#583BE8] hover:bg-[#472ecc] text-white font-bold text-xs rounded-xl shadow-md shadow-[#583BE8]/20 transition-colors text-center"
                >
                  Manage in Reservations
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <BottomNavigation />
    </div>
  );
};

export default AgencyCarRentalCalendarPage;
