import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Bus,
  Plus,
  CheckCircle2,
  Hash,
  Users,
  User,
  Wrench,
  Save,
} from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { AssignedVehicle } from '../../data/tripDetails';

// ── Mock Fleet Data ────────────────────────────────────────────────────────────
const MOCK_FLEET: AssignedVehicle[] = [
  {
    id: 'v-1',
    name: 'Tempo Traveller Deluxe',
    registrationNumber: 'UK 07 PA 1234',
    type: '17+1 Seater AC Bus',
    capacity: 18,
    assignedDriver: 'Manoj Negi',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
  },
  {
    id: 'v-2',
    name: 'Force Urbania Luxury',
    registrationNumber: 'UK 07 PB 5678',
    type: '12+1 Seater Luxury Van',
    capacity: 13,
    assignedDriver: 'Sandeep Thapa',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400',
  },
  {
    id: 'v-3',
    name: 'Mahindra Scorpio-N',
    registrationNumber: 'DL 3C AB 9900',
    type: '6+1 Seater 4x4 SUV',
    capacity: 7,
    assignedDriver: 'Nabin Rai',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
  },
  {
    id: 'v-4',
    name: 'Volvo Multi-Axle Coach',
    registrationNumber: 'HP 65 C 1111',
    type: '45-Seater AC Coach',
    capacity: 45,
    assignedDriver: 'Suresh Rawat',
    status: 'Maintenance',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400',
  },
];

const STATUS_STYLES: Record<AssignedVehicle['status'], string> = {
  Available: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  Assigned: 'bg-blue-100 text-blue-800 border border-blue-200',
  Maintenance: 'bg-rose-100 text-rose-800 border border-rose-200',
};

/**
 * Agency Manage Vehicle Assignment Page
 * Route: /agency/trips/:tripId/vehicle (Protected: APPROVED agencies only)
 * Mirrors AgencyManageTeamPage pattern — navigate back with ?vehicleAssigned=true
 */
export const AgencyManageVehiclePage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const currentTripId = tripId || 'LD-1505-2024';

  const [selectedVehicleIds, setSelectedVehicleIds] = useState<Set<string>>(new Set());

  const handleToggleVehicle = (vehicleId: string, status: AssignedVehicle['status']) => {
    if (status === 'Maintenance') return; // Can't assign vehicles under maintenance
    setSelectedVehicleIds((prev) => {
      const next = new Set(prev);
      if (next.has(vehicleId)) {
        next.delete(vehicleId);
      } else {
        next.add(vehicleId);
      }
      return next;
    });
  };

  const handleSave = () => {
    // Navigate back with vehicleAssigned=true signal
    navigate(`/agency/trips/${currentTripId}?vehicleAssigned=true`);
  };

  const canSave = selectedVehicleIds.size > 0;

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-28 md:pb-24">
        <DashboardHeader />

        {/* Sticky Header */}
        <div className="bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 sm:px-6 flex items-center justify-between sticky top-14 z-20">
          <button
            type="button"
            onClick={() => navigate(`/agency/trips/${currentTripId}`)}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Trip</span>
          </button>
          <h2 className="text-base sm:text-lg font-black text-[#0F172A]">Vehicle Assignment</h2>
          <div className="w-16 sm:w-24" />
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-4xl mx-auto w-full">
          {/* Trip summary chip */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 border border-purple-100 rounded-2xl text-xs font-bold text-[#583BE8] w-fit">
            <Bus className="w-4 h-4" />
            <span>Trip ID: {currentTripId} — Select vehicles to assign</span>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-3xl bg-sky-50 border border-sky-100 text-xs font-semibold text-sky-900 space-y-1">
            <p className="font-extrabold">How to assign vehicles:</p>
            <p>Tap a vehicle card to select it. You can assign multiple vehicles to this trip. Vehicles under maintenance cannot be selected.</p>
          </div>

          {/* Vehicle Fleet Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
              <Bus className="w-4 h-4 text-sky-600" />
              Available Fleet ({MOCK_FLEET.filter(v => v.status !== 'Maintenance').length} vehicles)
            </h3>

            <AnimatePresence>
              {MOCK_FLEET.map((vehicle, i) => {
                const isSelected = selectedVehicleIds.has(vehicle.id);
                const isDisabled = vehicle.status === 'Maintenance';

                return (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    onClick={() => handleToggleVehicle(vehicle.id, vehicle.status)}
                    className={`flex gap-3 p-4 rounded-3xl border-2 transition-all ${
                      isDisabled
                        ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200'
                        : isSelected
                        ? 'bg-sky-50 border-sky-400 shadow-md cursor-pointer'
                        : 'bg-white border-slate-100 hover:border-sky-200 hover:shadow-sm cursor-pointer'
                    }`}
                  >
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-20 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-extrabold text-[#0F172A] truncate">{vehicle.name}</p>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${STATUS_STYLES[vehicle.status]}`}>
                            {vehicle.status}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap text-[11px] font-semibold text-slate-500">
                        <span className="flex items-center gap-1">
                          <Hash className="w-3 h-3" />{vehicle.registrationNumber}
                        </span>
                        <span>•</span>
                        <span>{vehicle.type}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />{vehicle.capacity} seats
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />{vehicle.assignedDriver}
                        </span>
                        {isDisabled && (
                          <span className="flex items-center gap-1 text-rose-600">
                            <Wrench className="w-3 h-3" />Under Maintenance
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 p-3 sm:px-6 shadow-2xl md:ml-64">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="text-xs font-bold text-slate-600">
            {selectedVehicleIds.size === 0 ? (
              <span className="text-slate-400">No vehicles selected</span>
            ) : (
              <span className="text-sky-700">{selectedVehicleIds.size} vehicle{selectedVehicleIds.size > 1 ? 's' : ''} selected</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all ${
              canSave
                ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-600/25 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Save & Assign to Trip</span>
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AgencyManageVehiclePage;
