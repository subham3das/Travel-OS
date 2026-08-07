import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, X, TrendingUp, Clock, Compass, MapPin, Building2, User } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Manali Trekking',
    'Meghalaya Waterfalls',
    'Goa Beach Resort',
    'Spiti Valley',
  ]);

  const popularSearches = [
    { title: 'Kashmir Paradise Tour', category: 'Packages', count: '1.2k searches' },
    { title: 'Himalayan Explorers', category: 'Agencies', count: '850 searches' },
    { title: 'Ladakh Motorbike Expedition', category: 'Packages', count: '2.4k searches' },
    { title: 'Kerala Houseboats', category: 'Destinations', count: '1.9k searches' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/results?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleRecentClick = (term: string) => {
    navigate(`/search/results?q=${encodeURIComponent(term)}`);
  };

  const clearRecent = (term: string) => {
    setRecentSearches((prev) => prev.filter((item) => item !== term));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#FF4D6D]/20 selection:text-[#FF4D6D]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all focus:outline-none cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations, agencies, packages, travelers..."
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-10 py-3 text-xs sm:text-sm font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#FF4D6D]/40 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Recent Searches</span>
              </h3>
              <button
                onClick={() => setRecentSearches([])}
                className="text-xs font-semibold text-slate-400 hover:text-[#FF4D6D]"
              >
                Clear all
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {recentSearches.map((item) => (
                <div
                  key={item}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-slate-100 text-xs font-bold text-slate-700 shadow-2xs hover:border-slate-200 cursor-pointer"
                >
                  <span onClick={() => handleRecentClick(item)}>{item}</span>
                  <X
                    className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearRecent(item);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Searches */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#FF4D6D]" />
            <span>Popular Searches</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {popularSearches.map((pop, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/search/results?q=${encodeURIComponent(pop.title)}`)}
                className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-2xs flex items-center justify-between gap-3 cursor-pointer hover:border-[#FF4D6D]/30 transition-all"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">{pop.title}</h4>
                  <p className="text-[11px] font-medium text-slate-400">{pop.category} • {pop.count}</p>
                </div>
                <span className="text-xs font-bold text-[#FF4D6D] px-2.5 py-1 rounded-full bg-rose-50">
                  Explore
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Categories */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-[#0F172A]">Search By Category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => navigate('/search/results?tab=destinations')}
              className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs flex flex-col items-center gap-2 text-center hover:border-slate-200 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-rose-50 text-[#FF4D6D] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#0F172A]">Destinations</span>
            </button>
            <button
              onClick={() => navigate('/agencies')}
              className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs flex flex-col items-center gap-2 text-center hover:border-slate-200 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#0F172A]">Agencies</span>
            </button>
            <button
              onClick={() => navigate('/search/results?tab=packages')}
              className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs flex flex-col items-center gap-2 text-center hover:border-slate-200 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#0F172A]">Packages</span>
            </button>
            <button
              onClick={() => navigate('/search/results?tab=travelers')}
              className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs flex flex-col items-center gap-2 text-center hover:border-slate-200 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#0F172A]">Travelers</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
