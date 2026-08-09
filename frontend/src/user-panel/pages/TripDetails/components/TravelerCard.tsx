import React from 'react';
import { Users, ShieldCheck, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';
import { Trip } from '../../../data/trips';

interface TravelerCardProps {
  trip: Trip;
}

export const TravelerCard: React.FC<TravelerCardProps> = ({ trip }) => {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-5 select-none">
      {/* 1. Operations Team Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <ShieldCheck className="w-5 h-5 text-[#583BE8]" />
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Assigned Trip Team</h3>
            <p className="text-[11px] font-semibold text-slate-400">Host, guide & helpline support details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Trip Host Card */}
          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center gap-3">
            <img
              src={trip.tripHost.photo}
              alt={trip.tripHost.name}
              className="w-11 h-11 rounded-2xl object-cover shrink-0 border border-purple-200"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-black uppercase text-[#583BE8] block tracking-wider">
                {trip.tripHost.role}
              </span>
              <h4 className="font-extrabold text-[#0F172A] truncate">{trip.tripHost.name}</h4>
              <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-[#583BE8]" /> {trip.tripHost.phone}
              </p>
            </div>
          </div>

          {/* Guide Card */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-3">
            <img
              src={trip.guide.photo}
              alt={trip.guide.name}
              className="w-11 h-11 rounded-2xl object-cover shrink-0 border border-emerald-200"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-black uppercase text-emerald-700 block tracking-wider">
                {trip.guide.role}
              </span>
              <h4 className="font-extrabold text-[#0F172A] truncate">{trip.guide.name}</h4>
              <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-emerald-600" /> {trip.guide.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Travel Companions Roster */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Traveling With ({trip.companions.length})</h3>
          </div>
          <span className="text-xs font-extrabold text-slate-400">Roster Verified</span>
        </div>

        <div className="space-y-2">
          {trip.companions.map((comp) => (
            <div
              key={comp.id}
              className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={comp.photo}
                  alt={comp.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-white shadow-2xs"
                />
                <div className="min-w-0">
                  <h4 className="font-extrabold text-[#0F172A] truncate">{comp.name}</h4>
                  <p className="text-[11px] font-semibold text-slate-400">
                    {comp.gender} • {comp.age} Yrs • {comp.relationship}
                  </p>
                </div>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  comp.isPrimary
                    ? 'bg-purple-100 text-[#583BE8] border border-purple-200'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {comp.isPrimary ? 'Primary Traveler' : 'Companion'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelerCard;
