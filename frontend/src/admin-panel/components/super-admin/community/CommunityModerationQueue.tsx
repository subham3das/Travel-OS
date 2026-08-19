import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Check,
  Star,
  EyeOff,
  Ban,
  AlertTriangle,
  MoreVertical,
  Flag,
} from 'lucide-react';
import { ModerationCardItem } from '../../../types/communityManagement';

interface CommunityModerationQueueProps {
  items: ModerationCardItem[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRemove: (id: string) => void;
  onStar: (id: string) => void;
  onHide: (id: string) => void;
  onWarnUser: (authorName: string, id: string) => void;
}

export const CommunityModerationQueue: React.FC<CommunityModerationQueueProps> = ({
  items,
  activeFilter,
  onFilterChange,
  onApprove,
  onReject,
  onRemove,
  onStar,
  onHide,
  onWarnUser,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const filterPills = [
    { id: 'All', label: 'All', count: 386, color: 'bg-purple-100 text-[#6356E5]' },
    { id: 'Posts', label: 'Posts', count: 192, color: 'bg-slate-100 text-slate-700' },
    { id: 'Stories', label: 'Stories', count: 86, color: 'bg-slate-100 text-slate-700' },
    { id: 'Comments', label: 'Comments', count: 68, color: 'bg-slate-100 text-slate-700' },
    { id: 'Travel Circles', label: 'Travel Circles', count: 24, color: 'bg-slate-100 text-slate-700' },
    { id: 'Reported', label: 'Reported', count: 386, color: 'bg-rose-100 text-rose-800' },
    { id: 'Pending Review', label: 'Pending Review', count: 134, color: 'bg-amber-100 text-amber-800' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* ── 1. Header & Quick Filter Pills ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-black text-[#0F172A]">Moderation Queue</h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {filterPills.map((pill) => {
              const isActive = activeFilter.toLowerCase() === pill.id.toLowerCase();
              return (
                <button
                  key={pill.id}
                  onClick={() => onFilterChange(pill.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-2xs ${
                    isActive
                      ? 'bg-[#6356E5] text-white shadow-md shadow-[#6356E5]/20'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{pill.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
                      isActive ? 'bg-white/20 text-white' : pill.color
                    }`}
                  >
                    {pill.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-1.5 self-end md:self-auto">
          <button
            onClick={scrollLeft}
            className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Previous Items"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRight}
            className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Next Items"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── 2. Horizontal Cards Workspace ── */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
      >
        <AnimatePresence>
          {items.length === 0 ? (
            <div className="w-full py-10 text-center text-slate-400 font-semibold text-xs">
              No content items pending moderation in this filter.
            </div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                layout
                className={`w-[270px] sm:w-[290px] shrink-0 bg-white rounded-3xl border transition-all flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md ${
                  item.status === 'Reported'
                    ? 'border-rose-200/80 hover:border-rose-300'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Top Cover Image */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.coverImage}
                    alt={item.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                  {/* Status Badge */}
                  <span
                    className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xs ${
                      item.status === 'Reported'
                        ? 'bg-rose-500 text-white'
                        : item.status === 'Pending'
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {item.status}
                  </span>

                  <button className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-slate-900/60 text-white flex items-center justify-center hover:bg-slate-900 transition-colors">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                  {/* Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={item.author.avatar}
                        alt={item.author.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-black text-[#0F172A] block truncate">
                          {item.author.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium block truncate">
                          {item.author.handle}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-black shrink-0">
                      {item.type}
                    </span>
                  </div>

                  {/* Caption & Location */}
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                      {item.caption}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </p>
                  </div>

                  {/* Reports & Timestamp */}
                  <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-slate-50">
                    <span className="font-black text-rose-600">
                      Reports: {item.reportsCount}
                    </span>
                    <span className="text-slate-400">{item.createdAt}</span>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="p-2 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-1 shrink-0">
                  {/* Approve */}
                  <button
                    onClick={() => onApprove(item.id)}
                    className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors cursor-pointer border border-emerald-200 shadow-2xs"
                    title="Approve Content"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  {/* Star */}
                  <button
                    onClick={() => onStar(item.id)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer border shadow-2xs ${
                      item.isStarred
                        ? 'bg-amber-100 text-amber-600 border-amber-300'
                        : 'bg-white hover:bg-amber-50 text-slate-400 hover:text-amber-600 border-slate-200'
                    }`}
                    title="Feature / Star"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>

                  {/* Hide */}
                  <button
                    onClick={() => onHide(item.id)}
                    className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors cursor-pointer border border-slate-200 shadow-2xs"
                    title="Hide Content"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </button>

                  {/* Reject / Remove */}
                  <button
                    onClick={() => onReject(item.id)}
                    className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center justify-center transition-colors cursor-pointer border border-rose-200 shadow-2xs"
                    title="Reject Content"
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </button>

                  {/* Warn User */}
                  <button
                    onClick={() => onWarnUser(item.author.name, item.id)}
                    className="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors cursor-pointer border border-amber-200 shadow-2xs"
                    title="Warn User"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </button>

                  {/* More */}
                  <button
                    onClick={() => onRemove(item.id)}
                    className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer border border-slate-200 shadow-2xs"
                    title="More Options"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
