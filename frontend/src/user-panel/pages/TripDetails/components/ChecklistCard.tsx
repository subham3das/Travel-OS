import React, { useState } from 'react';
import { CheckSquare, ChevronRight, Check } from 'lucide-react';
import { Trip } from '../../../data/trips';

interface ChecklistCardProps {
  trip: Trip;
}

export const ChecklistCard: React.FC<ChecklistCardProps> = ({ trip }) => {
  const [items, setItems] = useState(trip.checklist);
  const [expanded, setExpanded] = useState(false);

  const completedCount = items.filter((i) => i.completed).length;

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i))
    );
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between gap-3 cursor-pointer group"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-[#0F172A] truncate">Trip Checklist</h3>
            <p className="text-xs font-bold text-emerald-600">
              {completedCount}/{items.length} Completed
            </p>
          </div>
        </div>

        <ChevronRight className={`w-5 h-5 text-slate-300 group-hover:text-[#6356E5] transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </div>

      {/* Expandable Checklist Items */}
      {expanded && (
        <div className="pt-2 border-t border-slate-100 space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                item.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
              }`}>
                {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className={`text-xs font-bold ${item.completed ? 'text-slate-400 line-through' : 'text-[#0F172A]'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
