import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle2, Edit2, Save, X } from 'lucide-react';
import { EmergencyInfo } from '../../data/tripDetails';

interface EmergencyInformationCardProps {
  emergencyInfo: EmergencyInfo | null;
  onSave: (info: EmergencyInfo) => void;
}

const EMPTY_EMERGENCY: EmergencyInfo = {
  contactPerson: '',
  contactPhone: '',
  nearestHospital: '',
  nearestPoliceStation: '',
  backupVehicleContact: '',
  additionalNotes: '',
};

export const EmergencyInformationCard: React.FC<EmergencyInformationCardProps> = ({
  emergencyInfo,
  onSave,
}) => {
  const isCompleted = Boolean(emergencyInfo);
  const [isEditing, setIsEditing] = useState(!isCompleted);
  const [form, setForm] = useState<EmergencyInfo>(emergencyInfo ?? EMPTY_EMERGENCY);

  const handleChange = (field: keyof EmergencyInfo, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.contactPerson.trim() || !form.contactPhone.trim()) return;
    onSave(form);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setForm(emergencyInfo ?? EMPTY_EMERGENCY);
    setIsEditing(true);
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/10 transition-all';

  const FIELDS: { key: keyof EmergencyInfo; label: string; placeholder: string; required?: boolean }[] = [
    { key: 'contactPerson', label: 'Emergency Contact Person *', placeholder: 'e.g. Ramesh Kumar', required: true },
    { key: 'contactPhone', label: 'Emergency Phone Number *', placeholder: 'e.g. +91 98765 43210', required: true },
    { key: 'nearestHospital', label: 'Nearest Hospital', placeholder: 'e.g. SNM Hospital, Leh' },
    { key: 'nearestPoliceStation', label: 'Nearest Police Station', placeholder: 'e.g. Leh Police Station' },
    { key: 'backupVehicleContact', label: 'Backup Vehicle Contact', placeholder: 'e.g. +91 87654 32109' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.12 }}
      className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#0F172A]">Emergency Information</h3>
            <p className="text-[11px] font-semibold text-slate-400">Emergency contacts & local services</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isCompleted && !isEditing && (
            <>
              <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed
              </span>
              <button
                type="button"
                onClick={handleEdit}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {!isCompleted && (
            <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Pending
            </span>
          )}
        </div>
      </div>

      {/* Read-Only Completed View */}
      {isCompleted && !isEditing && emergencyInfo && (
        <div className="space-y-2.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {FIELDS.map(({ key, label }) =>
              emergencyInfo[key] ? (
                <div key={key} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">{label.replace(' *', '')}</span>
                  <span className={`font-extrabold ${key === 'contactPhone' || key === 'backupVehicleContact' ? 'text-[#583BE8]' : 'text-[#0F172A]'}`}>
                    {emergencyInfo[key]}
                  </span>
                </div>
              ) : null
            )}
          </div>
          {emergencyInfo.additionalNotes && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">Additional Notes</span>
              <span className="font-bold text-slate-700">{emergencyInfo.additionalNotes}</span>
            </div>
          )}
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FIELDS.map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">{label}</label>
                <input
                  type="text"
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600">Additional Notes</label>
            <textarea
              rows={3}
              value={form.additionalNotes}
              onChange={(e) => handleChange('additionalNotes', e.target.value)}
              placeholder="e.g. Carry satellite phone on mountain sections..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-1">
            {isCompleted && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-600 text-xs font-extrabold transition-all cursor-pointer hover:bg-slate-50"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={!form.contactPerson.trim() || !form.contactPhone.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-extrabold shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Save Emergency Information
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EmergencyInformationCard;
