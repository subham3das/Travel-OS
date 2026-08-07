import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Bell, Lock, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h2 className="text-sm font-extrabold">Account Settings</h2>
        <div className="w-8" />
      </header>

      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-3xl p-2 border border-slate-100 shadow-2xs divide-y divide-slate-100 text-xs font-bold text-slate-700">
          <button onClick={() => navigate('/edit-profile')} className="w-full p-4 flex items-center justify-between hover:bg-slate-50">
            <span className="flex items-center gap-3"><User className="w-4 h-4 text-[#FF4D6D]" /> Edit Account Details</span>
            <span>→</span>
          </button>
          <button onClick={() => navigate('/travel-preferences')} className="w-full p-4 flex items-center justify-between hover:bg-slate-50">
            <span className="flex items-center gap-3"><Bell className="w-4 h-4 text-purple-600" /> Travel Preferences</span>
            <span>→</span>
          </button>
          <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50">
            <span className="flex items-center gap-3"><Shield className="w-4 h-4 text-emerald-600" /> Security & Privacy</span>
            <span>→</span>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-[#FF4D6D] font-extrabold text-xs flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out of ApnaTrip</span>
        </button>
      </main>
    </div>
  );
};

export default SettingsPage;
