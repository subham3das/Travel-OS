import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  LayoutGrid,
  Users,
  Building2,
  CalendarCheck,
  Package,
  CreditCard,
  Compass,
  Headphones,
  FileText,
  Settings,
  ChevronRight,
  Sparkles,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
  HardDrive,
  Shield,
  Layers,
  Star,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  GlobalSearchCategory,
  GlobalSearchResultItem,
  QuickCommandItem,
  RecentSearchItem,
} from '../../../types/globalSearch';
import { globalSearchService } from '../../../services/globalSearch.service';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<GlobalSearchCategory>('all');
  const [results, setResults] = useState<GlobalSearchResultItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const [quickCommands, setQuickCommands] = useState<QuickCommandItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Focus input and load initial data when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuickCommands(globalSearchService.getQuickCommands());
      setRecentSearches(globalSearchService.getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setActiveCategory('all');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    const timer = setTimeout(async () => {
      const data = await globalSearchService.search(query, activeCategory);
      setResults(data);
      setIsLoading(false);
      setSelectedIndex(0);
    }, 120);

    return () => clearTimeout(timer);
  }, [query, activeCategory, isOpen]);

  // Grouped results by category
  const groupedResults = useMemo(() => {
    const groups: { [key: string]: GlobalSearchResultItem[] } = {};
    results.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [results]);

  // Flattened items for keyboard navigation
  const flatResultItems = useMemo(() => {
    return results;
  }, [results]);

  // Keyboard navigation listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < flatResultItems.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : flatResultItems.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatResultItems.length > 0 && flatResultItems[selectedIndex]) {
          handleSelectResult(flatResultItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatResultItems, selectedIndex]);

  if (!isOpen) return null;

  const handleSelectResult = (item: GlobalSearchResultItem) => {
    globalSearchService.addRecentSearch(item.title, item.targetRoute);
    onClose();
    if (item.targetRoute) {
      navigate(item.targetRoute);
    }
  };

  const handleSelectCommand = (cmd: QuickCommandItem) => {
    globalSearchService.addRecentSearch(cmd.title, cmd.targetRoute);
    onClose();
    if (cmd.targetRoute) {
      navigate(cmd.targetRoute);
    }
  };

  const handleSelectRecent = (rec: RecentSearchItem) => {
    setQuery(rec.query);
    if (rec.targetRoute) {
      navigate(rec.targetRoute);
      onClose();
    }
  };

  const handleClearRecent = () => {
    globalSearchService.clearAllRecentSearches();
    setRecentSearches([]);
  };

  const getCategoryTitle = (cat: string, count: number) => {
    switch (cat) {
      case 'agencies':
        return `Agencies (${count})`;
      case 'users':
        return `Users (${count})`;
      case 'bookings':
        return `Bookings (${count})`;
      case 'packages':
        return `Packages (${count})`;
      case 'payments':
        return `Payments (${count})`;
      case 'support':
        return `Support Tickets (${count})`;
      case 'trips':
        return `Trips (${count})`;
      case 'reviews':
        return `Reviews (${count})`;
      case 'reports':
        return `Reports (${count})`;
      case 'settings':
        return `Platform Settings (${count})`;
      default:
        return `${cat} (${count})`;
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'agencies':
        return <Building2 className="w-4 h-4 text-[#6356E5]" />;
      case 'users':
        return <Users className="w-4 h-4 text-emerald-600" />;
      case 'bookings':
        return <CalendarCheck className="w-4 h-4 text-blue-600" />;
      case 'packages':
        return <Package className="w-4 h-4 text-amber-600" />;
      case 'payments':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'support':
        return <Headphones className="w-4 h-4 text-rose-600" />;
      case 'trips':
        return <Compass className="w-4 h-4 text-indigo-600" />;
      case 'reviews':
        return <Star className="w-4 h-4 text-amber-500" />;
      case 'reports':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'settings':
      default:
        return <Settings className="w-4 h-4 text-slate-600" />;
    }
  };

  const getCommandIcon = (iconType: QuickCommandItem['iconType']) => {
    switch (iconType) {
      case 'agency':
        return <Building2 className="w-4 h-4 text-[#6356E5]" />;
      case 'package':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'booking':
        return <CalendarCheck className="w-4 h-4 text-emerald-600" />;
      case 'report':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'backup':
        return <HardDrive className="w-4 h-4 text-indigo-600" />;
      case 'settings':
        return <Settings className="w-4 h-4 text-slate-600" />;
      case 'audit':
        return <Shield className="w-4 h-4 text-rose-600" />;
      case 'support':
      default:
        return <Headphones className="w-4 h-4 text-amber-600" />;
    }
  };

  const getStatusBadge = (status?: string, color?: GlobalSearchResultItem['statusColor']) => {
    if (!status) return null;
    let colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
    if (color === 'emerald') colorClasses = 'bg-emerald-50 text-emerald-600 border-emerald-200';
    if (color === 'amber') colorClasses = 'bg-amber-50 text-amber-600 border-amber-200';
    if (color === 'rose') colorClasses = 'bg-rose-50 text-rose-600 border-rose-200';
    if (color === 'blue') colorClasses = 'bg-blue-50 text-blue-600 border-blue-200';
    if (color === 'purple') colorClasses = 'bg-purple-50 text-[#6356E5] border-purple-200';

    return (
      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${colorClasses}`}>
        {status}
      </span>
    );
  };

  const filterTabs: { id: GlobalSearchCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'agencies', label: 'Agencies', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'bookings', label: 'Bookings', icon: <CalendarCheck className="w-3.5 h-3.5" /> },
    { id: 'packages', label: 'Packages', icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'trips', label: 'Trips', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'support', label: 'Support', icon: <Headphones className="w-3.5 h-3.5" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-3.5 h-3.5" /> },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 sm:p-6 select-none">
        {/* ── Dark Translucent Backdrop with Blur ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* ── Main Command Center Palette Card ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-[1080px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── 1. TOP SEARCH INPUT HEADER ── */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3.5 bg-slate-50/40 shrink-0">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center border border-purple-100 shrink-0 shadow-2xs">
              <Search className="w-4.5 h-4.5" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything in Travel OS..."
              className="flex-1 bg-transparent text-sm sm:text-base font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}

            <div className="flex items-center gap-2 shrink-0">
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-extrabold text-[#6356E5] bg-purple-50 border border-purple-100 rounded-xl shadow-2xs">
                Ctrl + K
              </kbd>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Close Command Palette"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── 2. CATEGORY FILTER CHIPS ── */}
          <div className="px-4 sm:px-5 py-2.5 border-b border-slate-100/90 bg-white flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {filterTabs.map((tab) => {
              const isSelected = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#6356E5] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── 3. MAIN SPLIT BODY SECTION ── */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* ── LEFT PANEL (≈30% / Quick Commands + Recent Searches) ── */}
            <div className="w-full md:w-80 border-r border-slate-100/90 bg-slate-50/40 p-4 flex flex-col justify-between gap-4 overflow-y-auto scrollbar-thin shrink-0">
              {/* Quick Commands */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block px-1">
                  Quick Commands
                </span>

                <div className="space-y-1">
                  {quickCommands.map((cmd) => (
                    <button
                      key={cmd.id}
                      type="button"
                      onClick={() => handleSelectCommand(cmd)}
                      className="w-full flex items-center justify-between p-2 rounded-2xl bg-white hover:bg-purple-50/70 border border-slate-100/80 hover:border-purple-200 text-left transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-xl bg-slate-50 group-hover:bg-white border border-slate-100 flex items-center justify-center shrink-0">
                          {getCommandIcon(cmd.iconType)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-[#0F172A] group-hover:text-[#6356E5] transition-colors truncate">
                            {cmd.title}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium truncate">
                            {cmd.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#6356E5] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="pt-2 border-t border-slate-200/60 space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={handleClearRecent}
                      className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((rec) => (
                      <button
                        key={rec.id}
                        type="button"
                        onClick={() => handleSelectRecent(rec)}
                        className="px-2.5 py-1 rounded-xl bg-white hover:bg-purple-50 border border-slate-200/80 text-[11px] font-bold text-slate-700 hover:text-[#6356E5] hover:border-purple-200 transition-all cursor-pointer shadow-2xs"
                      >
                        {rec.query}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT PANEL (≈70% / Search Results Feed) ── */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 scrollbar-thin bg-white">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-xs font-black text-[#0F172A]">
                  {query ? 'Search Results' : 'Top Results'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (flatResultItems[0]) handleSelectResult(flatResultItems[0]);
                  }}
                  className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View all results</span>
                  <span>→</span>
                </button>
              </div>

              {/* Loading State */}
              {isLoading ? (
                <div className="space-y-3 py-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="h-16 rounded-2xl bg-slate-100 animate-pulse flex items-center px-4"
                    />
                  ))}
                </div>
              ) : results.length === 0 ? (
                /* Empty Results State */
                <div className="py-14 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-purple-50 text-[#6356E5] flex items-center justify-center border border-purple-100 shadow-xs">
                    <Search className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-[#0F172A]">No matching results found</h4>
                    <p className="text-xs text-slate-400 font-medium max-w-sm">
                      We couldn't find anything matching "{query}". Try checking your spelling or search by ID, Email, Phone, or Name.
                    </p>
                  </div>
                </div>
              ) : (
                /* Grouped Results Display */
                <div className="space-y-5">
                  {Object.entries(groupedResults).map(([catKey, items]) => (
                    <div key={catKey} className="space-y-2">
                      <div className="flex items-center gap-2 px-1">
                        {getCategoryIcon(catKey)}
                        <span className="text-xs font-black text-slate-700">
                          {getCategoryTitle(catKey, items.length)}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {items.map((item) => {
                          const itemGlobalIndex = flatResultItems.findIndex((r) => r.id === item.id);
                          const isHighlighted = itemGlobalIndex === selectedIndex;

                          return (
                            <div
                              key={item.id}
                              onClick={() => handleSelectResult(item)}
                              onMouseEnter={() => setSelectedIndex(itemGlobalIndex)}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                isHighlighted
                                  ? 'bg-[#EEF2FF] border-purple-300 shadow-2xs'
                                  : 'bg-white hover:bg-slate-50 border-slate-100'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {item.avatar ? (
                                  <img
                                    src={item.avatar}
                                    alt={item.title}
                                    className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shrink-0"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                                    {getCategoryIcon(item.category)}
                                  </div>
                                )}

                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-xs font-black text-[#0F172A] truncate">
                                      {item.title}
                                    </h4>
                                    {getStatusBadge(item.status, item.statusColor)}
                                  </div>

                                  <p className="text-[11px] text-slate-400 font-semibold truncate">
                                    {item.subtitle}
                                  </p>

                                  {item.amount && (
                                    <span className="text-[10px] font-black text-[#6356E5] font-mono block">
                                      {item.amount}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectResult(item);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
                                  isHighlighted
                                    ? 'bg-[#6356E5] text-white shadow-xs'
                                    : 'bg-slate-100 hover:bg-[#6356E5] hover:text-white text-slate-700'
                                }`}
                              >
                                {item.actionLabel}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── 4. STICKY FOOTER WITH SHORTCUTS & PRO TIP ── */}
          <div className="p-3 sm:px-5 border-t border-slate-100 bg-slate-50/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0 text-xs select-none">
            {/* Pro Tip */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <div className="w-5 h-5 rounded-lg bg-purple-100 text-[#6356E5] flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3" />
              </div>
              <span className="truncate">
                <strong className="text-slate-700 font-bold">Pro Tip:</strong> Search by Booking ID, Agency Name, Email, GST, Package Name, or Payment ID.
              </span>
            </div>

            {/* Keyboard Guide */}
            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold shrink-0">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-mono shadow-2xs">
                  ↑
                </kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-mono shadow-2xs">
                  ↓
                </kbd>
                <span>Navigate</span>
              </div>

              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-mono shadow-2xs">
                  ↵
                </kbd>
                <span>Open</span>
              </div>

              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-mono shadow-2xs">
                  Esc
                </kbd>
                <span>Close</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
