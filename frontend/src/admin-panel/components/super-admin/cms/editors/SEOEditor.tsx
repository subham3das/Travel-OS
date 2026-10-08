import React, { useState, useEffect } from 'react';
import {
  Globe,
  Share2,
  CheckCircle2,
  Save,
  Search,
  Loader2,
} from 'lucide-react';
import { HomepageSEOData, CMSSEOPageKey } from '../../../../types/cmsManagement';
import { adminCMSManagementService } from '../../../../services/adminCMSManagement.service';
import { UniversalImageUploader } from '../../../../../components/common/UniversalImageUploader';

interface SEOEditorProps {
  seo: HomepageSEOData;
  onSaveSEO: (data: HomepageSEOData) => void;
}

const PAGE_KEYS: Array<{ key: CMSSEOPageKey; label: string; description: string }> = [
  { key: 'home', label: 'Home Page', description: 'Main storefront homepage' },
  { key: 'destination', label: 'Destinations', description: 'Destination explorer & listing pages' },
  { key: 'package', label: 'Tour Packages', description: 'Package listing & detail pages' },
  { key: 'agency', label: 'Agencies', description: 'Agency partner directory' },
  { key: 'car-rental', label: 'Car Rental', description: 'Route-based car rental booking page' },
  { key: 'about', label: 'About Us', description: 'Company & platform story page' },
  { key: 'privacy', label: 'Privacy Policy', description: 'Legal privacy policy page' },
  { key: 'terms', label: 'Terms of Service', description: 'Platform terms & conditions' },
  { key: 'contact', label: 'Contact', description: 'Support & inquiries page' },
];

export const SEOEditor: React.FC<SEOEditorProps> = ({ seo: initialSeo, onSaveSEO }) => {
  const [selectedPage, setSelectedPage] = useState<CMSSEOPageKey>('home');
  const [seoData, setSeoData] = useState<HomepageSEOData>(initialSeo);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    adminCMSManagementService
      .getSEO(selectedPage)
      .then((data) => {
        setSeoData(data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [selectedPage]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminCMSManagementService.saveSEO(selectedPage, seoData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      onSaveSEO(seoData);
    } catch (err: any) {
      alert(err.message || 'Failed to save SEO settings');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-5 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-black text-[#0F172A]">SEO & Social Meta Studio</h2>
          <p className="text-[11px] text-slate-400 font-semibold">
            Configure discrete search engine meta tags and OpenGraph cards for each section of ApnaTrip
          </p>
        </div>
      </div>

      {/* Page Key Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-50 border border-slate-100 rounded-2xl">
        {PAGE_KEYS.map((p) => {
          const isActive = selectedPage === p.key;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setSelectedPage(p.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-[#6356E5] shadow-xs border border-purple-100 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="py-12 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#6356E5] mx-auto" />
          <p className="text-xs text-slate-400 mt-2">Loading SEO tags for {selectedPage}...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Meta Title Tag</label>
              <span className="text-[10px] text-slate-400">{seoData.title?.length || 0}/60 chars</span>
            </div>
            <input
              type="text"
              value={seoData.title || ''}
              onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-xs font-semibold text-slate-800"
              required
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Meta Description</label>
              <span className="text-[10px] text-slate-400">{seoData.description?.length || 0}/160 chars</span>
            </div>
            <textarea
              rows={3}
              value={seoData.description || ''}
              onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-xs font-medium text-slate-800"
              required
            />
          </div>

          {/* Keywords & Canonical URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Keywords (Comma separated)</label>
              <input
                type="text"
                value={Array.isArray(seoData.keywords) ? seoData.keywords.join(', ') : seoData.keywords || ''}
                onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-xs"
                placeholder="e.g. travel india, tour packages, trek"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Canonical URL</label>
              <input
                type="url"
                value={seoData.canonicalUrl || ''}
                onChange={(e) => setSeoData({ ...seoData, canonicalUrl: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-xs"
                placeholder="https://apnatrip.com/..."
              />
            </div>
          </div>

          {/* OpenGraph Image (Cloudinary) Universal Uploader */}
          <UniversalImageUploader
            label="OpenGraph / Twitter Share Image (Cloudinary)"
            helpText="Displayed when link is shared on WhatsApp, Facebook, or Twitter"
            folder="travelos/seo"
            value={seoData.ogImage}
            onChange={(url: any) => setSeoData({ ...seoData, ogImage: url })}
            aspectRatio="wide"
          />

          {/* Save Button */}
          <div className="flex items-center justify-between pt-3 border-t">
            {isSaved ? (
              <span className="flex items-center gap-1.5 text-xs font-black text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>SEO tags saved and active in MongoDB</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">Edits update MongoDB immediately</span>
            )}

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black shadow-md cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save {PAGE_KEYS.find((p) => p.key === selectedPage)?.label} SEO</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
