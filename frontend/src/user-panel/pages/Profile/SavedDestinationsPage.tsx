import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, ArrowRight } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { LazyImage } from '../../components/common/LazyImage';

export const SavedDestinationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'destinations' | 'packages'>('packages');

  const savedDestinations = [
    { id: 'meghalaya', title: 'Meghalaya', subtitle: 'Land of Clouds & Waterfalls', rating: 4.9, image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop' },
    { id: 'ladakh', title: 'Ladakh', subtitle: 'Land of High Passes', rating: 4.9, image: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=600&auto=format&fit=crop' },
  ];

  const savedPackages = [
    { id: 'package-001', title: 'Meghalaya Adventure & Living Root Trail', duration: '5 Days / 4 Nights', price: '₹9,999', rating: 4.8, agency: 'Mountain Trails', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop' },
    { id: 'package-002', title: '7-Day Spiti Valley Motorbike Circuit', duration: '7 Days / 6 Nights', price: '₹16,999', rating: 4.9, agency: 'Mountain Trails', image: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=600&auto=format&fit=crop' },
  ];

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
                  <button className="px-4 py-2 rounded-xl bg-[#6356E5] text-white text-xs font-bold flex items-center gap-1 shadow-xs">
                    <span>View Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedDestinations.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/destination/${item.id}`)}
                className="bg-white rounded-3xl p-3.5 border border-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer flex gap-4"
              >
                <img src={item.image} alt={item.title} className="w-24 h-24 rounded-2xl object-cover shrink-0" />
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h4 className="text-base font-extrabold text-[#0F172A]">{item.title}</h4>
                    <p className="text-xs font-medium text-slate-500">{item.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" /> {item.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedDestinationsPage;
