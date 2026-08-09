import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Star, Calendar, IndianRupee, CheckCircle2, Clock } from 'lucide-react';
import { CustomerTripHistoryItem } from '../../data/customers';

interface TripHistoryCardProps {
  tripHistory: CustomerTripHistoryItem[];
}

export const TripHistoryCard: React.FC<TripHistoryCardProps> = ({ tripHistory }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-black text-[#0F172A] flex items-center gap-2">
          <Plane className="w-4 h-4 text-[#583BE8]" />
          Trip History ({tripHistory.length})
        </h3>
        <span className="text-xs font-semibold text-slate-400">All Completed & Upcoming Trips</span>
      </div>

      <div className="space-y-3">
        {tripHistory.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs font-bold text-slate-400">
            No trip history found.
          </div>
        ) : (
          tripHistory.map((trip) => (
            <div
              key={trip.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-black text-[#0F172A]">{trip.tripName}</h4>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      trip.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : trip.status === 'Upcoming'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {trip.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Departure: {trip.departureDate}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-extrabold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{trip.rating} / 5</span>
                </div>
                <span className="font-black text-[#0F172A] text-sm">
                  {trip.amountPaidFormatted}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default TripHistoryCard;
