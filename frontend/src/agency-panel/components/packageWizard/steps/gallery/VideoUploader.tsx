import React from 'react';
import { Plus } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';
import { VideoCard } from './VideoCard';
import { VideoFile } from '../../../../types/gallery';

export const VideoUploader: React.FC = () => {
  const { draft, addVideo, removeVideo } = usePackageWizard();

  const videos = draft?.step5?.videos || [];

  const handleAddVideo = () => {
    if (videos.length >= 2) {
      alert('Maximum 2 videos allowed.');
      return;
    }
    const mockVideo: VideoFile = {
      id: `vid-${Date.now()}`,
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      name: `Tour_Highlight_${videos.length + 1}.mp4`,
      duration: '02:10',
      sizeMB: 38.2,
      thumbnail: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=300&q=80',
    };
    addVideo(mockVideo);
  };

  return (
    <div className="space-y-2 select-none">
      <div className="flex items-center justify-between">
        <label className="text-sm font-extrabold text-[#0F172A]">
          Videos <span className="text-xs font-semibold text-slate-400">(Optional)</span>
        </label>
        <span className="text-xs font-bold text-slate-400">{videos.length} / 2 videos</span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {videos.map((vid) => (
          <VideoCard key={vid.id} video={vid} onRemove={removeVideo} />
        ))}

        {videos.length < 2 && (
          <button
            type="button"
            onClick={handleAddVideo}
            className="flex-1 min-h-[72px] p-4 rounded-2xl border-2 border-dashed border-[#583BE8]/40 hover:border-[#583BE8] bg-purple-50/30 hover:bg-purple-50 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-center"
          >
            <div className="flex items-center gap-1 text-xs font-extrabold text-[#583BE8]">
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Video</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">
              MP4, MOV • Max 500MB
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoUploader;
