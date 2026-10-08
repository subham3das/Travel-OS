import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Layers,
  Car,
  Users,
  ShieldCheck,
  Star,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  ChevronRight,
  Phone,
  Building2,
  Plus,
} from 'lucide-react';
import { agencyCarRentalService } from '../../services/agencyCarRental.service';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { OwnerProfileDrawer } from '../../components/car-rental/OwnerProfileDrawer';
import { useToast } from '../../../user-panel/context/ToastContext';

export const AgencyCarRentalFleetOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [fleetData, setFleetData] = useState<any>(null);
  const [selectedOwner, setSelectedOwner] = useState<any | null>(null);

  const fetchOverview = async () => {
    try {
      setIsLoading(true);
      const data = await agencyCarRentalService.getFleetOverview();
      setFleetData(data);
    } catch (err: any) {
      console.error('Failed to load fleet overview:', err);
      showToast(err.message || 'Failed to load fleet overview', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const breakdown = fleetData?.breakdown || {
    suv: 0,
    sedan: 0,
    luxury: 0,
    tempo: 0,
    miniBus: 0,
    inactive: 0,
    maintenance: 0,
  };

  const owners = fleetData?.owners || [];

  const categoryCards = [
    { label: 'SUV', count: breakdown.suv, icon: '🚙', desc: 'Family & Off-road' },
    { label: 'Sedan', count: breakdown.sedan, icon: '🚗', desc: 'City & Business Travel' },
    { label: 'Luxury', count: breakdown.luxury, icon: '✨', desc: 'Premium Chauffeur' },
    { label: 'Tempo Traveller', count: breakdown.tempo, icon: '🚐', desc: 'Group Tours (12-26 pax)' },
    { label: 'Mini Bus', count: breakdown.miniBus, icon: '🚌', desc: 'Events & Excursions' },
    { label: 'Under Maintenance', count: breakdown.maintenance, icon: '🔧', desc: 'Scheduled Service' },
    { label: 'Inactive / Off-duty', count: breakdown.inactive, icon: '⏸️', desc: 'Awaiting dispatch' },
  ];

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
                <span className="text-xl">📊</span>
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                  Fleet Structure & Owner Network
                </h1>
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Segmented vehicle classification, maintenance pipeline, and partner owner profiles.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/agency/car-rental/cars')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-black transition-all shadow-md shadow-[#583BE8]/25 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </div>

          {/* Classification Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {categoryCards.map((cat, idx) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-2xs space-y-2 hover:border-[#583BE8]/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{cat.label}</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{cat.count}</span>
                  <span className="text-[11px] text-slate-400 font-medium block mt-0.5">{cat.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Owner Network Cards Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#0F172A] tracking-tight">
                  Fleet Owners & Asset Partners
                </h3>
                <p className="text-xs font-semibold text-slate-400">
                  Individual asset owners leasing vehicles into your rental fleet operations.
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-full border-2 border-[#583BE8]/20 border-t-[#583BE8] animate-spin" />
                <span className="text-xs font-bold text-slate-400">Loading owner network...</span>
              </div>
            ) : owners.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-slate-100 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#583BE8] flex items-center justify-center mx-auto">
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">No external owners registered</p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  All active vehicles are currently managed under in-house agency asset inventory.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {owners.map((owner: any, idx: number) => (
                  <motion.div
                    key={owner._id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#583BE8] to-purple-600 text-white flex items-center justify-center font-black text-base shadow-xs">
                            {owner.name?.[0] || 'O'}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-[#0F172A]">{owner.name}</h4>
                            <span className="text-[11px] text-slate-400 font-medium block">
                              {owner.businessName || 'Fleet Partner'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-black text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{owner.rating || 4.9}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                        <div className="p-2.5 rounded-2xl bg-slate-50">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Vehicles</span>
                          <span className="text-sm font-black text-[#0F172A]">{owner.vehiclesCount || 1} Registered</span>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-slate-50">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Revenue</span>
                          <span className="text-sm font-black text-emerald-600">
                            ₹{(owner.totalRevenue || 45000).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedOwner(owner)}
                      className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-[#583BE8] text-slate-700 hover:text-white text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                      <span>View Owner Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Owner Profile Drawer */}
          <OwnerProfileDrawer
            isOpen={!!selectedOwner}
            owner={selectedOwner}
            onClose={() => setSelectedOwner(null)}
          />
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default AgencyCarRentalFleetOverviewPage;
