import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Tag, MessageCircle, Star } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();

  const notifications = [
    { id: '1', title: 'Price Drop Alert!', text: 'Meghalaya 7-Day Package is now available at 20% discount!', time: '10m ago', icon: <Tag className="w-4 h-4 text-emerald-500" />, path: '/package/pkg-meghalaya-7d' },
    { id: '2', title: 'New Comment', text: 'Ananya Sharma commented on your Dawki trip story.', time: '1h ago', icon: <MessageCircle className="w-4 h-4 text-[#FF4D6D]" />, path: '/story/story-1' },
    { id: '3', title: 'Agency Update: Himalayan Explorers', text: 'Himalayan Explorers added 3 new high-altitude trek packages in Ladakh.', time: '1d ago', icon: <Bell className="w-4 h-4 text-purple-600" />, path: '/agency/himalayan-explorers' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h2 className="text-sm font-extrabold">Notifications</h2>
        <div className="w-8" />
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => navigate(n.path)}
            className="p-4 rounded-3xl bg-white border border-slate-100 shadow-2xs flex items-start gap-3.5 cursor-pointer hover:shadow-md transition-all"
          >
            <div className="p-2.5 rounded-2xl bg-slate-50 shrink-0">{n.icon}</div>
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">{n.title}</h4>
                <span className="text-[10px] font-semibold text-slate-400">{n.time}</span>
              </div>
              <p className="text-xs font-medium text-slate-600 leading-relaxed">{n.text}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default NotificationsPage;
