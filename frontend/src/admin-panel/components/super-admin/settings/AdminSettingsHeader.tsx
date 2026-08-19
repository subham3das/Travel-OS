import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  RotateCcw,
} from 'lucide-react';

interface AdminSettingsHeaderProps {
  onSaveAll: () => void;
  onResetDefault: () => void;
  isSaving?: boolean;
}

export const AdminSettingsHeader: React.FC<AdminSettingsHeaderProps> = ({
  onSaveAll,
  onResetDefault,
  isSaving = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 select-none">
      {/* Left: Back Button + Title + Subtitle */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => navigate('/admin')}
          className="w-9 h-9 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-all cursor-pointer shadow-2xs shrink-0"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Platform Settings
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Configure, customize and manage your Travel OS platform.
          </p>
        </div>
      </div>

      {/* Right Controls: Save All Settings, Reset to Default */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Save All Settings (Primary Purple CTA) */}
        <button
          onClick={onSaveAll}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer shrink-0 disabled:opacity-75"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving Changes...' : 'Save All Settings'}</span>
        </button>

        {/* Reset to Default */}
        <button
          onClick={onResetDefault}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset to Default</span>
        </button>
      </div>
    </div>
  );
};
