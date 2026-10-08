import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Pin,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Plus,
  Trash2,
  ShieldCheck,
  TrendingUp,
  Star,
  RefreshCw,
  Search,
  CheckCircle,
  Eye,
  Sliders,
  X,
  AlertCircle,
} from 'lucide-react';
import { AdminDiscoveryOverride, AdminSectionConfig, OverrideBadgeOption } from '../../../../types/discovery';
import { adminDiscoveryService } from '../../../../services/adminDiscovery.service';
import { CMSSelectionModal } from '../modals/CMSSelectionModal';
import { CMSSelectItem } from '../../../../types/cmsManagement';

const OVERRIDE_BADGES: OverrideBadgeOption[] = [
  'Featured',
  'Trending',
  'Popular',
  'Most Popular',
  "Editor's Pick",
  'Hidden Gem',
  'Premium',
  'Festival Featured',
  'Homepage Hero',
  'Explore Hero',
  'Recommended',
  'Premium Partner',
  "Editor's Choice",
  'Normal',
];

const SECTIONS_FOR_PIN = [
  { id: 'all', label: 'All Matching Sections' },
  { id: 'trending', label: 'Trending This Week 🔥' },
  { id: 'popular', label: 'Popular Packages 🌟' },
  { id: 'recommended', label: 'Recommended For You ✨' },
  { id: 'weekend_escapes', label: 'Weekend Escapes 📅' },
  { id: 'adventure_trips', label: 'Adventure Trips 🧗' },
  { id: 'budget_trips', label: 'Budget Trips 👛' },
  { id: 'luxury_escapes', label: 'Luxury Escapes 💎' },
  { id: 'hidden_gems', label: 'Hidden Gems 🏝️' },
  { id: 'popular_agencies', label: 'Verified Partner Agencies 🏢' },
];

