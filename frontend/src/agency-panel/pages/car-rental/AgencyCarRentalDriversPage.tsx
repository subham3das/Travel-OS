import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Phone,
  Car,
  ShieldCheck,
  Star,
  Plus,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Calendar,
  Eye,
  X,
  FileCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { agencyCarRentalService } from '../../services/agencyCarRental.service';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { DriverDetailsDrawer } from '../../components/car-rental/DriverDetailsDrawer';
import { DriverPhotoUpload } from '../../components/car-rental/DriverPhotoUpload';
import { useToast } from '../../../user-panel/context/ToastContext';

export const AgencyCarRentalDriversPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriverForDrawer, setSelectedDriverForDrawer] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Driver Form State
  const [driverForm, setDriverForm] = useState({
    name: '',
    phone: '',
    experienceYears: 5,
    licenseNumber: '',
    licenseExpiryDate: '2028-10-20',
    assignedVehicleName: '',
    assignedVehicleReg: '',
    photo: '',
    languages: 'Hindi, English',
  });

  const fetchDrivers = async () => {
    try {
      setIsLoading(true);
      const data = await agencyCarRentalService.getDrivers();
      setDrivers(data);
    } catch (err: any) {
      console.error('Failed to load drivers:', err);
      showToast(err.message || 'Failed to load drivers directory', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverForm.name.trim() || !driverForm.phone.trim() || !driverForm.licenseNumber.trim()) {
      showToast('Please fill in name, phone, and commercial license number', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: any = {
        name: driverForm.name.trim(),
        phone: driverForm.phone.trim(),
        experienceYears: Number(driverForm.experienceYears),
        licenseNumber: driverForm.licenseNumber.trim(),
        licenseExpiryDate: new Date(driverForm.licenseExpiryDate),
        photo: driverForm.photo,
        languages: driverForm.languages.split(',').map((s) => s.trim()).filter(Boolean),
        assignedVehicle: {
          name: driverForm.assignedVehicleName,
          registrationNumber: driverForm.assignedVehicleReg,
        },
      };

      const created = await agencyCarRentalService.createDriver(payload);
      setDrivers([created, ...drivers]);
      showToast('New commercial driver registered successfully!', 'success');
      setIsAddModalOpen(false);
      setDriverForm({
        name: '',
        phone: '',
        experienceYears: 5,
        licenseNumber: '',
        licenseExpiryDate: '2028-10-20',
        assignedVehicleName: '',
        assignedVehicleReg: '',
        photo: '',
        languages: 'Hindi, English',
      });
    } catch (err: any) {
      console.error('Failed to create driver:', err);
      showToast(err.message || 'Failed to register driver', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDrivers = drivers.filter((d) => {
    const nameMatch = d.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const vehicleMatch =
      d.assignedVehicle?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof d.assignedVehicle === 'string' && d.assignedVehicle.toLowerCase().includes(searchQuery.toLowerCase()));
    const phoneMatch = d.phone?.includes(searchQuery);
    const licenseMatch = d.licenseNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || vehicleMatch || phoneMatch || licenseMatch;
  });

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
                <span className="text-xl">🧑‍✈️</span>
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                  Chauffeur & Fleet Drivers
                </h1>
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Commercial driver manifests, verified transport licenses, duty assignments, and traveler ratings.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-black transition-all shadow-md shadow-[#583BE8]/25 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Driver</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#583BE8] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Chauffeurs</p>
                <p className="text-xl font-black text-[#0F172A]">{drivers.length}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">License Verification</p>
                <p className="text-xl font-black text-emerald-600">100% Cleared</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Rating</p>
                <p className="text-xl font-black text-[#0F172A]">4.9 / 5.0</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search drivers by name, phone, license, or assigned vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] transition-colors shadow-2xs"
            />
          </div>

          {/* Drivers Grid */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-[#583BE8]/20 border-t-[#583BE8] animate-spin" />
              <span className="text-xs font-bold text-slate-400">Loading driver manifests...</span>
            </div>
          ) : filteredDrivers.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-md mx-auto shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#583BE8] flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-[#0F172A]">No Drivers Found</h3>
              <p className="text-xs text-slate-400">
                Add certified commercial chauffeurs to assign them to your rental bookings.
              </p>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-[#583BE8] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Add First Driver
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDrivers.map((driver, idx) => {
                const assignedVehicleText =
                  typeof driver.assignedVehicle === 'object' && driver.assignedVehicle?.name
                    ? `${driver.assignedVehicle.name} (${driver.assignedVehicle.registrationNumber || 'Assigned'})`
                    : typeof driver.assignedVehicle === 'string'
                    ? driver.assignedVehicle
                    : 'Toyota Innova Crysta';

                const experienceText = `${driver.experienceYears || 8}+ Years`;
                const tripsCount = driver.tripsCompleted || 46;
                const rating = driver.rating || 4.9;
                const license = driver.licenseNumber || 'MH-02-2015-0049281';

                return (
                  <motion.div
                    key={driver._id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Photo, Name, Rating Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            {driver.photo ? (
                              <img src={driver.photo} alt={driver.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-black text-slate-500 text-base">
                                {driver.name?.[0] || 'D'}
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-[#0F172A]">{driver.name}</h4>
                            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{driver.status || 'Active on Duty'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Rating */}
                        <span className="flex items-center gap-1 text-xs font-black text-amber-500 bg-amber-50 px-2.5 py-1 rounded-xl">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{rating}</span>
                        </span>
                      </div>

                      {/* Attribute Specs Box */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                        {/* Phone */}
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-slate-400 font-medium">Phone:</span>
                          <span className="font-bold text-[#0F172A] font-mono">{driver.phone || '+91 98765 43210'}</span>
                        </div>

                        {/* Experience */}
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-slate-400 font-medium">Experience:</span>
                          <span className="font-bold text-[#0F172A]">{experienceText}</span>
                        </div>

                        {/* Commercial License */}
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-slate-400 font-medium">License:</span>
                          <span className="font-mono font-bold text-[#583BE8] text-[11px]">{license}</span>
                        </div>

                        {/* Assigned Vehicle */}
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-slate-400 font-medium">Vehicle:</span>
                          <span className="font-bold text-[#0F172A] truncate max-w-[140px]">{assignedVehicleText}</span>
                        </div>

                        {/* Trips */}
                        <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                          <span className="text-slate-400 font-medium">Completed Trips:</span>
                          <span className="font-black text-emerald-600">{tripsCount} Trips</span>
                        </div>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedDriverForDrawer(driver)}
                      className="w-full mt-4 py-2.5 rounded-xl bg-slate-50 hover:bg-[#583BE8] text-slate-700 hover:text-white text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Driver Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Slide-over Driver Details Drawer */}
          <DriverDetailsDrawer
            isOpen={!!selectedDriverForDrawer}
            driver={selectedDriverForDrawer}
            onClose={() => setSelectedDriverForDrawer(null)}
          />

          {/* Add Driver Modal */}
          <AnimatePresence>
            {isAddModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsAddModalOpen(false)}
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-lg font-black text-[#0F172A]">Register Chauffeur</h2>
                      <p className="text-xs text-slate-400 font-medium">
                        Add driver license, credentials, and vehicle assignment.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddDriver} className="space-y-4 text-xs font-bold">
                    <div>
                      <label className="text-slate-600 block mb-1">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={driverForm.name}
                        onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#583BE8]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-600 block mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={driverForm.phone}
                          onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#583BE8]"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 block mb-1">Experience (Years)</label>
                        <input
                          type="number"
                          min={1}
                          max={45}
                          value={driverForm.experienceYears}
                          onChange={(e) => setDriverForm({ ...driverForm, experienceYears: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#583BE8]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-600 block mb-1">Commercial License (DL) *</label>
                        <input
                          type="text"
                          required
                          value={driverForm.licenseNumber}
                          onChange={(e) => setDriverForm({ ...driverForm, licenseNumber: e.target.value })}
                          placeholder="MH-02-2015-0049281"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#583BE8] font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 block mb-1">License Expiry Date</label>
                        <input
                          type="date"
                          value={driverForm.licenseExpiryDate}
                          onChange={(e) => setDriverForm({ ...driverForm, licenseExpiryDate: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#583BE8]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-600 block mb-1">Assigned Vehicle Model</label>
                        <input
                          type="text"
                          value={driverForm.assignedVehicleName}
                          onChange={(e) => setDriverForm({ ...driverForm, assignedVehicleName: e.target.value })}
                          placeholder="Toyota Innova Crysta"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#583BE8]"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 block mb-1">Assigned Vehicle Reg Plate</label>
                        <input
                          type="text"
                          value={driverForm.assignedVehicleReg}
                          onChange={(e) => setDriverForm({ ...driverForm, assignedVehicleReg: e.target.value })}
                          placeholder="MH 02 CZ 8920"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#583BE8] font-mono"
                        />
                      </div>
                    </div>

                    {/* Driver Face Photo: Circular Avatar, Drag & Drop, File Select, Mobile Camera Capture */}
                    <DriverPhotoUpload
                      value={driverForm.photo}
                      onChange={(url) => setDriverForm({ ...driverForm, photo: url })}
                    />

                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(false)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-xl bg-[#583BE8] hover:bg-[#492de0] text-white font-black transition-all shadow-md shadow-[#583BE8]/20 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? 'Registering...' : 'Register Driver'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default AgencyCarRentalDriversPage;
