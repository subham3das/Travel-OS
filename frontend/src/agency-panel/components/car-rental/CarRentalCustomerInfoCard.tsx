import React from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  X,
  CreditCard,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ConversationCustomerInfo } from '../../types/inbox';

interface CarRentalCustomerInfoCardProps {
  info: ConversationCustomerInfo;
  onClose: () => void;
  onAddNote?: (note: string) => void;
}

export const CarRentalCustomerInfoCard: React.FC<CarRentalCustomerInfoCardProps> = ({
  info,
  onClose,
}) => {
  const navigate = useNavigate();

  const vehicleName = info.vehicleName || info.packageName || 'Rental Vehicle';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full md:w-80 bg-white border-l border-slate-100 p-4 sm:p-5 space-y-5 overflow-y-auto max-h-screen select-none shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-sky-500" />
          <h3 className="text-sm font-black text-[#0F172A]">Rental Customer Info</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Customer Profile Summary */}
      <div className="text-center space-y-2 pb-3 border-b border-slate-100">
        <img
          src={info.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(info.name)}`}
          alt={info.name}
          className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-sky-100 shadow-xs bg-slate-50"
        />
        <div>
          <div className="flex items-center justify-center gap-1.5">
            <h4 className="text-base font-black text-[#0F172A]">{info.name}</h4>
            {info.isVIP && (
              <span className="text-[9px] font-black uppercase text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-md border border-amber-200">
                VIP
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-400">{info.email}</p>
          <a
            href={`tel:${info.phone}`}
            className="text-xs font-bold text-sky-600 hover:underline inline-block mt-0.5"
          >
            {info.phone}
          </a>
        </div>
      </div>

      {/* Vehicle Booking Overview */}
      <div className="space-y-2.5 text-xs">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
          Vehicle Reservation
        </span>

        <div className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-bold">Booking ID</span>
            <span className="font-extrabold text-sky-600 font-mono text-[11px]">{info.bookingId}</span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-slate-400 font-bold shrink-0">Vehicle</span>
            <span className="font-extrabold text-[#0F172A] text-right truncate max-w-[150px]">{vehicleName}</span>
          </div>

          {info.pickupLocation && (
            <div className="space-y-1 pt-1 border-t border-sky-100/60">
              <div className="flex items-center gap-1 text-slate-500 font-semibold text-[11px]">
                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                <span className="truncate">{info.pickupLocation}</span>
              </div>
              {info.dropLocation && (
                <div className="flex items-center gap-1 text-slate-500 font-semibold text-[11px] pl-4">
                  <span className="text-slate-300 font-bold">➔</span>
                  <span className="truncate">{info.dropLocation}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-1 border-t border-sky-100/60 text-[11px]">
            <span className="text-slate-400 font-bold">Pickup Schedule</span>
            <span className="font-extrabold text-[#0F172A]">
              {info.departureDate || 'Scheduled'} {info.pickupTime ? `• ${info.pickupTime}` : ''}
            </span>
          </div>

          {info.returnDate && (
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400 font-bold">Return Date</span>
              <span className="font-extrabold text-[#0F172A]">{info.returnDate}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-1 border-t border-sky-100/60">
            <span className="text-slate-400 font-bold">Payment Status</span>
            <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]">
              {info.paymentStatus || 'Paid'}
            </span>
          </div>

          {info.totalAmount ? (
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400 font-bold">Total Fare</span>
              <span className="font-extrabold text-[#0F172A]">₹{info.totalAmount.toLocaleString()}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Driver Assignment Card */}
      {info.driverName && (
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
            Assigned Chauffeur
          </span>
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-[#0F172A]">{info.driverName}</span>
            {info.driverPhone && (
              <a
                href={`tel:${info.driverPhone}`}
                className="p-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                title="Call Driver"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Special Notes */}
      {info.specialNotes && (
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
            Special Instructions
          </span>
          <p className="font-medium text-slate-600">{info.specialNotes}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={() => navigate('/agency/car-rental/bookings')}
          className="w-full py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
        >
          <Car className="w-3.5 h-3.5" />
          <span>Open Bookings Hub</span>
        </button>

        <a
          href={`tel:${info.phone}`}
          className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Customer ({info.phone})</span>
        </a>
      </div>
    </motion.div>
  );
};

export default CarRentalCustomerInfoCard;
