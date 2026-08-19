import React from 'react';
import { Laptop, Smartphone, Monitor, XCircle } from 'lucide-react';
import { AdminDeviceItem } from '../../../types/profileManagement';

interface DevicesListCardProps {
  devices: AdminDeviceItem[];
  onTerminate: (device: AdminDeviceItem) => void;
}

export const DevicesListCard: React.FC<DevicesListCardProps> = ({
  devices,
  onTerminate,
}) => {
  const getIcon = (type: AdminDeviceItem['iconType']) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-3.5 h-3.5 text-blue-600" />;
      case 'desktop':
        return <Monitor className="w-3.5 h-3.5 text-[#6356E5]" />;
      case 'laptop':
      default:
        return <Laptop className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3 select-none">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
        <h3 className="text-xs font-black text-[#0F172A]">Logged In Devices</h3>
        <span className="text-[10px] font-mono font-bold text-slate-400">
          {devices.length} Active
        </span>
      </div>

      <div className="space-y-2">
        {devices.map((dev) => (
          <div
            key={dev.id}
            className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2 text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                {getIcon(dev.iconType)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-800 text-[11px] truncate">{dev.name}</span>
                  {dev.isCurrent && (
                    <span className="px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-600 text-[8px] font-black border border-emerald-200">
                      This Device
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 font-medium block truncate">
                  {dev.browser} • {dev.location}
                </span>
                <span className="text-[8px] font-mono text-slate-400 block">{dev.lastActive}</span>
              </div>
            </div>

            {!dev.isCurrent && (
              <button
                onClick={() => onTerminate(dev)}
                className="text-[10px] font-bold text-rose-600 hover:text-rose-700 hover:underline px-2 py-1 rounded-lg shrink-0 cursor-pointer"
              >
                Terminate
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
