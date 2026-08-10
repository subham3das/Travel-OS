import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Star, MapPin, Building2, User, ChevronRight, CheckCircle2 } from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || 'Meghalaya';
  const initialTab = searchParams.get('tab') || 'destinations';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [query, setQuery] = useState(initialQuery);
  const [followedTravelers, setFollowedTravelers] = useState<string[]>([]);

  const toggleFollowTraveler = (id: string) => {
    setFollowedTravelers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const tabs = [
    { id: 'destinations', label: 'Destinations' },
    { id: 'agencies', label: 'Agencies' },
    { id: 'packages', label: 'Packages' },
    { id: 'travelers', label: 'Travelers' },
  ];

  // Mock Result Data
  const sampleDestinations = [
    { id: 'dest-meghalaya', title: 'Meghalaya', subtitle: 'Land of Clouds & Living Root Bridges', rating: 4.9, count: '124 Trips', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop' },
    { id: 'dest-ladakh', title: 'Ladakh', subtitle: 'Land of High Passes & Blue Lakes', rating: 4.9, count: '310 Trips', image: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=600&auto=format&fit=crop' },
    { id: 'dest-goa', title: 'Goa Beaches', subtitle: 'Sun, Sand & Coastal Culture', rating: 4.7, count: '450 Trips', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop' },
  ];

  const sampleAgencies = [
    { id: 'himalayan-explorers', name: 'Himalayan Explorers', isVerified: true, rating: 4.9, location: 'Manali, HP', price: '₹8,999', image: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=400&auto=format&fit=crop' },
    { id: 'wanderwave', name: 'WanderWave', isVerified: true, rating: 4.8, location: 'Goa', price: '₹6,499', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=400&auto=format&fit=crop' },
  ];

  const samplePackages = [
    { id: 'pkg-meghalaya-7d', title: '7-Day Meghalaya Backpacking Odyssey', agency: 'Himalayan Explorers', price: '₹12,499', rating: 4.9, image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop' },
    { id: 'pkg-spiti-10d', title: 'Spiti Valley Circuit Expedition', agency: 'Wander India', price: '₹18,500', rating: 4.8, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop' },
  ];

  const sampleTravelers = [
    { id: 'trv-subham', name: 'Subham Das', username: '@subham_travels', bio: 'Explorer of Northeast India & Himalayan peaks', trips: 18, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' },
    { id: 'trv-ananya', name: 'Ananya Sharma', username: '@ananya_wild', bio: 'Solo traveler & wildlife photographer', trips: 24, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#FF4D6D]/20 selection:text-[#FF4D6D]">
      {/* Search Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/search')}
          className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all focus:outline-none cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-[#0F172A] focus:outline-none focus:bg-white"
          />
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-8">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-none max-w-4xl mx-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all whitespace-nowrap focus:outline-none cursor-pointer ${
                  isActive
                    ? 'border-[#FF4D6D] text-[#FF4D6D]'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* DESTINATIONS TAB */}
        {activeTab === 'destinations' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sampleDestinations.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -3 }}
                onClick={() => navigate(`/destination/${item.id}`)}
                className="bg-white rounded-3xl p-3.5 border border-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer flex gap-4"
              >
                <img src={item.image} alt={item.title} className="w-24 h-24 rounded-2xl object-cover shrink-0" />
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h4 className="text-base font-extrabold text-[#0F172A]">{item.title}</h4>
                    <p className="text-xs font-medium text-slate-500 line-clamp-2">{item.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.rating}</span>
                    <span className="text-slate-300">•</span>
                    <span>{item.count}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* AGENCIES TAB */}
        {activeTab === 'agencies' && (
          <div className="space-y-3">
            {sampleAgencies.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -2 }}
                onClick={() => navigate(`/agency/${item.id}`)}
                className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-2xl object-cover" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-base font-extrabold text-[#0F172A]">{item.name}</h4>
                      {item.isVerified && <CheckCircle2 className="w-4 h-4 text-[#6356E5]" />}
                    </div>
                    <p className="text-xs font-medium text-slate-400">{item.location} • ★ {item.rating}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#6356E5]">View Agency →</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* PACKAGES TAB */}
        {activeTab === 'packages' && (
          <div className="space-y-3">
            {samplePackages.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -2 }}
                onClick={() => navigate(`/package/${item.id}`)}
                className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.title} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                  <div>
                    <h4 className="text-base font-extrabold text-[#0F172A]">{item.title}</h4>
                    <p className="text-xs font-medium text-slate-400">By {item.agency} • ★ {item.rating}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-base font-black text-[#FF4D6D]">{item.price}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/booking/checkout/${item.id}`);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#FF4D6D] text-white text-xs font-bold hover:bg-[#e03e5c] transition-all cursor-pointer"
                  >
                    Book
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* TRAVELERS TAB */}
        {activeTab === 'travelers' && (
          <div className="space-y-3">
            {sampleTravelers.map((item) => {
              const isFollowing = followedTravelers.includes(item.id);
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -2 }}
                  onClick={() => navigate(`/traveler/${item.id}`)}
                  className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img src={item.avatar} alt={item.name} className="w-14 h-14 rounded-full object-cover" />
                    <div>
                      <h4 className="text-base font-extrabold text-[#0F172A]">{item.name}</h4>
                      <p className="text-xs font-medium text-slate-400">{item.username} • {item.trips} Trips</p>
                      <p className="text-xs font-semibold text-slate-600 line-clamp-1">{item.bio}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollowTraveler(item.id);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isFollowing
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-rose-50 text-[#FF4D6D] hover:bg-[#FF4D6D] hover:text-white'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResultsPage;
