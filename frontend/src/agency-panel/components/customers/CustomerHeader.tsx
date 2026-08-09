import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Bell } from 'lucide-react';

interface CustomerHeaderProps {
  onAddCustomer?: () => void;
  onSearchClick?: () => void;
  onFilterClick?: () => void;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  onAddCustomer,
  onSearchClick,
  onFilterClick,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-slate-100/80 sticky top-0 z-30 select-none">


      {/* Main Title & Action Row */}
      <div className="px-4 sm:px-6 py-4 flex items-start justify-between gap-4 max-w-6xl mx-auto">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/agency/dashboard')}
              className="p-1 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">Customers</h1>
          </div>
          <p className="text-xs text-slate-500 font-semibold pl-7">
            Manage your customers and their travel history
          </p>
        </div>


      </div>
    </div>
  );
};

export default CustomerHeader;
