import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, Phone, Mail, MessageSquare, ExternalLink } from 'lucide-react';
import { Customer } from '../../data/customers';

interface CustomerQuickActionsBarProps {
  customer: Customer;
}

export const CustomerQuickActionsBar: React.FC<CustomerQuickActionsBarProps> = ({ customer }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-3 select-none">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <button
          type="button"
          onClick={() => navigate('/agency/bookings')}
          className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] font-extrabold text-xs flex items-center justify-center gap-2 border border-purple-100 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>View Bookings</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/agency/trips')}
          className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-extrabold text-xs flex items-center justify-center gap-2 border border-sky-100 transition-all cursor-pointer"
        >
          <MapPin className="w-4 h-4" />
          <span>View Trips</span>
        </button>

        <a
          href={`tel:${customer.phone}`}
          className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center gap-2 border border-emerald-100 transition-all cursor-pointer"
        >
          <Phone className="w-4 h-4" />
          <span>Call Customer</span>
        </a>

        <a
          href={`mailto:${customer.email}`}
          className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-extrabold text-xs flex items-center justify-center gap-2 border border-blue-100 transition-all cursor-pointer"
        >
          <Mail className="w-4 h-4" />
          <span>Send Email</span>
        </a>

        <button
          type="button"
          onClick={() => navigate(`/agency/messages?conversationId=${customer.id === 'cust-2' ? 'conv-2' : 'conv-1'}`)}
          className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer col-span-2 sm:col-span-1"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Message Customer</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerQuickActionsBar;
