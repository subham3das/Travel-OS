import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Package, MapPin, User } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', path: '/agency/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'bookings', label: 'Bookings', path: '/agency/bookings', icon: <Calendar className="w-5 h-5" /> },
    { id: 'packages', label: 'Packages', path: '/agency/packages', icon: <Package className="w-5 h-5" /> },
    { id: 'trips', label: 'Trips', path: '/agency/trips', icon: <MapPin className="w-5 h-5" /> },
    { id: 'customers', label: 'Customer', path: '/agency/customers', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 px-2 py-1.5 shadow-lg select-none">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path || location.pathname.startsWith(tab.path);

          return (
            <button
              key={tab.id}
              onClick={() => {
                navigate(tab.path);
              }}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-[#583BE8] font-bold' : 'text-slate-400 font-medium hover:text-slate-600'
              }`}
            >
              {tab.icon}
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
