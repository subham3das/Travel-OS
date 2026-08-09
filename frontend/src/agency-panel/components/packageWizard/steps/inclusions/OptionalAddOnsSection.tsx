import React, { useState } from 'react';
import { Bike, Car, Camera, Tent, Bed, ChevronUp, ChevronDown } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';
import { ADDON_OPTIONS_CONFIG, AddOnOption } from '../../../../data/packageOptions';

export const OptionalAddOnsSection: React.FC = () => {
  const { draft, toggleAddOn, updateAddOnPrice } = usePackageWizard();

  const [isExpanded, setIsExpanded] = useState(true);

  const optionalAddOns = draft?.step6?.optionalAddOns || [];
  const activeCount = optionalAddOns.filter((a) => a.enabled).length;

  const getAddOnIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bike':
        return <Bike className="w-5 h-5 text-[#583BE8]" />;
      case 'Car':
        return <Car className="w-5 h-5 text-[#583BE8]" />;
      case 'Camera':
        return <Camera className="w-5 h-5 text-[#583BE8]" />;
      case 'Tent':
        return <Tent className="w-5 h-5 text-[#583BE8]" />;
      case 'Bed':
        return <Bed className="w-5 h-5 text-[#583BE8]" />;
      default:
        return <Bike className="w-5 h-5 text-[#583BE8]" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-base sm:text-lg font-black text-[#0F172A]">Optional Add-ons</h3>
          <p className="text-xs font-semibold text-slate-400">Enhance your travelers' experience</p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <span>{activeCount} active</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-2.5 pt-1">
          {ADDON_OPTIONS_CONFIG.map((addon) => {
            const addOnState = optionalAddOns.find((a) => a.id === addon.id) || {
              id: addon.id,
              enabled: false,
              price: addon.defaultPrice,
            };
            const isEnabled = addOnState.enabled;

            return (
              <div
                key={addon.id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  isEnabled
                    ? 'bg-purple-50/40 border-[#583BE8]/60 shadow-2xs'
                    : 'bg-white border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isEnabled ? 'bg-purple-100 text-[#583BE8]' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {getAddOnIcon(addon.icon)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#0F172A]">{addon.label}</p>
                    <p className="text-[11px] font-semibold text-slate-400">{addon.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => toggleAddOn(addon.id, addon.defaultPrice)}
                    className={`w-11 h-6 rounded-full flex items-center transition-all cursor-pointer ${
                      isEnabled ? 'bg-[#583BE8] justify-end' : 'bg-slate-200 justify-start'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white mx-0.5 shadow-md" />
                  </button>

                  {/* Price input when enabled */}
                  {isEnabled && (
                    <div className="relative w-28">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
                        ₹
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={addOnState.price || ''}
                        onChange={(e) => updateAddOnPrice(addon.id, parseInt(e.target.value) || 0)}
                        placeholder="2,500"
                        className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OptionalAddOnsSection;
