import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  ChevronDown,
  ChevronRight,
  Home,
  MapPin,
  Package,
  FileText,
  Tag,
  HelpCircle,
  ShieldAlert,
  LayoutTemplate,
  Sparkles,
  FolderArchive,
  File,
} from 'lucide-react';
import { CMSContentTreeItem } from '../../../types/cmsManagement';

interface ContentExplorerProps {
  tree: CMSContentTreeItem[];
  selectedItemId: string;
  onSelectItem: (item: CMSContentTreeItem) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onCreateContent: () => void;
}

export const ContentExplorer: React.FC<ContentExplorerProps> = ({
  tree,
  selectedItemId,
  onSelectItem,
  searchQuery,
  onSearchChange,
  onCreateContent,
}) => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    homepage: true,
    policies: true,
  });

  const toggleFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getTreeIcon = (type: CMSContentTreeItem['iconType']) => {
    switch (type) {
      case 'home':
        return <Home className="w-3.5 h-3.5 text-purple-600" />;
      case 'map':
        return <MapPin className="w-3.5 h-3.5 text-blue-500" />;
      case 'package':
        return <Package className="w-3.5 h-3.5 text-emerald-500" />;
      case 'blog':
        return <FileText className="w-3.5 h-3.5 text-rose-500" />;
      case 'tag':
        return <Tag className="w-3.5 h-3.5 text-amber-500" />;
      case 'faq':
        return <HelpCircle className="w-3.5 h-3.5 text-cyan-500" />;
      case 'file':
        return <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" />;
      case 'footer':
        return <LayoutTemplate className="w-3.5 h-3.5 text-slate-500" />;
      case 'seo':
        return <Sparkles className="w-3.5 h-3.5 text-[#6356E5]" />;
      case 'media':
      default:
        return <FolderArchive className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between h-full select-none space-y-3.5">
      {/* ── 1. Header & Create Content Button ── */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-[#0F172A]">Content Explorer</h3>
        <button
          onClick={onCreateContent}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-[11px] font-black shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-3 h-3" />
          <span>Create Content</span>
        </button>
      </div>

      {/* ── 2. Search Input ── */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search content..."
            className="w-full pl-8 pr-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all shadow-2xs"
          />
        </div>
        <button className="w-8 h-8 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer shadow-2xs">
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── 3. Tree Navigation ── */}
      <div className="space-y-1 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
        {tree.map((node) => {
          const isFolder = node.isFolder || (node.children && node.children.length > 0);
          const isOpen = openFolders[node.id] ?? node.isOpen ?? false;
          const isSelected = selectedItemId === node.id;

          return (
            <div key={node.id} className="space-y-0.5">
              {/* Parent Node */}
              <div
                onClick={() => onSelectItem(node)}
                className={`flex items-center justify-between p-2 rounded-2xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50 text-[#6356E5] font-black shadow-2xs'
                    : 'hover:bg-slate-50/80 text-slate-700 font-bold'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isFolder ? (
                    <button
                      onClick={(e) => toggleFolder(node.id, e)}
                      className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-700"
                    >
                      {isOpen ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ) : (
                    <div className="w-4 h-4" />
                  )}

                  <div className="shrink-0">{getTreeIcon(node.iconType)}</div>
                  <span className="text-xs truncate">{node.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {node.count !== undefined && (
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {node.count.toLocaleString()}
                    </span>
                  )}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                </div>
              </div>

              {/* Children Subtree */}
              {isFolder && isOpen && node.children && (
                <div className="pl-6 space-y-0.5 border-l border-slate-100 ml-4">
                  {node.children.map((child) => {
                    const isChildSelected = selectedItemId === child.id;
                    return (
                      <div
                        key={child.id}
                        onClick={() => onSelectItem(child)}
                        className={`flex items-center justify-between p-1.5 rounded-xl transition-all cursor-pointer ${
                          isChildSelected
                            ? 'bg-purple-50 text-[#6356E5] font-black'
                            : 'hover:bg-slate-50/80 text-slate-600 font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <File className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="text-[11px] truncate">{child.label}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {child.count !== undefined && (
                            <span className="text-[9px] font-mono text-slate-400">
                              {child.count}
                            </span>
                          )}
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── 4. Bottom Total Content Items ── */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
        <span>Total Content Items</span>
        <span className="font-mono font-black text-slate-900">3,040</span>
      </div>
    </div>
  );
};
