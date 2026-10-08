import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowUpDown, Calendar, ChevronDown, Search } from 'lucide-react';
import { CarRentalSearchParams, TripType, VehicleCategory } from '../../types/carRental';
import { CarRentalTimePicker } from './CarRentalTimePicker';

interface CarSearchCardProps {
  category: VehicleCategory;
  onSearch: (params: CarRentalSearchParams) => void;
  initialPickup?: string;
  initialDrop?: string;
}

export const CarSearchCard: React.FC<CarSearchCardProps> = ({
  category,
  onSearch,
  initialPickup = '',
  initialDrop = '',
}) => {
  const [pickup, setPickup] = useState(initialPickup);
  const [drop, setDrop] = useState(initialDrop);
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('10:00 AM');
  const [tripType, setTripType] = useState<TripType>('one_way');
  const [isTripTypeOpen, setIsTripTypeOpen] = useState(false);

  const tripTypeLabels: Record<TripType, string> = {
    one_way: 'One Way',
    round_trip: 'Round Trip',
    full_day: 'Full Day',
    multi_day: 'Multi Day',
  };

  const handleSwap = () => {
    const temp = pickup;
    setPickup(drop);
    setDrop(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      pickupLocation: pickup || 'Current Location',
      dropLocation: drop,
      travelDate: date,
      pickupTime: time,
      tripType,
      category,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm relative space-y-4"
    >
      {/* Pickup & Drop Section with Floating Swap Button */}
      <div className="relative space-y-2.5">
        {/* Pickup Location */}
        <div className="flex items-center gap-3 bg-slate-50/90 rounded-2xl px-3.5 py-3 border border-slate-100 focus-within:border-[#FF4D6D]/40 focus-within:bg-white transition-all">
          <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <label className="block text-[11px] font-bold text-slate-400 leading-tight">
              Pickup Location
            </label>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Enter pickup location"
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#0F172A] placeholder:text-slate-400 focus:outline-none truncate"
            />
          </div>
        </div>

        {/* Swap Button */}
        <button
          type="button"
          onClick={handleSwap}
          aria-label="Swap pickup and drop"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md flex items-center justify-center text-slate-600 hover:text-[#FF4D6D] hover:scale-105 active:scale-95 transition-all focus:outline-none cursor-pointer"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>

        {/* Drop Location */}
        <div className="flex items-center gap-3 bg-slate-50/90 rounded-2xl px-3.5 py-3 border border-slate-100 focus-within:border-[#FF4D6D]/40 focus-within:bg-white transition-all">
          <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
          <div className="flex-1 min-w-0 pr-8">
            <label className="block text-[11px] font-bold text-slate-400 leading-tight">
              Drop Location
            </label>
            <input
              type="text"
              value={drop}
              onChange={(e) => setDrop(e.target.value)}
              placeholder="Enter drop location (optional)"
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#0F172A] placeholder:text-slate-400 focus:outline-none truncate"
            />
          </div>
        </div>
      </div>

      {/* Date, Time & Trip Type Grid (3 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Travel Date */}
        <div className="flex items-center gap-2.5 bg-slate-50/90 rounded-2xl px-3.5 py-2.5 border border-slate-100 focus-within:bg-white transition-all">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] font-bold text-slate-400 leading-tight">
              Travel Date
            </span>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#0F172A] focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Time Selector with direct type & interactive hour/minute picker */}
        <CarRentalTimePicker
          value={time}
          onChange={(newTime) => setTime(newTime)}
          label="Time"
        />

        {/* Trip Type Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsTripTypeOpen(!isTripTypeOpen)}
            className="w-full flex items-center justify-between gap-2 bg-slate-50/90 rounded-2xl px-3.5 py-2.5 border border-slate-100 text-left focus:outline-none hover:bg-slate-100/90 transition-all cursor-pointer"
          >
            <div className="min-w-0">
              <span className="block text-[10px] font-bold text-slate-400 leading-tight">
                Trip Type
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#0F172A] truncate block">
                {tripTypeLabels[tripType]}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                isTripTypeOpen ? 'rotate-180 text-[#FF4D6D]' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {isTripTypeOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 overflow-hidden"
              >
                {(Object.keys(tripTypeLabels) as TripType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setTripType(type);
                      setIsTripTypeOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-xs font-bold transition-colors flex items-center justify-between ${
                      tripType === type
                        ? 'bg-rose-50 text-[#FF4D6D]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{tripTypeLabels[type]}</span>
                    {tripType === type && <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Large Search Cars Button */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#FF4D6D] to-[#FF3358] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#FF4D6D]/25 flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer focus:outline-none"
      >
        <Search className="w-5 h-5 stroke-[2.5]" />
        <span>Search Cars</span>
      </motion.button>
    </form>
  );
};
