import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Check,
  Star,
  Calendar,
  Building2,
  MapPin,
  Compass,
  Car,
  Tag,
  ArrowUpDown,
  RotateCw,
  PlusCircle,
  ExternalLink,
  SlidersHorizontal,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  CMSSelectionType,
  CMSSelectItem,
} from '../../../../types/cmsManagement';
import { adminCMSManagementService } from '../../../../services/adminCMSManagement.service';

export interface CMSSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: CMSSelectionType;
  title?: string;
  subtitle?: string;
  multiSelect?: boolean;
  alreadyFeaturedIds?: string[];
  onConfirm: (
    selectedItems: CMSSelectItem[],
    options?: { priority?: number; customBadge?: string }
  ) => Promise<void> | void;
  actionButtonText?: string;
  createButtonText?: string;
  createButtonRoute?: string;
  defaultBadgeText?: string;
}

const TYPE_CONFIG: Record<
  CMSSelectionType,
  {
    singular: string;
    plural: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
    createRoute: string;
    createText: string;
    defaultBadge: string;
    filterChips: Array<{ id: string; label: string }>;
  }
> = {
  packages: {
    singular: 'Package',
    plural: 'Packages',
    icon: Compass,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    createRoute: '/admin/packages',
    createText: 'Create Package',
    defaultBadge: 'Featured Deal',
    filterChips: [
      { id: 'all', label: 'All Packages' },
      { id: 'published', label: 'Published' },
      { id: 'draft', label: 'Draft' },
    ],
  },
  agencies: {
    singular: 'Agency',
    plural: 'Agencies',
    icon: Building2,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    createRoute: '/admin/agencies',
    createText: 'Register Agency',
    defaultBadge: 'Top Rated Partner',
    filterChips: [
      { id: 'all', label: 'All Agencies' },
      { id: 'verified', label: 'Verified Only' },
      { id: 'pending', label: 'Pending' },
    ],
  },
  destinations: {
    singular: 'Destination',
    plural: 'Destinations',
    icon: MapPin,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    createRoute: '/admin/packages',
    createText: 'Add Destination Package',
    defaultBadge: 'Trending Now',
    filterChips: [
      { id: 'all', label: 'All Locations' },
      { id: 'most_booked', label: 'Most Popular' },
    ],
  },
  trips: {
    singular: 'Trip',
    plural: 'Trips',
    icon: Compass,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    createRoute: '/admin/trips',
    createText: 'Schedule Trip',
    defaultBadge: 'Guaranteed Departure',
    filterChips: [
      { id: 'all', label: 'All Departures' },
      { id: 'upcoming', label: 'Upcoming' },
      { id: 'ongoing', label: 'Ongoing' },
    ],
  },
  vehicles: {
    singular: 'Vehicle',
    plural: 'Vehicles',
    icon: Car,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    createRoute: '/admin/car-rental-approvals',
    createText: 'Register Vehicle',
    defaultBadge: 'Premier Fleet',
    filterChips: [
      { id: 'all', label: 'All Vehicles' },
      { id: 'available', label: 'Available' },
    ],
  },
};

