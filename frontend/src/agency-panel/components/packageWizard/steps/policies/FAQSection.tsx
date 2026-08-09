import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';
import { FAQItem } from '../../../../data/policies';

export const FAQSection: React.FC = () => {
  const { draft, addFAQ, updateFAQ, removeFAQ } = usePackageWizard();

  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);

  const [questionInput, setQuestionInput] = useState('');
  const [answerInput, setAnswerInput] = useState('');

  const faqs = draft?.step7?.faqs || [];

  const handleSaveNew = () => {
    if (questionInput.trim() && answerInput.trim()) {
      addFAQ({ question: questionInput.trim(), answer: answerInput.trim() });
      setQuestionInput('');
      setAnswerInput('');
      setShowAddForm(false);
    }
  };

  const handleStartEdit = (faq: FAQItem) => {
    setEditingFaqId(faq.id);
    setQuestionInput(faq.question);
    setAnswerInput(faq.answer);
  };

  const handleSaveEdit = (id: string) => {
    if (questionInput.trim() && answerInput.trim()) {
      updateFAQ(id, { question: questionInput.trim(), answer: answerInput.trim() });
      setEditingFaqId(null);
      setQuestionInput('');
      setAnswerInput('');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none flex-1">
      <div className="space-y-0.5">
        <h3 className="text-base sm:text-lg font-black text-[#0F172A]">Frequently Asked Questions</h3>
        <p className="text-xs font-semibold text-slate-400">Manage common traveler questions</p>
      </div>

      <div className="space-y-2.5 pt-1">
        {faqs.map((faq) => {
          const isExpanded = expandedFaqId === faq.id;
          const isEditing = editingFaqId === faq.id;

          if (isEditing) {
            return (
              <div key={faq.id} className="p-4 rounded-2xl border border-[#583BE8] bg-purple-50/40 space-y-3">
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder="Question..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
                />
                <textarea
                  rows={2}
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  placeholder="Answer..."
                  className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#583BE8] resize-none"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingFaqId(null)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(faq.id)}
                    className="px-3 py-1.5 rounded-xl bg-[#583BE8] text-white text-xs font-black"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={faq.id}
              className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-purple-200 transition-all space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div
                  onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  className="flex items-center gap-2 flex-1 cursor-pointer min-w-0"
                >
                  <p className="text-xs font-black text-[#0F172A] truncate">{faq.question}</p>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#583BE8] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(faq)}
                    className="p-1 text-slate-400 hover:text-[#583BE8] rounded-md transition-colors cursor-pointer"
                    aria-label="Edit FAQ"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFAQ(faq.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                    aria-label="Delete FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <p className="text-xs font-semibold text-slate-600 pt-1 border-t border-slate-100 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}

        {/* Add FAQ Form / Button */}
        {showAddForm ? (
          <div className="p-4 rounded-2xl border border-[#583BE8] bg-purple-50/40 space-y-3">
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder="Question e.g. Is network available?"
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
              autoFocus
            />
            <textarea
              rows={2}
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder="Answer details..."
              className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#583BE8] resize-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNew}
                className="px-4 py-1.5 rounded-xl bg-[#583BE8] text-white text-xs font-black cursor-pointer shadow-2xs"
              >
                Add FAQ
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setQuestionInput('');
              setAnswerInput('');
              setShowAddForm(true);
            }}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-[#583BE8]/50 hover:border-[#583BE8] bg-purple-50/40 hover:bg-purple-50 text-[#583BE8] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add FAQ</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FAQSection;
