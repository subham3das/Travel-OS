import React, { useState } from 'react';
import {
  MessageSquarePlus,
  Plus,
  Clock,
  Users,
  Eye,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { PromoPopupItem } from '../../../../types/cmsManagement';

interface PopupManagerEditorProps {
  popups: PromoPopupItem[];
  onSavePopup: (pop: Partial<PromoPopupItem>) => void;
  onDeletePopup: (id: string) => void;
  onOpenNewModal: () => void;
}

export const PopupManagerEditor: React.FC<PopupManagerEditorProps> = ({
  popups,
  onSavePopup,
  onDeletePopup,
  onOpenNewModal,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-black text-[#0F172A]">Storefront Popup Manager</h2>
          <p className="text-[11px] text-slate-400 font-semibold">
            Configure promotional modal popups for mobile app downloads and lead generation
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenNewModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Popup</span>
        </button>
      </div>

      {/* Popups Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {popups.map((pop) => (
          <div
            key={pop.id}
            className={`p-4 rounded-2xl border transition-all ${
              pop.isEnabled
                ? 'bg-slate-50/80 border-slate-200 hover:border-purple-200'
                : 'bg-slate-100/50 border-slate-200 opacity-60'
            }`}
          >
            <div className="relative h-28 rounded-xl overflow-hidden bg-slate-200 mb-2.5 border border-slate-200">
              <img src={pop.imageUrl} alt={pop.title} className="w-full h-full object-cover" />
              <span
                className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black ${
                  pop.isEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'
                }`}
              >
                {pop.isEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-black text-[#0F172A]">{pop.title}</h3>
              <p className="text-[11px] text-slate-600 font-medium line-clamp-2">
                {pop.description}
              </p>

              <div className="space-y-1 pt-1 text-[10px] text-slate-500 font-semibold border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Delay: {pop.delaySeconds}s
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" /> Audience: {pop.audience}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Frequency: {pop.frequency.replace(/_/g, ' ')}</span>
                  <span className="text-[#6356E5] font-black">CTA: {pop.buttonText}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => onSavePopup({ id: pop.id, isEnabled: !pop.isEnabled })}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-colors cursor-pointer ${
                    pop.isEnabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {pop.isEnabled ? 'Active' : 'Off'}
                </button>
                <button
                  type="button"
                  onClick={() => onDeletePopup(pop.id)}
                  className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-rose-600 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
