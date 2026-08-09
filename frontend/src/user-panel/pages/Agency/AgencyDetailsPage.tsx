import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Star, MapPin, Calendar, Briefcase, Languages, Phone, Mail, Globe, ArrowRight } from 'lucide-react';

export const AgencyDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const agency = {
    name: 'Himalayan Explorers',
    tagline: 'Premier Adventure & Trekking Operators in Northeast & Himalayas',
    isVerified: true,
    rating: 4.9,
    reviewsCount: 487,
    location: 'Manali, Himachal Pradesh',
    yearsExperience: '8+ Years',
    tripsCompleted: '2,350+',
    languages: 'English, Hindi, Pahari, Assamese',
    phone: '+91 98765 43210',
    email: 'contact@himalayanexplorers.in',
    website: 'https://himalayanexplorers.in',
    coverImage: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=1200&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=200&auto=format&fit=crop',
    about: 'Himalayan Explorers is a government-certified travel agency specializing in high-altitude trekking, motorcycling expeditions, cultural tours, and customized family vacations across Himachal, Ladakh, Meghalaya, and Sikkim.',
    packages: [
      { id: 'pkg-meghalaya-7d', title: '7-Day Meghalaya Waterfall & Cave Trail', price: '₹12,499', duration: '7 Days / 6 Nights', rating: 4.9 },
      { id: 'pkg-spiti-10d', title: '10-Day Spiti Valley Ultimate Motorbike Circuit', price: '₹18,500', duration: '10 Days / 9 Nights', rating: 4.9 },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5]">
      {/* Cover Header */}
      <div className="relative w-full h-72 sm:h-80 bg-slate-900 overflow-hidden">
        <img src={agency.coverImage} alt={agency.name} className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 sm:left-8 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Main Body */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 -mt-16 relative z-10 space-y-6 pb-20">
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-slate-100 shrink-0">
                <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">{agency.name}</h1>
                  {agency.isVerified && <CheckCircle2 className="w-5 h-5 text-[#6356E5]" />}
                </div>
                <p className="text-xs font-semibold text-slate-500">{agency.tagline}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{agency.rating}</span>
                  <span className="text-slate-400">({agency.reviewsCount} Reviews)</span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#6356E5]" /> {agency.location}</span>
                </div>
              </div>
            </div>

            <button className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs font-bold shadow-md shadow-[#6356E5]/20 transition-all cursor-pointer">
              Contact Agency
            </button>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center text-xs font-bold text-slate-700">
            <div>
              <p className="text-[10px] text-slate-400 font-semibold">Experience</p>
              <p>{agency.yearsExperience}</p>
            </div>
            <div className="border-x border-slate-100">
              <p className="text-[10px] text-slate-400 font-semibold">Trips Done</p>
              <p>{agency.tripsCompleted}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold">Languages</p>
              <p>{agency.languages}</p>
            </div>
          </div>
        </div>

        {/* About Agency */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-2xs space-y-2">
          <h3 className="text-base font-extrabold text-[#0F172A]">About Agency</h3>
          <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">{agency.about}</p>
        </div>

        {/* Offered Packages */}
        <div className="space-y-3">
          <h3 className="text-lg font-extrabold text-[#0F172A]">Tour Packages Offered</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {agency.packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => navigate(`/package/${pkg.id}`)}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-[#6356E5] px-2.5 py-0.5 rounded-full bg-purple-50">{pkg.duration}</span>
                  <h4 className="text-base font-extrabold text-[#0F172A] pt-1">{pkg.title}</h4>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-lg font-black text-[#6356E5]">{pkg.price}</span>
                  <button className="px-4 py-2 rounded-xl bg-[#6356E5] text-white text-xs font-bold flex items-center gap-1">
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgencyDetailsPage;
