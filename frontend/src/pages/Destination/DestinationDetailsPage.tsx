import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, MapPin, Star, Calendar, Sun, Hotel, Utensils, Compass, ArrowRight } from 'lucide-react';

export const DestinationDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [activeSection, setActiveSection] = useState('overview');

  const destination = {
    name: 'Meghalaya',
    subtitle: 'The Abode of Clouds & Living Root Bridges',
    location: 'Northeast India',
    rating: 4.9,
    reviewsCount: 520,
    bestTimeToVisit: 'Oct - Apr',
    temp: '18°C',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    overview: 'Meghalaya is renowned for its lush green hills, misty valleys, breathtaking waterfalls, and ancient living root bridges hand-woven by the Khasi tribe over centuries. Explore Cherrapunji, Dawki crystal river, and Mawlynnong village.',
    gallery: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
    ],
    thingsToDo: [
      'Trek to Double Decker Living Root Bridge',
      'Boating on Dawki Umngot Crystal River',
      'Caving in Mawsmai & Arwah Caves',
      'Visit Nohkalikai Falls in Cherrapunji',
    ],
    packages: [
      { id: 'pkg-meghalaya-7d', title: '7-Day Meghalaya Waterfall & Cave Trail', price: '₹12,499', rating: 4.9, agency: 'Himalayan Explorers' },
      { id: 'pkg-meghalaya-5d', title: '5-Day Shillong & Dawki Gateway', price: '₹8,999', rating: 4.8, agency: 'Globe Journeys' },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#FF4D6D]/20 selection:text-[#FF4D6D]">
      {/* Hero Header Banner */}
      <div className="relative w-full h-80 sm:h-96 bg-slate-900 overflow-hidden">
        <img src={destination.coverImage} alt={destination.name} className="w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        {/* Floating Top Nav */}
        <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-all cursor-pointer">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-all cursor-pointer">
              <Heart className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Hero Bottom Text */}
        <div className="absolute bottom-6 inset-x-4 sm:inset-x-8 z-10 text-white space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FF4D6D] text-xs font-bold">Top Destination</span>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-300">
              <Star className="w-3.5 h-3.5 fill-current" />
              {destination.rating} ({destination.reviewsCount} Reviews)
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{destination.name}</h1>
          <p className="text-xs sm:text-sm font-medium text-slate-200">{destination.subtitle}</p>
        </div>
      </div>

      {/* Main Content Details */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Quick Facts Bar */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-3xl bg-white border border-slate-100 shadow-2xs text-center">
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Best Time</p>
            <p className="text-xs sm:text-sm font-bold text-[#0F172A] flex items-center justify-center gap-1">
              <Calendar className="w-4 h-4 text-[#FF4D6D]" /> {destination.bestTimeToVisit}
            </p>
          </div>
          <div className="border-x border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400">Avg Temp</p>
            <p className="text-xs sm:text-sm font-bold text-[#0F172A] flex items-center justify-center gap-1">
              <Sun className="w-4 h-4 text-amber-500" /> {destination.temp}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Location</p>
            <p className="text-xs sm:text-sm font-bold text-[#0F172A] flex items-center justify-center gap-1">
              <MapPin className="w-4 h-4 text-[#6356E5]" /> {destination.location}
            </p>
          </div>
        </div>

        {/* Overview Description */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-2xs space-y-3">
          <h3 className="text-lg font-extrabold text-[#0F172A]">About {destination.name}</h3>
          <p className="text-xs sm:text-sm leading-relaxed font-medium text-slate-600">
            {destination.overview}
          </p>
        </div>

        {/* Things To Do */}
        <div className="space-y-3">
          <h3 className="text-lg font-extrabold text-[#0F172A]">Top Experiences & Things To Do</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {destination.thingsToDo.map((todo, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-[#FF4D6D] flex items-center justify-center font-bold text-xs shrink-0">
                  {idx + 1}
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{todo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tour Packages */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#0F172A]">Available Tour Packages</h3>
            <button onClick={() => navigate('/search/results?tab=packages')} className="text-xs font-bold text-[#FF4D6D] hover:underline">
              See all
            </button>
          </div>

          <div className="space-y-3">
            {destination.packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => navigate(`/package/${pkg.id}`)}
                className="p-4 rounded-3xl bg-white border border-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-extrabold text-[#0F172A]">{pkg.title}</h4>
                  <p className="text-xs font-medium text-slate-400">Organized by {pkg.agency} • ★ {pkg.rating}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm sm:text-base font-black text-[#FF4D6D]">{pkg.price}</span>
                  <button className="px-4 py-2 rounded-xl bg-[#FF4D6D] text-white text-xs font-bold flex items-center gap-1">
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Agencies Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#0F172A]">Recommended Agencies</h3>
            <button
              onClick={() => navigate(`/agencies?destination=${encodeURIComponent(destination.name.toLowerCase())}`)}
              className="text-xs font-bold text-[#6356E5] hover:underline cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div
            onClick={() => navigate('/agency/mountain-trails')}
            className="p-4 rounded-3xl bg-white border border-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#6356E5] font-black flex items-center justify-center text-xs">
                MT
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#0F172A]">Mountain Trails</h4>
                <p className="text-xs font-medium text-slate-400">Specialist in {destination.name} Tours • ★ 4.9</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#6356E5]">View Agency →</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DestinationDetailsPage;
