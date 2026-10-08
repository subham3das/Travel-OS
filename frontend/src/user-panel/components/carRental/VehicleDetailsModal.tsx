import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  CheckCircle2,
  Star,
  Users,
  Fuel,
  Cog,
  MapPin,
  ArrowUpDown,
  Calendar,
  Clock,
  ShieldCheck,
  Sparkles,
  Check,
  MinusCircle,
  Radio,
  Music,
  Bluetooth,
  BatteryCharging,
  Car,
  Armchair,
  Sun,
  Disc,
  Info,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { Vehicle, TripType } from '../../types/carRental';
import { useToast } from '../../context/ToastContext';
import { BrandLogo } from '../../../common/brand';

// Import local cropped vehicle assets
import view1 from '../../../assets/images/cars/innova_view_1.png';
import view2 from '../../../assets/images/cars/innova_view_2.png';
import view3 from '../../../assets/images/cars/innova_view_3.png';
import view4 from '../../../assets/images/cars/innova_view_4.png';
import view5 from '../../../assets/images/cars/innova_view_5.png';
import driverRohit from '../../../assets/images/cars/driver_rohit.png';
import reviewerAnanya from '../../../assets/images/cars/reviewer_ananya.png';

interface VehicleDetailsModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (vehicleId: string) => void;
  onBookNow: (vehicle: Vehicle) => void;
  onReport?: (vehicle: Vehicle) => void;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  isFavorite = false,
  onToggleFavorite,
  onBookNow,
  onReport,
}) => {
  const { showToast } = useToast();
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [selectedTripType, setSelectedTripType] = useState<string>('One Way');
  const [activeTab, setActiveTab] = useState<'details' | 'features' | 'reviews' | 'policies' | 'faqs'>('details');

  // Trip details input state
  const [fromLocation, setFromLocation] = useState('Dibrugarh, Assam');
  const [toLocation, setToLocation] = useState('Tawang, Arunachal Pradesh');
  const [travelDate, setTravelDate] = useState('2025-10-12');
  const [pickupTime, setPickupTime] = useState('08:00 AM');
  const [passengers, setPassengers] = useState('4 Adults');
  const [specialNotes, setSpecialNotes] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!vehicle) return null;

  const galleryImages = [
    vehicle.thumbnail,
    view2 || vehicle.thumbnail,
    view3 || vehicle.thumbnail,
    view4 || vehicle.thumbnail,
    view5 || vehicle.thumbnail,
  ];

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.name} - ApnaTrip`,
        text: `Rent ${vehicle.name} from ${vehicle.provider.name} on ApnaTrip!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      if (navigator.clipboard) navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  const tripTypes = ['One Way', 'Round Trip', 'Hourly', 'Full Day', 'Airport Transfer', 'Multi Day'];

  const inclusions = [
    'Driver Included',
    'Fuel Included (up to limit)',
    'Toll & State Permits',
    'Fastag',
    'Free Cancellation (Up to 24 hrs)',
    'GPS Navigation',
    'First Aid Kit',
    'Mineral Water',
  ];

  const notIncluded = [
    'Parking Charges',
    'Extra KM Charges',
    'Food & Accommodation (for multi-day trips)',
    'Personal Expenses',
  ];

  const carFeatures = [
    { label: 'AC', icon: <Cog className="w-5 h-5 text-indigo-600" /> },
    { label: 'Music System', icon: <Music className="w-5 h-5 text-indigo-600" /> },
    { label: 'Bluetooth', icon: <Bluetooth className="w-5 h-5 text-indigo-600" /> },
    { label: 'USB Charging', icon: <BatteryCharging className="w-5 h-5 text-indigo-600" /> },
    { label: 'Spacious Boot', icon: <Car className="w-5 h-5 text-indigo-600" /> },
    { label: 'Comfortable Seats', icon: <Armchair className="w-5 h-5 text-indigo-600" /> },
    { label: 'Sunroof', icon: <Sun className="w-5 h-5 text-indigo-600" /> },
    { label: 'ABS', icon: <Disc className="w-5 h-5 text-indigo-600" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-0 sm:p-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            className="relative w-full max-w-4xl bg-white h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl shadow-2xl z-10 sm:my-auto flex flex-col overflow-hidden"
          >
            {/* Top Navigation Header Bar */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <BrandLogo
                  theme="light"
                  className="h-7 w-auto select-none"
                  alt="ApnaTrip"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleFavorite?.(vehicle.id)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-700'
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Body: Dual Column on Large Screens */}
            <div className="flex-1 min-h-0 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              {/* LEFT COLUMN: Vehicle Details & Trip Booking Info */}
              <div className="lg:col-span-6 p-4 sm:p-6 space-y-6">
                {/* Hero Car Gallery */}
                <div className="space-y-3">
                  <div className="relative h-56 sm:h-64 w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-xs">
                    <img
                      src={galleryImages[currentImgIdx]}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                      {currentImgIdx + 1}/{galleryImages.length}
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentImgIdx(idx)}
                        className={`w-14 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          idx === currentImgIdx ? 'border-indigo-600 ring-1 ring-indigo-600' : 'border-slate-200 opacity-70'
                        }`}
                      >
                        <img src={img} alt="thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title, Rating & Provider */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                      {vehicle.name}
                    </h2>
                    <CheckCircle2 className="w-5 h-5 fill-sky-500 text-white" />
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1 text-amber-500 font-black">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{vehicle.rating}</span>
                    </div>
                    <span className="text-slate-400 font-semibold">({vehicle.reviewsCount} reviews)</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="font-semibold text-slate-500">by {vehicle.provider.name}</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-extrabold text-[10px]">
                      <Check className="w-3 h-3" />
                      Verified Provider
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Dibrugarh, Assam</span>
                  </div>
                </div>

                {/* 4 Specs Cards in a Row */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100 flex flex-col items-center justify-center">
                    <Users className="w-4 h-4 text-slate-400 mb-1" />
                    <span className="text-xs font-black text-[#0F172A]">{vehicle.specs.seats}</span>
                    <span className="text-[10px] text-slate-400 font-bold">Seats</span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100 flex flex-col items-center justify-center">
                    <Fuel className="w-4 h-4 text-slate-400 mb-1" />
                    <span className="text-xs font-black text-[#0F172A]">{vehicle.specs.fuel}</span>
                    <span className="text-[10px] text-slate-400 font-bold">Fuel</span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100 flex flex-col items-center justify-center">
                    <Cog className="w-4 h-4 text-slate-400 mb-1" />
                    <span className="text-xs font-black text-[#0F172A] truncate w-full">{vehicle.specs.transmission}</span>
                    <span className="text-[10px] text-slate-400 font-bold">Transmission</span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100 flex flex-col items-center justify-center">
                    <Cog className="w-4 h-4 text-slate-400 mb-1" />
                    <span className="text-xs font-black text-[#0F172A]">Yes</span>
                    <span className="text-[10px] text-slate-400 font-bold">AC</span>
                  </div>
                </div>

                {/* Highlight Badges */}
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    Premium SUV
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Driver Included
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Best for Groups
                  </span>
                </div>

                {/* Trip Type Selector */}
                <div className="space-y-2">
                  <h3 className="text-sm font-black text-[#0F172A]">Trip Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {tripTypes.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTripType(t)}
                        className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                          selectedTripType === t
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trip Details Card with Swap */}
                <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100 space-y-3 relative">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    Trip Details
                  </h3>

                  <div className="relative space-y-2">
                    {/* From */}
                    <div className="bg-white rounded-2xl p-3 border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 leading-tight">From</span>
                      <input
                        type="text"
                        value={fromLocation}
                        onChange={(e) => setFromLocation(e.target.value)}
                        className="w-full text-xs font-extrabold text-[#0F172A] bg-transparent focus:outline-none"
                      />
                    </div>

                    {/* Swap Button */}
                    <button
                      type="button"
                      onClick={handleSwapLocations}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 text-indigo-600 shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all z-10"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>

                    {/* To */}
                    <div className="bg-white rounded-2xl p-3 border border-slate-100 pr-10">
                      <span className="block text-[10px] font-bold text-slate-400 leading-tight">To</span>
                      <input
                        type="text"
                        value={toLocation}
                        onChange={(e) => setToLocation(e.target.value)}
                        className="w-full text-xs font-extrabold text-[#0F172A] bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white rounded-2xl p-3 border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 leading-tight">Travel Date</span>
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full text-xs font-extrabold text-[#0F172A] bg-transparent focus:outline-none"
                      />
                    </div>
                    <div className="bg-white rounded-2xl p-3 border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 leading-tight">Pick up Time</span>
                      <input
                        type="text"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full text-xs font-extrabold text-[#0F172A] bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Passengers */}
                  <div className="bg-white rounded-2xl p-3 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 leading-tight">Passengers</span>
                      <span className="text-xs font-extrabold text-[#0F172A]">{passengers}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* Special Notes */}
                  <div className="bg-white rounded-2xl p-3 border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 leading-tight">Special Notes (Optional)</span>
                    <input
                      type="text"
                      placeholder="e.g. luggage, child seat, extra stops..."
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      className="w-full text-xs font-semibold text-[#0F172A] bg-transparent placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Your Driver Card */}
                <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100 space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    Your Driver
                  </h3>
                  <div className="flex items-center gap-3.5">
                    <img
                      src={driverRohit}
                      alt="Rohit Sharma"
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-extrabold text-[#0F172A]">Rohit Sharma</h4>
                        <CheckCircle2 className="w-4 h-4 fill-sky-500 text-white" />
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Verified
                        </span>
                      </div>
                      <p className="text-xs text-amber-600 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>4.9</span>
                        <span className="text-slate-400 font-medium">(320 trips)</span>
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        5+ Years • Hindi, English, Assamese
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 Highlights Cards */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-1">
                    <Sparkles className="w-4 h-4 text-purple-600 mx-auto" />
                    <p className="text-[10px] font-bold text-[#0F172A] leading-tight">Clean & Well Maintained</p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-1">
                    <Users className="w-4 h-4 text-purple-600 mx-auto" />
                    <p className="text-[10px] font-bold text-[#0F172A] leading-tight">Experienced Driver</p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-1">
                    <Clock className="w-4 h-4 text-purple-600 mx-auto" />
                    <p className="text-[10px] font-bold text-[#0F172A] leading-tight">24x7 Support</p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-1">
                    <ShieldCheck className="w-4 h-4 text-purple-600 mx-auto" />
                    <p className="text-[10px] font-bold text-[#0F172A] leading-tight">Flexible Cancellation</p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Inclusions, Features, Pricing Breakdown, Reviews & Policies */}
              <div className="lg:col-span-6 p-4 sm:p-6 space-y-6">
                {/* Secondary Tabs */}
                <div className="flex items-center gap-4 border-b border-slate-100 pb-2 text-xs font-extrabold text-slate-400 overflow-x-auto scrollbar-none">
                  {[
                    { id: 'details', label: 'Details' },
                    { id: 'features', label: 'Features' },
                    { id: 'reviews', label: 'Reviews' },
                    { id: 'policies', label: 'Policies' },
                    { id: 'faqs', label: 'FAQs' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`pb-1 cursor-pointer transition-colors relative ${
                        activeTab === tab.id ? 'text-indigo-600 font-black' : 'hover:text-slate-700'
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <div className="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Inclusions */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-[#0F172A]">Inclusions</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {inclusions.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-700 font-semibold">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Not Included */}
                <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100/60 space-y-2.5">
                  <h3 className="text-xs font-black text-rose-900 uppercase tracking-wider">
                    Not Included
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {notIncluded.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-rose-800 font-semibold">
                        <MinusCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Car Features Grid */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-[#0F172A]">Car Features</h3>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {carFeatures.map((feat, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center gap-1.5"
                      >
                        <div className="w-8 h-8 rounded-full bg-purple-50 text-indigo-600 flex items-center justify-center">
                          {feat.icon}
                        </div>
                        <span className="text-[10px] font-bold text-slate-700">{feat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Details Card */}
                <div className="bg-purple-50/40 rounded-3xl p-5 border border-purple-100/60 space-y-3">
                  <h3 className="text-sm font-black text-[#0F172A]">Price Details</h3>
                  <div className="space-y-2 text-xs divide-y divide-purple-100 text-slate-600 font-semibold">
                    <div className="flex justify-between pt-1">
                      <span>Base Fare (1 Day)</span>
                      <strong className="text-[#0F172A]">₹3,000</strong>
                    </div>
                    <div className="flex justify-between pt-1.5">
                      <span>Driver Allowance</span>
                      <strong className="text-[#0F172A]">₹300</strong>
                    </div>
                    <div className="flex justify-between pt-1.5">
                      <span>Toll & Permits</span>
                      <strong className="text-emerald-600">₹0</strong>
                    </div>
                    <div className="flex justify-between pt-1.5">
                      <span>State Tax</span>
                      <strong className="text-[#0F172A]">₹90</strong>
                    </div>
                    <div className="flex justify-between pt-1.5">
                      <span>GST (5%)</span>
                      <strong className="text-[#0F172A]">₹165</strong>
                    </div>
                    <div className="flex justify-between pt-1.5">
                      <span>Platform Fee</span>
                      <strong className="text-[#0F172A]">₹45</strong>
                    </div>
                    <div className="flex justify-between pt-2.5 text-sm font-extrabold text-[#0F172A]">
                      <span>Total Amount</span>
                      <span className="text-base font-black text-indigo-700">₹3,600</span>
                    </div>
                  </div>
                </div>

                {/* Verified Customer Review */}
                <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#0F172A]">Reviews</h3>
                    <span className="text-xs font-bold text-indigo-600 flex items-center gap-0.5">
                      View All <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={reviewerAnanya}
                        alt="Ananya Deka"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-extrabold text-[#0F172A]">Ananya Deka</h4>
                          <CheckCircle2 className="w-3.5 h-3.5 fill-sky-500 text-white" />
                        </div>
                        <p className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>5.0</span>
                          <span className="text-slate-400 font-medium">• 2 weeks ago</span>
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Very comfortable ride. Driver was professional and polite. Car was clean and well maintained. Highly recommended!
                    </p>

                    {/* Review thumbnail photos */}
                    <div className="flex items-center gap-2 pt-1">
                      <img src={view1} alt="review photo" className="w-14 h-10 rounded-xl object-cover" />
                      <img src={view2} alt="review photo" className="w-14 h-10 rounded-xl object-cover" />
                      <img src={view3} alt="review photo" className="w-14 h-10 rounded-xl object-cover" />
                      <img src={view4} alt="review photo" className="w-14 h-10 rounded-xl object-cover" />
                    </div>
                  </div>
                </div>

                {/* Cancellation Policy */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#0F172A]">Cancellation Policy</h3>
                    <span className="text-xs font-bold text-indigo-600 flex items-center gap-0.5">
                      View All <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="space-y-2 text-xs font-semibold text-slate-600">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Free cancellation up to 24 hours before pickup</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>50% refund if cancelled within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>No refund after pickup time</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Action Bar matching reference image */}
            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-4 sm:px-6 py-3.5 sm:py-4 pb-6 sm:pb-4 flex items-center justify-between gap-4 shadow-lg z-20 shrink-0">
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#FF4D6D]">
                  ₹{vehicle.pricing.basePricePerDay.toLocaleString()}
                  <span className="text-xs font-bold text-slate-400"> / day</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  View Price Details
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onBookNow(vehicle)}
                className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black text-sm sm:text-base shadow-md shadow-indigo-600/25 flex items-center gap-2 hover:opacity-95 transition-all cursor-pointer focus:outline-none"
              >
                <span>Proceed to Book</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
