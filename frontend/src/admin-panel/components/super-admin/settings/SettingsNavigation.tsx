import React from 'react';
import {
  Home,
  Palette,
  CreditCard,
  Code,
  Bell,
  Shield,
  Link2,
  ToggleLeft,
  Wrench,
  Database,
  Cloud,
  Sliders,
} from 'lucide-react';
import { SettingsCategoryType } from '../../../types/settingsManagement';

interface SettingsNavigationProps {
  activeCategory: SettingsCategoryType;
  onSelectCategory: (cat: SettingsCategoryType) => void;
}

export const SettingsNavigation: React.FC<SettingsNavigationProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const categories: { id: SettingsCategoryType; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <Home className="w-4 h-4" /> },
    { id: 'branding', label: 'Branding', icon: <Palette className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'apis', label: 'APIs', icon: <Code className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <Link2 className="w-4 h-4" /> },
    { id: 'features', label: 'Feature Flags', icon: <ToggleLeft className="w-4 h-4" /> },
    { id: 'maintenance', label: 'Maintenance', icon: <Wrench className="w-4 h-4" /> },
    { id: 'storage', label: 'Storage', icon: <Database className="w-4 h-4" /> },
    { id: 'backups', label: 'Backups', icon: <Cloud className="w-4 h-4" /> },
    { id: 'advanced', label: 'Advanced', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-2 select-none">
      <h3 className="text-sm font-black text-[#0F172A] px-2 pb-1 border-b border-slate-100/80">
        Settings
      </h3>

      <div className="space-y-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                isActive
                  ? 'bg-purple-50 text-[#6356E5] font-black shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div
                className={`shrink-0 ${
                  isActive ? 'text-[#6356E5]' : 'text-slate-400'
                }`}
              >
                {cat.icon}
              </div>
              <span className="truncate">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
