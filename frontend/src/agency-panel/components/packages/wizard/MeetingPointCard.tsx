import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface MeetingPointCardProps {
  value: string;
  onChange: (val: string) => void;
}

export const MeetingPointCard: React.FC<MeetingPointCardProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="space-y-1.5 select-none">
      <label className="text-sm font-extrabold text-[#0F172A]">
        Meeting Point <span className="text-rose-500">*</span>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {/* Input area */}
        <div className="md:col-span-2 space-y-1.5 flex flex-col justify-center">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. Leh Airport Arrival Gate"
            className="w-full px-4 py-3.5 rounded-2xl bg-white border border-slate-200/80 text-sm font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#583BE8] shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-colors"
          />
          <p className="text-xs font-semibold text-slate-400">Where travelers will meet the trip representative</p>
        </div>

        {/* Map Preview Graphic Box */}
        <div className="relative rounded-2xl border border-slate-200/80 bg-slate-100 overflow-hidden h-24 flex items-center justify-center p-3">
          {/* Map Grid Pattern background graphic */}
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] opacity-70" />

          {/* Map pin centered */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-[#583BE8] text-white flex items-center justify-center shadow-lg shadow-[#583BE8]/30 animate-bounce">
              <MapPin className="w-4 h-4 fill-white text-[#583BE8]" />
            </div>

            <button
              type="button"
              onClick={() => alert(`Map Preview for: ${value || 'Meeting Point'}`)}
              className="px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md hover:bg-white text-[#583BE8] text-[10px] font-extrabold flex items-center gap-1 shadow-xs border border-purple-100 cursor-pointer"
            >
              <span>Preview on Map</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingPointCard;
