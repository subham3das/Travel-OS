import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, ThumbsUp, ThumbsDown, Smile, Sparkles, CheckCircle2, ImagePlus, ArrowRight } from 'lucide-react';
import { getTripById } from '../../data/trips';
import { addReputationPoints, getUserReputation } from '../../data/reputation';

export const TripReviewPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const trip = getTripById(tripId);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [overallRating, setOverallRating] = useState(5);
  const [agencyRating, setAgencyRating] = useState(5);
  const [hotelRating, setHotelRating] = useState(5);
  const [guideRating, setGuideRating] = useState(5);
  const [comment, setComment] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReputationPoints(20, 'review');
    triggerToast('🎉 +20 Reputation Earned for Review!');
    setStep(2);
  };

  const handleRecommendation = (recommendType: 'definitely' | 'maybe' | 'no') => {
    addReputationPoints(10, 'recommend');
    triggerToast('⭐ +10 Reputation Earned for Recommendation!');
    setStep(3);
  };

  const handleShareStory = () => {
    addReputationPoints(15, 'story');
    navigate('/community');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 15, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-black flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base sm:text-lg font-black text-[#0F172A]">
            Trip Review & Reputation
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Form Area */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between px-2">
          <div className={`flex items-center gap-1.5 text-xs font-extrabold ${step >= 1 ? 'text-[#6356E5]' : 'text-slate-400'}`}>
            <span className="w-6 h-6 rounded-full bg-[#6356E5] text-white flex items-center justify-center text-[10px]">1</span>
            <span>Write Review</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200" />
          <div className={`flex items-center gap-1.5 text-xs font-extrabold ${step >= 2 ? 'text-[#6356E5]' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#6356E5] text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span>Recommend</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200" />
          <div className={`flex items-center gap-1.5 text-xs font-extrabold ${step >= 3 ? 'text-[#6356E5]' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#6356E5] text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
            <span>Share Story</span>
          </div>
        </div>

        {/* STEP 1: REVIEW FORM */}
        {step === 1 && (
          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleReviewSubmit}
            className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-5"
          >
            <div className="text-center space-y-1">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black">
                Earn +20 Reputation
              </span>
              <h2 className="text-xl font-black text-[#0F172A]">How was your journey?</h2>
              <p className="text-xs font-semibold text-slate-500">{trip.title} • by {trip.agency.name}</p>
            </div>

            {/* Overall Rating */}
            <div className="text-center space-y-2 py-2">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Overall Experience</p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star className={`w-8 h-8 ${star <= overallRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Category Ratings */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#0F172A]">Agency Service</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} onClick={() => setAgencyRating(s)} className={`w-4 h-4 cursor-pointer ${s <= agencyRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#0F172A]">Hotel & Stay</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} onClick={() => setHotelRating(s)} className={`w-4 h-4 cursor-pointer ${s <= hotelRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#0F172A]">Tour Guide</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} onClick={() => setGuideRating(s)} className={`w-4 h-4 cursor-pointer ${s <= guideRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Comment Area */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-extrabold text-[#0F172A]">Your Detailed Experience</label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share genuine tips, itinerary highlights and feedback for fellow travelers..."
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
                required
              />
            </div>

            {/* Photo Upload Trigger */}
            <button
              type="button"
              onClick={() => alert('Photo uploader opened (+5 Reputation per photo!)')}
              className="w-full p-3 rounded-2xl border border-dashed border-purple-200 bg-purple-50/50 text-[#6356E5] text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
            >
              <ImagePlus className="w-4 h-4" />
              <span>Add Trip Photos (+5 Reputation)</span>
            </button>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-sm font-black shadow-lg shadow-[#6356E5]/25 cursor-pointer transition-all"
            >
              Submit Review (+20 Reputation)
            </button>
          </motion.form>
        )}

        {/* STEP 2: RECOMMENDATION STEP */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 border border-slate-100/90 shadow-2xs text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-purple-50 text-[#6356E5] text-xs font-black">
                Earn +10 Reputation
              </span>
              <h2 className="text-xl font-black text-[#0F172A] pt-2">
                Would you recommend {trip.agency.name}?
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Help other travelers choose verified & trustworthy travel agencies.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleRecommendation('definitely')}
                className="w-full p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-sm font-black flex items-center justify-center gap-2 border border-emerald-200 cursor-pointer transition-all"
              >
                <ThumbsUp className="w-5 h-5 text-emerald-600" />
                <span>👍 Definitely Recommend</span>
              </button>

              <button
                type="button"
                onClick={() => handleRecommendation('maybe')}
                className="w-full p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-sm font-black flex items-center justify-center gap-2 border border-amber-200 cursor-pointer transition-all"
              >
                <Smile className="w-5 h-5 text-amber-600" />
                <span>🙂 Maybe</span>
              </button>

              <button
                type="button"
                onClick={() => handleRecommendation('no')}
                className="w-full p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-sm font-black flex items-center justify-center gap-2 border border-rose-200 cursor-pointer transition-all"
              >
                <ThumbsDown className="w-5 h-5 text-rose-500" />
                <span>👎 Not Recommended</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: STORY PROMPT */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 border border-slate-100/90 shadow-2xs text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black">
                Earn +15 Reputation
              </span>
              <h2 className="text-xl font-black text-[#0F172A] pt-2">
                Share your travel story!
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Inspire thousands of travelers on ApnaTrip Community with your photos & memories.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleShareStory}
                className="w-full py-4 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-sm font-black shadow-lg shadow-[#6356E5]/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Share Story (+15 Reputation)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="w-full py-3 rounded-2xl text-slate-500 hover:text-slate-900 text-xs font-extrabold cursor-pointer transition-colors"
              >
                Skip & View Reputation Profile
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default TripReviewPage;
