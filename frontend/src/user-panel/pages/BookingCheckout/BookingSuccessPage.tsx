import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, Download, ArrowRight, Home } from 'lucide-react';

export const BookingSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = useParams<{ bookingId?: string }>();

  const stateData = location.state || {};
  const displayBookingId = bookingId || stateData.bookingId || 'BK-782910';
  const paymentId = stateData.paymentId || 'pay_9812479128';
  const pkg = stateData.pkg || {
    title: '7-Day Meghalaya Waterfall & Cave Trail',
    agencyName: 'Himalayan Explorers',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    duration: '7 Days / 6 Nights',
  };
  const totalAmount = stateData.totalAmount || 25495;

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-slate-100 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Booking Confirmed!
          </h1>
          <p className="text-xs font-bold text-slate-400">
            Booking ID: <span className="text-[#583BE8] font-extrabold">{displayBookingId}</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={pkg.coverImage}
              alt={pkg.title}
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A] line-clamp-1">{pkg.title}</h3>
              <p className="text-[11px] font-semibold text-slate-500">by {pkg.agencyName}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 space-y-1.5 text-xs font-semibold text-slate-600">
            <div className="flex justify-between">
              <span>Dates:</span>
              <span className="font-extrabold text-[#0F172A]">12 – 18 May, 2026</span>
            </div>
            <div className="flex justify-between">
              <span>Payment ID:</span>
              <span className="font-extrabold text-slate-700">{paymentId}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200/40 text-sm font-black text-[#0F172A]">
              <span>Total Paid:</span>
              <span className="text-[#583BE8]">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => navigate('/my-trips')}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#583BE8] hover:bg-[#482bd4] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Go to My Trips</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/home')}
            className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