export const DiscoveryControlEditor: React.FC = () => {
  const [sections, setSections] = useState<AdminSectionConfig[]>([]);
  const [overrides, setOverrides] = useState<AdminDiscoveryOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [selectType, setSelectType] = useState<'packages' | 'agencies'>('packages');

  // Custom Pin Options Modal
  const [pendingSelection, setPendingSelection] = useState<CMSSelectItem | null>(null);
  const [targetSectionId, setTargetSectionId] = useState('trending');
  const [selectedBadge, setSelectedBadge] = useState<string>("Editor's Pick");
  const [selectedPriority, setSelectedPriority] = useState<number>(100);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [secData, ovData] = await Promise.all([
        adminDiscoveryService.getSections(),
        adminDiscoveryService.getOverrides(),
      ]);
      setSections(secData);
      setOverrides(ovData);
    } catch (err: any) {
      showToast(err.message || 'Failed to load discovery configurations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleSection = async (sectionId: string) => {
    try {
      const updated = await adminDiscoveryService.toggleSection(sectionId);
      setSections((prev) =>
        prev.map((s) => (s.sectionId === sectionId ? { ...s, isEnabled: updated.isEnabled } : s))
      );
      showToast(`Section ${sectionId} is now ${updated.isEnabled ? 'LIVE' : 'DISABLED'}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle section');
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all section configurations and rules to system defaults?')) return;
    try {
      const reset = await adminDiscoveryService.seedDefaultSections();
      setSections(reset);
      showToast('Default discovery sections restored!');
    } catch (err: any) {
      showToast(err.message || 'Failed to reset sections');
    }
  };

  const handleOpenPin = (type: 'packages' | 'agencies') => {
    setSelectType(type);
    setIsSelectModalOpen(true);
  };

  const handleItemSelect = (selectedItems: CMSSelectItem[]) => {
    if (!selectedItems || selectedItems.length === 0) return;
    setIsSelectModalOpen(false);
    setPendingSelection(selectedItems[0]);
    if (selectType === 'agencies') {
      setSelectedBadge('Featured Agency');
      setTargetSectionId('popular_agencies');
    } else {
      setSelectedBadge("Editor's Pick");
      setTargetSectionId('trending');
    }
  };

  const handleSavePinOverride = async () => {
    if (!pendingSelection) return;

    try {
      await adminDiscoveryService.createOrUpdateOverride({
        targetType: selectType === 'packages' ? 'PACKAGE' : 'AGENCY',
        targetId: pendingSelection.id || (pendingSelection as any)._id || '',
        sectionId: targetSectionId,
        overrideBadge: selectedBadge,
        priority: selectedPriority,
        isActive: true,
      });

      setPendingSelection(null);
      showToast(`Pinned "${pendingSelection.title || pendingSelection.name}" with priority ${selectedPriority}!`);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to pin override');
    }
  };

  const handleDeleteOverride = async (overrideId: string) => {
    try {
      await adminDiscoveryService.deleteOverride(overrideId);
      setOverrides((prev) => prev.filter((o) => o._id !== overrideId));
      showToast('Override removed. Item returned to automatic ranking engine.');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete override');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[2000] px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-slate-700/60 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CARD 1: OVERVIEW & PIN CONTROLS ── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-[#583BE8] uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Discovery Control Engine</span>
            </div>
            <h2 className="text-lg font-black text-[#0F172A]">Discovery & Ranking Override Controls</h2>
            <p className="text-xs text-slate-400 font-medium max-w-2xl mt-0.5">
              Items rank automatically by live metrics (Bookings, Reviews, CTR, Views). Admin overrides pin items to the top with custom badges and priority.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenPin('packages')}
              className="px-4 py-2 rounded-2xl bg-[#583BE8] hover:bg-[#472bd1] text-white text-xs font-black shadow-md shadow-[#583BE8]/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Pin className="w-3.5 h-3.5 rotate-45" />
              <span>Pin Package</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenPin('agencies')}
              className="px-4 py-2 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pin Agency</span>
            </button>
          </div>
        </div>

        {/* ACTIVE PIN OVERRIDES TABLE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
              Active Admin Pinned Overrides ({overrides.length})
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              Overridden items appear before automatic rankings
            </span>
          </div>

          {overrides.length === 0 ? (
            <div className="text-center py-10 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <Sparkles className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-500">No admin overrides active</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                All storefront and explore sections are currently running 100% on the automatic ranking engine.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-black uppercase text-[10px]">
                    <th className="py-3 px-4">Item Details</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Pinned Section</th>
                    <th className="py-3 px-4">Display Badge</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {overrides.map((ov) => {
                    const isPkg = ov.targetType === 'PACKAGE';
                    const title = ov.targetDetails?.title || ov.targetDetails?.name || ov.targetId;
                    const image = ov.targetDetails?.coverImage || ov.targetDetails?.logo;

                    return (
                      <tr key={ov._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {image && (
                              <img
                                src={image}
                                alt=""
                                className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
                              />
                            )}
                            <div>
                              <p className="font-extrabold text-[#0F172A] line-clamp-1">{title}</p>
                              <p className="text-[10px] text-slate-400 font-medium">ID: {ov.targetId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isPkg ? 'bg-purple-100 text-[#583BE8]' : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {ov.targetType}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-700">
                          {SECTIONS_FOR_PIN.find((s) => s.id === ov.sectionId)?.label || ov.sectionId}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 font-black text-[11px]">
                            {ov.overrideBadge}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-extrabold text-[11px]">
                            {ov.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live Override
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteOverride(ov._id)}
                            className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Remove Override (Return to ranking)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── CARD 2: SECTION VISIBILITY & SMART RULES ── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-[#0F172A]">Section Visibility & Smart Rules</h2>
            <p className="text-xs text-slate-400 font-medium max-w-2xl mt-0.5">
              Toggle sections ON/OFF dynamically. Sections only render when they meet the minimum package threshold.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* SECTIONS LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((sec) => (
            <div
              key={sec.sectionId}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                sec.isEnabled
                  ? 'bg-white border-slate-200 shadow-2xs hover:shadow-xs'
                  : 'bg-slate-50/70 border-slate-200/60 opacity-60'
              }`}
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{sec.emoji || '✨'}</span>
                  <h4 className="text-sm font-black text-[#0F172A] truncate">{sec.title}</h4>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    #{sec.order}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium line-clamp-1">
                  {sec.subtitle || `Section ID: ${sec.sectionId}`}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#583BE8] uppercase">
                    {sec.type}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Min items: <strong className="text-slate-600">{sec.minItems || 3}</strong>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Max: <strong className="text-slate-600">{sec.maxItems || 8}</strong>
                  </span>
                </div>
              </div>

              {/* TOGGLE SWITCH */}
              <button
                type="button"
                onClick={() => handleToggleSection(sec.sectionId)}
                className={`p-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                  sec.isEnabled
                    ? 'text-emerald-600 hover:bg-emerald-50'
                    : 'text-slate-400 hover:bg-slate-200'
                }`}
                title={sec.isEnabled ? 'Click to Disable' : 'Click to Enable'}
              >
                {sec.isEnabled ? (
                  <ToggleRight className="w-8 h-8 fill-emerald-600 text-white" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL 1: SELECT ITEM MODAL (USING CMSSelectionModal) ── */}
      <CMSSelectionModal
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        type={selectType}
        title={selectType === 'packages' ? 'Select Package to Pin' : 'Select Agency to Pin'}
        subtitle="Search and select an item to pin into the discovery engine"
        multiSelect={false}
        onConfirm={handleItemSelect}
      />

      {/* ── MODAL 2: CONFIGURE PIN OVERRIDE OPTIONS ── */}
      <AnimatePresence>
        {pendingSelection && (
          <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setPendingSelection(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Pin className="w-4 h-4 text-[#583BE8] rotate-45" />
                  <h3 className="text-base font-black text-[#0F172A]">Configure Pin Override</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPendingSelection(null)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Selected Item Preview */}
              <div className="flex items-center gap-3 p-3 bg-purple-50/60 rounded-2xl border border-purple-100">
                <img
                  src={
                    pendingSelection.coverImage ||
                    pendingSelection.logo ||
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200'
                  }
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-purple-200/60"
                />
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-[#0F172A] truncate">
                    {pendingSelection.title || pendingSelection.name}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {pendingSelection.destination || (pendingSelection as any).location || 'India'}
                  </p>
                </div>
              </div>

              {/* Form Controls */}
              <div className="space-y-4">
                {/* 1. Target Section */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700">Target Discovery Section</label>
                  <select
                    value={targetSectionId}
                    onChange={(e) => setTargetSectionId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#583BE8] bg-white"
                  >
                    {SECTIONS_FOR_PIN.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Override Badge */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700">Display Badge (Tag)</label>
                  <select
                    value={selectedBadge}
                    onChange={(e) => setSelectedBadge(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#583BE8] bg-white"
                  >
                    {OVERRIDE_BADGES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Priority */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700">
                    Priority Score (Higher appears first)
                  </label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#583BE8] bg-white"
                  >
                    <option value={100}>100 — Highest (Position #1)</option>
                    <option value={90}>90 — Very High</option>
                    <option value={80}>80 — High</option>
                    <option value={70}>70 — Standard Override</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPendingSelection(null)}
                  className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePinOverride}
                  className="px-5 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#472bd1] text-white text-xs font-black shadow-md cursor-pointer transition-all"
                >
                  Save & Pin Item
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
