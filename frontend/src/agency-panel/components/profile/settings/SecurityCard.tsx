import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Smartphone, LogOut, Lock, CheckCircle2 } from 'lucide-react';
import { SecurityData } from '../../../data/profile';

interface SecurityCardProps {
  data: SecurityData;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({ data }) => {
  const [sessions, setSessions] = useState(data.currentSessions);

  const handleLogoutOtherDevices = () => {
    setSessions((prev) => prev.slice(0, 1));
    alert('Logged out all other sessions successfully!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Shield className="w-5 h-5 text-indigo-600" />
        <div>
          <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Security Settings</h3>
          <p className="text-[11px] font-semibold text-slate-400">Password management, active sessions & device control</p>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        {/* Change Password & 2FA Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => alert('Password Reset email link sent to your registered address!')}
            className="p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#583BE8] font-extrabold flex items-center justify-between transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-[#583BE8]" />
              <span>Change Password</span>
            </div>
            <span className="text-[10px] font-black underline">Update</span>
          </button>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-slate-500 font-extrabold">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Two-Factor Authentication</span>
            </div>
            <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Active Devices & Sessions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-[#0F172A] flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-slate-500" /> Active Sessions ({sessions.length})
            </h4>

            {sessions.length > 1 && (
              <button
                type="button"
                onClick={handleLogoutOtherDevices}
                className="text-[11px] font-extrabold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout Other Devices</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            {sessions.map((sess, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-[#0F172A]">{sess.device}</p>
                    {i === 0 && (
                      <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                        Current Session
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400">
                    IP: {sess.ip} • {sess.location}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-slate-400 shrink-0">{sess.lastActive}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SecurityCard;
