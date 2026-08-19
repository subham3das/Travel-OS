import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Star,
  ShieldCheck,
  Calendar,
  Trash2,
  ArrowUpDown,
  CheckCircle2,
} from 'lucide-react';
import { FeaturedAgencyItem } from '../../../../types/cmsManagement';

interface FeaturedAgenciesEditorProps {
  agencies: FeaturedAgencyItem[];
  onSaveAgency: (agency: Partial<FeaturedAgencyItem>) => void;
  onDeleteAgency: (id: string) => void;
}

export const FeaturedAgenciesEditor: React.FC<FeaturedAgenciesEditorProps> = ({
  agencies,
  onSaveAgency,
  onDeleteAgency,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [agencyName, setAgencyName] = useState('');
  const [rating, setRating] = useState('4.9');
  const [featuredUntil, setFeaturedUntil] = useState('2025-12-31');

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName.trim()) return;
    onSaveAgency({
      agencyName: agencyName.trim(),
      agencyLogo:
        'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop',
      rating: parseFloat(rating) || 4.8,
      isVerified: true,
      featuredUntil,
      priority: agencies.length + 1,
      sortOrder: agencies.length + 1,
      isEnabled: true,
    });
    setAgencyName('');
    setIsAddingNew(false);
  };

  const activeCount = agencies.filter((a) => a.isEnabled).length;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-[#0F172A]">Featured Agency Partners</h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black border border-emerald-200">
              {activeCount}/8 Slots Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
            Highlight verified agency partners directly on the marketplace homepage
          </p>
        </div>
        <button
          type="button"
          disabled={activeCount >= 8 && !isAddingNew}
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAddingNew ? 'Cancel' : '+ Feature Agency'}</span>
        </button>
      </div>

      {/* Add New Agency Form */}
      {isAddingNew && (
        <form
          onSubmit={handleAddNew}
          className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-3 text-xs"
        >
          <span className="font-black text-[#0F172A] block">Add Agency to Homepage Showcase</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                Agency Name
              </label>
              <input
                type="text"
                required
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="e.g. Royal Rajasthan Voyages"
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                Star Rating
              </label>
              <input
                type="number"
                step="0.05"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                Featured Until Date
              </label>
              <input
                type="date"
                value={featuredUntil}
                onChange={(e) => setFeaturedUntil(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold text-[#0F172A]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-black shadow-xs cursor-pointer"
            >
              Confirm Feature
            </button>
          </div>
        </form>
      )}

      {/* Agencies List */}
      <div className="space-y-2.5">
        {agencies.map((agency, idx) => (
          <div
            key={agency.id}
            className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              agency.isEnabled
                ? 'bg-slate-50/80 border-slate-200 hover:border-emerald-200'
                : 'bg-slate-100/50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-6 text-center text-xs font-black text-slate-400">
                #{idx + 1}
              </span>
              <img
                src={agency.agencyLogo}
                alt={agency.agencyName}
                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black text-[#0F172A] truncate">
                    {agency.agencyName}
                  </h3>
                  {agency.isVerified && (
                    <span className="text-[9px] font-black text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                      <ShieldCheck className="w-2.5 h-2.5" /> Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold mt-0.5">
                  <span className="flex items-center gap-0.5 text-amber-600 font-black">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {agency.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> Until {agency.featuredUntil}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() =>
                  onSaveAgency({ id: agency.id, isEnabled: !agency.isEnabled })
                }
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-colors cursor-pointer ${
                  agency.isEnabled
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {agency.isEnabled ? 'Featured' : 'Inactive'}
              </button>

              <button
                type="button"
                onClick={() => onDeleteAgency(agency.id)}
                className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-rose-600 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
