import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Calendar, MapPin, Building2, UserCheck, Luggage } from 'lucide-react';
import { AdminTripItem } from '../../../types/tripManagement';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newTrip: Partial<AdminTripItem>) => void;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [packageName, setPackageName] = useState('');
  const [destination, setDestination] = useState('Meghalaya');
  const [destinationCity, setDestinationCity] = useState('Cherrapunji');
  const [agencyName, setAgencyName] = useState('Mountain Trails');
  const [guideName, setGuideName] = useState('Rahul Das');
  const [vehicleType, setVehicleType] = useState<'Tempo Traveller' | 'Innova Crysta' | 'Mini Bus' | 'Bolero'>('Tempo Traveller');
  const [departureDate, setDepartureDate] = useState('25 Jun, 2024');
  const [returnDate, setReturnDate] = useState('30 Jun, 2024');
  const [travelersCount, setTravelersCount] = useState(16);
  const [tripType, setTripType] = useState<'Group Tour' | 'Private Tour' | 'Trekking' | 'Road Trip' | 'Weekend Getaway'>('Group Tour');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      packageName: packageName || `${destination} Expedition`,
      destination,
      destinationState: destination,
      destinationCity,
      agencyName,
      guide: {
        id: 'g-new',
        name: guideName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
        phone: '+91 98765 43210',
        isOnline: true,
      },
      vehicleType,
      vehicle: `${vehicleType} (DL 01 AB 9988)`,
      departureDate,
      departureTime: '08:00 AM',
      returnDate,
      returnTime: '06:00 PM',
      travelersCount,
      maxCapacity: travelersCount + 4,
      tripType,
      status: 'Upcoming',
      progress: 0,
      rating: null,
      heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center border border-purple-100 shadow-2xs">
                <Luggage className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A]">Schedule New Trip</h3>
                <p className="text-xs text-slate-400 font-semibold">
                  Deploy live trip, fleet & guide assignment
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Package Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Trip / Package Name</label>
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="e.g. Meghalaya Monsoon Explorer"
                className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs"
                required
              />
            </div>

            {/* Destination & City */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Destination</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                >
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Ladakh">Ladakh</option>
                  <option value="Goa">Goa</option>
                  <option value="Kashmir">Kashmir</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Andaman">Andaman</option>
                  <option value="Himachal">Himachal</option>
                  <option value="Rajasthan">Rajasthan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">City / Base</label>
                <input
                  type="text"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                />
              </div>
            </div>

            {/* Operating Agency & Guide */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Operating Agency</label>
                <select
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                >
                  <option value="Mountain Trails">Mountain Trails</option>
                  <option value="Wanderlust Holidays">Wanderlust Holidays</option>
                  <option value="Goa Getaways">Goa Getaways</option>
                  <option value="Kashmir Trips">Kashmir Trips</option>
                  <option value="Kerala Holidays">Kerala Holidays</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Assigned Guide</label>
                <select
                  value={guideName}
                  onChange={(e) => setGuideName(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                >
                  <option value="Rahul Das">Rahul Das</option>
                  <option value="Tenzin Norbu">Tenzin Norbu</option>
                  <option value="Amit Verma">Amit Verma</option>
                  <option value="Irfan Ahmad">Irfan Ahmad</option>
                  <option value="Sreejith Nair">Sreejith Nair</option>
                </select>
              </div>
            </div>

            {/* Departure Date & Return Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Departure Date</label>
                <input
                  type="text"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Return Date</label>
                <input
                  type="text"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                />
              </div>
            </div>

            {/* Vehicle Type & Travelers Count */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                >
                  <option value="Tempo Traveller">Tempo Traveller</option>
                  <option value="Innova Crysta">Innova Crysta</option>
                  <option value="Mini Bus">Mini Bus</option>
                  <option value="Bolero">Bolero</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Travelers Count</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={travelersCount}
                  onChange={(e) => setTravelersCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
              >
                Deploy Trip
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
