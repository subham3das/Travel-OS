import React from 'react';
import { Play, X } from 'lucide-react';
import { VideoFile } from '../../../../types/gallery';

interface VideoCardProps {
  video: VideoFile;
  onRemove: (id: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onRemove }) => {
  return (
    <div className="bg-white rounded-2xl p-3 border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs select-none min-w-[240px] sm:min-w-[280px]">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-16 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0">
          <img src={video.thumbnail} alt={video.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center text-white">
            <div className="w-5 h-5 rounded-full bg-white/90 text-[#583BE8] flex items-center justify-center pl-0.5 shadow-xs">
              <Play className="w-2.5 h-2.5 fill-current" />
            </div>
          </div>
          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-900/80 text-white text-[9px] font-black">
            {video.duration}
          </span>
        </div>

        <div className="space-y-0.5 min-w-0 flex-1">
          <p className="text-xs font-extrabold text-[#0F172A] truncate">{video.name}</p>
          <p className="text-[10px] font-semibold text-slate-400">
            MP4 • {video.sizeMB} MB
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(video.id)}
        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
        aria-label="Remove Video"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default VideoCard;
