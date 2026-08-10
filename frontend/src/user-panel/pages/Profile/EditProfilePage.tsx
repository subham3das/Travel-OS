import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, completeProfile } = useAuth();

  const [name, setName] = useState(user?.name || 'Subham Das');
  const [bio, setBio] = useState(user?.bio || 'Passionate about mountain treks & hidden beaches');
  const [location, setLocation] = useState(user?.location || 'Dibrugarh, Assam');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    completeProfile({ name, bio, location });
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h2 className="text-sm font-extrabold">Edit Profile</h2>
        <button onClick={handleSave} className="text-xs font-extrabold text-[#FF4D6D]">Save</button>
      </header>

      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-slate-200">
            <img src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'} alt="Avatar" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white cursor-pointer">
              <Camera className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-semibold text-[#0F172A]" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-semibold text-[#0F172A]" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Bio / Tagline</label>
              <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-semibold text-[#0F172A]" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfilePage;
