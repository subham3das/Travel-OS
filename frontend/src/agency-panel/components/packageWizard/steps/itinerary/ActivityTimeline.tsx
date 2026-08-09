import React from 'react';
import { Plus, MoreVertical, Trash2 } from 'lucide-react';
import { Activity } from '../../../../types/itinerary';

interface ActivityTimelineProps {
  activities: Activity[];
  onChange: (activities: Activity[]) => void;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  onChange,
}) => {
  const handleTimeChange = (id: string, newTime: string) => {
    onChange(activities.map((a) => (a.id === id ? { ...a, time: newTime } : a)));
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    onChange(activities.map((a) => (a.id === id ? { ...a, title: newTitle } : a)));
  };

  const handleRemove = (id: string) => {
    if (activities.length <= 1) {
      alert('Each day must contain at least one activity.');
      return;
    }
    onChange(activities.filter((a) => a.id !== id));
  };

  const handleAddActivity = () => {
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      time: '12:00',
      title: 'New Activity',
    };
    onChange([...activities, newActivity]);
  };

  return (
    <div className="space-y-2.5 select-none">
      <label className="text-xs font-extrabold text-[#0F172A]">Activities & Timeline</label>

      <div className="space-y-3 pt-1 relative">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative flex items-center gap-3">
            {/* Timeline line connection */}
            {index < activities.length - 1 && (
              <div className="absolute left-[3.25rem] top-7 bottom-0 w-0.5 bg-slate-200 -z-0" />
            )}

            {/* Time Input */}
            <input
              type="text"
              value={activity.time}
              onChange={(e) => handleTimeChange(activity.id, e.target.value)}
              placeholder="09:00"
              className="w-14 text-xs font-extrabold text-[#583BE8] text-center bg-transparent focus:outline-none shrink-0"
            />

            {/* Timeline Dot */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#583BE8] shrink-0 z-10 shadow-xs" />

            {/* Title Input Card */}
            <div className="flex-1 bg-white rounded-2xl p-2.5 px-3.5 border border-slate-200/80 flex items-center justify-between gap-2 shadow-2xs">
              <input
                type="text"
                value={activity.title}
                onChange={(e) => handleTitleChange(activity.id, e.target.value)}
                placeholder="Activity Title"
                className="w-full text-xs font-bold text-[#0F172A] bg-transparent focus:outline-none"
              />

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => alert(`Options for ${activity.title}`)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(activity.id)}
                  className="p-1 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Activity Button */}
      <button
        type="button"
        onClick={handleAddActivity}
        className="w-full py-2.5 rounded-2xl border-2 border-dashed border-[#583BE8]/50 hover:border-[#583BE8] bg-purple-50/40 hover:bg-purple-50 text-[#583BE8] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Add Activity</span>
      </button>
    </div>
  );
};

export default ActivityTimeline;
