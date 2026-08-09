import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MoreVertical, Phone, Mail, MessageSquare, ExternalLink, Calendar, Compass } from 'lucide-react';
import { Customer } from '../../data/customers';
import { LoyaltyBadge, TravelerTypeBadge } from './CustomerBadge';

interface CustomerCardProps {
  customer: Customer;
  index: number;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer, index }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleCardClick = () => {
    navigate(`/agency/customers/${customer.id}`);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-100'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.05 }}
      onClick={handleCardClick}
      className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-md transition-all cursor-pointer select-none space-y-3 relative group"
    >
      {/* Top Banner if customer has an upcoming trip */}
      {customer.hasUpcomingTrip && customer.upcomingTripDetails && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-2xl bg-gradient-to-r from-purple-50 via-sky-50 to-purple-50 border border-purple-100 text-[11px] font-extrabold text-[#583BE8]">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#583BE8]" />
            Upcoming Trip: {customer.upcomingTripDetails.name} ({customer.upcomingTripDetails.date})
          </span>
          <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>
      )}

      {/* Main Content Layout matching reference UI */}
      <div className="flex items-start justify-between gap-3">
        {/* Left Avatar & Basic Info */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Avatar with Online/Active indicator */}
          <div className="relative shrink-0">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white shadow-xs"
            />
            {customer.status !== 'Inactive' && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
            )}
          </div>

          {/* Customer Name, Loyalty Badge, Stars & Contact */}
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-[#0F172A] truncate">
                {customer.name}
              </h3>
              <LoyaltyBadge badge={customer.loyaltyBadge} />
              <TravelerTypeBadge type={customer.travelerType} />
            </div>

            {/* Star Rating */}
            <div className="pt-0.5">{renderStars(customer.rating)}</div>

            {/* Contact Line */}
            <p className="text-[11px] font-medium text-slate-400 truncate">
              {customer.phone} • {customer.email}
            </p>
          </div>
        </div>

        {/* Right Stats & More Button matching reference image */}
        <div className="flex items-start gap-2 shrink-0">
          <div className="text-right space-y-0.5">
            <p className="text-xs font-black text-[#0F172A]">
              {customer.totalTrips} {customer.totalTrips === 1 ? 'Trip' : 'Trips'}
            </p>
            <p className="text-sm font-black text-[#0F172A]">
              {customer.lifetimeSpendFormatted}
            </p>
            <p className="text-[11px] font-semibold text-slate-400 truncate max-w-[130px]">
              {customer.lastTrip.name}
            </p>
            <p className="text-[10px] font-bold text-slate-400">
              {customer.lastTrip.date}
            </p>
          </div>

          {/* More Options Dropdown Button */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Action Menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-7 z-30 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 text-xs font-bold text-slate-700"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      navigate(`/agency/customers/${customer.id}`);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-purple-50 hover:text-[#583BE8] flex items-center gap-2 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      window.location.href = `tel:${customer.phone}`;
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Call Customer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      window.location.href = `mailto:${customer.email}`;
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-sky-600" />
                    <span>Send Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      navigate(`/agency/messages?conversationId=${customer.id === 'cust-2' ? 'conv-2' : 'conv-1'}`);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-emerald-700 font-extrabold"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Message Customer</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerCard;
