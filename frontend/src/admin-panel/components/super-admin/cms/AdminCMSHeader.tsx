import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutTemplate,
  Plus,
  Megaphone,
  Sparkles,
  ExternalLink,
  MessageSquarePlus,
  Search,
  Package,
  Building2,
  MapPin,
  Tag,
  X,
  Loader2,
} from 'lucide-react';
import { adminCMSManagementService } from '../../../services/adminCMSManagement.service';
import { SearchDatabaseResult } from '../../../types/cmsManagement';

interface AdminCMSHeaderProps {
  onNewBanner: () => void;
  onNewCampaign: () => void;
  onNewAnnouncement: () => void;
  onNewPopup: () => void;
  onOpenStorefront: () => void;
  onSelectSearchResult?: (type: string, item: any) => void;
}

export const AdminCMSHeader: React.FC<AdminCMSHeaderProps> = ({
  onNewBanner,
  onNewCampaign,
  onNewAnnouncement,
  onNewPopup,
  onOpenStorefront,
  onSelectSearchResult,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchDatabaseResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults(null);
      setIsDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await adminCMSManagementService.searchDatabase(searchQuery.trim());
        setSearchResults(res);
        setIsDropdownOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalResults =
    (searchResults?.packages?.length || 0) +
    (searchResults?.agencies?.length || 0) +
    (searchResults?.destinations?.length || 0) +
    (searchResults?.coupons?.length || 0);

  return (
    <div className="flex flex-col gap-4 bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs select-none">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Description */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center border border-purple-100 shadow-2xs shrink-0">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              Content & Campaign Management
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Backend-driven CMS connected to MongoDB. All edits immediately update the live User Panel.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenStorefront}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>View Live Site</span>
          </button>

          <button
            type="button"
            onClick={onNewAnnouncement}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black transition-all cursor-pointer shadow-2xs"
          >
            <Megaphone className="w-3.5 h-3.5 text-amber-600" />
            <span>+ Announcement</span>
          </button>

          <button
            type="button"
            onClick={onNewPopup}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#6356E5] border border-purple-200 text-xs font-black transition-all cursor-pointer shadow-2xs"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-[#6356E5]" />
            <span>+ Popup</span>
          </button>

          <button
            type="button"
            onClick={onNewCampaign}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>+ Campaign</span>
          </button>

          <button
            type="button"
            onClick={onNewBanner}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ New Banner</span>
          </button>
        </div>
      </div>

      {/* Database Global Search Autocomplete Bar */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search MongoDB: packages, agencies, destinations, or coupons to feature..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6356E5]/30 focus:border-[#6356E5]"
          />
          {isSearching ? (
            <Loader2 className="absolute right-3.5 w-4 h-4 text-[#6356E5] animate-spin" />
          ) : searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults(null);
                setIsDropdownOpen(false);
              }}
              className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>

        {/* Dropdown Results */}
        {isDropdownOpen && searchResults && (
          <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden max-h-96 overflow-y-auto">
            {totalResults === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 font-semibold">
                No matching packages, agencies, or destinations found in MongoDB.
              </div>
            ) : (
              <div className="p-3 space-y-3">
                {/* Packages */}
                {searchResults.packages.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                      <Package className="w-3.5 h-3.5 text-blue-500" />
                      <span>Tour Packages</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {searchResults.packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => {
                            onSelectSearchResult?.('package', pkg);
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                        >
                          <img
                            src={pkg.imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100'}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-800 truncate">{pkg.title}</p>
                            <p className="text-[10px] text-slate-400">{pkg.destination} • ₹{pkg.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agencies */}
                {searchResults.agencies.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                      <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Agencies</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {searchResults.agencies.map((ag) => (
                        <div
                          key={ag.id}
                          onClick={() => {
                            onSelectSearchResult?.('agency', ag);
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                        >
                          <img
                            src={ag.logo || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100'}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover border border-slate-100"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-800 truncate">{ag.name}</p>
                            <p className="text-[10px] text-slate-400">★ {ag.rating} • {ag.isVerified ? 'Verified' : 'Partner'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Destinations */}
                {searchResults.destinations.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>Destinations</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 px-2">
                      {searchResults.destinations.map((dest) => (
                        <button
                          key={dest.name}
                          type="button"
                          onClick={() => {
                            onSelectSearchResult?.('destination', dest);
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          <MapPin className="w-3 h-3 text-amber-600" />
                          <span>{dest.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coupons */}
                {searchResults.coupons.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                      <Tag className="w-3.5 h-3.5 text-purple-500" />
                      <span>Coupons</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 px-2">
                      {searchResults.coupons.map((cp) => (
                        <button
                          key={cp.id}
                          type="button"
                          onClick={() => {
                            onSelectSearchResult?.('coupon', cp);
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6356E5] border border-purple-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          <Tag className="w-3 h-3 text-[#6356E5]" />
                          <span>{cp.code} ({cp.discountText})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
