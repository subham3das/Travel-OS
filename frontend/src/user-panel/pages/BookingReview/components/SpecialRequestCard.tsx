import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Utensils, Armchair, Accessibility } from 'lucide-react';

interface SpecialRequestCardProps {
  packageId: string;
}

export const SpecialRequestCard: React.FC<SpecialRequestCardProps> = ({ packageId }) => {
  const navigate = useNavigate();

  const requests = [
    { title: 'Vegetarian Meal', icon: <Utensils className="w-3.5 h-3.5 text-emerald-600" />, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { title: 'Window Seat', icon: <Armchair className="w-3.5 h-3.5 text-sky-600" />, color: 'bg-sky-50 text-sky-700 border-sky-100' },
    { title: 'Wheelchair Assistance', icon: <Accessibility className="w-3.5 h-3.5 text-purple-600" />, color: 'bg-purple-50 text-purple-700 border-purple-100' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
          Special Requests
        </h2>
        <button
          onClick={() => navigate(`/booking/traveler-details/${packageId}`)}
          className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {requests.map((req, idx) => (
          <div
            key={idx}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-extrabold flex items-center gap-2 shadow-2xs ${req.color}`}
          >
            {req.icon}
            <span>{req.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
