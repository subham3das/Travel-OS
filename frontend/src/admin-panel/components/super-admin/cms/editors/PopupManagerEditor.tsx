import React, { useState } from 'react';
import {
  MessageSquarePlus,
  Plus,
  Trash2,
  Calendar,
  Eye,
  Clock,
  ExternalLink,
  X,
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
          <h2 className="text-sm font-black text-[#0F172A]">Storefront Promo Popups</h2>
          <p className="text-[11px] text-slate-400 font-semibold">
            Control contextual modals triggered for new visitors, discounts, or app downloads
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

      {/* Empty State */}
      {popups.length === 0 ? (
        <div className="py-12 px-4 text-center border-2 border-dashed border-slate-100 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <MessageSquarePlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800">No Popups Active</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-0.5">
              Create a welcome voucher modal or app download alert to appear on the storefront.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenNewModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-black shadow-sm hover:bg-purple-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Popup</span>
          </button>
        </div>
      ) : (
        /* Popups List */
        <div className="space-y-3">
          {popups.map((popup) => (
            <div
              key={popup.id}
              className={`p-4 rounded-2xl border transition-all ${
                popup.isEnabled
                  ? 'bg-slate-50/70 border-slate-200/80 hover:border-purple-200'
                  : 'bg-slate-100/40 border-slate-200/40 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <img
                  src={popup.imageUrl || popup.mediaUrl || 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200'}
                  alt=""
                  className="w-full sm:w-28 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-black text-[#0F172A]">{popup.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{popup.description}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onSavePopup({ id: popup.id, isEnabled: !popup.isEnabled })}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-colors cursor-pointer ${
                          popup.isEnabled
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {popup.isEnabled ? 'Enabled' : 'Disabled'}
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeletePopup(popup.id)}
                        className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Popup"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-500 font-semibold">
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-black">
                      Frequency: {popup.frequency}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      Delay: {popup.delaySeconds}s
                    </span>
                    {popup.buttonText && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        Button: "{popup.buttonText}"
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