export const CMSSelectionModal: React.FC<CMSSelectionModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  subtitle,
  multiSelect = true,
  alreadyFeaturedIds = [],
  onConfirm,
  actionButtonText,
  createButtonText,
  createButtonRoute,
  defaultBadgeText,
}) => {
  const navigate = useNavigate();
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.packages;
  const TypeIcon = config.icon;

  // ── States ──
  const [items, setItems] = useState<CMSSelectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination & infinite scroll
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Selection
  const [selectedMap, setSelectedMap] = useState<Map<string, CMSSelectItem>>(new Map());

  // Configuration (Priority & Badge for featuring)
  const [priority, setPriority] = useState(1);
  const [customBadge, setCustomBadge] = useState(defaultBadgeText || config.defaultBadge);

  // Fetch initial data when modal opens
  const loadData = useCallback(
    async (targetPage = 1, append = false) => {
      if (targetPage === 1) {
        setIsLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const res = await adminCMSManagementService.selectItems(type, {
          page: targetPage,
          limit: 20,
          status: activeFilter !== 'all' ? activeFilter : undefined,
          sortBy,
        });

        if (append) {
          setItems((prev) => {
            const existingIds = new Set(prev.map((i) => i.id));
            const newOnes = res.items.filter((i) => !existingIds.has(i.id));
            return [...prev, ...newOnes];
          });
        } else {
          setItems(res.items || []);
        }

        setPage(targetPage);
        setHasMore(!!res.pagination?.hasMore);
      } catch (err: any) {
        setError(err.message || `Failed to fetch available ${config.plural.toLowerCase()}`);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [type, activeFilter, sortBy, config.plural]
  );

  // Load when modal opens or filter/sort changes
  useEffect(() => {
    if (isOpen) {
      loadData(1, false);
      setSelectedMap(new Map());
    } else {
      setSearchQuery('');
    }
  }, [isOpen, loadData]);

  // Client-side search on loaded items (Instant, zero lag, no keystroke API calls)
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      const matchName = (item.name || item.title || '').toLowerCase().includes(q);
      const matchAgency = (item.agencyName || '').toLowerCase().includes(q);
      const matchDest = (item.destination || item.city || '').toLowerCase().includes(q);
      const matchCategory = (item.category || '').toLowerCase().includes(q);
      const matchCode = (item.packageId || item.agencyId || item.tripId || '').toLowerCase().includes(q);
      return matchName || matchAgency || matchDest || matchCategory || matchCode;
    });
  }, [items, searchQuery]);

  // Check if item is already featured
  const isAlreadyFeatured = useCallback(
    (item: CMSSelectItem) => {
      if (item.isFeatured) return true;
      if (alreadyFeaturedIds.includes(item.id)) return true;
      if (item.packageId && alreadyFeaturedIds.includes(item.packageId)) return true;
      if (item.agencyId && alreadyFeaturedIds.includes(item.agencyId)) return true;
      return false;
    },
    [alreadyFeaturedIds]
  );

  // Toggle selection
  const handleToggleItem = (item: CMSSelectItem) => {
    // If already featured, prevent duplicate selection
    if (isAlreadyFeatured(item)) return;

    setSelectedMap((prev) => {
      const next = new Map(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        if (!multiSelect) {
          next.clear();
        }
        next.set(item.id, item);
      }
      return next;
    });
  };

  // Toggle all available
  const handleSelectAll = () => {
    if (selectedMap.size > 0) {
      setSelectedMap(new Map());
    } else {
      const next = new Map<string, CMSSelectItem>();
      filteredItems.forEach((i) => {
        if (!isAlreadyFeatured(i)) {
          next.set(i.id, i);
        }
      });
      setSelectedMap(next);
    }
  };

  // Handle confirm
  const handleConfirm = async () => {
    const selectedList = Array.from(selectedMap.values());
    if (selectedList.length === 0) return;

    setIsSubmitting(true);
    try {
      await onConfirm(selectedList, {
        priority: Number(priority) || 1,
        customBadge: customBadge.trim() || config.defaultBadge,
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedCount = selectedMap.size;
  const isAllSelected =
    filteredItems.filter((i) => !isAlreadyFeatured(i)).length > 0 &&
    filteredItems.filter((i) => !isAlreadyFeatured(i)).every((i) => selectedMap.has(i.id));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 z-10 flex flex-col max-h-[92vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0 bg-white">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-2xl ${config.bgColor} ${config.color} flex items-center justify-center border ${config.borderColor} shrink-0`}
              >
                <TypeIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900 truncate">
                    {title || `Feature ${config.singular}`}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black shrink-0">
                    MongoDB Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold truncate">
                  {subtitle || `Browse and select available ${config.plural.toLowerCase()} from database`}
                </p>
              </div>
            </div>

            {/* Right Header Counters & Close */}
            <div className="flex items-center gap-3 shrink-0">
              {multiSelect && selectedCount > 0 && (
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                    Selected
                  </span>
                  <span className="text-xs font-black text-indigo-600">
                    {selectedCount} {selectedCount === 1 ? config.singular : config.plural}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search, Sort & Filters Bar */}
          <div className="p-3 sm:px-5 sm:py-3.5 bg-slate-50/70 border-b border-slate-100 space-y-2.5 shrink-0">
            <div className="flex items-center gap-2">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${config.plural.toLowerCase()} by name, destination, code...`}
                  className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sorting Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 shadow-2xs cursor-pointer appearance-none pr-7"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="recently_updated">Recently Updated</option>
                  <option value="most_booked">Most Popular</option>
                  <option value="highest_rated">Highest Rated</option>
                  <option value="alphabetical">Alphabetical (A-Z)</option>
                </select>
                <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>

              {/* Reload Button */}
              <button
                type="button"
                onClick={() => loadData(1, false)}
                title="Refresh database records"
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors shadow-2xs cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
              </button>
            </div>

            {/* Quick Filter Chips & Multi-Select All Checkbox */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-0.5">
              <div className="flex items-center gap-1.5 shrink-0">
                {config.filterChips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setActiveFilter(chip.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      activeFilter === chip.id
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white border border-slate-200/80 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {multiSelect && filteredItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[11px] font-black text-indigo-600 hover:text-indigo-800 shrink-0 cursor-pointer ml-auto"
                >
                  {isAllSelected ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>
          </div>

          {/* Items List Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5 min-h-[260px]">
            {/* Loading Skeleton */}
            {isLoading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center gap-3.5 animate-pulse"
                  >
                    <div className="w-5 h-5 rounded-md bg-slate-200 shrink-0" />
                    <div className="w-14 h-14 rounded-xl bg-slate-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-slate-200 rounded-md w-3/4" />
                      <div className="h-2.5 bg-slate-200 rounded-md w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              /* Error State */
              <div className="py-12 px-4 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">Failed to Load Records</h4>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => loadData(1, false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-2xs hover:bg-slate-800 cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : items.length === 0 ? (
              /* MongoDB Empty Database State */
              <div className="py-12 px-4 text-center border-2 border-dashed border-slate-200 rounded-3xl space-y-3 my-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <TypeIcon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-800">
                    No {config.plural.toLowerCase()} available in MongoDB
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Create a {config.singular.toLowerCase()} first before featuring it on the platform.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(createButtonRoute || config.createRoute);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black shadow-sm hover:bg-indigo-700 cursor-pointer transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{createButtonText || config.createText}</span>
                </button>
              </div>
            ) : filteredItems.length === 0 ? (
              /* Search Filter Empty */
              <div className="py-10 text-center space-y-2">
                <Search className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">
                  No {config.plural.toLowerCase()} matching "{searchQuery}"
                </p>
                <p className="text-[11px] text-slate-400">
                  Try adjusting your search terms or clearing the filter chips.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-black text-indigo-600 hover:underline cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              /* Selection Cards List */
              <div className="space-y-2">
                {filteredItems.map((item) => {
                  const isSelected = selectedMap.has(item.id);
                  const alreadyFeatured = isAlreadyFeatured(item);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleItem(item)}
                      className={`group p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        alreadyFeatured
                          ? 'border-slate-200/60 bg-slate-50/70 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 shadow-xs cursor-pointer'
                          : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50/60 bg-white cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Checkbox / Radio */}
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                            alreadyFeatured
                              ? 'border-slate-300 bg-slate-200 text-slate-400'
                              : isSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white shadow-2xs'
                              : 'border-slate-300 bg-white group-hover:border-indigo-400'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          {alreadyFeatured && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>

                        {/* Thumbnail */}
                        <img
                          src={
                            item.coverImage ||
                            item.logo ||
                            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=120'
                          }
                          alt=""
                          className="w-13 h-13 rounded-xl object-cover border border-slate-200/80 shrink-0 bg-slate-100"
                        />

                        {/* Details */}
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-black text-slate-900 truncate">
                              {item.name || item.title}
                            </h4>
                            {alreadyFeatured && (
                              <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[9px] font-black shrink-0">
                                Featured
                              </span>
                            )}
                            {item.status && (
                              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-bold shrink-0">
                                {item.status}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold flex-wrap">
                            {item.agencyName && <span>{item.agencyName}</span>}
                            {item.agencyName && (item.destination || item.city) && <span>•</span>}
                            {(item.destination || item.city) && (
                              <span className="flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5 text-slate-400" />
                                {item.destination || item.city}
                              </span>
                            )}
                            {item.price ? (
                              <>
                                <span>•</span>
                                <span className="font-bold text-slate-700">₹{item.price.toLocaleString()}</span>
                              </>
                            ) : null}
                            {item.packageCount ? (
                              <>
                                <span>•</span>
                                <span className="text-indigo-600 font-bold">{item.packageCount} Packages</span>
                              </>
                            ) : null}
                          </div>

                          {/* Extra info: Rating & Last updated */}
                          <div className="flex items-center gap-3 text-[9px] text-slate-400 pt-0.5">
                            {item.rating && (
                              <span className="flex items-center gap-1 text-amber-600 font-bold">
                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                {item.rating}
                              </span>
                            )}
                            {item.updatedAt && (
                              <span className="flex items-center gap-1 text-slate-400">
                                <Calendar className="w-2.5 h-2.5" />
                                Updated {new Date(item.updatedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right indicator */}
                      <div className="shrink-0 text-right">
                        {alreadyFeatured ? (
                          <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                            Already Added
                          </span>
                        ) : isSelected ? (
                          <span className="text-[10px] font-black text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs">
                            Selected
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}

                {/* Infinite Scroll / Load More */}
                {hasMore && (
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => loadData(page + 1, true)}
                      disabled={isLoadingMore}
                      className="px-4 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                    >
                      {isLoadingMore ? 'Loading More...' : 'Load 20 More'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Configuration & Bulk Feature Bar */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 shrink-0 space-y-3">
            {/* Quick config options when items are selected */}
            {selectedCount > 0 && (
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                    Featured Badge Text
                  </label>
                  <div className="relative">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={customBadge}
                      onChange={(e) => setCustomBadge(e.target.value)}
                      placeholder="e.g. Featured Deal or Top Partner"
                      className="w-full pl-8 pr-3 py-1.5 border rounded-xl font-bold text-xs bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                    Display Priority Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border rounded-xl font-bold text-xs bg-slate-50/50"
                  />
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500 font-bold">
                {selectedCount > 0 ? (
                  <span className="text-indigo-600 font-black">
                    {selectedCount} {selectedCount === 1 ? config.singular : config.plural} selected
                  </span>
                ) : (
                  <span>Select items above to feature</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={selectedCount === 0 || isSubmitting}
                  onClick={handleConfirm}
                  className={`px-5 py-2 rounded-xl text-white font-black text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    type === 'agencies'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : type === 'destinations'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {isSubmitting
                      ? 'Featuring...'
                      : actionButtonText
                      ? actionButtonText
                      : selectedCount > 0
                      ? `Feature Selected (${selectedCount})`
                      : `Feature ${config.singular}`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
