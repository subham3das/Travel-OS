import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { cloudinaryUploadService } from '../../../services/cloudinaryUpload.service';

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, completeProfile } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || 'Subham Das');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [bio, setBio] = useState(user?.bio || 'Passionate about mountain treks & hidden beaches');
  const [location, setLocation] = useState(user?.location || 'Dibrugarh, Assam');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleAvatarClick = () => {
    if (fileInputRef.current && !uploadingPhoto) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image file size must be less than 10MB', 'error');
      return;
    }

    setUploadingPhoto(true);
    try {
      const res = await cloudinaryUploadService.uploadProfileAvatar(file);
      setAvatarUrl(res.avatarUrl);
      completeProfile({ avatar: res.avatarUrl });
      showToast('Profile photo updated in Cloudinary successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload photo to Cloudinary', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter a valid full name', 'error');
      return;
    }
    setIsSaving(true);
    try {
      await completeProfile({ name, bio, location, avatar: avatarUrl });
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
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
            onChange={handleFileChange}
          />

          <div
            onClick={handleAvatarClick}
            className="relative w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-slate-200 cursor-pointer group"
            title="Click to upload profile photo to Cloudinary"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-rose-400 to-amber-300 flex items-center justify-center text-white font-extrabold text-2xl">
                {name ? name.slice(0, 2).toUpperCase() : 'AT'}
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              {uploadingPhoto ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Camera className="w-5 h-5" />
              )}
            </div>
          </div>
          {uploadingPhoto && (
            <p className="text-center text-xs font-semibold text-[#6356E5]">
              Uploading image to Cloudinary...
            </p>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-semibold text-[#0F172A]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-semibold text-[#0F172A]"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-600 block">Bio / Tagline</label>
                <span className="text-[11px] font-semibold text-slate-400">{bio.length}/140</span>
              </div>
              <textarea
                rows={3}
                maxLength={140}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-semibold text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#6356E5]"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfilePage;
