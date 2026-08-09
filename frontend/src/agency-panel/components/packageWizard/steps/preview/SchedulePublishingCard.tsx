import React from 'react';
import { Clock } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';

export const SchedulePublishingCard: React.FC = () => {
  const { draft, updateStep8 } = usePackageWizard();

  const step8 = draft?.step8;
  const isEnabled = step8?.scheduleEnabled || false;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#583BE8]" />
          <span className="text-xs font-black text-[#0F172A]">Schedule Publishing <span className="text-slate-400 font-semibold">(Optional)</span></span>
        </div>

        <button
          type="button"
          onClick={() => updateStep8({ scheduleEnabled: !isEnabled })}
          className={`w-11 h-6 rounded-full flex items-center transition-all cursor-pointer ${
            isEnabled ? 'bg-[#583BE8] justify-end' : 'bg-slate-200 justify-start'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white mx-0.5 shadow-md" />
        </button>
      </div>

      {isEnabled && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500">Publish Date</label>
            <input
              type="date"
              value={step8?.publishDate || ''}
              onChange={(e) => updateStep8({ publishDate: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#583BE8]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500">Publish Time</label>
            <input
              type="time"
              value={step8?.publishTime || '09:00'}
              onChange={(e) => updateStep8({ publishTime: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#583BE8]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500">Timezone</label>
            <select
              value={step8?.timezone || 'Asia/Kolkata (IST)'}
              onChange={(e) => updateStep8({ timezone: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#583BE8]"
            >
              <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York (EST)">America/New_York (EST)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePublishingCard;
