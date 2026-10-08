import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Car,
  Hotel,
  Home,
  Ticket,
  Navigation,
  UserCheck,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useAgencyAuth } from '../../../hooks/useAgencyAuth';
import { useActiveBusiness } from '../../../context/ActiveBusinessContext';

export const BusinessServicesCard: React.FC = () => {
  const navigate = useNavigate();
  const { agency } = useAgencyAuth();
  const { carRentalStatus, isCarRentalApproved } = useActiveBusiness();

  const isAgencyActive =
    agency?.verificationStatus === 'APPROVED' ||
    (agency?.verificationStatus as any) === 'VERIFIED' ||
    agency?.status === 'ACTIVE';

  const futureServices = [
    {
      id: 'hotels',
      name: 'Hotels & Resorts',
      icon: Hotel,
      description: 'Room inventory, seasonal category pricing, and instant front-desk reservations.',
    },
    {
      id: 'homestays',
      name: 'Homestays & Villas',
      icon: Home,
      description: 'Boutique estates, private villas, and rural experiential host management.',
    },
    {
      id: 'activities',
      name: 'Activities & Experiences',
      icon: Ticket,
      description: 'Day excursions, adventure sports, landmark passes, and ticketed activities.',
    },
    {
      id: 'taxi_network',
      name: 'Taxi Network',
      icon: Navigation,
      description: 'Point-to-point airport transfers, intercity cabs, and on-demand transit.',
    },
    {
      id: 'local_guides',
      name: 'Local Guides',
      icon: UserCheck,
      description: 'Licensed regional cultural guides, heritage walk leaders, and translators.',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0 shadow-2xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#0F172A]">Business Services</h3>
            <p className="text-xs text-slate-500 font-medium">
              Manage commercial services and business verticals linked to your ApnaTrip account.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#583BE8] text-xs font-bold self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-Business Hub</span>
        </div>
      </div>

      {/* Primary Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Service 1: Travel Agency */}
        <div className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-100/70 text-[#583BE8] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{isAgencyActive ? 'Active' : 'In Review'}</span>
              </span>
            </div>

            <div>
              <h4 className="text-sm sm:text-base font-black text-[#0F172A]">Travel Agency</h4>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Tour package builder, itinerary planner, traveler manifests, and group trip bookings.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Primary Vertical</span>
            <button
              type="button"
              onClick={() => navigate('/agency/dashboard')}
              className="text-xs font-bold text-[#583BE8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Service 2: Car Rental */}
        <div className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-100/70 text-[#583BE8] flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>

              {isCarRentalApproved ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Active</span>
                </span>
              ) : carRentalStatus === 'PENDING' || carRentalStatus === 'UNDER_REVIEW' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-[11px] font-bold">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>Application in Review</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold">
                  <span>Not Enabled</span>
                </span>
              )}
            </div>

            <div>
              <h4 className="text-sm sm:text-base font-black text-[#0F172A]">Car Rental & Fleet</h4>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Vehicle fleet inventory, commercial chauffeur dispatch, hourly reservations, and fuel options.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Expansion Vertical</span>

            {isCarRentalApproved ? (
              <button
                type="button"
                onClick={() => navigate('/agency/car-rental/dashboard')}
                className="text-xs font-bold text-[#583BE8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : carRentalStatus === 'PENDING' || carRentalStatus === 'UNDER_REVIEW' ? (
              <button
                type="button"
                onClick={() => navigate('/agency/car-rental/pending')}
                className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Track Status</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/agency/car-rental/activate')}
                className="px-3 py-1.5 rounded-xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Service</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Future Services Section (Disabled / Coming Soon) */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
            Upcoming Verticals (Coming Soon)
          </h4>
          <span className="text-[11px] text-slate-400 font-medium">Roadmap Expansion</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {futureServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/40 opacity-70 hover:opacity-90 transition-opacity flex flex-col justify-between space-y-2 select-none"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold tracking-wide">
                    Coming Soon
                  </span>
                </div>

                <div>
                  <h5 className="text-xs font-black text-slate-700">{service.name}</h5>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-0.5">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BusinessServicesCard;
