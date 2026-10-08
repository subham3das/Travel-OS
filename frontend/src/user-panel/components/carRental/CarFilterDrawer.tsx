import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import {
  CarRentalFilterState,
  FuelType,
  TransmissionType,
  VehicleType,
} from '../../types/carRental';

interface CarFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: CarRentalFilterState;
  onApplyFilters: (filters: CarRentalFilterState) => void;
}

export const INITIAL_FILTERS: CarRentalFilterState = {
  priceRange: [1000, 15000],
  vehicleTypes: [],
  seats: [],
  fuel: [],
  transmission: [],
  driverIncluded: null,
  hasAC: null,
  minRating: 0,
  onlyVerifiedProviders: false,
  availabilityOnly: false,
};

export const CarFilterDrawer: React.FC<CarFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<CarRentalFilterState>(filters);

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

  const vehicleTypesList: { id: VehicleType; label: string }[] = [
    { id: 'hatchback', label: 'Hatchback' },
    { id: 'sedan', label: 'Sedan' },
    { id: 'suv', label: 'SUV' },
    { id: 'tempo_traveller', label: 'Tempo Traveller' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'mini_bus', label: 'Mini Bus' },
  ];

  const fuelList: FuelType[] = ['Diesel', 'Petrol', 'CNG', 'Electric'];
  const transmissionList: TransmissionType[] = ['Automatic', 'Manual'];
  const seatsList = [4, 5, 7, 12, 22];

  const toggleVehicleType = (type: VehicleType) => {
    setLocalFilters((prev) => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.includes(type)
        ? prev.vehicleTypes.filter((t) => t !== type)
        : [...prev.vehicleTypes, type],
    }));
  };

  const toggleFuel = (fuel: FuelType) => {
    setLocalFilters((prev) => ({
      ...prev,
      fuel: prev.fuel.includes(fuel)
        ? prev.fuel.filter((f) => f !== fuel)
        : [...prev.fuel, fuel],
    }));
  };

  const toggleTransmission = (trans: TransmissionType) => {
    setLocalFilters((prev) => ({
      ...prev,
      transmission: prev.transmission.includes(trans)
        ? prev.transmission.filter((t) => t !== trans)
        : [...prev.transmission, trans],
    }));
  };

  const toggleSeat = (seat: number) => {
    setLocalFilters((prev) => ({
      ...prev,
      seats: prev.seats.includes(seat)
        ? prev.seats.filter((s) => s !== seat)
        : [...prev.seats, seat],
    }));
  };

  const handleReset = () => {
    setLocalFilters(INITIAL_FILTERS);
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Drawer / Modal Content */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#FF4D6D]" />
                <h3 className="text-base font-black text-[#0F172A]">Filter Vehicles</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Filters Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
              {/* Max Price Range */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                    Max Price Per Day
                  </label>
                  <span className="text-sm font-black text-[#FF4D6D]">
                    ₹{localFilters.priceRange[1].toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={15000}
                  step={500}
                  value={localFilters.priceRange[1]}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], Number(e.target.value)],
                    }))
                  }
                  className="w-full accent-[#FF4D6D] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>₹1,000</span>
                  <span>₹15,000+</span>
                </div>
              </div>

              {/* Vehicle Type */}
              <div className="space-y-2.5">
                <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider block">
                  Vehicle Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {vehicleTypesList.map((type) => {
                    const active = localFilters.vehicleTypes.includes(type.id);
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => toggleVehicleType(type.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          active
                            ? 'bg-[#FF4D6D] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5" />}
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seating Capacity */}
              <div className="space-y-2.5">
                <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider block">
                  Seating Capacity
                </label>
                <div className="flex flex-wrap gap-2">
                  {seatsList.map((seat) => {
                    const active = localFilters.seats.includes(seat);
                    return (
                      <button
                        key={seat}
                        type="button"
                        onClick={() => toggleSeat(seat)}
                        className={`w-12 h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          active
                            ? 'bg-[#FF4D6D] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span>{seat}+</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fuel Type */}
              <div className="space-y-2.5">
                <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider block">
                  Fuel Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {fuelList.map((f) => {
                    const active = localFilters.fuel.includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFuel(f)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          active
                            ? 'bg-[#FF4D6D] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5" />}
                        <span>{f}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Transmission */}
              <div className="space-y-2.5">
                <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider block">
                  Transmission
                </label>
                <div className="flex gap-2">
                  {transmissionList.map((t) => {
                    const active = localFilters.transmission.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTransmission(t)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          active
                            ? 'bg-[#FF4D6D] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5" />}
                        <span>{t}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Verified Providers & Features */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-slate-700">
                    Verified Providers Only
                  </span>
                  <input
                    type="checkbox"
                    checked={localFilters.onlyVerifiedProviders}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        onlyVerifiedProviders: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-[#FF4D6D] rounded-sm cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-slate-700">
                    Driver Included
                  </span>
                  <input
                    type="checkbox"
                    checked={localFilters.driverIncluded === true}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        driverIncluded: e.target.checked ? true : null,
                      }))
                    }
                    className="w-4 h-4 accent-[#FF4D6D] rounded-sm cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF4D6D] to-[#FF3358] text-white font-black text-sm shadow-md shadow-[#FF4D6D]/20 hover:opacity-95 transition-all cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
