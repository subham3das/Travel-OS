import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { TravelerCard, AdditionalTraveler } from './TravelerCard';

interface AdditionalTravelerListProps {
  travelers: AdditionalTraveler[];
  onAddTraveler: (newTraveler: Omit<AdditionalTraveler, 'id'>) => void;
  onEditTraveler: (updated: AdditionalTraveler) => void;
  onDeleteTraveler: (id: string) => void;
}

export const AdditionalTravelerList: React.FC<AdditionalTravelerListProps> = ({
  travelers,
  onAddTraveler,
  onEditTraveler,
  onDeleteTraveler,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdditionalTraveler | null>(null);

  const [formName, setFormName] = useState('');
  const [formAge, setFormAge] = useState('');
  const [formGender, setFormGender] = useState('Female');
  const [formType, setFormType] = useState<'Adult' | 'Child'>('Child');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormName('');
    setFormAge('');
    setFormGender('Female');
    setFormType('Child');
    setModalOpen(true);
  };

  const handleOpenEdit = (t: AdditionalTraveler) => {
    setEditingItem(t);
    setFormName(t.name);
    setFormAge(t.age);
    setFormGender(t.gender);
    setFormType(t.type);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formAge.trim()) return;

    if (editingItem) {
      onEditTraveler({
        id: editingItem.id,
        name: formName,
        age: formAge,
        gender: formGender,
        type: formType,
      });
    } else {
      onAddTraveler({
        name: formName,
        age: formAge,
        gender: formGender,
        type: formType,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
            Additional Travelers
          </h2>
          <p className="text-xs font-semibold text-slate-400">
            Add details of other travelers
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 rounded-2xl bg-[#F5F3FF] hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer focus:outline-none shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Traveler</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {travelers.map((trv, idx) => (
          <TravelerCard
            key={trv.id}
            index={idx}
            traveler={trv}
            onEdit={handleOpenEdit}
            onDelete={onDeleteTraveler}
          />
        ))}
      </div>

      {/* Modal for Add / Edit Traveler */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#0F172A]">
                {editingItem ? 'Edit Traveler' : 'Add Additional Traveler'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm font-extrabold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Age (Years) *</label>
                  <input
                    type="number"
                    required
                    value={formAge}
                    onChange={(e) => setFormAge(e.target.value)}
                    placeholder="12"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm font-extrabold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Gender *</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm font-extrabold text-[#0F172A] focus:outline-none cursor-pointer"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Category *</label>
                <div className="flex gap-3 pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="travelerType"
                      checked={formType === 'Adult'}
                      onChange={() => setFormType('Adult')}
                      className="text-[#6356E5]"
                    />
                    Adult (12+ yrs)
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="travelerType"
                      checked={formType === 'Child'}
                      onChange={() => setFormType('Child')}
                      className="text-[#6356E5]"
                    />
                    Child (Below 12 yrs)
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6356E5] text-white text-xs font-extrabold hover:bg-[#5245d6] shadow-xs cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Add Traveler'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
