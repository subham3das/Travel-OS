import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Shield, Mail, Phone, Building2, Send } from 'lucide-react';
import { RoleItem } from '../../../../types/rolesManagement';

interface AuthorizeAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: RoleItem[];
  onAuthorize: (data: {
    name: string;
    email: string;
    phone?: string;
    role: string;
    roleId: string;
    department: string;
    sendInvitation: boolean;
  }) => void;
}

export const AuthorizeAdminModal: React.FC<AuthorizeAdminModalProps> = ({
  isOpen,
  onClose,
  roles,
  onAuthorize,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Platform Operations');
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id || 'role-ops-manager');
  const [sendInvitation, setSendInvitation] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Full Name is required.');
      return;
    }

    if (!email.trim() || !validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const assignedRoleObj = roles.find((r) => r.id === selectedRoleId);
    const roleTitle = assignedRoleObj?.name || 'Administrator';

    onAuthorize({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: roleTitle,
      roleId: selectedRoleId,
      department,
      sendInvitation,
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
                <UserPlus className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A]">Authorize Admin User</h3>
                <p className="text-xs text-slate-400 font-semibold">
                  Grant access to the Super Admin Portal
                </p>
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

          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-xs font-bold text-rose-600">
              {error}
            </div>
          )}

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
                placeholder="e.g. Aman Sharma"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">
                Authorized Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin.name@travelos.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                Only this exact email address will be permitted to authenticate.
              </p>
            </div>

            {/* Phone Number & Department */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
                  />
                </div>
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

            {/* Role Selection */}
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
                    {r.name} ({r.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Send Invitation Toggle */}
            <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-[#0F172A]">Send Email Invitation</p>
                <p className="text-[10px] text-slate-400 font-medium">
                  Dispatches secure activation token link to create password
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSendInvitation(!sendInvitation)}
                className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                  sendInvitation ? 'bg-[#6356E5]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    sendInvitation ? 'left-4' : 'left-0.5'
                  }`}
                />
              </button>
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
                <UserPlus className="w-3.5 h-3.5" />
                <span>Authorize Admin</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
