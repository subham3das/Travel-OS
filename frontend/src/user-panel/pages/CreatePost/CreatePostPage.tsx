import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Send } from 'lucide-react';

import { ContentTypeSelector, PostType } from './components/ContentTypeSelector';
import { StoryForm } from './components/StoryForm';
import { ExperienceForm } from './components/ExperienceForm';
import { TipForm } from './components/TipForm';
import { QuestionForm } from './components/QuestionForm';
import { PublishedPreview } from './components/PublishedPreview';

import { addNewPost, CommunityPost } from '../../data/posts';
import { addTravelStory } from '../../data/stories';

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state || {};

  const [postType, setPostType] = useState<PostType>('story');

  const [storyState, setStoryState] = useState<{
    videoUrl: string | null;
    durationSeconds: number;
    title: string;
    description: string;
    destinationName: string;
    agencyName: string;
    tags: string[];
    visibility: CommunityPost['visibility'];
  }>({
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4',
    durationSeconds: 45,
    title: prefill.title || 'Our Magical Meghalaya Adventure 🏔️✨',
    description: prefill.caption || 'Exploring Cherrapunji waterfalls and root bridges!',
    destinationName: prefill.destinationName || 'Meghalaya',
    agencyName: prefill.agencyName || 'Wander North Travel',
    tags: ['Meghalaya', 'Adventure', 'Nature'],
    visibility: 'public',
  });

  const [expState, setExpState] = useState<{
    title: string;
    description: string;
    rating: number;
    destinationName: string;
    agencyName: string;
    images: string[];
    tags: string[];
    visibility: CommunityPost['visibility'];
  }>({
    title: prefill.title || 'Unforgettable Week in Shillong & Dawki',
    description: prefill.caption || 'Cleanest river, living root bridges, and local culture.',
    rating: 5,
    destinationName: prefill.destinationName || 'Meghalaya',
    agencyName: prefill.agencyName || 'Wander North Travel',
    images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop'],
    tags: ['Meghalaya', 'TravelExperience'],
    visibility: 'public',
  });

  const [tipState, setTipState] = useState<{
    title: string;
    tipText: string;
    destinationName: string;
    category: string;
    images: string[];
    tags: string[];
    visibility: CommunityPost['visibility'];
  }>({
    title: 'Essential Monsoon Packing Tip for Meghalaya',
    tipText: 'Always pack waterproof dry bags and quick-dry shoes for waterfall treks!',
    destinationName: prefill.destinationName || 'Meghalaya',
    category: 'Packing',
    images: [],
    tags: ['TravelTips', 'Packing'],
    visibility: 'public',
  });

  const [questionState, setQuestionState] = useState<{
    questionTitle: string;
    description: string;
    destinationName: string;
    category: string;
    images: string[];
    tags: string[];
    visibility: CommunityPost['visibility'];
  }>({
    questionTitle: 'Best time to visit Cherrapunji for double decker bridge?',
    description: 'We are planning a trip with family. Are the steps manageable?',
    destinationName: prefill.destinationName || 'Meghalaya',
    category: 'Itinerary Review',
    images: [],
    tags: ['CommunityHelp', 'Questions'],
    visibility: 'public',
  });

  // Publishing State
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishedData, setPublishedData] = useState<any>(null);

  // Dynamic Validation
  const isValid = () => {
    if (postType === 'story') {
      return storyState.videoUrl !== null && storyState.title.trim().length > 0 && storyState.destinationName.trim().length > 0;
    }
    if (postType === 'experience') {
      return expState.title.trim().length > 0 && expState.description.trim().length > 0;
    }
    if (postType === 'tip') {
      return tipState.title.trim().length > 0 && tipState.tipText.trim().length > 0;
    }
    if (postType === 'question') {
      return questionState.questionTitle.trim().length > 0 && questionState.description.trim().length > 0;
    }
    return false;
  };

  const handlePublish = (isDraft = false) => {
    if (!isValid() && !isDraft) return;

    setIsPublishing(true);

    setTimeout(() => {
      let createdObj: any = null;

      if (postType === 'story') {
        createdObj = {
          type: 'story',
          title: storyState.title,
          caption: storyState.description,
          destinationName: storyState.destinationName,
          agencyName: storyState.agencyName,
          videoUrl: storyState.videoUrl || '',
          tags: storyState.tags,
        };
        addTravelStory({
          userId: 'user-001',
          userName: 'Subham Das',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
          title: storyState.title.trim(),
          description: storyState.description.trim() || undefined,
          destinationName: storyState.destinationName.trim(),
          agencyName: storyState.agencyName.trim() || undefined,
          videoUrl: storyState.videoUrl || '',
          thumbnailUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
          durationSeconds: storyState.durationSeconds,
          tags: storyState.tags,
        });
      } else if (postType === 'experience') {
        createdObj = {
          type: 'experience',
          title: expState.title,
          caption: expState.description,
          destinationName: expState.destinationName,
          agencyName: expState.agencyName,
          images: expState.images,
          tags: expState.tags,
          rating: expState.rating,
        };
        addNewPost({
          userId: 'user-001',
          userName: 'Subham Das',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
          type: 'experience',
          title: expState.title,
          caption: expState.description,
          destinationName: expState.destinationName,
          agencyName: expState.agencyName,
          images: expState.images,
          tags: expState.tags,
          visibility: isDraft ? 'draft' : expState.visibility,
          rating: expState.rating,
        });
      } else if (postType === 'tip') {
        createdObj = {
          type: 'tip',
          title: tipState.title,
          caption: tipState.tipText,
          destinationName: tipState.destinationName,
          images: tipState.images,
          tags: tipState.tags,
        };
        addNewPost({
          userId: 'user-001',
          userName: 'Subham Das',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
          type: 'tip',
          title: tipState.title,
          caption: tipState.tipText,
          destinationName: tipState.destinationName,
          images: tipState.images,
          tags: tipState.tags,
          visibility: isDraft ? 'draft' : tipState.visibility,
        });
      } else if (postType === 'question') {
        createdObj = {
          type: 'question',
          title: questionState.questionTitle,
          caption: questionState.description,
          destinationName: questionState.destinationName,
          images: questionState.images,
          tags: questionState.tags,
        };
        addNewPost({
          userId: 'user-001',
          userName: 'Subham Das',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
          type: 'question',
          title: questionState.questionTitle,
          caption: questionState.description,
          destinationName: questionState.destinationName,
          images: questionState.images,
          tags: questionState.tags,
          visibility: isDraft ? 'draft' : questionState.visibility,
        });
      }

      setPublishedData(createdObj);
      setIsPublishing(false);
      setIsPublished(true);
    }, 1200);
  };

  const handleReset = () => {
    setIsPublished(false);
    setPublishedData(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5]">
      {/* Fixed Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/community')}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
            {isPublished ? 'Post Published' : 'Create Post'}
          </h1>

          {!isPublished ? (
            <button
              type="button"
              disabled={!isValid() || isPublishing}
              onClick={() => handlePublish(false)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md flex items-center gap-1.5 ${
                isValid() && !isPublishing
                  ? 'bg-[#6356E5] text-white hover:bg-[#5245d6] shadow-[#6356E5]/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              {isPublishing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish</span>
              )}
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {isPublished && publishedData ? (
          <PublishedPreview postData={publishedData} onReset={handleReset} />
        ) : (
          <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-5">
            {/* Top Fixed Post Type Selector */}
            <div className="space-y-1">
              <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                Select Content Type
              </label>
              <ContentTypeSelector selectedType={postType} onSelect={(t) => setPostType(t)} />
            </div>

            {/* Dynamic Form Content with Framer Motion AnimatePresence */}
            <div className="pt-2 border-t border-slate-100 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={postType}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  {postType === 'story' && (
                    <StoryForm
                      state={storyState}
                      onChange={(upd) => setStoryState((prev) => ({ ...prev, ...upd }))}
                    />
                  )}

                  {postType === 'experience' && (
                    <ExperienceForm
                      state={expState}
                      onChange={(upd) => setExpState((prev) => ({ ...prev, ...upd }))}
                    />
                  )}

                  {postType === 'tip' && (
                    <TipForm
                      state={tipState}
                      onChange={(upd) => setTipState((prev) => ({ ...prev, ...upd }))}
                    />
                  )}

                  {postType === 'question' && (
                    <QuestionForm
                      state={questionState}
                      onChange={(upd) => setQuestionState((prev) => ({ ...prev, ...upd }))}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={isPublishing}
                onClick={() => handlePublish(true)}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                disabled={!isValid() || isPublishing}
                onClick={() => handlePublish(false)}
                className={`px-6 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                  isValid() && !isPublishing
                    ? 'bg-[#6356E5] hover:bg-[#5245d6] text-white shadow-md shadow-[#6356E5]/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isPublishing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Publish Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreatePostPage;
