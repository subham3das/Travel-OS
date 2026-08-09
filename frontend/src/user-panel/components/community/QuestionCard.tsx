import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export interface CommunityQuestion {
  id: string;
  authorName: string;
  authorAvatar: string;
  timeAgo: string;
  question: string;
  answersCount: number;
}

interface QuestionCardProps {
  question: CommunityQuestion;
  onAnswerClick?: (question: CommunityQuestion) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswerClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={() => onAnswerClick && onAnswerClick(question)}
      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between shrink-0 w-64 sm:w-72 cursor-pointer group"
    >
      <div className="space-y-3">
        {/* Author Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-200">
            <img
              src={question.authorAvatar}
              alt={question.authorName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="overflow-hidden">
            <h5 className="text-xs font-bold text-[#0F172A] tracking-tight leading-none truncate">
              {question.authorName}
            </h5>
            <p className="text-[10px] font-medium text-slate-400 leading-none mt-0.5">
              {question.timeAgo}
            </p>
          </div>
        </div>

        {/* Question Title */}
        <h4 className="text-sm font-bold text-[#0F172A] tracking-tight line-clamp-2 leading-snug">
          {question.question}
        </h4>
      </div>

      {/* Footer: Answers count + icon */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
        <span className="text-slate-500">{question.answersCount} answers</span>
        <div className="w-7 h-7 rounded-full bg-rose-50 text-[#FF4D6D] flex items-center justify-center group-hover:scale-105 transition-transform">
          <MessageSquare className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  );
};
