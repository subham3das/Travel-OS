import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { userAuthService } from '../../services/userAuth.service';
import { UniversalImageUploader } from '../../../components/common/UniversalImageUploader';

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, completeProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.homeCity || user?.location || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter a valid full name', 'error');
      return;
    }
    setIsSaving(true);
    try {
      await userAuthService.updateProfile({
        fullName: name,
        bio,
        homeCity: location,
        avatar: avatarUrl || undefined,
      });
      await completeProfile({ name, bio, homeCity: location, location, avatar: avatarUrl });
      showToast('Profile updated successfully!', 'success');
      navigate('/profile');
    } catch (err: any) {
      showToast(err.message || 'Failed to save profile changes', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 cursor-pointer">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h2 className="text-sm font-extrabold">Edit Profile</h2>
        <button
          onClick={handleSave}
          disabled={isSaving || !name.trim()}
          className="text-xs font-extrabold text-[#6356E5] hover:text-[#5245d6] disabled:opacity-50 flex items-center gap-1 cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save'}
        </button>
      </header>

      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
          {/* Universal Image Uploader for Avatar */}
          <div className="max-w-[240px] mx-auto">
            <UniversalImageUploader
              label="Profile Photo"
              helpText="PNG, JPG, WEBP (Max 10MB)"
              folder="travelos/customers/profile"
              value={avatarUrl}
              onChange={(url) => setAvatarUrl(url)}
              aspectRatio="square"
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5] transition-all"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell other travelers about yourself..."
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5] transition-all resize-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Home City / Region
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bangalore, India"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5] transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Details</h3>
          <div className="flex items-center justify-between py-1 text-xs">
            <span className="font-semibold text-slate-500">Phone</span>
            <span className="font-bold text-[#0F172A]">{user?.phone || 'Not linked'}</span>
          </div>
          <div className="flex items-center justify-between py-1 text-xs border-t border-slate-100">
            <span className="font-semibold text-slate-500">Email</span>
            <span className="font-bold text-[#0F172A]">{user?.email || 'Not linked'}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfilePage;
