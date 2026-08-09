import React from 'react';
import { Upload, Menu, Image as ImageIcon } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';

export const PackageCoverUploader: React.FC = () => {
  const { draft, setCoverImage } = usePackageWizard();

  const coverImage =
    draft?.step5?.coverImage ||
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

  const handleReplaceClick = () => {
    const mockCovers = [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    ];
    const randomCover = mockCovers[Math.floor(Math.random() * mockCovers.length)];
    setCoverImage(randomCover);
  };

  return (
    <div className="space-y-1.5 select-none">
      <label className="text-sm font-extrabold text-[#0F172A]">
        Cover Photo <span className="text-rose-500">*</span>
      </label>

      <div className="p-4 sm:p-5 rounded-3xl border-2 border-dashed border-[#583BE8]/40 bg-purple-50/30 flex flex-col sm:flex-row items-center gap-5">
        {/* Cover Preview Card */}
        <div className="relative w-full sm:w-64 h-36 rounded-2xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
          <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-[#583BE8] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
            Cover Photo
          </div>
          <div className="absolute bottom-2.5 left-2.5 w-7 h-7 rounded-xl bg-slate-900/60 backdrop-blur-xs text-white flex items-center justify-center">
            <Menu className="w-4 h-4" />
          </div>
        </div>

        {/* Requirements & Action */}
        <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
          <div className="space-y-1">
            <p className="text-xs font-black text-[#0F172A]">
              This image will be used as your package cover
            </p>
            <p className="text-xs font-semibold text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#583BE8]" />
              <span>JPG, PNG, WEBP • Max 10MB</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleReplaceClick}
            className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-[#583BE8] text-[#583BE8] text-xs font-extrabold flex items-center justify-center sm:justify-start gap-2 shadow-2xs hover:bg-purple-50 transition-all cursor-pointer inline-flex"
          >
            <Upload className="w-4 h-4 text-[#583BE8]" />
            <span>Replace Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCoverUploader;
