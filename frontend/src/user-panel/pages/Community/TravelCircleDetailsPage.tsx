import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, MessageCircle, ShieldCheck } from 'lucide-react';

export const TravelCircleDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const circle = {
    name: 'Northeast Explorers Club',
    membersCount: '1,420 members',
    description: 'A community group for travelers planning backpacking trips, road trips, and treks across Assam, Meghalaya, Arunachal, Nagaland, and Mizoram.',
    cover: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop',
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans">
      <div className="relative w-full h-56 bg-slate-900">
        <img src={circle.cover} alt={circle.name} className="w-full h-full object-cover opacity-80" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 rounded-full bg-white/20 text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 -mt-12 relative z-10 space-y-6 pb-20">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-md space-y-3">
          <h2 className="text-xl font-black text-[#0F172A]">{circle.name}</h2>
          <p className="text-xs font-semibold text-slate-400 flex items-center gap-1"><Users className="w-4 h-4 text-[#FF4D6D]" /> {circle.membersCount}</p>
          <p className="text-xs font-medium text-slate-600 leading-relaxed">{circle.description}</p>
          <button className="w-full py-3 rounded-2xl bg-[#FF4D6D] text-white text-xs font-extrabold shadow-md shadow-[#FF4D6D]/20">
            Join Travel Circle
          </button>
        </div>
      </main>
    </div>
  );
};

export default TravelCircleDetailsPage;
