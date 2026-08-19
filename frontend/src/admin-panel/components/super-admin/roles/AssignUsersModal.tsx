import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Check, Search } from 'lucide-react';
import { RoleItem } from '../../../types/rolesManagement';

interface AssignUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleItem;
  onAssign: (userIds: string[]) => void;
}

export const AssignUsersModal: React.FC<AssignUsersModalProps> = ({
  isOpen,
  onClose,
  role,
  onAssign,
}) => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(['u1', 'u2']);
  const [search, setSearch] = useState('');

  const usersList = [
    { id: 'u1', name: 'Neha Sharma', email: 'neha.sharma@travelos.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120' },
    { id: 'u2', name: 'Arjun Mehta', email: 'arjun.mehta@travelos.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120' },
    { id: 'u3', name: 'Rajat Verma', email: 'rajat.verma@travelos.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120' },
    { id: 'u4', name: 'Pooja Nair', email: 'pooja.nair@travelos.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120' },
    { id: 'u5', name: 'Vikram Singh', email: 'vikram.singh@travelos.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=120' },
  ];

  if (!isOpen) return null;

  const toggleUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onAssign(selectedUserIds);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center border border-purple-100 shadow-2xs">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A]">Assign Users</h3>
                <p className="text-xs text-slate-400 font-semibold">
                  Assign admins to {role.name}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search admins by name or email..."
                className="w-full pl-8 pr-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6356E5]"
              />
            </div>

            {/* List */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {usersList.map((user) => {
                const isSelected = selectedUserIds.includes(user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => toggleUser(user.id)}
                    className={`flex items-center justify-between p-2 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-50/60 border-[#6356E5]'
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 text-xs block truncate">
                          {user.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate font-mono">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#6356E5] text-white shadow-xs'
                          : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2.5 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Assignments</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
