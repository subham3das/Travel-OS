import React from 'react';
import { motion } from 'framer-motion';
import { Compass, MapPin, Hotel, Utensils, Armchair, Languages, Heart } from 'lucide-react';
import { TravelPreferencesInfo } from '../../data/customers';

interface TravelPreferenceCardProps {
  preferences: TravelPreferencesInfo;
}

export const TravelPreferenceCard: React.FC<TravelPreferenceCardProps> = ({ preferences }) => {
  const items = [
    { label: 'Preferred Destination', value: preferences.preferredDestination, icon: <MapPin className="w-3.5 h-3.5 text-sky-600" /> },
    { label: 'Preferred Trip Type', value: preferences.preferredTripType, icon: <Compass className="w-3.5 h-3.5 text-purple-600" /> },
    { label: 'Preferred Room Type', value: preferences.preferredRoomType, icon: <Hotel className="w-3.5 h-3.5 text-amber-600" /> },
    { label: 'Preferred Meal', value: preferences.preferredMealPreference, icon: <Utensils className="w-3.5 h-3.5 text-emerald-600" /> },
    { label: 'Preferred Seat', value: preferences.preferredSeat, icon: <Armchair className="w-3.5 h-3.5 text-blue-600" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-rose-500" />
        <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Travel Preferences</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        {items.map((item, i) => (
          <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase flex items-center gap-1">
              {item.icon}
              {item.label}
            </span>
            <span className="font-extrabold text-[#0F172A] block">{item.value}</span>
          </div>
        ))}

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase flex items-center gap-1">
            <Languages className="w-3.5 h-3.5 text-indigo-600" />
            Languages Spoken
          </span>
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            {preferences.languagesSpoken.map((lang) => (
              <span key={lang} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TravelPreferenceCard;
