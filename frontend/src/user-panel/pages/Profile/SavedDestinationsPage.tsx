import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, ArrowRight, Trash2 } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { LazyImage } from '../../components/common/LazyImage';
import { wishlistService, SavedPackageItem, SavedDestinationItem } from '../../services/wishlist.service';

export const SavedDestinationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'destinations' | 'packages'>('packages');

  const [savedDestinations, setSavedDestinations] = useState<SavedDestinationItem[]>(() =>
    wishlistService.getSavedDestinations()
  );
  const [savedPackages, setSavedPackages] = useState<SavedPackageItem[]>(() =>
    wishlistService.getSavedPackages()
  );

  useEffect(() => {
    const handleSync = () => {
      setSavedDestinations(wishlistService.getSavedDestinations());
      setSavedPackages(wishlistService.getSavedPackages());
    };

    window.addEventListener('apnatrip_wishlist_updated', handleSync);
    return () => window.removeEventListener('apnatrip_wishlist_updated', handleSync);
  }, []);

  const handleRemovePackage = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    wishlistService.removePackage(id);
    setSavedPackages(wishlistService.getSavedPackages());
  };

  const handleRemoveDestination = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    wishlistService.removeDestination(id);
    setSavedDestinations(wishlistService.getSavedDestinations());
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 cursor-pointer">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h2 className="text-sm font-extrabold">Saved & Wishlist</h2>
        <div className="w-8" />
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'packages' ? 'bg-[#6356E5] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Saved Packages
          </button>
          <button
            onClick={() => setActiveTab('destinations')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'destinations' ? 'bg-[#6356E5] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Saved Destinations
          </button>
        </div>

        {activeTab === 'packages' ? (
          savedPackages.length > 0 ? (
            <div className="space-y-3">
              {savedPackages.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/package/${item.id}`)}
                  className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.title} className="w-20 h-20 rounded-2xl object-cover shrink-0 group-hover:scale-105 transition-transform" />
                    <div className="space-y-1">
                      <h4 className="text-sm sm:text-base font-extrabold text-[#0F172A] group-hover:text-[#6356E5] transition-colors">{item.title}</h4>
                      <p className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                        <span>By {item.agency}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#6356E5]" /> {item.duration}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    <span className="text-base font-black text-[#0F172A]">{item.price}</span>
                    <button
                      type="button"
                      onClick={(e) => handleRemovePackage(e, item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-[#6356E5] text-white text-xs font-bold flex items-center gap-1 shadow-xs">
                      <span>View Package</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Saved Packages"
              description="You haven't saved any tour packages yet. Browse our marketplace to find your next adventure."
              actionLabel="Explore Packages"
              onAction={() => navigate('/explore')}
            />
          )
        ) : (
          savedDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedDestinations.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/destination/${item.id}`)}
                  className="bg-white rounded-3xl p-3.5 border border-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer flex justify-between gap-4 group"
                >
                  <div className="flex gap-4">
                    <img src={item.image} alt={item.title} className="w-24 h-24 rounded-2xl object-cover shrink-0" />
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-base font-extrabold text-[#0F172A] group-hover:text-[#6356E5] transition-colors">{item.title}</h4>
                        <p className="text-xs font-medium text-slate-500">{item.subtitle}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" /> {item.rating || 4.8}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleRemoveDestination(e, item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors self-start cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Saved Destinations"
              description="You haven't added any destinations to your wishlist yet."
              actionLabel="Explore Destinations"
              onAction={() => navigate('/explore')}
            />
          )
        )}
      </main>
    </div>
  );
};

export default SavedDestinationsPage;
