import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { MOCK_COVERED_DESTINATIONS_SUGGESTIONS } from '../../../data/destinations';

interface DestinationChipListProps {
  destinations: string[];
  onChange: (dests: string[]) => void;
}

export const DestinationChipList: React.FC<DestinationChipListProps> = ({
  destinations,
  onChange,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [newInput, setNewInput] = useState('');

  const handleRemove = (index: number) => {
    onChange(destinations.filter((_, i) => i !== index));
  };

  const handleAdd = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !destinations.includes(trimmed)) {
      onChange([...destinations, trimmed]);
    }
    setNewInput('');
    setShowInput(false);
  };

  const handleAddSuggested = () => {
    const nextUnadded = MOCK_COVERED_DESTINATIONS_SUGGESTIONS.find(
      (s) => !destinations.includes(s)
    );
    if (nextUnadded) {
      onChange([...destinations, nextUnadded]);
    } else {
      setShowInput(true);
    }
  };

  return (
    <div className="space-y-2 select-none">
      <label className="text-sm font-extrabold text-[#0F172A]">
        Destinations Covered <span className="text-rose-500">*</span>
      </label>
      <p className="text-xs font-semibold text-slate-400">Add all the places included in this package</p>

      {/* Chips Container */}
      <div className="flex flex-wrap gap-2 pt-1">
        {destinations.map((dest, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100/90 text-slate-800 text-xs font-extrabold border border-slate-200/60 shadow-2xs"
          >
            <span>{dest}</span>
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="p-0.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Custom Input or Quick Add Button */}
      {showInput ? (
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={newInput}
            onChange={(e) => setNewInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd(newInput);
              }
            }}
            placeholder="Enter destination name..."
            autoFocus
            className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-[#583BE8] text-xs font-bold text-[#0F172A] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleAdd(newInput)}
            className="px-4 py-2.5 rounded-2xl bg-[#583BE8] text-white text-xs font-extrabold cursor-pointer"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowInput(false)}
            className="px-3 py-2.5 rounded-2xl border border-slate-200 text-slate-500 text-xs font-bold cursor-pointer"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleAddSuggested}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-purple-200 hover:border-[#583BE8] bg-purple-50/30 hover:bg-purple-50/70 text-[#583BE8] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Destination</span>
        </button>
      )}
    </div>
  );
};

export default DestinationChipList;
