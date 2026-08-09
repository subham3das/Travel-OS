import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Plus, CheckCircle2, AlertCircle, X, Check, Save } from 'lucide-react';
import { TripIncident, IncidentCategory } from '../../data/tripTimeline';

interface IncidentCardProps {
  incidents: TripIncident[];
  onAddIncident: (incident: Omit<TripIncident, 'id'>) => void;
  onToggleResolve: (incidentId: string) => void;
}

const CATEGORIES: IncidentCategory[] = [
  'Medical Emergency',
  'Vehicle Breakdown',
  'Weather Issue',
  'Lost Luggage',
  'Late Arrival',
  'Other',
];

const CATEGORY_COLORS: Record<IncidentCategory, string> = {
  'Medical Emergency': 'bg-rose-100 text-rose-800 border-rose-200',
  'Vehicle Breakdown': 'bg-amber-100 text-amber-800 border-amber-200',
  'Weather Issue': 'bg-sky-100 text-sky-800 border-sky-200',
  'Lost Luggage': 'bg-purple-100 text-purple-800 border-purple-200',
  'Late Arrival': 'bg-orange-100 text-orange-800 border-orange-200',
  'Other': 'bg-slate-100 text-slate-800 border-slate-200',
};

export const IncidentCard: React.FC<IncidentCardProps> = ({
  incidents,
  onAddIncident,
  onToggleResolve,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [category, setCategory] = useState<IncidentCategory>('Medical Emergency');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('Trip Host');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const now = new Date();
    const timeStr = `${now.getDate()} May, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    onAddIncident({
      timestampText: timeStr,
      category,
      description,
      isResolved: false,
      reportedBy,
    });

    setDescription('');
    setIsAdding(false);
  };

  const openIncidentsCount = incidents.filter((i) => !i.isResolved).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Incident Log</h3>
            <p className="text-[11px] font-semibold text-slate-400">
              {openIncidentsCount > 0 ? `${openIncidentsCount} active issue(s)` : 'No open incidents'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-sm shadow-rose-600/20 transition-all cursor-pointer"
        >
          {isAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isAdding ? 'Cancel' : 'Log Incident'}</span>
        </button>
      </div>

      {/* New Incident Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Incident Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#0F172A] focus:outline-none focus:border-rose-400"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Reported By</label>
                <input
                  type="text"
                  value={reportedBy}
                  onChange={(e) => setReportedBy(e.target.value)}
                  placeholder="e.g. Guide / Host Name"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Incident Description *</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened and any action taken..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-rose-400 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="submit"
                disabled={!description.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 text-white text-xs font-extrabold transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Incident Record</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Incident List */}
      <div className="space-y-2.5">
        {incidents.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs font-extrabold text-slate-400">
            No incidents reported for this trip.
          </div>
        ) : (
          incidents.map((inc) => (
            <div
              key={inc.id}
              className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                inc.isResolved
                  ? 'bg-slate-50/70 border-slate-200/80 text-slate-600'
                  : 'bg-rose-50/40 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                      CATEGORY_COLORS[inc.category]
                    }`}
                  >
                    {inc.category}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">{inc.timestampText}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleResolve(inc.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer border ${
                    inc.isResolved
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-white text-rose-700 border-rose-300 hover:bg-rose-100'
                  }`}
                >
                  {inc.isResolved ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Resolved</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Mark Resolved</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs font-bold text-slate-800 leading-relaxed">{inc.description}</p>
              <p className="text-[10px] text-slate-400 font-medium">Logged by: {inc.reportedBy}</p>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default IncidentCard;
