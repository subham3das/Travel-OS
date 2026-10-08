import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Car,
  Calendar,
  Users,
  Fuel,
  ShieldCheck,
  Award,
  DollarSign,
  FileText,
  Clock,
  Phone,
  Mail,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MapPin,
  Compass,
} from 'lucide-react';

interface VehicleDetailsDrawerProps {
  isOpen: boolean;
  car: any | null;
  onClose: () => void;
  onEdit?: (car: any) => void;
  onViewBookings?: (car: any) => void;
}

export const VehicleDetailsDrawer: React.FC<VehicleDetailsDrawerProps> = ({
  isOpen,
  car,
  onClose,
  onEdit,
  onViewBookings,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'compliance' | 'owner' | 'history'>('overview');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  if (!isOpen || !car) return null;

  const images = car.images && car.images.length > 0 ? car.images : [car.thumbnail || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop'];

  const isInsured = car.insuranceExpiryDate ? new Date(car.insuranceExpiryDate) > new Date() : true;
  const isPuccValid = car.pollutionExpiryDate ? new Date(car.pollutionExpiryDate) > new Date() : true;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full z-10 select-none overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#583BE8]/10 text-[#583BE8] flex items-center justify-center font-bold">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-[#0F172A] tracking-tight">
                    {car.brand} {car.name}
                  </h2>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      car.isAvailable
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {car.isAvailable ? 'Available' : 'Booked / Unavailable'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold font-mono mt-0.5">
                  Reg: {car.registrationNumber || 'MH 02 CZ 8920'} • {car.type?.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(car)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-white text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  Edit
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-100 px-6 gap-6 text-xs font-bold text-slate-400">
            {[
              { id: 'overview', label: 'Vehicle Specs' },
              { id: 'compliance', label: 'RC & Compliance' },
              { id: 'owner', label: 'Owner & Driver' },
              { id: 'history', label: 'Trip Telemetry' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 border-b-2 font-black transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#583BE8] text-[#583BE8]'
                    : 'border-transparent hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Photo Gallery */}
                <div className="space-y-3">
                  <div className="w-full h-56 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={images[selectedImageIdx] || images[0]}
                      alt="Car"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {images.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {images.map((img: string, idx: number) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImageIdx(idx)}
                          className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                            selectedImageIdx === idx ? 'border-[#583BE8] shadow-xs' : 'border-slate-200 opacity-60'
                          }`}
                        >
                          <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Primary Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Seats</span>
                    <span className="text-sm font-black text-[#0F172A]">{car.specs?.seats || 7} Passengers</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Fuel</span>
                    <span className="text-sm font-black text-[#0F172A]">{car.specs?.fuel || 'Diesel'}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Transmission</span>
                    <span className="text-sm font-black text-[#0F172A]">{car.specs?.transmission || 'Automatic'}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Air Conditioning</span>
                    <span className="text-sm font-black text-[#0F172A]">{car.specs?.hasAC ? 'Yes (Climate)' : 'No'}</span>
                  </div>
                </div>

                {/* Business Model Specific Pricing Presentation */}
                {car.serviceType === 'SELF_DRIVE_RENTAL' || car.serviceType === 'self_drive_car' || car.serviceType === 'self_drive_bike' ? (
                  <div className="space-y-4">
                    {/* Self-Drive Tariffs */}
                    <div className="p-4 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-emerald-800 block uppercase tracking-wider">
                          Self-Drive Rental Tariff
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-2xl font-black text-[#0F172A]">
                            ₹{(car.rentalPricing?.dailyRate || car.dailyPrice || 2500).toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-500 font-bold">/day</span>
                          {car.rentalPricing?.hourlyRate && (
                            <span className="text-xs text-emerald-700 font-bold ml-2">
                              (₹{car.rentalPricing.hourlyRate}/hr)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-bold block">Security Deposit</span>
                        <span className="text-sm font-black text-[#0F172A]">
                          ₹{(car.rentalPolicies?.securityDeposit ?? car.fixedDepositAmount ?? 3000).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Self-Drive Policies Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Included KM</span>
                        <span className="font-black text-[#0F172A]">{car.rentalPolicies?.includedKmPerDay || 300} KM / Day</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Extra KM Rate</span>
                        <span className="font-black text-[#0F172A]">₹{car.rentalPolicies?.extraKmCharge || 12} / KM</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Fuel Policy</span>
                        <span className="font-black text-[#0F172A] capitalize">{car.rentalPolicies?.fuelPolicy?.replace(/_/g, ' ') || 'Same to Same'}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Duration Window</span>
                        <span className="font-black text-[#0F172A]">{car.rentalPolicies?.minRentalDurationHours || 4}h - {car.rentalPolicies?.maxRentalDurationDays || 90}d</span>
                      </div>
                    </div>

                    {car.pickupLocation && (
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-xs">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-slate-500 font-medium">Pickup Hub:</span>
                        <span className="font-bold text-[#0F172A]">{car.pickupLocation}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Route Booking Fares */}
                    <div className="p-4 rounded-3xl bg-purple-50/60 border border-purple-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#583BE8] block uppercase tracking-wider">
                          Route Booking Fare
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-2xl font-black text-[#0F172A]">
                            ₹{(car.routePricing?.oneWayPrice || (car.routes && car.routes.length > 0 ? Math.min(...car.routes.map((r: any) => r.price)) : (car.dailyPrice || 1800))).toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-500 font-bold">
                            {car.routes && car.routes.length > 0 ? 'from' : 'one-way'}
                          </span>
                          {car.routePricing?.roundTripPrice && (
                            <span className="text-xs text-[#583BE8] font-bold ml-2">
                              (RT: ₹{car.routePricing.roundTripPrice.toLocaleString()})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-bold block">Extra KM Charge</span>
                        <span className="text-sm font-black text-[#0F172A]">
                          ₹{car.routePricing?.extraKmCharge || 14}/KM
                        </span>
                      </div>
                    </div>

                    {/* Route Allowances & Inclusions */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Waiting Charge</span>
                        <span className="font-black text-[#0F172A]">₹{car.routePricing?.waitingChargePerHour || 150} / Hour</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Driver Allowance</span>
                        <span className="font-black text-[#0F172A]">₹{car.routePricing?.driverAllowancePerDay || 400} / Day</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Night Charge</span>
                        <span className="font-black text-[#0F172A]">₹{car.routePricing?.nightCharge || 300}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Tolls & Taxes</span>
                        <span className="font-black text-emerald-600">
                          {car.routePricing?.tollIncluded !== false ? 'Tolls Included' : 'Excluded'}
                        </span>
                      </div>
                    </div>

                    {/* Available Routes list */}
                    {car.routes && car.routes.length > 0 && (
                      <div>
                        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2.5">
                          Supported Routes ({car.routes.length})
                        </h4>
                        <div className="space-y-2">
                          {car.routes.map((r: any, idx: number) => (
                            <div
                              key={r._id || idx}
                              className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                            >
                              <div className="font-bold text-[#0F172A]">
                                <span>{r.pickup}</span>
                                <span className="mx-2 text-slate-400">→</span>
                                <span>{r.destination}</span>
                                {r.estimatedDuration && (
                                  <span className="text-[10px] text-slate-400 font-normal ml-2">
                                    ({r.estimatedDuration})
                                  </span>
                                )}
                              </div>
                              <span className="font-black text-[#583BE8] text-sm">
                                ₹{r.price.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Features Pill list */}
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2.5">
                    Vehicle Amenities & Features
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(car.features || ['GPS Navigation', 'Bluetooth Audio', 'Fastag Enabled', 'ABS & Airbags', 'Luggage Carrier']).map(
                      (f: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{f}</span>
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Description */}
                {car.description && (
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-1.5">
                      Description
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {car.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="space-y-4">
                {/* Registration & RC Details */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-[#583BE8]" />
                      <h4 className="text-xs font-black text-[#0F172A]">Registration Certificate (RC)</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      Verified
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Plate Number</span>
                      <span className="font-mono font-black text-[#0F172A]">
                        {car.registrationNumber || 'MH 02 CZ 8920'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">RC Number</span>
                      <span className="font-mono font-black text-[#0F172A]">
                        {car.rcNumber || 'IN-RC-2023-991204'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Commercial Permit & Coverage */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-600" />
                      <h4 className="text-xs font-black text-[#0F172A]">Commercial Permit</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                      Commercial Tourist
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Permit Type</span>
                      <span className="font-bold text-[#0F172A]">
                        {car.permitType || 'All India Tourist Permit (AITP)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Permit Coverage</span>
                      <span className="font-bold text-[#0F172A]">National / Inter-State</span>
                    </div>
                  </div>
                </div>

                {/* Insurance Policy */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-xs font-black text-[#0F172A]">Comprehensive Insurance</h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isInsured ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isInsured ? 'Active Policy' : 'Expired'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Policy Number</span>
                      <span className="font-mono font-black text-[#0F172A]">
                        {car.insurancePolicyNumber || 'POL-ICICI-COMM-89104'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Valid Until</span>
                      <span className="font-bold text-[#0F172A]">
                        {car.insuranceExpiryDate
                          ? new Date(car.insuranceExpiryDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '18 Dec 2026'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PUCC (Pollution) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-sky-600" />
                      <h4 className="text-xs font-black text-[#0F172A]">Pollution Certificate (PUCC)</h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isPuccValid ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isPuccValid ? 'Valid' : 'Expired'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Certificate Number</span>
                      <span className="font-mono font-black text-[#0F172A]">
                        {car.pollutionCertificateNumber || 'PUCC-MH-2024-5821'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Expiry Date</span>
                      <span className="font-bold text-[#0F172A]">
                        {car.pollutionExpiryDate
                          ? new Date(car.pollutionExpiryDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '14 Oct 2026'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'owner' && (
              <div className="space-y-4">
                {/* Owner Card */}
                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#583BE8] to-purple-600 text-white flex items-center justify-center font-black text-lg">
                      {car.owner?.name?.[0] || 'O'}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#0F172A]">
                        {car.owner?.name || 'Mahindra Fleet Logistics'}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium">
                        {car.owner?.businessName || 'Verified Fleet Owner Partner'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-200/60">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{car.owner?.phone || '+91 98201 44510'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span>{car.owner?.email || 'fleet@ownerpartner.com'}</span>
                    </div>
                  </div>
                </div>

                {/* Assigned Driver Card */}
                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#583BE8]" />
                      <h4 className="text-xs font-black text-[#0F172A]">Assigned Commercial Driver</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      On Duty
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden">
                      {car.driver?.photo ? (
                        <img src={car.driver.photo} alt="Driver" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                          {car.driver?.name?.[0] || 'D'}
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-black text-[#0F172A] block">
                        {car.driver?.name || 'Ramesh Kumar'}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {car.driver?.experienceYears || 8}+ Years Exp • ★ {car.driver?.rating || 4.9} Rating
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    <span className="text-slate-500 font-medium">Contact Driver:</span>
                    <span className="font-mono font-bold text-[#0F172A]">{car.driver?.phone || '+91 98765 43210'}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                {/* Revenue & Trips Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                      Total Revenue Generated
                    </span>
                    <span className="text-2xl font-black text-emerald-900 mt-1 block">
                      ₹{(car.totalRevenue || car.dailyPrice * (car.totalTrips || 12)).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">Lifetime bookings</span>
                  </div>

                  <div className="p-4 rounded-3xl bg-purple-50 border border-purple-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#583BE8] block">
                      Completed Trips
                    </span>
                    <span className="text-2xl font-black text-[#583BE8] mt-1 block">
                      {car.totalTrips || 34}
                    </span>
                    <span className="text-[10px] text-purple-600 font-bold mt-0.5 block">Zero cancellations</span>
                  </div>
                </div>

                {onViewBookings && (
                  <button
                    type="button"
                    onClick={() => onViewBookings(car)}
                    className="w-full py-3 rounded-2xl bg-[#583BE8] text-white text-xs font-black hover:bg-[#492de0] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#583BE8]/20"
                  >
                    <span>View All Vehicle Bookings</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VehicleDetailsDrawer;
