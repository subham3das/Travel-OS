import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Calendar, Send, Megaphone, ShoppingBag, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActionsSection: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'create-package',
      label: 'Create Package',
      icon: <PlusCircle className="w-5 h-5 text-[#583BE8]" />,
      bgColor: 'bg-purple-50 hover:bg-purple-100 text-[#583BE8]',
      onClick: () => navigate('/agency/packages/create'),
    },
    {
      id: 'finance-dashboard',
      label: 'Finance',
      icon: <IndianRupee className="w-5 h-5 text-emerald-600" />,
      bgColor: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700',
      onClick: () => navigate('/agency/finance'),
    },
    {
      id: 'add-departure',
      label: 'Add Departure',
      icon: <Calendar className="w-5 h-5 text-sky-600" />,
      bgColor: 'bg-sky-50 hover:bg-sky-100 text-sky-700',
      onClick: () => navigate('/agency/packages'),
    },
    {
      id: 'create-trip',
      label: 'Create Trip',
      icon: <Send className="w-5 h-5 text-indigo-600" />,
      bgColor: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700',
      onClick: () => navigate('/agency/trips'),
    },
    {
      id: 'view-bookings',
      label: 'View Bookings',
      icon: <ShoppingBag className="w-5 h-5 text-purple-700" />,
      bgColor: 'bg-purple-50 hover:bg-purple-100 text-purple-800',
      onClick: () => navigate('/agency/bookings'),
    },
    {
      id: 'customer-crm',
      label: 'Customers',
      icon: <Send className="w-5 h-5 text-blue-600" />,
      bgColor: 'bg-blue-50 hover:bg-blue-100 text-blue-800',
      onClick: () => navigate('/agency/customers'),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.25 }}
      className="space-y-3 select-none"
    >
      <h3 className="text-sm sm:text-base font-black text-[#0F172A] px-1">Quick Actions</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={action.onClick}
            className={`p-3.5 sm:p-4 rounded-2xl ${action.bgColor} border border-slate-100/60 shadow-2xs flex items-center gap-2.5 transition-all cursor-pointer group hover:scale-[1.02]`}
          >
            <div className="shrink-0 transition-transform group-hover:scale-110">
              {action.icon}
            </div>
            <span className="text-xs font-black tracking-tight text-left leading-tight">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActionsSection;
