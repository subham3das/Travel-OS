import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Shield, Mail, Phone, Building2, Save } from 'lucide-react';
import { AuthorizedAdminItem, AdminAccountStatus } from '../../../../types/adminAccessControl';
import { RoleItem } from '../../../../types/rolesManagement';

interface EditAuthorizedAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: AuthorizedAdminItem | null;
  roles: RoleItem[];
  onSave: (id: string, partial: Partial<AuthorizedAdminItem>) => void;
}

export const EditAuthorizedAdminModal: React.FC<EditAuthorizedAdminModalProps> = ({
  isOpen,
  onClose,
  admin,
  roles,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [accountStatus, setAccountStatus] = useState<AdminAccountStatus>('Active');

  useEffect(() => {
    if (admin) {
      setName(admin.name);
      setPhone(admin.phone || '');
      setDepartment(admin.department);
      setSelectedRoleId(admin.roleId);
      setAccountStatus(admin.accountStatus);
    }
  }, [admin]);

  if (!isOpen || !admin) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedRoleObj = roles.find((r) => r.id === selectedRoleId);
    const roleTitle = assignedRoleObj?.name || admin.role;

    onSave(admin.id, {
      name: name.trim(),
      phone: phone.trim(),
      department,
      role: roleTitle,
      roleId: selectedRoleId,
      accountStatus,
    });
    onClose();
  };

  const departments = [
    'Executive Leadership',
    'Platform Operations',
    'Finance & Payouts',
    'Customer Support',
    'Marketing & CMS',
    'Security & Legal',
    'Reservations Desk',
    'Platform Engineering',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-10 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center border border-purple-100 shadow-2xs">
                <Edit2 className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A]">Edit Admin Authorization</h3>
                <p className="text-xs text-slate-400 font-semibold">{admin.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
              />
            </div>

            {/* Email (Readonly) */}
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">
                Authorized Email (Locked)
              </label>
              <input
                type="email"
                disabled
                value={admin.email}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* Phone & Department */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role & Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">
                  Assigned RBAC Role
                </label>
                <select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">
                  Account Status
                </label>
                <select
                  value={accountStatus}
                  onChange={(e) => setAccountStatus(e.target.value as AdminAccountStatus)}
                  disabled={admin.role === 'Super Admin'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5] disabled:opacity-50"
                >
                  <option value="Active">Active</option>
                  <option value="Pending Invitation">Pending Invitation</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
