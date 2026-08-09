import React from 'react';
import { usePackageWizard } from '../../../hooks/usePackageWizard';
import { Calendar, Clock, MapPin, Users, Plus, Trash2, ShieldAlert, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { DepartureScheduleStatus } from '../../../types/packageWizard';

export const DeparturesStep: React.FC = () => {
  const {
    draft,
    addDepartureItem,
    removeDepartureItem,
    updateDepartureItem,
  } = usePackageWizard();

  const departures = draft?.stepDepartures?.departures || [];
  const packageDays = draft?.step2?.days || 7;
  const packageNights = draft?.step2?.nights || 6;
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 select-none">
      {/* Step Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#583BE8]" />
          <h3 className="text-base sm:text-lg font-black text-[#0F172A]">
            Departure Scheduling & Booking Deadlines
          </h3>
        </div>
        <p className="text-xs font-semibold text-slate-500 leading-relaxed">
          Create one or multiple departure dates for this package. Return dates and trip durations are automatically calculated based on your package configuration ({packageDays} Days / {packageNights} Nights).
        </p>
      </div>

      {/* Departures List */}
      <div className="space-y-5">
        {departures.map((dep, index) => {
          const isDateInPast = dep.departureDate < todayStr;
          const isClosingInvalid = dep.bookingClosingDate >= dep.departureDate;
          const isCapacityInvalid = dep.minimumTravelers > dep.maximumTravelers;

          return (
            <div
              key={dep.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-200/90 shadow-2xs space-y-5 relative overflow-hidden"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#583BE8] text-white font-black text-xs flex items-center justify-center">
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-[#0F172A]">
                      Departure Schedule #{index + 1}
                    </h4>
                    <p className="text-[10px] font-extrabold text-[#583BE8]">
                      {dep.departureDate ? `${dep.departureDate} @ ${dep.departureTime}` : 'Select Date & Time'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={dep.status}
                    onChange={(e) =>
                      updateDepartureItem(dep.id, { status: e.target.value as DepartureScheduleStatus })
                    }
                    className="bg-purple-50 text-[#583BE8] border border-purple-200 rounded-xl px-2.5 py-1 text-xs font-extrabold cursor-pointer"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Sold Out">Sold Out</option>
                    <option value="Booking Closed">Booking Closed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>

                  {departures.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDepartureItem(dep.id)}
                      className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                      title="Remove Departure"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-bold">
                {/* Departure Date */}
                <div>
                  <label className="text-slate-700 block mb-1">Departure Date *</label>
                  <input
                    type="date"
                    min={todayStr}
                    value={dep.departureDate}
                    onChange={(e) => updateDepartureItem(dep.id, { departureDate: e.target.value })}
                    className={`w-full bg-slate-50 border rounded-2xl px-3.5 py-2.5 text-slate-800 font-extrabold ${
                      isDateInPast ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                    }`}
                  />
                  {isDateInPast && (
                    <p className="text-[10px] text-rose-600 font-bold mt-1">Departure date cannot be in the past.</p>
                  )}
                </div>

                {/* Departure Time */}
                <div>
                  <label className="text-slate-700 block mb-1">Departure Time *</label>
                  <input
                    type="time"
                    value={dep.departureTime}
                    onChange={(e) => updateDepartureItem(dep.id, { departureTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 font-extrabold"
                  />
                </div>

                {/* Timezone Selector */}
                <div>
                  <label className="text-slate-700 block mb-1">Timezone</label>
                  <select
                    value={dep.timezone}
                    onChange={(e) => updateDepartureItem(dep.id, { timezone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 font-bold"
                  >
                    <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York (EST)">America/New_York (EST)</option>
                    <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                  </select>
                </div>

                {/* Pickup Location */}
                <div>
                  <label className="text-slate-700 block mb-1">Pickup Location *</label>
                  <input
                    type="text"
                    placeholder="e.g. Leh Airport (IXL)"
                    value={dep.pickupLocation}
                    onChange={(e) => updateDepartureItem(dep.id, { pickupLocation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 font-bold"
                  />
                </div>

                {/* Reporting Time */}
                <div>
                  <label className="text-slate-700 block mb-1">Reporting Time *</label>
                  <input
                    type="text"
                    placeholder="e.g. 07:30 AM"
                    value={dep.reportingTime}
                    onChange={(e) => updateDepartureItem(dep.id, { reportingTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 font-bold"
                  />
                </div>

                {/* Booking Closing Date */}
                <div>
                  <label className="text-slate-700 block mb-1">Booking Closing Date *</label>
                  <input
                    type="date"
                    max={dep.departureDate}
                    value={dep.bookingClosingDate}
                    onChange={(e) => updateDepartureItem(dep.id, { bookingClosingDate: e.target.value })}
                    className={`w-full bg-slate-50 border rounded-2xl px-3.5 py-2.5 text-slate-800 font-extrabold ${
                      isClosingInvalid ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                    }`}
                  />
                  {isClosingInvalid && (
                    <p className="text-[10px] text-rose-600 font-bold mt-1">Must be strictly before departure date.</p>
                  )}
                </div>

                {/* Booking Closing Time */}
                <div>
                  <label className="text-slate-700 block mb-1">Booking Closing Time *</label>
                  <input
                    type="time"
                    value={dep.bookingClosingTime}
                    onChange={(e) => updateDepartureItem(dep.id, { bookingClosingTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 font-extrabold"
                  />
                </div>

                {/* Minimum Travelers */}
                <div>
                  <label className="text-slate-700 block mb-1">Minimum Travelers *</label>
                  <input
                    type="number"
                    min={1}
                    value={dep.minimumTravelers}
                    onChange={(e) =>
                      updateDepartureItem(dep.id, { minimumTravelers: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 font-extrabold"
                  />
                </div>

                {/* Maximum Travelers */}
                <div>
                  <label className="text-slate-700 block mb-1">Maximum Travelers (Capacity) *</label>
                  <input
                    type="number"
                    min={dep.minimumTravelers}
                    value={dep.maximumTravelers}
                    onChange={(e) =>
                      updateDepartureItem(dep.id, { maximumTravelers: parseInt(e.target.value) || 1 })
                    }
                    className={`w-full bg-slate-50 border rounded-2xl px-3.5 py-2.5 text-slate-800 font-extrabold ${
                      isCapacityInvalid ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                    }`}
                  />
                  {isCapacityInvalid && (
                    <p className="text-[10px] text-rose-600 font-bold mt-1">Min travelers cannot exceed max travelers.</p>
                  )}
                </div>
              </div>

              {/* Live Summary Box for this Departure */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2 text-xs font-bold">
                <div className="flex items-center justify-between">
                  <span className="text-[#583BE8] font-black uppercase text-[10px] tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Calculated Departure Summary</span>
                  </span>
                  <span className="text-slate-500 font-semibold text-[11px]">
                    Duration: {packageDays} Days / {packageNights} Nights
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Departure</span>
                    <span className="font-extrabold text-[#583BE8]">{dep.departureDate || 'N/A'} @ {dep.departureTime}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Trip Ends (Return)</span>
                    <span className="font-extrabold text-emerald-700">{dep.returnDate || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Booking Closes</span>
                    <span className="font-extrabold text-amber-700">{dep.bookingClosingDate} @ {dep.bookingClosingTime}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Capacity & Seats</span>
                    <span className="font-extrabold text-slate-800">
                      {dep.minimumTravelers} - {dep.maximumTravelers} Max ({dep.availableSeats} Available)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Another Departure Button */}
      <button
        type="button"
        onClick={addDepartureItem}
        className="w-full py-4 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] border border-purple-200 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
      >
        <Plus className="w-4 h-4" />
        <span>+ Add Another Departure</span>
      </button>
    </div>
  );
};

export default DeparturesStep;
